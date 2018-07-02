import React, {Component} from 'react';
import {Link} from 'react-router-dom';

//functional imports
import {withRouter} from 'react-router-dom';
import {withCookies, Cookies} from 'react-cookie';

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
                }
            ],
            showLinks: false
        }
    }

    renderLinks() {
        const {showLinks, links} = this.state;
        if(!showLinks) {
            return '';
        }

        //return the link objects
        return(
            <div>
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
        const {showLinks} = this.state;

        return(
            <div className='topNav'>
                <button 
                className='btn-primary'
                onClick={() => this.showNav()}>
                Menu
                </button>

                {this.renderLinks()}
            </div>
        );
    }
}

export default withRouter(withCookies(Header));