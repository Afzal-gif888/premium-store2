import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(__dirname, '..', 'service-account.json');

if (!admin.apps.length) {
    try {
        let credential;

        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            // Priority 1: Environment Variable (Railway/Production)
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            credential = admin.credential.cert(serviceAccount);
            console.log('[INIT] Firebase Admin initialized with service account from ENV');
        } else if (fs.existsSync(serviceAccountPath)) {
            // Priority 2: Local File (Development)
            const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
            credential = admin.credential.cert(serviceAccount);
            console.log('[INIT] Firebase Admin initialized with LOCAL service-account.json');
        } else {
            // Priority 3: Default Credentials (GCP/CLI)
            credential = admin.credential.applicationDefault();
            console.log('[INIT] Firebase Admin using application default credentials');
        }

        const projectId = (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID.trim()) || 'premium-store-e14ca';
        const bucketName = `${projectId}.appspot.com`;

        admin.initializeApp({
            credential,
            projectId: projectId,
            storageBucket: bucketName
        });
    } catch (error) {
        console.error('[INIT] Firebase Admin initialization failed:', error.message);
    }
}

let db, auth, storage;
try {
    db = admin.firestore();
    db.settings({ ignoreUndefinedProperties: true });
    auth = admin.auth();
    storage = admin.storage();
    console.log('[INIT] Firebase Services linked successfully');
} catch (error) {
    console.error('[CRITICAL] Failed to link Firebase services:', error.message);
    // We don't exit here to allow server to start and report the error on /health
}

export { admin, db, auth, storage };


