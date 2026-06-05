import serverless from 'serverless-http';
import app from '../../app.js';

// Envolver la aplicación Express para que funcione como una función Serverless en Netlify
export const handler = serverless(app);
