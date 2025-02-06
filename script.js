let flags = [];
let score = 0;
let roundCount = 0;
const totalRounds = 10;

// Load sound effects
const correctSound = new Audio("correct.mp3");
const wrongSound = new Audio("wrong.mp3");
const gameOverSound = new Audio("gameover.wav");
const clickSound = new Audio("click.mp3");

document.getElementById("startGame").addEventListener("click", () => {
    clickSound.play();
    startGame();
});

document.getElementById("playAgain").addEventListener("click", () => {
    clickSound.play();
    resetGame();
});

async function fetchFlags() {
    try {
        const response = await fetch("flags.json");
        flags = await response.json();
    } catch (error) {
        console.error("Error loading flags:", error);
    }
}

async function startGame() {
    document.getElementById("startGame").style.display = "none";
    document.getElementById("playAgain").style.display = "none";
    score = 0;
    roundCount = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("questionCounter").innerText = `Question 1 / ${totalRounds}`;

    await fetchFlags();
    document.getElementById("gameArea").style.display = "block";
    loadFlag();
}

function loadFlag() {
    if (roundCount >= totalRounds) {
        showResults();
        return;
    }

    document.getElementById("questionCounter").innerText = `Question ${roundCount + 1} / ${totalRounds}`;
    currentFlag = flags[Math.floor(Math.random() * flags.length)];
    document.getElementById("flagImage").src = currentFlag.image;
    generateOptions();
}

function generateOptions() {
    let optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    let shuffledFlags = [...flags].sort(() => 0.5 - Math.random()).slice(0, 3);
    if (!shuffledFlags.includes(currentFlag)) {
        shuffledFlags[Math.floor(Math.random() * shuffledFlags.length)] = currentFlag;
    }

    shuffledFlags.forEach(flag => {
        let button = document.createElement("button");
        button.classList.add("option");
        button.textContent = flag.country;
        button.onclick = () => {
            clickSound.play();
            checkAnswer(flag.country);
        };
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedCountry) {
    let resultText = document.getElementById("result");
    let options = document.querySelectorAll(".option");

    options.forEach(button => {
        button.disabled = true;
        if (button.textContent === currentFlag.country) {
            button.classList.add("correct");
        } else if (button.textContent === selectedCountry) {
            button.classList.add("wrong");
        }
    });

    if (selectedCountry === currentFlag.country) {
        score++;
        resultText.innerText = "Correct!";
        correctSound.play().catch(() => {});
    } else {
        resultText.innerText = `Wrong! It's ${currentFlag.country}.`;
        wrongSound.play().catch(() => {});
    }

    document.getElementById("score").innerText = score;
    roundCount++;

    setTimeout(() => {
        options.forEach(button => {
            button.classList.remove("correct", "wrong");
            button.disabled = false;
        });
        loadFlag();
    }, 2000);
}

function showResults() {
    document.getElementById("result").innerText = `Game Over! Your score: ${score} / ${totalRounds}`;
    
    if (score > 8) {
        triggerConfetti();
    }

    gameOverSound.play().catch(() => {});
    document.getElementById("playAgain").style.display = "block";
}

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 360,
        origin: { x: 0.5, y: 0.5 }
    });
}

function resetGame() {
    document.getElementById("playAgain").style.display = "none";
    document.getElementById("gameArea").style.display = "none";
    document.getElementById("startGame").style.display = "block";
    document.getElementById("result").innerText = "";
    score = 0;
    roundCount = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("questionCounter").innerText = `Question 1 / ${totalRounds}`;
}




