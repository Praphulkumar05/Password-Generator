// Selecting elements
const inputSlider = document.querySelector("[data-length-slider]");
const dataLength = document.querySelector("[data-length-number]");
const dataPasswordDisplay = document.querySelector("[data-password-display]");
const dataCopyMsg = document.querySelector("[data-copy-msg]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const dataIndicator = document.querySelector("[data-indicator]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const number = document.querySelector("#numbers");
const symbol = document.querySelector("#symbols");
const generateBtn = document.querySelector(".genrate-pass");
const copyBtn = document.querySelector("[data-copy]");
const Symbols = "<>?/\\*{[}])(=-+_$%^&*#@!~\"'";

let password = "";
let passwordLength = 10;
let checkCount = 0;

// Function to update slider and display value
function handleSlider() {
    inputSlider.value = passwordLength; 
    dataLength.innerText = passwordLength; 
}

function indiCatorColor(color) {
    dataIndicator.style.backgroundColor = color;
}

// Corrected random number generator
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
    return getRandom(0, 10);
}

function getRandomLowerCase() {
    return String.fromCharCode(getRandom(97, 123));
}

function getRandomUpperCase() {
    return String.fromCharCode(getRandom(65, 91));
}

function getRandomSymbol() {
    const randomIndex = getRandom(0, Symbols.length);
    return Symbols.charAt(randomIndex);
}

function CalcStrength() {
    let hasUpper = uppercase.checked;
    let hasLower = lowercase.checked;
    let hasNumber = number.checked;
    let hasSymbol = symbol.checked;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        indiCatorColor("#0f0"); // Green for strong
    } else if ((hasLower || hasUpper) && (hasNumber || hasSymbol) || passwordLength >= 6) {
        indiCatorColor("#ff0"); // Yellow for medium
    } else {
        indiCatorColor("#f00"); // Red for weak
    }
}

async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(dataPasswordDisplay.value);
        dataCopyMsg.innerText = "Copied!";
    } catch (e) {
        dataCopyMsg.innerText = "Failed!";
    }

    dataCopyMsg.classList.add("active");
    setTimeout(() => {
        dataCopyMsg.classList.remove("active");
    }, 2000);
}

// Function to shuffle password characters
function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
}

// Handle slider input
inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// Handle copy button
copyBtn.addEventListener("click", () => {
    if (dataPasswordDisplay.value) {
        copyToClipboard();
    }
});

// Handle checkbox change
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// Add event listeners for checkboxes
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

// Generate password
generateBtn.addEventListener("click", () => {
    if (checkCount <= 0) return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    let FuncArr = [];

    if (uppercase.checked) FuncArr.push(getRandomUpperCase);
    if (lowercase.checked) FuncArr.push(getRandomLowerCase);
    if (number.checked) FuncArr.push(getRandomNumber);
    if (symbol.checked) FuncArr.push(getRandomSymbol);

    // Ensure at least one of each selected category is in the password
    for (let i = 0; i < FuncArr.length; i++) {
        password += FuncArr[i]();
    }

    // Fill the rest of the password length
    for (let i = 0; i < passwordLength - FuncArr.length; i++) {
        let randIdx = getRandom(0, FuncArr.length);
        password += FuncArr[randIdx]();
    }

    // Shuffle password
    password = shufflePassword(Array.from(password));
    dataPasswordDisplay.value = password;

    // Update password strength
    CalcStrength();
});
