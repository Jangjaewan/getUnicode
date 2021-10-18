(function($) {
    // preivewer plugin
    function FontView(selector,index,options){
        this.$options = options;
        this.$index = index;
        this.$container = null;
        this.$viewbox = null;
        this.$controls = null;
        this.$defaultHtml = null;
        this.$defaultText = null;
        this.init(selector);
        this.controlsEvent();
    }
    FontView.prototype.init = function(selector){
        this.$container = $(selector);
        this.$viewbox = this.$container.find('.preview-viewer');
        this.$controls = this.$container.find('.preview-controller');
        this.$selectedFont = this.$controls.find('.ui-font-family');
        this.$radioList = this.$controls.find('.radioset');
        this.$defaultHtml = this.$viewbox.html();
        this.fontSet();
    }
    FontView.prototype.controlsEvent = function(){
        var _this = this;
        var radioBtn = this.$radioList.find("input:radio");
        this.$container.on("change",".ui-font-family",function(){
            _this.fontSet()
        }).on("change","input[name*='weight']",function(){
            _this.$viewbox.css("font-weight",$(this).val());
        }).on("click",".preview-viewer:not(.type-short)",function(){
            var preStyle = $(this).attr("style") || null;
            $(this).after("<textarea class='edit-previewer'></textarea>").next().attr("style",preStyle).focus().end().hide();
        }).on("focusout",".edit-previewer",function(){
            var editText = $(this).val().replace(/(?:\r\n|\r|\n)/g, '<br/>') || _this.$defaultHtml;
            $(this).prev().show().html(editText).end().remove()
        }).on("focusin",".global-text input",function(){
            _this.$defaultText = $(this).val();
            $(this).val('');
        }).on("focusout",".global-text input",function(){            
            if(!$(this).val()){
                $(this).val(_this.$defaultText)
            }else{
                _this.$viewbox.find("p span").text($(this).val())
            }
        });
    }
    FontView.prototype.fontSet = function(){
        var idx = this.$index;
        var selectedOption = this.$selectedFont.find("option:selected");
        var selectedValue = selectedOption.val();
        var selectedData = selectedOption.data("weight").split(",");
        var addStyleLink = '<link rel="stylesheet" href="buildFonts/output/kr/'+selectedValue+'/'+selectedValue+'.css">';
        var addRadioList = '';
        if(this.$options.type == 'short'){
            var addSizeOption = selectedData.concat(this.$options.size);            
            var $textBox = this.$controls.find('.global-text');
            var $txt = $textBox.find('input').val();
            this.$viewbox.addClass('type-short');
            this.$radioList.parent().hide();
            $textBox.show();
            $.each(addSizeOption,function(a,b){
                if(a >= selectedData.length){
                    addRadioList += `<p style="font-size:${b}px">${b}px : <span>${$txt}</span></p>`;
                }else{
                    addRadioList += `<p style="font-weight:${b}">${b} : <span>${$txt}</span></p>`;
                }
            });
            this.$viewbox.html(addRadioList);
        }else{
            $.each(selectedData,function(a,b){
                var chk = (!a) ? 'checked' : '';
                addRadioList += '<input type="radio" id="radio'+idx+'_'+(a+1)+'" name="weight'+idx+'" value="'+b+'" '+chk+'><label for="radio'+idx+'_'+(a+1)+'">'+b+'</label>';
            });
            this.$radioList.empty().append(addRadioList).buttonset();
        }
        $("head").append(addStyleLink);
        this.$viewbox.css({
            "font-family" : selectedValue + ", '궁서'",
            "font-weight" : selectedData[0]
        });
    }

    $.fn.extend({
        fontView : function(options){
            var defaults = {
                'type' : 'long', // or short
                'size' : [12,14,16,18,21,26,36]
            },options = $.extend({},defaults, options);
            this.each(function(idx){
                var  fontview = new FontView(this,idx,options);
            });
            return this;
        }
    });

    // jQuery Ready
    $(function(){
        $('.preview-container').fontView({'type':'short'});
        var jqUioption = [
            {
                animate: true, range : "min",
                value : 16, max : 100, min : 10,
                slide:function(event,ui){
                    slideCallback("font-size",ui,'px');
                },
                change:function(event,ui){
                    slideCallback("font-size",ui,'px');
                }
            },
            {
                animate: true, range : "min",
                value : 1.6, max : 3, min : 1, step : 0.1,
                slide:function(event,ui){
                    slideCallback("line-height",ui);
                },
                change:function(event,ui){
                    slideCallback("line-height",ui);
                }
            },
            {
                animate: true, range : "min",
                value : 0, max : 10, min : -5, step : 0.5,
                slide:function(event,ui){
                    slideCallback("letter-spacing",ui,'px');
                },
                change:function(event,ui){
                    slideCallback("letter-spacing",ui,'px');
                }
            }
        ];
        function slideCallback(style,ui,unit){
            $('.preview-viewer').css(style,ui.value +  (unit||null));
            $(ui.handle).parent().prev().find("input").val(ui.value + (unit||null));
        }
        $(".slider").each(function(i){
            var handle = $(this).prev().find("span");
            $(this).slider(jqUioption[i]);
            //handle.text($(this).slider("value") + unit[i]);
        });
        $( ".radioset" ).buttonset();
        $(".global").on("change",".controller-name input",function(){
            var changeValue = $(this).val()*1;
            var slider = $(this).parent().next();
            slider.slider( "value", changeValue );
        });
    })
})(jQuery);