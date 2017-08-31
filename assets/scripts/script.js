var selectedWord;
var hint;
var lettersUsed = [];
var currentLetter;
var attemptsRemaining = 8;
var correct = 0;
var incorrect = 0;


function writeLetter(letter, targetID, visible) {
  var classToMakeVisible;
  if (!visible || visible == "undefined") {
    classToMakeVisible = "hide-letter";
  }
  $("#" + targetID).append('<div class="letter-holder '+classToMakeVisible+'">'+letter+'</div>');
}

function resetGame() {
  window.location.reload(false);
}

$(document).ready(function (){
	$("hr").hide();
	$(".section").not("#control-bar").hide();
	$("#new-game").hide();
  
 	$("#start-game").on("click", function() {
    	$(this).hide();
    	$("#new-game").show();
    	$("#new-game").on("click", resetGame);
    	
    	$("#attempts-remaining").html(attemptsRemaining);
		$("hr").show();  
    	$(".section").show();
    
		//user randomizer to select a word
		var randItem = wordBank[Math.floor(Math.random() * wordBank.length)];
		selectedWord = randItem.word.toLowerCase();
		hint = randItem.hint;
		
		//place the hint in the hint box
		$("#hint").html(hint);

		//use the jQuery map function; pass a the word as a string array and initate a callback
		// that will populate the word pen/holder with the word that is initially hidden.
		$.map((selectedWord).split(''), function(n) {
		  writeLetter(n, "wordPen", false);
		});

    	document.onkeyup = function(event) {
      		if (attemptsRemaining === 0) alert("Game Over");
      
			//input was (0-9) && (a-z)      
			if  (
				(
				  (event.keyCode >= 48 && event.keyCode <= 57) 
				  || 
				  (event.keyCode >= 65 && event.keyCode <= 90)
				)              
				&& 
				(attemptsRemaining > 0)
			  )
			{
          
				currentLetter = event.key;
				currentLetter = currentLetter.toLowerCase();

				if (selectedWord.indexOf(currentLetter) < 0) {
					attemptsRemaining--;
					incorrect += 1;
				} else {
					correct += 1;
				}

				$("#attempts-remaining").html(attemptsRemaining);
				$("#correct").html(correct);
				$("#incorrect").html(incorrect);
          
				var i=-1;
				while((i=selectedWord.indexOf(currentLetter,i+1)) >= 0) {
					console.log("~ " + i);
					$("#wordPen div:eq("+i+")").removeClass("hide-letter");
				}            
        
				if (lettersUsed.indexOf(currentLetter) < 0) {
					lettersUsed.push(currentLetter);
					writeLetter(currentLetter, "letters-used", true);
					// console.log(lettersUsed.join(","));
				}
        
			} // end valid key check
			
		};// end document.onkeyup
		
	}); // end start game from click
   
}); // end document ready state
