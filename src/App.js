import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
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
      <Router>
      <div className="App container-fluid" >
        <div className="row">
          <div className="col-md-4">
            <Flights flights={this.state.flights}/>
          </div>
          <div className="col-md-8">
            <Route exact={true} path="/" render={ () => (
              <h3>Flight Detail</h3>
            )}/>
            <Route path="/f/:flightId" component={Flight}/>
          </div>
        </div>
      </div>
    </Router>
    );
  }
}

class Flights extends Component {
  render() {
    return (
      <div>
        {this.props.flights.length > 0 &&
          <h3>{this.props.flights.length} flights</h3>
        }
        {this.props.flights.length === 0 &&
          <h3>Loading...</h3>
        }
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
        <Link to={`/f/${this.props.flight.id}`}>
        {this.props.flight.flight_number} {this.props.flight.city} ({this.props.flight.direction})
      </Link>
    </div>

    );
  }

}

class Flight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flight: [],
      loading: true
    };
  }

  componentDidMount() {
    this.componentWillReceiveProps();
  }

  componentWillReceiveProps() {
    this.setState({ loading: true });
    fetch('https://jakubm.com/flights/' + this.props.match.params.flightId + '.json')
      .then(res => res.json())
      .then(flight => {
        this.setState({
          flight: flight,
          loading: false
        })
      });
  }

  render() {
    return (
      <div>
        <div>
          {this.state.loading &&
            <div>Loading...</div>
          }
          {!this.state.loading &&
            <div>
            <div>{this.props.match.params.flightId}</div>
            <div>{this.state.flight.flight_events.length}</div>
            <Link to="/">Home</Link>
          </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
