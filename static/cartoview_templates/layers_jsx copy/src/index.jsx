import React from 'react';
import ReactDOM from 'react-dom'
import { Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button } from 'reactstrap'
import LayersComponent from './components/LayersComponent.jsx'


class App extends React.Component{
  render () {
    return (
      <div>
        <LayersComponent />
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('templates-form'))
