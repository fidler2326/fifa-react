var Team = React.createClass({
  getInitialState: function() {
		return {
      teams: [ {} ]
		}
	},
  componentDidMount: function() {
    $.ajax({
      url: 'teams.json',
      dataType: 'json',
      cache: false,
      success: function(data) {
        var i = 0;
        for (i = 0; i < data.length; i++) {
          this.state.teams.push(data[i]);
          this.forceUpdate();
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      // }.bind(this)
      }
    });
  },
  render: function(i) {
    var teamHome = Math.floor((Math.random() * this.state.teams.length));
    var teamAway = Math.floor((Math.random() * this.state.teams.length));
    return (
      <div class="teams">
        <div class="half">
          Team: {this.state.teams[teamHome].team}
          Rating: {this.state.teams[teamHome].stars}
        </div>
        <div class="half">
          Team: {this.state.teams[teamAway].team}
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
