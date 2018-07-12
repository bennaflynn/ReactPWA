import React, {Component} from 'react';

//styles
import './Finances.css';

//components
import Loading from './Loading';

//functional imports
import {withRouter} from 'react-router-dom';
import {withCookies, Cookies} from 'react-cookie';
import {API_URL} from '../Config';
import {handleResponse} from '../Helper';
import {checkCookie} from '../CheckCookie';
//import the bootstrap components
import {Button, Grid, Row, Col} from 'react-bootstrap';

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
            error: null,
            //the actual objects, so that they can 
            //be passed to other components
            dataObjects: [],
            loading: false
        };
    }
    
    componentWillMount() {
        const {history, cookies} = this.props;

        if(!cookies.get('token')) {
            history.push('/');
        }
    }

    //when the component is mounted
    componentDidMount() {
        const {expenses, incomes, balance, dataObjects, loading} = this.state;
        const {cookies, history} = this.props;

        this.setState({loading: true});
        //get the balances
        fetch(`${API_URL}/finances/balance`,
        {method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type':'application/json',
            'Authorization': 'jwt ' + cookies.get('token')
        }
        })
        .then(handleResponse)
        .then((result) => {
            if(result.success === false) {
                history.push('/');
            }

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
            //console.log(result);
            this.setState({expenses: exp, incomes:inc, balance: bal, dataObjects: result, loading: false});
            
        })
        .catch((error) => {
            console.log(error);
            //no headers were added so push back home
            history.push('/');
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
        const {expenses, incomes, balance, error, loading} = this.state;

        //when I have error handling
        if(error) {
            return (
                <div className="error">{error}</div>
            );
        }

        if(loading) {
            return <Loading />;
        }

        return(
            <Grid >
                <Row className='show-grid'>
                    <Col xl={12} className="balance">
                        <p className={balance > 0 ? 'positive' : 'negative'}>${Math.abs(balance)}</p>
                    </Col>
                </Row>
                <Row className="show-grid mid-row">
                    <Col xs={12}></Col>
                </Row>
                <Row className="show-grid">
                    <Col xs={6}>
                    <button 
                        className='btn-success'
                        onClick={() => this.changeBalance(100)}
                        >$100</button>
                    </Col>
                    <Col xs={6}>
                    <button
                        className='btn-danger'
                        onClick={() => this.changeBalance(-100)}>$100</button>
                   </Col>                  
                </Row>
                <Row className="show-grid">
                    <Col xs={6}>
                    <button 
                        className='btn-success'
                        onClick={() => this.changeBalance(10)}
                        >$10</button>
                    </Col>
                    <Col xs={6}>
                    <button 
                        className='btn-danger'
                        onClick={() => this.changeBalance(-10)}
                        >$10</button>
                    </Col>
                </Row>
                <Row className="show-grid">
                    <Col xs={6}>
                    <button 
                        className='btn-success'
                        onClick={() => this.changeBalance(1)}
                        >$1</button>
                    </Col>
                    <Col xs={6}>
                    <button 
                        className='btn-danger'
                        onClick={() => this.changeBalance(-1)}
                        >$1</button>
                    </Col>
                </Row>
                
                
            </Grid>
        );


    }
}

export default withRouter(withCookies(Finances));