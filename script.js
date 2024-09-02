const displayController = (() => {
  const displayMessage = (message) => {
    document.querySelector(".display-result").textContent = message;
  };

  const playerDisplayMessage = (playerDisplay) => {
    document.querySelector(".player-turn-message").textContent = playerDisplay;
  };

  const player1Score = (displayPlayer1Score) => {
    document.querySelector(".player1-scores").textContent = displayPlayer1Score;
  };

  const player2Score = (displayPlayer2Score) => {
    document.querySelector(".player2-scores").textContent = displayPlayer2Score;
  };

  const rounds = (displayRound) => {
    document.querySelector(".round").textContent = displayRound;
  };

  const winner = (displayWinner) => {
    document.querySelector(".display-winner").textContent = displayWinner;
  };

  return {
    displayMessage,
    playerDisplayMessage,
    player1Score,
    rounds,
    player2Score,
    winner,
  };
})();

const Gameboard = (() => {
  let gameboard = ["", "", "", "", "", "", "", "", ""];

  const render = () => {
    let boardHTML = "";
    gameboard.forEach((square, index) => {
      boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
    });

    document.querySelector(".gameboard").innerHTML = boardHTML;

    const squares = document.querySelectorAll(".square");
    console.log(squares);
    squares.forEach((square) => {
      square.addEventListener("click", Game.handleClick);
    });
  };

  const update = (index, value) => {
    gameboard[index] = value;
    render();
  };

  const getGameboard = () => gameboard;

  return {
    render,
    update,
    getGameboard,
  };
})();

const createPlayer = (name, mark, score) => {
  return { name, mark, score };
};

const Game = (() => {
  let players = [];
  let currentPlayerIndex;
  let gameOver;
  let playerOneScore;
  let playerTwoScore;
  let round;

  const start = () => {
    players = [
      createPlayer(document.querySelector("#player1").value, "X", 0),
      createPlayer(document.querySelector("#player2").value, "O", 0),
    ];

    playerOneScore = players[0].score;
    playerTwoScore = players[1].score;
    currentPlayerIndex = 0;
    round = 1;
    gameOver = false;

    displayController.playerDisplayMessage(
      `Your turn ${players[currentPlayerIndex].name}!` +
        " ( " +
        `${players[currentPlayerIndex].mark}` +
        " )"
    );

    //displayController.rounds("Round" + " " + 1);
    displayController.player1Score(players[0].name + ": " + playerOneScore);
    displayController.player2Score(players[1].name + ": " + playerTwoScore);

    Gameboard.render();

    const squares = document.querySelectorAll(".square");
    console.log(squares);
    squares.forEach((square) => {
      square.addEventListener("click", handleClick);
    });
  };

  const handleClick = (event) => {
    if (gameOver) {
      return true;
    }

    let index = parseInt(event.target.id.split("-")[1]);

    if (Gameboard.getGameboard()[index] !== "") return;
    Gameboard.update(index, players[currentPlayerIndex].mark);

    if (
      checkWInner(Gameboard.getGameboard(), players[currentPlayerIndex].mark)
    ) {
      gameOver = true;
      nextRoundButton.disabled = false;
      displayController.displayMessage(
        `${players[currentPlayerIndex].name} Won!`
      );

      if (players[currentPlayerIndex].mark === "X") {
        playerOneScore++;
        players[currentPlayerIndex].score = playerOneScore;
      } else {
        playerTwoScore++;
        players[currentPlayerIndex].score = playerTwoScore;
      }
      displayController.player1Score(players[0].name + ": " + playerOneScore);
      displayController.player2Score(players[1].name + ": " + playerTwoScore);
    } else if (checkForTie(Gameboard.getGameboard())) {
      nextRoundButton.disabled = false;
      gameOver = true;
      displayController.displayMessage("It's a Tie!");
    }

    displayController.playerDisplayMessage(
      `Your turn ${players[currentPlayerIndex].name}!` +
        " ( " +
        `${players[currentPlayerIndex].mark}` +
        " )"
    );
    winner();
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  };

  const winner = () => {
    if (players[0].score === 3) {
      gameOver = true;
      displayController.winner(players[0].name + " " + "is the winner!");
      playerWon.style.visibility = "visible";
      nextRoundButton.disabled = true;
    } else if (players[1].score === 3) {
      gameOver = true;
      displayController.winner(players[1].name + " " + "is the winner!");
      nextRoundButton.disabled = true;
      playerWon.style.visibility = "visible";
    }
  };

  const newGame = () => {
    restart();
    Game.start();
  };

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, "");
    }
    gameOver = false;
    currentPlayerIndex = 0;
    playerOneScore = 0;
    playerTwoScore = 0;
    //round = 1;
    players[0].score = 0;
    players[1].score = 0;
    displayController.player1Score(players[0].name + ": " + 0);
    displayController.player2Score(players[1].name + ": " + 0);
    displayController.displayMessage("");
    Gameboard.render();
  };

  const nextRound = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, "");
    }
    gameOver = false;
    round++;
    //displayController.rounds("Round" + " " + round);
  };

  return {
    start,
    handleClick,
    restart,
    winner,
    nextRound,
    newGame,
  };
})();

function checkWInner(board) {
  const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winningCombination.length; i++) {
    const [a, b, c] = winningCombination[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

function checkForTie(board) {
  return board.every((cell) => cell !== "");
}

const restartButton = document.querySelector(".restart-btn");
restartButton.addEventListener("click", () => {
  Game.restart();
  modalStart.style.visibility = "hidden";
});

const startButton = document.querySelector(".start-btn");
startButton.addEventListener("click", () => {
  const playerOne = document.querySelector("#player1");
  const playerTwo = document.querySelector("#player2");
  const startMessage = document.querySelector(".start-message");

  if (playerOne.value === "" && playerTwo.value === "") {
    startMessage.textContent = "Enter Player 1 Name and Player 2 Name!";
  } else if (playerOne.value === "") {
    startMessage.textContent = "Enter Player 1 Name!";
  } else if (playerTwo.value === "") {
    startMessage.textContent = "Enter Player 2 Name!";
  } else {
    Game.start();
    nextRoundButton.disabled = true;
    modalStart.style.visibility = "hidden";
  }
});

const newGameButton = document.querySelector(".new-game");
newGameButton.addEventListener("click", () => {
  document.querySelector("#player1").value = "";
  document.querySelector("#player2").value = "";
  Game.newGame();
  playerWon.style.visibility = "hidden";
  modalStart.style.visibility = "visible";
});

const nextRoundButton = document.querySelector(".next-round");
nextRoundButton.addEventListener("click", () => {
  Game.nextRound();
  nextRoundButton.disabled = true;
});

const rematchButton = document.querySelector(".rematch");
rematchButton.addEventListener("click", () => {
  Game.restart();
  playerWon.style.visibility = "hidden";
});

const modalStart = document.querySelector(".start-screen");
modalStart.style.visibility = "visible";

const playerWon = document.querySelector(".winner");
playerWon.style.visibility = "hidden";
