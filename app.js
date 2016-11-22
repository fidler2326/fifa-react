var Team = React.createClass({
  getInitialState: function() {
		return {
			teams: ["Team #1","Team #2","Team #3","Team #4",]
		}
	},
  render: function(i) {
    return (
      <div class="teams">
        <div class="half">

        </div>
        <div class="half">

        </div>
  		</div>
    );
  }
});

var TeamsButton = React.createClass({
	getInitialState: function() {
		return {
			count: 0,
			target: 10
		}
	},
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
