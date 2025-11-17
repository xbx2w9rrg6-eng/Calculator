import React, { useState } from 'react'
import './App.css'

/**
 * Scientific Calculator App Component
 * Manages calculator state using React hooks with scientific functions
 */
function App() {
  // State variables to store calculator data
  const [currentInput, setCurrentInput] = useState('0')      // Current number being entered
  const [previousInput, setPreviousInput] = useState(null)    // Previous number
  const [operator, setOperator] = useState(null)              // Current operator (+, -, ×, ÷, ^)
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false) // Flag to reset display on next number input
  const [memory, setMemory] = useState(0)                     // Memory storage
  const [angleMode, setAngleMode] = useState('DEG')           // Angle mode: DEG or RAD

  /**
   * Appends a number to the current input
   * @param {string} number - The number to append (as a string)
   */
  const appendNumber = (number) => {
    if (shouldResetDisplay) {
      setCurrentInput('0')
      setShouldResetDisplay(false)
    }
    
    setCurrentInput(prev => {
      if (prev === '0' || prev === 'Error') {
        return number
      } else {
        return prev + number
      }
    })
  }

  /**
   * Handles decimal point input
   */
  const appendDecimal = () => {
    if (shouldResetDisplay) {
      setCurrentInput('0.')
      setShouldResetDisplay(false)
    } else {
      setCurrentInput(prev => {
        if (prev === 'Error') return '0.'
        if (!prev.includes('.')) {
          return prev + '.'
        }
        return prev
      })
    }
  }

  /**
   * Handles operator button clicks (+, -, ×, ÷, ^)
   * @param {string} op - The operator symbol
   */
  const appendOperator = (op) => {
    if (previousInput !== null && operator !== null && !shouldResetDisplay) {
      const result = performCalculation(previousInput, currentInput, operator)
      if (result !== null) {
        setCurrentInput(result.toString())
      }
    }
    
    setPreviousInput(currentInput)
    setOperator(op)
    setShouldResetDisplay(true)
  }

  /**
   * Performs basic binary operations
   */
  const performCalculation = (prev, current, op) => {
    const prevNum = parseFloat(prev)
    const currentNum = parseFloat(current)
    
    if (isNaN(prevNum) || isNaN(currentNum)) return null
    
    let result
    switch (op) {
      case '+':
        result = prevNum + currentNum
        break
      case '−':
        result = prevNum - currentNum
        break
      case '×':
        result = prevNum * currentNum
        break
      case '÷':
        if (currentNum === 0) {
          setCurrentInput('Error')
          setPreviousInput(null)
          setOperator(null)
          setShouldResetDisplay(true)
          return null
        }
        result = prevNum / currentNum
        break
      case '^':
        result = Math.pow(prevNum, currentNum)
        break
      default:
        return null
    }
    
    result = Math.round(result * 10000000000) / 10000000000
    return result
  }

  /**
   * Performs the calculation based on stored values and operator
   */
  const calculate = () => {
    if (previousInput === null || operator === null) {
      return
    }
    
    const result = performCalculation(previousInput, currentInput, operator)
    if (result !== null) {
      setCurrentInput(result.toString())
      setPreviousInput(null)
      setOperator(null)
      setShouldResetDisplay(true)
    }
  }

  /**
   * Clears the calculator and resets to initial state
   */
  const clearDisplay = () => {
    setCurrentInput('0')
    setPreviousInput(null)
    setOperator(null)
    setShouldResetDisplay(false)
  }

  /**
   * Clears entry (CE) - clears current input only
   */
  const clearEntry = () => {
    setCurrentInput('0')
    setShouldResetDisplay(false)
  }

  /**
   * Converts angle to radians if needed
   */
  const toRadians = (degrees) => {
    return angleMode === 'DEG' ? (degrees * Math.PI) / 180 : degrees
  }

  /**
   * Converts radians to degrees if needed
   */
  const toDegrees = (radians) => {
    return angleMode === 'DEG' ? (radians * 180) / Math.PI : radians
  }

  /**
   * Applies a scientific function to the current input
   */
  const applyFunction = (func) => {
    const num = parseFloat(currentInput)
    if (isNaN(num)) return
    
    let result
    try {
      switch (func) {
        case 'sin':
          result = Math.sin(toRadians(num))
          break
        case 'cos':
          result = Math.cos(toRadians(num))
          break
        case 'tan':
          result = Math.tan(toRadians(num))
          break
        case 'arcsin':
          result = toDegrees(Math.asin(num))
          if (isNaN(result)) throw new Error('Domain error')
          break
        case 'arccos':
          result = toDegrees(Math.acos(num))
          if (isNaN(result)) throw new Error('Domain error')
          break
        case 'arctan':
          result = toDegrees(Math.atan(num))
          break
        case 'log':
          if (num <= 0) throw new Error('Domain error')
          result = Math.log10(num)
          break
        case 'ln':
          if (num <= 0) throw new Error('Domain error')
          result = Math.log(num)
          break
        case 'sqrt':
          if (num < 0) throw new Error('Domain error')
          result = Math.sqrt(num)
          break
        case 'cbrt':
          result = Math.cbrt(num)
          break
        case 'square':
          result = num * num
          break
        case 'cube':
          result = num * num * num
          break
        case 'factorial':
          if (num < 0 || num !== Math.floor(num)) throw new Error('Domain error')
          if (num > 170) throw new Error('Overflow')
          result = factorial(num)
          break
        case 'percent':
          result = num / 100
          break
        case 'inverse':
          if (num === 0) throw new Error('Division by zero')
          result = 1 / num
          break
        case 'exp':
          result = Math.exp(num)
          if (!isFinite(result)) throw new Error('Overflow')
          break
        case '10x':
          result = Math.pow(10, num)
          if (!isFinite(result)) throw new Error('Overflow')
          break
        default:
          return
      }
      
      result = Math.round(result * 10000000000) / 10000000000
      setCurrentInput(result.toString())
      setShouldResetDisplay(true)
    } catch (error) {
      setCurrentInput('Error')
      setShouldResetDisplay(true)
    }
  }

  /**
   * Calculates factorial
   */
  const factorial = (n) => {
    if (n === 0 || n === 1) return 1
    let result = 1
    for (let i = 2; i <= n; i++) {
      result *= i
    }
    return result
  }

  /**
   * Inserts a constant value
   */
  const insertConstant = (constant) => {
    let value
    switch (constant) {
      case 'π':
        value = Math.PI.toString()
        break
      case 'e':
        value = Math.E.toString()
        break
      default:
        return
    }
    setCurrentInput(value)
    setShouldResetDisplay(true)
  }

  /**
   * Memory functions
   */
  const memoryAdd = () => {
    const num = parseFloat(currentInput)
    if (!isNaN(num)) {
      setMemory(prev => prev + num)
    }
  }

  const memorySubtract = () => {
    const num = parseFloat(currentInput)
    if (!isNaN(num)) {
      setMemory(prev => prev - num)
    }
  }

  const memoryRecall = () => {
    setCurrentInput(memory.toString())
    setShouldResetDisplay(true)
  }

  const memoryClear = () => {
    setMemory(0)
  }

  /**
   * Toggles angle mode between degrees and radians
   */
  const toggleAngleMode = () => {
    setAngleMode(prev => prev === 'DEG' ? 'RAD' : 'DEG')
  }

  return (
    <div className="calculator scientific">
      {/* Display screen */}
      <div className="display-container">
        <div className="angle-mode">{angleMode}</div>
        <div className="display">{currentInput}</div>
      </div>
      
      {/* Calculator buttons container */}
      <div className="calculator-grid">
        {/* Left column: Scientific functions */}
        <div className="scientific-functions">
          {/* Row 1: Clear and mode */}
          <button className="btn clear" onClick={clearDisplay}>C</button>
          <button className="btn clear" onClick={clearEntry}>CE</button>
          <button className="btn scientific" onClick={toggleAngleMode}>DEG/RAD</button>
          
          {/* Row 2: Trigonometric functions */}
          <button className="btn scientific" onClick={() => applyFunction('sin')}>sin</button>
          <button className="btn scientific" onClick={() => applyFunction('cos')}>cos</button>
          <button className="btn scientific" onClick={() => applyFunction('tan')}>tan</button>
          
          {/* Row 3: Inverse trigonometric functions */}
          <button className="btn scientific" onClick={() => applyFunction('arcsin')}>sin⁻¹</button>
          <button className="btn scientific" onClick={() => applyFunction('arccos')}>cos⁻¹</button>
          <button className="btn scientific" onClick={() => applyFunction('arctan')}>tan⁻¹</button>
          
          {/* Row 4: Logarithmic functions */}
          <button className="btn scientific" onClick={() => applyFunction('log')}>log</button>
          <button className="btn scientific" onClick={() => applyFunction('ln')}>ln</button>
          <button className="btn scientific" onClick={() => applyFunction('exp')}>eˣ</button>
          
          {/* Row 5: Power of 10 and roots */}
          <button className="btn scientific" onClick={() => applyFunction('10x')}>10ˣ</button>
          <button className="btn scientific" onClick={() => applyFunction('sqrt')}>√</button>
          <button className="btn scientific" onClick={() => applyFunction('cbrt')}>∛</button>
          
          {/* Row 6: Power functions */}
          <button className="btn scientific" onClick={() => applyFunction('square')}>x²</button>
          <button className="btn scientific" onClick={() => applyFunction('cube')}>x³</button>
          <button className="btn operator" onClick={() => appendOperator('^')}>x^y</button>
          
          {/* Row 7: Constants and special functions */}
          <button className="btn scientific" onClick={() => insertConstant('π')}>π</button>
          <button className="btn scientific" onClick={() => insertConstant('e')}>e</button>
          <button className="btn scientific" onClick={() => applyFunction('factorial')}>n!</button>
          
          {/* Row 8: Utility functions */}
          <button className="btn scientific" onClick={() => applyFunction('percent')}>%</button>
          <button className="btn scientific" onClick={() => applyFunction('inverse')}>1/x</button>
          
          {/* Row 9: Memory functions */}
          <button className="btn memory" onClick={memoryAdd}>M+</button>
          <button className="btn memory" onClick={memorySubtract}>M−</button>
          <button className="btn memory" onClick={memoryRecall}>MR</button>
          <button className="btn memory" onClick={memoryClear}>MC</button>
        </div>
        
        {/* Center: Number pad */}
        <div className="number-pad">
          {/* Row 1: 7, 8, 9 */}
          <button className="btn number" onClick={() => appendNumber('7')}>7</button>
          <button className="btn number" onClick={() => appendNumber('8')}>8</button>
          <button className="btn number" onClick={() => appendNumber('9')}>9</button>
          
          {/* Row 2: 4, 5, 6 */}
          <button className="btn number" onClick={() => appendNumber('4')}>4</button>
          <button className="btn number" onClick={() => appendNumber('5')}>5</button>
          <button className="btn number" onClick={() => appendNumber('6')}>6</button>
          
          {/* Row 3: 1, 2, 3 */}
          <button className="btn number" onClick={() => appendNumber('1')}>1</button>
          <button className="btn number" onClick={() => appendNumber('2')}>2</button>
          <button className="btn number" onClick={() => appendNumber('3')}>3</button>
          
          {/* Row 4: 0 and decimal */}
          <button className="btn number zero" onClick={() => appendNumber('0')}>0</button>
          <button className="btn number" onClick={appendDecimal}>.</button>
        </div>
        
        {/* Right column: Basic operators */}
        <div className="operators">
          <button className="btn operator" onClick={() => appendOperator('÷')}>÷</button>
          <button className="btn operator" onClick={() => appendOperator('×')}>×</button>
          <button className="btn operator" onClick={() => appendOperator('−')}>−</button>
          <button className="btn operator" onClick={() => appendOperator('+')}>+</button>
          <button className="btn equals" onClick={calculate}>=</button>
        </div>
      </div>
    </div>
  )
}

export default App
