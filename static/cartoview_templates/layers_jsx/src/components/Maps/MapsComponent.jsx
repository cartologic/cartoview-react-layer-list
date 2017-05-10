import React from 'react';
import ReactDOM from 'react-dom'
import { Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button, Container, Row, Col } from 'reactstrap';

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
  getData (apiUrl) {
    fetch('http://localhost:8000/api/layers', {credentials: 'include'})
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

  // return date formatted APR 05 2017
  layer_created_date (date_str) {
    try {
      let date = new Date(date_str);
      let   mm = date.toString().split(' ')[1];
      let   dd = date.toString().split(' ')[2];
      let yyyy = date.toString().split(' ')[3];
      return yyyy + ' ' + mm + ' ' + dd;
    } catch (e) {
      return "ERROR PARSING DATE"
    }
  }


  // returns array of layers in HTML Bootstrap cards format
  layers_elements () {
    // using map() because u can't array[i] iterator in react
    var elements = this.state.layers_JSON.objects.map((obj)=>{
        return (
            <div className="Layer_Card" key={obj.id.toString()}>
              <Row>
                <Col xs="3">
                <CardImg top width="100%" src={obj.thumbnail_url} alt="Card image cap" />
                </Col>

                <Col xs="9">
                  <CardBlock>
                    <CardTitle>{obj.title}</CardTitle>
                    <CardText>{obj.abstract}</CardText>
                    <hr></hr>

                    <div className='cardIcon'>
                      <a href={"/layers/geonode:"+obj.title+"#share"}>
                        <i className="fa fa-share-alt fa-2x" aria-hidden="true"></i><span className='i'> Share</span>
                      </a>
                    </div>

                    <div className='cardIcon'>
                      <a href={"/layers/geonode:"+obj.title+"#rate"}>
                        <i className="fa fa-star-half-o fa-2x" aria-hidden="true"></i><span className='i'> Rate Layer</span>
                      </a>
                    </div>

                    {/* TODO: increase number of views */}
                    <div className='cardIcon'>
                      <a href={"/layers/geonode:"+obj.title}>
                        <i className="fa fa-eye fa-2x" aria-hidden="true"></i><span className='i'> #</span>
                      </a>
                    </div>

                    <div className='cardIcon'>
                      <a href={"/maps/new?layer=geonode:"+obj.title}>
                        <i className="fa fa-map-marker fa-2x" aria-hidden="true"></i><span className='i'> Create Map</span>
                      </a>
                    </div>

                    <div className='cardIcon'>
                      <a href="#">
                        <i className="fa fa-calendar fa-2x" aria-hidden="true"></i><span className='i'> {this.layer_created_date(obj.date)}</span>
                      </a>
                    </div>
                  </CardBlock>
                </Col>
              </Row>
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
        <Container>
          {this.layers_elements()}
        </Container>
      );
    }
  }


}
// already exported in the beginning of the class
// export default LayersComponent;

ReactDOM.render(<LayersComponent />, document.getElementById('templates-form'))
