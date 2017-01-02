import ReactDOM from 'react-dom';
import React from 'react';
import './App.css';
import $ from 'jquery';

var Team = React.createClass({
  render: function(team) {
    console.log("Here", this.props.team);
    var starClass;
    switch(this.props.team.stars) {
      case '1.0':
        starClass = 'one';
        break;
      case '1.5':
        starClass = 'oneHalf';
        break;
      case '2.0':
        starClass = 'two';
        break;
      case '2.5':
        starClass = 'twoHalf';
        break;
      case '3.0':
        starClass = 'three';
        break;
      case '3.5':
        starClass = 'threeHalf';
        break;
      case '4.0':
        starClass = 'four';
        break;
      case '4.5':
        starClass = 'fourHalf';
        break;
      case '4.5':
        starClass = 'five';
        break;
    }
    return (
      <div className="half">
        <p>{this.props.team.name}</p><br />
        <p>{this.props.team.league}, {this.props.team.country}</p><br />
        <p className={starClass}>{this.props.team.stars}</p>
      </div>
    );
  }
});

var ListItem = React.createClass({
  getInitialState: function() {
    return {
      clicked: false,
      myTeams: [],
    }
  },
  addTeam: function(team, event){

    // Save checkbox state
    var j, checkboxes = document.querySelectorAll('input[type=checkbox]');
    // NOTE: Shouldn't need the delay here
    // TODO: Work out how to remove this delay function
    setTimeout(function() {
      for (j = 0; j < checkboxes.length; j++) {
        localStorage.setItem(checkboxes[j].value, checkboxes[j].checked);
        console.log(checkboxes[j].checked)
      }
    }, 100);

    console.log("Clicked Team:", team);
    // Push team to the my teams array
    this.state.myTeams.push(team);
    console.log("My Teams", this.state.myTeams);

    // localStorage.clear('myTeams');
    localStorage.setItem('myTeams', JSON.stringify(this.state.myTeams));
  },
  handleClick: function() {
    // NOTE: Must be a better way to do this
    if(this.state.clicked !== true) {
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
      for(var i = 0; i < team.length; i++) output.push(<li key={i}><input type="checkbox" id={this.props.team.leagueCode + '-' + i} value={this.props.team.leagueCode + '-' + i} /><label htmlFor={this.props.team.leagueCode + '-' + i} onClick={this.addTeam.bind(this, team[i], i)}>{team[i].name}</label></li>);
      return output;
    }
  }
});

var GetTeams = React.createClass({
  getTeams: function(){
    var myTeamsObject = localStorage.getItem('myTeams');
    var myTeams = JSON.parse(myTeamsObject);

    var home = Math.floor((Math.random() * myTeams.length));
    var away = Math.floor((Math.random() * myTeams.length));
    console.log("My teams:", myTeams);
    console.log("Home number:", home);
    console.log("Away number:", away);
    ReactDOM.render(
    	<Team team={myTeams[home]} />, document.getElementById("home")
    );
    ReactDOM.render(
    	<Team team={myTeams[away]} />, document.getElementById("away")
    );
  },
  render: function() {
    return (
      <div>
        <a href="#" className="btn" onClick={this.getTeams}>Get Teams</a>
      </div>
    )
  }
});

var Menu = React.createClass({
  getInitialState: function() {
    return {
      // NOTE: For some reason if the array is empty I cant push anything to it
      teams: [ {} ],
      // myTeams: [],
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
        this.setState({teams: []});
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
    if(this.state.clicked !== true) {
      this.setState({clicked: true});
    } else {
      this.setState({clicked: false});
    }
    // Set checkbox vaules NOTE: Not sure if this is the best place to do this look into it later.
    var j, checkboxes = document.querySelectorAll('input[type=checkbox]');
    for (j = 0; j < checkboxes.length; j++) {
      checkboxes[j].checked = localStorage.getItem(checkboxes[j].value) === 'true' ? true:false;
    }
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
        <div className="line"></div>
      </div>
    );
  }
});

ReactDOM.render(
	<Menu />, document.getElementById("button")
);

ReactDOM.render(
	<GetTeams />, document.getElementById("getTeams")
);
