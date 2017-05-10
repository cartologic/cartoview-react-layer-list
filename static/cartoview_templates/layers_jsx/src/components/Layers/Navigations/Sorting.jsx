import React from 'react';
import {Button} from 'reactstrap';


export default class Sorting extends React.Component{
  render () {
    return(
      <div className="sorting" value={this.props.orderType}>
        <Button name="ascending"color={this.props.ascending ? "primary" : "secondary"} onClick={(e)=>{this.props.onAZClick(e)}}>A-Z</Button>{' '}

        <Button name="descending" color={this.props.descending ? "primary" : "secondary"} onClick={(e)=>{this.props.onAZClick(e)}}>Z-A</Button>
      </div>
    );
  }
}
