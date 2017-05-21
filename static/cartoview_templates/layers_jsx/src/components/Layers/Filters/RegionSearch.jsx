import React from 'react'
import {findDOMNode} from 'react-dom'

import {Row, ListGroup, ListGroupItem} from 'reactstrap'
import {Collapse} from 'react-collapse'
import string from 'string'


export default class RegionSearch extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      apiURL: this.props.apiURL,

      regions: {},
      countries: [],

      CollapseOpen: true,
      ulDisplayed: false,

      regionSearchInputValue: "",
      activeSelection: -1,
    };
  }


  componentDidMount(){
    this.getData();
  }


  componentWillReceiveProps(nextProps){
    if (nextProps.clearClicked) this.setState({
      CollapseOpen: true,
      ulDisplayed:false,
      regionSearchInputValue:"",
      activeSelection:-1
    })
  }


  escapeRegexCharacters(str) {
    // hacked from react-autosuggest
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }


  countries(country){
    let countries = []

    const escapedValue = this.escapeRegexCharacters(country.trim().toLowerCase());

    if (escapedValue === "") countries = []
    else{
        const regex = new RegExp('^' + escapedValue, 'i');

        //   return this.languages().filter(language => regex.test(language.name));

        countries = (
        this.state.regions
        ? this.state.regions.objects
        .filter((region)=>{
          // filter items have userinput value
          return string(region.name.toLowerCase()).include(escapedValue)
        })
        .map((region)=>{
          // return name of region object
          return region.name
        })
        : [] // loading indicator
      )
    }

    this.setState({countries:countries})
  }


  getData(){
    // fetch data from api, convert it into json object
    fetch(this.state.apiURL, { credentials: 'include'})
      .then(res=>res.json())
      .then(data=>this.setState({regions: data}))
  }


  regionsLi(){
    const styles = {
        normal:{
        border: "none",

      },hover:{
        border: "none",
        backgroundColor: "#F9F9F9",

      }
    }

    return (
      this.state.countries.map((country, i)=>{
        return (
          <ListGroupItem
            key={i}
            style={this.state.activeSelection===i?styles.hover:styles.normal}
            onMouseDown = {(e)=>{this.onMouseDown(e, i)}}
            onMouseOver={()=>{this.setState({activeSelection:i})}}
            onMouseLeave={()=>{this.setState({activeSelection:-1})}}>
            {country}
          </ListGroupItem>)
      })
    )
  }


  searchResults(){
    const styles = {
      list :  {
        display:this.state.ulDisplayed?"block":"none",
        border:"2px solid #d9d9d9",
        maxHeight: "200px",
        overflowY: "scroll"
      },
      empty : {
        display:this.state.ulDisplayed?"block":"none",
        border:"none",
        maxHeight: "200px",
        overflowY: "scroll",
        color: "slategray",
        fontStyle: "italic",
        fontSize: "medium",
      }
    }

    if(this.state.countries.length){
      return (this.state.ulDisplayed && (
      <ul
          ref='searchResults'
          className="list-group"
          id="regions" style={styles.list}>
          {this.regionsLi()}
        </ul>
      ))
    }else{
      return(
        <ul className="list-group">
          <ListGroupItem style={styles.empty}>No Results Found!</ListGroupItem>
        </ul>
      )
    }
  }


  onChange(e){
    let searchValue = e.target.value;

    if(searchValue){
      this.setState({regionSearchInputValue: searchValue, ulDisplayed: true},
        ()=>{this.countries(searchValue);})
    }else
      this.setState({ulDisplayed: false, regionSearchInputValue: searchValue});
  }


  onMouseDown(e, i){
    let country = this.state.countries[i]
    // console.log(country);
    this.props.onChange(country);
    this.setState({regionSearchInputValue: country}, ()=>{console.log(this.state.regionSearchInputValue);})
  }


  onClear(){
    this.setState(
      {
        regionSearchInputValue: "",
        ulDisplayed: false,
        countries: [],
        activeSelection: -1
      },() => {
        // invoke the parent handler
        // getData() at the LayersLayout
        this.props.onChange(this.state.regionSearchInputValue)
      })
  }


  onKeyDown(e){
    let ulContainer = findDOMNode(this.refs.searchResults);

    switch (e.key) {
      case "ArrowDown":
        if(this.state.activeSelection<this.state.countries.length-1){
          this.setState(
            {activeSelection:this.state.activeSelection+=1},
            ()=>{ulContainer.children[this.state.activeSelection].scrollIntoView(false)})
            // element.scrollIntoView(false) => to scroll to item
        }else{
          // reached the end reset
          this.setState({activeSelection: -1})
        }
        break;

      case "ArrowUp":
        if(this.state.activeSelection>0){
          this.setState(
            {activeSelection:this.state.activeSelection-=1},
            ()=>{ulContainer.children[this.state.activeSelection].scrollIntoView(false)})
        }else{
          // reached the end reset
          this.setState({activeSelection: -1})
        }
        break;

      case "Enter":
        let country = this.state.countries[this.state.activeSelection]
        let regionSearchInputValue = country

        if(!country) return false

        let state = {
          regionSearchInputValue: country,
          activeSelection: -1,
          ulDisplayed: false,
        }

        this.setState(state, ()=>{
          // invoke the parent handler
          this.props.onChange(regionSearchInputValue);
        })
        break;
      }
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
              value={this.state.regionSearchInputValue}
              type="search"
              className="form-control"
              onChange={(e)=>{this.onChange(e)}}
              placeholder="Search By Region"
              onBlur = {()=>{this.setState({ulDisplayed: false})}}
              onKeyDown={this.onKeyDown.bind(this)}
              />
            <span className="fa fa-times fa-1x"
              onClick={(e)=>{this.onClear()}}></span>
         </div>
         {this.searchResults()}
        </Collapse>
      </div>
    );
  }
}
