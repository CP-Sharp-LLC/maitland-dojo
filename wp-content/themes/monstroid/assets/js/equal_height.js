"use strict";

jQuery(document).ready(function() {
	 var equal_row = jQuery( '.grid-layout .row' ),
	  equal_row_inne = '.grid-layout_inner',
	  num_row_inne = jQuery( equal_row_inne, equal_row ).length,
	  row_inne_array = [],
	  counter;

	 function equal_height(){
	  counter = -1 ;
	  jQuery(equal_row_inne, equal_row).each( function( index ){
	   if( index % 4 === 0 ){
	    counter++;
	    row_inne_array[counter] = [];
	   }

	   row_inne_array[counter].push( jQuery( this ).height() );
	  })
	  jQuery.map(row_inne_array, function(value, index){
	   var max_height = Math.max.apply(null, row_inne_array[index]);
	   equal_row.eq(index).find(equal_row_inne).height(max_height);
	  })
	 }

	 jQuery(window).on('resize.equal_height', equal_height).triggerHandler('resize.equal_height', equal_height);

});