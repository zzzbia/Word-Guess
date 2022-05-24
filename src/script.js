const welcomeScreen = document.getElementById("welcome");
const quizScreen = document.getElementById("quiz");
const resultsScreen = document.getElementById("results");
const feedback = document.getElementById("feedback");

const questions = [
	{
		question: "what is 2 +2 ",
		options: [4, 9, 10, 12],
		answer: 4,
	},
	{
		question: "what is 5 + 4",
		options: [32, 9, 2, 12],
		answer: 9,
	},
	{
		question: "what is 1 + 1",
		options: [32, 9, 2, 12],
		answer: 2,
	},
];

const startQuiz = () => {
	welcomeScreen.style.display = "none";
	quizScreen.style.display = "block";

	for (let i = 0; i < questions.length; i++) {
		document.getElementById("question").innerHTML = questions[i].question;
	}
};

document.getElementById("startBtn").addEventListener("click", startQuiz);
