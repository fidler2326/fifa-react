import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

var LocalStorageMixin = require('react-localstorage');

class Team extends Component {
  render(team) {
    // Add and remove animation class to re trigger animations
    document.getElementById("body").className = "";
    setTimeout(function() {
      document.getElementById("body").className = "active";
    }, 100);
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
      case '5.0':
        starClass = 'five';
        break;
      default:
        starClass = '';
    }
    return (
      <div className="half">
        <p>{this.props.team.name}</p><br />
        <p>{this.props.team.league}, {this.props.team.country}</p><br />
        <p className={starClass}>{this.props.team.stars}</p>
      </div>
    );
  };
};

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
    };
  }
  addTeam(team, event){

    // Save checkbox state
    var j, checkboxes = document.querySelectorAll('input[type=checkbox]');
    // NOTE: Shouldn't need the delay here
    // TODO: Work out how to remove this delay function
    setTimeout(function() {
      for (j = 0; j < checkboxes.length; j++) {
        localStorage.setItem(checkboxes[j].value, checkboxes[j].checked);
      }
    }, 100);
    // console.log('Team:', team);

    var add = true;

    var k;
    for (k = 0; k < this.props.myTeams.length; k++) {
      if (this.props.myTeams[k] === team) {
        console.log("yes",k);
        this.props.myTeams.splice(k,1);
        // Update local storage
        localStorage.clear('myTeams');
        localStorage.setItem('myTeams', JSON.stringify(this.props.myTeams));

        // Stop team being pushed to array again
        add = false;
      }
    }

    // Push team to the my teams array
    if (add === true) {
      this.props.myTeams.push(team);

      localStorage.clear('myTeams');
      localStorage.setItem('myTeams', JSON.stringify(this.props.myTeams));
    }

    console.log(this.props.myTeams);

  }
  handleClick() {
    // NOTE: Must be a better way to do this
    if(this.state.clicked !== true) {
      this.setState({clicked: true});
    } else {
      this.setState({clicked: false});
    }
  }
  render(){
    var className = this.state.clicked ? 'active' : '';
    return (
    <div>
      <ul>
        <li onClick={this.handleClick.bind(this)}>
          {this.props.team.leagueTitle}
          <ul className={"sub-menu " + className}>
            <li className="back"><i>{this.props.team.leagueTitle}</i> <span className="close" onClick={this.handleClick.bind(this)}></span></li>
            {this.createItems(this.props.team.teams)}
          </ul>
        </li>
      </ul>
    </div>
    )
  }
  createItems(team){
    if (team != null) {
      var output = [];
      for(var i = 0; i < team.length; i++) output.push(<li key={i}><input type="checkbox" id={this.props.team.leagueCode + '-' + i} value={this.props.team.leagueCode + '-' + i} /><label htmlFor={this.props.team.leagueCode + '-' + i} onClick={this.addTeam.bind(this, team[i], i)}>{team[i].name}</label></li>);
      return output;
    }
  }
};

class GetTeams extends Component {
  getTeams(){
    var myTeamsObject = localStorage.getItem('myTeams');
    var myTeams = JSON.parse(myTeamsObject);

    var home = Math.floor((Math.random() * myTeams.length));
    var away = Math.floor((Math.random() * myTeams.length));

    ReactDOM.render(
    	<Team team={myTeams[home]} />, document.getElementById("home")
    );
    ReactDOM.render(
    	<Team team={myTeams[away]} />, document.getElementById("away")
    );
  };
  render() {
    return (
      <div>
        <a href="#" className="btn" onClick={this.getTeams}></a>
      </div>
    )
  };
};

class Menu extends Component {
  mixins: [LocalStorageMixin];
  constructor(props) {
    super(props);
    this.state = {
      // NOTE: For some reason if the array is empty I cant push anything to it
      teams: [ {} ],
      myTeams: [],
      clicked: false
    };
  };
  componentDidMount() {
    $.ajax({
      url: 'teams.json',
      dataType: 'json',
      cache: false,
      success: function(data) {
        // Empty array first
        // NOTE: This is to remove the first object in the array that is set initially
        this.setState({teams: []});
        var i = 0;
        // Loop through each team and push to array
        for (i = 0; i < data.length; i++) {
          this.state.teams.push(data[i]);
          this.forceUpdate();
        }
        // document.getElementById("loading").className = "";
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }
    });
  };
  handleClick() {
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
  };
  render() {
    var className = this.state.clicked ? 'active' : '';
    return (
      <div>
        <a href="#" className={"menu-trigger " + className} onClick={this.handleClick.bind(this)}><span></span></a>
        <ul className={"menu " + className} >
          {this.state.teams.map(function(team, i){
            return <ListItem key={i} team={team} myTeams={this.state.myTeams} ref={'team' + i} />
          }, this)}
        </ul>
        <div className="line"></div>
      </div>
    );
  };
};

ReactDOM.render(
	<Menu />,
  document.getElementById("button")
);

ReactDOM.render(
	<GetTeams />,
  document.getElementById("getTeams")
);
