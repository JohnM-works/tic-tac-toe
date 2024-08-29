const displayController = (() => {
  const displayMessage = (message) => {
    document.querySelector(".display-result").textContent = message;
  };

  const playerDisplayMessage = (playerDisplay) => {
    document.querySelector(".player-turn-message").textContent = playerDisplay;
  };

  return { displayMessage, playerDisplayMessage };
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

const createPlayer = (name, mark) => {
  return { name, mark };
};

const Game = (() => {
  let players = [];
  let currentPlayerIndex;
  let gameOver;

  const start = () => {
    restart();

    players = [
      createPlayer(document.querySelector("#player1").value, "X"),
      createPlayer(document.querySelector("#player2").value, "O"),
    ];

    currentPlayerIndex = 0;
    gameOver = false;

    displayController.playerDisplayMessage(
      `It's your turn ${players[currentPlayerIndex].name}!` +
        " ( " +
        `${players[currentPlayerIndex].mark}` +
        " )"
    );

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
      displayController.displayMessage(
        `${players[currentPlayerIndex].name} Won!`
      );
    } else if (checkForTie(Gameboard.getGameboard())) {
      gameOver = true;
      displayController.displayMessage("It's a Tie!");
    }

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;

    displayController.playerDisplayMessage(
      `It's your turn ${players[currentPlayerIndex].name}!` +
        " ( " +
        `${players[currentPlayerIndex].mark}` +
        " )"
    );
  };

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, "");
    }
    gameOver = false;
    Gameboard.render();
    displayController.displayMessage("");
  };

  return {
    start,
    handleClick,
    restart,
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

  if (playerOne.value === "") {
    startMessage.textContent = "Enter Player 1 Name!";
  } else if (playerTwo.value === "") {
    startMessage.textContent = "Enter Player 2 Name!";
  } else {
    Game.start();
    modalStart.style.visibility = "hidden";
  }
});

const playerResult = document.querySelector(".playerResult-modal");
const modalStart = document.querySelector(".start-screen");
modalStart.style.visibility = "start";
