import React, {Component} from 'react';

//functional imports
import {withRouter} from 'react-router-dom';
import {withCookies, Cookies} from 'react-cookie';

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

        /*
        expenses.forEach((exp) => {
            balance -= exp;
        })
        incomes.forEach((inc) => {
            balance += inc;
        })
        */
    }

    incrementBalance(value) {
        var bal = this.state.balance;
        bal += value;
        this.setState({balance: bal});
    }
    decrementBalance(value) {
        var bal = this.state.balance;
        bal -= value;
        this.setState({balance: bal});
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
            <div className='container'>
                <h2>{balance}</h2>
                <button 
                className='btn-success'
                onClick={() => this.incrementBalance(100)}
                >$100</button>
                <button
                className='btn-danger'
                onClick={() => this.decrementBalance(100)}>$100</button>
            </div>
        );


    }
}

export default withRouter(withCookies(Finances));