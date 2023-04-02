import { songs } from "./data.js";

const boutonValider = document.getElementById("valider");
const boutonJouer = document.getElementById("jouer");
const boutonRejouer = document.getElementById("replay");
const boutonNouvellePartie = document.getElementById("newGame");
const boutonReponse = document.getElementById("reponse");
const boutonSuivant = document.getElementById("suivant");
const scoreDIV = document.getElementById("score");
const viesDIV = document.getElementById("vies");
const rankDIV = document.getElementById("rank");
const reponseDiv = document.getElementById("titreChanson");
const trouveesDiv = document.getElementById("chansonstrouvees");
const input = document.querySelector("input");

// Timer
let startButton = document.querySelector("[data-action=start]");
let stopButton = document.querySelector("[data-action=stop]");
let seconds = document.querySelector(".seconds");
let secs = parseInt(seconds.textContent);
let timerContainer = document.querySelector(".timer");
let timerTime = 0;
let isRunning = false;
let rankChansons;
let chansonsTrouvees = 0;

let min = 1;
let max = 67;
let i;
let x;
let y;
let audio;
let inputValue = "";
let songTitle;
let songID;
let song;

let tableauChansons = [];
let tableauDesScores = [];
let score = 0;
let vies = 3;
let meilleurScore = 0;

function init() {
  boutonValider.style.display = "none";
  boutonRejouer.style.display = "none";
  input.style.display = "none";
  viesDIV.innerHTML = `<h1><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i></h1>`;
  boutonNouvellePartie.style.display = "none";
  boutonReponse.style.display = "none";
  boutonSuivant.style.display = "none";
  score = 0;
  vies = 3;
  jouer();
}

init();

function jouer() {
  boutonJouer.addEventListener("click", () => {
    playSong();
    boutonJouer.style.display = "none";
    boutonValider.style.display = "block";
    input.style.display = "block";
    boutonReponse.style.display = "block";
  });
}

function nombreAleatoire(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSong(x) {
  song = songs[x].titre;
  songTitle = songs[x].titre.toLocaleLowerCase();
  songID = songs[x].identifiant;
  console.log(song);
  console.log(songID);
}

function playSong() {
  i = nombreAleatoire(min, max);
  x = i - 1;
  getSong(x);
  y = songID;
  console.log(y + " y");
  audioPlay(y);
  boutonReponse.style.display = "block";
  boutonRejouer.style.display = "block";
  reponseDiv.innerHTML = "";
  seconds.textContent = "0";
  startTimer();
}

function audioPlay(y) {
  audio = new Audio();
  audio.src = `assets/${y}.mp3`;
  console.log(audio);
  audio.play();
}

input.addEventListener("input", (e) => {
  inputValue = e.target.value.toLocaleLowerCase();
});

function similarity(inputValue, songTitle) {
  let longer = inputValue;
  let shorter = songTitle;
  if (inputValue.length < songTitle.length) {
    longer = songTitle;
    shorter = inputValue;
  }
  let longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(inputValue, songTitle) {
  let costs = new Array();
  for (let i = 0; i <= inputValue.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= songTitle.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (inputValue.charAt(i - 1) != songTitle.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[songTitle.length] = lastValue;
  }
  return costs[songTitle.length];
}

function valider() {
  boutonValider.addEventListener("click", (e) => {
    e.preventDefault();
    let pourcent = similarity(inputValue, songTitle);
    let pourcentRound = pourcent * 100;
    let scorePourcent = Math.round(pourcentRound);
    if (scorePourcent > 75 && inputValue != "") {
      console.log(true);
      scoreChecker();
      stopTimer();
      chronoChecker();
      playSong();
      inputValue = "";
      input.value = "";
      chansonsTrouvees = chansonsTrouvees + 1;
      chansonsTrouvees.innerHTML = `Chansons trouvees : ${chansonsTrouvees}`;
    } else if (scorePourcent < 75 && inputValue != "") {
      vies = vies - 1;
      viesDIV.innerHTML = `<h1>${vies}</h1>`;
      console.log(false);
      scoreChecker();
      console.log(vies);
    }
  });
}
valider();

function scoreChecker() {
  if (vies <= 0) {
    viesDIV.innerHTML = `<h1>Perdu</h1>`;
    boutonRejouer.style.display = "none";
    input.style.display = "none";
    boutonValider.style.display = "none";
    boutonNouvellePartie.style.display = "block";
    meilleurScore = score;
    rankChansons = chansonsTrouvees;
    tableauDesScores.push(meilleurScore);
    tableauChansons.push(chansonsTrouvees);
    console.log(tableauDesScores);
    console.log(meilleurScore);
    displaySongList(tableauDesScores);
    displayRankSongs(tableauChansons);
    stopTimer();
    seconds.style.display = "none";
  }
  if (vies == 3) {
    viesDIV.innerHTML = `<h1><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i></h1>`;
  }

  if (vies == 2) {
    viesDIV.innerHTML = `<h1><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart-broken"></i></h1>`;
  }
  if (vies == 1) {
    viesDIV.innerHTML = `<h1><i class="fas fa-heart"></i><i class="fas fa-heart-broken"></i><i class="fas fa-heart-broken"></i></h1>`;
  }
}

function rejouer() {
  boutonRejouer.addEventListener("click", () => {
    vies = vies - 1;
    viesDIV.innerHTML = `<h1>${vies}</h1>`;
    scoreChecker();
  });
}

rejouer();

function nouvellePartie() {
  boutonNouvellePartie.addEventListener("click", () => {
    boutonRejouer.style.display = "block";
    input.style.display = "block";
    boutonValider.style.display = "block";
    boutonNouvellePartie.style.display = "none";
    vies = 3;
    score = 0;
    inputValue = "";
    input.value = "";
    scoreDIV.innerHTML = `<h1>${score}</h1>`;
    viesDIV.innerHTML = `<h1><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i></h1>`;
    playSong();
    stopTimer();
    seconds.style.display = "none";
    chansonsTrouvees = 0;
  });
}

nouvellePartie();

function displaySongList(tableauDesScores) {
  let listingScore = tableauDesScores.map((score) => `<div>${score}</div>`).join("");
  rankDIV.innerHTML += listingScore;
}

function displayRankSongs(tableauChansons) {
  let listingSongs = tableauChansons.map((score) => `<div>${score}</div>`).join("");
  rankDIV.innerHTML += listingSongs;
}

function voirReponse() {
  vies = vies - 1;
  score = score + 0;
  scoreChecker();
  stopTimer();
  seconds.style.display = "none";
}

function chansonSuivante() {
  playSong();
}

boutonReponse.addEventListener("click", () => {
  reponseDiv.innerHTML = `${song}`;
  voirReponse();
  input.style.display = "none";
  boutonValider.style.display = "none";

  boutonReponse.style.display = "none";
  if (vies <= 0) {
    boutonSuivant.style.display = "none";
  }
  if (vies == 3) {
    boutonSuivant.style.display = "block";
  }

  if (vies == 2) {
    boutonSuivant.style.display = "block";
  }
  if (vies == 1) {
    boutonSuivant.style.display = "block";
  }
  boutonRejouer.style.display = "none";
});

boutonSuivant.addEventListener("click", () => {
  chansonSuivante();
  reponseDiv.innerHTML = "";
  boutonSuivant.style.display = "none";
  input.style.display = "block";
  boutonValider.style.display = "block";
  boutonReponse.style.display = "block";
});

boutonJouer.addEventListener("click", startTimer);

function chronoChecker() {
  if (seconds.textContent <= 3) {
    score = score + 5;
    console.log(seconds.textContent + " chrono check");
    console.log("Inferieur ou egal à 4 + 5");
    scoreDIV.innerHTML = `<h1>${score}</h1>`;
  } else if (seconds.textContent > 4 && seconds.textContent <= 10) {
    score = score + 3;
    console.log(seconds.textContent + " chrono check");
    console.log("Entre 4 et 10 + 3");
    scoreDIV.innerHTML = `<h1>${score}</h1>`;
  } else if (seconds.textContent > 10 && seconds.textContent <= 30) {
    score = score + 2;
    console.log(seconds.textContent + " chrono check");
    console.log("Entre 10 et 30 + 2");
    scoreDIV.innerHTML = `<h1>${score}</h1>`;
  } else if (seconds.textContent > 30 && seconds.textContent <= 59) {
    score = score + 1;
    console.log(seconds.textContent + " chrono check");
    console.log("Entre 30 et 59 + 1");
    scoreDIV.innerHTML = `<h1>${score}</h1>`;
  } else if (seconds.textContent > 59) {
    score = score + 0;
    console.log(seconds.textContent + " chrono check");
    console.log("Plus de 60 + 0");
    scoreDIV.innerHTML = `<h1>${score}</h1>`;
  }
}

let interval;

// Fonctions pour le Timer
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  interval = setInterval(incrementTimer, 1000);
  seconds.style.display = "block";
}

function stopTimer() {
  if (!isRunning) return;
  isRunning = false;
  timerTime = 0;
  clearInterval(interval);
}

function pad(number) {
  return number < 10 ? +number : number;
}

function incrementTimer() {
  timerTime++;
  const numOfSeconds = timerTime;
  if (seconds.textContent > 59) {
    seconds.innerText = "Tu as dépassé une minute !";
    stopTimer();
  } else {
    seconds.innerText = pad(numOfSeconds);
  }
}
