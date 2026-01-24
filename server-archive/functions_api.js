// Archive of server/functions/api.js
import serverless from 'serverless-http';
import app from '../server.js';

const handler = serverless(app);

export { handler };
