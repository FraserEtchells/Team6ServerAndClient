import React, { Component } from 'react';
import {BrowserRouter} from 'react-router-dom'
import Layout from './Containers/layout';

class App extends Component{
  render(){
  return (
    <React.Fragment>
      <BrowserRouter>
        <Layout/>
      </BrowserRouter>
    </React.Fragment>
    
  );
}
}

export default App;


