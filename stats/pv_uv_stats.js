/**
 * date yyyy-MM-dd
 */
function generateStats(date) {
	var statsUrl = 'http://dp.baidu.com/api/monk/pvuv';
	
	// 我的绩效
	var paramsList = [{
		date: date,
		pageId: 1943,
		productId: 616,
		salerRole: '销售员',
		pageName: '我的绩效'
	}, {
		date: date,
		pageId: 1942,
		productId: 616,
		salerRole: '销售主管'
	}, {
		date: date,
		pageId: 1941,
		productId: 616,
		salerRole: '城市经理'
	}, {
		date: date,
		pageId: 1946,
		productId: 616,
		salerRole: 'LKA销售员'
	}, {
		date: date,
		pageId: 1945,
		productId: 616,
		salerRole: 'LKA主管'
	}, {
		date: date,
		pageId: 1944,
		productId: 616,
		salerRole: 'LKA经理'
	}];
	
	// 绩效详情
	var detailParamsList = [{
		date: date,
		pageId: 1951,
		productId: 616,
		salerRole: '销售员'
	}, {
		date: date,
		pageId: 1950,
		productId: 616,
		salerRole: '销售主管'
	}, {
		date: date,
		pageId: 1949,
		productId: 616,
		salerRole: '销售经理'
	}, {
		date: date,
		pageId: 1954,
		productId: 616,
		salerRole: 'LKA销售员'
	}, {
		date: date,
		pageId: 1953,
		productId: 616,
		salerRole: 'LKA主管'
	}, {
		date: date,
		pageId: 1952,
		productId: 616,
		salerRole: 'LKA经理'
	}, {
		date: date,
		pageId: 1948,
		productId: 616,
		salerRole: '城市总监'
	}, {
		date: date,
		pageId: 1947,
		productId: 616,
		salerRole: '大区总监'
	}];
	
	generateReport(repeat(30, '=') + '个人绩效页面(uv/pv)' + repeat(30, '='), paramsList);
	
	generateReport(repeat(40, '=') + '绩效详情页面(uv/pv)' + repeat(40, '='), detailParamsList);
	
	function generateReport(title, paramsList) {
		$.when.apply(this, $.map(paramsList, function(params) {
			return $.get(statsUrl, params);
		})).done(function(){
			var list = $.map(arguments, function(v, i) {
				var data = v[0].data;
				return $.extend({}, paramsList[i], {
					points: (function(dates, pvs, uvs) {
						return $.map(dates, function(date, i) {
							return {
								date: date,
								pv: pvs[i],
								uv: uvs[i]
							}
						});
					})(data.categories, data.series[0].data, data.series[1].data)
				});
			});
			outputTable(list);
			outputTable1(title, list);
		});
	}
	
	function outputTable(list) {
		var sep = '\t', cache = [];
		outputLine([' 日期'].concat($.map(list, function(v) {return v.salerRole})).concat('总量'), sep, cache);
		var dates = $.map(list[0].points, function(point) {
			return point.date;
		})
		for(var i = 0, l = dates.length; i < l; i++) {
			var total = {date: dates[i], pv: 0, uv: 0};
			outputLine([dates[i]].concat($.map(list, function(data) {
				total.pv += data.points[i].pv;
				total.uv += data.points[i].uv;
				return data.points[i].uv + '/' + data.points[i].pv;
			}).concat(total.uv + '/' + total.pv)), sep, cache);
		}
		console.log(cache.join(''));
	}
	
	function outputTable1(title, list) {
		var sep = 10, cache = [title];
		outputLine1([' 日期'].concat($.map(list, function(v) {return v.salerRole})).concat('总量'), sep, cache);
		var dates = $.map(list[0].points, function(point) {
			return point.date;
		});
		var totalList = [];
		for(var i = 0, l = dates.length; i < l; i++) {
			var total = {date: dates[i], pv: 0, uv: 0};
			outputLine1([dates[i]].concat($.map(list, function(data) {
				total.pv += data.points[i].pv;
				total.uv += data.points[i].uv;
				return data.points[i].uv + '/' + data.points[i].pv;
			}).concat(total.uv + '/' + total.pv)), sep, cache);
		}
		console.log(cache.join(''));
	}
	
	function outputLine(list, sep, cache) {
		cache.push('\n');
		cache.push(list.join(sep));
	}
	
	function outputLine1(list, sep, cache) {
		for(var i = 0, l = list.length; i < l; i ++) {
			var width = calWidth(list[i]);
			if(sep < width) {
				continue;
			}
			list[i] = repeat(sep - width, ' ') + list[i];
		}
		cache.push('\n');
		cache.push(list.join(''));
	}
	
	function repeat(sep, s) {
		var a = [];
		for(var i = 0; i < sep; i++) {
			a.push(s);
		}
		return a.join('');
	}
	
	
	function calWidth(text) {
		var chars = $.map(text.split(''), function(s) {
			return s.charCodeAt(0);
		});
		var l = 0;
		$.each(chars, function(i, v) {
			l += v > 255? 2: 1;
		});
		return l;
	}
}
	
