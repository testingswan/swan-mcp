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

  // Handle keyboard input to move the swan
  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
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
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Generate random bitcoins with different values
  useEffect(() => {
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
  }, [bitcoins.length]);

  // Generate random shitcoins
  useEffect(() => {
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
  }, [shitcoins.length]);

  // Check for collisions
  useEffect(() => {
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
      setScore((prev) => parseFloat((prev + totalValue).toFixed(2)));

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
  }, [position, bitcoins, shitcoins, collectedCount]);

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
      </div>

      <div className="instructions">
        <p>
          Use arrow keys to control the swan. Collect Bitcoin (each worth
          different values), avoid shitcoins (-0.5 BTC each)!
        </p>
      </div>
    </div>
  );
};

export default App;
