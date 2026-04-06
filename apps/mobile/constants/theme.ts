//   Backgrounds    #000000 → #0A0A0A → #111111 → #1A1A1A
//   Borders        #1E1E1E / #2A2A2A / #333333
//   Text           #FFFFFF / #A0A0A0 / #666666 / #444444
//   Brand blue     #1348DC  ← the ONLY accent on the site
//   Status         #3DD68C (success) | #F5A623 (warning) | #FF4D4D (error)

export const Colors = {
  // ── Primary (Brand Blue) ──────────────────────────────────────────────────
  primary: "#1348DC", // brand blue — CTAs, links, active states
  primaryDark: "#0F35A8", // pressed / deeper shade
  primaryLight: "#3A6AFF", // hover / lighter shade

  // ── Accent Colors ─────────────────────────────────────────────────────────
  //  only status colors break from black/blue
  blue: "#1348DC", // same as primary
  blueDark: "#0B2570", // deep navy
  amber: "#F5A623", // warning / terminal yellow
  amberDark: "#B47A10",
  amberLight: "#D99220",
  emerald: "#3DD68C", // success / git-added
  violet: "#A855F7", // was pink — #A855F7 is violet
  purple: "#7C3AED", // violet (rare on site)
  error: "#FF4D4D", // error red
  errorDark: "#CC2222",

  // ── Backgrounds ───────────────────────────────────────────────────────────
  background: "#000000", // true page background
  backgroundLight: "#0A0A0A", // subtle section fill
  surface: "#111111", // cards, panels, sidebars
  surfaceSecondary: "#1A1A1A", // elevated surfaces, modals

  // ── Tints (icon fills, tag backgrounds) ──────────────────────────────────
  // named after their actual color, not the role they replaced
  blueTintDim: "#1348DC18", // was roseTint  — it's blue at 9%
  blueTintFaint: "#1348DC0D", // was roseLight — it's blue at 5%
  violetTint: "#7C3AED18", // was pinkTint  — it's violet at 9%
  blueTint: "#1348DC26", // blue at 15%
  blueLight: "#1348DC0F", // blue at 6%
  amberTint: "#F5A62326", // amber at 15%
  amberTintLight: "#F5A6230D", // was yellowLight — it's amber at 5%
  emeraldTint: "#3DD68C22", // emerald at 13%

  // ── Text ──────────────────────────────────────────────────────────────────
  text: "#FFFFFF", // headings / primary body
  textDark: "#FFFFFF",
  textMedium: "#E0E0E0",
  textBody: "#C0C0C0",
  textMuted: "#A0A0A0", // captions, metadata
  textSecondary: "#808080",
  textTertiary: "#666666", // hints, timestamps
  textGray: "#888888",
  textGrayDark: "#AAAAAA",
  textGrayMedium: "#BBBBBB",
  placeholder: "#555555",

  // ── Borders ───────────────────────────────────────────────────────────────
  border: "#1E1E1E", // default hairline divider
  borderLight: "#222222",
  borderMedium: "#2A2A2A",
  borderGray: "#333333",
  borderError: "#FF4D4D22",
  borderRed: "#FF4D4D33", // was borderRose — it's red
  borderBlue: "#1348DC33", // focused input ring
  borderAmber: "#F5A62333",

  // ── Special ───────────────────────────────────────────────────────────────
  white: "#FFFFFF",
  black: "#000000",
  overlay: "rgba(0, 0, 0, 0.75)",
};

// ── Spacing ───────────────────────────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ── Border Radius ─────────────────────────────────────────────────────────────
// never pill-shaped outside badges
export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

// ── Font Size ─────────────────────────────────────────────────────────────────
export const fontSize = {
  xs: 10,
  sm: 11,
  base: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  huge: 28,
  massive: 36,
};

// ── Font Weight ───────────────────────────────────────────────────────────────
// heavy weights are rare
export const fontWeight = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "bold" as const,
};

// ── Tab Bar ───────────────────────────────────────────────────────────────────
// Active = brand blue | inactive = #666 | bg = true black
export const tabBarTheme = {
  activeTintColor: Colors.primary,
  inactiveTintColor: Colors.textTertiary,
  backgroundColor: Colors.white,
  borderColor: Colors.border,
};

// ── Header ────────────────────────────────────────────────────────────────────
//no coloured header bar
export const headerTheme = {
  backgroundColor: Colors.background,
  tintColor: Colors.white,
};
