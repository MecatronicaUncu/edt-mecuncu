'use strict';

var divs = [];
var i = 0;
var lasttimes;
var lastconfig;
var suffix = 'H';

/*
 * 	Calcula la posición del elemento
 */
function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

/*
 * 	HTML para los bloques horarios
 */
var blockHTML = function(timejson,ti,tt,h,w,ttip){
	
	var pos,htip;
	
	if(suffix=='H'){
		pos = 'right';
		htip = h - 10;
	} else {
		pos = 'bottom';
		htip = 50;
	}
	if((timejson.ti-ti) > (tt/2) ){
		if(suffix=='H'){
			pos = 'left';
			htip = h - 10;
		} else {
			pos = 'top';
			htip = 50;
		}
	}
	w = Math.ceil(w);	
	var info = ['<div style="padding-left: 3px; height: 100%">',
				'<div style="height: 20%">'+timejson.type.substr(0,15)+'</div>',
				'<div style="height: 40%">'+timejson.sti+' - '+timejson.stf+'</div>',
				'<div style="height: 20%">'+timejson.person.split(' ')[0].substr(0,1)+'. '+timejson.person.split(' ')[1]+'</div>',
				'<div style="height: 20%">'+timejson.place+'</div>',
				'</div>'].join('\n');
				
	if(ttip){
		return [	'<core-tooltip show="false"; position="'+pos+'">',
					'<div style="height: '+h+'px; width: '+w+'px;"><core-icon icon="list"></core-icon></div>',
					'<div tip style="height: '+htip+'px">'+info+'</div>',
					'</core-tooltip>'].join('\n');
	} else {
		return info;
	}
};

/*
 * Cambia del formato XXhXX a número de minutos
 * 
 */
var getminutes = function(t){
	t = t.split('h');
	t = parseInt(t[0])*60 + parseInt(t[1]);
	return t;
};

/*
 * Realiza el grafico de barra horizontal
 * 
 * @param id: 		Canvas id to drown in
 * @param times: 	JSON containing time windows and description
 * 					Format:
 * @param ti: 		Initial day time
 * 					Format: XXhXX
 * @param tf: 		Final day time
 * 					Format: XXhXX
 * @return:
 * 
 */

var timeplot = function(alltimes, config){
	console.log(alltimes[0].times[0]);
	lasttimes=JSON.parse(JSON.stringify(alltimes));
	lastconfig=JSON.parse(JSON.stringify(config));

	var divwidth;
	var divheight;

	if($('#edt').find('.edt-times-h').length != 0){
		if($('#edt').find('.edt-times-h').css('display') == 'none'){
			suffix = 'V';
			divwidth = $('#edt').find('.edt-days').width();
			divheight = $('#edt').find('.chartContainerV').height();// - $('#edt').find('.edt-days > span').height();
		} else {
			suffix = 'H';
			divwidth = $('#edt').find('.chartContainer').width();
			divheight = $('#edt').find('.chartContainer').height();
		}
	}

	console.log(divwidth+'  '+divheight);

	/*	Transform times	*/	
	var start = getminutes(config.limits.start);
	var end = getminutes(config.limits.end);
	var tt = end - start;

	alltimes.forEach(function(el){
		var id = el.day+suffix;
		var times = el.times;

		/*	Transform times	*/
		times.forEach(function(el,index){
			el.sti = el.ti;
			el.stf = el.tf;
			el.ti = getminutes(el.ti);
			el.tf = getminutes(el.tf);
		});
		
		times.sort(function(a, b){
			return a.ti - b.ti;
			});
		
		if(suffix=='H'){	
			times.forEach(function(el,index){
				var x = ((el.ti-start)/tt)*divwidth;
				var w = ((el.tf - el.ti)/tt)*divwidth;
				divs[i] = document.createElement('div');
				document.getElementById(id).appendChild(divs[i]);
				divs[i].id = 'ttip-'+id+i;
				$('#'+divs[i].id).css('position','absolute');
				$('#'+divs[i].id).css('left', x);
				$('#'+divs[i].id).css('top', $('#'+id).offset().top);
				$('#'+divs[i].id).css('width', w);
				$('#'+divs[i].id).css('height',divheight);
				//$('#'+divs[i].id).css('border', '1px solid '+tinycolor(config.types[el.type].color).darken(50).toString());
				$('#'+divs[i].id).css('background-color', config.types[el.type].color);
				if(w >= 85){
					$('#'+divs[i].id).append(blockHTML(el,start,tt,divheight,w,false));
					divs[i].className += ' edt-block-info';
				} else {
					$('#'+divs[i].id).append(blockHTML(el,start,tt,divheight,w,true));
				}
				$('#'+divs[i].id).click(divs[i].id,togglettip);			
				i++;
				//TODO: new row if superposition found
			});
		} else {
			console.log('VERTICAL');
			var top = 0;
			var hcum = 0;
			times.forEach(function(el,index){
				var y = ((el.ti-start)/tt)*divheight;
				var h = ((el.tf - el.ti)/tt)*divheight;
				top = y-hcum;
				console.log('y '+y+' h '+h);
				divs[i] = document.createElement('div');
				document.getElementById(id).appendChild(divs[i]);
				divs[i].id = 'ttip-'+id+i;
				$('#'+divs[i].id).css('position','relative');
				$('#'+divs[i].id).css('top', top+'px');
				$('#'+divs[i].id).css('width', '100%');
				$('#'+divs[i].id).css('height',h+'px');
				$('#'+divs[i].id).css('border', '1px solid '+tinycolor(config.types[el.type].color).darken(50).toString());
				$('#'+divs[i].id).css('background-color', config.types[el.type].color);
				if(h >= 70){
					$('#'+divs[i].id).append(blockHTML(el,start,tt,h,divwidth,false));
					divs[i].className += ' edt-block-info';
				} else {
					$('#'+divs[i].id).append(blockHTML(el,start,tt,h,divwidth,true));
				}	
				$('#'+divs[i].id).click(divs[i].id,togglettip);
				i++;
				hcum+=h;
				//TODO: new row if superposition found
			});
		}
	});
};

var clearplot = function(){
	
	divs.forEach(function(el){
		$('#edt').find('#'+el.id).remove();
	});

}

var replot = function(){
	
	timeplot(lasttimes, lastconfig);
};

var togglettip = function(id){
	if($('#'+id.data+' > core-tooltip').prop('show') == true){
		$('#'+id.data+' > core-tooltip').prop('show',false);
	} else {
		$('#'+id.data+' > core-tooltip').prop('show',true);
	}
}
