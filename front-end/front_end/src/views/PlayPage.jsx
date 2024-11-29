import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PlayPage() {
  const [level, setLevel] = useState(0);
  const buttonColours = ["red", "blue", "green", "yellow"];
  const [userClickedPattern, setUserClickedPattern] = useState([]);
  const [gamePattern, setGamePattern] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [flashButton, setFlashButton] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [tip, setTip] = useState("");
  const navigate = useNavigate();

  const playingSound = useRef(false);

  function startOver() {
    setLevel(0);
    setUserClickedPattern([]);
    setGamePattern([]);
    setGameOver(false);
    nextSequence();
  }

  function playSound(name) {
    let sound = new Audio(`/assets/${name}.mp3`);
    sound.play();
  }

  function handleStartGame(event) {
    if (event.repeat) return;

    if (!gameStarted) {
      setGameStarted(true);
      startOver();
    }
  }

  function nextSequence() {
    setLevel((prevLevel) => {
      const newLevel = prevLevel + 1;
      return newLevel;
    });

    setUserClickedPattern([]);

    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColour = buttonColours[randomNumber];

    setGamePattern((prev) => [...prev, randomChosenColour]);

    /* Animate the button */
    setFlashButton(randomChosenColour);

    /* Play the sound */
    playSound(randomChosenColour);

    setTimeout(() => setFlashButton(null), 450);
  }

  function buttonClick(id) {
    if (!gameStarted) return;

    const updatedPattern = [...userClickedPattern, id];
    setUserClickedPattern(updatedPattern);

    playSound(id);
    setFlashButton(id);
    setTimeout(() => setFlashButton(null), 450);

    checkAnswer(updatedPattern.length - 1, updatedPattern);
  }

  async function getTips() {
    try {
      const { data } = await axios.get("https://memorymaster.site/tips", {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });

      setTip(data);
    } catch (error) {
      console.log(error);
    }
  }

  function checkAnswer(currentLevel, updatedPattern) {
    const pattern = updatedPattern || userClickedPattern;
    if (pattern[currentLevel] === gamePattern[currentLevel]) {
      if (pattern.length === gamePattern.length) {
        setTimeout(() => {
          nextSequence();
        }, 1000);
      }
    } else {
      playSound("wrong");
      recordHistory();
      setGameStarted(false);
      setGameOver(true);
      getTips();
    }
  }

  async function recordHistory() {
    try {
      const body = { score: level };
      const { data } = await axios.post("https://memorymaster.site/game", body, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleBack() {
    setLevel(0);
    setUserClickedPattern([]);
    setGamePattern([]);
    setGameOver(false);
    navigate("/");
  }

  useEffect(() => {
    const gamebody = document.getElementById("gamebody");
    if (gamebody) gamebody.focus();
  }, []);

  return (
    <>
      <div id="gamebody" className="" onKeyDown={(e) => handleStartGame(e)} tabIndex={0}>
        {/* Back Button */}
        <button onClick={handleBack} className="back-btn">
          Back
        </button>
        {/* Header */}
        <h1 id="gameh1" className="text-center text-3xl mt-8">
          {gameStarted ? `Level ${level}` : "Press Any Key to Start"}
        </h1>
        {/* Button Container */}
        <div className="flex flex-col items-center mt-16">
          {gameOver ? (
            <>
              <div className="bg-gray-800 text-white rounded-lg p-6 w-64 text-center shadow-md">
                <h2 className="text-yellow-300 text-lg font-bold mb-2">Tip</h2>
                <p className="text-gray-300">{tip}</p>
              </div>
            </>
          ) : (
            <>
              {/* First Row */}
              <div className="flex space-x-4 mb-4">
                <div id="green" className={`btn green ${flashButton === "green" ? "flash" : ""}`} onClick={() => buttonClick("green")} />
                <div id="red" className={`btn red ${flashButton === "red" ? "flash" : ""}`} onClick={() => buttonClick("red")} />
              </div>
              {/* Second Row */}
              <div className="flex space-x-4">
                <div id="yellow" className={`btn yellow ${flashButton === "yellow" ? "flash" : ""}`} onClick={() => buttonClick("yellow")} />
                <div id="blue" className={`btn blue ${flashButton === "blue" ? "flash" : ""}`} onClick={() => buttonClick("blue")} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
