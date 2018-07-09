import React, {Component} from 'react';

//functional imports
import {checkCookie} from '../CheckCookie';

class List extends Component {
    constructor() {
        super();

        //set the state
        this.state = {
            fixedExpenses: [],
            fixedIncomes: [],
            incomes: [],
            expenses: []
        }

    }
    //check if user is verified
    componentWillMount() {
        this.checkCookie;
    }

    //call the API and grab the incomes/expenses
}

export default List;