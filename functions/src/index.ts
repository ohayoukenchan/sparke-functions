import * as functions from 'firebase-functions';
import * as cors from "cors";

const corsHandler = cors({ origin: true });
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();


// データベースの参照を作成
var fireStore = admin.firestore()

exports.getBooks = functions.https.onRequest((request, response) => {

  const booksRef = fireStore.collection('books')
  const items: any[] = [];
  corsHandler(request, response, () => {
    booksRef.get()
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          items.push(
            childSnapshot.data()
          );
       });
        response.status(200).send(items);
     })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  })
})

exports.addBooks = functions.https.onRequest((request, response) => {
  // 動作確認のため適当なデータをデータベースに保存
  const booksRef = fireStore.collection('books');
  booksRef.doc('9784334751081').set({
    isbn: '9784334751081',
    price: '770',
    publisher: '光文社',
    title: '永遠平和のために/啓蒙とは何か 他3編 (光文社古典新訳文庫) (日本語) 文庫'
  })

  corsHandler(request, response, () => {
    const bookRef = fireStore.collection('books').doc('9784334751081')
    bookRef.get()
      .then(doc => {
        if (!doc.exists) {
          response.send('No such document!')
        } else {
          response.send(doc.data())
        }
      })
      .catch(err => {
        response.send('not found')
      })
    })
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  // 動作確認のため適当なデータをデータベースに保存
  var citiesRef = fireStore.collection('cities');
  citiesRef.doc('SF').set({
    name: 'San Francisco', state: 'CA', country: 'USA',
    capital: false, population: 860000
  })

  var cityRef = fireStore.collection('cities').doc('SF')
  cityRef.get()
    .then(doc => {
      if (!doc.exists) {
        response.send('No such document!')
      } else {
        response.send(doc.data())
      }
    })
    .catch(err => {
      response.send('not found')
    })
})

exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await admin.database().ref('/messages').push({ original: original });
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  res.redirect(303, snapshot.ref.toString());
});


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

  exports.getPhrases = functions.https.onRequest(async (req, res) => {
    const items: any[] = [];
    await admin.database().ref("/phrases").once('value').then(function(snapshot) {
      return snapshot.forEach(function (childSnapshot) {
        items.push(
            childSnapshot.val()
        );
      });
    });

    corsHandler(req, res, () => {
      res.status(200).send(items);
    });
  })

  corsHandler(req, res, () => {
    res.status(200).send(items);
  });
});

exports.getUser = functions.https.onRequest(async (req, res) => {
  var docRef = fireStore.collection("users").doc("IX4QLuEBcdtK0ABo60KE");

  corsHandler(req, res, () => {
    docRef.get().then(function(doc) {
      if (doc.exists) {
        //console.log("Document data:", doc.data());
        //return doc.data()
          res.send(doc.data())
      } else {
        // doc.data() will be undefined in this case
          res.send("No such document!");
      }
    }).catch(function(error) {
      res.send(error);
    });
  })
})
