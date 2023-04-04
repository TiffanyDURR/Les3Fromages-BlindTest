import { songs } from "./data.js";

// DOM - Containers
const scoreContainer = document.getElementById("score");
const livesContainer = document.getElementById("lives");
const songTitleContainer = document.getElementById("songTitle");
const bonusContainer = document.getElementById("bonus");
const guessedSongsContainer = document.getElementById("guessedSongs");
const animatedItemContainer = document.getElementById("animatedItem");
const form = document.querySelector("form");
const input = document.getElementById("mainInput");
const inputPlayerName = document.getElementById("playerName");
const gameContainer = document.getElementById("game");
const launcherContainer = document.getElementById("launcher");
const playerNameContainer = document.getElementById("playerNameContainer");
const PlayerNameErrorContainer = document.getElementById("PlayerNameError");
const ScoreLeaderboardContainer = document.getElementById("ScoreLeaderboard");

// Ranked

const rankedPlayerNameContainer = document.getElementById("rankedPlayerName");
const rankedScoreContainer = document.getElementById("rankedScore");
const rankedGuessedSongsContainer = document.getElementById("rankedGuessedSongs");
let rankedPlayerNameTable = [];
let rankedScoreTable = [];
let rankedGuessedSongsTable = [];

// DOM - Buttons
const submitButton = document.getElementById("mainSubmit");
const startGameButton = document.getElementById("startGame");
const listenAgainButton = document.getElementById("listenAgain");
const newGameButton = document.getElementById("newGame");
const nextSongButton = document.getElementById("nextSong");
//// Display "songTitleContainer"
const showSolutionButton = document.getElementById("showSolution");

// DOM - Settings
//// Audio
const turnDownVolumeButton = document.getElementById("turnDownVolume");
const turnUpVolumeButton = document.getElementById("turnUpVolume");

//// Variables
let audio;
let v = 0.3;
let w = 3;

// Timer
let startButton = document.querySelector("[data-action=start]");
let stopButton = document.querySelector("[data-action=stop]");
let seconds = document.getElementById("seconds");
let timerContainer = document.getElementById("timer");
let timerTime = 0;
let isRunning = false;
let interval;

// Variables
//// Random Number
let i;
//// Song Index
let x;
//// Song ID
let y;
let inputValue = "";
let bonusInfos = "";
let playerNameValue = "";

// Data
let songTitle;
let songID;
let song;

// Infos Game
let guessedSongs = 0;
let score = 0;
let lives = 3;

function init() {
  livesContainer.innerHTML = `<i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i>`;
  gameContainer.style.display = "none";
  ScoreLeaderboardContainer.style.display = "none";
  nextSongButton.style.display = "none";
  score = 0;
  lives = 3;
  startGame();
  newGameButton.style.display = `none`;
}

init();

inputPlayerName.addEventListener("input", (e) => {
  playerNameValue = e.target.value;
  PlayerNameErrorContainer.innerHTML = ``;

  if (playerNameValue.length < 1) {
    inputPlayerName.style = `border: 1px solid #e34069`;
    PlayerNameErrorContainer.innerHTML = `Tu dois indiquer un pseudo`;
  }
  if (playerNameValue.length >= 1 && playerNameValue.length <= 16) {
    inputPlayerName.style = `border: none`;
    PlayerNameErrorContainer.innerHTML = ``;
  }
  if (playerNameValue.length > 16) {
    inputPlayerName.style = `border: 1px solid #e34069`;
    PlayerNameErrorContainer.innerHTML = `Ton pseudo doit contenir 16 caractères maximum !`;
  }
});

function startGame() {
  startGameButton.addEventListener("click", () => {
    if (playerNameValue.length < 1) {
      PlayerNameErrorContainer.innerHTML = `Tu dois indiquer un pseudo`;
      inputPlayerName.style = `border: 1px solid #e34069`;
      setTimeout(() => {
        PlayerNameErrorContainer.innerHTML = ``;
        inputPlayerName.style = `border: none`;
      }, 4000);
    }
    if (playerNameValue.length >= 1 && playerNameValue.length <= 16) {
      playerNameContainer.innerHTML = playerNameValue;
      playSong(w);
      gameContainer.style.display = "flex";
      launcherContainer.style.display = "none";
    }
    if (playerNameValue.length > 16) {
      PlayerNameErrorContainer.innerHTML = `Ton pseudo doit contenir 16 caractères maximum !`;
      inputPlayerName.style = `border: 1px solid #e34069`;
      setTimeout(() => {
        PlayerNameErrorContainer.innerHTML = ``;
        inputPlayerName.style = `border: none`;
      }, 4000);
    }
  });
}

turnDownVolumeButton.addEventListener("click", () => {
  turnUpVolumeButton.innerHTML = `<i style="color: #b6b6b6" class="fas fa-volume-up"></i>`;
  if (w <= 1) {
    w = 0;
    turnDownVolumeButton.innerHTML = `<i style="color: #2e2e2e" class="fas fa-volume-mute"></i>`;
  } else {
    w = w - 1;
    turnDownVolumeButton.innerHTML = `  <i style="color: #b6b6b6" class="fas fa-volume-down"></i>`;
  }
  audio.volume = `0.${w}`;
});

turnUpVolumeButton.addEventListener("click", () => {
  turnDownVolumeButton.innerHTML = `<i style="color: #b6b6b6" class="fas fa-volume-down"></i>`;
  if (w >= 9) {
    w = 9;
    turnUpVolumeButton.innerHTML = `<i style="color: #2e2e2e" class="fas fa-volume-up"></i>`;
  } else {
    w = w + 1;
    turnUpVolumeButton.innerHTML = `<i style="color: #b6b6b6" class="fas fa-volume-up"></i>`;
  }
  audio.volume = `0.${w}`;
});

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSong(x) {
  song = songs[x].songName;
  songTitle = songs[x].songName.toLocaleLowerCase();
  songID = songs[x].songIndex;
}

function playSong() {
  i = generateRandomNumber(1, 67);
  x = i - 1;
  getSong(x);
  y = songID;
  songTitleContainer.innerHTML = "";
  seconds.textContent = "0";
  startTimer();
  audioPlay(y, v);
  animatedItemContainer.innerHTML = `Devine le titre !`;
  newGameButton.style.display = `none`;
}

function audioPlay(y) {
  audio = new Audio();
  audio.src = `assets/${y}.mp3`;
  audio.currentTime = 0;
  audio.play();
  audio.volume = `0.${w}`;
}

function audioStop(y) {
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

function submitMobile() {
  submitButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    let pourcent = similarity(inputValue, songTitle);
    let pourcentRound = pourcent * 100;
    let scorePourcent = Math.round(pourcentRound);
    if (scorePourcent > 75 && inputValue != "") {
      hide();
      nextSongButton.style.display = "flex";
      scoreChecker();
      chronoChecker();
      audioStop();
      stopTimer();
      inputValue = "";
      input.value = "";
      guessedSongs = guessedSongs + 1;
      if (guessedSongs == 1) {
        guessedSongsContainer.innerHTML = `Chanson trouvée : ${guessedSongs}`;
      } else {
        guessedSongsContainer.innerHTML = `Chansons trouvées : ${guessedSongs}`;
      }

      animatedItemContainer.innerHTML = `${song}`;
    } else if (scorePourcent < 75 && inputValue != "") {
      lives = lives - 1;
      livesContainer.innerHTML = `${lives}`;
      scoreChecker();
      bonusInfos = `<i class="fas fa-skull"></i>`;
      bonusAnimated(bonusInfos);
      if (lives == 2) {
        animatedItemContainer.innerHTML = `Mauvaise réponse !`;
      }
      if (lives == 1) {
        animatedItemContainer.innerHTML = `Faux ! <br>Plus qu'une vie !`;
      }
    }
  });
}
submitMobile();

function submit() {
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    let pourcent = similarity(inputValue, songTitle);
    let pourcentRound = pourcent * 100;
    let scorePourcent = Math.round(pourcentRound);
    if (scorePourcent > 75 && inputValue != "") {
      hide();
      nextSongButton.style.display = "flex";
      scoreChecker();
      chronoChecker();
      audioStop();
      stopTimer();
      inputValue = "";
      input.value = "";
      guessedSongs = guessedSongs + 1;
      if (guessedSongs == 1) {
        guessedSongsContainer.innerHTML = `Chanson trouvée : ${guessedSongs}`;
      } else {
        guessedSongsContainer.innerHTML = `Chansons trouvées : ${guessedSongs}`;
      }

      animatedItemContainer.innerHTML = `${song}`;
    } else if (scorePourcent < 75 && inputValue != "") {
      lives = lives - 1;
      livesContainer.innerHTML = `${lives}`;
      scoreChecker();
      bonusInfos = `<i class="fas fa-skull"></i>`;
      bonusAnimated(bonusInfos);
      if (lives == 2) {
        animatedItemContainer.innerHTML = `Mauvaise réponse !`;
      }
      if (lives == 1) {
        animatedItemContainer.innerHTML = `Faux ! <br>Plus qu'une vie !`;
      }
    }
  });
}
submit();

function scoreChecker() {
  if (lives <= 0) {
    livesContainer.innerHTML = `<span class="looser">Perdu</span`;
    animatedItemContainer.innerHTML = `<i class="fas fa-skull"></i>`;
    stopTimer();
    hide();
  }
  if (lives == 2) {
    livesContainer.innerHTML = `<i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart-broken"></i>`;
    animatedItemContainer.innerHTML = `Dommage !`;
  }
  if (lives == 1) {
    livesContainer.innerHTML = `<i class="fas fa-heart"></i><i class="fas fa-heart-broken"></i><i class="fas fa-heart-broken"></i>`;
    animatedItemContainer.innerHTML = `Plus qu'une vie !`;
  }
  if (lives < 1) {
    newGameButton.style.display = "flex";
    songTitleContainer.innerHTML = `Réponse :<span> ${song}</span>`;
  }
}

function saveRanked() {
  rankedPlayerNameTable.push(playerNameInput);
  rankedGuessedSongsTable.push(guessedSongs);
  rankedScoreTable.push(score);
  displayScoreLeaderboardData();
}

function displayScoreLeaderboardData() {
  function displayRankedName(rankedPlayerNameTable) {
    const rankedItems = rankedPlayerNameTable.map((rankedData) => `<li>${rankedData}</li>`).join("");
    rankedPlayerNameContainer.innerHTML = rankedItems;
  }
  displayRankedName(rankedPlayerNameTable);

  function displayRankedGuessedSongs(rankedGuessedSongsTable) {
    const rankedItems = rankedGuessedSongsTable.map((rankedData) => `<li>${rankedData}</li>`).join("");
    rankedGuessedSongsContainer.innerHTML = rankedItems;
  }
  displayRankedGuessedSongs(rankedGuessedSongsTable);

  function displayrankedScoreTable(rankedScoreTable) {
    const rankedItems = rankedScoreTable.map((rankedData) => `<li>${rankedData}</li>`).join("");
    rankedScoreContainer.innerHTML = rankedItems;
  }
  displayrankedScoreTable(rankedScoreTable);
}

function listenAgain() {
  listenAgainButton.addEventListener("click", () => {
    audioStop();
    score = score - 1;
    scoreContainer.innerHTML = `<span>Score</span>${score}`;
    scoreChecker();
    audio.volume = `0.${w}`;
    audioPlay(y, v);
    bonusInfos = `-1 point !`;
    bonusAnimated(bonusInfos);
  });
}

newGameButton.addEventListener("click", () => {
  score = 0;
  lives = 3;
  stopTimer();
  audioStop();
  playSong(w);
  inputValue = "";
  input.value = "";
  scoreContainer.innerHTML = `<span>Score</span>${score}`;
  livesContainer.innerHTML = `<i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i>`;
  guessedSongs = 0;
  unhide();
});

function displaySolution() {
  lives = lives - 1;
  score = score + 0;
  scoreChecker();
  stopTimer();
}

showSolutionButton.addEventListener("click", () => {
  audioStop();
  songTitleContainer.innerHTML = `<span>Réponse : </span>  ${song}</span>`;
  displaySolution(w);
  scoreChecker();
  inputValue = "";
  input.value = "";
  nextSongButton.style.display = "flex";
  if (lives <= 0) {
    nextSongButton.style.display = "none";
  }
  hide();
});

function hide() {
  input.style.display = "none";
  listenAgainButton.style.display = "none";
  showSolutionButton.style.display = "none";
}

function unhide() {
  input.style.display = "flex";
  listenAgainButton.style.display = "flex";
  showSolutionButton.style.display = "flex";
}

function nextSong(w) {
  playSong(w);
  songTitleContainer.innerHTML = "";
  timerContainer.style.display = "block";
}

startGameButton.addEventListener("click", startTimer);

function chronoChecker() {
  if (seconds.textContent > 0 && seconds.textContent <= 3) {
    score = score + 5;
    scoreContainer.innerHTML = `<span>Score</span>${score}`;

    bonusInfos = `+5 Points`;
    bonusAnimated(bonusInfos);
  } else if (seconds.textContent > 3 && seconds.textContent <= 8) {
    score = score + 3;
    scoreContainer.innerHTML = `<span>Score</span>${score}`;

    bonusInfos = `+3 Points`;
    bonusAnimated(bonusInfos);
  } else if (seconds.textContent > 8 && seconds.textContent <= 14) {
    score = score + 2;
    scoreContainer.innerHTML = `<span>Score</span>${score}`;

    bonusInfos = `+2 Points`;
    bonusAnimated(bonusInfos);
  } else if (seconds.textContent > 14 && seconds.textContent <= 59) {
    score = score + 1;
    scoreContainer.innerHTML = `<span>Score</span>${score}`;

    bonusInfos = `+1 Point`;
    bonusAnimated(bonusInfos);
  } else if (seconds.textContent > 59) {
    score = score + 0;
    scoreContainer.innerHTML = `<span>Score</span>${score}`;

    bonusInfos = `+0 Point`;
    bonusAnimated(bonusInfos);
  }
}

nextSongButton.addEventListener("click", () => {
  nextSong(w);
  nextSongButton.style.display = "none";
  input.style.display = "flex";
  listenAgainButton.style.display = "flex";
  showSolutionButton.style.display = "flex";
});

// Fonctions pour le Timer
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  interval = setInterval(incrementTimer, 1000);
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
listenAgain(w);

function bonusAnimated(bonusInfos) {
  bonusContainer.innerHTML = bonusInfos;
  bonusContainer.style.display = "inline-block";
  bonusContainer.classList.add("animatedBonus");
  setTimeout(() => {
    bonusContainer.style.display = "none";
  }, 1800);
}

const colors = ["#e34069", "#e34069", "#e34069"];
const bubbles = 8;

const explode = () => {
  let particles = [];
  let ratio = 1;
  let animParticles = document.querySelector(".animParticles");
  let c = document.querySelector("canvas");
  let ctx = c.getContext("2d");

  c.style.pointerEvents = "none";
  c.style.width = 200 + "px";
  c.style.height = 200 + "px";
  c.style.zIndex = 1;
  c.width = 200;
  c.height = 200;
  animParticles.appendChild(c);

  for (var m = 0; m < bubbles; m++) {
    particles.push({
      x: c.width / 2,
      y: c.height / 2,
      radius: r(20, 30),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: r(0, 360, true),
      speed: r(8, 12),
      friction: 0.9,
      opacity: r(1, 1, true),
      yVel: 0,
      gravity: 0.1,
    });
  }

  render(particles, ctx, c.width, c.height);
  setTimeout(() => animParticles.removeChild(c), 200);
  setTimeout(() => animParticles.appendChild(c), 200);
};

const render = (particles, ctx, width, height) => {
  requestAnimationFrame(() => render(particles, ctx, width, height));
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p, i) => {
    p.x += p.speed * Math.cos((p.rotation * Math.PI) / 180);
    p.y += p.speed * Math.sin((p.rotation * Math.PI) / 180);

    p.opacity -= 0.01;
    p.speed *= p.friction;
    p.radius *= p.friction;
    p.yVel += p.gravity;
    p.y += p.yVel;

    if (p.opacity < 0 || p.radius < 0) return;

    ctx.beginPath();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
    ctx.fill();
  });

  return ctx;
};

const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));

input.addEventListener("input", (e) => explode(e.pageX, e.pageY));
