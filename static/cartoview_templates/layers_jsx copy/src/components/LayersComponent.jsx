import React from 'react';
// import ReactDOM from 'react-dom' // not used here
import { Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button } from 'reactstrap';

// export default to import the component in anther component
export default class LayersComponent extends React.Component{
  // using react-bootstrap
  constructor(props){
    super(props);
    // declaring state inside the constructor method as an object
    this.state = {
      layers_JSON: {},
    };
  }


  // getData() fetches JSON data from RESTapi at the localhost
  getData () {
    fetch('http://localhost:8000/api/layers/', {credentials: 'include'})
      // res for response because every then() accepts res from previous promise
      // res in this case is a promise it self
      // .json() is promise method parses a string into json
      // .json() returns another promise that has another then afterward
      // data for another response instead of using res again
      // .then((res)=>{res.json().then((data)=>{console.log(data);})})
      .then((res)=>{res.json()
        .then((data)=>{this.setState({layers_JSON:data});})})
  }


  // componentDidMount & componentWillMount react special functions
  // when component fully rendered to DOM
  componentDidMount(){
    this.getData();
  }

  // component will be rendered to DOM
  componentWillMount(){
  }


  // returns array of layers in HTML Bootstrap cards format
  layers_elements () {
    // using map() because u can't array[i] iterator in react
    var elements = this.state.layers_JSON.objects.map((obj)=>{
        return (
          <div key={obj.id.toString()}>
            <div className="card" style={{width:25+'em'}}>
              <CardImg top width="100%" src={obj.thumbnail_url} alt="Card image cap" />
              <CardBlock>
                <CardTitle>{obj.title}</CardTitle>
                <CardSubtitle>Card subtitle</CardSubtitle>
                <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                <Button>Button</Button>
              </CardBlock>
            </div>
            <br></br>
          </div>
        )
    })
    return elements;
  }


  render () {
    // layers_JSON if empty waiting or loading layers
    if (JSON.stringify(this.state.layers_JSON) === JSON.stringify({})) {
      // TODO: show loading error or waiting
      return (<div> Waiting for layers</div>);
    }
    // otherwise render layers when this.state changes
    else {
      var e = this.state.layers_JSON
      // console.log(e.objects[0].thumbnail_url); // test layers
      return (
        <div>
          {this.layers_elements()}
        </div>
      );
    }
  }


}
// already exported in the beginning of the class
// export default LayersComponent;
