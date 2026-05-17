/*
    Final Project
    Author: Alex Florian
    Date: May 2026
    Filename: script.js
*/

"use strict";

/* Form Validation */
var registrationForm = document.getElementById("registrationForm");

if (registrationForm) {
    registrationForm.addEventListener("submit", validateForm);
}

function validateForm(event) {
    event.preventDefault();

    var fullName = document.getElementById("fullName").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var age = document.getElementById("age").value.trim();
    var membership = document.getElementById("membership").value;
    var goals = document.getElementById("goals").value.trim();
    var time = document.getElementById("time").value;
    var level = document.getElementById("level").value;

    var formMessage = document.getElementById("formMessage");
    var errors = [];

    var requiredFields = [fullName, email, phone, age, membership, goals, time, level];

    for (var i = 0; i < requiredFields.length; i++) {
        if (requiredFields[i] === "") {
            errors.push("All fields must be completed.");
            break;
        }
    }

    if (!validateEmail(email)) {
        errors.push("Please enter a valid email address.");
    }

    if (!validatePhone(phone)) {
        errors.push("Phone number must be in this format: 123-456-7890.");
    }

    if (isNaN(age) || age < 13 || age > 100) {
        errors.push("Age must be a number between 13 and 100.");
    }

    switch (membership) {
        case "basic":
        case "standard":
        case "premium":
            break;
        default:
            errors.push("Please select a valid membership type.");
    }

    if (errors.length > 0) {
        formMessage.className = "error";
        formMessage.innerHTML = "";

        for (var j = 0; j < errors.length; j++) {
            formMessage.innerHTML += "<p>" + errors[j] + "</p>";
        }
    } else {
        formMessage.className = "success";
        formMessage.innerHTML = "<p>Registration submitted successfully. Welcome to PowerHouse Gym!</p>";
        registrationForm.reset();
    }
}

function validateEmail(email) {
    var emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    return emailPattern.test(email);
}

function validatePhone(phone) {
    var phonePattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    return phonePattern.test(phone);
}

/* Workout of the Day Generator */
var workoutButton = document.getElementById("workoutButton");

if (workoutButton) {
    workoutButton.addEventListener("click", generateWorkout);
}

function generateWorkout() {
    var workouts = [
        "20 push-ups, 30 squats, 20 sit-ups, and a 1-minute plank.",
        "10 burpees, 25 lunges, 30 jumping jacks, and a 2-minute jog.",
        "15 dumbbell rows, 20 mountain climbers, 15 squats, and 10 push-ups.",
        "30-second wall sit, 20 crunches, 20 step-ups, and 1-minute plank.",
        "5-minute warm-up walk, 3 rounds of squats, push-ups, and jumping jacks."
    ];

    var randomNumber = Math.floor(Math.random() * workouts.length);

    document.getElementById("workoutResult").textContent = workouts[randomNumber];
}

/* Countdown Clock */
var countdownBox = document.getElementById("countdown");

if (countdownBox) {
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    var eventDate = new Date("June 1, 2026 09:00:00").getTime();
    var currentDate = new Date().getTime();
    var timeLeft = eventDate - currentDate;

    if (timeLeft <= 0) {
        countdownBox.textContent = "The Summer Fitness Challenge has started!";
        return;
    }

    var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    var seconds = Math.floor((timeLeft / 1000) % 60);

    countdownBox.textContent = days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds";
}

/* Rep Rush Game */
var startRepGameButton = document.getElementById("startRepGame");
var repPlayer = document.getElementById("repPlayer");
var repNeedle = document.getElementById("repNeedle");
var perfectArc = document.getElementById("perfectArc");
var repScoreBox = document.getElementById("repScore");
var repHighScoreBox = document.getElementById("repHighScore");
var repSpeedBox = document.getElementById("repSpeed");
var repMessage = document.getElementById("repMessage");

var repScore = 0;
var repHighScore = localStorage.getItem("repHighScore") || 0;
var needleAngle = 0;
var needleSpeed = 3;
var needleDirection = 1;
var gameRunning = false;
var repGameLoop;

var perfectStartAngle = 315;
var perfectRange = 55;

if (repHighScoreBox) {
    repHighScoreBox.textContent = repHighScore;
}

if (startRepGameButton) {
    startRepGameButton.addEventListener("click", startRepGame);
}

document.addEventListener("keydown", checkRepKey);

function startRepGame() {
    repScore = 0;
    needleAngle = 0;
    needleSpeed = 3;
    needleDirection = 1;
    gameRunning = true;

    repScoreBox.textContent = repScore;
    repSpeedBox.textContent = "Beginner";
    repMessage.textContent = "Press SPACE when the blue needle reaches the red zone!";
    startRepGameButton.textContent = "Restart Game";

    if (repPlayer) {
        repPlayer.src = "images/bodybuilder-up.png";
    }

    movePerfectArc();

    clearInterval(repGameLoop);
    repGameLoop = setInterval(moveRepNeedle, 20);
}

function moveRepNeedle() {
    if (!gameRunning || !repNeedle) {
        return;
    }

    needleAngle += needleSpeed * needleDirection;

    if (needleAngle >= 360) {
        needleAngle = needleAngle - 360;
    }

    if (needleAngle < 0) {
        needleAngle = needleAngle + 360;
    }

    repNeedle.style.transform = "translate(-50%, -100%) rotate(" + needleAngle + "deg)";
}

function checkRepKey(event) {
    if (!gameRunning) {
        return;
    }

    if (event.code === "Space") {
        event.preventDefault();

        if (event.repeat) {
            return;
        }

        checkRepTiming();
    }
}

function checkRepTiming() {
    if (isNeedleInPerfectZone()) {
        successfulRep();
    } else {
        endRepGame();
    }
}

function isNeedleInPerfectZone() {
    var zoneEnd = perfectStartAngle + perfectRange;

    if (zoneEnd >= 360) {
        zoneEnd = zoneEnd - 360;

        return needleAngle >= perfectStartAngle || needleAngle <= zoneEnd;
    } else {
        return needleAngle >= perfectStartAngle && needleAngle <= zoneEnd;
    }
}

function successfulRep() {
    repScore++;
    repScoreBox.textContent = repScore;
    repMessage.textContent = "Perfect rep! Keep going.";

    animateRep();

    needleDirection = needleDirection * -1;

    movePerfectArc();

    if (repScore % 3 === 0) {
        needleSpeed++;
    }

    if (needleSpeed <= 4) {
        repSpeedBox.textContent = "Beginner";
    } else if (needleSpeed <= 7) {
        repSpeedBox.textContent = "Intermediate";
    } else {
        repSpeedBox.textContent = "Advanced";
    }
}

function movePerfectArc() {
    if (!perfectArc) {
        return;
    }

    perfectStartAngle = Math.floor(Math.random() * 360);

    perfectArc.style.transform = "rotate(" + perfectStartAngle + "deg)";
}

function animateRep() {
    if (!repPlayer) {
        return;
    }

    repPlayer.src = "images/bodybuilder-squat.png";

    setTimeout(function() {
        repPlayer.src = "images/bodybuilder-up.png";
    }, 200);
}

function endRepGame() {
    gameRunning = false;
    clearInterval(repGameLoop);

    if (repPlayer) {
        repPlayer.src = "images/bodybuilder-up.png";
    }

    if (repScore > repHighScore) {
        repHighScore = repScore;
        localStorage.setItem("repHighScore", repHighScore);
        repHighScoreBox.textContent = repHighScore;
        repMessage.textContent = "Game over! New high score: " + repScore + " reps!";
    } else {
        repMessage.textContent = "Game over! Final score: " + repScore + " reps.";
    }
}

/* Light and Dark Mode */
var themeButton = document.getElementById("themeButton");

/* Apply saved theme when any page loads */
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");

    if (themeButton) {
        themeButton.textContent = "Toggle Light Mode";
    }
}

/* Button only exists on creative.html */
if (themeButton) {
    themeButton.addEventListener("click", changeTheme);
}

function changeTheme() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeButton.textContent = "Toggle Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeButton.textContent = "Toggle Dark Mode";
    }
}