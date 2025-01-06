// Questions for each difficulty level
const questionSets = {
  easy: [
    { question: "3 + 2 = ?", options: [5, 4, 6], answer: "5" },
    { question: "7 - 3 = ?", options: [4, 5, 6], answer: "4" },
  ],
  medium: [
    { question: "6 × 2 = ?", options: [12, 10, 8], answer: "12" },
    { question: "8 ÷ 2 = ?", options: [4, 6, 5], answer: "4" },
  ],
  hard: [
    { question: "12 ÷ 4 + 3 = ?", options: [6, 7, 8], answer: "6" },
    { question: "5 × 3 - 4 = ?", options: [11, 12, 13], answer: "11" },
  ],
};

let currentSet = [];
let currentQuestion = 0;
let score = 0;
let totalQuestions = 0;
let timerInterval;

// DOM Elements
const questionElement = document.getElementById("question");
const dragItemsContainer = document.getElementById("drag-items");
const dropZone = document.getElementById("drop");
const feedbackElement = document.getElementById("feedback");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const nextButton = document.getElementById("next-button");
const difficultyButtons = document.querySelectorAll(".difficulty button");

// Timer function
function startTimer(seconds) {
  clearInterval(timerInterval);
  timerElement.textContent = `Time left: ${seconds}s`;
  timerInterval = setInterval(() => {
    seconds--;
    timerElement.textContent = `Time left: ${seconds}s`;
    if (seconds <= 0) {
      clearInterval(timerInterval);
      feedbackElement.textContent = "Time's up! 😔";
      feedbackElement.style.color = "red";
      feedbackElement.classList.add("show");
      nextButton.style.display = "inline-block";
    }
  }, 1000);
}
 
// Function to speak any text
function speakText(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  } else {
    console.warn("Speech Synthesis not supported in this browser.");
  }
}

// Select Difficulty (Modified to read button text directly)
difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const difficulty = button.textContent.trim(); // Get the button's text (e.g., "Easy")
    speakText(`You selected ${difficulty} level`); // Speak the button's text
    currentSet = questionSets[difficulty.toLowerCase()]; // Match difficulty to questionSets (e.g., "easy")
    currentQuestion = 0;
    score = 0;
    totalQuestions = currentSet.length;
    scoreElement.textContent = `Score: 0 / 0`;
    loadQuestion();
  });
});

// Load Question
function loadQuestion() {
  feedbackElement.textContent = "";
  feedbackElement.classList.remove("show");
  dropZone.textContent = "";
  dropZone.classList.remove("correct");

  const current = currentSet[currentQuestion];
  questionElement.textContent = `Drag the correct answer to the box: ${current.question}`;
  dropZone.dataset.answer = current.answer;

  dragItemsContainer.innerHTML = "";
  current.options.forEach((option) => {
    const item = document.createElement("div");
    item.className = "item";
    item.draggable = true;
    item.textContent = option;
    item.dataset.value = option;
    dragItemsContainer.appendChild(item);

    item.addEventListener("dragstart", (e) => {
      const draggedText = e.target.dataset.value;
      speakText(`You selected ${draggedText}`); // Speak the number being dragged
      e.dataTransfer.setData("text", draggedText);
    });
  });

  startTimer(15); // 15 seconds per question
}

// Handle Drop
dropZone.addEventListener("dragover", (e) => e.preventDefault());
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  const droppedValue = e.dataTransfer.getData("text");
  const correctAnswer = dropZone.dataset.answer;
  speakText(`You dropped ${droppedValue} into the box`);

  if (droppedValue === correctAnswer) {
    dropZone.textContent = droppedValue;
    dropZone.classList.add("correct");
    feedbackElement.textContent = "Correct! 🎉";
    speakText(`Awesome that was correct`);
    feedbackElement.style.color = "green";
    score++;
  } else {
    feedbackElement.textContent = "Oops! Try again. 🙁";
    speakText(`That was incorrect try again`);
    feedbackElement.style.color = "red";
  }

  feedbackElement.classList.add("show");
  scoreElement.textContent = `Score: ${score} / ${currentQuestion + 1}`;
  clearInterval(timerInterval);
  nextButton.style.display = "inline-block";
});

// Handle Next Question
nextButton.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < totalQuestions) {
    loadQuestion();
    nextButton.style.display = "none";
  } else {
    questionElement.textContent = "Quiz Completed! Great Job! 🎓";
    feedbackElement.textContent = "";
    dragItemsContainer.innerHTML = "";
    nextButton.style.display = "none";
  }
});

// Select Difficulty
difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const difficulty = button.className;
    currentSet = questionSets[difficulty];
    currentQuestion = 0;
    score = 0;
    totalQuestions = currentSet.length;
    scoreElement.textContent = `Score: 0 / 0`;
    loadQuestion();
  });
});
