(function($) {
	Drupal.behaviors.equalHeightsModule = {
	  attach: function (context, settings) {
	  var eqClass = Drupal.settings.equalHeightsModule;
    if (eqClass) {
	  //var overflow = Drupal.settings.equalHeightsModule.overflow;
	    $.each(eqClass, function(eqClass, setting) {
		  $('.' + setting.elClass).equalHeights(setting.minheight, setting.maxheight).css('overflow', setting.overflow)});
	  }
    }
	}
})(jQuery);
