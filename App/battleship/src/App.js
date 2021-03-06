import React, {Component} from 'react';
import './App.css';
import web3 from './web3'
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
    gameState : 1,
    currentStep: 1,
    size2:  '',
    size3:  '',
    size4:  '',
    size5:  '',
    g_id : 232,
    move : '',
    currentPlayer : '',
    Opp : '',
    Winner : ''
  };
  
  keccak256 = (...args) => {
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
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    this.setState({ btship : battleship })
  }
  
  async startGame () {
    // await battleship.methods.newGame(true).send(60000000,{from:this.state.account});
    // var gid = await battleship.methods.retid().call({from:this.state.account});
    // console.log(gid)
    // var topush = {
    //   gameId : gid
    // }
    // firebase.database().ref('/gameId').push(topush);
    this.details()
    this.setState({gameState:4})
    // this.setState({g_id:gid})
    
  }
  async joinGame(){
    // const instance = firebase.database().ref('gameId');
    // instance.on('value', async (snapshot) => {
    //   let idx = snapshot.val();
    //   if(idx == null){
    //     alert('Oh! no players are there!!')
    //     return;
    //   }
    //   let ids = Object.values(idx)
    //   if(ids.length == 0){
    //     alert('Oh! no players are there!!')
    //     return;
    //   }
    //   else{
    //     this.setState({gids:ids})
    //     var ln = ids.length;
    //     this.setState({g_id:ids[ln-1]['gameId']})
    //     console.log("gameid - ", ids[ln-1]['gameId']);
    //     await battleship.methods.joinGame(ids[ln-1]['gameId']).send(10000, {from:this.state.account});
    //         // setInterval(this.details,1000);
            this.details();
            this.setState({gameState:4});
    //   }
      
    // });
    
  }
  
  printGids= () =>{
    console.log(this.state.gids[0]['gameId'])
  }
  async enterName(){
    await battleship.methods.setName(this.state.pname).send({from:this.state.account});
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

  handleMove = (event) => {
    const {name, value} = event.target
    this.setState({
      [name] : value
    })    
  }
  async makeMoves(event){
    const moves = this.state.move.split(" ");
    if(moves.length != 2){
      alert('put cords correctly');
      return;
    }
    let x = moves[0];
    let y = moves[1];
    await battleship.methods.makeMove(232, x, y).send({from:this.state.account});
    // await battleship.methods.makeMove(this.state.g_id, x, y).call({from:this.state.account});
    this.details();
  }
  async handleSubmit(event){
    const ship5 = this.state.size5.split(" ");
    if(ship5.length != 4){
      alert('put cords correctly');
      return;
    }
    let startX = ship5[0];
    let endX = ship5[1];
    let startY = ship5[2];
    let endY = ship5[3];
    let flag = true;
    if(!(startX == endX || startY == endY)){flag = false}
    if(!(startX < endX || startY < endY)){flag = false}
    if(!(startX  < 10 && startX  >= 0 &&
            endX    < 10 && endX    >= 0 &&
            startY  < 10 && startY  >= 0 &&
            endY    < 10 && endY    >= 0)){flag = false}
    if(!flag){
      alert('put cords correctly')
      return;
    } 
    await battleship.methods.placeShip(this.state.g_id,ship5[0],ship5[1],ship5[2],ship5[3]).send({from: this.state.account});
    var out = await battleship.methods.finishPlacing(this.state.g_id).call({from:this.state.account})
    
    while(out==false){
      out = await battleship.methods.finishPlacing(this.state.g_id).call({from:this.state.account})
      this.setState({gameState:3});
    }
    this.details();
    this.setState({gameState:4});
  }
  async _next(){
    let currentStep = this.state.currentStep
    if( currentStep==1){
      const ship2 = this.state.size2.split(" ")
      if(ship2.length != 4){
        alert('put cords correctly')
        return;
      }
      // var cpl = await battleship.methods.findOtherPlayer(this.state.g_id, this.state.account).call({from:this.state.account});
      let startX = ship2[0];
      let endX = ship2[1];
      let startY = ship2[2];
      let endY = ship2[3];
      let flag = true;
      if(!(startX == endX || startY == endY)){flag = false}
      if(!(startX < endX || startY < endY)){flag = false}
      if(!(startX  < 10 && startX  >= 0 &&
              endX    < 10 && endX    >= 0 &&
              startY  < 10 && startY  >= 0 &&
              endY    < 10 && endY    >= 0)){flag = false}
      if(!flag){
        alert('put cords correctly')
        return;
      } 
      await battleship.methods.placeShip(this.state.g_id,ship2[0],ship2[1],ship2[2],ship2[3]).send({from: this.state.account});
    }
    if(currentStep==2){
      const ship3 = this.state.size3.split(" ")
      if(ship3.length != 4){
        alert('put cords correctly')
        return;
      }
      let startX = ship3[0];
      let endX = ship3[1];
      let startY = ship3[2];
      let endY = ship3[3];
      let flag = true;
      if(!(startX == endX || startY == endY)){flag = false}
      if(!(startX < endX || startY < endY)){flag = false}
      if(!(startX  < 10 && startX  >= 0 &&
              endX    < 10 && endX    >= 0 &&
              startY  < 10 && startY  >= 0 &&
              endY    < 10 && endY    >= 0)){flag = false}
      if(!flag){
        alert('put cords correctly')
        return;
      } 
      await battleship.methods.placeShip(this.state.g_id,ship3[0],ship3[1],ship3[2],ship3[3]).send({from: this.state.account});
    }
    if( currentStep==3){
      const ship4 = this.state.size4.split(" ")
      if(ship4.length != 4){
        alert('put cords correctly')
        return;
      }

      let startX = ship4[0];
      let endX = ship4[1];
      let startY = ship4[2];
      let endY = ship4[3];
      let flag = true;
      if(!(startX == endX || startY == endY)){flag = false}
      if(!(startX < endX || startY < endY)){flag = false}
      if(!(startX  < 10 && startX  >= 0 &&
              endX    < 10 && endX    >= 0 &&
              startY  < 10 && startY  >= 0 &&
              endY    < 10 && endY    >= 0)){flag = false}
      if(!flag){
        alert('put cords correctly')
        return;
      } 
      await battleship.methods.placeShip(this.state.g_id,ship4[0],ship4[1],ship4[2],ship4[3]).send({from: this.state.account});
    }  
    if( currentStep==4){
      const ship5 = this.state.size5.split(" ")
      if(ship5.length != 4){
        alert('put cords correctly')
        return;
      }
      await battleship.methods.placeShip(this.state.g_id,ship5[0],ship5[1],ship5[2],ship5[3]).send({from: this.state.account});

    }
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
  async details(){
    let curplayer = await battleship.methods.status(this.state.g_id).call({from:this.state.account});
    let win = await battleship.methods.winner(this.state.g_id).call();
    let opp = await battleship.methods.findOtherPlayer(this.state.g_id, this.state.account).call();
    
    this.setState({currentPlayer : curplayer});
    this.setState({Winner : win});
    this.setState({Opponent : opp});
  }
  headers=()=>{
    // this.details();
    // console.log("winner - ", this.state.Winner);
    // console.log("opp - ", this.state.Opponent);
    // console.log("curpl - ", this.state.currentPlayer);
    if(this.state.Winner==this.state.account){
      var topush = {
        gameId : this.state.g_id,
        winner : this.state.winner
      }
      firebase.database().ref('/windata').push(topush);
      return(
        <h1 className="form-heading"> Congrats You Won, bet Money will be transfered to your Account </h1>
      );
    }
    else if(this.state.Winner == this.state.Opponent){
      return(
        <h1 className="form-heading"> Your opponent won the game! Better luck next time </h1>
      );
    }
    else{
      if(this.state.currentPlayer == this.state.account){
        return(
          <h1 className="form-heading">Its Your turn </h1>
        );
      }
      else if(this.state.currentPlayer == this.state.Opponent){
        return(
          <h1 className="form-heading">Wait for opponents turn</h1>
        );
      }
      else{
        return(
          <h1 className="form-heading">You seem to have entered in wrong game</h1>
        );
      }
    }
  }
  moveBtn=()=>{
    // console.log("curplayer - ", this.state.currentPlayer)
    if(this.state.currentPlayer == this.state.account){
      return (
        <ButtonGroup variant="contained" color="primary" size="large" aria-label="full-width contained primary button group">
        <Button onClick = {()=>this.makeMoves()} >Doit!</Button>
      </ButtonGroup>
      )
    }
    else{
      return (
        <ButtonGroup variant="contained" color="primary" size="large" aria-label="full-width contained primary button group">
        <Button onClick = {()=>this.details()} >Refresh</Button>
      </ButtonGroup>
      )
    }
    return null;
  }

  Move=()=> {
    return(
      <div className="form_f">
        <label>Move coordinates (space separated) </label>
        <br></br>
        <input
          className="form-control"
          id="move"
          name="move"
          type="text"
          placeholder="Enter Move"
          value={this.state.move}
          onChange={this.handleMove}
          />
      </div>
    );
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
    if(this.state.gameState == 1){
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
  else if(this.state.gameState==2){
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
  else if(this.state.gameState==3){
    return (
      <div className="App">
        <header className="App-header">
          <span className="header">Moves Placed Succesfully!!!</span>
        </header>
        <h1 className="form-heading" >Waiting For Other player to place ship🧙‍♂️</h1>

    </div>
    );
  }
  else if(this.state.gameState==4){
    return (
      <div className="App">
        <header className="App-header">
          <span className="header">Time to make your move!!!</span>
        </header>
        {/* <h1 className="form-heading" >ENTER YOUR MOVE🧙‍♂️</h1> */}
        {this.headers()}
        <form onSubmit={this.handleSubmit}>
          <this.Move 
            handleChange={this.handleMove}
            value={this.state.move}
          />
          {this.moveBtn()}
        </form>

    </div>
    );
  }
  }
}

export default App;
