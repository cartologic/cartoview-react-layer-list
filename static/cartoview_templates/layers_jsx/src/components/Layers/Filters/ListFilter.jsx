import React from 'react';
import PropTypes from 'prop-types';

import {Collapse, UnmountClosed} from 'react-collapse';


export default class ListFilter extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      apiURL: this.props.apiURL,
      filterJSON: {},

      CollapseOpen: this.props.CollapseOpen,

    };
  }


  componentWillReceiveProps(nextProps){
    // set CollapseOpen to false only if no element checked
    // prevent auto collapse on item check0
    if (nextProps.clearClicked){
      this.setState({CollapseOpen:nextProps.CollapseOpen})
    }
  }


  getData () {
    // fetch data from api, convert it into json object
    fetch(this.state.apiURL, { credentials: 'include'})
      .then(res=>res.json())
      .then(data=>this.setState({filterJSON: data}))
  }


  componentDidMount(){
    this.getData();
  }


  filterElements(){
    let filterElements = null;
    let filterJSON = this.state.filterJSON;
    let activatedElements = this.props.activatedElements;
    let onFilterItemClick = this.props.onFilterItemClick;
    let dataFilter = this.props.dataFilter;
    let apiKey = this.props.apiKey;
    let filterValues = this.props.filterValues;
    let valuesActivated = this.props.valuesActivated;


    if (JSON.stringify(filterJSON) === JSON.stringify({})){
      filterElements = <h4>No Key Words</h4>
      // show the loading gif instead!
    }else{
      filterElements = !filterJSON?[]:filterJSON.objects.map(
        (obj, index) => {
          // show only filters with results
          if (obj.count>0) {
            return(
              <li
                className={activatedElements.includes(index)?"list-group-item active":"list-group-item"}
                onClick={(e)=>{onFilterItemClick(e, apiKey, obj[apiKey], dataFilter, filterValues, valuesActivated, index)}}
                key={index}>
                {obj[apiKey]}{/*obj.name === obj['name']*/}
              </li>
            );
          }
        }
      )
    }
    return filterElements;
  }


  render(){
    let CollapseOpen = this.state.CollapseOpen;
    return (
      <div>
        <button className="filterCollapsableButton"
         onClick={()=>{this.setState({CollapseOpen:this.props.CollapseOpen||!this.state.CollapseOpen})}}>
            <div>
             <span
               className={!CollapseOpen?"fa fa-arrow-right fa-1x":"fa fa-arrow-down fa-1x"}
               aria-hidden="true">
             </span> {this.props.filterTitle}
             </div>
         </button>
        <Collapse isOpened={this.state.CollapseOpen}>
          <ul className="list-group">
            {this.filterElements()}
          </ul>
        </Collapse>
      </div>
    );
  }
}

ListFilter.PropTypes = {

}

ListFilter.defaultProps = {

}
