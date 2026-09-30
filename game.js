// ==========================================
// WEDDING BOMB
// ==========================================


// ==========================================
// MODULE STATUS
// ==========================================
let modulesSolved = {
    wires: false,
    buttons: false,
    symbols: false,
    numbers: false
};


// ==========================================
// CHECK ALL MODULES (Function)
// ==========================================
function checkBombDefused() {
    if (modulesSolved.wires && modulesSolved.buttons && modulesSolved.symbols && modulesSolved.numbers) {
        defuse(); // Defuse bomb when every modules are on true
    }
}


// ==========================================
// DISABLE MODULE (Function)
// ==========================================
function disableModule(selector) {
    document.querySelectorAll(selector).forEach(element => {
        element.disabled = true; // Set elements in the modules on disabled
    });
}


// ==========================================
// TIMER
// ==========================================
let timeLeft = 300;
let timer = null;

const timerElement = document.getElementById("timer");

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent =
            `${minutes.toString().padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}`;
        if (timeLeft <= 30) {
            timerElement.classList.add("timer-warning");
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            explode();
        }
    }, 1000);
}


// ==========================================
// STRIKES (Function)
// ==========================================
function strike(reason) {
    strikes++;

    const message = document.getElementById("message");

    document.getElementById("strikes").textContent = strikes;
    message.textContent = reason;

    // Rot hervorheben
    message.classList.remove("error");

    // Animation neu starten
    void message.offsetWidth;

    message.classList.add("error");

    if (strikes >= 3) {
        explode();
    }
}


// ==========================================
// EXPLOSION (Function)
// ==========================================
function explode() {
    clearInterval(timer);
    document
        .getElementById("failureScreen")
        .classList.remove("hidden"); // Remove "hidden" class -> failure screen appears
}


// ==========================================
// SUCCESS (Function)
// ==========================================
function defuse() {
    clearInterval(timer);
    document.getElementById("finalCode").textContent =
        "COUCH"; // -------------------------------------------------------------------------- WICHTIG! ENDKOORDINATE --------------------------------------------------------------------------

    document
        .getElementById("successScreen")
        .classList.remove("hidden"); // Remove "hidden" class -> success screen appears
}



// ==========================================
// MODULE 1 — WIRES
// ==========================================
document.querySelectorAll(".wire").forEach(wire => {
    wire.addEventListener("click", () => {
        const selected = wire.dataset.wire;
        if (selected === "green") {
            wire.style.opacity = "0.2";
            modulesSolved.wires = true;
            document.getElementById("message").textContent =
                "WIRES SOLVED";

            // Deactivate
            disableModule(".wire");

            // Bomb defused
            checkBombDefused();
        } else {
            strike("WRONG WIRE");
        }
    });
});



// ==========================================
// MODULE 2 — BUTTONS
// ==========================================
let buttonStep = 0;
const correctButtons = [
    "blue",
    "red",
    "yellow"
];

document.querySelectorAll(".big-button").forEach(button => {
    button.addEventListener("click", () => {
        const selected = button.dataset.button;
        if (selected === correctButtons[buttonStep]) {
            buttonStep++;
            button.style.opacity = "0.3";
            if (buttonStep === correctButtons.length) {
                modulesSolved.buttons = true;
                document.getElementById("message").textContent =
                    "BUTTON MODULE SOLVED";

                // Alle Buttons deaktivieren
                disableModule(".big-button");
                checkBombDefused();
            }
        } else {
            strike("WRONG BUTTON");
        }
    });
});



// ==========================================
// MODULE 3 — SYMBOLS
// ==========================================
let symbolStep = 0;
const correctSymbols = [
    "game",
    "ring",
    "heart",
    "flower"
];

document.querySelectorAll("[data-symbol]").forEach(symbol => {
    symbol.addEventListener("click", () => {
        const selected = symbol.dataset.symbol;
        if (selected === correctSymbols[symbolStep]) {
            symbolStep++;
            symbol.style.opacity = "0.3";
            if (symbolStep === correctSymbols.length) {
                modulesSolved.symbols = true;
                document.getElementById("message").textContent =
                    "SYMBOL MODULE SOLVED";
                // Symbole deaktivieren
                disableModule("[data-symbol]");
                checkBombDefused();
            }
        } else {
            strike("WRONG SYMBOL");
        }
    });
});



// ==========================================
// MODULE 4 — PASSWORD
// ==========================================
let numberStep = 0;
const correctNumbers = [
    "3",
    "1",
    "4",
    "2"
];

document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => {
        const selected = button.dataset.number;
        if (selected === correctNumbers[numberStep]) {
            numberStep++;
            button.style.opacity = "0.3";
            // Bereits richtig eingegebene Zahlen anzeigen
            document.getElementById("numberDisplay").textContent =
                correctNumbers.slice(0, numberStep).join(" ");
            if (numberStep === correctNumbers.length) {
                modulesSolved.numbers = true;
                document.getElementById("message").textContent =
                    "NUMBER MODULE SOLVED";
                disableModule("[data-number]");
                checkBombDefused();
            }
        } else {
            strike("WRONG NUMBER");
        }
    });
});

// ==========================================
// START
// ==========================================

document.getElementById("startButton").addEventListener("click", () => {

    document.getElementById("startScreen").classList.add("hidden");

    startTimer();

    document.getElementById("message").textContent =
        "BOMB ACTIVATED";

});