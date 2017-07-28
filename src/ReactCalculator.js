import Style from './Style';
import InputButton from './InputButton';
import React, { Component } from 'react';
import { Text, AppRegistry, View } from 'react-native';
const inputButtons = [
	[1, 2, 3, '/'],
	[4, 5, 6, '*'],
	[7, 8, 9, '-'],
	[0, '.', '+', '=']
];
class ReactCalculator extends Component {
  constructor(props){
  	super(props);
  	this.state = {
  		previousInputValue: 0,
  		inputValue: 0,
  		selectedSymbol: null
  	}
  }
  render(){
    return (
      <View style={Style.rootContainer}>
      	<View style={Style.displayContainer}>
      		<Text style={Style.displayText}>{this.state.inputValue}</Text>
      	</View>
      	<View style={Style.inputContainer}>
      		{this._renderInputButtons()}
      	</View>
      </View>
    )
  }

  _renderInputButtons(){
  	let views = [];
  	for (var r = 0; r < inputButtons.length; r++){
  		let row = inputButtons[r];
  		let inputRow = [];
  		for (var i = 0; i < row.length; i++){
  			let input = row[i];
  			inputRow.push(
  				<InputButton value={input} 
  							highlight={this.state.selectedSymbol === input}
  							onPress={this._onInputButtonPressed.bind(this,input)}
  							key={r + "-" + i} />
  			);
  		}
  		views.push(<View style={Style.inputRow} key={"row-" + r}>{inputRow}</View>)
  	}
  	return views;
  }

  _onInputButtonPressed(input) {
  	switch(typeof input){
  		case 'number':
  			return this._handleNumberInput(input);
  		case 'string':
  			return this._handleStringInput(input);
  	}
  }

  _handleNumberInput(num){
    let inputValue = this.state.inputValue;
    let newInputValue;
    if (!isNaN(parseInt(inputValue))){
        newInputValue = parseInt(inputValue) * 10 + num;
    } else {
        let inputArray = inputValue.split(" ");
        if (['+', '-', '*', '/'].indexOf(inputArray[inputArray.length - 1]) == -1){
            //the last is an number
            let temp = inputArray[inputArray.length - 1];
            inputArray[inputArray.length - 1] = temp * 10 + num;
        } else {
            //the last is not an number
            inputArray.push(num);
        }
        newInputValue = inputArray.join(" ");
  	}
  	this.setState({
  		inputValue: newInputValue
  	})
  }

  _handleStringInput(str){
  	switch(str){
  		case '/':
  		case '*':
  		case '+':
  		case '-':
  			this.setState({
  				selectedSymbol: str,
  				previousInputValue: this.state.inputValue,
  				inputValue: [this.state.inputValue, str].join(" ")
  			});
  			break;
  		case '=':
  			let symbol = this.state.selectedSymbol,
  				inputValue = this.state.inputValue,
  				previousInputValue = this.state.previousInputValue;
  			if (!symbol){
  				return;
  			}

  			this.setState({
  				previousInputValue: 0,
  				inputValue: eval(previousInputValue + symbol + inputValue.split(" ")[0]),
  				selectedSymbol: null
  			});
  			break;
  	}
  }
}

AppRegistry.registerComponent('ReactCalculator', ()=>ReactCalculator);
