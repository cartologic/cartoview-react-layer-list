import React from 'react';
import {Row, Col, InputGroup, InputGroupButton} from 'reactstrap';

import {Collapse, UnmountClosed} from 'react-collapse';


export default class Search extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      CollapseOpen: true || this.props.CollapseOpen,
      regionSearchInputValue: this.props.regionSearchInputValue,
      regionsNames: [],
    };
  }


  componentWillReceiveProps(nextProps){
    this.setState({
      CollapseOpen:!nextProps.CollapseOpen,
      regionSearchInputValue:nextProps.regionSearchInputValue
    })
  }


  // TODO: get the list of regions names or titles
  getData(){
    
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
             </span> Region
             </div>
         </button>
         <Collapse isOpened={this.state.CollapseOpen}>
          <div className="btn-group" style={{width: "100%"}}>
            <input
              value={this.state.regionSearchInputValue?this.state.regionSearchInputValue:""}
              type="search"
              className="form-control"
              onChange={(e)=>{this.props.onRegionSearchChange(e)}}
              placeholder="Search By Region"
              />
            <span className="fa fa-times fa-1x"
              onClick={(e)=>{this.props.onRegionSearchChange("clear")}}></span>
         </div>
        </Collapse>
      </div>
    );
  }
}
