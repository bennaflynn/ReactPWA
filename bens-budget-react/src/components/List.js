import React, {Component} from 'react';

//functional imports
import {API_URL} from '../Config';
import {handleResponse} from '../Helper';
import {withCookies, Cookies} from 'react-cookie';
import {withRouter} from 'react-router-dom';
//styles
import './list.css';
//boostrap components
import {Table} from 'react-bootstrap';

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
        const {cookies, history} = this.props;
        if(!cookies.get('token')) {
            history.push('/');
        }
        this.fetchFlows();
    }

    //call the API and grab the incomes/expenses
    fetchFlows() {
        const {fixedExpenses, fixedIncomes, incomes, expenses} = this.state;
        const {cookies, history} = this.props;

        //get the balances
        fetch(`${API_URL}/finances/balance`, {method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json',
                //get the token from the cookies
                'Authorization': 'jwt ' + cookies.get('token')
            }})
            .then(handleResponse)
            .then((result) => {
                if(result.success === false) {
                    history.push('/');
                }

                var fexp = fixedExpenses;
                var finc = fixedIncomes;
                var exp = expenses;
                var inc = incomes;
                result.forEach((flow) => {
                    
                    //add to the list based on whether or
                    //not they are fixed and whether or 
                    //not they are incomes
                    if(flow.monthly) {
                        if(flow.amount > 0) {
                            finc.push(flow);
                        } else {
                            fexp.push(flow);
                        }
                    } else {
                        if(flow.amount > 0) {
                            inc.push(flow);
                        } else {
                            exp.push(flow);
                        }
                    }

                }, this);

                this.setState({fixedExpenses: fexp, fixedIncomes: finc, incomes: inc, expenses: exp});
            })
            .catch((error) => {
                history.push('/');
            })
        console.log(this.state);
    }

    
    render() {
        const {fixedExpenses, fixedIncomes, expenses, incomes} = this.state;
        
        if(fixedExpenses.length < 1) {
            console.log('Less than');
            return '';
        }

        return(
            <div>
            <p>{fixedExpenses[0].dateAdded}</p>
            <Table striped className='finances-table'>
                <thead>
                    <tr>
                        <th colSpan={3}>Fixed Expenses</th>
                    </tr>   
                </thead>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Desc</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                {fixedExpenses.map(fexp => {
                    var d = new Date(fexp.dateAdded);
                    //gotta do plus one cause months are zero indexed
                    return(
                    <tr>
                        <td>{d.getDate() + '/' + (d.getMonth()+1)}</td>
                        <td>{fexp.name}</td>
                        <td>{fexp.amount}</td>
                    </tr>
                    );
                })}
            </Table>
            </div>
        );
    }
}

export default withRouter(withCookies(List));