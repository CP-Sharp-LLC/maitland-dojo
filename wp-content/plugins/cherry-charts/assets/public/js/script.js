/**
 * Frontend scripts init
 */
(function($) {

	$(function() {
		// setup radial progress bar
		$('.cherry-charts-bar.radial').each(function(index, el) {

			var dataProgress = [
				{
					value: $(this).data('value'),
					color: $(this).data('color')
				},
				{
					value: $(this).data('left'),
					color: $(this).data('bg-color')
				}
			]

			var optionProgress = {
				scaleShowLabels: false,
				showTooltips: false,
				animationSteps: 100,
				segmentShowStroke: false,
				percentageInnerCutout: $(this).data('cutout'),
				animationEasing: "easeOutExpo"
			}

			var userOptions = $(this).data('user-settings');

			if ( userOptions ) {
				$.extend(optionProgress, userOptions);
			}

			var ctxProgress = $('canvas', this).get(0).getContext("2d");
			var chartProgress = new Chart(ctxProgress).Doughnut(dataProgress, optionProgress);

		});
		// setup pie data
		$('.cherry-charts-pie').each(function(index, el) {

			var pieData = $(this).data('pie');

			var showLabels = $(this).data('show-labels'),
				showLegend = $(this).data('show-legend');

			var optionPie = {
				scaleShowLabels: showLabels,
				showTooltips: showLabels,
				animationSteps: 100,
				segmentShowStroke: false,
				animationEasing: "easeOutExpo"
			}

			var userOptions = $(this).data('user-settings');

			if ( userOptions ) {
				$.extend(optionPie, userOptions);
			}

			var ctxPie = $('canvas', this).get(0).getContext("2d");
			var chartPie = new Chart(ctxPie).Pie(pieData, optionPie);

			if ( 'yes' == showLegend ) {
				var legend = chartPie.generateLegend();
				$(this).append(legend);
			}
		});
		// setup doughnut data
		$('.cherry-charts-doughnut').each(function(index, el) {

			var doughnutData = $(this).data('doughnut');

			var showLabels = $(this).data('show-labels'),
				showLegend = $(this).data('show-legend');

			var optionDoughnut = {
				scaleShowLabels: showLabels,
				showTooltips: showLabels,
				animationSteps: 100,
				percentageInnerCutout: $(this).data('cutout'),
				segmentShowStroke: false,
				animationEasing: "easeOutExpo"
			}

			var userOptions = $(this).data('user-settings');

			if ( userOptions ) {
				$.extend(optionDoughnut, userOptions);
			}

			var ctxDoughnut = $('canvas', this).get(0).getContext("2d");
			var chartDoughnut = new Chart(ctxDoughnut).Doughnut(doughnutData, optionDoughnut);

			if ( 'yes' == showLegend ) {
				var legend = chartDoughnut.generateLegend();
				$(this).append(legend);
			}
		});
		// setup bar chart
		$('.cherry-charts-type-bar').each(function(index, el) {

			var barData = {
				labels: $(this).data('labels'),
				datasets: $(this).data('bar')
			}

			var showLabels = $(this).data('show-labels'),
				showLegend = $(this).data('show-legend');

			var optionsBar = {
				scaleShowLabels: showLabels,
				showTooltips: showLabels,
				animationSteps: 100,
				segmentShowStroke: false,
				multiTooltipTemplate: "<%= datasetLabel %>: <%= value %>",
				animationEasing: "easeOutExpo"
			}

			var userOptions = $(this).data('user-settings');

			if ( userOptions ) {
				$.extend(optionsBar, userOptions);
			}

			var ctxBar = $('canvas', this).get(0).getContext("2d");
			var chartBar = new Chart(ctxBar).Bar(barData, optionsBar);

			if ( true == showLegend ) {
				var legend = chartBar.generateLegend();
				$(this).append(legend);
			}
		});
		// setup vertical and horizontal progress bars
		$('.cherry-charts-bar.horizontal').each(function(index, el) {
			var width = $(this).data('value');
			$('.cherry-charts-progress', $(this)).css( 'width', width + '%' );
		});
		$('.cherry-charts-bar.vertical').each(function(index, el) {

			var height  = $(this).data('value'),
				animate = $(this).data('animate');

			if ( 'no' !== animate ) {
				$('.cherry-charts-progress', $(this)).css( 'height', height + '%' );
			}

		});
	})

})(jQuery);