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
const stop = document.getElementById("stop");
const input = document.querySelector("input");
const volMoins = document.getElementById("moins");
const volPlus = document.getElementById("plus");
const volumeDiv = document.getElementById("volume");
const volumeText = document.getElementById("volText");
let v = 0.5;
let w = 5;

// Timer
let startButton = document.querySelector("[data-action=start]");
let stopButton = document.querySelector("[data-action=stop]");
let seconds = document.querySelector(".seconds");
let timerContainer = document.querySelector(".timer");
let timerTime = 0;
let isRunning = false;
let rankChansons;
let chansonsTrouvees = 0;

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
  stop.style.display = "none";
  volumeDiv.style.display = "none";
  score = 0;
  vies = 3;
  jouer();
  volumeText.innerHTML = `50%`;
}

init();

function jouer() {
  boutonJouer.addEventListener("click", () => {
    playSong(w);
    boutonJouer.style.display = "none";
    boutonValider.style.display = "block";
    input.style.display = "block";
    boutonReponse.style.display = "block";
    volumeDiv.style.display = "block";
  });
}

function audioPlay(y) {
  audio = new Audio();
  audio.src = `assets/${y}.mp3`;
  audio.currentTime = 0;
  audio.play();
  audio.volume = `0.${w}`;
}

function audioStop(y) {
  audio.src = `assets/${y}.mp3`;
  audio.currentTime = 0;
  audio.pause();
}

volMoins.addEventListener("click", () => {
  if (w <= 1) {
    w = 0;
    volumeText.innerHTML = `<i class="fas fa-volume-mute"></i>`;
  } else {
    w = w - 1;
    volumeText.innerHTML = `${w}0 %`;
  }
  audio.volume = `0.${w}`;
});

volPlus.addEventListener("click", () => {
  if (w >= 9) {
    w = 9;
    volumeText.innerHTML = `100 %`;
  } else {
    w = w + 1;
    volumeText.innerHTML = `${w}0 %`;
  }
  audio.volume = `0.${w}`;
});

function nombreAleatoire(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSong(x) {
  song = songs[x].titre;
  songTitle = songs[x].titre.toLocaleLowerCase();
  songID = songs[x].identifiant;
}

function playSong(w) {
  i = nombreAleatoire(1, 67);
  x = i - 1;
  getSong(x);
  y = songID;
  boutonReponse.style.display = "block";
  boutonRejouer.style.display = "block";
  stop.style.display = "none";
  reponseDiv.innerHTML = "";
  seconds.textContent = "0";
  startTimer();
  audioPlay(y, v);
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
      audioStop();
      scoreChecker();
      stopTimer();
      chronoChecker();
      boutonRejouer.style.display = "none";
      boutonReponse.style.display = "none";
      boutonValider.style.display = "none";
      seconds.style.display = "none";
      stop.style.display = "block";
      inputValue = "";
      input.value = "";
      chansonsTrouvees = chansonsTrouvees + 1;
      trouveesDiv.innerHTML = `Chansons trouvées : ${chansonsTrouvees}`;
    } else if (scorePourcent < 75 && inputValue != "") {
      vies = vies - 1;
      viesDIV.innerHTML = `<h1>${vies}</h1>`;
      scoreChecker();
    }
  });
}
valider();

stop.addEventListener("click", () => {
  playSong(w);
  boutonValider.style.display = "block";
});

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
    displaySongList(tableauDesScores);
    displayRankSongs(tableauChansons);
    stopTimer();
    seconds.style.display = "none";
    volumeDiv.style.display = "none";
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
    audioStop();
    vies = vies - 1;
    viesDIV.innerHTML = `<h1>${vies}</h1>`;
    scoreChecker();
    audio.volume = `0.${w}`;
    audioPlay(y, v);
  });
}

boutonNouvellePartie.addEventListener("click", () => {
  score = 0;
  vies = 3;
  stopTimer();
  audioStop();
  playSong(w);
  boutonRejouer.style.display = "block";
  input.style.display = "block";
  boutonValider.style.display = "block";
  boutonNouvellePartie.style.display = "none";
  inputValue = "";
  input.value = "";
  scoreDIV.innerHTML = `<h1>${score}</h1>`;
  viesDIV.innerHTML = `<h1><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i></h1>`;
  seconds.style.display = "block";
  chansonsTrouvees = 0;
  volumeDiv.style.display = "block";
});

function displaySongList(tableauDesScores) {
  let listingScore = tableauDesScores.map((score) => `<div>${score}</div>`).join("");
  rankDIV.innerHTML += listingScore;
}

function displayRankSongs(tableauChansons) {
  let listingSongs = tableauChansons.map((score) => `<div>${score}</div>`).join("");
  rankDIV.innerHTML += listingSongs;
}

function voirReponse(w) {
  vies = vies - 1;
  score = score + 0;
  scoreChecker();
  stopTimer();
  seconds.style.display = "none";
}

boutonReponse.addEventListener("click", () => {
  audioStop();
  reponseDiv.innerHTML = `${song}`;
  voirReponse(w);
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
  nextSong(w);
});

function nextSong(w) {
  playSong(w);
  reponseDiv.innerHTML = "";
  boutonSuivant.style.display = "none";
  input.style.display = "block";
  boutonValider.style.display = "block";
  boutonReponse.style.display = "block";
}

boutonJouer.addEventListener("click", startTimer);

function chronoChecker() {
  if (seconds.textContent <= 3) {
    score = score + 5;
    scoreDIV.innerHTML = `<h1>${score}</h1>`;
    console.log("+5");
    console.log(seconds.textContent + " secs");
  } else if (seconds.textContent > 4 && seconds.textContent <= 8) {
    score = score + 3;
    scoreDIV.innerHTML = `<h1>${score}</h1>`;
    console.log("+3");
    console.log(seconds.textContent + " secs");
  } else if (seconds.textContent > 8 && seconds.textContent <= 14) {
    score = score + 2;
    scoreDIV.innerHTML = `<h1>${score}</h1>`;
    console.log("+2");
    console.log(seconds.textContent + " secs");
  } else if (seconds.textContent > 14 && seconds.textContent <= 59) {
    score = score + 1;
    scoreDIV.innerHTML = `<h1>${score}</h1>`;
    console.log("+1");
    console.log(seconds.textContent + " secs");
  } else if (seconds.textContent > 59) {
    score = score + 0;
    scoreDIV.innerHTML = `<h1>${score}</h1>`;
    console.log("+0");
    console.log(seconds.textContent + " secs");
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

rejouer(w);
