			function pad(n_, l_,c_) {
				var s = '' + n_;
				c_ = typeof c_ !== 'undefined' ? c_ : '0'
				while(s.length < l_) {
					s = c_ + s;
				}
				return s;
			}

			function intDivide(n_, d_) {
				var r = n_ % d_;
				var q = (n_ - r ) / d_;
				return q;
			}

			function convertSecsToStr(secs_) {
				var h = intDivide(secs_, 3600);
				var mm = intDivide(secs_ - (h * 3600), 60);
				var ss = (secs_ - (h * 3600)) % 60;
				return h == 0 ? pad(mm, 2) + ':' + pad(ss, 2) : h + ':' + pad(mm, 2) + ':' + pad(ss, 2);
			}

			function convertStrToSecs(s_) {
				var ar = String(s_).split(":");
				if(ar.length == 3) {
					return (parseInt(ar[0]) * 60 + parseInt(ar[1])) * 60 + parseInt(ar[2]);
				} else if(ar.length == 2) {
					return (parseInt(ar[0]) * 60) + parseInt(ar[1]);
				} else if(ar.length == 1) {
					return parseInt(s_) * 60;
				}
			}

			function convertPaceSpeed(s, u, ut) {
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

			}

			function meterTo(m,ut) { 
				switch (ut) {
						case 'km':
							return (m / 1000).toFixed(3);
						case 'mile' :
							return (m / 1609.344).toFixed(3);
						case 'm' :
							return (m * 1).toFixed(0);
				}
			}
			function convertToMeter(d, u) {
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
			}

			function convertDistancePaceSpeed(d, u, ut, t) {
				var h = convertStrToSecs(t) / 3600;
				var km = convertToMeter(d, u) / 1000;
				return convertPaceSpeed((km / h), 'kmh', ut);
			}