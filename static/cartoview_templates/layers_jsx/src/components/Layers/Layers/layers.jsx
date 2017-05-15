import React from 'react';
import { Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button, Container, Row, Col} from 'reactstrap';


export default class Layers extends React.Component{

  layer_created_date (date_str) {
    // return date formatted APR 05 2017
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


  layers_elements () {
    // using map() to generate list of layers
    // because u can't use array[i] iterator in react
    var elements = this.props.layersJSON.objects.map((obj)=>{
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
                      <i className="fa fa-share-alt fa-1x" aria-hidden="true"></i><span className='i'> Share</span>
                    </a>
                  </div>

                  <div className='cardIcon'>
                    <a href={"/layers/geonode:"+obj.title+"#rate"}>
                      <i className="fa fa-star-half-o fa-1x" aria-hidden="true"></i><span className='i'> Rate Layer</span>
                    </a>
                  </div>

                  {/* TODO: increase number of views */}
                  <div className='cardIcon'>
                    <a href={"/layers/geonode:"+obj.title}>
                      <i className="fa fa-eye fa-1x" aria-hidden="true"></i><span className='i'> #</span>
                    </a>
                  </div>

                  <div className='cardIcon'>
                    <a href={"/maps/new?layer=geonode:"+obj.title}>
                      <i className="fa fa-map-marker fa-1x" aria-hidden="true"></i><span className='i'> Create Map</span>
                    </a>
                  </div>

                  <div className='cardIcon'>
                    <a href="#">
                      <i className="fa fa-calendar fa-1x" aria-hidden="true"></i><span className='i'> {this.layer_created_date(obj.date)}</span>
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


  render(){
    if (JSON.stringify(this.props.layersJSON) === JSON.stringify({})) {
      // TODO: show loading error or waiting
      return (<div> Waiting for layers</div>);
    }else{
      // return(<div style={{width:"100%"}}>{this.layers_elements()}</div>);
      return(<div style={{width:"100%"}}>{this.layers_elements()}</div>);
    }
  }
}
