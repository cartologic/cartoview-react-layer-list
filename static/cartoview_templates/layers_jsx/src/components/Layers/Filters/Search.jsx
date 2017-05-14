import React from 'react';
import {Row, Col, InputGroup, InputGroupButton} from 'reactstrap';

import {Collapse, UnmountClosed} from 'react-collapse';


export default class Search extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      CollapseOpen: true || this.props.CollapseOpen,
    };
  }


  componentWillReceiveProps(nextProps){
    this.setState({CollapseOpen:!nextProps.CollapseOpen})
  }


  render(){
    let CollapseOpen = this.state.CollapseOpen;
    return(
      <div>
        <button className="filterCollapsableButton"
         onClick={()=>{this.setState({CollapseOpen:!this.state.CollapseOpen})}}>
            <div>
             <span
               className={!CollapseOpen?"fa fa-arrow-right fa-1x":"fa fa-arrow-down fa-1x"}
               aria-hidden="true">
             </span> Text
             </div>
         </button>
         <Collapse isOpened={this.state.CollapseOpen}>
          <InputGroup>
            <input value={this.props.searchInputValue} type="text" className="form-control" onChange={(e)=>{this.props.onSearchChange(e)}} placeholder="Search By Text"/>
            {/*Input first to be on the left and search on the right*/}

            {/*<Input onChange={(e)=>{this.props.onSearchChange()}}/>*/}

            {/*onSearchClick is passed as props*/}
            <InputGroupButton onClick={()=>this.props.onSearchClick()}>
              Search
            </InputGroupButton>
         </InputGroup>
        </Collapse>
      </div>
    );
  }
}
