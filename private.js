/*
======================================================
	
	NOTE:
	
	The code below serves only demonstration purposes.
	
	It could be improved.
	
======================================================

*/


"use strict;"

/*
=====================
DEFINITION OF CLASSES
=====================
*/

//Purpose: Contains a list of Riddles and their answers
function Riddles()
{
	//Private member variables
	var riddle = [];
	var answer = [];
	
	//Sets content and its correct answer
	this.Fill = function(content, solution)
	{
		//Answer and riddle should be on the same position when later getting both
		riddle.push(content);
		
		answer.push(solution);
	}
	
	
	//Get content from a specific position.
	/*
		Parameter: 
		fromPosition 	 -> an integer number for the specific position which will be accessed
		riddle_or_answer -> "answer" for the riddles answer or "riddle" for the riddle itself
	*/
	this.GetInfo = function(fromPosition, riddle_or_answer)
	{
	
		if ( (riddle[fromPosition] === undefined) )
		{
			
			console.log("Wrong array position!")
			
		}
		else if(riddle_or_answer === "riddle")
		{
			
			return riddle[fromPosition];
			
		}
		else if(riddle_or_answer === "answer")
		{
			return answer[fromPosition];
		}
	
	}

}


//Purpose: Class for left, middle and right cup which are represented in picture
function Cup()
{

	//Private member variable
	var hiddenObject = false;
	
	
	//Variable "intoCup" must be a bool
	this.putObject = function(intoCup)
	{
		hiddenObject = intoCup;
	}
	
	//Checks the player selected cup
	this.hasObject = function()
	{
		return hiddenObject;
	}
	
}


//Purpose: Contains all the game status information
function GameStats()
{
	
	//Private member variables
	var points = 0;
	var rounds = 1;
	
	//Increases or decreases points depending on positive or negative argument value
	this.changePoints = function(addPoints)
	{
		points += addPoints;
	}
	
	//Needed to show points to player
	this.getPoints = function()
	{
		return points;
	}
	
	//Will be increased with every new turn
	this.increaseRounds = function()
	{
		rounds += 1;
	}
	
	//Will return the current turn in which the player is
	this.currentRound = function()
	{
		return rounds;
	}
	
}


//Purpose: Needed for shuffling and randomly showing a riddle
function Randomizer(min, max)
{
	var lastResult = 0;
	
	//[min,max] interval
	this.start = function()
	{
		//To make sure that the interval between min and max is correct
		var tempMax = max + 1;
		
		//Storing the result
		lastResult = ( Math.floor(Math.random() * (tempMax - min)) + min );
		
		return lastResult;
	}
	
	//For reusability of the result
	this.getLastResult = function()
	{
		return lastResult;
	}
	
}



/*
=========
INSTANCES
=========
*/

var MyRiddles = new Riddles();

//Setting three cups equal to the number in the picture which the user is interacting with
var LeftCup 	= new Cup();
var MiddleCup 	= new Cup();
var RightCup 	= new Cup();


//Puts the "thrill" into the game (pseudo randomness)
var Shuffle = new Randomizer(0,2);
var Dice	= new Randomizer(0,9);


//Gamestats are zero when initialized
var MyGameStats = new GameStats();



/*
======================
GAMEPLAY SUB FUNCTIONS
======================
*/

//Shows current round status
function showRounds()
{
	var rounds = document.getElementById('round-number');
	
	rounds.innerHTML = MyGameStats.currentRound();
}


//Shows current point status
function showPoints()
{
	var points = document.getElementById('points');
	
	points.innerHTML = MyGameStats.getPoints();
}


//Shows from the system a randomly selected riddle
function showRiddle()
{
	var riddle = document.getElementById('riddle');
	
	//Between 0 and 9
	var diced = Dice.start();
	
	riddle.innerHTML = MyRiddles.GetInfo(diced, "riddle");
}



/*
=======================
GAMEPLAY MAIN FUNCTIONS
=======================
*/

//Activates the first round of the game
function startRound()
{
	var TrueCup = Shuffle.start();
	
	
	if(TrueCup === 0)		//Left Cup
	{
		LeftCup.putObject(true);
		MiddleCup.putObject(false);
		RightCup.putObject(false);
	}
	else if(TrueCup === 1)	//Middle Cup
	{
		LeftCup.putObject(false);
		MiddleCup.putObject(true);
		RightCup.putObject(false);
	}
	else if(TrueCup === 2)	//Right Cup
	{
		LeftCup.putObject(false);
		MiddleCup.putObject(false);
		RightCup.putObject(true);
	}
	
	
	//Show all the game information to the user
	showRounds();
	showPoints();
	showRiddle();
}


//Checks if the user found the object
function choice(selected)
{
	var userAnswer 	= document.getElementById('user-answer');
	var show 		= document.getElementById('riddle');
	
	if(Shuffle.getLastResult() === selected)
	{
		//Checking if the last round (round 5) is already reached
		if(MyGameStats.currentRound() === 5)
		{
			show.innerHTML = "GAME OVER"
		}
		else
		{
			//Increasing points and round
			MyGameStats.increaseRounds();
			MyGameStats.changePoints(50);
		
			//Activating the ability for the user to answer a new riddle
			userAnswer.disabled = false;
		
			//Object was found by user start next round
			startRound();
			
		}
		
	}
	else
	{
		//Object was not found, decreasing points
		MyGameStats.changePoints(-15);
		
		showPoints();
		
	}
	
}


//Checks the user given answer
function checkAnswer()
{
	var show 		= document.getElementById('riddle');
	var deactivate	= document.getElementsByName('cupmap')[0];
	var userAnswer 	= document.getElementById('user-answer');
	var answer 		= MyRiddles.GetInfo(Dice.getLastResult(), "answer");
	
	
	if(answer === userAnswer.value)
	{
		//Bonus Points
		MyGameStats.changePoints(30);
		showPoints();

		//Deactivating to prevent bonus points spaming
		userAnswer.disabled = true;
		
		show.innerHTML = "Congratulation, you answered the riddle and got bonus points!";
	}

}


//Refresh Page = restart game
function refresh()
{
	location.reload();
}



/*
=========
INIT GAME
=========
*/

//All riddles which will be used in the game
MyRiddles.Fill("A box without hinges, key or lid, Inside, a golden treasure is hid.", 						"egg");
MyRiddles.Fill("Forward I am heavy, backward I am not. What am I?", 										"ton");
MyRiddles.Fill("Give me food and I will live, Give me water, and I will die.", 								"fire");
MyRiddles.Fill("I look at you, you look at me I raise my right,you raise your left What is this object?", 	"mirror");
MyRiddles.Fill("If you divide thirty by half, and add ten, what do you get?", 								"70");
MyRiddles.Fill("The more that there is, the less you can see.", 											"darkness");
MyRiddles.Fill("What can you catch but not throw?", 														"cold");
MyRiddles.Fill("What does a rich man want, a poor man have, and a dead man eat?", 							"nothing");
MyRiddles.Fill("What kind of room has no windows or doors?", 												"mushroom");
MyRiddles.Fill("You must keep it after giving it.", 														"promise");

//First round
startRound()