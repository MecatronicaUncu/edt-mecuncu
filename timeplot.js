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
	
	var pos;
	
	if(suffix=='H'){
		pos = 'right';
	} else {
		pos = 'bottom';
	}
	if((timejson.ti-ti) > (tt/2) ){
		if(suffix=='H'){
			pos = 'left';
		} else {
			pos = 'top';
		}
	}
	h = Math.ceil(h);
	var h1 = h*0.2;
	var h2 = h*0.4;
	w = Math.ceil(w);	
	var info = ['<div style="height: '+h1+'px">'+timejson.type.substr(0,15)+'</div>',
				'<div style="height: '+h2+'px">'+timejson.sti+' - '+timejson.stf+'</div>',
				'<div style="height: '+h1+'px">'+timejson.person.split(' ')[0].substr(0,1)+'. '+timejson.person.split(' ')[1]+'</div>',
				'<div>'+timejson.place.substr(0,15)+'</div>'].join('\n');
				
	if(ttip){
		return [	'<core-tooltip show="false"; position="'+pos+'">',
					'<div style="height: '+h+'px; width: '+w+'px;"><core-icon icon="list"></core-icon></div>',
					'<div tip>'+info+'</div>',
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

	lasttimes=JSON.parse(JSON.stringify(alltimes));
	lastconfig=JSON.parse(JSON.stringify(config));

	var divwidth;
	var divheight;

	if($('#edt').find('.edt-times-h').length != 0){
		if($('#edt').find('.edt-times-h').css('display') == 'none'){
			suffix = 'V';
			divwidth = $('#edt').find('.edt-head-wrap').width();
			divheight = $('#edt').find('.chartContainerV').height();
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
				$('#'+divs[i].id).css('height',divheight-2);
				$('#'+divs[i].id).css('border', '1px solid '+tinycolor(config.types[el.type].color).darken(50).toString());
				$('#'+divs[i].id).css('background-color', config.types[el.type].color);
				$('#'+divs[i].id).css('padding-left', '3px');
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
			times.forEach(function(el,index){
				var y = ((el.ti-start)/tt)*divheight;
				var h = ((el.tf - el.ti)/tt)*divheight;
				console.log('y '+y+' h '+h);
				divs[i] = document.createElement('div');
				document.getElementById(id).appendChild(divs[i]);
				divs[i].id = 'ttip-'+id+i;
				$('#'+divs[i].id).css('position','absolute');
				$('#'+divs[i].id).css('top', y);
				$('#'+divs[i].id).css('width', divwidth-6);
				$('#'+divs[i].id).css('height',h);
				$('#'+divs[i].id).css('border', '1px solid '+tinycolor(config.types[el.type].color).darken(50).toString());
				$('#'+divs[i].id).css('background-color', config.types[el.type].color);
				$('#'+divs[i].id).css('padding-left', '3px');
				if(h >= 70){
					$('#'+divs[i].id).append(blockHTML(el,start,tt,h,divwidth,false));
					divs[i].className += ' edt-block-info';
				} else {
					$('#'+divs[i].id).append(blockHTML(el,start,tt,h,divwidth,true));
				}	
				$('#'+divs[i].id).click(divs[i].id,togglettip);
				i++;
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
