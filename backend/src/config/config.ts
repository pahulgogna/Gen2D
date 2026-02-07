const Env = {
  MongoDB_URL: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/Gen2D",
  PORT: Number(process.env.PORT) || 3000,
  SaltRounds: Number(process.env.SALT_ROUNDS) || 10,
  JwtSecret: process.env.JWT_SECRET || "super_secret_jwt",
  GoogleApiKey: process.env.GOOGLE_API_KEY || "",
  GoogleGeminiModel: process.env.GOOGLE_GEMINI_MODEL || "gemini-3-flash-preview"
};

export { Env };
