import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3'
// import web3 from './web3'
import battleship from './contract.js'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { ButtonGroup } from '@material-ui/core';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
const useStyles = makeStyles((theme: Theme) =>
createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
  },
}),
);
var classes=0;
function Inputs() {
  classes = useStyles()
}
class App extends React.Component {
  state = {
    account : "NULL",
    btship : "NONE",
    pname: "Enter Your Name",
  };
  async loadData(){
    const web3 = new Web3(window.web3.currentProvider)
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    this.setState({ btship : battleship })
    
  }
  async startGame () {
    await this.state.btship.methods.newGame(true).send({from:this.state.account})
    // gameid = gameid.logs[0].args.gameId;
    await this.state.btship.methods.returngameid().call({from:this.state.account},function(err,data){console.log(data)});
    // console.log(gameid)
  }
  async enterName(){
    await this.state.btship.methods.setName(this.state.pname).send({from:this.state.account});
  }
  handleChange = (event) => {
    this.setState({pname: event.target.value});
  }
  componentDidMount(){
    this.loadData()
  }
  
  render(){
    return (
      <div className="App">
      <header className="App-header">
        <span className="header">Welcome, To the world of BattleShip!!!</span>
      </header>
      <div>
        <FormControl className={classes.formControl} variant="outlined">
          <TextField
          required
          id="name-req"
          label="Required"
          placeholder="Your Name?"
          className={classes.textField}
          margin="normal"
          variant="outlined"
          value={this.state.name}
            onChange={this.handleChange}
        />
            <ButtonGroup
              variant="contained"
              color="primary"
              size="large"
              aria-label="full-width contained primary button group"
              >
              <Button onClick = {()=>this.startGame()} >Join As Player 1</Button>
              <Button>Join As Player 2</Button>
            </ButtonGroup>

        </FormControl>
      </div>
    </div>
  );
  }
}

export default App;
