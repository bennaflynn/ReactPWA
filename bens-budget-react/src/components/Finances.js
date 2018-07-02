import React, {Component} from 'react';

//functional imports
import {withRouter} from 'react-router-dom';
import {withCookies, Cookies} from 'react-cookie';

import {API_URL} from '../Config';
import {handleResponse} from '../Helper';

//this component manages the incomes and 
//the expenses of the person

class Finances extends Component {
    constructor(props) {
        super(props);

        const {cookies, history} = props;

        this.state = {
            //money going out
            expenses: [],
            //money going in
            incomes: [],
            //the difference
            balance: 0,
            //temporary value
            tempVal: 0,
            //timer boolean 
            timerBegan: false,
            //error handling,
            error: null
        };
    }
    
    componentWillMount() {
        const {cookies, history} = this.props;

        //if the email cookie doesn't exist then 
        //bounce back to the log in page
        if(!cookies.get('email')) {
            history.push('/');
        }
    }

    //when the component is mounted
    componentDidMount() {
        const {expenses, incomes, balance} = this.state;
        const {cookies} = this.props;

        //get the balances
        fetch(`${API_URL}/finances/balance`,
        {method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            email: cookies.get('email') || ""
        })
        })
        .then(handleResponse)
        .then((result) => {
            //now loop through our object and
            //add the results to the state
            var exp = expenses;
            var inc = incomes;
            var bal = balance;
            result.forEach(function(element) {
                 
                if(element.amount < 0) {
                    exp.push(element.amount);
                } else {
                    inc.push(element.amount);
                }
                bal += element.amount;
            }, this);
            this.setState({expenses: exp, incomes:inc, balance: bal});
            
        })
        .catch((error) => {
            console.log(error);
        })
        
        
    }

    
    changeBalance(value) {
        var bal = this.state.balance;
        var temp = this.state.tempVal;
        bal += value;
        temp += value;
        this.setState({balance: bal, tempVal: temp});
        this.waitThenAdd();
    }

    //this gets called only if the timer has
    //not been called yet. It waits 5 seconds,
    //hopefully enough to add a new one time
    //income/expense and then adds it to the 
    //database
    waitThenAdd() {
        const {cookies} = this.props;

        if(this.state.timerBegan) {
            return '';
        }
        //timer is now started
        this.setState({timerBegan: true});

        setTimeout(()=> {
            console.log(this.state.tempVal);

            //call the api
            fetch(`${API_URL}/finances/newflow`,
            {method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email: cookies.get('email') || '',
                amount: this.state.tempVal,
                name: '',
                monthly: false
            })
            })
            .then(handleResponse)
            .then((result) => {
                if(result.success) {
                    alert('Successfully added');
                } else {
                    alert('Not added');
                }

            })
            .catch((error) => {
                console.log(error);
            })

            //add the value to the database
            this.setState({timerBegan: false, tempVal: 0})
            
        },5000)
    }
    

    render() {
        const {expenses, incomes, balance, error} = this.state;

        //when I have error handling
        if(error) {
            return (
                <div className="error">{error}</div>
            );
        }

        return(
            <div className="container">
                <div className='row'>
                    <div className="col-12">
                        <h2>{balance}</h2>
                    </div>
                </div>
                <div className="row">
                    
                    <button 
                        className='btn-success'
                        onClick={() => this.changeBalance(100)}
                        >$100</button>
                    
                    <button
                        className='btn-danger'
                        onClick={() => this.changeBalance(-100)}>$100</button>
                    
                </div>
                <div className="row">
                    
                    <button 
                        className='btn-success'
                        onClick={() => this.changeBalance(10)}
                        >$10</button>
                   
                    <button 
                        className='btn-danger'
                        onClick={() => this.changeBalance(-10)}
                        >$10</button>
                    
                </div>
                <div className="row">
                    
                    <button 
                        className='btn-success'
                        onClick={() => this.changeBalance(1)}
                        >$1</button>
                   
                    <button 
                        className='btn-danger'
                        onClick={() => this.changeBalance(-1)}
                        >$1</button>
                    
                </div>
                
                
            </div>
        );


    }
}

export default withRouter(withCookies(Finances));