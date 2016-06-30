"use strict";

(function calculate() {

    /*=========================================================
    declare number display
    ========================================================*/

    var display = document.getElementById("display");
    var displayedNumber = 0;
    var operatorLastPressed = false;

    function updateDisplay() {
        display.innerHTML = displayedNumber;
    }

    updateDisplay();

    /*=========================================================
    declare number click event function
    ========================================================*/

    function clickHandlerNumbers() {

        var re = /\./g;

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
    var zero = document.getElementById("0"),
        one = document.getElementById("1"),
        two = document.getElementById("2"),
        three = document.getElementById("3"),
        four = document.getElementById("4"),
        five = document.getElementById("5"),
        six = document.getElementById("6"),
        seven = document.getElementById("7"),
        eight = document.getElementById("8"),
        nine = document.getElementById("9"),
        dot = document.getElementById("dot");

    zero.onclick = clickHandlerNumbers;
    one.onclick = clickHandlerNumbers;
    two.onclick = clickHandlerNumbers;
    three.onclick = clickHandlerNumbers;
    four.onclick = clickHandlerNumbers;
    five.onclick = clickHandlerNumbers;
    six.onclick = clickHandlerNumbers;
    seven.onclick = clickHandlerNumbers;
    eight.onclick = clickHandlerNumbers;
    nine.onclick = clickHandlerNumbers;

    dot.onclick = function () {
        var isIntBool = isInt(displayedNumber);

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

    var numbersActiveDivide = [],
        numbersActiveTimes = [],
        numbersActiveMinus = [],
        numbersActivePlus = [];

    // If another operator button is pressed immediately after
    // the equal button is pressed, mathOperation() should not
    // fire in the operator button's function
    var equalLastPressed = false;

    function clearNumbersActive() {
        numbersActiveDivide = [];
        numbersActiveTimes = [];
        numbersActiveMinus = [];
        numbersActivePlus = [];
    }

    // A function to determine if a number is an integer or not.
    // If so, return true.
    function isInt(n) {
        return n % 1 === 0;
    }

    var clear = document.getElementById("clear"),
        divide = document.getElementById("divide"),
        times = document.getElementById("times"),
        minus = document.getElementById("minus"),
        plus = document.getElementById("plus"),
        equal = document.getElementById("equal");

    // eqaul state variables   
    var toCalculate = [];
    var previousOperator = null;
    var previousNumber = null;
    var currentNumber = null;

    function operatorClickHandler(localActiveNumberArray, operator) {

        /* if a number was just pressed, 
        ==================================================================== */

        if (!equalLastPressed && !operatorLastPressed) {

            // checks for active numbers *previously* pressed. If one is found,
            // the active number and the *currently* pressed number are calculated
            // then, the previously active number array is cleared.
            var calculated = activeNumbersCheck(displayedNumber);

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

    function updateActiveArray(localArray, operator) {

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

    equal.onclick = function () {
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
            //console.log('calculated! :', displayedNumber);
        }

        updateDisplay();

        return;
    }
})();
//# sourceMappingURL=data:application/json;base64,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QUFQO0FBQ0g7O0FBRUQsbUJBQU8sR0FBUDtBQUNILFNBTlksQ0FBYjs7QUFRQSxZQUFJLGFBQWEsUUFBakIsRUFBMkI7QUFDdkIsOEJBQWtCLFdBQVcsQ0FBWCxJQUFnQixXQUFXLENBQVgsQ0FBbEM7QUFDSDs7QUFFRCxZQUFJLGFBQWEsT0FBakIsRUFBMEI7QUFDdEIsOEJBQWtCLFdBQVcsQ0FBWCxJQUFnQixXQUFXLENBQVgsQ0FBbEM7QUFDSDs7QUFFRCxZQUFJLGFBQWEsT0FBakIsRUFBMEI7QUFDdEIsOEJBQWtCLFdBQVcsQ0FBWCxJQUFnQixXQUFXLENBQVgsQ0FBbEM7QUFDSDs7QUFFRCxZQUFJLGFBQWEsTUFBakIsRUFBeUI7QUFDckIsOEJBQWtCLFdBQVcsQ0FBWCxJQUFnQixXQUFXLENBQVgsQ0FBbEM7O0FBRUg7O0FBRUQ7O0FBRUE7QUFFSDtBQUVKLENBL1VEIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBjYWxjdWxhdGUoKSB7XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGRlY2xhcmUgbnVtYmVyIGRpc3BsYXlcbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbiAgICBjb25zdCBkaXNwbGF5ICAgICAgICAgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaXNwbGF5XCIpO1xuICAgIGxldCAgIGRpc3BsYXllZE51bWJlciAgICAgPSAwO1xuICAgIGxldCAgIG9wZXJhdG9yTGFzdFByZXNzZWQgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIGRpc3BsYXkuaW5uZXJIVE1MID0gZGlzcGxheWVkTnVtYmVyO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKTtcblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgZGVjbGFyZSBudW1iZXIgY2xpY2sgZXZlbnQgZnVuY3Rpb25cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbiAgICBmdW5jdGlvbiBjbGlja0hhbmRsZXJOdW1iZXJzKCkge1xuICAgIFxuICAgICAgICBsZXQgcmUgPSAvXFwuL2c7XG5cbiAgICAgICAgb3BlcmF0b3JMYXN0UHJlc3NlZCA9IGZhbHNlO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdjbGlja0hhbmRsZXJOdW1iZXJzIGZpcmVkISBvcGVyYXRvckxhc3RQcmVzc2VkIHNob3VsZCBiZSBmYWxzZTogJywgb3BlcmF0b3JMYXN0UHJlc3NlZCk7XG5cbiAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnRseSBkaXNwbGF5ZWQgbnVtYmVyIGlzIHplcm8sIGFuZCBub3QgYSBkb3QsIFxuICAgICAgICAvLyByZXBsYWNlIHRoZSAwIHdpdGggdGhlIGN1cnJlbnRseSBwcmVzc2VkIG51bWJlclxuICAgICAgICBpZiAoZGlzcGxheWVkTnVtYmVyID09IDAgJiYgIXJlLnRlc3QoZGlzcGxheWVkTnVtYmVyKSkge1xuICAgICAgICAgICAgZGlzcGxheWVkTnVtYmVyID0gdGhpcy5pZDtcbiAgICAgICAgICAgIHVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRpc3BsYXllZE51bWJlciA9IGRpc3BsYXllZE51bWJlciArIHRoaXMuaWQ7XG4gICAgICAgIHVwZGF0ZURpc3BsYXkoKTtcblxuICAgIH1cblxuICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGRlY2xhcmUgbnVtYmVyIGJ1dHRvbnMgYW5kIGhhbmRsZSBjbGljayBldmVudHNcbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgY29uc3QgemVybyAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjBcIiksXG4gICAgICAgIG9uZSAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjFcIiksXG4gICAgICAgIHR3byAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjJcIiksXG4gICAgICAgIHRocmVlICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjNcIiksXG4gICAgICAgIGZvdXIgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjRcIiksXG4gICAgICAgIGZpdmUgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjVcIiksXG4gICAgICAgIHNpeCAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjZcIiksXG4gICAgICAgIHNldmVuICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjdcIiksXG4gICAgICAgIGVpZ2h0ICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjhcIiksXG4gICAgICAgIG5pbmUgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjlcIiksXG4gICAgICAgIGRvdCAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvdFwiKTtcblxuICAgIHplcm8ub25jbGljayAgPSBjbGlja0hhbmRsZXJOdW1iZXJzO1xuICAgIG9uZS5vbmNsaWNrICAgPSBjbGlja0hhbmRsZXJOdW1iZXJzO1xuICAgIHR3by5vbmNsaWNrICAgPSBjbGlja0hhbmRsZXJOdW1iZXJzO1xuICAgIHRocmVlLm9uY2xpY2sgPSBjbGlja0hhbmRsZXJOdW1iZXJzO1xuICAgIGZvdXIub25jbGljayAgPSBjbGlja0hhbmRsZXJOdW1iZXJzO1xuICAgIGZpdmUub25jbGljayAgPSBjbGlja0hhbmRsZXJOdW1iZXJzO1xuICAgIHNpeC5vbmNsaWNrICAgPSBjbGlja0hhbmRsZXJOdW1iZXJzOyAgXG4gICAgc2V2ZW4ub25jbGljayA9IGNsaWNrSGFuZGxlck51bWJlcnM7XG4gICAgZWlnaHQub25jbGljayA9IGNsaWNrSGFuZGxlck51bWJlcnM7XG4gICAgbmluZS5vbmNsaWNrICA9IGNsaWNrSGFuZGxlck51bWJlcnM7XG5cbiAgICBkb3Qub25jbGljayA9IGZ1bmN0aW9uICgpIHsgICBcbiAgICAgICAgbGV0IGlzSW50Qm9vbCA9IGlzSW50KGRpc3BsYXllZE51bWJlcik7XG5cbiAgICAgICAgaWYgKGRpc3BsYXllZE51bWJlciA9PT0gMCkge1xuICAgICAgICAgICAgZGlzcGxheWVkTnVtYmVyID0gJy4nO1xuICAgICAgICAgICAgdXBkYXRlRGlzcGxheSgpO1xuICAgICAgICAgICAgcmV0dXJuOyAgICBcbiAgICAgICAgfSBcblxuICAgICAgICBpZiAoaXNJbnRCb29sKSB7XG4gICAgICAgICAgICBkaXNwbGF5ZWROdW1iZXIgPSBkaXNwbGF5ZWROdW1iZXIudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGRpc3BsYXllZE51bWJlciArPSBcIi5cIjtcbiAgICAgICAgICAgIHVwZGF0ZURpc3BsYXkoKTsgIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm47XG4gICAgfTtcblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICBkZWNsYXJlIG9wZXJhdG9yIGJ1dHRvbiBsb2dpY1xuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuICAgIGxldCBudW1iZXJzQWN0aXZlRGl2aWRlID0gW10sXG4gICAgICAgIG51bWJlcnNBY3RpdmVUaW1lcyAgPSBbXSxcbiAgICAgICAgbnVtYmVyc0FjdGl2ZU1pbnVzICA9IFtdLFxuICAgICAgICBudW1iZXJzQWN0aXZlUGx1cyAgID0gW107XG4gIFxuICAgIC8vIElmIGFub3RoZXIgb3BlcmF0b3IgYnV0dG9uIGlzIHByZXNzZWQgaW1tZWRpYXRlbHkgYWZ0ZXJcbiAgICAvLyB0aGUgZXF1YWwgYnV0dG9uIGlzIHByZXNzZWQsIG1hdGhPcGVyYXRpb24oKSBzaG91bGQgbm90IFxuICAgIC8vIGZpcmUgaW4gdGhlIG9wZXJhdG9yIGJ1dHRvbidzIGZ1bmN0aW9uXG4gICAgbGV0IGVxdWFsTGFzdFByZXNzZWQgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIGNsZWFyTnVtYmVyc0FjdGl2ZSgpIHtcbiAgICAgICAgbnVtYmVyc0FjdGl2ZURpdmlkZSA9IFtdO1xuICAgICAgICBudW1iZXJzQWN0aXZlVGltZXMgID0gW107XG4gICAgICAgIG51bWJlcnNBY3RpdmVNaW51cyAgPSBbXTtcbiAgICAgICAgbnVtYmVyc0FjdGl2ZVBsdXMgICA9IFtdO1xuICAgIH1cblxuICAgIC8vIEEgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGlmIGEgbnVtYmVyIGlzIGFuIGludGVnZXIgb3Igbm90LlxuICAgIC8vIElmIHNvLCByZXR1cm4gdHJ1ZS5cbiAgICBmdW5jdGlvbiBpc0ludChuKSB7XG4gICAgICAgIHJldHVybiBuICUgMSA9PT0gMDtcbiAgICB9XG5cbiAgICBjb25zdCBjbGVhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xlYXJcIiksXG4gICAgICAgIGRpdmlkZSAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRpdmlkZVwiKSxcbiAgICAgICAgdGltZXMgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGltZXNcIiksXG4gICAgICAgIG1pbnVzICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1pbnVzXCIpLFxuICAgICAgICBwbHVzICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbHVzXCIpLFxuICAgICAgICBlcXVhbCAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcXVhbFwiKTtcblxuICAgIC8vIGVxYXVsIHN0YXRlIHZhcmlhYmxlcyAgICBcbiAgICBsZXQgdG9DYWxjdWxhdGUgPSBbXTtcbiAgICBsZXQgcHJldmlvdXNPcGVyYXRvciA9IG51bGw7XG4gICAgbGV0IHByZXZpb3VzTnVtYmVyID0gbnVsbDtcbiAgICBsZXQgY3VycmVudE51bWJlciA9IG51bGw7XG5cbiAgICBmdW5jdGlvbiBvcGVyYXRvckNsaWNrSGFuZGxlcihsb2NhbEFjdGl2ZU51bWJlckFycmF5LCBvcGVyYXRvcikge1xuXG4gICAgICAgIC8qIGlmIGEgbnVtYmVyIHdhcyBqdXN0IHByZXNzZWQsIFxuICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gICAgICAgIGlmICghZXF1YWxMYXN0UHJlc3NlZCAmJiAhb3BlcmF0b3JMYXN0UHJlc3NlZCkge1xuXG4gICAgICAgICAgICAvLyBjaGVja3MgZm9yIGFjdGl2ZSBudW1iZXJzICpwcmV2aW91c2x5KiBwcmVzc2VkLiBJZiBvbmUgaXMgZm91bmQsXG4gICAgICAgICAgICAvLyB0aGUgYWN0aXZlIG51bWJlciBhbmQgdGhlICpjdXJyZW50bHkqIHByZXNzZWQgbnVtYmVyIGFyZSBjYWxjdWxhdGVkXG4gICAgICAgICAgICAvLyB0aGVuLCB0aGUgcHJldmlvdXNseSBhY3RpdmUgbnVtYmVyIGFycmF5IGlzIGNsZWFyZWQuXG4gICAgICAgICAgICBsZXQgY2FsY3VsYXRlZCA9IGFjdGl2ZU51bWJlcnNDaGVjayhkaXNwbGF5ZWROdW1iZXIpO1xuXG4gICAgICAgICAgICBpZiAoY2FsY3VsYXRlZCkge1xuICAgICAgICAgICAgICAgIGxvY2FsQWN0aXZlTnVtYmVyQXJyYXkgPSBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkaXNwbGF5ZWROdW1iZXIgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheWVkTnVtYmVyID0gK2Rpc3BsYXllZE51bWJlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcHVzaHMgdGhlIGN1cnJlbnQgbnVtYmVyLCBvciBjdXJyZW50bHkgY2FsY3VsYXRlZCBudW1iZXIgdG8gYSBsb2NhbFxuICAgICAgICAgICAgLy8gYWN0aXZlIGFycmF5IGJhc2VkIG9uIHRoZSBvcGVyYXRvciB3aGljaCB3YXMganVzdCBjbGlja2VkLlxuICAgICAgICAgICAgbG9jYWxBY3RpdmVOdW1iZXJBcnJheS5wdXNoKGRpc3BsYXllZE51bWJlcik7XG5cbiAgICAgICAgICAgIGlmIChvcGVyYXRvciAhPT0gJ2VxdWFsJykge1xuICAgICAgICAgICAgICAgIHByZXZpb3VzT3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgICAgICAgICAvLyBwYXJlbnQgYWN0aXZlIGFycmF5IGlzIHVwZGF0ZWQgdG8gbWF0Y2ggbG9jYWwgYXJyYXlcbiAgICAgICAgICAgICAgICB1cGRhdGVBY3RpdmVBcnJheShsb2NhbEFjdGl2ZU51bWJlckFycmF5LCBvcGVyYXRvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChjYWxjdWxhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUFjdGl2ZUFycmF5KGxvY2FsQWN0aXZlTnVtYmVyQXJyYXksIHByZXZpb3VzT3BlcmF0b3IpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSAgICAgXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qIGlmIGVxdWFsIHdhcyBsYXN0IHByZXNzZWQsIGFuZCBlcXVhbCBpcyBwcmVzc2VkIGFnYWluLFxuICAgICAgICAqICBvcGVyYXRlIG9uIHRoZSB0aGUgbGFzdC1wcmVzc2VkIG51bWJlciB2cyBkaXNwbGF5ZWQgbnVtYmVyLlxuICAgICAgICAqICBUaGVuIHVwZGF0ZSBkaXNwbGF5ZWQgbnVtYmVyLlxuICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gICAgICAgIGlmIChlcXVhbExhc3RQcmVzc2VkICYmIG9wZXJhdG9yID09PSAnZXF1YWwnKSB7XG4gICAgICAgICAgICAvLyBkZWJ1Z2dlcjtcbiAgICAgICAgICAgIHRvQ2FsY3VsYXRlID0gW2N1cnJlbnROdW1iZXIsIHByZXZpb3VzTnVtYmVyXTtcbiAgICAgICAgICAgIGNhbGN1bGF0ZSh0b0NhbGN1bGF0ZSwgcHJldmlvdXNPcGVyYXRvcik7XG4gICAgICAgICAgICBjdXJyZW50TnVtYmVyID0gZGlzcGxheWVkTnVtYmVyO1xuICAgICAgICB9IFxuXG4gICAgICAgIC8qIGlmIGVxdWFsIHdhcyBsYXN0IHByZXNzZWQsIGFuZCBhbm90aGVyIG9wZXJhdG9yIGlzIHByZXNzZWQsXG4gICAgICAgICAgIHB1dCB0aGUgZGlzcGxheWVkIG51bWJlciBpbiB0aGUgbmV3IG9wZXJhdG9yJ3MgYWN0aXZlIGFycmF5IFxuICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gICAgICAgIGlmIChlcXVhbExhc3RQcmVzc2VkICYmIG9wZXJhdG9yICE9PSAnZXF1YWwnKSB7XG4gICAgICAgICAgICAvL2RlYnVnZ2VyO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0b0NhbGN1bGF0ZSA9IFtdO1xuICAgICAgICAgICAgY2xlYXJOdW1iZXJzQWN0aXZlKCk7XG4gICAgICAgICAgICBsb2NhbEFjdGl2ZU51bWJlckFycmF5ID0gW107XG5cbiAgICAgICAgICAgIGxvY2FsQWN0aXZlTnVtYmVyQXJyYXkucHVzaChjdXJyZW50TnVtYmVyKTtcbiAgICAgICAgICAgIHByZXZpb3VzT3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgICAgIHVwZGF0ZUFjdGl2ZUFycmF5KGxvY2FsQWN0aXZlTnVtYmVyQXJyYXksIG9wZXJhdG9yKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudE51bWJlciA9IGRpc3BsYXllZE51bWJlcjtcbiAgICAgICAgZGlzcGxheWVkTnVtYmVyID0gMDtcbiAgICAgICAgb3BlcmF0b3JMYXN0UHJlc3NlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKG9wZXJhdG9yID09PSBcImVxdWFsXCIpIHtcbiAgICAgICAgICAgIGVxdWFsTGFzdFByZXNzZWQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXF1YWxMYXN0UHJlc3NlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQWN0aXZlQXJyYXkgKGxvY2FsQXJyYXksIG9wZXJhdG9yKSB7XG5cbiAgICAgICAgaWYgKG9wZXJhdG9yID09PSAnZGl2aWRlJykge1xuICAgICAgICAgICAgbnVtYmVyc0FjdGl2ZURpdmlkZSA9IGxvY2FsQXJyYXk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3BlcmF0b3IgPT09ICd0aW1lcycpIHtcbiAgICAgICAgICAgIG51bWJlcnNBY3RpdmVUaW1lcyA9IGxvY2FsQXJyYXk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3BlcmF0b3IgPT09ICdtaW51cycpIHtcbiAgICAgICAgICAgIG51bWJlcnNBY3RpdmVNaW51cyA9IGxvY2FsQXJyYXk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3BlcmF0b3IgPT09ICdwbHVzJykge1xuICAgICAgICAgICAgbnVtYmVyc0FjdGl2ZVBsdXMgPSBsb2NhbEFycmF5O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjbGVhci5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBvcGVyYXRvckxhc3RQcmVzc2VkID0gdHJ1ZTtcbiAgICAgICAgY2xlYXJOdW1iZXJzQWN0aXZlKCk7XG4gICAgICAgIGlmIChkaXNwbGF5ZWROdW1iZXIgIT09IDApIHtcbiAgICAgICAgICAgIGRpc3BsYXllZE51bWJlciA9IDA7XG4gICAgICAgICAgICB1cGRhdGVEaXNwbGF5KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdXBkYXRlRGlzcGxheSgpO1xuICAgICAgICByZXR1cm47XG4gICAgfTtcblxuICAgIGRpdmlkZS5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBvcGVyYXRvckNsaWNrSGFuZGxlcihudW1iZXJzQWN0aXZlRGl2aWRlLCAnZGl2aWRlJyk7ICAgICAgICBcbiAgICB9O1xuXG4gICAgdGltZXMub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb3BlcmF0b3JDbGlja0hhbmRsZXIobnVtYmVyc0FjdGl2ZVRpbWVzLCAndGltZXMnKTtcbiAgICB9O1xuXG4gICAgbWludXMub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb3BlcmF0b3JDbGlja0hhbmRsZXIobnVtYmVyc0FjdGl2ZU1pbnVzLCAnbWludXMnKTtcbiAgICB9OyBcblxuICAgIHBsdXMub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb3BlcmF0b3JDbGlja0hhbmRsZXIobnVtYmVyc0FjdGl2ZVBsdXMsICdwbHVzJyk7XG4gICAgfTtcblxuICAgIGVxdWFsLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgb3BlcmF0b3JDbGlja0hhbmRsZXIobnVsbCwgJ2VxdWFsJyk7XG4gICAgfTtcbiAgXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgIEEgZnVuY3Rpb24gdGhhdCBleGVjdXRlcyB0aGUgYXJpdGhtZXRpYy5cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbiAgICBmdW5jdGlvbiBhY3RpdmVOdW1iZXJzQ2hlY2soZGlzcGxheWVkTnVtYmVyKSB7XG4gICAgICAgIC8vZGVidWdnZXI7XG4gICAgICAgIC8vIGlmIGFueSBhY3RpdmVOdW1iZXJzIGFyZSBmb3VuZCBpbiBpbmRleCAwLCBjYWxjdWxhdGlvbiB0YWtlcyBwbGFjZVxuXG4gICAgICAgIGlmICh0eXBlb2YgZGlzcGxheWVkTnVtYmVyICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZGlzcGxheWVkTnVtYmVyID0gK2Rpc3BsYXllZE51bWJlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChudW1iZXJzQWN0aXZlRGl2aWRlWzBdKSB7IFxuICAgICAgICAgICAgbnVtYmVyc0FjdGl2ZURpdmlkZS5wdXNoKGRpc3BsYXllZE51bWJlcik7XG4gICAgICAgICAgICBwcmV2aW91c051bWJlciA9IG51bWJlcnNBY3RpdmVEaXZpZGVbMV07XG4gICAgICAgICAgICBjYWxjdWxhdGUobnVtYmVyc0FjdGl2ZURpdmlkZSwgJ2RpdmlkZScpO1xuICAgICAgICAgICAgY2xlYXJOdW1iZXJzQWN0aXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBcbiAgICBcbiAgICAgICAgaWYgKG51bWJlcnNBY3RpdmVUaW1lc1swXSkge1xuICAgICAgICAgICAgbnVtYmVyc0FjdGl2ZVRpbWVzLnB1c2goZGlzcGxheWVkTnVtYmVyKTtcbiAgICAgICAgICAgIHByZXZpb3VzTnVtYmVyID0gbnVtYmVyc0FjdGl2ZVRpbWVzWzFdO1xuICAgICAgICAgICAgY2FsY3VsYXRlKG51bWJlcnNBY3RpdmVUaW1lcywgJ3RpbWVzJyk7XG4gICAgICAgICAgICBjbGVhck51bWJlcnNBY3RpdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlOyAgIFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAobnVtYmVyc0FjdGl2ZU1pbnVzWzBdKSB7XG4gICAgICAgICAgICBudW1iZXJzQWN0aXZlTWludXMucHVzaChkaXNwbGF5ZWROdW1iZXIpO1xuICAgICAgICAgICAgcHJldmlvdXNOdW1iZXIgPSBudW1iZXJzQWN0aXZlTWludXNbMV07XG4gICAgICAgICAgICBjYWxjdWxhdGUobnVtYmVyc0FjdGl2ZU1pbnVzLCAnbWludXMnKTtcbiAgICAgICAgICAgIGNsZWFyTnVtYmVyc0FjdGl2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChudW1iZXJzQWN0aXZlUGx1c1swXSkgeyBcbiAgICAgICAgICAgIG51bWJlcnNBY3RpdmVQbHVzLnB1c2goZGlzcGxheWVkTnVtYmVyKTtcbiAgICAgICAgICAgIHByZXZpb3VzTnVtYmVyID0gbnVtYmVyc0FjdGl2ZVBsdXNbMV07XG4gICAgICAgICAgICBjYWxjdWxhdGUobnVtYmVyc0FjdGl2ZVBsdXMsICdwbHVzJyk7XG4gICAgICAgICAgICBjbGVhck51bWJlcnNBY3RpdmUoKTsgXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9ICAgIFxuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlKGFjdGl2ZU51bXMsIG9wZXJhdG9yKSB7XG5cbiAgICAgICAgYWN0aXZlTnVtcyA9IGFjdGl2ZU51bXMubWFwKGZ1bmN0aW9uIChudW0pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbnVtICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIG51bSA9ICtudW07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBudW07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChvcGVyYXRvciA9PT0gJ2RpdmlkZScpIHtcbiAgICAgICAgICAgIGRpc3BsYXllZE51bWJlciA9IGFjdGl2ZU51bXNbMF0gLyBhY3RpdmVOdW1zWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wZXJhdG9yID09PSAndGltZXMnKSB7XG4gICAgICAgICAgICBkaXNwbGF5ZWROdW1iZXIgPSBhY3RpdmVOdW1zWzBdICogYWN0aXZlTnVtc1sxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcGVyYXRvciA9PT0gJ21pbnVzJykge1xuICAgICAgICAgICAgZGlzcGxheWVkTnVtYmVyID0gYWN0aXZlTnVtc1swXSAtIGFjdGl2ZU51bXNbMV07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3BlcmF0b3IgPT09ICdwbHVzJykge1xuICAgICAgICAgICAgZGlzcGxheWVkTnVtYmVyID0gYWN0aXZlTnVtc1swXSArIGFjdGl2ZU51bXNbMV07XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdjYWxjdWxhdGVkISA6JywgZGlzcGxheWVkTnVtYmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZURpc3BsYXkoKTtcblxuICAgICAgICByZXR1cm47XG5cbiAgICB9ICAgICAgICBcbiAgXG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
