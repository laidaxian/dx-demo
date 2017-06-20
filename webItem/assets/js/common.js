//商品列表部分
;(function(){

	var SweetForm = function(element){
		
		var formElements = jQuery('[name]',element);
		var onDone = new Function('result',jQuery(element).attr('ondone'));
		var onError = new Function('result',jQuery(element).attr('onerror'));
		var valid = function(){
			
			var _valid , _validText;
			var _return = [];

			formElements.each(function(){
				
				_valid = jQuery(this).attr(':valid');
				_onvalid = jQuery(this).attr('onvalid');
				_onok = jQuery(this).attr('onok');

				
				if(_valid){
					if( !(new RegExp(_valid)) .test(this.value)  ){
						if(_onvalid){
							( new Function( _onvalid ) ).call(this);
						}
						_return.push(1);
					}else{
						if(_onok){
							( new Function( _onok ) ).call(this);
						}
					}
				}
			
			});

			return _return.length > 0
		};


		jQuery(element).on('submit',function(){
			
			if(valid()){
				return false;
			}
			jQuery.post(jQuery(this).attr('action'),jQuery(this).serialize(),function(result){
				if(result.code == 0){
					onError.call(element,result)
				}
				if(result.code == 1){
					onDone.call(element,result)
				}
			},'json');

			return false;

		});
		
		
	};
	jQuery.fn.sweetForm = function(){
		this.each(function(){
			new SweetForm(this);
		});
	}


	var getItem = function(tpl,data){
		
		var str = tpl.replace(/\{\{([^\{\}]+)\}\}/g,"'+data.$1+'")
			.replace(/[\r\n]+/g,"';code+='");
		var code = '';
		eval("'"+str+"'")

		return code 
	};
	
	var getParams = function(data){

		var ret = {},m;
		for(var prop in data){
			if(( m = prop.match(/^params([A-Z]?\w*)/)) && m[1] ){
				ret[m[1].toLowerCase()] = data[prop]
			}
		}
		return ret
	};
	
	var SweetList = function(element){
		this.url = $(element).data('url');
		this.element = element;
		this.tpl = $( $(element).data('tpl') ).html();
		this.params = getParams( $(element).data() );
		
		this.load();
	};
	
	SweetList.prototype.load = function(url){
		this.url = url || this.url;
		$this = this;
		$.post(this.url,this.params,function(result){
			if(result.code == 0 ){
				$($this.element).html(result.data)
			}
			if(result.code == 1 ){
				
				var html = '';
				for(var i=0; i<result.data.length;i++){
					html += getItem($this.tpl,result.data[i]);
				}
				$($this.element).html(html)
			}

			
			
		},'json')
	}
	
	jQuery.fn.sweetList = function(){
		this.each(function(){
			new SweetList(this);
		});
	}
	
	

	
	var createMask = function(){
		return $('<div class="dialog-mask"></div>').appendTo('body');
	}
	var zIndex = 1000;
	var sweetDialog = function(element){
		
		this.mask = createMask();
		this.element = $(element);
		var $this = this;
		this.mask.on('click',function(){
			$this.close();
		})
	};
	
	sweetDialog.prototype = {
	
		open:function(){
			zIndex++;
			this.element.css({'transform':'scale(1,1)','z-index':zIndex+3})
			this.mask.css({'display':'block','z-index':zIndex+2})

		},
		close:function(){
		
			this.element.css({'transform':'scale(0,0)'})
			this.mask.css({'display':'none'})
		}
	}

	var Goto = function(element){
		this.element = $(element);
		this.goto();
	}
	
	Goto.prototype = {
		goto:function(){
			window.location.href=this.element.data('url');
		}
	}

	jQuery(window).on('load',function(){
		jQuery('[role=sweetform]').sweetForm();
		jQuery('[role=sweetlist]').sweetList();
		jQuery('body').on('click','[button=sweetdialog]',function(){
			var context = $($(this).attr('sweetdialog'));
			var sweetdialog = context.data('sweetdialog');
			if(!sweetdialog){
				context.data('sweetdialog',sweetdialog = new sweetDialog(context[0]))
			}
			
			sweetdialog.open();

			return false;

		});
//页面跳转
		jQuery('[role=goto]').on('click',function(){
			var goto = $(this).data('goto');
			if( !goto ){
				$(this).data('goto', goto = new Goto(this))
			}
		})
		
	})
})(window);

//导航栏下拉

;(function(){

	var lastZindex = 1;

	var Dropdown = function(element){
		$element = $(element);
		var mask = $('<div class="mask"></div>');
		var trigger = $(  $(element).data('triggerobj') ).parent();
		var clickBtn = $('[trigger-target=#'+$element.attr('id')+']');
		this.hide = function(){
			$(element).slideUp();
			mask.slideUp();
			this.visible = false;
			clickBtn.removeAttr('active');
		};

		this.show = function(){
			$(element).slideDown();
			mask.slideDown();
			this.visible = true;
		};
		
		this.toggle = function(){
			
			if(!this.visible){
				this.show();
			}else{
				this.hide();
			}
		};
		
		mask.appendTo(element.parentNode);
		
		var that = this;
		
		
		
		var resize = function(){
			$(element).css({
				'z-index': lastZindex+1
			});
			mask.css({ 
				'z-index': lastZindex,
				'height':$(window).height() - trigger.height() - trigger.offset().top
			
				}
			
			);
			
		};
		


		mask.on('click',function(){
			that.hide();
		});

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
			});
			
			if($(this).attr('active') === undefined ){
				$(this).attr('active','');
			}else{
				
				$(this).removeAttr('active');
				
			}

	
			if( !currentRoleTarget.data('triggerobj') ){
				currentRoleTarget.data('triggerobj',$(this.parentNode)  )
			}
			
			currentRoleTarget.dropdown('toggle');
			
			if($(this).attr('active') === undefined ){
				$('[dorotate]',$(this)).removeClass('dorotate');
			}else{
				$('[dorotate]',$(this)).addClass('dorotate');
				
			}
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
//返回上一次
		$('[role = toback]').on('click',function(){
			window.history.go(-1);
		})
//返回首页
		$('[role = tohome]').on('click',function(){
			window.history.go(-1);
		})

	})
})(jQuery);


//导航菜单锚点
;(function(){
	 $(".dropdown-container").mousedown(function(event){
            event.stopPropagation();
        });
	var fun = function(index){
		$('#scrollCtrl > a').eq(index).addClass('active').siblings().removeClass('active');
	};
	jQuery(window).on('load' ,function(){
		fun(0);
		var noview = $('.top').height() + $('.nav-sty').height();
		
		
		$('#scrollView').on('scroll',function(){
			
			var scrollTop = this.scrollTop;
			var isOverB = this.scrollHeight - $('#scrollView').height() === scrollTop;
			var len = $(this).children().length;
			$(this).children().each(function(){
				if($(this).offset().top-$(window).scrollTop()-noview < 0 && $(this).offset().top-$(window).scrollTop()-noview >= -($(this).height() - 1) ){
					if(isOverB){
						fun(len-1);
					}else{
						fun($(this).index());
					}
				} 
			});
		});
		$('#scrollCtrl').on('click','.mdlist',function(){
			var curindex =  $('#scrollCtrl > a').index($(this));
			$('#scrollView > div').eq(curindex).each(function(){
				$('#scrollView').scrollTop(this.offsetTop)  ;
				
			});
			fun(curindex);
			
		});
	});
	
})(window);
































