var imgLocation = function(parent,item_sel){
	var $parent = $(parent);
	var item_list = $parent.find(item_sel);  
	var main_width = $parent.parent()[0].offsetWidth;  
	var item_width = item_list[0].offsetWidth;  
	var cols = Math.floor( main_width / item_width );
	$parent.css('width', cols*item_width + 'px');
	
	var height_arr = [];
	item_list.each(function(index,item){
		if(index<cols){
			this.style.position='relative';
			height_arr.push(  item.offsetHeight  );
		}else{
			var min_height = Math.min.apply(null,height_arr);
			var min_index = height_arr.indexOf(min_height); 
			var x = 0;
			$(this).css({	position:'absolute',
							top:(min_height+1) + 'px',
							left:item_list[min_index].offsetLeft + 'px'});
			height_arr[min_index] += item.offsetHeight;

		}
	});
	var max_height =  Math.max.apply(this,height_arr);
	$parent[0].style.height = max_height+'px';
}
function checkFlag(parent,item_sel){
	var $parent = $(parent);
	var $list = $parent.find(item_sel);
	if(!$list.length) return true;
	
	var last_item_top = $list[$list.length-1].offsetTop;
	var client_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	var scroll_top = document.documentElement.scrollTop || document.body.scrollTop;
	return scroll_top+client_height >= last_item_top
}


function getData(parent,item_sel){
	if(checkFlag(parent,item_sel)){
		var $parent = $(parent);
		var data_count = 16,  loaded = 0;
		for(var i=0;i<data_count;i++){
			var r = parseInt(Math.random()*97);
			var img_url = 'images/'+r+'.jpg';
			var temp_img = new Image();
			(function(new_url){
				temp_img.onload = function(){ 
					loaded++;
//					console.log(this);
					var img = $('<img>');
					img.attr('src',new_url);  
					
					var img_box = $('<div></div>');
					img_box.addClass('box_img');
					
					var box = $('<div></div>');
					box.addClass('box');
					
					img_box.append(img);   
					box.append(img_box);   
					$parent.append(box);
					
					if(data_count == loaded){
						imgLocation(parent,item_sel);
						var $list = $parent.find(item_sel); 
						var client_height = window.innerHeight;
						var $item = $list[$list.length-1];
						if($item.offsetTop + $item.offsetHeight <= client_height){
							getData(parent,item_sel)
						}
					}
				}
			})(img_url);
			
			temp_img.src = img_url;
		}
	}
}

window.onscroll = function(){ getData('#container','.box')	}

window.onload = function(){ 

	getData('#container','.box');	
	
}

















