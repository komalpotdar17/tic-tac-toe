import { useState, useEffect } from "react";
import './App.css';

const emojiCategories = {
  Animals: ["🐶", "🐱", "🐵", "🐰"],
  Food: ["🍕", "🍟", "🍔", "🍩"],
  Sports: ["⚽️", "🏀", "🏈", "🎾"]
};

function getRandomEmoji(category) {
  const emojis = emojiCategories[category];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(1);
  const [emojiSelections, setEmojiSelections] = useState({ 1: "", 2: "" });
  const [placedEmojis, setPlacedEmojis] = useState({ 1: [], 2: [] });
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  useEffect(() => {
    checkWinner();
  }, [board]);

  function startGame() {
    if (emojiSelections[1] && emojiSelections[2]) {
      setGameStarted(true);
    } else {
      alert("Both players must select a category.");
    }
  }

  function handleCellClick(index) {
    if (winner || board[index] || !gameStarted) return;

    const currentPlayer = playerTurn;
    const category = emojiSelections[currentPlayer];
    const emoji = getRandomEmoji(category);
    const newBoard = [...board];
    const playerEmojis = [...placedEmojis[currentPlayer]];

    if (playerEmojis.length === 3 && playerEmojis[0].index === index) return;

    if (playerEmojis.length === 3) {
      const oldest = playerEmojis.shift();
      newBoard[oldest.index] = null;
    }

    newBoard[index] = { emoji, player: currentPlayer };
    playerEmojis.push({ index, emoji });

    setBoard(newBoard);
    setPlacedEmojis({ ...placedEmojis, [currentPlayer]: playerEmojis });
    setPlayerTurn(currentPlayer === 1 ? 2 : 1);
  }

  function checkWinner() {
    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        board[a] &&
        board[b] &&
        board[c] &&
        board[a].player === board[b].player &&
        board[b].player === board[c].player
      ) {
        setWinner(board[a].player);
        return;
      }
    }
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setPlayerTurn(1);
    setPlacedEmojis({ 1: [], 2: [] });
    setWinner(null);
    setGameStarted(false);
    setEmojiSelections({ 1: "", 2: "" });
  }

  return (
    <div className="app">
      <h1>Emoji Tic Tac Toe</h1>

      {!gameStarted && (
        <div className="category-selection">
          <h2>Select Emoji Categories</h2>
          {[1, 2].map((player) => (
            <div key={player}>
              <label>Player {player}:</label>
              <select
                value={emojiSelections[player]}
                onChange={(e) =>
                  setEmojiSelections({ ...emojiSelections, [player]: e.target.value })
                }
              >
                <option value="">Select</option>
                {Object.keys(emojiCategories).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          ))}
          <button onClick={startGame}>Start Game</button>
        </div>
      )}

      {gameStarted && !winner && (
        <div className="status">Player {playerTurn}'s Turn</div>
      )}

      {winner && (
        <div className="winner">
          🎉 Player {winner} Wins! <button onClick={resetGame}>Play Again</button>
        </div>
      )}

      <div className="board">
        {board.map((cell, i) => (
          <div
            key={i}
            className="cell"
            onClick={() => handleCellClick(i)}
          >
            {cell ? cell.emoji : ""}
          </div>
        ))}
      </div>

      <div className="help">
        <h3>Help:</h3>
        <ul>
          <li>Each player chooses an emoji category before starting.</li>
          <li>Players get a random emoji from their category on each turn.</li>
          <li>Only 3 emojis per player allowed on board. The oldest disappears when placing the 4th.</li>
          <li>Cannot place emoji on the cell of the oldest one being removed.</li>
          <li>First to align 3 of their emojis (horizontal/vertical/diagonal) wins!</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
