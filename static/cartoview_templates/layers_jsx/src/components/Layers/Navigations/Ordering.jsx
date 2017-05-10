import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


export default class Ordering extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }


  orderingElements(){
    const orderTypes = [
      ["-date","Most Recent"],
      ["date","Less Recent"],
      ["divider",""],
      ["title","Ascending"],
      ["-title","Descending"],
      ["divider",""],
      ["-popular_count", "Most Popular"],
    ]

    var elements = orderTypes.map((orderType, index)=>{
      if(orderType[0]==="divider") return(<DropdownItem key={index.toString()} divider />);
      else return(
        <DropdownItem key={index.toString()} name={orderType[0]}
          className={this.props.activeTab===index?"active":""}
          onClick={(e,tabIndex)=>{this.props.onOrderingClick(e,index);}}>
          {orderType[1]}
        </DropdownItem>
      );
    })

    return elements;
  }


  render() {

    return (
      <ButtonDropdown id="orderingButton" isOpen={this.state.dropdownOpen} toggle={()=>{this.toggle()}}>
        <DropdownToggle caret>
          Ordering
        </DropdownToggle>
        <DropdownMenu right>
          {this.orderingElements()}
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}
