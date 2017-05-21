import React from 'react';

import {Row, Col, InputGroup, InputGroupButton} from 'reactstrap';
import {Collapse} from 'react-collapse';


export default class Search extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      CollapseOpen: true || this.props.CollapseOpen,
      searchInputValue: this.props.searchInputValue,
    };
  }


  componentWillReceiveProps(nextProps){
    this.setState({
      CollapseOpen:!nextProps.CollapseOpen,
      searchInputValue:nextProps.searchInputValue
    })
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
          <div className="btn-group" style={{width: "100%"}}>
            <input
              value={this.state.searchInputValue?this.state.searchInputValue:""}
              type="search"
              className="form-control"
              onChange={(e)=>{this.props.onSearchChange(e)}}
              placeholder="Search By Text"
              />
            <span id="clearSearchInput"
              className="fa fa-times fa-1x"
              onClick={(e)=>{this.props.onSearchChange("clear")}}></span>
         </div>
        </Collapse>
      </div>
    );
  }
}
