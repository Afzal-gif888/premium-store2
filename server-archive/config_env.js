import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPaths = [
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', '..', '.env')
];

envPaths.forEach(envPath => {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        console.log(`[INIT] Loaded env from ${envPath}`);
    }
});

// Immediately validate critical vars to fail fast if needed
if (!process.env.PORT) process.env.PORT = 5000;
