// Initialize Firebase
var config = {
    apiKey: "AIzaSyD8iEjm8-HCezcQNmQ78Y-0jbTd3XQvloo",
    authDomain: "train-arrival-app.firebaseapp.com",
    databaseURL: "https://train-arrival-app.firebaseio.com",
    projectId: "train-arrival-app",
    storageBucket: "",
    messagingSenderId: "457882266758"
};
firebase.initializeApp(config);

//store firebase database
var database = firebase.database();


//======================== Creating New Accounts ==============================================

//when you click Create Account
$("#create-acct-btn").on("click", function() {

    event.preventDefault();

    //store the email and password
    var emailInput = $("#email-field").val().trim();
    var passInput = $("#password-field").val().trim();
    
    console.log("test");
    console.log(emailInput);

    //use firebase to create and store the new user 
    firebase.auth().createUserWithEmailAndPassword(emailInput, passInput).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
})


//============================ Logging In Current Users ========================================

//when you click the login button
$("#login-btn").on("click", function() {

    //$("#user-choices").empty();

    event.preventDefault();

    //store the users email and pass to submit
    var emailInput = $("#email-field").val().trim();
    var passInput = $("#password-field").val().trim();

    console.log("test");
    console.log(emailInput);

    //hide the login screen
    $("#login-screen").css("display", "none");

    //show the welcome screen
    $("#welcome-screen").css("display", "block");

    //insert username into welcome screen
    $("#users-name").text(" " + emailInput);

    function welcome() {
        //hide the welcome screen
        $("#welcome-screen").css("display", "none");

        //show the train app
        $("#train-app").css("display", "block");

        //use firebase to find the user and log them in
            firebase.auth().signInWithEmailAndPassword(emailInput, passInput).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            //alert the user if the pass/email is wrong
            alert(errorMessage);
            // ...

        });
    }

    var loginInterval = setTimeout(welcome, 3000);

    
})


//============================= Logging Out Users ==============================================

//when you click the log out button
$("#log-out-btn").on("click", function() {

    event.preventDefault();

    //hide the login text
    $("#login-screen").css("display", "none");
    $("#login").css("display", "block");
    
    //use firebase to sign out the user
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log("logged out");
        }).catch(function(error) {
        // An error happened.
    });
})

//whenever the login state changes
firebase.auth().onAuthStateChanged(function (user) {

    if (user) {
        //hide the login screen
        $("#login-screen").css("display", "none");

        //show the train app
        $("#train-app").css("display", "block");

        //change the jumbotron text
        $("#sub-head").text("Pick a train, any train...");

        //show the users name in the jumbotron
        $("#login-name").text(user.email);
    } else {
        //hide the login screen
        $("#login-screen").css("display", "block");

        //show the train app
        $("#train-app").css("display", "none");

        //change the jumbotron text
        $("#sub-head").text("Log In Below to Use the Train App!");

        //remove the users name from the jumbotron
        $("#login-name").empty();
    }
});
    
    



// Firebase watcher .on("child_added"
database.ref().on("value", function (snapshot) {
    // storing the snapshot.val() as an array in a var
    var sv = Object.values(snapshot.val());

    console.log(sv);

    //clear the screen
    $("#results").empty();

    
    // Change the HTML to reflect
    for (var i = 0; i < sv.length; i++) {

        var tFrequency = sv[i].frequency;

        // Time is 3:30 AM
        var firstTime = sv[i].startTime;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minutes Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        nextTrain = moment(nextTrain).format("HH:mm");


        //create table row
        var trainRow = $("<tr>").appendTo($("#results"));
        var nameData = $("<td>").text(sv[i].name).appendTo(trainRow);
        var destData = $("<td>").text(sv[i].destination).appendTo(trainRow);
        var freqData = $("<td>").text(sv[i].frequency).appendTo(trainRow);
        var arrivalData = $("<td>").text(nextTrain).appendTo(trainRow);
        var minLeftData = $("<td>").text(tMinutesTillTrain).appendTo(trainRow);
    }

    //$("#name-display").text(sv.name);
    //$("#email-display").text(sv.destination);
    //$("#age-display").text(sv.startTime);
    //$("#comment-display").text(sv.frequency);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

//when user submits new train
$("#submit").on("click", function() {

    //prevent page reload
    event.preventDefault();

    //clear the screen
    $("#results").empty();

    //store users inputs
    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#destination").val().trim();
    var firstTrain = $("#first-train-time").val().trim();
    var trainFrequency = $("#frequency").val().trim();

    console.log(trainName);
    //store data in firebase
    database.ref().push({
        name: trainName,
        destination: trainDestination,
        startTime: firstTrain,
        frequency: trainFrequency,
      });


    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
})

//when user clicks clear schedule
$("#clear").on("click", function() {

    //clear the firebase database
    firebase.database().ref().remove();

    //clear the screen
    $("#results").empty();

})