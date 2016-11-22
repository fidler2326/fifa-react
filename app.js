var Team = React.createClass({
  getInitialState: function() {
		return {
			teams: ["Team #1","Team #2","Team #3","Team #4",],
		}
	},
  render: function(i) {
    var teamHome = Math.floor((Math.random() * this.state.teams.length));
    var teamAway = Math.floor((Math.random() * this.state.teams.length));
    return (
      <div class="teams">
        <div class="half">
          {this.state.teams[teamHome]}
        </div>
        <div class="half">
          {this.state.teams[teamAway]}
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
