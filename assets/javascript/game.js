var database = firebase.database();
// -----------------------------------------------------------------
// Firebase Variables
// -----------------------------------------------------------------

var active;
var gamestate;
var playerstatus;
var playerchoice;
var P1Status, P2Status;
var P1Choice, P2Choice;
var P1Score,
  P2Score = 0;

// -----------------------------------------------------------------
// Global variables
// -----------------------------------------------------------------

// -----------------------------------------------------------------
// Global functions
// -----------------------------------------------------------------

function newGame() {
  database.ref("gamestate/").set({
    active: 0
  });
  database.ref("playerstatus/").set({
    P1Status: 0,
    P2Status: 0
  });
  database.ref("playerchoice/").set({
    P1Choice: 0,
    P2Choice: 0
  });
}

function resetChoices() {
  database.ref("playerchoice/").update({
    P1Choice: 0,
    P2Choice: 0
  });
}

// -----------------------------------------------------------------
// When the page loads....
// -----------------------------------------------------------------

$(document).ready(newGame());

// -----------------------------------------------------------------
// Onclick attachments
// -----------------------------------------------------------------

// Gameplay UI logic -----------------------------------------------
$("#p1-join, #p2-join").on("click", function() {
  $("#instructions").text("Waiting for other player...");
  // Potentially add a cool feature here that animates the "..."
  $("#p1-join, #p2-join").addClass("invisible");
});

$("#rock").on("click", function() {
  $("#scissors, #paper").addClass("invisible");
});

$("#scissors").on("click", function() {
  $("#paper, #rock").addClass("invisible");
});

$("#paper").on("click", function() {
  $("#rock, #scissors").addClass("invisible");
});

$("#play-again").on("click", function() {
  $("#play-again").addClass("invisible");
  $("#rock, #paper, #scissors").removeClass("invisible");
  $("#instructions").addClass("invisible");
});

// Firebase Logic --------------------------------------------------
$("#p1-join").on("click", function() {
  $("#rock, #paper, #scissors").attr("value", "P1Choice");
  database.ref("playerstatus/").update({
    P1Status: 1
  });
});

$("#p2-join").on("click", function() {
  $("#rock, #paper, #scissors").attr("value", "P2Choice");
  database.ref("playerstatus/").update({
    P2Status: 1
  });
});

database.ref("playerstatus/").on("value", function(snapshot) {
  var result = snapshot.val();
  if (result.P1Status === 1 && result.P2Status === 1) {
    $("#rock, #paper, #scissors").removeClass("invisible");
    $("#score").removeClass("invisible");
    $("#instructions").addClass("invisible");
  }
});

$("#rock, #paper, #scissors").on("click", function() {
  var playerID = $(this).attr("value");
  var update = {};
  update[playerID] = $(this).attr("id");

  database.ref("playerchoice/").update(update);
});

database.ref("playerchoice/").on("value", function(snapshot) {
  var choices = snapshot.val();
  if (choices.P1Choice !== 0 && choices.P2Choice !== 0) {
    if (choices.P1Choice === choices.P2Choice) {
      $("#instructions").text("Tie!");
      resetChoices();
    } else if (
      (choices.P1Choice === "rock" && choices.P2Choice === "scissors") ||
      (choices.P1Choice === "scissors" && choices.P2Choice === "paper") ||
      (choices.P1Choice === "paper" && choices.P2Choice === "rock")
    ) {
      $("#instructions").text("Player 1 Wins!");
      P1Score++;
      resetChoices();
    } else if (
      (choices.P1Choice === "scissors" && choices.P2Choice === "rock") ||
      (choices.P1Choice === "paper" && choices.P2Choice === "scissors") ||
      (choices.P1Choice === "rock" && choices.P2Choice === "paper")
    ) {
      $("#instructions").text("Player 2 Wins!");
      P2Score++;
      resetChoices();
    }
    $("#instructions").removeClass("invisible");
    $("#buttons")
      .children()
      .addClass("invisible");
    $("#play-again").removeClass("invisible");
    $("#p1-score").text(P1Score);
    $("#p2-score").text(P2Score);
  }
});

// Add logic to check for availability of desired player #
