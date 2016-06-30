(function calculate() {

    /*=========================================================
    declare number display
    ========================================================*/

    const display             = document.getElementById("display");
    let   displayedNumber     = 0;
    let   operatorLastPressed = false;

    function updateDisplay() {
        display.innerHTML = displayedNumber;
    }

    updateDisplay();

    /*=========================================================
    declare number click event function
    ========================================================*/

    function clickHandlerNumbers() {
    
        let re = /\./g;

        operatorLastPressed = false;
        //console.log('clickHandlerNumbers fired! operatorLastPressed should be false: ', operatorLastPressed);

        // if the currently displayed number is zero, and not a dot, 
        // replace the 0 with the currently pressed number
        if (displayedNumber == 0 && !re.test(displayedNumber)) {
            displayedNumber = this.id;
            updateDisplay();
            return;
        }

        displayedNumber = displayedNumber + this.id;
        updateDisplay();

    }

  /*=========================================================
    declare number buttons and handle click events
    ========================================================*/
    const zero  = document.getElementById("0"),
        one     = document.getElementById("1"),
        two     = document.getElementById("2"),
        three   = document.getElementById("3"),
        four    = document.getElementById("4"),
        five    = document.getElementById("5"),
        six     = document.getElementById("6"),
        seven   = document.getElementById("7"),
        eight   = document.getElementById("8"),
        nine    = document.getElementById("9"),
        dot     = document.getElementById("dot");

    zero.onclick  = clickHandlerNumbers;
    one.onclick   = clickHandlerNumbers;
    two.onclick   = clickHandlerNumbers;
    three.onclick = clickHandlerNumbers;
    four.onclick  = clickHandlerNumbers;
    five.onclick  = clickHandlerNumbers;
    six.onclick   = clickHandlerNumbers;  
    seven.onclick = clickHandlerNumbers;
    eight.onclick = clickHandlerNumbers;
    nine.onclick  = clickHandlerNumbers;

    dot.onclick = function () {   
        let isIntBool = isInt(displayedNumber);

        if (displayedNumber === 0) {
            displayedNumber = '.';
            updateDisplay();
            return;    
        } 

        if (isIntBool) {
            displayedNumber = displayedNumber.toString();
            displayedNumber += ".";
            updateDisplay();  
            return;
        }
        
        return;
    };

    /*=========================================================
      declare operator button logic
    ========================================================*/

    let numbersActiveDivide = [],
        numbersActiveTimes  = [],
        numbersActiveMinus  = [],
        numbersActivePlus   = [];
  
    // If another operator button is pressed immediately after
    // the equal button is pressed, mathOperation() should not 
    // fire in the operator button's function
    let equalLastPressed = false;

    function clearNumbersActive() {
        numbersActiveDivide = [];
        numbersActiveTimes  = [];
        numbersActiveMinus  = [];
        numbersActivePlus   = [];
    }

    // A function to determine if a number is an integer or not.
    // If so, return true.
    function isInt(n) {
        return n % 1 === 0;
    }

    const clear = document.getElementById("clear"),
        divide  = document.getElementById("divide"),
        times   = document.getElementById("times"),
        minus   = document.getElementById("minus"),
        plus    = document.getElementById("plus"),
        equal   = document.getElementById("equal");

    // eqaul state variables    
    let toCalculate = [];
    let previousOperator = null;
    let previousNumber = null;
    let currentNumber = null;

    function operatorClickHandler(localActiveNumberArray, operator) {

        /* if a number was just pressed, 
        ==================================================================== */

        if (!equalLastPressed && !operatorLastPressed) {

            // checks for active numbers *previously* pressed. If one is found,
            // the active number and the *currently* pressed number are calculated
            // then, the previously active number array is cleared.
            let calculated = activeNumbersCheck(displayedNumber);

            if (calculated) {
                localActiveNumberArray = [];
            }

            if (typeof displayedNumber !== 'number') {
                displayedNumber = +displayedNumber;
            }

            // pushs the current number, or currently calculated number to a local
            // active array based on the operator which was just clicked.
            localActiveNumberArray.push(displayedNumber);

            if (operator !== 'equal') {
                previousOperator = operator;
                // parent active array is updated to match local array
                updateActiveArray(localActiveNumberArray, operator);
            } else {
                
                if (calculated) {
                    updateActiveArray(localActiveNumberArray, previousOperator);
                }

            }     
        }


        /* if equal was last pressed, and equal is pressed again,
        *  operate on the the last-pressed number vs displayed number.
        *  Then update displayed number.
        ==================================================================== */

        if (equalLastPressed && operator === 'equal') {
            // debugger;
            toCalculate = [currentNumber, previousNumber];
            calculate(toCalculate, previousOperator);
            currentNumber = displayedNumber;
        } 

        /* if equal was last pressed, and another operator is pressed,
           put the displayed number in the new operator's active array 
        ==================================================================== */

        if (equalLastPressed && operator !== 'equal') {
            //debugger;
            
            toCalculate = [];
            clearNumbersActive();
            localActiveNumberArray = [];

            localActiveNumberArray.push(currentNumber);
            previousOperator = operator;
            updateActiveArray(localActiveNumberArray, operator);

        }

        currentNumber = displayedNumber;
        displayedNumber = 0;
        operatorLastPressed = true;

        if (operator === "equal") {
            equalLastPressed = true;
        } else {
            equalLastPressed = false;
        }
    }

    function updateActiveArray (localArray, operator) {

        if (operator === 'divide') {
            numbersActiveDivide = localArray;
        }

        if (operator === 'times') {
            numbersActiveTimes = localArray;
        }

        if (operator === 'minus') {
            numbersActiveMinus = localArray;
        }

        if (operator === 'plus') {
            numbersActivePlus = localArray;
        }

    }

    clear.onclick = function () {
        operatorLastPressed = true;
        clearNumbersActive();
        if (displayedNumber !== 0) {
            displayedNumber = 0;
            updateDisplay();
            return;
        }
        updateDisplay();
        return;
    };

    divide.onclick = function () {
        operatorClickHandler(numbersActiveDivide, 'divide');        
    };

    times.onclick = function () {
        operatorClickHandler(numbersActiveTimes, 'times');
    };

    minus.onclick = function () {
        operatorClickHandler(numbersActiveMinus, 'minus');
    }; 

    plus.onclick = function () {
        operatorClickHandler(numbersActivePlus, 'plus');
    };

    equal.onclick = function() {
        operatorClickHandler(null, 'equal');
    };
  
    /*=========================================================
      A function that executes the arithmetic.
    ========================================================*/

    function activeNumbersCheck(displayedNumber) {
        //debugger;
        // if any activeNumbers are found in index 0, calculation takes place

        if (typeof displayedNumber !== 'number') {
            displayedNumber = +displayedNumber;
        }

        if (numbersActiveDivide[0]) { 
            numbersActiveDivide.push(displayedNumber);
            previousNumber = numbersActiveDivide[1];
            calculate(numbersActiveDivide, 'divide');
            clearNumbersActive();
            return true;
        } 
    
        if (numbersActiveTimes[0]) {
            numbersActiveTimes.push(displayedNumber);
            previousNumber = numbersActiveTimes[1];
            calculate(numbersActiveTimes, 'times');
            clearNumbersActive();
            return true;   
        }
        
        if (numbersActiveMinus[0]) {
            numbersActiveMinus.push(displayedNumber);
            previousNumber = numbersActiveMinus[1];
            calculate(numbersActiveMinus, 'minus');
            clearNumbersActive();
            return true;
        }
        
        if (numbersActivePlus[0]) { 
            numbersActivePlus.push(displayedNumber);
            previousNumber = numbersActivePlus[1];
            calculate(numbersActivePlus, 'plus');
            clearNumbersActive(); 
            return true;
        }

        return false;
    }    

    function calculate(activeNums, operator) {

        activeNums = activeNums.map(function (num) {
            if (typeof num !== 'number') {
                num = +num;
            }

            return num;
        });

        if (operator === 'divide') {
            displayedNumber = activeNums[0] / activeNums[1];
        }

        if (operator === 'times') {
            displayedNumber = activeNums[0] * activeNums[1];
        }

        if (operator === 'minus') {
            displayedNumber = activeNums[0] - activeNums[1];
        }

        if (operator === 'plus') {
            displayedNumber = activeNums[0] + activeNums[1];
        }

        updateDisplay();

        return;

    }        
  
})();
