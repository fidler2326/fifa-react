import ReactDOM from 'react-dom';
import React from 'react';
import './App.css';
import $ from 'jquery';

var LocalStorageMixin = require('react-localstorage');

var Team = React.createClass({
  render: function(team) {
    console.log("Here", this.props.team);
    return (
      <div className="half">
        <p>{this.props.team.name}</p><br />
        <p>{this.props.team.league}, {this.props.team.country}</p><br />
        <p>{this.props.team.stars}</p>
      </div>
    );
  }
});

var ListItem = React.createClass({
  getInitialState: function() {
    return {
      clicked: false
    }
  },
  addTeam: function(team){
    console.log("Clicked Team:", team);
    // Push team to the my teams array
    this.props.myTeams.push(team);
    console.log("My Teams", this.props.myTeams);
  },
  handleClick: function() {
    if(this.state.clicked != true) {
      this.setState({clicked: true});
    } else {
      this.setState({clicked: false});
    }
  },
  render: function(){
    var className = this.state.clicked ? 'active' : '';
    return (
    <div>
      <ul>
        <li onClick={this.handleClick}>
          {this.props.team.leagueTitle}
          <ul className={"sub-menu " + className}>
            <li onClick={this.handleClick}>Back</li>
            {this.createItems(this.props.team.teams)}
          </ul>
        </li>
      </ul>
    </div>
    )
  },
  createItems: function(team){
    if (team != null) {
      var output = [];
      for(var i = 0; i < team.length; i++) output.push(<li key={i}><input type="checkbox" id={this.props.team.leagueCode + '-' + i} /><label htmlFor={this.props.team.leagueCode + '-' + i} onClick={this.addTeam.bind(this, team[i])}>{team[i].name}</label></li>);
      return output;
    }
  }
});

var TeamsButton = React.createClass({
  mixins: [LocalStorageMixin],
  getInitialState: function() {
    return {
      // NOTE: For some reason if the array is empty I cant push anything to it
      teams: [ {} ],
      myTeams: [],
      clicked: false
    }
  },
  componentDidMount: function() {
    $.ajax({
      url: 'teams.json',
      dataType: 'json',
      cache: false,
      success: function(data) {
        // Empty array first
        // NOTE: This is to remove the first object in the array that is set initially
        this.state.teams=[];
        // NOTE: Need to define i outside of the for loop (not sure why this is)
        var i = 0;
        // Loop through each team and push to array
        for (i = 0; i < data.length; i++) {
          this.state.teams.push(data[i]);
          this.forceUpdate();
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }
    });
  },
  handleClick: function() {
    if(this.state.clicked != true) {
      this.setState({clicked: true});
    } else {
      this.setState({clicked: false});
    }
  },
  getTeams: function(){
    var home = Math.floor((Math.random() * this.state.myTeams.length));
    var away = Math.floor((Math.random() * this.state.myTeams.length));
    console.log("My teams:", this.state.myTeams);
    console.log("Home number:", home);
    console.log("Away number:", away);
    ReactDOM.render(
    	<Team team={this.state.myTeams[home]} />, document.getElementById("home")
    );
    ReactDOM.render(
    	<Team team={this.state.myTeams[away]} />, document.getElementById("away")
    );
  },
  render: function() {
    var className = this.state.clicked ? 'active' : '';
    return (
      <div>
        <a href="#" className={"menu-trigger " + className} onClick={this.handleClick}>Menu</a>
        <ul className={"menu " + className} >
          {this.state.teams.map(function(team, i){
            return <ListItem key={i} team={team} myTeams={this.state.myTeams} ref={'team' + i} />
          }, this)}
        </ul>
        <a href="#" className="btn" onClick={this.getTeams}>Get Teams</a>
      </div>
    );
  }
});

ReactDOM.render(
	<TeamsButton />, document.getElementById("button")
);
