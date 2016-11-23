var Team = React.createClass({
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
  render: function(i) {
    var teamHome = Math.floor((Math.random() * this.state.teams.length));
    var teamAway = Math.floor((Math.random() * this.state.teams.length));
    return (
      <div className="teams">
        <div className="half">
          Team: {this.state.teams[teamHome].team}
          Rating: {this.state.teams[teamHome].stars}
        </div>
        <div className="half">
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
