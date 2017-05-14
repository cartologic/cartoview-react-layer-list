import React from 'react';

import {Row, Button} from 'reactstrap';
import { Calendar } from 'react-date-range';
import {Collapse, UnmountClosed} from 'react-collapse';
import moment from 'moment';

export default class DateFilter extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      CollapseOpen: this.props.CollapseOpen,
      startCollapseOpen: false,
      endCollapseOpen: false,

      startDate: '',
      endDate: '',
    }
  }


  componentDidMount(){
    // prevent lossing date input field focus
    let startDateCalendar = document.querySelector('#startDateCalendar');
    startDateCalendar.onmousedown = ()=>{return false};

    let endDateCalendar = document.querySelector('#endDateCalendar');
    endDateCalendar.onmousedown = ()=>{return false};

    let clearStartDateInput = document.querySelector('#clearStartDateInput');
    clearStartDateInput.onmousedown = ()=>{return false};

    let clearEndDateInput = document.querySelector('#clearEndDateInput');
    clearEndDateInput.onmousedown = ()=>{return false};
  }


  componentWillReceiveProps(nextProps){
    this.setState({CollapseOpen:nextProps.CollapseOpen})
  }


  onBlur(e){
    this.setState({startCollapseOpen:false, endCollapseOpen:false});
  }


  onFocus(isStart){
    isStart === 'start'
    ? this.setState({startCollapseOpen: true})
    : this.setState({endCollapseOpen: true})
  }


  formatDate (date_str) {
    // return date formatted APR-05-2017
    try {
      let date = date_str
      let   mm = date.toString().split(' ')[1];
      let   dd = date.toString().split(' ')[2];
      let yyyy = date.toString().split(' ')[3];
      return yyyy + '-' + mm + '-' + dd;
    } catch (e) {
      return "ERROR PARSING DATE"
    }
  }


  handleSelect(date, isStart){
    if(isStart)
      this.setState(
        {startDate: this.formatDate(date.toDate())},
        ()=>{this.props.onDateChange(this.state.startDate, isStart);}
      )
    else
      this.setState(
        {endDate: this.formatDate(date.toDate())},
        ()=>{this.props.onDateChange(this.state.endDate, isStart);}
      );
  }


  onClear(isStart){
    if(isStart){
      this.setState(
        {startDate:""},
        ()=>{
          this.props.onDateChange(this.state.startDate, isStart);
        }
      )
    }else{
      this.setState(
        {endDate:""},
        ()=>{
          this.props.onDateChange(this.state.endDate, isStart);
        }
      )
    }
  }


  DatePickerElement(when){
    if(when=="start"){
      return(
        <div  className="DatePickerElement">
          <label style={{marginLeft: 7 + 'px'}}> Start Date</label>
          <div className="btn-group" style={{width: "100%"}}>
            <input
              onFocus = {()=>{this.onFocus("start")}}
              onBlur = {()=>{this.onBlur()}}
              type="search" className="form-control" name="startDate"
              value= {this.state.startDate?this.state.startDate:""}/>
            <span id={"clearStartDateInput"} className="fa fa-times fa-1x"
              onClick={()=>{this.onClear(true)}}></span>
          </div>
          <Row id="startDateCalendar">
            <Collapse
              isOpened={this.state.startCollapseOpen}>
              <Calendar
                onChange={(date)=>{this.handleSelect(date, true)}}
                />
            </Collapse>
          </Row>
        </div>
      );
    }else{
      return(
        <div  className="DatePickerElement">
          <label style={{marginLeft: 7 + 'px'}}> End Date</label>
            <div className="btn-group" style={{width: "100%"}}>
              <input
                onFocus = {()=>{this.onFocus("end")}}
                onBlur = {()=>{this.onBlur()}}
                type="search" className="form-control" name="endDate"
                value= {this.state.endDate}/>
              <span id={"clearEndDateInput"} className="fa fa-times fa-1x"
                onClick={()=>{this.onClear(false)}}></span>
            </div>
          <Row id="endDateCalendar">
            <Collapse
              isOpened={this.state.endCollapseOpen}>
              <Calendar
                onChange={(date)=>{this.handleSelect(date, false)}}
                />
            </Collapse>
          </Row>
        </div>
      );
    }
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
             </span> Date
           </div>
         </button>
         <Collapse isOpened={this.state.CollapseOpen} hasNestedCollapse={true}>
           {this.DatePickerElement('start')}
           {this.DatePickerElement('end')}
         </Collapse>
      </div>
    );
  }
}
