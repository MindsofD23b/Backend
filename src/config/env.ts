import dotenv from "dotenv";

dotenv.config();

const required = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Env var ${name} is missing`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  databaseUrl: required(process.env.DATABASE_URL, "DATABASE_URL"),
  jwtSecret: required(process.env.JWT_SECRET, "JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",

  smtpHost: required(process.env.SMTP_HOST, "SMTP_HOST"),
  smtpPort: Number(required(process.env.SMTP_PORT, "SMTP_PORT")),
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpUser: required(process.env.SMTP_USER, "SMTP_USER"),
  smtpPass: required(process.env.SMTP_PASS, "SMTP_PASS"),
  smtpFrom: required(process.env.SMTP_FROM, "SMTP_FROM"),

  appBaseUrl: required(process.env.APP_BASE_URL, "APP_BASE_URL"),
  apiBaseUrl: required(process.env.API_BASE_URL, "API_BASE_URL")
};
