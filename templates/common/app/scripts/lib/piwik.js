/**
 * PIWIK tracker
 * Modified by Marcus Heath Showalter
 *
 * Adds pageview tracking functionality
 */

/*
	Add something like this to each custom page to track

	_paq.push(['setCustomUrl', 'https://isgs-spdf.external.lmco.com/sites/pace-success/SitePages/index.html#/video/' + id]);
	_paq.push(['setDocumentTitle', 'video-' + id]);
	_paq.push(['trackPageView']);

*/

var _paq = _paq || [];
(function () {
	var siteId = 99999999999;	// Replace this with the site id that you are assigned
	var u = (("https:" == document.location.protocol) ? "https" : "http") + "://analytics.isgs.lmco.com/";
	_paq.push(['setSiteId', siteId]);
	_paq.push(['setTrackerUrl', u + 'piwik.php']);
	_paq.push(['enableLinkTracking']);
	var d = document,
		g = d.createElement('script'),
		s = d.getElementsByTagName('script')[0];
	g.type = 'text/javascript';
	g.defer = true;
	g.async = true;
	g.src = u + 'piwik.js';
	s.parentNode.insertBefore(g, s);
})();
