var Team = React.createClass({
  getInitialState: function() {
		return {
      teams: [
        { name: "Team #1", stars: "4" },
        { name: "Team #2", stars: "3" },
        { name: "Team #3", stars: "2" },
        { name: "Team #4", stars: "1" },
      ]
		}
	},
  render: function(i) {
    var teamHome = Math.floor((Math.random() * this.state.teams.length));
    var teamAway = Math.floor((Math.random() * this.state.teams.length));
    return (
      <div class="teams">
        <div class="half">
          Team: {this.state.teams[teamHome].name}
          Rating: {this.state.teams[teamHome].stars}
        </div>
        <div class="half">
          Team: {this.state.teams[teamAway].name}
          Rating: {this.state.teams[teamAway].stars}
        </div>
  		</div>
    );
  }
});

var TeamsButton = React.createClass({
  renderTeam: function() {
    ReactDOM.render(
    	<Team />, document.getElementById("team")
    );
	},
  render: function() {
    return (
			<div>
				<a href="#" onClick={this.renderTeam}>Get Teams</a>
			</div>
    );
  }
});

ReactDOM.render(
	<TeamsButton />, document.getElementById("container")
);
