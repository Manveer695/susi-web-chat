import React from 'react';
var axios = require('axios');

const Card = (props) => {
    let ans,speaker;
        if(props.data.answers){
                speaker = "Susi";
                ans = props.data.answers[0].actions[0].expression;
            }
            else{
                speaker = "You";
                ans = props.data;
            }
    return(
  	<div style = {{margin: '1em'}}>
      <div style={{display: 'inline-block', marginLeft: 10}}>
        <div style={{fontSize: '1.25em', fontWeight: 'bold'}}> 
          {
            speaker    
          }
        </div>
        <div> 
          { 
            ans
          } 
        </div>
      </div>
    </div>
  );
};

const CardList = (props) => {
	return(
        <div>
          {props.cards.map(card => <Card {...card}/>)}
        </div>
    );
}

class Form extends React.Component{
	constructor(){
        super();
        this.state = {
                        userName: ''
        }
        this.handleSubmit = (event) => {
            event.preventDefault();
            let obj = {};
            obj.data = this.state.userName;
            this.props.cards(obj);
            axios.get(`http://api.asksusi.com/susi/chat.json?timezoneOffset=-330&q=${this.state.userName}`)
            .then( resp => {
                this.props.cards(resp);
                this.setState({
                    userName: ''
                });
            });
        }
    }
	render(){
        return(
            <form onSubmit={this.handleSubmit}>
            <input 
            value = {this.state.userName}
            onChange = {(event) => {
                                      this.setState({
                                        userName: event.target.value
                                      })
                                                         }
                                 }
            type = "text" placeholder="Github Username" required/>
            <button type="submit">Add question</button>
          </form>
        );
    }
}

class App extends React.Component{
    constructor(){
        super();
        this.state = {
         cards: []
        };

        this.addNewCard = (cardInfo) => {
            this.setState(prevState => ({
                cards: prevState.cards.concat(cardInfo)
            }));
        };
    }
    render(){
        return(
            <div>
            <Form cards={this.addNewCard}/>
            <CardList cards={this.state.cards}/>
          </div>
        );
    }
}

export default App;