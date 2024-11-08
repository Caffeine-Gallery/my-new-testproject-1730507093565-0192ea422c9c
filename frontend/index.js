import { backend } from 'declarations/backend';

const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
const loading = document.getElementById('loading');

let currentInput = '';
let operator = '';
let firstOperand = '';

buttons.forEach(button => {
    button.addEventListener('click', () => handleButtonClick(button.textContent));
});

async function handleButtonClick(value) {
    if (value >= '0' && value <= '9' || value === '.') {
        currentInput += value;
        updateDisplay();
    } else if (['+', '-', '*', '/'].includes(value)) {
        if (currentInput !== '') {
            if (firstOperand === '') {
                firstOperand = currentInput;
                currentInput = '';
            } else {
                await calculate();
            }
            operator = value;
        }
    } else if (value === '=') {
        if (currentInput !== '' && firstOperand !== '' && operator !== '') {
            await calculate();
        }
    } else if (value === 'Clear') {
        clear();
    }
}

async function calculate() {
    if (currentInput === '' || firstOperand === '' || operator === '') return;

    loading.classList.remove('hidden');

    try {
        const result = await backend.calculate(parseFloat(firstOperand), parseFloat(currentInput), operator);
        currentInput = result.toString();
        firstOperand = '';
        operator = '';
        updateDisplay();
    } catch (error) {
        console.error('Calculation error:', error);
        currentInput = 'Error';
        updateDisplay();
    } finally {
        loading.classList.add('hidden');
    }
}

function updateDisplay() {
    display.value = currentInput;
}

function clear() {
    currentInput = '';
    firstOperand = '';
    operator = '';
    updateDisplay();
}
