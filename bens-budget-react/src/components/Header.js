import React, {Component} from 'react';
import {Link} from 'react-router-dom';

//functional imports
import {withRouter} from 'react-router-dom';
import {withCookies, Cookies} from 'react-cookie';

import {Button, ButtonToolbar} from 'react-bootstrap';

import {slide as Menu} from 'react-burger-menu';

//import styles
import './header.css';


class Header extends Component {
    constructor(props) {
        super(props);

        const {cookies, history} = props;

        this.state = {
            links: [
                {
                    id: 0,
                    path: "/finances",
                    name: "Home"
                },
                {
                    id:1,
                    path: "/newflow",
                    name: "New Flow"
                }
            ],
            showLinks: false
        }

        
    }

    showSettings(event) {
        event.preventDefault();
        console.log('Opened');
    }

    renderLinks() {
        const {showLinks, links} = this.state;
        if(!showLinks) {
            return '';
        }

        //return the link objects
        return(
            <div className='link-container'>
                {links.map(result => (
                    <div
                    key={result.id}
                    className='links'
                    >
                        <Link to={result.path}
                        onClick={() => this.setState({showLinks:false})}> {result.name} </Link>
                    </div>
                ))}
                <div className="links">
                    <button 
                    className="btn-danger"
                    onClick={() => this.logout()}
                    >Logout</button>
                </div>
            </div>
        );

    }

    showNav() {
        const {showLinks} = this.state;
        if(showLinks) {
            this.setState({showLinks: false})
        } else {
            this.setState({showLinks: true})
        }
    }

    logout() {
        this.setState({showLinks: false});
        //drop the cookie verifiying the person
        this.props.cookies.remove('email');
        //now navigate to the login page
        this.props.history.push('/');
    }

    render() {
        const {showLinks, links} = this.state;

        return(
            // <div className='topNav'>
                
            //     <Button             
            //     bsStyle="success"
            //     onClick={() => this.showNav()}>
            //     Menu
            //     </Button>

            //     {this.renderLinks()}
                
            // </div>
            <div className='topNav'>
            <Menu 
            noOverlay
            customBurgerIcon={<img src='./hamburger.png'/>}
            customCrossIcon={ <img src='./x.png' />}
            width={'75%'}
            isOpen={showLinks}
            >              
                {links.map(result => (
                    <div
                    key={result.id}
                    className=''
                    >
                        <Link to={result.path}
                        onClick={() => this.setState({
                            showLinks:false
                            })}> {result.name} </Link>
                    </div>
                ))}

                <a style={{cursor: 'pointer'}} 
                onClick={() => this.logout()}>Logout</a>             
            </Menu>
            </div>
        );
    }
}

export default withRouter(withCookies(Header));