(function($) {
    var unicode = {
        checkError : function(){
            if(this.value == ""){
                alert('입력값이 없습니다');
                this.reset();
            }else if(this.type=="0" && !this.value.match(/U+/g)){
                alert('유효하지 않은 값입니다');
                this.reset();
            }else{
                (!this.type) ? this.makeText() : this.makeUnicode();
            }
        },
        makeText : function(){
            var _this = this;
            var arrayUnicode = _this.value.replace(/[U+.]/g,'').replace(/\s/g,'').toUpperCase().split(',');
            arrayUnicode.forEach(function(ele){
                if(ele.indexOf("-") > 0){
                    _this.getRange(ele)
                }else{
                    var str = _this.getUnicode(ele);
                    _this.result.push(str);
                }
            });
            this.result = this.result.join("");
            this.print();
        },
        makeUnicode : function(){
            var _this = this;
            var  arrayStr =_this.value.split("");
            arrayStr.forEach(function(ele){
                var str = ele.charCodeAt(0).toString(16).toUpperCase();
                while (str.length < 4) {
                  str = '0' + str;
                }
                _this.result.push("U+"+str);
            });
            this.result = this.result.join(", ");
            this.print()
        },
        makeUnicodeTable : function(type,idx){
            var tbl = $(".unicode-table tbody"),
            patten = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"],
            html = "",
            tdNode = "",
            btn = "<div class='unicode-select'><button type='button' class='single-select'>+</button><button type='button' class='multi-select'>~</button></div>",
            range = false;
            tbl.empty();
            for(var b=0; b<patten.length; b++){
                for(var c=0; c<patten.length; c++){
                    for(var d=0; d<patten.length; d++){
                        var code = idx +patten[b]+patten[c]+patten[d];
                        var codeTxt = this.getUnicode(code);
                        if(type === "ko"){
                            if(idx==="A"){
                                if(code === "AC00") range = true;
                                if(!range) continue;
                            }else if(idx==="D"){
                                if(Number("0x"+code) > 0xD7A3){
                                    codeTxt = "　";
                                    btn = "";
                                }
                            }
                        };
                        tdNode += "<td><div><p>" + code + "</p>" + btn + codeTxt + "</div></td>";
                        if(d == patten.length -1){
                            html += "<tr>"+tdNode+"</tr>";
                            tdNode = "";
                        };
                    };
                };
            };
            tbl.append(html);
            this.unicodeTdArray.all = tbl.find("td");
        },
        unicodeTdArray : {
            all : null,
            range : null
        },
        getUnicode : function(c){
            var c = Number("0x"+c);
            var d = String.fromCharCode(c);
            return d;
        },
        getRange : function(r){
            var r= r.split("-");
            var at = Number("0x"+r[0]);
            var until = Number("0x"+r[1]);
            for(var i = at;i < until+1; i++){
                var str = String.fromCharCode(i);
                this.result.push(str);
            }
        },
        print : function(){
            $(".output-area").html(this.result).addClass("on").selectText();
            //document.execCommand("copy");
        },
        reset : function(){
            $(".output-area").removeClass("on");
            $(".codeList").val("").focus();
            $(".example").find("span").removeClass("on").eq(Number($(".convert-type input:checked").val())).addClass("on")
        }
    };

    $(function(){
        var
            codeType = "ko",
            selectedSection = [],
            resultRange = [];

        $(document.body).on("click",".btnConvert",function(){
            unicode.result = [];
            unicode.type = Number($(".convert-type input:checked").val());
            unicode.value = $(".codeList").val();
            unicode.checkError();
        }).on("change",".convert-type input",unicode.reset).on("click",".range-type",function(){
            $(this).siblings(".range-type").removeClass("active").end().addClass("active");
            codeType = $(this).data("range");
        }).on("click",".range-tab ul button",function(){
            var rangeIndex = $(this).data("index");
            $(this).addClass("active").parent().siblings().find('button').removeClass("active");
            unicode.makeUnicodeTable(codeType,rangeIndex);

            resultRange = [];
            $(".unicode-range-result").text("").hide();
            $(window).scrollTop(0);
        }).on("click",".unicode-select button",function(){
            var myParents= $(this).closest("td");
            var myClass = $(this).attr("class");
            if(myClass.indexOf("single-select") < 0 ){ // 다중 선택
                if(myParents.hasClass("selectedRange")){ // 다중 선택 취소 시
                    var delCode = myParents.data("code");
                    printRange(delRange(delCode));
                    $("[data-code='"+delCode+"']").removeClass("selectedRange").removeAttr("data-code").find(".multi-select").removeClass("selected-del").text("~");;
                }else{
                    var idx = unicode.unicodeTdArray.all.index(myParents);
                    selectedSection.push(idx);
                    myParents.addClass("selected");
                    if(selectedSection.length > 1){
                        unicode.unicodeTdArray.range = unicode.unicodeTdArray.all.slice(selectedSection[0],selectedSection[1]+1);
                        var rangeAt = unicode.unicodeTdArray.range.first().find("p").text().toLowerCase(),
                              rangeUntil = unicode.unicodeTdArray.range.last().find("p").text().toLowerCase(),
                              rangeData = addRange(rangeAt,rangeUntil);
                        $.each(unicode.unicodeTdArray.range,function(a,b){
                            if($(b).hasClass('single')){
                                rangeData = delRange($(b).find("p").text().toLowerCase());
                                $(b).find(".single-select").removeClass("selected-del").text("+").siblings(".multi-select").show();
                            }
                            unicode.unicodeTdArray.range.eq(a).find(".multi-select").addClass("selected-del").text("x");
                            unicode.unicodeTdArray.range.eq(a).removeClass("selected single").addClass("selectedRange").attr("data-code",resultRange[resultRange.length-1]);
                        });
                        printRange(rangeData);
                        selectedSection = [];
                        $(".unicode-table").find("td").removeClass("disabled");
                    }else{
                        for(var disabledTd = 0; disabledTd < idx; disabledTd++){
                            unicode.unicodeTdArray.all.eq(disabledTd).addClass("disabled");
                        }
                    }
                };
            }else{ // 단일 선택
                if(myParents.hasClass("selected")){
                    printRange(delRange(myParents.find("p").text().toLowerCase()));
                    $(this).removeClass("selected-del").text("+").siblings(".multi-select").show();
                    myParents.removeClass("selected single");
                }else{
                    printRange(addRange(myParents.find("p").text().toLowerCase()));
                    $(this).addClass("selected-del").text("x").siblings(".multi-select").hide();
                    myParents.addClass("selected single");
                }
            };
            function printRange(fn){
                (!fn) ? $(".unicode-range-result").hide() : $(".unicode-range-result").show();
                $(".unicode-range-result").text(fn).selectText();
            };
            function addRange(t1,t2){
                var c = "U+"+t1;
                if(t2) c += "-"+t2;
                resultRange.push(c);
                return resultRange.join(",");
            };
            function delRange(t1){
                var c = (t1.indexOf("U") < 0 ) ? "U+"+t1 : t1;
                resultRange = resultRange.filter(function(item, pos, self) {
                    return item != c;
                 });
                 return resultRange.join(",");
            };
        });

        if($(".range-tab").length) $(".range-tab").fixedScrollTop();

    });
})(jQuery);

