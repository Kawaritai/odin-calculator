// Global variables: displayed values, operands and operators
const history = document.querySelector("#history");
const displayNode = document.querySelector("#calc-display");
const decimalNode = document.querySelector("#decimal-btn");
let displayNum = "";
let numA, numB;
let operation;

// When await is true, entered numbers will overwrite the existing displayed number
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
        document.querySelector("#equals-btn").click();
        // Error thrown "ERR", reset numbers
        if (!isValid(displayNum)) {
          history.textContent = "";
          clearValues();
          return;
        }
      }
      // Set numA, clear upon entry of numB
      numA = displayNum;
      await = true;
      operation = btn.dataset.op;
      // Update history
      if (numA !== null && numA !== undefined)
        history.textContent = `${formatNum(numA)} ${operation}`;
    }
    updateDecimalNode();
  });
});

// Evaluate expression
document.querySelector("#equals-btn").addEventListener("click", () => {
  if (isValid(displayNum) && operation) {
    calcEval();
    // Update history
    history.textContent = `${formatNum(numA)} ${operation} ${formatNum(
      numB
    )} = `;
    clearValues();
  }
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

// Clear all
document.querySelector("#c-btn").addEventListener("click", () => {
  // Start from scratch
  setDisplay();
  clearValues();
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

document.querySelector("#plus-minus-btn").addEventListener("click", () => {
  if (displayNode.textContent[0] !== "-") {
    displayNode.textContent = "-" + displayNode.textContent;
    displayNum = "-" + displayNum;
  } else {
    displayNode.textContent = displayNode.textContent.slice(1);
    displayNum = displayNum.slice(1);
  }
});
