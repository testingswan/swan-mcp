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

// New interface for laser beams
interface Laser {
  id: number;
  x: number;
  y: number;
  direction: "up" | "down" | "left" | "right";
}

interface DestroyedShitcoin extends Shitcoin {
  destroyedAt: number;
}

const App: React.FC = () => {
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [bitcoins, setBitcoins] = useState<Bitcoin[]>([]);
  const [shitcoins, setShitcoins] = useState<Shitcoin[]>([]);
  const [destroyedShitcoins, setDestroyedShitcoins] = useState<
    DestroyedShitcoin[]
  >([]);
  const [score, setScore] = useState<number>(0);
  const [collectedCount, setCollectedCount] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [confetti, setConfetti] = useState<
    { x: number; y: number; color: string }[]
  >([]);
  // New state for lasers
  const [lasers, setLasers] = useState<Laser[]>([]);

  // Handle keyboard input to move the swan and shoot lasers
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
        case "l":
        case "L":
          // Shoot laser in the direction the swan was last moved
          // Default to right if no movement has been made
          const lastKey =
            e.key === "l" || e.key === "L" ? getLastMovementDirection() : null;
          if (lastKey) {
            const newLaser: Laser = {
              id: Date.now(),
              x: position.x,
              y: position.y,
              direction: lastKey,
            };
            setLasers((prev) => [...prev, newLaser]);
          }
          break;
        default:
          break;
      }
    },
    [gameWon, position]
  );

  // Helper function to determine the last direction moved
  const getLastMovementDirection = useCallback(():
    | "up"
    | "down"
    | "left"
    | "right" => {
    // For simplicity, always shoot to the right
    // In a more complex implementation, you could track the last direction moved
    return "right";
  }, []);

  // Reset game function
  const handleResetGame = useCallback(() => {
    setPosition({ x: 50, y: 50 });
    setBitcoins([]);
    setShitcoins([]);
    setLasers([]);
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

  // Update laser positions and handle collisions
  useEffect(() => {
    if (gameWon) return;

    const laserInterval = setInterval(() => {
      // Move each laser in its direction
      setLasers((prevLasers) => {
        return prevLasers
          .map((laser) => {
            // Move the laser based on its direction
            let newX = laser.x;
            let newY = laser.y;

            switch (laser.direction) {
              case "up":
                newY -= 5;
                break;
              case "down":
                newY += 5;
                break;
              case "left":
                newX -= 5;
                break;
              case "right":
                newX += 5;
                break;
            }

            // Return updated laser position
            return {
              ...laser,
              x: newX,
              y: newY,
            };
          })
          .filter(
            // Remove lasers that have gone off-screen
            (laser) =>
              laser.x >= 0 && laser.x <= 100 && laser.y >= 0 && laser.y <= 100
          );
      });

      // Check for laser-shitcoin collisions
      setLasers((currentLasers) => {
        const destroyedLasers: number[] = [];

        setShitcoins((prevShitcoins) => {
          const destroyedShitcoinsList: Shitcoin[] = [];

          // Check each laser against each shitcoin
          currentLasers.forEach((laser) => {
            prevShitcoins.forEach((shitcoin) => {
              const distance = Math.sqrt(
                Math.pow(laser.x - shitcoin.x, 2) +
                  Math.pow(laser.y - shitcoin.y, 2)
              );

              // If collision detected
              if (distance < 5) {
                destroyedShitcoinsList.push(shitcoin);
                destroyedLasers.push(laser.id);

                // Add to destroyed shitcoins with animation
                setDestroyedShitcoins((prev) => [
                  ...prev,
                  {
                    ...shitcoin,
                    destroyedAt: Date.now(),
                  },
                ]);

                // Add message about destroying the shitcoin
                setMessages((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    text: `Stinger destroyed ${shitcoin.type}! 💥`,
                    expiresAt: Date.now() + 2000,
                  },
                ]);
              }
            });
          });

          // Return shitcoins that weren't destroyed
          return prevShitcoins.filter(
            (shitcoin) => !destroyedShitcoinsList.includes(shitcoin)
          );
        });

        // Return lasers that weren't destroyed
        return currentLasers.filter(
          (laser) => !destroyedLasers.includes(laser.id)
        );
      });
    }, 50);

    return () => clearInterval(laserInterval);
  }, [gameWon]);

  // Clean up destroyed shitcoins after animation
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setDestroyedShitcoins((prev) =>
        prev.filter((coin) => Date.now() - coin.destroyedAt < 1000)
      );
    }, 100);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Check for victory or collisions
  useEffect(() => {
    // Check for victory
    if (score === 6.15 && !gameWon) {
      setGameWon(true);
      setBitcoins([]);
      setShitcoins([]);
      setLasers([]);
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
            text: "🎉 3 BTC Collected! Hive's honey stores set to 6.15 BTC!",
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
            text: `Sweet Bitcoin honey collected! ${valueText}`,
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
          text: `${hitShitcoins[0].type} stung you! Lost ${lossBTC} BTC! Beware of toxic coins!`,
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
        <h1>The Bitcoin Hive</h1>
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
              <h2>🎉 SWEET VICTORY! 🎉</h2>
              <h3>You've Collected 6.15 BTC</h3>
              <p>
                Congratulations! You've gathered enough Bitcoin honey to secure
                your hive's financial freedom!
              </p>
              <div className="victory-bitcoin">₿</div>
              <button className="restart-button" onClick={handleResetGame}>
                Play Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Bee (player) */}
            <div
              className="player"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
              🐝
            </div>

            {/* Lasers */}
            {lasers.map((laser) => (
              <div
                key={laser.id}
                className={`laser laser-${laser.direction}`}
                style={{ left: `${laser.x}%`, top: `${laser.y}%` }}
              />
            ))}

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

            {/* Destroyed Shitcoins */}
            {destroyedShitcoins.map((shitcoin) => (
              <div
                key={`destroyed-${shitcoin.id}`}
                className="destroyed-shitcoin"
                style={{
                  left: `${shitcoin.x}%`,
                  top: `${shitcoin.y}%`,
                }}
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
            You've collected exactly 6.15 BTC of sweet Bitcoin honey for your
            hive!
          </p>
        ) : (
          <p>
            Guide your worker bee with arrow keys to collect Bitcoin honey (each
            worth different values), avoid toxic shitcoins (-0.5 BTC each)!
            Press 'L' to shoot stingers and destroy shitcoins!
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
