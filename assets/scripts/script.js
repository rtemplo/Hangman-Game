var wordBank = [
	{"word":"Atlantis", "hint":"The lost city of ..."}, 
	{"word":"Reykjavik", "hint":"Capital of Iceland"},
	{"word":"Mississippi", "hint":"Longest River in the USA"},
	{"word":"Solstice", "hint":"Word for the longest day of the year"},
	{"word":"Window", "hint":"The top level browser object in JavaScript"},
	{"word":"Anonymous", "hint":"A nameless function"},
	{"word":"Cheetah", "hint":"Fastest land mammal"},
	{"word":"Sonar", "hint":"Word for echo location in water"},
	{"word":"Apple", "hint":"Company with the largest market cap in the world"},
	{"word":"Chile", "hint":"Longest country in South America"}
];

//main game constructor
function HangMan(atts) {
	/*working variables - left these as accessible properties just so they would come out as options when I typed [ game. ] in the console. Otherwise they should be converted to regular vars.*/
	var wordComplete = false;
	
	this.currentLetter = null;
	this.selectedWord = null;
	this.hint = null;
	this.attemptsRemaining = atts;
	this._attsRemOrg = 0;
	this.lettersUsed = [];
	this.correct = 0;
	this.incorrect = 0;
	this.score = 0;
	this.gameIndex = 0;
	this.gameHistory = [];	
	
	//main methods
	
	this.init = function () {
		$("#game-start-text").hide();
	
		//remove the initial press any key game start listener
		this._attsRemOrg = this.attemptsRemaining;
		document.onkeyup = null;
		
		var wordObj = wordBank[Math.floor(Math.random() * wordBank.length)];
		this.selectedWord = wordObj.word.toLowerCase();
		this.hint = wordObj.hint;
		
		setUI(this.hint, this.attemptsRemaining, this.selectedWord, this.score);
		
		document.onkeyup = processKeyEntry.bind(this);
	};	
	
	//Initialize for a new word
	this.next = function () {
		wordComplete = false;
		
		this.saveGameData();

		this.gameIndex+=1;
		this.currentLetter = null;
		this.selectedWord = null;
		this.correct = 0;
		this.incorrect = 0;
		this.attemptsRemaining = this._attsRemOrg;
		this.lettersUsed = [];
		
		//get a simple array of words already used in the game
		var wordHist = [];
		for (var i=0; i<this.gameHistory.length; i++) {
			wordHist.push(this.gameHistory[i].word.toLowerCase());
		}
		
		//make sure the randomizer doesn't use a word that's already been used
		do {
			var wordObj = wordBank[Math.floor(Math.random() * wordBank.length)];
			this.selectedWord = wordObj.word.toLowerCase();
			this.hint = wordObj.hint;
		} while (wordHist.indexOf(this.selectedWord) >= 0);
		
		
		setUI(this.hint, this.attemptsRemaining, this.selectedWord, this.score);
				
	};
	

	this.saveGameData = function () {
		this.gameHistory.push(
			gameData(
				this.selectedWord, 
				this.hint, 
				this.correct, 
				this.incorrect,
				this.attemptsRemaining, 
				this.lettersUsed
			)
		);
	};
	
	// helper functions
	function setUI(h, a, w, s) {
		$("#wordPen").empty();
		$("#letters-used").empty();
	
		$("hr").show();  
    	$(".section").show();		
		
		$("#order-number").html(this.gameIndex + 1);
		$("#hint").html(h);
		$("#attempts-remaining").html(a);
		$("#correct").html("0");
		$("#incorrect").html("0");
		$("#score").html(s);
		
		$("#next-word").hide();
		
		//use the jQuery map function; pass a the word as a string array and initate a callback
		// that will populate the word pen/holder with the word that is initially hidden.
		$.map((w).split(''), function(n) {
		  writeLetter(n, "wordPen", false);
		});		
	}
	
	function writeLetter(letter, targetID, visible) {
		var classToMakeVisible;
		if (!visible || visible === "undefined") {
		classToMakeVisible = "hide-letter";
		}
		$("#" + targetID).append('<div class="letter-holder '+classToMakeVisible+'">'+letter+'</div>');
	}	
	
	function gameData(w, h, c, i, a, u) {
		// sets up object to save in game history
		return {
			"word":w,
			"hint":h,
			"correct":c,
			"incorrect":i,
			"attempts":a,
			"lettersUsed":u
		};
	}	
	
	function processKeyEntry() {
		//input filter to allow only (0-9) && (a-z)      
		if  (
			  (event.keyCode >= 48 && event.keyCode <= 57) 
			  || 
			  (event.keyCode >= 65 && event.keyCode <= 90)
			) {
			if (this.attemptsRemaining > 0) {
				////////////////////////////////////////////////////////
				this.currentLetter = event.key.toLowerCase();

				if (this.selectedWord.indexOf(this.currentLetter) < 0) {
					this.attemptsRemaining--;
					this.incorrect += 1;
				} else {
					//don't count letters that were already guessed
					if (this.lettersUsed.indexOf(this.currentLetter) < 0) {
						this.correct += 1;
					} 
				}

				//Update UI
				$("#attempts-remaining").html(this.attemptsRemaining);
				$("#correct").html(this.correct);
				$("#incorrect").html(this.incorrect);

				//Show any matched letters
				var i=-1;
				while((i=this.selectedWord.indexOf(this.currentLetter,i+1)) >= 0) {
					$("#wordPen div:eq("+i+")").removeClass("hide-letter");
				}            

				//update the list of letters already used if the letter has not been used before
				if (this.lettersUsed.indexOf(this.currentLetter) < 0) {
					this.lettersUsed.push(this.currentLetter);
					//render the letter
					writeLetter(this.currentLetter, "letters-used", true);
				}				  
				////////////////////////////////////////////////////////

				//check to see if it's solved by comparing the count of visible letters to the letter count of the word
				if (this.selectedWord.length === $("#wordPen > .letter-holder:not(.hide-letter)").length) {
					if (!wordComplete) {
						this.score += 1;
						$("#score").html(this.score);
						wordComplete = true;
						showMessage("Message", "Great Job!");
					} else {
						showMessage("Message", "You already completed this word. Click Next.");
					}
					
					if ((this.gameIndex+1) < wordBank.length) {
						$("#next-word").show().focus();
					} else {
						if (wordComplete) {
							$("#next-word").hide();
							$("#play-again").hide();
							showMessage("Game Finised", "Congrats!!!<br>You finished this game.");
						}
					}
					
				}
			
			} //attempts remaining condition
		
		} //valid key stroke
	
	} //processKeyEntry function

} //HangMan constructor


function showMessage(header, message) {
	$(".modal-title").html(header);
	$(".modal-body > p").html(message);
	$("#modalMessageDisplay").modal('show');
	$("#closeModalMessage").focus();
}

//would use a function like this to load the word data from a json file
//function loadData() {
//	var json = $.getJSON("assets/scripts/data.json", function () {
//		console.log("success")
//	}) 
//	.done(function() {
//    	console.log( "second success" );
//  	})
//	.fail(function() {
//		console.log( "error" );
//	})
//	.always(function() {
//		console.log( "complete" );
//	});
//}

var game = new HangMan(8);

$(document).ready(function (){
	//pre-init / page load setups, could have done this in stylesheet but more explicit here
	$("hr").hide();
	$(".section").not("#control-bar").hide();
	$("#next-word").hide();
	$("#play-again").hide();
	$(document).click(); //window needed focus so that 'press any key to start' works
	
	document.onkeyup = function () {
		game.init();
	};
	
	$("#next-word").on("click", function () {
		$('#modalMessageDisplay').modal('hide');
		if (game != null && game !== "undefined") {
			game.next();
		}
	})
	
	$("#play-again").on("click", function () {window.location.reload})
});
