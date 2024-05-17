const template = document.createElement('template');
template.innerHTML = `
<div class="player-turn">Player's turn: <span id="current-player">X</span></div>
<div class="scoreboard">
    <div class="score">X Wins: <span id="x-wins">0</span></span>
    <div class="score">O Wins: <span id="o-wins">0</span></span>
</div>
<div class="board">
    <div class="cell" data-index="0"></div>
    <div class="cell" data-index="1"></div>
    <div class="cell" data-index="2"></div>
    <div class="cell" data-index="3"></div>
    <div class="cell" data-index="4"></div>
    <div class="cell" data-index="5"></div>
    <div class="cell" data-index="6"></div>
    <div class="cell" data-index="7"></div>
    <div class="cell" data-index="8"></div>
</div>
<button class="reset-button">Reset Game</button>
<style>
  .board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
    width: 300px;
    margin: 0 auto;
  }
  .cell {
    width: 100px;
    height: 100px;
    background-color: lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .cell:hover {
    background-color: #ddd;
  }
  .cell.win {
    animation: blink 0.5s infinite alternate;
  }
  @keyframes blink {
    from {
      background-color: #ff9999;
    }
    to {
      background-color: #ff3333;
    }
  }
  .reset-button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .reset-button:hover {
    background-color: #45a049;
  }
  .player-turn {
    text-align: center;
    margin-bottom: 10px;
  }
  .scoreboard {
    display: flex;
    margin-top: 20px;
    font-size: 1.2em;
  }
  .score {
    justify-content: space-between;
  }
</style>
        `;

class TicTacToe extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.appendChild(template.content.cloneNode(true));

        this.cells = this.querySelectorAll('.cell');
        this.currentPlayer = 'X';
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.gameOver = false;

        this.xWinsDisplay = document.getElementById('x-wins');
        this.oWinsDisplay = document.getElementById('o-wins');
        this.xWins = 0;
        this.oWins = 0;
        this.currentPlayer = 'X';

        this.handleClick = this.handleClick.bind(this);
        this.querySelector('.board').addEventListener('click', this.handleClick);
        this.querySelector('.reset-button').addEventListener('click', this.resetGame.bind(this));
        this.updatePlayerTurn();
    }

    handleClick(event) {
        if (event.target.classList.contains('cell') && !this.gameOver) {
          const index = parseInt(event.target.getAttribute('data-index'));
          if (this.board[index] === '') {
            this.board[index] = this.currentPlayer;
            event.target.textContent = this.currentPlayer;
            if (this.checkWinner()) {
               if (this.currentPlayer === 'X') {
                this.xWins++;
                  this.xWinsDisplay.textContent = this.xWins;
                } else {
                  this.oWins++;
                  this.oWinsDisplay.textContent = this.oWins;
                }
              this.gameOver = true;
              setTimeout(() => {
                alert(`${this.currentPlayer} wins!`);
              }, 500);
            } else if (!this.board.includes('')) {
              this.gameOver = true;
              setTimeout(() => {
                alert("It's a draw!");
              }, 500);
            } else {
              this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
              this.updatePlayerTurn();
            }
          }
        }
      }

      checkWinner() {
        const winConditions = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
          [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
          [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (let condition of winConditions) {
          const [a, b, c] = condition;
          if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
            this.cells[a].classList.add('win');
            this.cells[b].classList.add('win');
            this.cells[c].classList.add('win');
            return true;
          }
        }

        return false;
      }

      updatePlayerTurn() {
        document.getElementById('current-player').textContent = this.currentPlayer;
      }

      resetGame() {
        this.cells.forEach(cell => {
          cell.textContent = '';
          cell.classList.remove('win');
        });
        this.currentPlayer = 'X';
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.gameOver = false;
        this.updatePlayerTurn();
      }
}

customElements.define('tic-tac-toe', TicTacToe);
