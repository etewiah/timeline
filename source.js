/*
var events = [
	{
		date: new Date(1979,11,13), 
		title: "Steve",
		email: 'steveridout@gmail.com',
		emailMD5: '03acdc2c53d705041810019322fc6a7c'
	},
	{
		date: new Date(1985,3,4), 
		title: "Ed",
		email: 'edward.tewiah@gmail.com',
		emailMD5: '216c7bf457b9545adf01c853db2d3210'
	},
	{
		date: new Date(1980,01,10), 
		title: "Chris"
	},
	{
		date: new Date(1981,3,4), 
		title: "Tom"
	},
	{
		date: new Date(1912,01,10), 
		title: "Alex"
	}
];
*/


var initEvents = [
	{
		date: new Date(1962, 10, 14).getTime(), 
		name: "Cuban missile crisis",
		title: "Cuban missile crisis",
		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Soviet-R-12-nuclear-ballistic_missile.jpg/300px-Soviet-R-12-nuclear-ballistic_missile.jpg"
	},
	{
		date: new Date(1967, 6, 1).getTime(), 
		name: "Sgt Pepper", 
		title: "Sgt. Pepper's Lonely Hearts Club Band",
		image: "http://upload.wikimedia.org/wikipedia/en/thumb/5/50/Sgt._Pepper%27s_Lonely_Hearts_Club_Band.jpg/220px-Sgt._Pepper%27s_Lonely_Hearts_Club_Band.jpg"
	},
	{
		date: new Date(1968, 4, 4).getTime(), 
		name: "Martin Luther King", 
		title: "Assassination of Martin Luther King, Jr",
		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Martin_Luther_King_Jr_NYWTS.jpg/220px-Martin_Luther_King_Jr_NYWTS.jpg"
	},
	{
		date: new Date(1968, 7, 20).getTime(), 
		name: "The Moon Landing",
		title: "The Moon Landing",
		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Apollo_11_first_step.jpg/300px-Apollo_11_first_step.jpg"
	},
	{
		date: new Date(1967, 8, 15).getTime(), 
		name: "Woodstock Festival", 
		title: "Woodstock Festival",
		image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/Woodstock_poster.jpg/250px-Woodstock_poster.jpg"
	}
];

var events = [];
var dateSortedEvents = [];

var eventsRef = new Firebase('http://klavado.firebaseio.com/timeline/60s/');

eventsRef.once('value', function(snapshot) {
  if (snapshot.val() === null) {
  	//if there is no data for this timeline on the server, populate the server with
  	//our hardcoded initEvents..
		_.each(initEvents, function (item, index) {
    	var newEventRef = eventsRef.child(item.name);
    	newEventRef.setWithPriority(item, index);
		});

  }
  else{
  	//otherwise populate our local events array from the server
		_.each(snapshot.val(), function (item, index) {
    	var new_event = item;
    	new_event.date = new Date(item.date);
    	events.push(new_event);
	});

	dateSortedEvents = events.slice(0);

	dateSortedEvents.sort(function (a, b) {
		return a.date - b.date;
	});

	setupTimeline(events);

  }
});

eventsRef.limit(10).on('child_added', function(snapshot) {

});


var shuffleEvents = function(){
	var hasCorrectItem = function (shuffled) {
		var hasCorrect = false;
		_.each(shuffled, function (item, index) {
			if (item.title === events[index].title) {
				hasCorrect = true;
			}
		});
		return hasCorrect;
	};

	var shuffledEvents = _.shuffle(events);

	// ensure that none of the events are in the correct location to start
	while (hasCorrectItem(shuffledEvents)) {
		shuffledEvents = _.shuffle(events);
	}

}

var highlightCorrect = function () {
	console.log("dropped %s", $('#sortable .title').length);

	var allCorrect = true;

	// find order
	$('#sortable .title').each(function (index) {
		var $this = $(this),
			title = $.trim($this.text());

		var newEventRef = eventsRef.child($this.data('name'));
	  newEventRef.setPriority(index);
		// tomRef.setWithPriority({name: {first: 'Tom', last: 'Jones'}}, 99999);
		// debugger;

		console.log("compare %s with %s", title, dateSortedEvents[index].title);
		if (title === dateSortedEvents[index].title) {
			$this.closest('.event').addClass('correctIndex');
		} else {
			$this.closest('.event').removeClass('correctIndex');
			allCorrect = false;
		}
	});

	if (allCorrect) {
		$('#feedback').text("Groovy!");
	} else {
		$('#feedback').text("");
	}
};

// $(document).ready( function(){
var setupTimeline = function(eventsToDisplay){

	// returns true if just one event is in the correct position


	// underscore template, not that attractive, would be better to:
	//    1. Place in separate file
	// or 2. Just use jQuery to build it instead
	var template = '<% _.each(allEvents, function(event) { %>' +
		'<li class="event" >' +
		'  <ul>' +
		'    <li class="image"><img src="<%= event.image %>" />' +
		'    </li>' +
		'    <li class="title"  data-name="<%= event.name %>" ><%= event.title %></li>' +
		'    <li class="date">' +
		'      <%= event.date.getDate() %> /' +
		'      <%= event.date.getMonth() %> /' +
		'      <%= event.date.getFullYear() %>' +
		'    </li>' + 
		'  </ul>' +
		'</li>' +
	    '<% }); %>';
	var compiled = _.template(template, {allEvents: eventsToDisplay});
	$('#sortable').html(compiled);



	var updatePriorityOnServer = function () {
		// console.log("dropped %s", $('#sortable .title').length);

		$('#sortable .title').each(function (index) {
			// var $this = $(this)

			var newEventRef = eventsRef.child($(this).data('name'));
		  newEventRef.setPriority(index);
			// tomRef.setWithPriority({name: {first: 'Tom', last: 'Jones'}}, 99999);
			// debugger;

		});

	};

  $("#sortable").sortable().bind('sortupdate', function (event, ui) {
		updatePriorityOnServer();
	});
}

eventsRef.on('child_moved', function(snapshot, prevChildName) {
	var eventName = snapshot.name(), userData = snapshot.val();
	var where = (prevChildName === null) ? 'at the beginning' : 'after ' + prevChildName;
	console.log( eventName + ' should now appear ' + where);

	var prevPriority;
	_.each(events, function (item, index) {
		if (item.title === snapshot.val().title) {
			prevPriority = index;
		}
	});

	events.splice(snapshot.getPriority(), 0, events.splice(prevPriority, 1)[0]);
	setupTimeline(events);
	highlightCorrect();

});


