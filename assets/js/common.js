(function($) {
    jQuery.fn.selectText = function(){
        var doc = document;
        var element = this[0];
        if (doc.body.createTextRange) {
            var range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        } else if (window.getSelection) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };
     jQuery.fn.fixedScrollTop = function(){
         var obj = $(this),
               objOffset = obj.offset().top;
         $(window).on("scroll",function(){
            ($(this).scrollTop() >= objOffset) ? obj.addClass("fixedScrollTop") : obj.removeClass("fixedScrollTop");
         });
     };

    $(function(){

        $(document.body).on("click",".toggle-nav",function(){$(this).toggleClass("active")})
    });
})(jQuery);

