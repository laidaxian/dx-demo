
;(function(){
	
	var lastZindex = 1;

	var Dropdown = function(element){
		$element = $(element);
		var trigger = $(  $(element).data('triggerobj') ).parent();
		var clickBtn = $('[trigger-target=#'+$element.attr('id')+']');
		this.hide = function(){
			$(element).slideUp();
			this.visible = false;
			clickBtn.removeAttr('active');
		};

		this.show = function(){
			$(element).slideDown();
			this.visible = true;
		};
		
		this.toggle = function(){
			
			if(!this.visible){
				this.show();
			}else{
				this.hide();
			}
		};
		
		var that = this;
		
		
		
		var resize = function(){
			$(element).css({
				'z-index': lastZindex+1
			});
			
		};
		
		$(window).on('resize',resize);

		resize();
	};


	$.fn.dropdown = function(api){
		
		this.each(function(){
		
			var dropdown = $(this).data('dropdown');

			if(!dropdown){
				$(this).data('dropdown', dropdown = new Dropdown(this) );
			}
			
			if(api === 'hide'){
				dropdown.hide();
			}

			if(api === 'show'){
				dropdown.show();
			}

			if(api === 'toggle'){
				dropdown.toggle();
			}


		});
	};
	jQuery(window).on('load' ,function(){	   
		$('body').on('click','[trigger-target]',function(){
			var slibingsRoleTarget,
				currentRoleTarget = $($(this).attr('trigger-target'));
			$(this).parent().siblings().each(function(){
				slibingsRoleTarget = $( $('[trigger-target]',this).attr('trigger-target') );
				slibingsRoleTarget.data('triggerobj', $(this) ).dropdown('hide');
				$('[trigger-target]',this).removeAttr('active');
				$('[trigger-target]',this).parent().removeClass('active');
			});
			
			if($(this).attr('active') === undefined ){
				$(this).attr('active','');
				$(this).parent().addClass('active');
			}else{
				
				$(this).removeAttr('active');
				$(this).parent().removeClass('active');
			}

	
			if( !currentRoleTarget.data('triggerobj') ){
				currentRoleTarget.data('triggerobj',$(this.parentNode)  )
			}
			
			currentRoleTarget.dropdown('toggle');
			

//	箭号旋转
			$('.dropdown-btn').each(function(){
				if($(this).attr('active') === undefined ){
					$('[dorotate]',this).removeClass('dorotate');
					
				}else{
					$('[dorotate]',this).addClass('dorotate');
				}
			});	
			return false;
		});
		
//页面跳转
		jQuery('[role=goto]').on('click',function(){
			var goto = $(this).data('goto');
			if( !goto ){
				$(this).data('goto', goto = new Goto(this))
			}
		});	
		
		
		
	});//
	
	var Goto = function(element){
		this.element = $(element);
		this.goto();
	}
	
	Goto.prototype = {
		goto:function(){
			window.location.href=this.element.data('url');
		}
	}
	
})(jQuery);












































