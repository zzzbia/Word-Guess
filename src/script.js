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

const showHighScoreScreen = () => {
	welcomeScreen.style.display = "none";
	quizScreen.style.display = "none";
	resultsScreen.style.display = "none";
	highScoreScreen.style.display = "block";

	const highScores = window.localStorage.getItem("highScores");

	document.getElementById("showHighScores").style.display = "none";
	document.getElementById("goHome").style.display = "block";

	document.getElementById("goHome").addEventListener("click", () => {
		document.getElementById("showHighScores").style.display = "block";
		document.getElementById("goHome").style.display = "none";
		welcomeScreen.style.display = "block";
		highScoreScreen.style.display = "none";
	});
	document.getElementById("highScoreList").innerHTML = "";
	if (highScores) {
		JSON.parse(highScores).forEach((score) => {
			const highScoreListEl = document.createElement("li");
			highScoreListEl.innerHTML = score.initials + " - " + score.score;
			document.getElementById("highScoreList").appendChild(highScoreListEl);
		});
	}
};

document
	.getElementById("showHighScores")
	.addEventListener("click", showHighScoreScreen);

const startQuiz = () => {
	welcomeScreen.style.display = "none";
	quizScreen.style.display = "block";

	// The solution with a for loop did not work,so ignore the comment below.
	// for (let i = 0; i < questions.length; i++) {
	// 	document.getElementById("question").innerHTML = questions[i].question;
	// }
	let wrongAnswerIndexes = [];
	let correctAnswerIndexes = [];

	const storeResults = (event) => {
		event.stopImmediatePropagation();
		event.preventDefault();
		console.log("hiii");
		const initials = document.getElementById("initials").value;

		// we will store the scores in an array of:
		// {
		//     initals: 'hi',
		//     score: 99
		// }

		const localStorageValue = window.localStorage.getItem("highScores");
		const scores = localStorageValue ? JSON.parse(localStorageValue) : [];

		// if (localStorageValue) {
		// 	console.log("did it work?", localStorageValue);
		// 	scores = JSON.parse(localStorageValue);
		// }

		scores.push({
			initials: initials,
			score: correctAnswerIndexes.length,
		});
		console.log("Checking scores", scores);
		window.localStorage.setItem("highScores", JSON.stringify(scores));

		showHighScoreScreen();
	};

	document
		.getElementById("intialsForm")
		.addEventListener("submit", storeResults);

	document
		.getElementById("clearHighScoreList")
		.addEventListener("click", () => {
			window.localStorage.clear();
			window.location.reload();
		});

	let count = 75;
	let quizFinish = false;

	function endQuiz() {
		quizScreen.style.display = "none";
		resultsScreen.style.display = "block";
		document.getElementById(
			"totalCorrect"
		).innerHTML = `Your score is ${correctAnswerIndexes.length}`;
		console.log("wrong", wrongAnswerIndexes);
		console.log("correct", correctAnswerIndexes);
		quizFinish = true;
	}

	function updateTimer() {
		count = Math.max(count - 1, 0);
		document.getElementById("timer").innerHTML = count;
		const timeout = setTimeout(updateTimer, 1000);
		if (quizFinish === true) {
			clearTimeout(timeout);
			document.getElementById("timer").innerHTML = "";
		}
		if (count <= 0) {
			clearTimeout(timeout);
			endQuiz();
		}
	}

	updateTimer();

	function askQuestion(index) {
		const question = questions[index];
		document.getElementById("question").innerHTML = question.question;
		const answerList = document.getElementById("answerOptions");
		answerList.innerHTML = "";

		for (let i = 0; i < question.options.length; i++) {
			const optionListEl = document.createElement("li");
			optionListEl.className =
				"list-group-item d-flex justify-content-between align-items-start list-group-item-action list-group-item-primary";
			const option = question.options[i];
			optionListEl.innerHTML = option;

			optionListEl.addEventListener("click", () => {
				// condition to check if answer is correct
				if (option === question.answer) {
					console.log("correct");
					document.getElementById("guess").innerHTML = "That is correct!";

					correctAnswerIndexes.push(index);
				} else {
					count = count - 10;
					console.log("incorrect");
					wrongAnswerIndexes.push(index);
					document.getElementById("guess").innerHTML = "That is Incorrect!";
				}

				/*condition to check if index + 1 exists in 
                 the questions array before calling ask question again 
                recursively.. if it doesnt exist, there are no more questions
                so we end the quiz */

				if (index + 1 < questions.length) {
					askQuestion(index + 1);
				} else {
					endQuiz();
				}
			});

			answerList.appendChild(optionListEl);
			console.log(optionListEl);
		}
	}
	askQuestion(0);
};

document.getElementById("startBtn").addEventListener("click", startQuiz);
