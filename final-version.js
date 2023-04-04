import { songs } from "./blindTestData.js";

const boutonValider = document.getElementById("valider");
const boutonJouer = document.getElementById("jouer");
const boutonRejouer = document.getElementById("replay");
const boutonNouvellePartie = document.getElementById("newGame");
const boutonReponse = document.getElementById("reponse");
const boutonSuivant = document.getElementById("suivant");
const scoreDIV = document.getElementById("score");
const viesDIV = document.getElementById("vies");
const reponseDiv = document.getElementById("titreChanson");
const trouveesDiv = document.getElementById("chansonstrouvees");
const iVolumeDown = document.querySelector(".fa-volume-down");
const iVolumeUp = document.querySelector(".fa-volume-up");
const form = document.querySelector("form");
const bonus = document.getElementById("bonus");

const input = document.querySelector("input");
const volMoins = document.getElementById("moins");
const volPlus = document.getElementById("plus");
const volumeDiv = document.getElementById("volume");
const volumeTitre = document.querySelector(".volumeTitre");
const volumeText = document.getElementById("volText");
const lectureDIV = document.querySelector(".lecture");
let v = 0.5;
let w = 5;

// Timer
let startButton = document.querySelector("[data-action=start]");
let stopButton = document.querySelector("[data-action=stop]");
let seconds = document.querySelector(".seconds");
let timerContainer = document.querySelector(".timer");
let timerTime = 0;
let isRunning = false;
let chansonsTrouvees = 0;

let i;
let x;
let y;
let audio;
let inputValue = "";
let songTitle;
let songID;
let song;
let score = 0;
let vies = 3;

function init() {
  boutonValider.style.display = "none";
  boutonRejouer.style.display = "none";
  input.style.display = "none";
  form.style.display = "none";
  timerContainer.style.display = "none";
  viesDIV.innerHTML = `<h1><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i></h1>`;
  viesDIV.style.display = "none";
  boutonNouvellePartie.style.display = "none";
  boutonReponse.style.display = "none";
  boutonSuivant.style.display = "none";
  volumeDiv.style.display = "none";
  volumeTitre.style.display = "none";
  scoreDIV.style.display = "none";
  lectureDIV.style.display = "none";
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
    form.style.display = "flex";
    boutonReponse.style.display = "block";
    volumeTitre.style.display = "flex";
    volumeDiv.style.display = "flex";
    scoreDIV.style.display = "flex";
    viesDIV.style.display = "flex";
  });
}

volMoins.addEventListener("click", () => {
  iVolumeUp.style.color = "#e34069";
  iVolumeUp.style.border = "1px solid #e34069";
  if (w <= 1) {
    w = 0;
    iVolumeDown.style.color = "#383838";
    iVolumeDown.style.border = "1px solid #383838";
    volumeText.innerHTML = `<i class="fas fa-volume-mute"></i>`;
  } else {
    w = w - 1;
    iVolumeDown.style.color = "#e34069";
    iVolumeDown.style.border = "1px solid #e34069";
    volumeText.innerHTML = `${w}0 %`;
  }
  audio.volume = `0.${w}`;
});

volPlus.addEventListener("click", () => {
  iVolumeDown.style.color = "#e34069";
  iVolumeDown.style.border = "1px solid #e34069";
  if (w >= 9) {
    w = 9;
    volumeText.innerHTML = `100 %`;
    iVolumeUp.style.color = "#383838";
    iVolumeUp.style.border = "1px solid #383838";
  } else {
    w = w + 1;
    volumeText.innerHTML = `${w}0 %`;
    iVolumeUp.style.color = "#e34069";
    iVolumeUp.style.border = "1px solid #e34069";
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
  boutonSuivant.style.display = "none";
  scoreDIV.style.display = "flex";
  reponseDiv.innerHTML = "";
  viesDIV.style.display = "flex";
  seconds.textContent = "0";
  startTimer();
  audioPlay(y, v);
  lectureDIV.style.display = "flex";
  lectureDIV.innerHTML = `Devine le titre !<br />`;
}

function audioPlay(y) {
  audio = new Audio();
  audio.src = `assets/${y}.mp3`;
  audio.currentTime = 0;
  audio.play();
  audio.volume = `0.${w}`;
}

function audioStop() {
  audio.currentTime = 0;
  audio.pause();
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
  let r = 0;
  boutonValider.addEventListener("click", (e) => {
    e.preventDefault();
    let pourcent = similarity(inputValue, songTitle);
    let pourcentRound = pourcent * 100;
    let scorePourcent = Math.round(pourcentRound);
    if (scorePourcent > 75 && inputValue != "") {
      scoreChecker();
      chronoChecker();
      audioStop();
      stopTimer();
      boutonRejouer.style.display = "none";
      boutonReponse.style.display = "none";
      boutonValider.style.display = "none";
      seconds.style.display = "none";
      timerContainer.style.display = "none";
      inputValue = "";
      input.value = "";
      chansonsTrouvees = chansonsTrouvees + 1;
      trouveesDiv.innerHTML = `Chansons trouvées : ${chansonsTrouvees}`;
      boutonSuivant.style.display = "block";
      lectureDIV.innerHTML = `${song}`;
      input.style.display = "none";
    } else if (scorePourcent < 75 && inputValue != "") {
      vies = vies - 1;
      viesDIV.innerHTML = `<h1>${vies}</h1>`;
      scoreChecker();
      bonus.innerHTML = `<i class="fas fa-skull"></i>`;
      bonus.style.display = "block";
      bonus.classList.add("animation");
      setTimeout(() => {
        bonus.style.display = "none";
      }, 1800);
      if (vies > 1 && vies < 4) {
        lectureDIV.innerHTML = `Ce n'est pas le bon titre !`;
      }
      if (vies == 1) {
        lectureDIV.innerHTML = `Tu n'as plus qu'une vie !`;
      }
      if (vies < 1) {
        lectureDIV.innerHTML = `Tu retentes ta chance ?!`;
        reponseDiv.innerHTML = `Réponse : <span class="color">${song}</span>`;
        bonus.style.display = "none";
      }
    }
  });
}
valider();

function scoreChecker() {
  if (vies <= 0) {
    viesDIV.innerHTML = `<h1 class="loose">Perdu</h1>`;
    boutonRejouer.style.display = "none";
    input.style.display = "none";
    form.style.display = "none";
    boutonValider.style.display = "none";
    boutonNouvellePartie.style.display = "block";
    stopTimer();
    seconds.style.display = "none";
    timerContainer.style.display = "none";
    volumeDiv.style.display = "none";
    volumeTitre.style.display = "none";
    boutonSuivant.style.display = "none";
    boutonReponse.style.display = "none";
    reponseDiv.style.display = "flex";
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
    score = score - 1;
    scoreDIV.innerHTML = `<h1><span>Score</span>${score}</h1>`;
    viesDIV.innerHTML = `<h1>${vies}</h1>`;
    scoreChecker();
    audio.volume = `0.${w}`;
    audioPlay(y, v);
    bonus.innerHTML = `-1 point !`;
    bonus.style.display = "block";
    bonus.classList.add("animation");
    setTimeout(() => {
      bonus.style.display = "none";
    }, 1800);
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
  form.style.display = "flex";
  boutonValider.style.display = "block";
  boutonNouvellePartie.style.display = "none";
  inputValue = "";
  input.value = "";
  scoreDIV.innerHTML = `<h1><span>Score</span>${score}</h1>`;
  viesDIV.innerHTML = `<h1><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i></h1>`;
  seconds.style.display = "block";
  timerContainer.style.display = "flex";
  chansonsTrouvees = 0;
  volumeDiv.style.display = "flex";
  volumeTitre.style.display = "flex";
  scoreDIV.style.display = "flex";
  viesDIV.style.display = "flex";
});

function voirReponse(w) {
  vies = vies - 1;
  score = score + 0;
  scoreChecker();
  stopTimer();
  seconds.style.display = "none";
  timerContainer.style.display = "none";
}

boutonReponse.addEventListener("click", () => {
  audioStop();
  reponseDiv.innerHTML = `Réponse : <span class="color">${song}</span>`;
  voirReponse(w);
  input.style.display = "none";
  form.style.display = "none";
  boutonValider.style.display = "none";
  lectureDIV.style.display = "flex";
  lectureDIV.innerHTML = `<i class="fas fa-skull"></i>`;

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
  form.style.display = "flex";
  boutonValider.style.display = "block";
  boutonReponse.style.display = "block";
}

boutonJouer.addEventListener("click", startTimer);

function chronoChecker() {
  if (seconds.textContent > 0 && seconds.textContent <= 3) {
    score = score + 5;
    scoreDIV.innerHTML = `<h1><span>Score</span>${score}</h1>`;
    console.log("+5");
    bonus.innerHTML = `+5 Points`;
    bonus.style.display = "block";
    bonus.classList.add("animation");
    setTimeout(() => {
      bonus.style.display = "none";
    }, 1800);
  } else if (seconds.textContent > 3 && seconds.textContent <= 8) {
    score = score + 3;
    scoreDIV.innerHTML = `<h1><span>Score</span>${score}</h1>`;
    console.log("+3");
    bonus.innerHTML = `+3 Points`;
    bonus.style.display = "block";
    bonus.classList.add("animation");
    setTimeout(() => {
      bonus.style.display = "none";
    }, 1800);
  } else if (seconds.textContent > 8 && seconds.textContent <= 14) {
    score = score + 2;
    scoreDIV.innerHTML = `<h1><span>Score</span>${score}</h1>`;
    console.log("+2");
    bonus.innerHTML = `+2 Points`;
    bonus.style.display = "block";
    bonus.classList.add("animation");
    setTimeout(() => {
      bonus.style.display = "none";
    }, 1800);
  } else if (seconds.textContent > 14 && seconds.textContent <= 59) {
    score = score + 1;
    scoreDIV.innerHTML = `<h1><span>Score</span>${score}</h1>`;
    console.log("+1");
    bonus.innerHTML = `+1 Point`;
    bonus.style.display = "block";
    bonus.classList.add("animation");
    setTimeout(() => {
      bonus.style.display = "none";
    }, 1800);
  } else if (seconds.textContent > 59) {
    score = score + 0;
    scoreDIV.innerHTML = `<h1><span>Score</span>${score}</h1>`;
    console.log("+0");
    bonus.innerHTML = `+0 Point`;
    bonus.style.display = "block";
    bonus.classList.add("animation");
    setTimeout(() => {
      bonus.style.display = "none";
    }, 1800);
  }
}

let interval;

// Fonctions pour le Timer
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  interval = setInterval(incrementTimer, 1000);
  seconds.style.display = "block";
  timerContainer.style.display = "flex";
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
