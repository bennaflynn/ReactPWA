import React, {Component} from 'react';
import {Link} from 'react-router-dom';

//import styles
import './header.css';


class Header extends Component {
    constructor() {
        super();

        this.state = {
            links: [
                {
                    id: 0,
                    path: "/finances",
                    name: "Home"
                },
                {
                    id: 1,
                    path: "/",
                    name: "Logout" 
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
                    >
                        <Link to={result.path}> {result.name} </Link>
                    </div>
                ))}
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

export default Header;