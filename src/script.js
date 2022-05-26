// Global variables for the dom nodes that are needed across different scopes
const welcomeScreen = document.getElementById("welcome");
const quizScreen = document.getElementById("quiz");
const resultsScreen = document.getElementById("results");
const feedback = document.getElementById("feedback");
const highScoreScreen = document.getElementById("highScores");

// Array of objects (questions) with the multiple choice values as an options array, and the answer key
// This is mutatable, so we could substiture different questions with different options and answers and it would work
const questions = [
	{
		question: 'The "function" and " var" are known as ______',
		options: ["Keywords", "Data types", "Declaration Statements", "Prototypes"],
		answer: "Declaration Statements",
	},
	{
		question:
			"Which function is used to serialize an object into a JSON string in Javascript",
		options: ["stringify()", "parse()", "convert()", "None of the above"],
		answer: "stringify()",
	},
	{
		question: "Which of the following are closures in Javascript?",
		options: ["Variables", "Functions", "Objects", "All of the above"],
		answer: "All of the above",
	},
	{
		question:
			"What keyword is used to declare an asynchronous function in Javascript?",
		options: ["async", "await", "setTimeout", "None of the above"],
		answer: "async",
	},
	{
		question: "Which of the following is NOT a Javascript framework?",
		options: ["Node", "Vue", "React", "Cassandra"],
		answer: "Cassandra",
	},
	{
		question:
			"Which of the following methods can be used to display data in some form using Javascript?",
		options: [
			"document.write()",
			"console.log()",
			"window.alert()",
			"All of the above",
		],
		answer: "All of the above",
	},
];

// function to show high score DOM node and hide all other nodes
// high scores will be retrieved from the local storage
// also provides functionality to clear the local storage
const showHighScoreScreen = () => {
	// hide all other nodes
	welcomeScreen.style.display = "none";
	quizScreen.style.display = "none";
	resultsScreen.style.display = "none";

	highScoreScreen.style.display = "block";

	// change navigation top button to display the go home button
	// and hide the show high scores button
	document.getElementById("showHighScores").style.display = "none";
	document.getElementById("goHome").style.display = "block";

	document.getElementById("goHome").addEventListener("click", () => {
		document.getElementById("showHighScores").style.display = "block";
		document.getElementById("goHome").style.display = "none";
		welcomeScreen.style.display = "block";
		highScoreScreen.style.display = "none";
	});

	// select the dom node for the highscorelist from the ID
	// reset its inner html in case a user has cleared their localstorage
	// but the node still contains the previous high scores
	const highScoreList = document.getElementById("highScoreList");
	highScoreList.innerHTML = "";

	// retrieve highscores from localstorage
	const highScores = window.localStorage.getItem("highScores");
	// for each highscore, if it is in the stored highscore list in Local Storage
	// create a list element and change the inner Html to the score
	// Append the list element to the score list <ul> element
	if (highScores) {
		JSON.parse(highScores).forEach((score) => {
			const highScoreListEl = document.createElement("li");
			highScoreListEl.className = "list-group-item";
			highScoreListEl.innerHTML = score.initials + " - " + score.score;
			highScoreList.appendChild(highScoreListEl);
		});
	}
};
// Setting the event listner for the Show HighScores function
document
	.getElementById("showHighScores")
	.addEventListener("click", showHighScoreScreen);

// Function Start Quiz, settng welcome node to display none
// Then show the Quiz Screen
// Function also stores wrongAnswerIndexes and correctAnswerIndexes
// Has a function within it that stores the results to localestore on initial form submit
// Has a function within it that prompts the questions recursively
// contains the endQuiz function
// contains updatetimer function to keep track of the user's time
const startQuiz = () => {
	welcomeScreen.style.display = "none";
	quizScreen.style.display = "block";

	let wrongAnswerIndexes = [];
	let correctAnswerIndexes = [];

	// Storing results to local storage, takes in an event paramater
	const storeResults = (event) => {
		// Stop immediate propagation of the event otherwise form submitting twice
		event.stopImmediatePropagation();
		event.preventDefault();
		// initials is the text input field in the form
		// We don't validate in js because the field is being validated from the html
		// input type is required and minlength / maxlength is specified in the element
		const initials = document.getElementById("initials").value;

		// we will store the scores in an array of:
		// {
		//     initals: 'hi',
		//     score: 99
		// }

		// Getting the scores from the local storage value
		const localStorageValue = window.localStorage.getItem("highScores");
		// Using ternary statement to set scores to empty array if it does not exist
		// Used JSON.parse because the localStorage value has to be a string
		const scores = localStorageValue ? JSON.parse(localStorageValue) : [];

		// Pushing the new score object, getting the total amount of correct answers from
		// correct answers index arrays length
		scores.push({
			initials: initials,
			score: correctAnswerIndexes.length,
		});
		console.log("Checking scores", scores);
		// Set or override highScores with a new one
		window.localStorage.setItem("highScores", JSON.stringify(scores));
		// calling showhighscorescreen function
		showHighScoreScreen();
	};
	// attaching the form submit to the store results
	document
		.getElementById("intialsForm")
		.addEventListener("submit", storeResults);
	//Clears local storage and reloads window
	document
		.getElementById("clearHighScoreList")
		.addEventListener("click", () => {
			window.localStorage.clear();
			window.location.reload();
		});
	//count is default timer amount
	// quizFinish is a variable to confirm if the quiz finished, and if so end timer
	let count = 75;
	let quizFinish = false;

	// End Quiz function, called when the quiz times out
	// or user finished all the questions

	function endQuiz() {
		//hides the quiz node and shows results
		quizScreen.style.display = "none";
		resultsScreen.style.display = "block";
		// gets the totalCount node and sets innerHtml to the result
		document.getElementById(
			"totalCorrect"
		).innerHTML = `Your score is ${correctAnswerIndexes.length}`;
		console.log("wrong", wrongAnswerIndexes);
		console.log("correct", correctAnswerIndexes);
		// updates quizFinish variable to true
		// so we can clear the timer
		quizFinish = true;
	}

	// runs the quiz timer
	// if the quiz is finished, it will clear timeout and run endquiz
	function updateTimer() {
		// math.max with 0 in case count goes into negative range
		count = Math.max(count - 1, 0);
		// sets timer node's innerHtml to the time available
		document.getElementById("timer").innerHTML = `Time: ${count}`;
		// creates a setTimeout function that runs every 1000 miliseconds
		const timeout = setTimeout(updateTimer, 1000);
		if (quizFinish === true) {
			// if the quiz if finished because the user finishded all questions
			// we clear the timeout
			clearTimeout(timeout);
			document.getElementById("timer").innerHTML = "";
		}
		if (count <= 0) {
			// if the time left is less than equal to 0, we clear timeout and endQuiz
			clearTimeout(timeout);
			endQuiz();
		}
	}

	// calls the updateTimer
	updateTimer();

	// prompts the user with the question
	// takes an integer index value that references the index of the question in the questions array
	// recurssively calls itself after user answers the call
	// if there are more questions, it will call itself with index + 1
	// if there are no more questions, it will endQuiz
	function askQuestion(index) {
		// we isolate the question from the questions array  into the variable question
		// with the index that was provided to us in the function call
		const question = questions[index];

		// gets the DOM node where we will prin the question
		document.getElementById("question").innerHTML = question.question;

		// gets the UL where the options will be presented
		const answerList = document.getElementById("answerOptions");

		// we reset the innerHtMl of the answerList to ""
		// because otherwise, the DOM node might contain options from the previous
		// askQuestion() call
		answerList.innerHTML = "";

		// for loop that itterates through the options for the question
		// adds an eventlistener to the li element that listens for the click
		for (let i = 0; i < question.options.length; i++) {
			// creates a li element for each option
			const optionListEl = document.createElement("li");
			// give some oomph with classes
			optionListEl.className =
				"list-group-item d-flex align-items-start list-group-item-action list-group-hover";

			// sets the content of the li element to the option text
			const option = question.options[i];
			optionListEl.innerHTML = option;

			// adds an eventListener for click on the newly created li element
			optionListEl.addEventListener("click", () => {
				// condition to check if answer is correct

				if (option === question.answer) {
					// if it is correct we give real time feedback by appending appending
					// to the element with the id guess
					document.getElementById("guess").innerHTML = "That is correct!";
					// we push the index of the question into the correctAnswerIndexes
					// can be used in the future if the user wants to review their questions
					// i.e. questions[index]
					correctAnswerIndexes.push(index);
				} else {
					// decrement the count variable used in the timer if the user gets the question wrong
					// push the index to wrongAnswerIndexes
					count = count - 10;
					wrongAnswerIndexes.push(index);
					document.getElementById("guess").innerHTML = "That is Incorrect!";
				}

				/*condition to check if index + 1 exists in 
                 the questions array before calling ask question again 
                recursively. if it doesnt exist, there are no more questions
                so we end the quiz */

				if (index + 1 < questions.length) {
					askQuestion(index + 1);
				} else {
					endQuiz();
				}
			});

			//the li element is appended to the answerList <ul/> element
			answerList.appendChild(optionListEl);
		}
	}

	// call the askQuestion function with index 0, so it prompts the first question
	askQuestion(0);
};

document.getElementById("startBtn").addEventListener("click", startQuiz);
