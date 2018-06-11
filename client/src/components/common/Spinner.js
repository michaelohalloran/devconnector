import React from 'react';
import {connect} from 'react-redux';
import spinner from './spinner.gif'

const Spinner = () => {
  return (
    <div>
    <img 
        src={spinner} 
        style={{width: '200px', margin: 'auto', display: 'block'}}
        alt="Loading..."
    />
    </div>
  )
}

// const mapStateToProps = state => ({
//     profile: state.profile
// });
// export default connect(mapStateToProps)(Spinner);
export default Spinner;