import { z } from 'zod';

const EnvSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
	DB_HOST: z.string().min(1),
	DB_PORT: z.string().regex(/^\d+$/),
	DB_USER: z.string().min(1),
	DB_PASSWORD: z.string().min(1),
	DB_NAME: z.string().min(1),
	ALLOWED_ORIGINS: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

export const env = EnvSchema.parse(process.env);