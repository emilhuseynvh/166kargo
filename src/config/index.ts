import { config } from "dotenv";
import { join } from "path";

const envPath = join(__dirname, './../../.env');

config({ path: envPath });

export default {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    uploadUrl: process.env.UPLOAD_URL,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
};