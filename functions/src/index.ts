import * as functions from 'firebase-functions';
import * as cors from "cors";

const corsHandler = cors({ origin: true });
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    const snapshot = await admin.database().ref('/messages').push({ original: original });
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref.toString());
});

exports.getMessages = functions.https.onRequest(async (req, res) => {
  const items: any[] = [];
  await admin.database().ref("/messages").once('value').then(function(snapshot) {
    return snapshot.forEach(function (childSnapshot) {
      items.push(
          childSnapshot.val()
      );
    });
  });

  corsHandler(req, res, () => {
    res.status(200).send(items);
  });
});
