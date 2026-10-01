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

let strikes = 0;


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
let wiresCut = {
    green: false,
    yellow: false
};

document.querySelectorAll(".wire").forEach(wire => {
    wire.addEventListener("click", () => {

        // Der Timer muss irgendwo die Zahl 3 enthalten
        const currentTime = timerElement.textContent;

        if (!currentTime.includes("3")) {
            strike("WRONG TIME");
            return;
        }

        const selected = wire.dataset.wire;

        // Richtiger Draht: Grün oder Gelb
        if (selected === "green" || selected === "yellow") {

            wire.style.opacity = "0.2";
            wire.disabled = true;

            wiresCut[selected] = true;

            // Prüfen, ob beide richtigen Drähte geschnitten wurden
            if (wiresCut.green && wiresCut.yellow) {
                modulesSolved.wires = true;

                document.getElementById("message").textContent =
                    "WIRES SOLVED";

                disableModule(".wire");

                checkBombDefused();
            }

        } else {
            strike("WRONG WIRE");
        }
    });
});



// ==========================================
// MODULE 2 — BUTTONS
// ==========================================

const serial = "K2-U9-A0-N5";

const letterColors = {
    K: "blue",
    U: "green",
    A: "red",
    N: "yellow"
};

const serialParts = serial.split("-");

let buttonSequence = serialParts.map(part => {
    const letter = part[0];
    const number = parseInt(part[1]);

    return {
        color: letterColors[letter],
        clicks: number === 0 ? 1 : number
    };
});

let currentButtonStep = 0;
let currentButtonClicks = 0;

document.querySelectorAll(".big-button").forEach(button => {

    button.addEventListener("click", () => {

        const selected = button.dataset.button;
        const current = buttonSequence[currentButtonStep];

        // Falsche Farbe
        if (selected !== current.color) {
            strike("WRONG BUTTON");
            return;
        }

        // Richtige Farbe → Klick zählen
        currentButtonClicks++;

        // Zu oft gedrückt
        if (currentButtonClicks > current.clicks) {
            strike("TOO MANY CLICKS");
            currentButtonClicks = 0;
            return;
        }

        // Richtige Anzahl erreicht
        if (currentButtonClicks === current.clicks) {

            currentButtonStep++;
            currentButtonClicks = 0;

            // Alle Farben geschafft
            if (currentButtonStep === buttonSequence.length) {

                modulesSolved.buttons = true;

                document.getElementById("message").textContent =
                    "BUTTON SOLVED";

                // Erst wenn ALLE Buttons korrekt gedrückt wurden:
                // komplettes Button-Modul deaktivieren
                disableModule(".big-button");

                checkBombDefused();
            }
        }
    });
});


// ==========================================
// MODULE 3 — SYMBOLS
// ==========================================
let symbolStep = 0;
const correctSymbols = [
    "heart",    // 9 Rot
    "ring",     // 6 Blau
    "game",     // 4 Gelb
    "flower"    // 3 Grün
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
                    "SYMBOL SOLVED";
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
    "4",
    "5",
    "0",
    "9",
    "2",
    "3",
    "4",
    "6",
    "9"
];

document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => {
        const selected = button.dataset.number;
        if (selected === correctNumbers[numberStep]) {
            numberStep++;
            // Bereits richtig eingegebene Zahlen anzeigen
            document.getElementById("numberDisplay").textContent =
                correctNumbers.slice(0, numberStep).join(" ");
            if (numberStep === correctNumbers.length) {
                modulesSolved.numbers = true;
                document.getElementById("message").textContent =
                    "Password SOLVED";
                disableModule("[data-number]");
                checkBombDefused();
            }
        } else {
            strike("WRONG PASSWORD");
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