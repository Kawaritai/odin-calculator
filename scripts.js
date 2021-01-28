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
      break;
  }
  return result;
}

const history = document.querySelector("#history");
const displayNode = document.querySelector("#calc-display");
let displayNum = "";
let numA, numB;
let operation;

// When await is true, an entered numbers will overwrite the existing displayed number
let await = false;


// Number inputs
document.querySelectorAll(".num-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Add to display's number
    setDisplay(btn.dataset.num, !await);
    await = false;
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

// Arithmetic operations
document.querySelectorAll(".op-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (isValid(displayNum)) {
      console.log(isValid(displayNum));
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
      if (numA !== null)
        history.textContent = `${formatNum(numA)} ${operation}`;
    }
  });
});

// Evaluate
document.querySelectorAll(".action-btn").forEach((btn) => {
  if (btn.dataset.action == "=")
    btn.addEventListener("click", () => {
      if (isValid(displayNum) && operation !== null) {
        calcEval();
        // Update history
        history.textContent = `${formatNum(numA)} ${operation} ${formatNum(numB)} = `;
        clearAll();
      }
    });
});

function setDisplay(txt = "", add = false, resulting = false) {
  // Append onto displayed number
  if (add) {
    if (displayNode.textContent.length < 10) {
      displayNode.textContent += txt;
      displayNum += txt;
    }
  // Overwrite displayed number
  } else {
    if (resulting) {
      // Find length of integer component
      let stripped = txt.toString().replace(/[-]/g, "");
      let intLength = Math.round(stripped).toString().length;
      console.log(operation, numA, numB);
      // Integer too large
      if (intLength > 10) {
        txt = "ERR";
        displayNum = null;
      } else {
        // Set displayNum to be the "actual" number
        displayNum = txt;

        // Round txt number
        txt = Math.round(txt * 10 ** (10 - intLength)) / 10 ** (10 - intLength);
      }
      displayNode.textContent = txt;
    } else {
      // Usually used to clear display
      displayNode.textContent = txt;
      displayNum = txt;
    }
  }
}

function isValid(num) {
  // Rejects NaN values or integers over 10 digits
  let intLength = Math.round(num).toString().length;
  return !isNaN(parseFloat(num)) && intLength < 11;
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
}

function formatNum(num) {
  // Restricts numbers to 10 individual digits at most (ignores symbols)
  let stripped = num.toString().replace(/[-.]/g, "");
  let intLength = Math.round(stripped).toString().length;
  return Math.round(num * 10 ** (10 - intLength)) / 10 ** (10 - intLength);
}

// DEBUGGING
const debug = document.querySelector("#debug");
document.querySelector("body").onclick = () => {
  debug.innerHTML = `${numA} ${operation} ${numB}<br>displayNum: ${displayNum}`;
};
