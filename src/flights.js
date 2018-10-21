import React from 'react';
import { Link } from 'react-router-dom';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Refresh',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    handleChange() {
        this.props.onUserInput(
            this.filterCityInput.value,
            this.filterAirlineInput.value,
            this.filterFlightNumberInput.value.toUpperCase(),
            this.filterTerminalInput.value,
            this.filterGateInput.value.toUpperCase(),
            this.filterDirectionInput.value,
            this.filterStatusInput.value
        );
    }

    handleRefresh(e) {
        this.setState({
            title: "Reloading...",
        });
        this.props.onRefresh();
        e.preventDefault();
        this.setState({
            title: "Refresh",
        });
    }

    render() {
        return (
          <div>
            <form>
                <div className="row">
                  <input
                      type="text"
                      placeholder="Flight Number"
                      autoFocus="true"
                      value={this.props.filterFlightNumber}
                      ref={(input) => this.filterFlightNumberInput = input}
                      onChange={this.handleChange}
                      className="col-xs-1"
                  />&nbsp;
                    <input
                        type="text"
                        placeholder="City"
                        value={this.props.filterCity}
                        ref={(input) => this.filterCityInput = input}
                        onChange={this.handleChange}
                        className="col-xs-2"
                    />&nbsp;
                    <input
                        type="text"
                        placeholder="Airline"
                        value={this.props.filterAirline}
                        ref={(input) => this.filterAirlineInput = input}
                        onChange={this.handleChange}
                        className="col-xs-1"
                    />&nbsp;
                    <input
                        type="text"
                        placeholder="Terminal"
                        value={this.props.filterTerminal}
                        ref={(input) => this.filterTerminalInput = input}
                        onChange={this.handleChange}
                        className="col-xs-1"
                    />&nbsp;
                    <input
                        type="text"
                        placeholder="Gate"
                        value={this.props.filterGate}
                        ref={(input) => this.filterGateInput = input}
                        onChange={this.handleChange}
                        className="col-xs-1"
                    />
                    <select value={this.props.filterDirection} onChange={this.handleChange} ref={(input) => this.filterDirectionInput = input}>
                        <option value=""></option>
                        <option value="d">Dep</option>
                        <option value="a">Arr</option>
                    </select>&nbsp;
                    <select value={this.props.filterStatus} onChange={this.handleChange} ref={(input) => this.filterStatusInput = input}>
                        <option value=""></option>
                        <option value="a">Active</option>
                        <option value="f">Finished</option>
                        <option value="u">Updated</option>
                    </select>&nbsp;
                    <a href="#" onClick={this.handleRefresh}>{this.state.title}</a>
                  </div>
            </form>
          </div>
        );
    }
}

class FlightRow extends React.Component {
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
        return (
            <tr>
                <td>{this.props.flight.direction}</td>
                <td><Link to={`/f/${this.props.flight.id}`}>{this.standardizeFlightNumber(this.props.flight.flight_number)}</Link></td>
                <td>{this.formatDate(this.props.flight.scheduled)}</td>
                <td>{this.props.flight.city}</td>
                <td>{this.props.flight.airline}</td>
                <td>{this.shortenTerminal(this.props.flight.terminal)}</td>
                <td>{this.props.flight.gate}</td>
                <td>{this.props.flight.last_status}</td>
            </tr>
        );
    }
}

class FlightsTable extends React.Component {
    render() {
        let rows = [];
        let arrivalsCount = 0;
        let departuresCount = 0;
        this.props.flights.forEach((flight) => {
            let display = true;

            if (display && this.props.filterDirection.length > 0) {
                if (!flight.direction.startsWith(this.props.filterDirection)) {
                    display = false;
                }
            }

            if (display && this.props.filterStatus.length > 0) {
                if (flight.direction.startsWith("a")) {
                    if (this.props.filterStatus.startsWith("a") && flight.last_status.startsWith("Arrived")) {
                        display = false;
                    } else {
                        if (this.props.filterStatus.startsWith("f") && !flight.last_status.startsWith("Arrived")) {
                            display = false;
                        }
                    }

                } else {
                    if (this.props.filterStatus.startsWith("a") && flight.last_status.startsWith("Departed")) {
                        display = false;
                    } else {
                        if (this.props.filterStatus.startsWith("f") && !flight.last_status.startsWith("Departed")) {
                            display = false;
                        }
                    }
                }
                if (this.props.filterStatus.startsWith("u") && flight.last_status.length === 0) {
                    display = false;
                }

            }

            if (display && this.props.filterFlightNumber.length > 0) {
                if (!flight.flight_number.startsWith(this.props.filterFlightNumber)) {
                    display = false;
                }
            }
            if (display && this.props.filterCity.length > 0) {
                if (flight.city.toUpperCase().indexOf(this.props.filterCity.toUpperCase()) === -1) {
                    display = false;
                }
            }
            if (display && this.props.filterAirline.length > 0) {
                if (flight.airline.toUpperCase().indexOf(this.props.filterAirline.toUpperCase()) === -1) {
                    display = false;
                }
            }
            if (display && this.props.filterTerminal.length > 0) {
                if (flight.terminal.indexOf(this.props.filterTerminal) === -1) {
                    display = false;
                }
            }
            if (display && this.props.filterGate.length > 0) {
                if (!flight.gate.startsWith(this.props.filterGate)) {
                    display = false;
                }
            }

            if (display) {
                rows.push(<FlightRow flight={flight} key={flight.id} />);
                if (flight.direction === 'd'){
                    departuresCount += 1;
                } else {
                    arrivalsCount += 1;
                }
            }
        });
        return (
            <div>
                <div>Arrivals: {arrivalsCount}, Departures: {departuresCount}</div>
                <table className='table table-striped'>
                  <thead>
                  <tr>
                     <th>Dir.</th>
                     <th>Flight</th>
                     <th>Scheduled</th>
                     <th>City</th>
                     <th>Airline</th>
                     <th>T.</th>
                     <th>Gate</th>
                     <th>Status</th>
                  </tr>
                  </thead>
                  <tbody>{rows}</tbody>
                </table>
            </div>
        );
    }
}


class Flights extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterCity: '',
            filterAirline: '',
            filterFlightNumber: '',
            filterTerminal: '',
            filterGate: '',
            filterDirection: '',
            filterStatus: '',
            flights: [],
            loading: true
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    handleUserInput(filterCity, filterAirline, filterFlightNumber, filterTerminal, filterGate, filterDirection, filterStatus) {
        this.setState({
            filterCity: filterCity,
            filterAirline: filterAirline,
            filterFlightNumber: filterFlightNumber,
            filterTerminal: filterTerminal,
            filterGate: filterGate,
            filterDirection: filterDirection,
            filterStatus: filterStatus,
        });
    }

    getData() {
      this.setState({ loading: true });
      fetch('http://prg-aero.com/home/index.json')
        .then(res => res.json())
        .then(flights => {
          this.setState({
            flights: flights.flights,
            loading: false
          })
        });
    }

    componentDidMount() {
      this.getData();
    }

    handleRefresh() {
      this.getData();
    }

    render() {
        return (
            <div>
              <SearchBar
                  filterCity={this.state.filterCity}
                  filterAirline={this.state.filterAirline}
                  filterFlightNumber={this.state.filterFlightNumber}
                  filterTerminal={this.state.filterTerminal}
                  filterGate={this.state.filterGate}
                  filterDirection={this.state.filterDirection}
                  filterStatus={this.state.filterStatus}
                  onUserInput={this.handleUserInput}
                  onRefresh={this.handleRefresh}
              />
              <div>
                {this.state.loading &&
                  <div>Loading...</div>
                }
                {!this.state.loading &&

              <FlightsTable
                  flights={this.state.flights}
                  filterCity={this.state.filterCity}
                  filterAirline={this.state.filterAirline}
                  filterFlightNumber={this.state.filterFlightNumber}
                  filterTerminal={this.state.filterTerminal}
                  filterGate={this.state.filterGate}
                  filterDirection={this.state.filterDirection}
                  filterStatus={this.state.filterStatus}
              />
            }</div>
          </div>
        );
    }
}

export default Flights;
