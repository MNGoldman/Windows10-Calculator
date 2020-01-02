// 💯 ✌
class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextELement = currentOperandTextElement
    this.clear();
  }

  delete() {
    // Slice off "delete" last most digit
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }

  clear() {
    // Clear all operands and operator bindings
    this.previousOperand = ''
    this.currentOperand = ''
    this.operator = undefined
  }

  appendNumber(number) {
    // Add Number to the end of display and stringify, also validates to not allow multiple decimal points
    if (number === '.' && this.currentOperand.includes('.')) return
    this.currentOperand = this.currentOperand + number.toString()
  }

  formatNumber(number) {
    // Format number input by converting to string and spliting by deciaml points, then use toLocaleString
    number = Math.round(number * 100 + Number.EPSILON) / 100
    const stringNum = number.toString()
    const integerNum = parseFloat(stringNum.split('.')[0])
    let decimalDigits = stringNum.split('.')[1]
    let integerDisplay

    integerDisplay = integerNum.toLocaleString('en', {
      maximumFractionDigits: 0
    })

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  updateDisplay() {
    // Update current operand
    this.currentOperandTextELement.innerText = this.formatNumber(this.currentOperand)
    // Update previous operand
    if (this.operator != null) {
      this.previousOperandTextElement.innerText = `${this.formatNumber(this.previousOperand)} ${this.operator}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }

  chooseOperator(operator) {
    /* Performance the calculator feature where imputs will perform selected 
    operation in-between steps for multiple operations */
    if (this.currentOperand === '') return
    if (this.previousOperand !== '.') {
      this.compute()
    }

    if (OneInputOperators.includes(operator)) {
      this.operator = operator
      this.compute()
    } else {
      this.operator = operator
      this.previousOperand = this.currentOperand
      this.currentOperand = ''
    }
  }

  compute() {
    // Perform Math, convert strings back to numbers
    let computation
    let curr = parseFloat(this.currentOperand)
    let prev = parseFloat(this.previousOperand)

    if (typeof this.operator === 'undefined') return
    computation = mathFunctions[this.operator](prev, curr);
    if (computation === Infinity || isNaN(computation)) {
      alert("Overflow or Logically Impossible Error.")
      return this.clear()
    }
    // Update operands, operator, and pass compute value to display
    this.clear()
    this.appendNumber(computation)
  }
}

// Initalize DOM Bindings
const numberButtons = document.querySelectorAll('[data-number]'),
  operationButtons = document.querySelectorAll('[data-operation]'),
  deleteButton = document.querySelector('[data-delete]'),
  allClearButton = document.querySelector('[data-all-clear]'),
  equalsButton = document.querySelector('[data-equals]'),
  previousOperandTextElement = document.querySelector('[data-previous-operand]'),
  currentOperandTextELement = document.querySelector('[data-current-operand]');

// Initalize Calculator
const calculator = new Calculator(previousOperandTextElement, currentOperandTextELement)

// Initalize Data Structures
const OneInputOperators = ['±', '𝓍²', '¹/𝓍', '√'],

mathFunctions = {
  '±'(prev, curr) {return curr * -1},
  '¹/𝓍'(prev, curr) {return 1 / curr},
  '𝓍²'(prev, curr) {return curr ** 2},
  '√'(prev, curr) {return Math.sqrt(curr)},
  '÷'(prev, curr) {return curr === 0 ? 0 : prev / curr},
  '−'(prev, curr) {return prev - curr},
  '+'(prev, curr) {return prev + curr},
  '×'(prev, curr) {return prev * curr},
  '%'(prev, curr) {return prev * (curr / 100)}
};

// Initalize Event Listeners
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperator(button.innerText)
    calculator.updateDisplay()
  })
})

deleteButton.addEventListener('click', () => {
  calculator.delete()
  calculator.updateDisplay()
})

allClearButton.addEventListener('click', () => {
  calculator.clear()
  calculator.updateDisplay()
})

equalsButton.addEventListener('click', () => {
  calculator.compute()
  calculator.updateDisplay()
})