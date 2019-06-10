// import the required packages 

var express = require('express'); 
var path = require('path'); 
var app = express(); 
var paypal = require('paypal-rest-sdk');
var io = require('socket.io');
var http = require("http")

var admin = require('firebase-admin');
var serviceAccount = require('./betpeople-a64b6-6f36b3e08cb8.json');




var defaultAppConfig = {
  
  credential: admin.credential.cert(serviceAccount),
  apiKey: "AIzaSyCXsnVz9ZyxicdoHRfbrN3Nu5GrqAKWpxo",
  authDomain: "paylink-83436.firebaseapp.com",
  databaseURL: "https://paylink-83436.firebaseio.com",
  projectId: "paylink-83436",
  storageBucket: "paylink-83436.appspot.com",
  messagingSenderId: "1007552374306",
  appId: "1:1007552374306:web:934e48c315a76c42"
};





var defaultApp = admin.initializeApp(defaultAppConfig);
var db = defaultApp.firestore();
var sfDocRef = db.collection("users").doc("aN3lmnp7tz2nPv4kSC9A");



var mail;


// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
  'mode': 'sandbox', //sandbox or live 
  'client_id': 'AZ55BLLLl8LOE7mIuJwphNqRYYuDO8AJ8KWo88_4bEocMYSC04k79EIcjWwyvcEJNcZU1VFAaj_SGFRp', // please provide your client id here 
  'client_secret': 'EKplsPe8ywRizBs6ODefaSUTTHHq-IusXSbv7zrEXXJjhCJE6RKiWwEuv4UGh8VWSqajPJrKhuh5wI2K' // provide your client secret here 
});


// set public directory to serve static html files 
app.use('/', express.static(path.join(__dirname, 'public'))); 


// redirect to store when user hits http://localhost:3000
app.get('/' , (req , res) => {
    res.redirect('/index.html'); 
})







// start payment process 
app.get('/buy' , ( req , res ) => {




  // create payment object 
  var strind = "Full name is:${req.body.fname} ${req.body.lname}";
    var payment = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://127.0.0.1:3000/success",
          "cancel_url": "http://127.0.0.1:3000/err"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "lien-TWOEURO",
            
                  "price": "2.00",
                  "currency": "EUR",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "EUR",
              "total": "2.00"
          },
          "description": "This is the payment description."
      }]
  };
	
	// call the create Pay method 
    createPay( payment ) 
        .then( ( transaction ) => {
            var id = transaction.id; 
            var links = transaction.links;
            var counter = links.length; 
            while( counter -- ) {
                if ( links[counter].method == 'REDIRECT') {
                  // console.log("it has been successful" + links[0].href);
                  // console.log("it has been successful" + links[1].href);
                  // console.log("it has been successful" + links[2].href);

					// redirect to paypal where user approves the transaction 
                    return res.redirect( links[counter].href )
                }
            }
        })
        .catch( ( err ) => { 
            console.log( err ); 
            res.redirect('/err');
        });
}); 


// success page 
app.get('/success' , (req ,res ) => {
  var name = 'hello';
  console.log(name)

    // db.collection("users").add({
    //   mail: "grognon",
    //   time: new Date(),
    //   cash: 0,
    //   // currency: "Dollar"
    // }).then(function (docRef) {
    //   console.log("Document written with ID: ", docRef.id);
      
    //   var url = shrinkUrl(docRef.id);
    //   res.render( "/success.html", {name:url});
    // })
    //   .catch(function (error) {
    //     console.error("Error adding document: ", error);
    //   });;
    // db.runTransaction(function (transaction) {
    //   // This code may get re-run multiple times if there are conflicts.
    //   return transaction.get(sfDocRef).then(function (sfDoc) {
    //     if (!sfDoc.exists) {
    //       throw "Document does not exist!";
    //     }
    
    //     var newcash = sfDoc.data().cash + 2;
    //     transaction.update(sfDocRef, { cash: newcash });
      
    //   });
    // }).then(function () {
    //   console.log("Transaction successfully committed!");
    // }).catch(function (error) {
    //   console.log("Transaction failed: ", error);
    // });

    var url = shrinkUrl("293039");
    res.write("eijfe"); 
    res.redirect('/success.html'); 
})

// error page 
app.get('/err' , (req , res) => {
    console.log(req.query); 
    res.redirect('/err.html'); 
})

// app listens on 3000 port 
app.listen( 3000 , () => {
    console.log(' app listening on 3000 '); 
})



// helper functions 
var createPay = ( payment ) => {
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
         if ( err ) {
             reject(err); 
         }
        else {
            resolve(payment); 
        }
        }); 
    });
}

app.get('/searching', function(req, res){
  mail = req.query.mail;
  console.log(mail); 
  ownerid = req.query.ownerid;

});


function shrinkUrl(doc_id) {
  var anurl = "https://This-is-a-Two/Euro-link?ownedby=" + doc_id;
  return anurl;
}		