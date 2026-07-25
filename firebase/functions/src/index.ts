import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Placeholder for future functions
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Vision Academy Backend!");
});
