import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flights: [
        {}
      ]
    };
  }

  componentDidMount() {
    fetch('https://jakubm.com/home/index.json')
      .then(res => res.json())
      .then(flights => {
        this.setState({
          flights: flights.flights
        })
      });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          <Flights flights={this.state.flights}/>
        </p>
      </div>
    );
  }
}

class Flights extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <pre>
          First: {this.props.flights[0].city}
          Last: {this.props.flights[this.props.flights.length - 1].city}
        </pre>
      </div>
    );
  }
}

class FlightHeader extends Component {
  constructor(props) {
    super(props);
  }

}

export default App;
