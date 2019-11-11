import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3'
// import web3 from './web3'
import battleship from './contract.js'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { ButtonGroup } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import leftPad from 'left-pad'
import firebase from './firebase';
// import { withRouter } from 'react-router-dom';


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
  classes = useStyles();
}
class App extends React.Component {
  state = {
    account : "NULL",
    btship : "NONE",
    pname: "Enter your name",
    gids : [],
    gameInit : true,
    currentStep: 1,
    size2:  '',
    size3:  '',
    size4:  '',
    size5:  '',
  };
  
  keccak256 = (...args) => {
    const web3 = new Web3(window.web3.currentProvider)
    args = args.map(arg => {
      if (typeof arg === 'string') {
        if (arg.substring(0, 2) === '0x') {
          return arg.slice(2)
        } else {
          return web3.toHex(arg).slice(2)
        }
      }
      if (typeof arg === 'number') {
        return leftPad((arg).toString(16), 64, 0)
      } else {
        return ''
      }
    })
  
    args = args.join('')
  
    return web3.utils.sha3(args, { encoding: 'hex' })
  }

  async loadData(){
    const web3 = new Web3(window.web3.currentProvider)
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    this.setState({ btship : battleship })
  }
  
  async startGame () {
    var txn = await this.state.btship.methods.newGame(true).send(60000000,{from:this.state.account}); console.log(txn);
    var gid = this.keccak256(this.state.account, txn['blockNumber']); console.log(gid); 
    var topush = {
      gameId : gid
    }
    firebase.database().ref('/gameId').push(topush);
    // alert('waiting for other player please wait and bring shawarma')
    this.setState({gameInit:true})
    
  }
  joinGame() {
    const instance = firebase.database().ref('gameId');
    instance.on('value', (snapshot) => {
      let ids = snapshot.val();
      if(ids == null){
        alert('Oh! no players are there!!')
        return;
      }
      ids = Object.values(ids)
      if(ids.length == 0){
        alert('Oh! no players are there!!')
        return;
      }
      this.setState({gids:ids})
      this.state.btship.methods.joinGame(ids[0]['gameId']).send(10000, {from:this.state.account});
      this.setState({gameInit:true})
      
    });
    
  }
  
  printGids= () =>{
    // console.log(this.state.gids[0])
    console.log(this.state.gids[0]['gameId'])
  }
  async enterName(){
    await this.state.btship.methods.setName(this.state.pname).send({from:this.state.account});
  }

  handleChange = (event) => {
    this.setState({pname: event.target.value});
  }
  handleChange2 = (event) => {
    const {name, value} = event.target
    this.setState({
      [name] : value
    })    
  }
  handleSubmit = event => {
    // const { email, username, password } = this.state
    const ship2 = this.state.size2;
    const ship3 = this.state.size3;
    const ship4 = this.state.size4;
    const ship5 = this.state.size5;
    alert(`Your ship positions are: \n 
           s2: ${ship2} \n 
           s3: ${ship3} \n 
           s4: ${ship4} \n 
           s5: ${ship5} \n`)
  }
  _next = () => {
    let currentStep = this.state.currentStep
    currentStep = currentStep >= 3? 4: currentStep + 1
    this.setState({
      currentStep: currentStep
    })
  }
  _prev = () => {
    let currentStep = this.state.currentStep
    currentStep = currentStep <= 1? 1: currentStep - 1
    this.setState({
      currentStep: currentStep
    })
  }
  previousButton=()=> {
    let currentStep = this.state.currentStep;
    if(currentStep !==1){
      return (
        <ButtonGroup variant="contained" color="primary" size="large" aria-label="full-width contained primary button group">
        <Button onClick = {()=>this._prev()} >Prev</Button>
      </ButtonGroup>
      )
    }
    return null;
  }
  nextButton=()=>{
    let currentStep = this.state.currentStep;
    if(currentStep <4){
      return (
        <ButtonGroup variant="contained" color="primary" size="large" aria-label="full-width contained primary button group">
        <Button onClick = {()=>this._next()} >Next</Button>
      </ButtonGroup>
      )
    }
    else if(currentStep == 4){
      return(
        <ButtonGroup variant="contained" color="primary" size="large" aria-label="full-width contained primary button group">
        <Button onClick = {()=>this.handleSubmit()} >Submit</Button>
        </ButtonGroup>
        
      )
    }
    return null;
  }
  Step1=()=> {
    if (this.state.currentStep !== 1) {
      return null
    } 
    return(
      <div className="form_f">
        <label htmlFor="ship2">Ship Size 2 : coordinates (space separated) </label>
        <br></br>
        <input
          className="form-control"
          id="ship2"
          name="size2"
          type="text"
          placeholder="Enter coordinates"
          value={this.state.size2}
          onChange={this.handleChange2}
          />
      </div>
    );
  }
  Step2=()=> {
    if (this.state.currentStep !== 2) {
      return null
    } 
    
    console.log("this.state.currentStep")
    console.log(this.state.currentStep)
    return(
      <div className="form_f">
        <label htmlFor="ship3">Ship Size 3 : coordinates (space separated)</label>
        <br></br>
        <input
          className="form-control"
          id="ship3"
          name="size3"
          type="text"
          placeholder="Enter coordinates"
          value={this.state.size3}
          onChange={this.handleChange2}
          />
      </div>
    );
  }
  Step3=()=> {
    if (this.state.currentStep !== 3) {
      return null
    } 
    console.log("this.state.currentStep")
    console.log(this.state.currentStep)
    return(
      <div className="form_f">
        <label htmlFor="ship2">Ship Size 4 : coordinates (space separated)</label>
        <br></br>
        <input
          className="form-control"
          id="ship4"
          name="size4"
          type="text"
          placeholder="Enter coordinates"
          value={this.state.size4}
          onChange={this.handleChange2}
          />
      </div>
    );
  }
  Step4=()=> {
    if (this.state.currentStep !== 4) {
      return null
    } 
    console.log("this.state.currentStep")
    console.log(this.state.currentStep)
    return(
      <div className="form_f">
        <label htmlFor="ship2">Ship Size 5 : coordinates (space separated) </label>
        <br></br>
        <input
          className="form-control"
          id="ship5"
          name="size5"
          type="text"
          placeholder="Enter coordinates"
          value={this.state.size5}
          onChange={this.handleChange2}
          />
      </div>
    );
  }
  componentDidMount(){
    this.loadData()
  }
  
  render(){
    if(this.state.gameInit == false){
    return (
      <div className="App">
        <header className="App-header">
          <span className="header">Welcome to the world of BattleShip!!!</span>
        </header>
        <div>
          <FormControl className={classes.formControl} variant="filled">
              <TextField required id="name-req" label="Required"
                placeholder="Your Name?"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                value={this.state.name}
                onChange={this.handleChange}
              />
              <ButtonGroup variant="contained" color="primary" size="large" aria-label="full-width contained primary button group">
                {/* <Button onClick = {()=>this.printGids()} >Join As Player 1</Button> */}
                <Button onClick = {()=>this.startGame()} >Join As Player 1</Button>
                <Button onClick = {()=>this.joinGame()}>Join As Player 2</Button>
              </ButtonGroup>
          </FormControl>
        </div>
    </div>
    );
  }
  else{
    return(
      <div className="App">
      <header className="App-header">
        <span className="header">Time to be a champion!!Place your ships</span>
      </header>
      <React.Fragment>
      {/* <div className="cords_form"> */}
        <h1 className="form-heading" >Time to place your ships! 🧙‍♂️</h1>
        {/* <p className= "stepno" >Step {this.state.currentStep} </p>  */}

        <form onSubmit={this.handleSubmit}>
          <this.Step1 
            currentStep={this.state.currentStep} 
            handleChange={this.handleChange2}
            value={this.state.ship2}
          />
          <this.Step2
            currentStep={this.state.currentStep} 
            handleChange={this.handleChange2}
            value={this.state.ship3}
          />
          <this.Step3 
            currentStep={this.state.currentStep} 
            handleChange={this.handleChange2}
            value={this.state.ship4}
          />
          <this.Step4 
            currentStep={this.state.currentStep} 
            handleChange={this.handleChange2}
            value={this.state.ship5}
          />
          {this.previousButton()}
          {this.nextButton()}
          

        </form>
      {/* </div > */}
      </React.Fragment>
  </div>

   );
  }
  }
}

export default App;
