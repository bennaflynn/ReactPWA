import {withCookies,Cookies} from 'react-cookie';
import {withRouter} from 'react-router-dom';

export const checkCookie = (props) => {
    const {cookies, history} = this.props;

    //console.log(cookies);
    //if the email cookie doesn't exist then 
    //bounce back to the log in page
    if(!cookies.get('email')) {
        console.log('Pushing');
        //history.push('/');
        return false;
    }
    return true;
}