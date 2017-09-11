var admin = require("firebase-admin");

var serviceAccount = require("./findyourbuddy-50e34-firebase-adminsdk-enew7-8434b5898b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://findyourbuddy-50e34.firebaseio.com"
});