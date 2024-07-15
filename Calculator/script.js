const display = document.getElementById('display');
const expressionDisplay = document.getElementById('expression');
const buttons = document.querySelectorAll('.btn');
let displayValue = '0';
let expression = '';
let firstValue = null;
let operator = null;
let awaitingSecondValue = false;

function updateDisplay() {
    display.innerText = displayValue;
}

function updateExpression() {
    expressionDisplay.innerText = expression;
}

function handleNumber(num) {
    if (awaitingSecondValue) {
        displayValue = num;
        awaitingSecondValue = false;
    } else {
        displayValue = displayValue === '0' ? num : displayValue + num;
    }
    expression += num;
    updateDisplay();
    updateExpression();
}

function handleOperator(nextOperator) {
    if (nextOperator === 'del') {
        displayValue = displayValue.slice(0, -1) || '0';
        expression = expression.slice(0, -1);
        updateDisplay();
        updateExpression();
        return;
    }
    
    if (nextOperator === 'C') {
        resetCalculator();
        return;
    }
    
    if (nextOperator === 'sqrt') {
        displayValue = Math.sqrt(parseFloat(displayValue)).toString();
        expression = `√(${expression})`;
        updateDisplay();
        updateExpression();
        return;
    }
    
    const value = parseFloat(displayValue);
    if (operator && awaitingSecondValue) {
        operator = nextOperator;
        return;
    }

    if (firstValue === null) {
        firstValue = value;
    } else if (operator) {
        const result = performCalculation[operator](firstValue, value);
        displayValue = `${parseFloat(result.toFixed(7))}`;
        firstValue = result;
    }

    awaitingSecondValue = true;
    operator = nextOperator;
    expression += nextOperator;
    updateDisplay();
    updateExpression();
}

const performCalculation = {
    '/': (firstValue, secondValue) => firstValue / secondValue,
    '*': (firstValue, secondValue) => firstValue * secondValue,
    '+': (firstValue, secondValue) => firstValue + secondValue,
    '-': (firstValue, secondValue) => firstValue - secondValue,
    '=': (firstValue, secondValue) => secondValue
};

function resetCalculator() {
    displayValue = '0';
    firstValue = null;
    operator = null;
    awaitingSecondValue = false;
    expression = '';
    updateDisplay();
    updateExpression();
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const { num, operator } = button.dataset;

        if (num) {
            handleNumber(num);
        } else if (operator) {
            handleOperator(operator);
        }
    });
});
