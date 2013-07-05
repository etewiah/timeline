var events = [
 { date: new Date(1979,11,13), 
 	 title: "Steve"  },
 { date: new Date(1985,3,4), 
 	 title: "Ed"  },
 { date: new Date(1980,01,10), 
 	 title: "Chris"  },
 { date: new Date(1981,3,4), 
 	 title: "Tom"  },
 { date: new Date(1902,01,10), 
 	 title: "Alex"  }
];

$(document).ready( function(){
	var shuffledEvents = _.shuffle(events);
	var list = '<% _.each(shuffledEvents, function(event) { %>' +
		'<li class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' +
		'  <ul><li class="date"><%= event.date.getYear() %></li><li>' +
		'   <%= event.title %></li></ul>' +
	 '<% }); %>';
	var compiled = _.template(list, {shuffledEvents: shuffledEvents});

	$("#sortable").append(compiled);
});