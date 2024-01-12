document.addEventListener("DOMContentLoaded", function () {
  let body = document.body;

  let gameModal = document.createElement("div");
  gameModal.className = "game-modal";

  let content = document.createElement("div");
  content.className = "content";

  let lostGif = document.createElement("img");
  lostGif.src = "images/lost.gif";
  lostGif.alt = "gif lost";

  let gameOverHeading = document.createElement("h4");
  gameOverHeading.textContent = "Game Over!";

  let correctWordParagraph = document.createElement("p");
  correctWordParagraph.innerHTML = "The correct word was <b>rainbow</b>";

  let playAgainButton = document.createElement("button");
  playAgainButton.className = "play-again";
  playAgainButton.textContent = "Play Again";

  let container = document.createElement("div");
  container.className = "container";

  let hangmanBox = document.createElement("div");
  hangmanBox.className = "hangman-box";

  let hangmanImg = document.createElement("img");
  hangmanImg.src = "images/hangman-0.svg";
  hangmanImg.alt = "hangman-img";

  let hangmanGameHeading = document.createElement("h1");
  hangmanGameHeading.textContent = "Hangman Game";

  let gameBox = document.createElement("div");
  gameBox.className = "game-box";

  let wordDisplayList = document.createElement("ul");
  wordDisplayList.className = "word-display";

  let hintText = document.createElement("h4");
  hintText.className = "hint-text";
  hintText.innerHTML = "Hint: <b></b>";

  let guessesText = document.createElement("h4");
  guessesText.className = "guesses-text";
  guessesText.innerHTML = "Incorrect guesses: <b></b>";

  let keyboardDiv = document.createElement("div");
  keyboardDiv.className = "keyboard";

  content.appendChild(lostGif);
  content.appendChild(gameOverHeading);
  content.appendChild(correctWordParagraph);
  content.appendChild(playAgainButton);

  gameModal.appendChild(content);

  hangmanBox.appendChild(hangmanImg);
  hangmanBox.appendChild(hangmanGameHeading);

  gameBox.appendChild(wordDisplayList);
  gameBox.appendChild(hintText);
  gameBox.appendChild(guessesText);
  gameBox.appendChild(keyboardDiv);

  container.appendChild(hangmanBox);
  container.appendChild(gameBox);

  body.appendChild(gameModal);
  body.appendChild(container);
});

document.addEventListener("DOMContentLoaded", function () {
  const wordDisplay = document.querySelector(".word-display");
  const hangmanImage = document.querySelector(".hangman-box img");
  const guessesText = document.querySelector(".guesses-text b");
  const keyboardDiv = document.querySelector(".keyboard");
  const gameModal = document.querySelector(".game-modal");
  const playAgainBtn = document.querySelector(".play-again");

  let currentWord,
    correctLetters = [],
    wrongGuessCount = 0;
  const maxGuesses = 6;

  const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    keyboardDiv
      .querySelectorAll("button")
      .forEach((btn) => (btn.disabled = false));
    wordDisplay.innerHTML = currentWord
      .split("")
      .map(() => `<li class="letter"></li>`)
      .join("");
    gameModal.classList.remove("show");
  };

  const getRandomWord = () => {
    const { word, hint } =
      wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
    wordDisplay.innerHTML = word
      .split("")
      .map(() => `<li class="letter"></li>`)
      .join("");
    console.log("The secret word: " + word);
  };

  const gameOver = (isVictory) => {
    setTimeout(() => {
      const modalText = isVictory
        ? `You found the word:`
        : `The correct word was:`;
      gameModal.querySelector("img").src = `images/${
        isVictory ? `victory` : `lost`
      }.gif`;
      gameModal.querySelector("h4").innerText = `${
        isVictory ? `Congrats!` : `Game Over!`
      }`;
      gameModal.querySelector("p").innerHTML = `${modalText}
      <b>${currentWord}</b>`;
      gameModal.classList.add("show");
    }, 100);
  };

  const InitGame = (button, clickedLetter) => {
    if (currentWord.includes(clickedLetter)) {
      [...currentWord].forEach((letter, index) => {
        if (letter === clickedLetter) {
          correctLetters.push(letter);
          wordDisplay.querySelectorAll("li")[index].innerText = letter;
          wordDisplay.querySelectorAll("li")[index].classList.add("quessed");
        }
      });
    } else {
      wrongGuessCount++;
      hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }
    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
  };

  for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    const currentLetter = String.fromCharCode(i);
    button.innerText = currentLetter;
    button.setAttribute("data-letter", currentLetter);
    keyboardDiv.appendChild(button);

    button.addEventListener("click", (e) => InitGame(e.target, currentLetter));
  }

  const handleKeyboardInput = (event) => {
    const pressedKey = event.key.toLowerCase();
    const validLetters = /^[a-z]$/;

    if (validLetters.test(pressedKey)) {
      const button = keyboardDiv.querySelector(
        `button[data-letter='${pressedKey}']`
      );

      if (button && !button.disabled && wrongGuessCount < maxGuesses) {
        InitGame(button, pressedKey);
      }
    }
  };

  getRandomWord();
  playAgainBtn.addEventListener("click", getRandomWord);
  document.addEventListener("keydown", handleKeyboardInput);
});
