import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1).default("postgresql://postgres:postgres@localhost:5432/aegis"),
  BILLING_PROVIDER: z.enum(["stripe", "whop"]).default("whop"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  WHOP_API_KEY: z.string().optional(),
  WHOP_COMPANY_ID: z.string().optional(),
  WHOP_WEBHOOK_SECRET: z.string().optional(),
  APP_URL: z.string().default("http://localhost:3000")
});

export const env = envSchema.parse(process.env);
