import React, { Component } from 'react';
require('../styles.scss')
import axios from 'axios'

class App extends Component {
  constructor() {
    super()
    this.state = {

    }
  }

  fetchItems(){
    axios
    .get('http://localhost:3000/api/v1/')
  }

  render() {
    return(
    <div>
      <h1>Hello World</h1>
      <div></div>
    </div>
    )
  }
}

module.exports = App
