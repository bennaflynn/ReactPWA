import React, {Component} from 'react';

//this component manages the incomes and 
//the expenses of the person

class Finances extends Component {
    constructor() {
        super();

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
                <div class="error">{error}</div>
            );
        }

        return(
            <div class='container'>
                <h2>{balance}</h2>
                <button 
                class='btn-success'
                onClick={() => this.incrementBalance(100)}
                >$100</button>
                <button
                class='btn-danger'
                onClick={() => this.decrementBalance(100)}>$100</button>
            </div>
        );


    }
}

export default Finances;