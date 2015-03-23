$(function() {
    FastClick.attach(document.body);
});

$(document).ready(function(){
	var sameValue = false;

	// Test submit
	$("#submit").click(function() {
  	  var deal_country_val = $("ul.deal_country").find(".selected").data("value");
  	  // alert(deal_country);
	});

	$("#searchbox ul, #languageselector").on("click", ".init", function() {
		$(this).addClass('initOpen');
		if(sameValue){
			$(this).closest("ul").children('li:not(.init)').slideUp();
			$(this).removeClass('initOpen');
			sameValue = false;
		}else{
		    $(this).closest("ul").children('li:not(.init)').slideDown();
		    sameValue = true;
		}
	});

	var allOptions = $("#searchbox ul, #languageselector").children('li:not(.init)');
	$("#searchbox ul, #languageselector").on("click", "li:not(.init)", function() {
	    allOptions.removeClass('selected');
	    var temp_class = $(this).attr('class');
	    $(this).addClass('selected');
	    $(this).parent().children('.init').attr('class', 'init').addClass(temp_class).html($(this).html());
	    allOptions.slideUp();
	    $('#searchbox ul, #languageselector').children('.init').removeClass('initOpen');
	});



});
