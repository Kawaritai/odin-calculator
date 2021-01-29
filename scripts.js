const operations = new Set("+-*/");
const opToWord = {
  "+": "add",
  "-": "subtract",
  "*": "multiply",
  "/": "divide",
};

function operate(operator, a, b) {
  // Ensure numbers are floats
  a = parseFloat(a);
  b = parseFloat(b);
  let result = null;
  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = a / b;
      if (b === 0) {
        return "Snarky error message";
      }
      break;
  }
  return result;
}

// Global variables: displayed values, operands and operators
const history = document.querySelector("#history");
const displayNode = document.querySelector("#calc-display");
const decimalNode = document.querySelector("#decimal-btn");
let displayNum = "";
let numA, numB;
let operation;

// When await is true, an entered numbers will overwrite the existing displayed number
let await = false;

// Number inputs
document.querySelectorAll(".num-btn").forEach((btn) => {
  btn.id = `num-btn-${btn.dataset.num}`;
  btn.addEventListener("click", () => {
    // Add to display's number
    setDisplay(btn.dataset.num, !await);
    await = false;
  });
});

// Decimal input
decimalNode.addEventListener("click", () => {
  updateDecimalNode();
  if (displayNode.textContent.includes(".")) {
    return;
  } else {
    setDisplay(".", !await);
    await = false;
    return;
  }
});

// Keyboard inputs
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (!isNaN(key)) {
    document.querySelector(`#num-btn-${parseInt(key)}`).click();
  } else if (operations.has(key)) {
    document.querySelector(`#op-btn-${opToWord[key]}`).click();
  } else if (e.ctrlKey && e.key === "Backspace") {
    document.querySelector("#ce-btn").click();
  } else {
    switch (key) {
      case ".":
        document.querySelector(`#decimal-btn`).click();
        break;

      case "Enter":
      case "=":
        document.querySelector(`#equals-btn`).click();
        break;

      case "Delete":
      case "Backspace":
        document.querySelector(`#del-btn`).click();
        break;

      case "Escape":
        document.querySelector("#c-btn").click();
        break;
    }
  }
});

// Arithmetic operations
document.querySelectorAll(".op-btn").forEach((btn) => {
  btn.id = `op-btn-${opToWord[btn.dataset.op]}`;
  btn.addEventListener("click", () => {
    if (isValid(displayNum)) {
      // Evaluate previous operation
      if (operation) {
        calcEval();
        numB = null;
        // Error thrown "ERR", reset numbers
        if (!isValid(displayNum)) {
          history.textContent = "";
          clearAll();
          return;
        }
      }
      // Set numA, clear upon entry of numB
      numA = displayNum;
      await = true;
      operation = btn.dataset.op;
      // Update history
      if (numA) history.textContent = `${formatNum(numA)} ${operation}`;
    }
    updateDecimalNode();
  });
});

// Evaluate expression
document.querySelectorAll(".action-btn").forEach((btn) => {
  if (btn.dataset.action == "=")
    btn.addEventListener("click", () => {
      if (isValid(displayNum) && operation) {
        calcEval();
        // Update history
        history.textContent = `${formatNum(numA)} ${operation} ${formatNum(
          numB
        )} = `;
        clearAll();
      }
    });
});

// Clear entry
document.querySelector("#ce-btn").addEventListener("click", () => {
  // Clear current display
  setDisplay();
  // Clear all history
  if (await) {
    [numA, numB] = [null, null];
    operation = null;
    history.textContent = "";
  }
});

// Clear
document.querySelector("#c-btn").addEventListener("click", () => {
  // Clear all
  setDisplay();
  clearAll();
  history.textContent = "";
});

// Delete last
document.querySelector("#del-btn").addEventListener("click", () => {
  let txt = displayNode.textContent;
  if (txt === "-" || txt === ".") {
    setDisplay();
    return;
  }

  if (txt.length > 0) {
    let result = txt.match(/^[-]?[0-9]+[.]?[0-9]*/g);
    if (result === null) {
      return;
    }
    if (result[0] !== txt) {
      return;
    }
    displayNode.textContent = displayNode.textContent.slice(0, -1);
    displayNum = displayNode.textContent;
    updateDecimalNode();
  }
});

// HELPER FUNCTIONS

function setDisplay(input = "", add = false, resulting = false) {
  // Append onto displayed number
  if (add) {
    if (displayNode.textContent.length < 10) {
      // Leading decimal
      if (input === "." && displayNode.textContent === "") {
        console.log("lmao");
        input = "0.";
      }

      displayNode.textContent += input;
      displayNum += input;
    }
    // Overwrite displayed number
  } else {
    if (resulting) {
      if (input === "Snarky error message") {
        alert("Not today, chief.");
        [displayNum, displayNode.textContent] = [null, "ERR"];
        return;
      }
      console.log(operation, numA, numB);
      // Integer too large
      if (parseFloat(input) > 9.99999e99) {
        input = "ERR";
        displayNum = null;
      } else {
        // Set displayNum to be the "actual" number (here it becomes a number rather than a string)
        displayNum = input;

        // Format input number to be displayed
        input = formatNum(input);
      }
      displayNode.textContent = input;
    } else {
      displayNode.textContent = input;
      displayNum = input;
    }
  }
  updateDecimalNode();
}

function isValid(num) {
  // Rejects NaN values or integers over 10 digits
  let intLength = Math.round(num).toString().length;
  return !isNaN(parseFloat(num));
}

function calcEval() {
  // Operate with pair of numbers and display
  numB = displayNum;
  result = operate(operation, numA, numB);
  setDisplay(result, undefined, true);
}

function clearAll() {
  // Does NOT clear display values or history
  numA = null;
  numB = null;
  operation = null;
  await = true;
  updateDecimalNode();
}

function formatNum(num) {
  // Displaying for numbers >= 10**
  if (parseFloat(num) >= 10 ** 10) {
    return num.toPrecision(6);
  }
  let stripped = num.toString().replace(/[-]/g, "");
  let intLength = Math.round(stripped).toString().length;
  return Math.round(num * 10 ** (10 - intLength)) / 10 ** (10 - intLength);
}

// DEBUGGING
const debug = document.querySelector("#debug");
document.querySelector("body").onclick = () => {
  debug.innerHTML = `${numA} ${operation} ${numB}<br>displayNum: ${typeof displayNum}`;
};

function updateDecimalNode() {
  decimalNode.disabled = displayNode.textContent.includes(".");
}
