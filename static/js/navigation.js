/* =========================================================
   METRO SMART NAVIGATION
   ========================================================= */

let navigationStarted = false;
let currentStep = 0;
let navigationTimer = null;
let voiceEnabled = true;


/* =========================================================
   DJANGO DATA
   ========================================================= */

const destination =
    typeof metroDestination !== "undefined"
        ? metroDestination
        : "Miyapur";

const platform =
    typeof metroPlatform !== "undefined"
        ? metroPlatform
        : "1";


/* =========================================================
   DESTINATION ROUTES
   ========================================================= */

const routes = {

    "Miyapur": {

        color: "#1769ff",

        path: `
            M 70 100
            L 300 100
            L 600 100
            L 600 250
            L 400 250
            L 400 400
            L 600 400
            L 600 550
            L 750 550
        `,

        steps: [
            ["Entry", "Start from Entry", "7%", "15%"],
            ["Security", "Turn right towards Security", "30%", "15%"],
            ["QR Gate", "Go straight towards the QR Gate", "60%", "15%"],
            ["Main Corridor", "Turn down into the Main Corridor", "60%", "36%"],
            ["Main Corridor", "Turn left and continue", "40%", "36%"],
            ["Escalator", "Move towards the Escalator", "40%", "57%"],
            ["Platform", "Continue towards Platform 1", "60%", "79%"],
            ["Platform", "You have reached Platform 1", "75%", "79%"],
            ["Exit", "Continue towards the Exit", "90%", "90%"]
        ]
    },


    "JNTU College": {

        color: "#1769ff",

        path: `
            M 70 100
            L 250 100
            L 250 200
            L 500 200
            L 500 300
            L 300 300
            L 300 450
            L 500 450
            L 500 580
            L 750 580
        `,

        steps: [
            ["Entry", "Start from Entry", "7%", "15%"],
            ["Security", "Turn right towards Security", "25%", "15%"],
            ["Security", "Continue through Security", "25%", "29%"],
            ["QR Gate", "Continue towards the QR Gate", "50%", "29%"],
            ["Main Corridor", "Turn down into the Main Corridor", "50%", "43%"],
            ["Main Corridor", "Turn left and continue", "30%", "43%"],
            ["Escalator", "Move towards the Escalator", "30%", "64%"],
            ["Platform", "Continue towards Platform 1", "50%", "83%"],
            ["Platform", "You have reached Platform 1", "75%", "83%"],
            ["Exit", "Continue towards the Exit", "90%", "90%"]
        ]
    },


    "KPHB Colony": {

        color: "#1769ff",

        path: `
            M 70 100
            L 200 100
            L 200 180
            L 700 180
            L 700 320
            L 450 320
            L 450 470
            L 700 470
            L 700 580
            L 850 580
        `,

        steps: [
            ["Entry", "Start from Entry", "7%", "15%"],
            ["Security", "Turn right towards Security", "20%", "15%"],
            ["Security", "Move forward through Security", "20%", "27%"],
            ["QR Gate", "Continue straight towards the QR Gate", "70%", "27%"],
            ["Main Corridor", "Turn down into the Main Corridor", "70%", "46%"],
            ["Main Corridor", "Turn left and continue", "45%", "46%"],
            ["Escalator", "Move towards the Escalator", "45%", "67%"],
            ["Platform", "Continue towards Platform 1", "70%", "67%"],
            ["Platform", "You have reached Platform 1", "75%", "83%"],
            ["Exit", "Continue towards the Exit", "90%", "90%"]
        ]
    },


    "Kukatpally": {

        color: "#1769ff",

        path: `
            M 70 100
            L 350 100
            L 350 200
            L 800 200
            L 800 350
            L 600 350
            L 600 450
            L 800 450
            L 800 580
            L 900 580
        `,

        steps: [
            ["Entry", "Start from Entry", "7%", "15%"],
            ["Security", "Turn right towards Security", "35%", "15%"],
            ["Security", "Continue towards Security", "35%", "29%"],
            ["QR Gate", "Continue towards the QR Gate", "80%", "29%"],
            ["Main Corridor", "Turn down into the Main Corridor", "80%", "50%"],
            ["Main Corridor", "Turn left and continue", "60%", "50%"],
            ["Escalator", "Move towards the Escalator", "60%", "64%"],
            ["Platform", "Continue towards Platform 2", "80%", "64%"],
            ["Platform", "You have reached Platform 2", "80%", "83%"],
            ["Exit", "Continue towards the Exit", "90%", "90%"]
        ]
    },


    "Ameerpet": {

        color: "#1769ff",

        path: `
            M 70 100
            L 450 100
            L 450 180
            L 700 180
            L 700 300
            L 850 300
            L 850 450
            L 550 450
            L 550 580
            L 750 580
        `,

        steps: [
            ["Entry", "Start from Entry", "7%", "15%"],
            ["Security", "Turn right towards Security", "45%", "15%"],
            ["Security", "Continue through Security", "45%", "27%"],
            ["QR Gate", "Continue towards the QR Gate", "70%", "27%"],
            ["Main Corridor", "Turn down into the Main Corridor", "70%", "43%"],
            ["Main Corridor", "Turn right and continue", "85%", "43%"],
            ["Escalator", "Move towards the Escalator", "85%", "64%"],
            ["Platform", "Turn left towards Platform 2", "55%", "64%"],
            ["Platform", "You have reached Platform 2", "75%", "83%"],
            ["Exit", "Continue towards the Exit", "90%", "90%"]
        ]
    }

};


/* =========================================================
   CURRENT ROUTE
   ========================================================= */

const currentRoute =
    routes[destination] || routes["Miyapur"];

const routeSteps =
    currentRoute.steps;


/* =========================================================
   CHANGE BLUE ROUTE
   ========================================================= */

function applyRoute() {

    const normalPath =
        document.getElementById("navigationPath");

    const movingPath =
        document.querySelector(".moving-path");


    if (normalPath) {

        normalPath.setAttribute(
            "d",
            currentRoute.path
        );

        normalPath.style.stroke =
            currentRoute.color;
    }


    if (movingPath) {

        movingPath.setAttribute(
            "d",
            currentRoute.path
        );

        movingPath.style.stroke =
            currentRoute.color;
    }
}


/* =========================================================
   START NAVIGATION
   ========================================================= */

function startNavigation() {

    if (navigationStarted) {
        return;
    }


    navigationStarted = true;
    currentStep = 0;


    const button =
        document.getElementById("startButton");

    const startIcon =
        document.getElementById("startIcon");

    const startText =
        document.getElementById("startText");


    if (button) {

        button.innerHTML =
            "✓ Navigation Started";

        button.style.background =
            "#159447";
    }


    if (startIcon) {

        startIcon.style.display =
            "none";
    }


    if (startText) {

        startText.textContent =
            "Navigation Started";
    }


    movePerson();
}


/* =========================================================
   MOVE PERSON
   ========================================================= */

function movePerson() {

    if (currentStep >= routeSteps.length) {

        finishNavigation();

        return;
    }


    const step =
        routeSteps[currentStep];


    const person =
        document.getElementById("person");

    const currentLocation =
        document.getElementById(
            "currentLocation"
        );

    const bottomMessage =
        document.getElementById(
            "bottomMessage"
        );


    if (person) {

        person.style.left =
            step[2];

        person.style.top =
            step[3];
    }
    /* Keep the moving person visible */
if (person) {

    person.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
    });
}


    if (currentLocation) {

        currentLocation.textContent =
            step[0];
    }


    if (bottomMessage) {

        bottomMessage.textContent =
            step[1];
    }


    if (voiceEnabled) {

        speak(step[1]);
    }


    currentStep++;


    navigationTimer =
        setTimeout(
            movePerson,
            2500
        );
}


/* =========================================================
   FINISH
   ========================================================= */

function finishNavigation() {

    if (navigationTimer) {

        clearTimeout(
            navigationTimer
        );

        navigationTimer = null;
    }


    const currentLocation =
        document.getElementById(
            "currentLocation"
        );

    const bottomMessage =
        document.getElementById(
            "bottomMessage"
        );


    if (currentLocation) {

        currentLocation.textContent =
            "Exit";
    }


    if (bottomMessage) {

        bottomMessage.textContent =
            "You have reached your destination. Navigation completed.";
    }


    if (voiceEnabled) {

        speak(
            "You have reached your destination. Navigation completed."
        );
    }


    navigationStarted = false;
}


/* =========================================================
   VOICE
   ========================================================= */

function speak(text) {

    if (
        !("speechSynthesis" in window)
    ) {

        return;
    }


    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(
            text
        );


    speech.rate = 0.9;
    speech.pitch = 1;


    window.speechSynthesis.speak(
        speech
    );
}


/* =========================================================
   VOICE ON / OFF
   ========================================================= */

function toggleVoice() {

    voiceEnabled =
        !voiceEnabled;


    const voiceStatus =
        document.getElementById(
            "voiceStatus"
        );


    if (voiceEnabled) {

        if (voiceStatus) {

            voiceStatus.textContent =
                "Voice On";
        }

    } else {

        if (voiceStatus) {

            voiceStatus.textContent =
                "Voice Off";
        }


        window.speechSynthesis.cancel();
    }
}


/* =========================================================
   SPEAK CURRENT INSTRUCTION
   ========================================================= */

function speakCurrentInstruction() {

    if (currentStep === 0) {

        speak(
            "Press Start Navigation to begin your journey."
        );

        return;
    }


    const index =
        Math.min(
            currentStep - 1,
            routeSteps.length - 1
        );


    speak(
        routeSteps[index][1]
    );
}


/* =========================================================
   SPEAK ALL INSTRUCTIONS
   ========================================================= */

function speakInstructions() {

    const instructions = [

        "Start from Entry.",

        "Follow the route towards Security.",

        "Continue towards the QR Gate.",

        "Enter the Main Corridor.",

        "Continue towards the Escalator.",

        "Continue towards the Platform.",

        "You have reached your destination."

    ];


    speak(
        instructions.join(" ")
    );
}


/* =========================================================
   CHATBOT
   ========================================================= */

function sendChatMessage() {

    const input =
        document.getElementById(
            "chatInput"
        );

    const messages =
        document.getElementById(
            "chatMessages"
        );


    if (!input || !messages) {
        return;
    }


    const userText =
        input.value.trim();


    if (userText === "") {
        return;
    }


    const userMessage =
        document.createElement(
            "div"
        );


    userMessage.style.textAlign =
        "right";

    userMessage.style.margin =
        "8px 0";


    userMessage.innerHTML =
        "<b>You:</b> " +
        escapeHTML(userText);


    messages.appendChild(
        userMessage
    );


    const botMessage =
        document.createElement(
            "div"
        );


    botMessage.className =
        "bot-message";


    botMessage.style.marginTop =
        "8px";


    botMessage.innerHTML =
        "<b>Metro Assistant:</b><br>" +
        getChatbotResponse(userText);


    messages.appendChild(
        botMessage
    );


    input.value = "";


    messages.scrollTop =
        messages.scrollHeight;
}


/* =========================================================
   ENTER KEY
   ========================================================= */

function chatEnter(event) {

    if (event.key === "Enter") {

        sendChatMessage();
    }
}


/* =========================================================
   CHATBOT RESPONSE
   ========================================================= */

function getChatbotResponse(message) {

    const text =
        message.toLowerCase();


    if (
        text.includes("platform")
    ) {

        return (
            "Your destination is " +
            escapeHTML(destination) +
            ". Follow the blue path to Platform " +
            escapeHTML(platform) +
            "."
        );
    }


    if (
        text.includes("destination") ||
        text.includes("where am i going")
    ) {

        return (
            "Your destination is " +
            escapeHTML(destination) +
            "."
        );
    }


    if (
        text.includes("security") ||
        text.includes("security check")
    ) {

        return (
            "Follow the blue path towards the Security Check."
        );
    }


    if (
        text.includes("qr") ||
        text.includes("qr gate")
    ) {

        return (
            "Show your metro QR ticket at the QR Gate."
        );
    }


    if (
        text.includes("washroom") ||
        text.includes("restroom")
    ) {

        return (
            "The washroom is located on the right side of the map."
        );
    }


    if (
        text.includes("cafe") ||
        text.includes("coffee")
    ) {

        return (
            "The cafe is located on the left side of the main corridor."
        );
    }


    if (
        text.includes("exit")
    ) {

        return (
            "After reaching the platform, follow the route towards the Exit."
        );
    }


    if (
        text.includes("hello") ||
        text.includes("hi")
    ) {

        return (
            "Hello! 👋 I can help you with the metro route."
        );
    }


    return (
        "Your destination is " +
        escapeHTML(destination) +
        ". You can ask me about the platform, security, QR gate, cafe, washroom or exit."
    );
}


/* =========================================================
   SECURITY
   ========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;
}


/* =========================================================
   LOAD ROUTE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        applyRoute();

    }
);