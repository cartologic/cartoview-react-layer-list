import React from 'react';
import {Button} from 'reactstrap';

export default class ClearButton extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      cleared: this.props.cleared,
    }
  }


  componentWillReceiveProps(nextProps){
    this.setState({cleared:nextProps.cleared})
  }


  render(){
    const styles = {
      border: "none",
      color:"cornflowerblue",
      fontSize:"larger",
      float: "right",
      outline: "none",
    }

    return (
      <Button
        id="clearButton"
        className='btn btn-secondary'
        style={styles}
        onClick={()=>{this.props.onClick();}}
        disabled={this.state.cleared}
        >Clear
      </Button>
    )
  }
}
