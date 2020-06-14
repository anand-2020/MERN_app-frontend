import React, { Component } from 'react';
import Header from './components/Header/Header';
import Blog from './containers/Blog/Blog';
import {BrowserRouter} from 'react-router-dom';

class App extends Component {
 
  render() {
    return (
      <BrowserRouter>
      <div className="App">
        <div>
         <Header/>
        </div>
        <Blog />
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
