import React, {Component} from 'react';
import './Loading.css';

class Loading extends Component {
    
    render() {
        return(
            <div className='loading-container'>
                <img className='loading' src='./loading.png' />
            </div>
        );
    }
    
}
export default Loading;