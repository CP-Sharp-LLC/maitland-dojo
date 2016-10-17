/**
 * Admin scripts init
 */
(function($) {
	var methods = {

		init: function( options ) {

			var settings = { somevar: true }

			return this.each(function(){
				if ( options ){
					$.extend(settings, options);
				}

				var
					table     = $(this),
					type      = table.data('type'),
					spareRows = table.data('spare_rows'),
					spareCols = table.data('spare_cols'),
					input     = $( 'input.data-input-' + type ),
					getHandsontableData = function() {
						return table.data('handsontable').getData();
					},
					setUpHandsontable = function() {

						var data = cherry_charts_saved[type];

						if ( data.length === 0 ) {
							data = cherry_charts_default[type]
						}

						var table_settings = {
							minRows: 2,
							minCols: 2,
							startRows: 10,
							startCols: 10,
							minSpareRows: spareRows,
							minSpareCols: spareCols
						}

						var readOnlyCell = function (instance, td, row, col, prop, value, cellProperties) {
							Handsontable.TextCell.renderer.apply(this, arguments);
							$(td).css({
								background: '#e8e8e8'
							});
						};

						table.handsontable({
							data: data,
							cells: function(r,c, prop) {
								var cellProperties = {};
								if ( r === 0 && c === 0 && type == 'bar' ) {
									cellProperties.readOnly = true;
									cellProperties.type     = {renderer: readOnlyCell};
								} else if ( r === 0 && 0 <= c && c <= 2 && type == 'progress_bar' ) {
									cellProperties.readOnly = true;
									cellProperties.type     = {renderer: readOnlyCell};
								}
								return cellProperties;
							},

							onChange: function (changes, source) {
								var tdata = getHandsontableData();
								tdata = JSON.stringify(tdata);
								input.val(tdata);
							}
						});

						table.handsontable('updateSettings', table_settings);

						table.handsontable('render');

						if ( ! table.hasClass('active') ) {
							table.hide();
						}
					}


				_constructor();

				function _constructor(){
					setUpHandsontable();
				}

			});
		}
	}

	$.fn.cherryChartsData = function( method ){
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method with name ' +  method + ' is not exist for jQuery.cherryPortfolioLayoutPlugin' );
		}
	} //end plugin

	$(function(){
		$('.cherry-chart-data_ ').cherryChartsData();

		var bar_type = $('#cherry_charts-bar_type').val(),
			val      = $('#cherry_charts-type').val();

		switch_inner_cut = function() {
			if ( 'radial' == bar_type ) {
				$('#wrap-cherry_charts-inner_cut').show();
			} else {
				$('#wrap-cherry_charts-inner_cut').hide();
			}
		}

		function switch_meta() {
			$('#cherry-chart-data-' + val)
				.addClass('active')
				.show()
				.siblings('.cherry-chart-data_')
				.removeClass('active')
				.hide();
			$('.depend-group').each(function(index, el) {
				if ( $(this).hasClass(val + '-group') ) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});
			if ( 'progress_bar' == val ) {
				bar_type = $('#cherry_charts-bar_type').val();
				switch_inner_cut();
			}
		}

		switch_meta();

		$(document).on('change.cherry_charts', '#cherry_charts-type', function(event) {
			val = $(this).val();
			switch_meta();
		});
		$(document).on('change.cherry_charts', '#cherry_charts-bar_type', function(event) {
			bar_type = $('#cherry_charts-bar_type').val();
			switch_inner_cut();
		});
	})

})(jQuery);