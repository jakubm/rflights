import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flights: [
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
        <Flights flights={this.state.flights}/>
      </div>
    );
  }
}

class Flights extends Component {
  render() {
    return (
      <div>
        <h3>{this.props.flights.length} flights</h3>
        <ul>
          {this.props.flights.map(flight => (
            <FlightHeader key={flight.id} flight={flight}/>
        ))}
      </ul>
    </div>
    );
  }
}

class FlightHeader extends Component {
  render() {
    return (
      <div>
        {this.props.flight.flight_number} {this.props.flight.city} ({this.props.flight.direction})
    </div>

    );
  }

}

export default App;
