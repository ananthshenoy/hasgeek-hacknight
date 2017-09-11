import firebase from 'firebase';
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCD4Cb2sTKReAha33vKOVKnFXwD7YLWw9c",
    authDomain: "findyourbuddy-50e34.firebaseapp.com",
    databaseURL: "https://findyourbuddy-50e34.firebaseio.com",
    projectId: "findyourbuddy-50e34",
    storageBucket: "findyourbuddy-50e34.appspot.com",
    messagingSenderId: "1029195243573"
  };
firebase.initializeApp(config);

// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();

messaging.requestPermission()
.then(function() {
  console.log('Notification permission granted.');
  // TODO(developer): Retrieve an Instance ID token for use with FCM.
  // ...
})
.catch(function(err) {
  console.log('Unable to get permission to notify.', err);
});

