import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

// Define TypeScript interfaces
interface Position {
  x: number;
  y: number;
}

interface Bitcoin {
  id: number;
  x: number;
  y: number;
  value: number; // Each bitcoin will have a different value
}

interface Shitcoin {
  id: number;
  x: number;
  y: number;
  type: string;
}

interface Message {
  id: number;
  text: string;
  expiresAt: number;
}

const App: React.FC = () => {
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [bitcoins, setBitcoins] = useState<Bitcoin[]>([]);
  const [shitcoins, setShitcoins] = useState<Shitcoin[]>([]);
  const [score, setScore] = useState<number>(0);
  const [collectedCount, setCollectedCount] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [confetti, setConfetti] = useState<
    { x: number; y: number; color: string }[]
  >([]);

  // Handle keyboard input to move the swan
  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (gameWon) return; // Disable movement when game is won

      switch (e.key) {
        case "ArrowUp":
          setPosition((prev) => ({ ...prev, y: Math.max(prev.y - 5, 0) }));
          break;
        case "ArrowDown":
          setPosition((prev) => ({ ...prev, y: Math.min(prev.y + 5, 90) }));
          break;
        case "ArrowLeft":
          setPosition((prev) => ({ ...prev, x: Math.max(prev.x - 5, 0) }));
          break;
        case "ArrowRight":
          setPosition((prev) => ({ ...prev, x: Math.min(prev.x + 5, 90) }));
          break;
        default:
          break;
      }
    },
    [gameWon]
  );

  // Reset game function
  const resetGame = useCallback(() => {
    setPosition({ x: 50, y: 50 });
    setBitcoins([]);
    setShitcoins([]);
    setScore(0);
    setCollectedCount(0);
    setMessages([]);
    setGameWon(false);
    setConfetti([]);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Generate confetti for the victory screen
  useEffect(() => {
    if (gameWon) {
      const colors = ["#f7931a", "#ffcc00", "#ffffff", "#ff9900", "#ffd700"];
      const newConfetti = [];

      // Create 150 confetti pieces
      for (let i = 0; i < 150; i++) {
        newConfetti.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      setConfetti(newConfetti);
    }
  }, [gameWon]);

  // Generate random bitcoins with different values
  useEffect(() => {
    if (gameWon) return; // Stop generating when game is won

    const interval = setInterval(() => {
      if (bitcoins.length < 5) {
        // Generate a random value between 0.5 and 3.0
        const bitcoinValue = parseFloat((Math.random() * 2.5 + 0.5).toFixed(2));

        const newBitcoin: Bitcoin = {
          id: Date.now(),
          x: Math.floor(Math.random() * 90),
          y: Math.floor(Math.random() * 90),
          value: bitcoinValue,
        };
        setBitcoins((prev) => [...prev, newBitcoin]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [bitcoins.length, gameWon]);

  // Generate random shitcoins
  useEffect(() => {
    if (gameWon) return; // Stop generating when game is won

    const interval = setInterval(() => {
      if (shitcoins.length < 8) {
        const shitcoinTypes = [
          "ETH",
          "SOL",
          "DOGE",
          "XRP",
          "ADA",
          "BNB",
          "LTC",
          "DOT",
        ];
        const newShitcoin: Shitcoin = {
          id: Date.now(),
          x: Math.floor(Math.random() * 90),
          y: Math.floor(Math.random() * 90),
          type: shitcoinTypes[Math.floor(Math.random() * shitcoinTypes.length)],
        };
        setShitcoins((prev) => [...prev, newShitcoin]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [shitcoins.length, gameWon]);

  // Check for victory or collisions
  useEffect(() => {
    // Check for victory
    if (score === 6.15 && !gameWon) {
      setGameWon(true);
      setBitcoins([]);
      setShitcoins([]);
      return;
    }

    if (gameWon) return; // Skip collision detection if game is won

    // Bitcoin collection
    const collectedBitcoins = bitcoins.filter((bitcoin) => {
      const distance = Math.sqrt(
        Math.pow(position.x - bitcoin.x, 2) +
          Math.pow(position.y - bitcoin.y, 2)
      );
      return distance < 5;
    });

    if (collectedBitcoins.length > 0) {
      // Remove collected bitcoins
      setBitcoins((prev) =>
        prev.filter((bitcoin) => !collectedBitcoins.includes(bitcoin))
      );

      // Calculate total value of collected bitcoins
      const totalValue = collectedBitcoins.reduce(
        (sum, bitcoin) => sum + bitcoin.value,
        0
      );

      // Update score
      setScore((prev) => {
        const newScore = parseFloat((prev + totalValue).toFixed(2));
        return newScore;
      });

      // Update collection count
      setCollectedCount((prev) => prev + collectedBitcoins.length);

      // Special message if exactly 3 bitcoins collected
      if (collectedCount + collectedBitcoins.length === 3) {
        setScore(6.15); // Force to exactly 6.15 on third bitcoin
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: "🎉 3 BTC Collected! Stack set to exactly 6.15 BTC!",
            expiresAt: Date.now() + 3000,
          },
        ]);
      } else {
        // Regular collection message
        const valueText =
          collectedBitcoins.length === 1
            ? `+${collectedBitcoins[0].value} BTC!`
            : `+${totalValue} BTC total!`;

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: `Bitcoin accumulation! ${valueText}`,
            expiresAt: Date.now() + 2000,
          },
        ]);
      }
    }

    // Shitcoin collisions
    const hitShitcoins = shitcoins.filter((shitcoin) => {
      const distance = Math.sqrt(
        Math.pow(position.x - shitcoin.x, 2) +
          Math.pow(position.y - shitcoin.y, 2)
      );
      return distance < 5;
    });

    if (hitShitcoins.length > 0) {
      setShitcoins((prev) =>
        prev.filter((shitcoin) => !hitShitcoins.includes(shitcoin))
      );

      // Lose 0.5 BTC per shitcoin hit
      const lossBTC = hitShitcoins.length * 0.5;
      setScore((prev) => Math.max(0, parseFloat((prev - lossBTC).toFixed(2))));

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: `${hitShitcoins[0].type} rekt! Lost ${lossBTC} BTC! Never trust centralized coins.`,
          expiresAt: Date.now() + 2000,
        },
      ]);
    }

    // Expire old messages
    setMessages((prev) => prev.filter((msg) => msg.expiresAt > Date.now()));
  }, [position, bitcoins, shitcoins, collectedCount, score, gameWon]);

  // Toggle dark/light mode
  const toggleTheme = (): void => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Escape the Fiat Matrix</h1>
        <div className="score">BTC: {score}</div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </header>

      <div className="game-area">
        {gameWon ? (
          <div className="victory-screen">
            {/* Confetti */}
            {confetti.map((piece, index) => (
              <div
                key={index}
                className="confetti"
                style={{
                  left: `${piece.x}%`,
                  top: `${piece.y}%`,
                  backgroundColor: piece.color,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}

            <div className="victory-content">
              <h2>🎉 VICTORY! 🎉</h2>
              <h3>You've Accumulated 6.15 BTC</h3>
              <p>
                Congratulations! You've escaped the fiat matrix and secured your
                financial freedom with Bitcoin!
              </p>
              <div className="victory-bitcoin">₿</div>
              <button className="restart-button" onClick={resetGame}>
                Play Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Swan (player) */}
            <div
              className="player"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
              🦢
            </div>

            {/* Bitcoins with values */}
            {bitcoins.map((bitcoin) => (
              <div
                key={bitcoin.id}
                className="bitcoin"
                style={{ left: `${bitcoin.x}%`, top: `${bitcoin.y}%` }}
              >
                <div className="bitcoin-symbol">₿</div>
                <div className="bitcoin-value">{bitcoin.value}</div>
              </div>
            ))}

            {/* Shitcoins */}
            {shitcoins.map((shitcoin) => (
              <div
                key={shitcoin.id}
                className="shitcoin"
                style={{ left: `${shitcoin.x}%`, top: `${shitcoin.y}%` }}
              >
                {shitcoin.type}
              </div>
            ))}

            {/* Messages */}
            <div className="messages">
              {messages.map((msg) => (
                <div key={msg.id} className="message">
                  {msg.text}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="instructions">
        {gameWon ? (
          <p>
            You've accumulated exactly 6.15 BTC and escaped the fiat matrix!
          </p>
        ) : (
          <p>
            Use arrow keys to control the swan. Collect Bitcoin (each worth
            different values), avoid shitcoins (-0.5 BTC each)!
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
