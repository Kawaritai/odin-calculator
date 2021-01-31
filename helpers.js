// OPERATE

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
  if (isNaN(result)) {
    // Catch-all NaN errors
    alert("Oops!");
    // Clear
    document.querySelector("#c-btn").click();
  }
  return result;
}

// HELPER FUNCTIONS

function setDisplay(input = "", add = false, resulting = false) {
  // Append onto displayed number
  if (add) {
    if (displayNode.textContent.length < 10) {
      // Leading decimal
      if (input === "." && displayNode.textContent === "") {
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

function clearValues() {
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

function updateDecimalNode() {
  decimalNode.disabled = displayNode.textContent.includes(".");
}