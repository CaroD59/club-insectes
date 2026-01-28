// Data for the quiz and the clubs (Revised for lighter content)
const questions = [
  {
    id: "q1",
    text: "Aimes-tu voler haut et courir vite ? 💨",
    options: [
      { fr: "J'aime !", en: "Yes, I love to move !", value: "action" },
      { fr: "Je n'aime pas.", en: "No, I prefer to be calm.", value: "calm" },
    ],
  },
  {
    id: "q2",
    text: "Préfères-tu ranger des billes ou de la ficelle ? 🟡🕸️",
    options: [
      {
        fr: "J'aime !",
        en: "Yes, I like to build and play games.",
        value: "play",
      },
      { fr: "Je n'aime pas.", en: "No, I prefer silly fun.", value: "silly" },
    ],
  },
  {
    id: "q3",
    text: "Préfères-tu cueillir des fleurs 🌸 ou collectionner des pierres brillantes ? 💎",
    options: [
      {
        fr: "J'aime les pierres brillantes !",
        en: "Shiny stones !",
        value: "calm",
      },
      { fr: "Je préfère les fleurs !", en: "Flowers/Nature!", value: "silly" },
    ],
  },
  {
    id: "q4",
    text: "Aimes-tu lire des livres ou chanter très fort ? 📚📢",
    options: [
      { fr: "J'aime lire !", en: "Reading is cool.", value: "calm" },
      { fr: "J'aime chanter fort !", en: "Loud is fun !", value: "silly" },
    ],
  },
  {
    id: "q5",
    text: "Préfères-tu grimper à un arbre 🌳 ou te cacher sous une feuille ? 🍁",
    options: [
      { fr: "J'aime grimper !", en: "Climbing is the best.", value: "action" },
      { fr: "J'aime me cacher !", en: "Hiding is better !", value: "silly" },
    ],
  },
];

const clubs = {
  action: {
    name: "The ZOOM CLUB ! 🚀 (Le Club de la Vitesse)",
    photo: "./img/zoom.png",
    description:
      "You love running, jumping, and playing Tag ! Your friends are the Grasshoppers and the fast Bees. You will train on the 'La Marelle' and 'Jouer à Chat' circuits !",
  },
  calm: {
    name: "The WISE BEETLE CLUB ! 🤓 (Le Club des Sages)",
    photo: "./img/wise-beetle.png",
    description:
      "You like quiet activities like reading, organizing your marbles, and swinging gently. Your friends are the Caterpillars and the quiet Ladybugs. You will have a special library access !",
  },
  silly: {
    name: "The FUN CHAOS CLUB ! 🤪 (Le Club des Bêtises)", // Renamed to FUN CHAOS
    photo: "./img/fun-chaos.png",
    description:
      "You love making noise, being funny, hiding in strange places, and playing with silly toys! Your friends are the funny Worms and the chaotic Moths. Your club motto is 'VIVRE SANS LES RÈGLES !'",
  },
  play: {
    name: "The TOY MASTER CLUB ! 👑 (Le Club des Jouets)",
    photo: "./img/toy-master.png",
    description:
      "You are the master of recess games! You love marbles, Yo-Yo, and jump rope. Your friends need your help to organize the best games every day !",
  },
};

let answers = {};
const quizContainer = document.getElementById("quiz-container");
const submitBtn = document.getElementById("submit-btn");

// Function to render the questions
function renderQuestions() {
  quizContainer.innerHTML = ""; // Clear existing content
  questions.forEach((q) => {
    const qDiv = document.createElement("div");
    qDiv.className = "question-box";
    // Ensure question text is in French as requested, but the options show English translation
    qDiv.innerHTML = `<h3 class="text-xl font-semibold mb-4 text-green-800">${q.text}</h3>`;

    q.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn mb-2";
      btn.setAttribute("data-question-id", q.id);
      btn.setAttribute("data-value", option.value);
      btn.innerHTML = `
                        <span class="text-2xl">${option.fr}</span>
                        <span class="text-sm text-gray-500">${option.en}</span>
                    `;
      btn.onclick = (e) => selectChoice(q.id, option.value, e.currentTarget);
      qDiv.appendChild(btn);
    });
    quizContainer.appendChild(qDiv);
  });
  updateSubmitButton();
}

// Function to handle selection
function selectChoice(questionId, value, element) {
  answers[questionId] = value;

  // Remove 'selected' class from siblings
  Array.from(element.parentNode.children).forEach((child) => {
    child.classList.remove("selected");
  });
  // Add 'selected' class to the clicked element
  element.classList.add("selected");

  updateSubmitButton();
}

// Function to check if all questions are answered
function updateSubmitButton() {
  const allAnswered = Object.keys(answers).length === questions.length;
  submitBtn.disabled = !allAnswered;
}

// Function to calculate and display the club
function determineClub() {
  // Tally the votes for each club type
  const tally = { action: 0, calm: 0, silly: 0, play: 0 };

  // We need to look up the VALUE from the selected option to tally
  Object.values(answers).forEach((value) => {
    // Check against the initial value types
    if (tally.hasOwnProperty(value)) {
      tally[value]++;
    } else if (value === "play") {
      tally.play++;
    }
  });

  // Simple majority vote: find the type with the highest count
  let maxCount = -1;
  let winningType = "silly"; // Default/Fallback club is the SILLY club!

  // Find the highest score
  for (const type in tally) {
    if (tally[type] > maxCount) {
      maxCount = tally[type];
      winningType = type;
    }
  }

  // If there's a tie, prioritize 'play' > 'action' > 'calm'
  if (tally["play"] === maxCount && maxCount > 0) winningType = "play";
  else if (tally["action"] === maxCount && maxCount > 0) winningType = "action";
  else if (tally["calm"] === maxCount && maxCount > 0) winningType = "calm";
  // 'silly' remains the winner if it ties with others or is the highest.

  const resultClub = clubs[winningType];

  document.getElementById("club-name").textContent = resultClub.name;
  document.getElementById("club-description").textContent =
    resultClub.description;
  document.getElementById("club-img").src = resultClub.photo;
  document.getElementById("quiz-container").classList.add("hidden");
  document.getElementById("submit-btn").classList.add("hidden");
  document.getElementById("result-display").classList.remove("hidden");

  // Scroll to the result
  document
    .getElementById("result-display")
    .scrollIntoView({ behavior: "smooth" });
}

// Function to reset the quiz
function resetQuiz() {
  answers = {};
  document.getElementById("quiz-container").classList.remove("hidden");
  document.getElementById("submit-btn").classList.remove("hidden");
  document.getElementById("result-display").classList.add("hidden");
  renderQuestions(); // Re-render to clear selections visually
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Initial setup
window.onload = renderQuestions;
