var App = {
};

var Run={
    pacemetric:300,
    distunit:"km",
    distmeters:10000,
    time:3600,
    mode:"pace"
};
App.reset = function () {
  
    $("#pacePanel").hide();
    $("#distancePanel").hide();
    $("#timePanel").hide();
  
    $("#calcPanel").hide();
};
App.init= function() {
    $("#paceButton").click(
      function() {
	App.reset();

	$("#distancePanel").show();
	$("#timePanel").show();
	$("#calcPanel").show();
	Run.mode="pace";
	App.calculate();
	
      }
    );

    $("#distanceButton").click(
      function() {
	App.reset();

	$("#pacePanel").show();
	$("#timePanel").show();
	$("#calcPanel").show();
	Run.mode="distance";
	App.calculate();

      }
    );

    $("#timeButton").click(
      function() {
	App.reset();
       
	$("#distancePanel").show();
	$("#pacePanel").show();
	$("#calcPanel").show();
	Run.mode="time";
	App.calculate();

      }
    );
    
    $("#slower2").click(
	function() {
	  Run.pacemetric+=10;
	  App.calculate();
	}
    );

    $("#slower1").click(
	function() {
	  Run.pacemetric+=1;
	  App.calculate();
	}
    );

    $("#faster1").click(
	function() {
	  if (Run.pacemetric > 1) {
	     Run.pacemetric-=1;
	    App.calculate();
	  }
	}
    );

    $("#faster2").click(
	function() {
	  if (Run.pacemetric > 10) {
	     Run.pacemetric-=10;
	     App.calculate();
	  }
	}
    );
    
    $("#inputDistance").change( function() {
      var tmpVal = $( this ).val();
      if (tmpVal.match(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)) {
	Run.distmeters=Run.convertToMeter(tmpVal,Run.distunit);
	App.calculate();
      }
      
    });
			

    $("#inputTime").change( function() {
      var tmpVal = $( this ).val();
      if (tmpVal.match(/^([0-9]{0,3}:[0-9]{2}|[0-9]{1,2}):[0-9]{2}$/)) {
	Run.time=Run.convertStrToSecs(tmpVal);
	App.calculate();
      }
    });
    
    $(".distance_unit").click(function() {
	Run.distunit=$(">input",this).val();
	App.calculate();
    });
    
    $(".commondist").click(
	function() {
	  Run.distmeters=$(this).val()
	  App.calculate();
	}
    );


  
   
    this.calculate();
    
}

App.calculate = function() {
    var rdiv = $("#result");
    var distLabel = $("<label>");
    var coldiv = $("<div>");
    distLabel.appendTo(coldiv);
    Run.update();

    //make all distance unit control aware of the latest Run.distunit value
    $(".distance_unit").removeClass("active");
    $(".distance_unit>input[value="+Run.distunit+"]").parent().addClass("active");

    // update the pace
    $("#pacemetric").text(Run.convertSecsToStr(Run.convertPaceSpeed(Run.pacemetric,"minkm","minkm")));
    $("#paceimperial").text(Run.convertSecsToStr(Run.convertPaceSpeed(Run.pacemetric,"minkm","minmi")));
    $("#speedmetric").text(Run.convertPaceSpeed(Run.pacemetric,"minkm","kmh"));
    $("#speedimperial").text(Run.convertPaceSpeed(Run.pacemetric,"minkm","mph"));
    
    // update the distance
    $("#inputDistance").val(Run.meterTo(Run.distmeters,Run.distunit));
  
    // update the time
    $("#inputTime").val(Run.convertSecsToStr(Run.time));
   
    // create the result section
    rdiv.empty();
      switch (Run.mode) {
      case 'pace':
	
	coldiv.remove();
	$("#paceResult").clone().appendTo(rdiv);
	break;
      case 'distance':
	distLabel.text($("#inputDistance").val()+ " ");
	coldiv.addClass("col-xs-6  col-md-2");
	coldiv.appendTo(rdiv);
	$("#distUnitButton").clone(true).appendTo(rdiv);
	break;
      case 'time':
	distLabel.text(Run.convertSecsToStr(Run.time)+" (HH:MM:SS)");
	coldiv.addClass("col-xs-12");
	coldiv.appendTo(rdiv);
	break;
    
    }


}

Run.update=function () {
      switch (Run.mode) {
      case 'pace':
	 Run.pacemetric=Run.time * 1000 / Run.distmeters;
	break;
      case 'distance':
	 Run.distmeters = Run.time / Run.pacemetric * 1000;
	break;
      case 'time':
	  Run.time=Math.round(Run.distmeters / 1000 * Run.pacemetric);
	break;
    
    }
};

Run.pad=function(n_, l_,c_) {
				var s = '' + n_;
				c_ = typeof c_ !== 'undefined' ? c_ : '0'
				while(s.length < l_) {
					s = c_ + s;
				}
				return s;
			};

Run.intDivide= function (n_, d_) {
				var r = n_ % d_;
				var q = (n_ - r ) / d_;
				return q;
			};

Run.convertSecsToStr=function (secs_) {
				var h = Run.intDivide(secs_, 3600);
				var mm = Run.intDivide(secs_ - (h * 3600), 60);
				var ss = (secs_ - (h * 3600)) % 60;
				return h == 0 ? Run.pad(mm, 2) + ':' + Run.pad(ss, 2) : h + ':' + Run.pad(mm, 2) + ':' + Run.pad(ss, 2);
			};

Run.convertStrToSecs=	function (s_) {
				var ar = String(s_).split(":");
				if(ar.length == 3) {
					return (parseInt(ar[0]) * 60 + parseInt(ar[1])) * 60 + parseInt(ar[2]);
				} else if(ar.length == 2) {
					return (parseInt(ar[0]) * 60) + parseInt(ar[1]);
				} else if(ar.length == 1) {
					return parseInt(s_) * 60;
				}
			};

Run.convertPaceSpeed=function (s, u, ut) {
				var km = 0;
				var min = 0;
				var t = 0;
				var d = 0;
				switch (u) {
					case 'minkm':
						t = s;
						d = 1000;
						break;
					case 'minmi':
						t = s;
						d = 1609.344;
						break;
					case 'kmh':
						d = 1000 * s;
						t = 3600;
						break;
					case 'mph':
						d = 1609.344 * s;
						t = 3600;
						break;
				}
				switch (ut) {
					case 'minkm':
						km = d / 1000;
						min = t / 60;
						return Math.round((min / km) * 60);
					case 'minmi':
						km = d / 1609.344;
						min = t / 60;
						return Math.round((min / km) * 60);
					case 'kmh':
						km = d / 1000;
						h = t / 3600;
						return (km / h).toFixed(2);
					case 'mph':
						km = d / 1609.344;
						h = t / 3600;
						return (km / h).toFixed(2);
				}
				return "";

			};

Run.meterTo=function (m,ut) { 
				switch (ut) {
						case 'km':
							return (m / 1000).toFixed(2);
						case 'mile' :
							return (m / 1609.344).toFixed(2);
						case 'm' :
							return (m * 1).toFixed(0);
				}
			};
Run.convertToMeter=function (d, u) {
				var m = 0;
				switch (u) {
					case 'km':
						m = (d * 1000).toFixed(3);
						break;
					case 'm':
						m = (d * 1).toFixed(0);
						break;
					case 'mile':
						m = (d * 1609.344).toFixed(3);
						break;
				}
				return m;
			};

Run.convertDistancePaceSpeed=function (d, u, ut, t) {
				var h = Run.convertStrToSecs(t) / 3600;
				var km = Run.convertToMeter(d, u) / 1000;
				return Run.convertPaceSpeed((km / h), 'kmh', ut);
			};
			