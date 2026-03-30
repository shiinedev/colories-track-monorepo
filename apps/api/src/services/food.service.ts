import { log } from "evlog";
import {
  FoodAnalysisResult,
  FoodAnalysisSchema,
  SaveFoodEntryResult,
} from "@colorie-track/schemas/foodSchema";
import sharp from "sharp";
import crypto from "crypto";
import { env } from "@/config/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Config } from "@/config/r2";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import FoodModel, { IFoodModel } from "@/models/food.model";
import type { ImageType, ScanFoodReturn, IFood } from "@/types/food.types";

export class FoodService implements IFood {
  private openai = new OpenAI({
    apiKey: env.openApiKey,
  });

  async scanFood<T extends ImageType>(
    file: Buffer,
    userId: string,
    type: T,
  ): Promise<ScanFoodReturn<T>> {
    try {
      // Optimize the image before uploading
      const optimizedBuffer = await this.optimizeImage(file);
      log.info({
        message: `Optimized image size: ${optimizedBuffer.length} bytes`,
      });

      // Upload the optimized image to R2
      const { url, key } = await this.uploadToR2(optimizedBuffer);
      log.info({ message: `Uploaded image to R2: ${key}` });

      // Analyze the food using the uploaded image to opena ai
      const result = await this.analyzeFood(url);
      log.info({ message: `Analyzed food: ${result.foodName}` });

      log.info({ message: `userId: ${userId}` });

      // save to databse
      // filter by type
      if (type === "base64") {
        const imageBase64 = `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;

        return {
          ...result,
          imageBase64,
          imageUrl: url,
          storageKey: key,
        } as ScanFoodReturn<T>;
      }
      const food: IFoodModel = await FoodModel.create({
        userId,
        foodname: result.foodName,
        calories: result.calories,
        fat: result.fat,
        protein: result.protein,
        carbs: result.carbs,
        mealType: result.mealType,
        timestamp: new Date(),
        imageURl: url,
        storageKey: key,
      });

      log.info({ message: `Saved food to database: ${food._id}` });

      return food as ScanFoodReturn<T>;
    } catch (error) {
      log.error({ message: `Failed to scan food: ${error}` });
      throw error;
    }
  }

  async optimizeImage(buffer: Buffer): Promise<Buffer> {
    const originalSize = buffer.length;

    const optimizedBuffer = await sharp(buffer)
      .rotate()
      .resize({
        width: 1024,
        height: 1024,
        fit: "fill",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 85,
        mozjpeg: true,
      })
      .toBuffer();

    const optimizedSize = optimizedBuffer.length;

    log.info({
      message: `Optimized image size: ${optimizedSize} bytes (original: ${originalSize} bytes)`,
    });

    return optimizedBuffer;
  }

  async uploadToR2(buffer: Buffer): Promise<{ url: string; key: string }> {
    const fileName = `${crypto.randomBytes(16).toString("hex")}.jpg`;

    const key = `${env.r2.BUCKET_NAME}/${fileName}`;
    log.info({
      message: `BUCKET_NAME : ${env.r2.BUCKET_NAME}`,
    });

    try {
      const command = new PutObjectCommand({
        Bucket: r2Config.bucket,
        Key: key,
        Body: buffer,
        ContentType: "image/jpeg",
      });

      const result = await r2Config.client.send(command);

      log.info({
        message: `Uploaded image to R2: ${key}`,
        result,
      });

      return {
        url: `${r2Config.publicUrl}/${key}`,
        key,
      };
    } catch (error) {
      log.error({
        message: `Failed to upload image to R2: ${key}`,
        error,
      });
      throw error;
    }
  }

  async analyzeFood(imageUrl: string): Promise<FoodAnalysisResult> {
    try {
      const completion = await this.openai.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            type: "text",
            content: `analyzeFood`,
          },
          {
            role: "user",
            type: "image_url",
            content: imageUrl,
          },
        ],
        response_format: zodResponseFormat(FoodAnalysisSchema, "foodAnalys"),
        max_completion_tokens: 300,
      });

      const messages = completion.choices[0]?.message;

      if (messages?.parsed) {
        return {
          foodName: messages.parsed.foodName,
          calories: messages.parsed.calories,
          fat: messages.parsed.fat,
          protein: messages.parsed.protein,
          carbs: messages.parsed.carbs,
          mealType: messages.parsed.mealType,
        };
      }

      if (messages?.refusal) {
        throw new Error(
          `open ai refusal to analyze the food: ${messages.refusal}`,
        );
      }

      throw new Error(`Failed to parse food analysis result for ${imageUrl}`);
    } catch (error) {
      log.error({
        message: `Failed to analyze food: ${imageUrl}`,
        error,
      });
      throw error;
    }
  }

  async saveFoodEntry(
    input: SaveFoodEntryResult,
    userId: string,
  ): Promise<IFoodModel> {
    const { calories, fat, protein, carbs, mealType, storageKey } = input;

    try {
      const foodEntry = await FoodModel.create({
        userId,
        calories,
        fat,
        protein,
        carbs,
        mealType,
        storageKey,
      });
      return foodEntry;
    } catch (error) {
      log.error({
        message: `Failed to save food entry`,
        error,
      });
      throw error;
    }
  }
}

export const foodService = new FoodService();
