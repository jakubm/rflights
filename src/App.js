import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import Flights from './flights'
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
    fetch('http://prg-aero.com/home/index.json')
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
          <div className="col-md-3">
            <div className="flights">
              <FlightsList flights={this.state.flights}/>
            </div>
          </div>
          <div className="col-md-9">
            <Route exact={true} path="/" component={Flights}/>
            <Route path="/f/:flightId" component={Flight}/>
          </div>
        </div>
      </div>
    </Router>
    );
  }
}

class FlightsList extends Component {
  render() {
    return (
      <div>
        <h3><Link to="/">Home</Link></h3>
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
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loading: true });
    fetch('http://prg-aero.com/flights/' + nextProps.match.params.flightId + '.json')
      .then(res => res.json())
      .then(flight => {
        this.setState({
          flight: flight,
          loading: false
        })
      });
  }
  formatDate(d) {
    return d.substring(8,10) + '.' + d.substring(5,7) + '. ' + d.substring(11, 16);
  }

  shortenTerminal(t) {
    if (t.indexOf(" ") !== -1) {
        return t.split(" ")[1];
    } else {
        return t;
    }
  }

  standardizeFlightNumber(f) {
    const items = f.split(" ");
    if (items.length < 2)
        return f;
    else
        return items[0] + " " + parseInt(items[1], 10);
  }

  render() {
    const flight = this.state.flight;
    return (
      <div>
        <div>
          {this.state.loading &&
            <div>Loading...</div>
          }
          {!this.state.loading &&
            <div>
              <h3>{this.standardizeFlightNumber(flight.flight_number)} - {flight.city} ({flight.direction})
              {flight.direction ==='d' &&
                <span> {flight.gate}</span>
                }
              </h3>
              <h4>{flight.airline}</h4>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>Scheduled</th>
                    <th>City</th>
                    <th>T.</th>
                    <th>Plane</th>
                    <th>Gate</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {flight.flight_events.map(event => (
                    <tr key={event.id}>
                      <td>{this.formatDate(event.scheduled)}</td>
                      <td>{event.city}</td>
                      <td>{this.shortenTerminal(event.terminal)}</td>
                      <td>{event.plane}</td>
                      <td>{event.gate}</td>
                      <td>{event.status}</td>
                      <td>{this.formatDate(event.ts)}</td>
                    </tr>
                ))}
                </tbody>
              </table>

              {flight.similar_flights.length > 0 &&
              <div><h4>Similar Flights</h4>
              <table className='table table-striped'>
                <thead>
                <tr>
                  <th>Dir.</th>
                  <th>Flight</th>
                  <th>Scheduled</th>
                  <th>City</th>
                  <th>Airline</th>
                  <th>T.</th>
                  <th>Plane</th>
                  <th>Gate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {flight.similar_flights.map(f => (
                  <tr key={f.id}>
                    <td>{f.direction}</td>
                    <td><Link to={`/f/${f.id}`}>{this.standardizeFlightNumber(f.flight_number)}</Link></td>
                    <td>{this.formatDate(f.scheduled)}</td>
                    <td>{f.city}</td>
                    <td>{f.airline}</td>
                    <td>{this.shortenTerminal(f.terminal)}</td>
                    <td>{f.plane}</td>
                    <td>{f.gate}</td>
                    <td>{f.last_status}</td>
                  </tr>
              ))}
              </tbody>
            </table></div>}

              <h4>Last Flights</h4>
              <table className='table table-striped'>
                <thead>
                <tr>
                  <th>Flight</th>
                  <th>Scheduled</th>
                  <th>City</th>
                  <th>T.</th>
                  <th>Plane</th>
                  <th>Gate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {flight.last_flights.map(f => (
                  <tr key={f.id}>
                    <td><Link to={`/f/${f.id}`}>{this.standardizeFlightNumber(f.flight_number)}</Link></td>
                    <td>{this.formatDate(f.scheduled)}</td>
                    <td>{f.city}</td>
                    <td>{this.shortenTerminal(f.terminal)}</td>
                    <td>{f.plane}</td>
                    <td>{f.gate}</td>
                    <td>{f.last_status}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
