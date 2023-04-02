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
const input = document.querySelector("input");

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

let tableauDesScores = [];
let score;
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
      score = score + 1;
      scoreDIV.innerHTML = `<h1>${score}</h1>`;
      console.log(true);
      scoreChecker();
      playSong();
      inputValue = "";
      input.value = "";
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
    tableauDesScores.push(meilleurScore);
    console.log(tableauDesScores);
    console.log(meilleurScore);
    displaySongList(tableauDesScores);
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
    viesDIV.innerHTML = `<h1><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i></h1>`;
    playSong();
  });
}

nouvellePartie();

function displaySongList(tableauDesScores) {
  let listingScore = tableauDesScores.map((score) => `<div>${score}</div>`).join("");
  rankDIV.innerHTML = listingScore;
}

function voirReponse() {
  vies = vies - 1;
  score = score + 0;
  scoreChecker();
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
