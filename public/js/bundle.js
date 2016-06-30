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
        equalLastPressed = false;
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
    var equalLastPressed = false;
    var toCalculate = [];
    var previousOperator = null;
    var previousNumber = null;
    var currentNumber = null;

    function clearAllState() {
        clearNumbersActive();
        toCalculate = [];
        previousOperator = null;
        previousNumber = null;
        currentNumber = null;
        operatorLastPressed = false;
        equalLastPressed = false;
        displayedNumber = 0;
    }

    function operatorClickHandler(localActiveNumberArray, operator) {
        //debugger;
        /* if a number was just pressed, 
        ==================================================================== */

        if (!equalLastPressed && !operatorLastPressed) {

            if (operator === 'equal') {
                localActiveNumberArray = [];
            }

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
            if (previousNumber !== null) {
                toCalculate = [currentNumber, previousNumber];
                calculate(toCalculate, previousOperator);
                currentNumber = displayedNumber;
            }
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
        // clearNumbersActive();

        // if (displayedNumber !== 0) {
        //     displayedNumber = 0;
        //     updateDisplay();
        //     return;
        // }

        clearAllState();
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
        }

        updateDisplay();

        return;
    }
})();
//# sourceMappingURL=data:application/json;base64,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LEVBQTZCLE1BQTdCO0FBQ0E7QUFDQSxtQkFBTyxJQUFQO0FBQ0g7O0FBRUQsZUFBTyxLQUFQO0FBQ0g7O0FBRUQsYUFBUyxTQUFULENBQW1CLFVBQW5CLEVBQStCLFFBQS9CLEVBQXlDOztBQUVyQyxxQkFBYSxXQUFXLEdBQVgsQ0FBZSxVQUFVLEdBQVYsRUFBZTtBQUN2QyxnQkFBSSxPQUFPLEdBQVAsS0FBZSxRQUFuQixFQUE2QjtBQUN6QixzQkFBTSxDQUFDLEdBQVA7QUFDSDs7QUFFRCxtQkFBTyxHQUFQO0FBQ0gsU0FOWSxDQUFiOztBQVFBLFlBQUksYUFBYSxRQUFqQixFQUEyQjtBQUN2Qiw4QkFBa0IsV0FBVyxDQUFYLElBQWdCLFdBQVcsQ0FBWCxDQUFsQztBQUNIOztBQUVELFlBQUksYUFBYSxPQUFqQixFQUEwQjtBQUN0Qiw4QkFBa0IsV0FBVyxDQUFYLElBQWdCLFdBQVcsQ0FBWCxDQUFsQztBQUNIOztBQUVELFlBQUksYUFBYSxPQUFqQixFQUEwQjtBQUN0Qiw4QkFBa0IsV0FBVyxDQUFYLElBQWdCLFdBQVcsQ0FBWCxDQUFsQztBQUNIOztBQUVELFlBQUksYUFBYSxNQUFqQixFQUF5QjtBQUNyQiw4QkFBa0IsV0FBVyxDQUFYLElBQWdCLFdBQVcsQ0FBWCxDQUFsQztBQUNIOztBQUVEOztBQUVBO0FBRUg7QUFFSixDQWxXRCIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gY2FsY3VsYXRlKCkge1xuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBkZWNsYXJlIG51bWJlciBkaXNwbGF5XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4gICAgY29uc3QgZGlzcGxheSAgICAgICAgICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlzcGxheVwiKTtcbiAgICBsZXQgICBkaXNwbGF5ZWROdW1iZXIgICAgID0gMDtcbiAgICBsZXQgICBvcGVyYXRvckxhc3RQcmVzc2VkID0gZmFsc2U7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICBkaXNwbGF5LmlubmVySFRNTCA9IGRpc3BsYXllZE51bWJlcjtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCk7XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGRlY2xhcmUgbnVtYmVyIGNsaWNrIGV2ZW50IGZ1bmN0aW9uXG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4gICAgZnVuY3Rpb24gY2xpY2tIYW5kbGVyTnVtYmVycygpIHtcbiAgICBcbiAgICAgICAgbGV0IHJlID0gL1xcLi9nO1xuXG4gICAgICAgIG9wZXJhdG9yTGFzdFByZXNzZWQgPSBmYWxzZTtcbiAgICAgICAgZXF1YWxMYXN0UHJlc3NlZCA9IGZhbHNlO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdjbGlja0hhbmRsZXJOdW1iZXJzIGZpcmVkISBvcGVyYXRvckxhc3RQcmVzc2VkIHNob3VsZCBiZSBmYWxzZTogJywgb3BlcmF0b3JMYXN0UHJlc3NlZCk7XG5cbiAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnRseSBkaXNwbGF5ZWQgbnVtYmVyIGlzIHplcm8sIGFuZCBub3QgYSBkb3QsIFxuICAgICAgICAvLyByZXBsYWNlIHRoZSAwIHdpdGggdGhlIGN1cnJlbnRseSBwcmVzc2VkIG51bWJlclxuICAgICAgICBpZiAoZGlzcGxheWVkTnVtYmVyID09IDAgJiYgIXJlLnRlc3QoZGlzcGxheWVkTnVtYmVyKSkge1xuICAgICAgICAgICAgZGlzcGxheWVkTnVtYmVyID0gdGhpcy5pZDtcbiAgICAgICAgICAgIHVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRpc3BsYXllZE51bWJlciA9IGRpc3BsYXllZE51bWJlciArIHRoaXMuaWQ7XG4gICAgICAgIHVwZGF0ZURpc3BsYXkoKTtcblxuICAgIH1cblxuICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGRlY2xhcmUgbnVtYmVyIGJ1dHRvbnMgYW5kIGhhbmRsZSBjbGljayBldmVudHNcbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgY29uc3QgemVybyAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjBcIiksXG4gICAgICAgIG9uZSAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjFcIiksXG4gICAgICAgIHR3byAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjJcIiksXG4gICAgICAgIHRocmVlICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjNcIiksXG4gICAgICAgIGZvdXIgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjRcIiksXG4gICAgICAgIGZpdmUgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjVcIiksXG4gICAgICAgIHNpeCAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjZcIiksXG4gICAgICAgIHNldmVuICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjdcIiksXG4gICAgICAgIGVpZ2h0ICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjhcIiksXG4gICAgICAgIG5pbmUgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIjlcIiksXG4gICAgICAgIGRvdCAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvdFwiKTtcblxuICAgIHplcm8ub25jbGljayAgPSBjbGlja0hhbmRsZXJOdW1iZXJzO1xuICAgIG9uZS5vbmNsaWNrICAgPSBjbGlja0hhbmRsZXJOdW1iZXJzO1xuICAgIHR3by5vbmNsaWNrICAgPSBjbGlja0hhbmRsZXJOdW1iZXJzO1xuICAgIHRocmVlLm9uY2xpY2sgPSBjbGlja0hhbmRsZXJOdW1iZXJzO1xuICAgIGZvdXIub25jbGljayAgPSBjbGlja0hhbmRsZXJOdW1iZXJzO1xuICAgIGZpdmUub25jbGljayAgPSBjbGlja0hhbmRsZXJOdW1iZXJzO1xuICAgIHNpeC5vbmNsaWNrICAgPSBjbGlja0hhbmRsZXJOdW1iZXJzOyAgXG4gICAgc2V2ZW4ub25jbGljayA9IGNsaWNrSGFuZGxlck51bWJlcnM7XG4gICAgZWlnaHQub25jbGljayA9IGNsaWNrSGFuZGxlck51bWJlcnM7XG4gICAgbmluZS5vbmNsaWNrICA9IGNsaWNrSGFuZGxlck51bWJlcnM7XG5cbiAgICBkb3Qub25jbGljayA9IGZ1bmN0aW9uICgpIHsgICBcbiAgICAgICAgbGV0IGlzSW50Qm9vbCA9IGlzSW50KGRpc3BsYXllZE51bWJlcik7XG5cbiAgICAgICAgaWYgKGRpc3BsYXllZE51bWJlciA9PT0gMCkge1xuICAgICAgICAgICAgZGlzcGxheWVkTnVtYmVyID0gJy4nO1xuICAgICAgICAgICAgdXBkYXRlRGlzcGxheSgpO1xuICAgICAgICAgICAgcmV0dXJuOyAgICBcbiAgICAgICAgfSBcblxuICAgICAgICBpZiAoaXNJbnRCb29sKSB7XG4gICAgICAgICAgICBkaXNwbGF5ZWROdW1iZXIgPSBkaXNwbGF5ZWROdW1iZXIudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGRpc3BsYXllZE51bWJlciArPSBcIi5cIjtcbiAgICAgICAgICAgIHVwZGF0ZURpc3BsYXkoKTsgIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm47XG4gICAgfTtcblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICBkZWNsYXJlIG9wZXJhdG9yIGJ1dHRvbiBsb2dpY1xuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuICAgIGxldCBudW1iZXJzQWN0aXZlRGl2aWRlID0gW10sXG4gICAgICAgIG51bWJlcnNBY3RpdmVUaW1lcyAgPSBbXSxcbiAgICAgICAgbnVtYmVyc0FjdGl2ZU1pbnVzICA9IFtdLFxuICAgICAgICBudW1iZXJzQWN0aXZlUGx1cyAgID0gW107XG5cbiAgICBmdW5jdGlvbiBjbGVhck51bWJlcnNBY3RpdmUoKSB7XG4gICAgICAgIG51bWJlcnNBY3RpdmVEaXZpZGUgPSBbXTtcbiAgICAgICAgbnVtYmVyc0FjdGl2ZVRpbWVzICA9IFtdO1xuICAgICAgICBudW1iZXJzQWN0aXZlTWludXMgID0gW107XG4gICAgICAgIG51bWJlcnNBY3RpdmVQbHVzICAgPSBbXTtcbiAgICB9XG5cbiAgICAvLyBBIGZ1bmN0aW9uIHRvIGRldGVybWluZSBpZiBhIG51bWJlciBpcyBhbiBpbnRlZ2VyIG9yIG5vdC5cbiAgICAvLyBJZiBzbywgcmV0dXJuIHRydWUuXG4gICAgZnVuY3Rpb24gaXNJbnQobikge1xuICAgICAgICByZXR1cm4gbiAlIDEgPT09IDA7XG4gICAgfVxuXG4gICAgY29uc3QgY2xlYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsZWFyXCIpLFxuICAgICAgICBkaXZpZGUgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaXZpZGVcIiksXG4gICAgICAgIHRpbWVzICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRpbWVzXCIpLFxuICAgICAgICBtaW51cyAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtaW51c1wiKSxcbiAgICAgICAgcGx1cyAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGx1c1wiKSxcbiAgICAgICAgZXF1YWwgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXF1YWxcIik7XG5cbiAgICAvLyBlcWF1bCBzdGF0ZSB2YXJpYWJsZXMgIFxuICAgIGxldCBlcXVhbExhc3RQcmVzc2VkID0gZmFsc2U7ICBcbiAgICBsZXQgdG9DYWxjdWxhdGUgPSBbXTtcbiAgICBsZXQgcHJldmlvdXNPcGVyYXRvciA9IG51bGw7XG4gICAgbGV0IHByZXZpb3VzTnVtYmVyID0gbnVsbDtcbiAgICBsZXQgY3VycmVudE51bWJlciA9IG51bGw7XG5cbiAgICBmdW5jdGlvbiBjbGVhckFsbFN0YXRlKCkge1xuICAgICAgICBjbGVhck51bWJlcnNBY3RpdmUoKTtcbiAgICAgICAgdG9DYWxjdWxhdGUgPSBbXTtcbiAgICAgICAgcHJldmlvdXNPcGVyYXRvciA9IG51bGw7XG4gICAgICAgIHByZXZpb3VzTnVtYmVyID0gbnVsbDtcbiAgICAgICAgY3VycmVudE51bWJlciA9IG51bGw7XG4gICAgICAgIG9wZXJhdG9yTGFzdFByZXNzZWQgPSBmYWxzZTtcbiAgICAgICAgZXF1YWxMYXN0UHJlc3NlZCA9IGZhbHNlO1xuICAgICAgICBkaXNwbGF5ZWROdW1iZXIgPSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9wZXJhdG9yQ2xpY2tIYW5kbGVyKGxvY2FsQWN0aXZlTnVtYmVyQXJyYXksIG9wZXJhdG9yKSB7XG4gICAgICAgIC8vZGVidWdnZXI7XG4gICAgICAgIC8qIGlmIGEgbnVtYmVyIHdhcyBqdXN0IHByZXNzZWQsIFxuICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gICAgICAgIGlmICghZXF1YWxMYXN0UHJlc3NlZCAmJiAhb3BlcmF0b3JMYXN0UHJlc3NlZCkge1xuXG4gICAgICAgICAgICBpZiAob3BlcmF0b3IgPT09ICdlcXVhbCcpIHtcbiAgICAgICAgICAgICAgICBsb2NhbEFjdGl2ZU51bWJlckFycmF5ID0gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNoZWNrcyBmb3IgYWN0aXZlIG51bWJlcnMgKnByZXZpb3VzbHkqIHByZXNzZWQuIElmIG9uZSBpcyBmb3VuZCxcbiAgICAgICAgICAgIC8vIHRoZSBhY3RpdmUgbnVtYmVyIGFuZCB0aGUgKmN1cnJlbnRseSogcHJlc3NlZCBudW1iZXIgYXJlIGNhbGN1bGF0ZWRcbiAgICAgICAgICAgIC8vIHRoZW4sIHRoZSBwcmV2aW91c2x5IGFjdGl2ZSBudW1iZXIgYXJyYXkgaXMgY2xlYXJlZC5cbiAgICAgICAgICAgIGxldCBjYWxjdWxhdGVkID0gYWN0aXZlTnVtYmVyc0NoZWNrKGRpc3BsYXllZE51bWJlcik7XG5cbiAgICAgICAgICAgIGlmIChjYWxjdWxhdGVkKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxBY3RpdmVOdW1iZXJBcnJheSA9IFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRpc3BsYXllZE51bWJlciAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5ZWROdW1iZXIgPSArZGlzcGxheWVkTnVtYmVyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBwdXNocyB0aGUgY3VycmVudCBudW1iZXIsIG9yIGN1cnJlbnRseSBjYWxjdWxhdGVkIG51bWJlciB0byBhIGxvY2FsXG4gICAgICAgICAgICAvLyBhY3RpdmUgYXJyYXkgYmFzZWQgb24gdGhlIG9wZXJhdG9yIHdoaWNoIHdhcyBqdXN0IGNsaWNrZWQuXG4gICAgICAgICAgICBsb2NhbEFjdGl2ZU51bWJlckFycmF5LnB1c2goZGlzcGxheWVkTnVtYmVyKTtcblxuICAgICAgICAgICAgaWYgKG9wZXJhdG9yICE9PSAnZXF1YWwnKSB7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNPcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICAgICAgICAgIC8vIHBhcmVudCBhY3RpdmUgYXJyYXkgaXMgdXBkYXRlZCB0byBtYXRjaCBsb2NhbCBhcnJheVxuICAgICAgICAgICAgICAgIHVwZGF0ZUFjdGl2ZUFycmF5KGxvY2FsQWN0aXZlTnVtYmVyQXJyYXksIG9wZXJhdG9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGNhbGN1bGF0ZWQpIHtcblxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBY3RpdmVBcnJheShsb2NhbEFjdGl2ZU51bWJlckFycmF5LCBwcmV2aW91c09wZXJhdG9yKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gICAgIFxuICAgICAgICB9XG5cblxuICAgICAgICAvKiBpZiBlcXVhbCB3YXMgbGFzdCBwcmVzc2VkLCBhbmQgZXF1YWwgaXMgcHJlc3NlZCBhZ2FpbixcbiAgICAgICAgKiAgb3BlcmF0ZSBvbiB0aGUgdGhlIGxhc3QtcHJlc3NlZCBudW1iZXIgdnMgZGlzcGxheWVkIG51bWJlci5cbiAgICAgICAgKiAgVGhlbiB1cGRhdGUgZGlzcGxheWVkIG51bWJlci5cbiAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuICAgICAgICBpZiAoZXF1YWxMYXN0UHJlc3NlZCAmJiBvcGVyYXRvciA9PT0gJ2VxdWFsJykge1xuICAgICAgICAgICAgLy8gZGVidWdnZXI7XG4gICAgICAgICAgICBpZiAocHJldmlvdXNOdW1iZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0b0NhbGN1bGF0ZSA9IFtjdXJyZW50TnVtYmVyLCBwcmV2aW91c051bWJlcl07XG4gICAgICAgICAgICAgICAgY2FsY3VsYXRlKHRvQ2FsY3VsYXRlLCBwcmV2aW91c09wZXJhdG9yKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50TnVtYmVyID0gZGlzcGxheWVkTnVtYmVyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBcbiAgICAgICAgfSBcblxuICAgICAgICAvKiBpZiBlcXVhbCB3YXMgbGFzdCBwcmVzc2VkLCBhbmQgYW5vdGhlciBvcGVyYXRvciBpcyBwcmVzc2VkLFxuICAgICAgICAgICBwdXQgdGhlIGRpc3BsYXllZCBudW1iZXIgaW4gdGhlIG5ldyBvcGVyYXRvcidzIGFjdGl2ZSBhcnJheSBcbiAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuICAgICAgICBpZiAoZXF1YWxMYXN0UHJlc3NlZCAmJiBvcGVyYXRvciAhPT0gJ2VxdWFsJykge1xuICAgICAgICAgICAgLy9kZWJ1Z2dlcjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdG9DYWxjdWxhdGUgPSBbXTtcbiAgICAgICAgICAgIGNsZWFyTnVtYmVyc0FjdGl2ZSgpO1xuICAgICAgICAgICAgbG9jYWxBY3RpdmVOdW1iZXJBcnJheSA9IFtdO1xuXG4gICAgICAgICAgICBsb2NhbEFjdGl2ZU51bWJlckFycmF5LnB1c2goY3VycmVudE51bWJlcik7XG4gICAgICAgICAgICBwcmV2aW91c09wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgICAgICB1cGRhdGVBY3RpdmVBcnJheShsb2NhbEFjdGl2ZU51bWJlckFycmF5LCBvcGVyYXRvcik7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnROdW1iZXIgPSBkaXNwbGF5ZWROdW1iZXI7XG4gICAgICAgIGRpc3BsYXllZE51bWJlciA9IDA7XG4gICAgICAgIG9wZXJhdG9yTGFzdFByZXNzZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChvcGVyYXRvciA9PT0gXCJlcXVhbFwiKSB7XG4gICAgICAgICAgICBlcXVhbExhc3RQcmVzc2VkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVxdWFsTGFzdFByZXNzZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUFjdGl2ZUFycmF5IChsb2NhbEFycmF5LCBvcGVyYXRvcikge1xuXG4gICAgICAgIGlmIChvcGVyYXRvciA9PT0gJ2RpdmlkZScpIHtcbiAgICAgICAgICAgIG51bWJlcnNBY3RpdmVEaXZpZGUgPSBsb2NhbEFycmF5O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wZXJhdG9yID09PSAndGltZXMnKSB7XG4gICAgICAgICAgICBudW1iZXJzQWN0aXZlVGltZXMgPSBsb2NhbEFycmF5O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wZXJhdG9yID09PSAnbWludXMnKSB7XG4gICAgICAgICAgICBudW1iZXJzQWN0aXZlTWludXMgPSBsb2NhbEFycmF5O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wZXJhdG9yID09PSAncGx1cycpIHtcbiAgICAgICAgICAgIG51bWJlcnNBY3RpdmVQbHVzID0gbG9jYWxBcnJheTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY2xlYXIub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb3BlcmF0b3JMYXN0UHJlc3NlZCA9IHRydWU7XG4gICAgICAgIC8vIGNsZWFyTnVtYmVyc0FjdGl2ZSgpO1xuXG4gICAgICAgIC8vIGlmIChkaXNwbGF5ZWROdW1iZXIgIT09IDApIHtcbiAgICAgICAgLy8gICAgIGRpc3BsYXllZE51bWJlciA9IDA7XG4gICAgICAgIC8vICAgICB1cGRhdGVEaXNwbGF5KCk7XG4gICAgICAgIC8vICAgICByZXR1cm47XG4gICAgICAgIC8vIH1cblxuICAgICAgICBjbGVhckFsbFN0YXRlKCk7XG4gICAgICAgIHVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH07XG5cbiAgICBkaXZpZGUub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb3BlcmF0b3JDbGlja0hhbmRsZXIobnVtYmVyc0FjdGl2ZURpdmlkZSwgJ2RpdmlkZScpOyAgICAgICAgXG4gICAgfTtcblxuICAgIHRpbWVzLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9wZXJhdG9yQ2xpY2tIYW5kbGVyKG51bWJlcnNBY3RpdmVUaW1lcywgJ3RpbWVzJyk7XG4gICAgfTtcblxuICAgIG1pbnVzLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9wZXJhdG9yQ2xpY2tIYW5kbGVyKG51bWJlcnNBY3RpdmVNaW51cywgJ21pbnVzJyk7XG4gICAgfTsgXG5cbiAgICBwbHVzLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9wZXJhdG9yQ2xpY2tIYW5kbGVyKG51bWJlcnNBY3RpdmVQbHVzLCAncGx1cycpO1xuICAgIH07XG5cbiAgICBlcXVhbC5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIG9wZXJhdG9yQ2xpY2tIYW5kbGVyKG51bGwsICdlcXVhbCcpO1xuICAgIH07XG4gIFxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICBBIGZ1bmN0aW9uIHRoYXQgZXhlY3V0ZXMgdGhlIGFyaXRobWV0aWMuXG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4gICAgZnVuY3Rpb24gYWN0aXZlTnVtYmVyc0NoZWNrKGRpc3BsYXllZE51bWJlcikge1xuICAgICAgICAvL2RlYnVnZ2VyO1xuICAgICAgICAvLyBpZiBhbnkgYWN0aXZlTnVtYmVycyBhcmUgZm91bmQgaW4gaW5kZXggMCwgY2FsY3VsYXRpb24gdGFrZXMgcGxhY2VcblxuICAgICAgICBpZiAodHlwZW9mIGRpc3BsYXllZE51bWJlciAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGRpc3BsYXllZE51bWJlciA9ICtkaXNwbGF5ZWROdW1iZXI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobnVtYmVyc0FjdGl2ZURpdmlkZVswXSkgeyBcbiAgICAgICAgICAgIG51bWJlcnNBY3RpdmVEaXZpZGUucHVzaChkaXNwbGF5ZWROdW1iZXIpO1xuICAgICAgICAgICAgcHJldmlvdXNOdW1iZXIgPSBudW1iZXJzQWN0aXZlRGl2aWRlWzFdO1xuICAgICAgICAgICAgY2FsY3VsYXRlKG51bWJlcnNBY3RpdmVEaXZpZGUsICdkaXZpZGUnKTtcbiAgICAgICAgICAgIGNsZWFyTnVtYmVyc0FjdGl2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gXG4gICAgXG4gICAgICAgIGlmIChudW1iZXJzQWN0aXZlVGltZXNbMF0pIHtcbiAgICAgICAgICAgIG51bWJlcnNBY3RpdmVUaW1lcy5wdXNoKGRpc3BsYXllZE51bWJlcik7XG4gICAgICAgICAgICBwcmV2aW91c051bWJlciA9IG51bWJlcnNBY3RpdmVUaW1lc1sxXTtcbiAgICAgICAgICAgIGNhbGN1bGF0ZShudW1iZXJzQWN0aXZlVGltZXMsICd0aW1lcycpO1xuICAgICAgICAgICAgY2xlYXJOdW1iZXJzQWN0aXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTsgICBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKG51bWJlcnNBY3RpdmVNaW51c1swXSkge1xuICAgICAgICAgICAgbnVtYmVyc0FjdGl2ZU1pbnVzLnB1c2goZGlzcGxheWVkTnVtYmVyKTtcbiAgICAgICAgICAgIHByZXZpb3VzTnVtYmVyID0gbnVtYmVyc0FjdGl2ZU1pbnVzWzFdO1xuICAgICAgICAgICAgY2FsY3VsYXRlKG51bWJlcnNBY3RpdmVNaW51cywgJ21pbnVzJyk7XG4gICAgICAgICAgICBjbGVhck51bWJlcnNBY3RpdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAobnVtYmVyc0FjdGl2ZVBsdXNbMF0pIHsgXG4gICAgICAgICAgICBudW1iZXJzQWN0aXZlUGx1cy5wdXNoKGRpc3BsYXllZE51bWJlcik7XG4gICAgICAgICAgICBwcmV2aW91c051bWJlciA9IG51bWJlcnNBY3RpdmVQbHVzWzFdO1xuICAgICAgICAgICAgY2FsY3VsYXRlKG51bWJlcnNBY3RpdmVQbHVzLCAncGx1cycpO1xuICAgICAgICAgICAgY2xlYXJOdW1iZXJzQWN0aXZlKCk7IFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSAgICBcblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZShhY3RpdmVOdW1zLCBvcGVyYXRvcikge1xuXG4gICAgICAgIGFjdGl2ZU51bXMgPSBhY3RpdmVOdW1zLm1hcChmdW5jdGlvbiAobnVtKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG51bSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBudW0gPSArbnVtO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbnVtO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAob3BlcmF0b3IgPT09ICdkaXZpZGUnKSB7XG4gICAgICAgICAgICBkaXNwbGF5ZWROdW1iZXIgPSBhY3RpdmVOdW1zWzBdIC8gYWN0aXZlTnVtc1sxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcGVyYXRvciA9PT0gJ3RpbWVzJykge1xuICAgICAgICAgICAgZGlzcGxheWVkTnVtYmVyID0gYWN0aXZlTnVtc1swXSAqIGFjdGl2ZU51bXNbMV07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3BlcmF0b3IgPT09ICdtaW51cycpIHtcbiAgICAgICAgICAgIGRpc3BsYXllZE51bWJlciA9IGFjdGl2ZU51bXNbMF0gLSBhY3RpdmVOdW1zWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wZXJhdG9yID09PSAncGx1cycpIHtcbiAgICAgICAgICAgIGRpc3BsYXllZE51bWJlciA9IGFjdGl2ZU51bXNbMF0gKyBhY3RpdmVOdW1zWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlRGlzcGxheSgpO1xuXG4gICAgICAgIHJldHVybjtcblxuICAgIH0gICAgICAgIFxuICBcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
