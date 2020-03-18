import React, { Component } from "react";
import { hot } from "react-hot-loader";
import "./App.css";

const INSTRUCTIONS =
  "Note: To operate this calculator you can either use mouse or keyboard.";
const CREDITS = "Designed and Coded By Cris Fernandez";
const KEYCODES = [
  { key1: 107, key2: 187, keyName: "+", keyValue: "add" },
  { key1: 109, key2: 189, keyName: "-", keyValue: "subtract" },
  { key1: 106, key2: 106, keyName: "*", keyValue: "multiply" },
  { key1: 111, key2: 111, keyName: "/", keyValue: "divide" },
  { key1: 48, key2: 96, keyName: "0", keyValue: "zero" },
  { key1: 49, key2: 97, keyName: "1", keyValue: "one" },
  { key1: 50, key2: 98, keyName: "2", keyValue: "two" },
  { key1: 51, key2: 99, keyName: "3", keyValue: "three" },
  { key1: 52, key2: 100, keyName: "4", keyValue: "four" },
  { key1: 53, key2: 101, keyName: "5", keyValue: "five" },
  { key1: 54, key2: 102, keyName: "6", keyValue: "six" },
  { key1: 55, key2: 103, keyName: "7", keyValue: "seven" },
  { key1: 56, key2: 104, keyName: "8", keyValue: "eight" },
  { key1: 57, key2: 105, keyName: "9", keyValue: "nine" },
  { key1: 190, key2: 110, keyName: ".", keyValue: "decimal" },
  { key1: 13, key2: 13, keyName: "Enter", keyValue: "equals" },
  { key1: 8, key2: 8, keyName: "Delete", keyValue: "delete" },
  { key1: 46, key2: 46, keyName: "Supr", keyValue: "clear" }
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: "0",
      lastNum: "0"
    };
  }

  handleKeyDown = event => {
    let key = event.keyCode;
    let keyPressed = KEYCODES.filter(
      myKey => key == myKey.key1 || key == myKey.key2
    );

    if (keyPressed.length < 1) return;

    let element = document.getElementById(keyPressed[0].keyValue);
    element.click();
    element.classList.toggle("button-active");

    setTimeout(() => element.classList.toggle("button-active"), 100);
    document.getElementById("main").focus();
  };

  replaceLastChar = (text, newchar) => {
    if (text.length < 1) return text;

    let newtext = [];
    for (let i = 0; i < text.length; i++) {
      newtext.push(text[i]);
    }
    newtext[newtext.length - 1] = newchar;
    return newtext.join("");
  };

  setNumber = (event, numberKey) => {
    let number = numberKey ? numberKey : event.target.textContent;
    let text = this.state.inputText;
    let lastNum = this.state.lastNum;

    if (
      (lastNum.indexOf(".") != -1 && number == ".") ||
      lastNum.length > 16 ||
      (!lastNum && number == 0)
    )
      return;
    if (text != "0") number = text.concat(number);

    lastNum = number.split(/[+*/-]/);
    lastNum = lastNum.length > 0 ? lastNum[lastNum.length - 1] : number;

    this.setState({
      inputText: number,
      lastNum: lastNum
    });
  };

  setOperation = (event, operationKey) => {
    let text = this.state.inputText;
    let len = text.length;
    if (len < 1) return;

    let lastInputChar = text[len - 1];
    let secondLastInputChar = len > 1 ? text[len - 2] : "NaN"; // checks to prevent out of index
    let curOperation = operationKey ? operationKey : event.target.textContent;
    let replacer = "";

    if (
      isNaN(lastInputChar) &&
      (lastInputChar == "*" || lastInputChar == "/") &&
      curOperation == "-"
    )
      replacer = text.concat(curOperation);
    else if (isNaN(lastInputChar) && isNaN(secondLastInputChar))
      replacer = text.slice(0, len - 2).concat(curOperation);
    else if (isNaN(lastInputChar) && !isNaN(secondLastInputChar))
      replacer = this.replaceLastChar(text, curOperation);
    else replacer = text.concat(curOperation);

    this.setState({
      inputText: replacer,
      lastNum: "0"
    });
  };

  doMul = numberList => {
    let newList = [];
    let lastNum = NaN;
    let lastNumber = "";

    for (let i = 0; i < numberList.length; i++) {
      if (isNaN(numberList[i])) {
        lastNumber = numberList[i];
        if (lastNumber == "+") newList.push(lastNumber);
      } else if (lastNum && lastNumber && lastNumber != "+") {
        lastNum =
          lastNumber == "*" ? lastNum * numberList[i] : lastNum / numberList[i];
        newList.pop();
        newList.push(lastNum);
      } else {
        lastNum = numberList[i];
        newList.push(lastNum);
      }
    }
    return newList;
  };

  doSum = numberList => {
    let result = 0;
    if (numberList.length == 1) return numberList[0];

    for (let i = 0; i < numberList.length; i++) {
      if (!isNaN(numberList[i])) result += numberList[i];
    }

    return result;
  };

  doOperation = () => {
    let numberList = [];
    let curNumber = "";
    let text = this.state.inputText;

    for (let i = 0; i < text.length; i++) {
      let curDigit = text[i];
      if (isNaN(curDigit) && curDigit != ".") {
        let isNegative = curDigit == "-";
        let operator = isNegative ? "+" : curDigit;

        if (curNumber) numberList.push(Number(curNumber), operator);
        curNumber = isNegative ? "-" : ""; // adds a negative sign if negative
      } else {
        curNumber += curDigit;
      }
    }

    if (curNumber) numberList.push(Number(curNumber));

    numberList = this.doMul(numberList);
    let result = this.doSum(numberList);

    this.setState({
      inputText: result.toString(),
      lastNum: result.toString()
    });
  };

  doClear = () => {
    this.setState({
      inputText: "0",
      lastNum: "0"
    });
  };

  doDelete = () => {
    let text = this.state.inputText;
    let lastNum = this.state.lastNum;

    if (!text || text.length == 1) text = "0";
    else text = text.slice(0, text.length - 1);

    lastNum = text.split(/[+*/-]/);
    let len = lastNum.length;
    lastNum =
      !lastNum[len - 1] && len > 1 ? lastNum[len - 2] : lastNum[len - 1]; // get block of number

    this.setState({
      inputText: text,
      lastNum: lastNum
    });
  };

  render() {
    return (
      <div>
        <div
          tabIndex="0"
          onKeyDown={this.handleKeyDown}
          id="main"
          className="main"
        >
          <div id="text">
            <h2 id="display" className="display">
              {this.state.inputText}
            </h2>
            <h2 id="lastNumber" className="lastNumber">
              {this.state.lastNum}
            </h2>
          </div>
          <div id="program">
            <div id="container">
              <div id="options">
                <button id="clear" className="clear" onClick={this.doClear}>
                  AC
                </button>
                <button id="delete" className="delete" onClick={this.doDelete}>
                  DEL
                </button>
              </div>
              <div id="buttons">
                <div>
                  <button id="one" onClick={this.setNumber}>
                    1
                  </button>
                  <button id="two" onClick={this.setNumber}>
                    2
                  </button>
                  <button id="three" onClick={this.setNumber}>
                    3
                  </button>
                </div>
                <div>
                  <button id="four" onClick={this.setNumber}>
                    4
                  </button>
                  <button id="five" onClick={this.setNumber}>
                    5
                  </button>
                  <button id="six" onClick={this.setNumber}>
                    6
                  </button>
                </div>
                <div>
                  <button id="seven" onClick={this.setNumber}>
                    7
                  </button>
                  <button id="eight" onClick={this.setNumber}>
                    8
                  </button>
                  <button id="nine" onClick={this.setNumber}>
                    9
                  </button>
                </div>
                <div>
                  <button id="zero" onClick={this.setNumber}>
                    0
                  </button>
                  <button id="decimal" onClick={this.setNumber}>
                    .
                  </button>
                </div>
              </div>
            </div>
            <div id="operations">
              <button id="add" onClick={this.setOperation}>
                +
              </button>
              <button id="subtract" onClick={this.setOperation}>
                -
              </button>
              <button id="multiply" onClick={this.setOperation}>
                *
              </button>
              <button id="divide" onClick={this.setOperation}>
                /
              </button>
              <button id="equals" className="equals" onClick={this.doOperation}>
                =
              </button>
            </div>
          </div>
        </div>
        <h4 id="instructions">{INSTRUCTIONS}</h4>
        <h4 id="credits">{CREDITS}</h4>
      </div>
    );
  }
}

export default hot(module)(App);
