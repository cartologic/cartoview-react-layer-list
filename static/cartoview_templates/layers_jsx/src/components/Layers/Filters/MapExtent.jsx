import React from 'react';
import {Collapse} from 'react-collapse';


export default class MapExtent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      CollapseOpen: this.props.CollapseOpen,
    };
  }


  componentWillReceiveProps(nextProps){
    this.setState({CollapseOpen:nextProps.CollapseOpen})
  }


  render () {
    let CollapseOpen = this.state.CollapseOpen;
    return (
      <div>
        <button className="filterCollapsableButton"
         onClick={()=>{this.setState({CollapseOpen:!this.state.CollapseOpen})}}>
            <div>
             <span
               className={!CollapseOpen?"fa fa-arrow-right fa-1x":"fa fa-arrow-down fa-1x"}
               aria-hidden="true">
             </span> Map Extent
             </div>
         </button>
        <Collapse isOpened={CollapseOpen}>
          <div id="MapExtent"></div>
        </Collapse>
      </div>
    );
  }
}
