import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3'
// import web3 from './web3'
import battleship from './contract.js'


class App extends Component {
  state = {
    account : "NULL",
    btship : "NONE",
    amountToSend : 6000000
  };
  async loadData(){
    const web3 = new Web3(window.web3.currentProvider)
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    this.setState({ btship : battleship })

  }
  async startGame () {
    var out = await this.state.btship.methods.newGame(true).send({from:this.state.account, value: this.state.amountToSend})
    console.log(out)
  }
  componentDidMount(){
    this.loadData()
  }
  render(){
  return (
    <div className="App">
      <header className="App-header">
        <span>Test -1 -- {this.state.account}  </span>
        <button onClick = {()=>this.startGame()}>Rizzu Bhaag</button>
      </header>
    </div>
  );
  }
}

export default App;
