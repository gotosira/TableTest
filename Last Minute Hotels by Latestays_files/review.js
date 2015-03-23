
var objReview = function(options) {
	this.options = {
			 place_holder: '#reviewPlaceholder',
			 sum_place_holder: '',
			 page_review: '1',
			 max_page_review: '0',
			 review_hotel_id: '0',
			 review_language: '0',
			 destination_name: '',
			 skin: 'awdReview',
			 is_mystery_hotel: '',
			 mobile: false,
			 brand: 'all'
	};
	this.scroll_to = 0;
	if(options){ Object.extend(this.options, options); }
	Event.observe(document, 'dom:loaded', this.initialize.bind(this), false);
};

objReview.prototype = { 

	initialize: function() {
		this.requestTemplate();
	},

	ajaxRequest: function(url, callback, obj) {
		jQuery.ajax({
		     url : url,
		     jsonp : false,
		     jsonpCallback: callback,
		     cache: true,
		     dataType : "jsonp",
		     success: obj.bind(this),
		     error: function(e) { }
		});
	},
	
	requestTemplate: function() {
		var url = "http://www.asiawebdirect.com/review/"+this.options.review_language+"/template/"+this.options.skin+"/";
		this.ajaxRequest(url, 'processTemplate', this.processTemplate);
	},
	
	processTemplate: function(data) {
		jQuery(this.options.place_holder).html(data.reviewTemplate);
		this.initTemplate();
	},

	initTemplate: function() {
		this.options.page_review = 0;
		this.loadGuestReviewItem();

		jQuery('#div-review-show-more').bind('click',this.onClick.bind(this));
		jQuery('#div-review-hide').bind('click',this.onClick.bind(this));
	},
	
	loadGuestReviewItem: function () {
		if(this.options.max_page_review<=this.options.page_review){
			this.options.page_review = 0;
		}
		this.requestReview(5, this.options.page_review*5);		
		this.options.page_review = parseInt(this.options.page_review)+1;
	},

	requestReview: function(limit, offset) {
		var url="http://www.asiawebdirect.com/review/"+this.options.review_language+"/jsonp/"+this.options.review_hotel_id+"/"+this.options.brand+"/"+limit+"/"+offset+"/";
		this.ajaxRequest(url, 'processReview', this.processReview);
	},
	
	processReview: function(data) {
		  this.ajaxResult = data;
		  var status = data.Result.toString();
		  if((status=="false") || (data.TotalReviewScoreAVG==0)){
			  return;
		  }

		  if(data.TotalReviews>5){
			  this.options.max_page_review = Math.ceil(data.TotalReviews/5);
		  }
		  
		  data.isMysteryHotel  = this.options.is_mystery_hotel;
		  data.DestinationName = this.options.destination_name;

		  if(this.options.sum_place_holder!='' 
			  && jQuery(this.options.sum_place_holder).length>0) {
			  var innerHTML = tmpl_str(jQuery('#reviewSum_template').val(), data);		 
			  jQuery(this.options.sum_place_holder).html(innerHTML);
		  }
			  
		  if(this.options.is_mystery_hotel!="M") {
			  
			  var commentHTML = "";
			  if(jQuery('#hotel_comment').length>0) {
				  commentHTML = jQuery('#hotel_comment').html();
			  }

			  var innerHTML = tmpl_str(jQuery('#reviewBlock_template').val(), data);
			  jQuery('#reviewBlock').html(innerHTML);
			  jQuery('#hotel_comment').html(commentHTML);

			  this.updateHotelComment(data);
			  this.toogleReview();
			  if(data.SumTotalReviews.TotalReviewAwdShow==0) {
				  if(jQuery('#reviews-hotel-condition').length>0) {
					  jQuery('#reviews-hotel-condition').css({display: 'none'});
				  }
				  if(jQuery('#reviews-hotel-rooms').length>0) {
					  jQuery('#reviews-hotel-rooms').css({display: 'none'});
				  }
			  }
		  }	  
		  
		  if(this.scroll_to ==1 ) { this.scrollTo(); }
	},
	
	toogleReview: function() {
		this.toogleButton();
		jQuery('#hotel_section-heading').css({display: 'block'});
		jQuery('#hotel_review-columns').css({display: 'block'});
		jQuery('#showAllGuestComments').css({display: 'none'});
	},
	
	updateHotelComment: function(data) {
		jQuery('#hotel_comment').append(
	  			jQuery("<a>", { id: "offset"+(this.options.page_review) })
	  			);

		var innerHTML = "";
		if(data.TotalReviews>0) {
			innerHTML = tmpl_str(jQuery('#hotel_comment_template').val(), data);
		}
		
		jQuery('#hotel_comment').append(innerHTML);
	},

	onClick: function() {
		var label;
		this.scroll_to = 1;
		jQuery('#showAllGuestComments').css({display: 'block'});
		if(this.options.max_page_review<=this.options.page_review){
			jQuery('#hotel_comment').html("");
			label = 'Hide It';
		}else{
			label = 'See more reviews';
		}
		this.loadGuestReviewItem();
		if(typeof(_gaq)=="object" && typeof(_gaq.push)=="function") {
			_gaq.push(['_trackEvent', 'button', 'click', label]);
		}
	},
	
	scrollTo: function() {
		var scrollto = "#blockGuest";
		if(this.options.page_review>1 && jQuery('#offset'+(this.options.page_review)).length>0) { 
			scrollto = '#offset'+(this.options.page_review); 
		}
		jQuery('html, body').animate({ scrollTop: jQuery(scrollto).offset().top}, 500);
	},
	
	toogleButton: function() {
		jQuery('#hotel_section-footer').css({display: 'none'});
		jQuery('#div-review-show-more').css({display: 'none'});
		jQuery('#div-review-hide').css({display: 'none'});
		if(this.options.max_page_review>1){
			jQuery('#hotel_section-footer').css({display: 'block'});
			if(this.options.max_page_review>this.options.page_review){
				jQuery('#div-review-show-more').css({display: 'block'});
			} else {
				jQuery('#div-review-hide').css({display: 'block'});
			}
		}		
	}
	
}
