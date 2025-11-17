// Get reference to the display element
const display = document.getElementById('display');

// Variables to store calculator state
let currentInput = '0';      // Current number being entered
let previousInput = null;    // Previous number
let operator = null;         // Current operator (+, -, ×, ÷)
let shouldResetDisplay = false; // Flag to reset display on next number input

/**
 * Updates the display with the current input value
 */
function updateDisplay() {
    display.textContent = currentInput;
}

/**
 * Appends a number to the current input
 * @param {string} number - The number to append (as a string)
 */
function appendNumber(number) {
    // If display should be reset (after calculation), start fresh
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    // If current input is '0', replace it; otherwise append
    if (currentInput === '0') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    
    updateDisplay();
}

/**
 * Handles decimal point input
 */
function appendDecimal() {
    // If display should be reset, start fresh with '0.'
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else if (!currentInput.includes('.')) {
        // Only add decimal if one doesn't already exist
        currentInput += '.';
    }
    
    updateDisplay();
}

/**
 * Handles operator button clicks (+, -, ×, ÷)
 * @param {string} op - The operator symbol
 */
function appendOperator(op) {
    // If there's a previous calculation pending, calculate it first
    if (previousInput !== null && operator !== null && !shouldResetDisplay) {
        calculate();
    }
    
    // Store current input as previous input
    previousInput = currentInput;
    // Store the operator
    operator = op;
    // Reset flag so next number input starts fresh
    shouldResetDisplay = true;
}

/**
 * Performs the calculation based on stored values and operator
 */
function calculate() {
    // If we don't have both numbers and an operator, do nothing
    if (previousInput === null || operator === null) {
        return;
    }
    
    // Convert strings to numbers for calculation
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
    // Perform the appropriate calculation based on operator
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '−':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            // Prevent division by zero
            if (current === 0) {
                currentInput = 'Error';
                updateDisplay();
                // Reset calculator state
                previousInput = null;
                operator = null;
                shouldResetDisplay = true;
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Round result to avoid floating point precision issues
    // Limit to 10 decimal places
    result = Math.round(result * 10000000000) / 10000000000;
    
    // Update display with result
    currentInput = result.toString();
    updateDisplay();
    
    // Reset calculator state for next operation
    previousInput = null;
    operator = null;
    shouldResetDisplay = true;
}

/**
 * Clears the calculator and resets to initial state
 */
function clearDisplay() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

// Initialize display on page load
updateDisplay();

