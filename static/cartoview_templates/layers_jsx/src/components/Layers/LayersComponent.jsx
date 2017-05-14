import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// ohter than react Libraries
import {Container, Row, Col, Button} from 'reactstrap';
import $ from 'jquery';


// Main Elements:
import Layers from "./Layers.jsx";

// Navigations
import Paging from './Navigations/Paging.jsx';
import Sorting from './Navigations/Sorting.jsx';
import Ordering from './Navigations/Ordering.jsx';

// Filters
import Search from './Filters/Search.jsx';
import ListFilter from './Filters/ListFilter.jsx';
import MapExtent from './Filters/MapExtent.jsx';
import DateFilter from './Filters/DateFilter.jsx';


// export default to import the component in anther component
export default class LayersComponent extends React.Component{

  // React Component special methods
  constructor(props){
    super(props);
    // declaring state inside the constructor method as an object

    // construct a constant URL
    const apiURL = new URL("http://localhost:8000/api/layers/");
    const keywordsURL = new URL("http://localhost:8000/api/keywords");
    const categoriesURL = new URL("http://localhost:8000/api/categories/");
    const ownersURL = new URL("http://localhost:8000/api/owners/");

    this.state = {
      // JSONs / API Resources
      layers_JSON: {},

      apiURL: apiURL,
      keywordsURL:keywordsURL,
      ownersURL:ownersURL,
      categoriesURL:categoriesURL,

      total_count: 0,
      PagesCount: 0,
      limit: 5,

      // url searchParams
      searchParams: {},

      // Pagination
      prev: null,
      next: null,
      currentPage: 1,

      // Search Boxes
      searchInputValue: "",

      // ascending & descending Buttons
      ascending: false,
      descending: false,

      // Ordering Dropdown Menu
      activeTab: 0,
      orderingButton: false,

      // Search by Extent Element
      map: null,
      extent: "",

      // Filter by keyword
      keywords:[],
      keywordsActivated: [],

      // Filter by type
      types:[],
      typesActivated: [],

      // Filter by category
      categories:[],
      categoriesActivated:[],

      // Filter by owner
      owners:[],
      ownersActivated:[],

      // filter Collapse state
      CollapseOpen: false,

      // clear button clicked
      clearClicked: false,
    };
  }


  componentDidMount(){
    // load layers with limit 5 layers and offset 0
    let params = {limit: 5, offset:0}
    this.setState({searchParams:params}, ()=>{
      let url = this.getUrlWithQS(this.state.apiURL, this.state.searchParams, "append")
      // update the apiURL and get data
      this.setState({apiURL: url}, ()=>{this.olMapJS();this.getData();})
    })
  }


  // Component Associative Methods
  getData () {
    // getData() fetches JSON data from RESTapi at the localhost
    // acts like getting data from the server
    fetch(this.state.apiURL, { credentials: 'include'})
      // res for response because every then() accepts res from previous promise
      // res in this case is a promise it self
      // .json() is promise method parses a string into json
      // .json() returns another promise that has another then afterward
      // data for another response instead of using res again
      // .then((res)=>{res.json().then((data)=>{console.log(data);})})
      .then((res)=>{res.json()
        .then((data)=>{
          this.setState({
          layers_JSON: data,
          prev: data.meta.previous,
          next: data.meta.next,
          PagesCount: this.PagesCount(data.meta.total_count),
          total_count: data.meta.total_count,
        });
      })})
    }


  PagesCount(number){
    var q = Math.floor(number / this.state.limit);
    var r = number % this.state.limit;

    if(r === 0 && q === 0){
      // No Layers !!!
      return 0;
    }
    else{
      if(r==0) return q;
      else return q+1;
    }
  }


  getUrlWithQS (url, params, cmd){
    // constructs a url with required parameters
    const urlObj = new URL(url);

    if (cmd === "append"){
      Object.keys(params).forEach(key => urlObj.searchParams.append(key, params[key]));
      return urlObj.toString();
    }

    if (cmd === "delete") {
      Object.keys(params).forEach(key => urlObj.searchParams.delete(key));
      return urlObj.toString();
    }
  }


  urlBuilder(url){
    let builtURL = new URL(url);
    let currentParams = builtURL.searchParams.toString();
    console.log(builtURL.href);

    return builtURL;
  }


  olMapJS(){
    // openlayers simple map example
    let map = new ol.Map({
      target: 'MapExtent',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: [0, 0],
        zoom: 1.1,
      }),
      controls: [
        // new ol.control.Zoom,
        // new ol.control.Attribution,
        // new ol.control.ZoomSlider,
      ],
    });
    this.setState({map:map})

    // on map drag event | openlayers api docs
    let pointerdrag = (evt) => {
      let map = evt.map;
      let extent = map.getView().calculateExtent(map.getSize());
      // transform extent measuring units between ESPG standards
      extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
      this.setState({extent:extent}, ()=>{this.onExtentChange()});
    }
    map.on('pointerdrag', pointerdrag)
  }


  // Handlers
  onClearClick(){
    let params = {limit: 5, offset:0}
    let url = new URL(this.getUrlWithQS("http://localhost:8000/api/layers/", params, "append"));
    this.setState(
      {
        clearClicked:true,
        apiURL:url,
        searchInputValue:"",
        activeTab:0,
        keywordsActivated:[],
        ownersActivated:[],
        categoriesActivated:[],
        currentPage:1,
        CollapseOpen: false, // not working !

        // ascending & descending Buttons
        ascending: false,
        descending: false,
      },
      ()=>{
        // reset the map position
        this.state.map.setView(new ol.View({center: [0, 0], zoom: 1.1,}));
        // get default data
        this.getData();
      }
    );
  }


  onSearchClick (){
    // delete all previous searchParams first
    let params = {"title__icontains" : ''};
    let url = new URL(this.getUrlWithQS(this.state.apiURL, params, "delete"));
    if (this.state.searchInputValue === "") {
      // load layers without search params filter
      url = this.getUrlWithQS(url, {}, "append");
      this.setState({
        apiURL: url,
        currentPage: 1,
        searchParams: params,
      },()=>this.getData())
    } else {
      // set params to the current url without previous searchParams
      params = url.searchParams;
      // push new value
      params["title__icontains"] = this.state.searchInputValue;
      // get the new url with search params
      url = this.getUrlWithQS(url, params, "append");
      this.setState({
        apiURL: url,
        currentPage: 1,
        searchParams: params,
      },()=>this.getData())
    }
  }


  onSearchChange(e){
    this.setState({searchInputValue: e.target.value})
  }


  handleNextClick(){
    // returns array of layers in HTML Bootstrap cards format
    let url = new URL(this.state.apiURL)
    if(this.state.next === null){
      // TODO: set next button to disabled
      // console.log("Nothing next");
    }else{
      this.setState({
        currentPage: this.state.currentPage+=1,
        apiURL : url.origin + this.state.next,
      }, () => this.getData());
    }
  }


  handlePreviousClick(){
    let url = new URL(this.state.apiURL)
    if(this.state.prev === null){
      // TODO: set next button to disabled
      // console.log("Nothing next");
    }else{
      this.setState({
        currentPage: this.state.currentPage-=1,
        apiURL : url.origin + this.state.prev,
      }, () => this.getData());
    }
  }


  onFilterItemClick(e, apiKey, filterValue, dataFilter, filterValues, valuesActivated, index){
    // delete all previous searchParams and their values
    let params = {};
    params[dataFilter] = ""; // appen{urlSearchParm: ''} to params
    let url = new URL(this.getUrlWithQS(this.state.apiURL, params, "delete"));

    // set clearClicked to false to reset the state of filtering
    this.setState({clearClicked:false})


    // string of keywords values to filter by
    let values_str = "";
    // array of keywords values to filter by
    let _filterValues = this.state[filterValues];
    let _valuesActivated = this.state[valuesActivated]
    let state = {}

    if(e.target.className === "list-group-item active"){
      // remove the keyword
      let i = _filterValues.indexOf(filterValue);
      _filterValues.splice(i,1);
      // convert keywords to comma separated string
      values_str=_filterValues.join();

      // build url with the params & getData
      params[dataFilter] = values_str;
      url = new URL(this.getUrlWithQS(url, params, "append"));
      state = {searchParams:params};
      // append array of filterValues as a new property
      state[filterValues] = _filterValues;
      this.setState(state, ()=>{
        // prevent empty QS i.e: "?id= " expected "id=1,2"
        // if only item checked or the last item checked
        if(params[dataFilter]===""){
          url = new URL(this.getUrlWithQS(this.state.apiURL, params, "delete"));
          this.setState({apiURL:url}, ()=>{this.getData()})
        }else this.setState({apiURL:url}, ()=>{this.getData()})
      });

      // update the activated list items
      i = _valuesActivated.indexOf(index)
      _valuesActivated.splice(i, 1)
      state[valuesActivated] = _valuesActivated;
      this.setState(state)
    }else{
      _filterValues.push(filterValue);
      values_str=_filterValues.join();

      // build url with the params
      params[dataFilter] = values_str;
      url = new URL(this.getUrlWithQS(url, params, "append"));
      state = {apiURL:url, searchParams:params};
      state[filterValues] = _filterValues;
      this.setState(state, ()=>{this.getData();});

      // update the activated list items
      _valuesActivated.push(index);
      state[valuesActivated] = _valuesActivated;
      this.setState(state)
    }
  }


  onAZClick(e){
    let params = {};
    let url = null;

    if (e.target.name === "ascending") {
      if(this.state.ascending){
        // if active set both to inactive & delete params, then load data
        params={"order_by":"title"};
        url=this.getUrlWithQS(this.state.apiURL, params, "delete")
        // setState & get data without any ordering
        this.setState(
          {ascending:false, descending: false, apiURL:url},
          ()=>{this.getData();}
        );
      }else{
        // clear the current url params
        params={"order_by":"title"};
        url=this.getUrlWithQS(this.state.apiURL, params, "delete")
        // setState by the cleared url
        this.setState(
          {apiURL:url},
          // resolve asynchronously
          ()=>{
            // build new url with ordering params
            params = {"order_by":"title"};
            url = this.getUrlWithQS(this.state.apiURL, params, "append");
            // setState and load data based on new url
            this.setState({ascending:true, descending: false, apiURL:url},
              ()=>{this.getData();}
            );
          }
        );
      }
    } else {
      if(this.state.descending){
        params={"order_by":"-title"};
        url=this.getUrlWithQS(this.state.apiURL, params, "delete")
        this.setState(
          {ascending:false, descending: false, apiURL:url},
          ()=>{this.getData();}
        );
      }else{
        // show the effect of descending order
        params={"order_by":"-title"};
        url=this.getUrlWithQS(this.state.apiURL, params, "delete")
        this.setState(
          {apiURL:url},
          ()=>{
            params = {"order_by":"-title"};
            url = this.getUrlWithQS(this.state.apiURL, params, "append");
            this.setState({ascending:false, descending: true, apiURL:url},
              ()=>{this.getData();}
            );
          }
        );
      }
    }
  }


  onOrderingClick(e, tabIndex){
    // clear all previous ordering params
    let params = {"order_by":""};
    let url = new URL(this.getUrlWithQS(this.state.apiURL, params, "delete"));

    params["order_by"] = e.target.name;

    this.setState(
      {activeTab:tabIndex, apiURL:url, searchParams:params, orderingButton:false},
      ()=>{
        url = new URL(this.getUrlWithQS(this.state.apiURL, this.state.searchParams, "append"));
        this.setState({apiURL:url}, ()=>{this.getData()})
      }
    )
  }


  onExtentChange(){
    // delete all previous url extent params
    let params = {"extent":""};
    let url = new URL(this.getUrlWithQS(this.state.apiURL, params, "delete"));

    // set the new params and load data accordingly
    params["extent"] = this.state.extent;
    this.setState(
      {apiURL:url, searchParams:params},
      ()=>{
        url = new URL(this.getUrlWithQS(this.state.apiURL, this.state.searchParams, "append"));
        this.setState({apiURL:url}, ()=>{this.getData()})
      }
    )
  }


  onDateChange(date, isStart){
    if(!date && isStart){console.log("start date cleared");}
    if(!date && !isStart){console.log('end date cleared');}
    if(date && isStart){


      console.log(date, "start date changed");
      return 0;
    }
    if(date && !isStart){console.log(date, "end date changed");}
  }

  // render the main page
  render () {
    return (
      <Container>
        <Row>
          <Col md="3" >
            <Button onClick={()=>{this.urlBuilder(this.state.apiURL)}}>Log Current URL params</Button>
            <hr/>
            <Row id="FILTERS">
              <Col md="9" >
                <h3>Filters:</h3>
              </Col>
              <Col md="3" >
                <Button
                  style={{float: "right"}}
                  onClick={()=>{this.onClearClick()}}>Clear</Button>
              </Col>
            </Row>
            <Search
              onSearchChange={(e)=>{this.onSearchChange(e)}}
              onSearchClick={()=>{this.onSearchClick()}}
              searchInputValue={this.state.searchInputValue}
              CollapseOpen = {this.state.CollapseOpen}
              />
            <hr/>


            <DateFilter
              CollapseOpen = {this.state.CollapseOpen}
              onDateChange={(date, isStart)=>{this.onDateChange(date, isStart)}}/>

            <hr/>

            <ListFilter
              CollapseOpen = {this.state.CollapseOpen}
              filterTitle = {"Keywords"}
              apiURL = {this.state.keywordsURL}
              activatedElements = {this.state.keywordsActivated}
              dataFilter = {"keywords__slug__in"}
              apiKey = {"name"}
              filterValues = {"keywords"}
              valuesActivated = {"keywordsActivated"}
              onFilterItemClick = {(e, apiKey, filterValue, dataFilter, filterValues, valuesActivated, index)=>{this.onFilterItemClick(e, apiKey, filterValue, dataFilter, filterValues, valuesActivated, index)}}
              clearClicked = {this.state.clearClicked}
              />
            <hr/>

            <ListFilter
              CollapseOpen = {this.state.CollapseOpen}
              filterTitle = {"Owners"}
              apiURL = {this.state.ownersURL}
              activatedElements = {this.state.ownersActivated}
              dataFilter = {"owner__username"}
              apiKey = {"username"}
              filterValues = {"owners"}
              valuesActivated = {"ownersActivated"}
              onFilterItemClick = {(e, apiKey, filterValue, dataFilter, filterValues, valuesActivated, index)=>{this.onFilterItemClick(e, apiKey, filterValue, dataFilter, filterValues, valuesActivated, index)}}
              clearClicked = {this.state.clearClicked}
              />
            <hr/>

            <ListFilter
              CollapseOpen = {this.state.CollapseOpen}
              filterTitle = {"Categories"}
              apiURL = {this.state.categoriesURL}
              activatedElements = {this.state.categoriesActivated}
              dataFilter = {"category__identifier__in"}
              apiKey = {"identifier"}
              filterValues = {"categories"}
              valuesActivated = {"categoriesActivated"}
              onFilterItemClick = {(e, apiKey, filterValue, dataFilter, filterValues, valuesActivated, index)=>{this.onFilterItemClick(e, apiKey, filterValue, dataFilter, filterValues, valuesActivated, index)}}
              clearClicked = {this.state.clearClicked}
              />
            <hr/>

            {/*
            <MapExtent CollapseOpen = {this.state.CollapseOpen}/>
            */}
            <hr/>
          </Col>

          <Col md="9" >
            <Row>
              <Col md="3" >
                <p>Total: {this.state.total_count}</p>
              </Col>
              <Col md="3" >
                <Sorting
                  onAZClick = {(e)=>{this.onAZClick(e)}}
                  ascending = {this.state.ascending}
                  descending = {this.state.descending}
                  />
              </Col>
              <Col md="6" >
                <Ordering activeTab={this.state.activeTab} onOrderingClick={(e,tabIndex)=>{this.onOrderingClick(e,tabIndex)}} orderingButton={this.state.orderingButton}/>
              </Col>
            </Row>

            <br></br>

            <Row>
              <Layers layersJSON={this.state.layers_JSON}/>

              <Paging
                currentPage = {this.state.currentPage}
                pagesCount = {this.state.PagesCount}
                handleNextClick = {()=>{this.handleNextClick()}}
                handlePreviousClick = {()=>{this.handlePreviousClick()}}
                />
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

ReactDOM.render(<LayersComponent />, document.getElementById('templates-form'))
