const functions = require('firebase-functions');
// const gcs = require('@google-cloud/storage')();
// const os = require('os');
// const path = require('path');
// const spawn = require('child-process-promise').spawn;

//Create and Deploy Your First Cloud Functions
//https://firebase.google.com/docs/functions/write-firebase-functions

exports.postCreated = functions.firestore
  .document('posts/{id}')
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = snap.data();

    console.log(snap.data());
    console.log(context);

    // access a particular field as you would any JS property
    const name = newValue.name;

    // perform desired operations ...
  });
