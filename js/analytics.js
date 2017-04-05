
            var _comscore = _comscore || [];
            _comscore.push({
                c1 : "2",
                c2 : "6035286"
            });
            (function() {
                var s = document.createElement("script"), el = document.getElementsByTagName("script")[0];
                s.async = true;
                s.src = (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js";
                el.parentNode.insertBefore(s, el);
            })();
            (function(i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] ||
                function() {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o), m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            ga('create', 'UA-1431719-1', 'auto');
            ga('send', 'pageview');

        
            var _sf_async_config = _sf_async_config || {};
            /** CONFIGURATION START **/
            _sf_async_config.uid = 63228
            _sf_async_config.domain = "hindustantimes.com";
            _sf_async_config.useCanonical = true;
            _sf_async_config.sections = 'ht-indepth';
            //CHANGE THIS
            _sf_async_config.authors = 'Samarth Bansal';
            //CHANGE THIS
            /** CONFIGURATION END **/
            (function() {
                function loadChartbeat() {
                    window._sf_endpt = (new Date()).getTime();
                    var e = document.createElement('script');
                    e.setAttribute('language', 'javascript');
                    e.setAttribute('type', 'text/javascript');
                    e.setAttribute('src', '//static.chartbeat.com/js/chartbeat.js');
                    document.body.appendChild(e);
                }

                var oldonload = window.onload;
                window.onload = ( typeof window.onload != 'function') ? loadChartbeat : function() {
                    oldonload();
                    loadChartbeat();
                };
            })();
