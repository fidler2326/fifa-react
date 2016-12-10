import ReactDOM from 'react-dom';
import React from 'react';
import './App.css';
import $ from 'jquery';

var Team = React.createClass({
  render: function() {
    return (
      <div className="half">
        <p>{this.props.team.team}</p>
        <p>{this.props.team.league}, {this.props.team.country}</p>
        <p>{this.props.team.stars}</p>
      </div>
    );
  }
});

var ListItem = React.createClass({
  getInitialState: function() {
		return {
      myTeams: []
		}
	},
  addTeam: function(team){
    console.log("Clicked Team:", team);
    this.state.myTeams.push(team);
    console.log("My Teams", this.state.myTeams);
  },
  render: function(){
    return <ul>
      <li>
        {this.props.team.leagueTitle}
        <ul>{this.createItems(this.props.team.teams)}</ul>
      </li>
    </ul>;
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
  getInitialState: function() {
    return {
      // NOTE: For some reason if the array is empty I cant push anything to it
      teams: [ {} ]
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
  renderTeam: function() {
    var home = Math.floor((Math.random() * this.state.teams.length));
    var away = Math.floor((Math.random() * this.state.teams.length));
    ReactDOM.render(
    	<Team team={this.state.teams[home].teams[home]} />, document.getElementById("home")
    );
    ReactDOM.render(
    	<Team team={this.state.teams[away].teams[away]} />, document.getElementById("away")
    );
	},
  render: function() {
    return (
      <div>
        <ul className="menu">
          {this.state.teams.map(function(team, i){
            return <ListItem key={i} team={team} ref={'team' + i} />
          }, this)}
        </ul>
  			<div>
  				<a href="#" onClick={this.renderTeam} className="btn">Get Teams</a>
  			</div>
      </div>
    );
  }
});

ReactDOM.render(
	<TeamsButton />, document.getElementById("button")
);
