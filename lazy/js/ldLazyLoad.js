
+function($){
	'use strict';

	var INDEX = 0;
	function LdLazy(elem,options){
		this.$elem = $(elem);
//		console.log(this);
		this.options = $.extend(true, {}, LdLazy.DEFAULTS, options);
		
		this.init();
	};
	
	LdLazy.prototype.constructor = LdLazy;
	
	LdLazy.DEFAULTS = {
		original:'',
		placeholder:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC',
		effectSpeed:300,
		effect:'fadeIn'
	};
	
	LdLazy.prototype.init = function(){
		
		this.index = INDEX++;
		$(window).on('scroll.ldlazy'+this.index,$.proxy(this.update,this));
		this.update();
	};
	
	LdLazy.prototype.update = function(){
		var _this = this;
		if( this.inviewport()/* && !this.loaded*/){
			$('<img>').on('load',function(){
				_this.$elem.hide().attr('src',this.src)[_this.options.effect](_this.options.effectSpeed);
				$(this).remove();
				$(window).off('scroll.ldlazy'+_this.index);
			}).attr('src',_this.$elem.data('original'));
		}
	};
	LdLazy.prototype.inviewport = function(){
		return !this.inbottom() && !this.intop() //&& !this.inright() && !this.inleft();
	};
	
	LdLazy.prototype.inbottom = function(){
		return $(window).height() +　$(window).scrollTop()  < this.$elem.offset().top;    
	};
	
	LdLazy.prototype.intop = function(){
		return $(window).scrollTop()  >= this.$elem.offset().top + this.$elem.outerHeight();    
	};
	
	function Plugin(option) {
		
	    return this.each(function () {
	      var $this   = $(this);
	      
	      var data    = $this.data('ld.lazy');
	      
	      var options = typeof option == 'object' && option;
	
	      if (!data) $this.data('ld.lazy', (data = new LdLazy(this, options)))
	     		
	    })
	}
	
	var old = $.fn.ldLazy
	
	$.fn.ldLazy             = Plugin
	$.fn.ldLazy.Constructor = LdLazy
	
	
	  // SCROLLSPY NO CONFLICT
	  // =====================
	
	$.fn.ldLazy.noConflict = function () {
	    $.fn.ldLazy = old
	    return this
	}
	

}(jQuery);

$(window).on('load',function(){
	$('[role=pLazy]').each(function(){
		var $this = $(this);
		$this.ldLazy($this.data());
		console.log($this.data());
	});
});









