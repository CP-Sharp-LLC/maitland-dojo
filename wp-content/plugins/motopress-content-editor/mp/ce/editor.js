try {
    (function ($) {
        can.Construct('MP.Editor', 
        {
            myThis: null,
            eventPrefix: 'MPCE-',
            on: function (eventName, callback) {
                eventName = eventName.split(' ').map(function (eName) {
                    return MP.Editor.eventPrefix + eName;
                }).join(' ');
                $(window).on(eventName, callback);    
            },
            onIfr: function (eventName, callback) {
                eventName = eventName.split(' ').map(function (eName) {
                    return MP.Editor.eventPrefix + eName;
                }).join(' ');
                CE.Iframe.window.jQuery(CE.Iframe.window).on(eventName, callback);    
            },
            oneIfr: function (eventName, callback) {
                eventName = eventName.split(' ').map(function (eName) {
                    return MP.Editor.eventPrefix + eName;
                }).join(' ');
                CE.Iframe.window.jQuery(CE.Iframe.window).one(eventName, callback);    
            },
            trigger: function (eventName, eventData) {
                eventName = eventName.split(' ').map(function (eName) {
                    return MP.Editor.eventPrefix + eName;
                }).join(' ');
                $(window).trigger(eventName, eventData);    
            },
            triggerIfr: function (eventName, eventData) {
                eventName = eventName.split(' ').map(function (eName) {
                    return MP.Editor.eventPrefix + eName;
                }).join(' ');
                CE.Iframe.window.jQuery(CE.Iframe.window).trigger(eventName, eventData);    
            },
            triggerEverywhere: function (eventName, eventData) {
                MP.Editor.trigger(eventName, eventData);
                MP.Editor.triggerIfr(eventName, eventData);    
            }
        }, 
        {
            loaded: false,
            opened: false,
            preloader: null,
            flash: null,
            utils: null,
            settings: null,
            lang: null,
            init: function () {
                MP.Editor.myThis = this;
                new MP.Preloader($('#motopress-preload'));
                new MP.Flash($('#motopress-flash'));
                new MP.Utils();
                new MP.Settings();
                new MP.Language();
                new CE.PresetSaveModal($('#motopress-ce-save-preset-modal'));
                new CE.Navbar($('.motopress-content-editor-navbar'));
                new CE.PreviewDevice($('#motopress-content-editor-preview-device-panel'));
                new CE.Iframe($('#motopress-content-editor-scene'));
                new CE.CodeModal($('#motopress-code-editor-modal'));
                MP.Preloader.myThis.load(MP.Editor.shortName);
                this.open();
            },
            load: function () {
                this.loaded = true;
                MP.Editor.triggerEverywhere('EditorLoad');
            },
            unload: function () {
                this.loaded = false;
                MP.Editor.trigger('EditorUnLoad');
            },
            open: function () {
                this.opened = true;
                MP.Editor.trigger('EditorOpen');
            },
            close: function () {
                this.opened = false;
                this.unload();
                MP.Editor.trigger('EditorClose');
            },
            isOpen: function () {
                return this.opened;
            }
        });    
    }(jQuery));
    (function ($) {
        MP.Preloader = can.Control.extend(
        { myThis: null }, 
        {
            stages: {
                Navbar: false,
                Language: false,
                Iframe: false,
                LeftBar: false,
                DragDrop: false,
                Editor: false
            },
            loaded: 0,
            step: null,
            knob: null,
            init: function () {
                MP.Preloader.myThis = this;
                this.step = Math.round(100 / Object.keys(this.stages).length * 100) / 100;
                this.knob = this.element.find('#motopress-knob');
                this.set();
            },
            reopen: function () {
                for (var stage in this.stages) {
                    if (stage === 'Navbar' || stage === 'Language') {
                        delete this.stages[stage];
                    } else {
                        this.stages[stage] = false;
                    }
                }
            },
            show: function () {
                this.loaded = 0;
                this.set();
                this.element.stop().show();
            },
            hide: function () {
                this.element.fadeOut('slow');
                MP.Flash.showMessage();
            },
            load: function (stage) {
                if (this.stages.hasOwnProperty(stage) && !this.stages[stage]) {
                    this.stages[stage] = true;
                    this.loaded += this.step;
                    this.set();    
                }
            },
            set: function () {
                this.knob.val(this.loaded).trigger('change');
            }
        });
    }(jQuery));
    (function ($) {
        MP.Flash = can.Control.extend(
        {
            myThis: null,
            setFlash: function (message, type) {
                var alert = MP.Flash.myThis.create();
                if (typeof type === 'undefined')
                    type = 'warning';
                var cssClass = '';
                switch (type) {
                case 'info':
                    cssClass = 'alert-info';
                    break;
                case 'success':
                    cssClass = 'alert-success';
                    break;
                case 'error':
                    cssClass = 'alert-error';
                    break;
                }
                if (cssClass.length)
                    alert.addClass(cssClass);
                if (message.length)
                    alert.children('span').html(message);
            },
            showMessage: function () {
                MP.Flash.myThis.element.children('.alert').each(function () {
                    var alert = $(this);
                    alert.show().mpalert();
                    var flashTimer = setTimeout(function () {
                        alert.mpalert('close');
                        clearTimeout(flashTimer);
                    }, 10000);
                });
            }
        }, 
        {
            alertEl: $('<div />', {
                'class': 'alert fade in',
                style: 'display: none;'
            }),
            closeEl: $('<div />', {
                'class': 'motopress-close motopress-icon-remove',
                'data-dismiss': 'alert'
            }),
            messageEl: $('<span />'),
            create: function () {
                return this.alertEl.clone().append(this.closeEl.clone(), this.messageEl.clone()).appendTo(this.element);
            },
            init: function () {
                MP.Flash.myThis = this;
            }
        });
    }(jQuery));
    (function ($) {
        MP.Utils = can.Construct(
        {
            validationError: $('<div />', { 'class': 'motopress-validation-error' }),
            tbStyle: null,
            wpFrontEndEditorEvents: [],
            strtr: function (str, from, to) {
                if (typeof from === 'object') {
                    var cmpStr = '';
                    for (var j = 0; j < str.length; j++) {
                        cmpStr += '0';
                    }
                    var offset = 0;
                    var find = -1;
                    var addStr = '';
                    for (fr in from) {
                        offset = 0;
                        while ((find = str.indexOf(fr, offset)) != -1) {
                            if (parseInt(cmpStr.substr(find, fr.length)) != 0) {
                                offset = find + 1;
                                continue;
                            }
                            for (var k = 0; k < from[fr].length; k++) {
                                addStr += '1';
                            }
                            cmpStr = cmpStr.substr(0, find) + addStr + cmpStr.substr(find + fr.length, cmpStr.length - (find + fr.length));
                            str = str.substr(0, find) + from[fr] + str.substr(find + fr.length, str.length - (find + fr.length));
                            offset = find + from[fr].length + 1;
                            addStr = '';
                        }
                    }
                    return str;
                }
                for (var i = 0; i < from.length; i++) {
                    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
                }
                return str;
            },
            uniqid: function (prefix, more_entropy) {
                if (typeof prefix == 'undefined') {
                    prefix = '';
                }
                var retId;
                var formatSeed = function (seed, reqWidth) {
                    seed = parseInt(seed, 10).toString(16);
                    if (reqWidth < seed.length) {
                        return seed.slice(seed.length - reqWidth);
                    }
                    if (reqWidth > seed.length) {
                        return Array(1 + (reqWidth - seed.length)).join('0') + seed;
                    }
                    return seed;
                };
                if (!this.php_js) {
                    this.php_js = {};
                }
                if (!this.php_js.uniqidSeed) {
                    this.php_js.uniqidSeed = Math.floor(Math.random() * 123456789);
                }
                this.php_js.uniqidSeed++;
                retId = prefix;
                retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
                retId += formatSeed(this.php_js.uniqidSeed, 5);
                if (more_entropy) {
                    retId += (Math.random() * 10).toFixed(8).toString();
                }
                return retId;
            },
            version_compare: function (v1, v2, operator) {
                this.php_js = this.php_js || {};
                this.php_js.ENV = this.php_js.ENV || {};
                var i = 0, x = 0, compare = 0,
                    vm = {
                        'dev': -6,
                        'alpha': -5,
                        'a': -5,
                        'beta': -4,
                        'b': -4,
                        'RC': -3,
                        'rc': -3,
                        '#': -2,
                        'p': 1,
                        'pl': 1
                    },
                    prepVersion = function (v) {
                        v = ('' + v).replace(/[_\-+]/g, '.');
                        v = v.replace(/([^.\d]+)/g, '.$1.').replace(/\.{2,}/g, '.');
                        return !v.length ? [-8] : v.split('.');
                    },
                    numVersion = function (v) {
                        return !v ? 0 : isNaN(v) ? vm[v] || -7 : parseInt(v, 10);
                    };
                v1 = prepVersion(v1);
                v2 = prepVersion(v2);
                x = Math.max(v1.length, v2.length);
                for (i = 0; i < x; i++) {
                    if (v1[i] == v2[i]) {
                        continue;
                    }
                    v1[i] = numVersion(v1[i]);
                    v2[i] = numVersion(v2[i]);
                    if (v1[i] < v2[i]) {
                        compare = -1;
                        break;
                    } else if (v1[i] > v2[i]) {
                        compare = 1;
                        break;
                    }
                }
                if (!operator) {
                    return compare;
                }
                switch (operator) {
                case '>':
                case 'gt':
                    return compare > 0;
                case '>=':
                case 'ge':
                    return compare >= 0;
                case '<=':
                case 'le':
                    return compare <= 0;
                case '==':
                case '=':
                case 'eq':
                    return compare === 0;
                case '<>':
                case '!=':
                case 'ne':
                    return compare !== 0;
                case '':
                case '<':
                case 'lt':
                    return compare < 0;
                default:
                    return null;
                }
            },
            inObject: function (value, obj) {
                var result = false;
                for (var key in obj) {
                    if (obj[key].toLowerCase() == value.toLowerCase()) {
                        result = true;
                        break;
                    }
                }
                return result;
            },
            removeByValue: function (value, arr) {
                if (arr.indexOf(value) !== -1) {
                    arr.splice(arr.indexOf(value), 1);
                    return true;
                } else {
                    return false;
                }
            },
            doSortSelectByText: function (select) {
                if (!select.children('optgroup').length) {
                    var sortedVals = $.makeArray(select.children('option')).sort(function (a, b) {
                        return $(a).text() > $(b).text() ? 1 : $(a).text() < $(b).text() ? -1 : 0;
                    });
                    select.empty().html(sortedVals);
                } else {
                    select.children('optgroup').each(function () {
                        var sortedVals = $.makeArray($(this).children('option')).sort(function (a, b) {
                            return $(a).text() > $(b).text() ? 1 : $(a).text() < $(b).text() ? -1 : 0;
                        });
                        $(this).empty().html(sortedVals);
                    });
                }
            },
            addParamToUrl: function (url, key, value) {
                var query = url.indexOf('?');
                var anchor = url.indexOf('#');
                if (query == url.length - 1) {
                    url = url.substring(0, query);
                    query = -1;
                }
                return (anchor > 0 ? url.substring(0, anchor) : url) + (query > 0 ? '&' + key + '=' + value : '?' + key + '=' + value) + (anchor > 0 ? url.substring(anchor) : '');
            },
            removeParamFromUrl: function (url, param) {
                var expr = new RegExp(param + '\\=([a-z0-9]+)', 'i');
                var match = url.match(expr);
                if (match) {
                    var urlPart = match[0];
                    if (url.search('&' + urlPart) >= 0) {
                        url = url.replace('&' + urlPart, '');
                    } else if (url.search('\\?' + urlPart + '&') >= 0) {
                        url = url.replace('?' + urlPart + '&', '');
                    } else if (url.search('\\?' + urlPart) >= 0) {
                        url = url.replace('?' + urlPart, '');
                    }
                }
                return url;
            },
            showValidationError: function (message, afterElement) {
                var oldValidationError = afterElement.next('.motopress-validation-error');
                if (oldValidationError.length)
                    oldValidationError.remove();
                var validationError = this.validationError.clone();
                validationError.text(message).insertAfter(afterElement);
            },
            getScrollbarWidth: function () {
                var scrollWidth = window.browserScrollbarWidth;
                if (typeof scrollWidth === 'undefined') {
                    var div = $('<div style="width: 50px; height: 50px; position: absolute; left: -100px; top: -100px; overflow: auto;"><div style="width: 1px; height: 100px;"></div></div>');
                    $('body').append(div);
                    scrollWidth = div[0].offsetWidth - div[0].clientWidth;
                    div.remove();
                }
                return scrollWidth;
            },
            getSpanClass: function (classes) {
                var expr = new RegExp('^(' + parent.CE.Iframe.myThis.gridObj.span['class'] + ')\\d{1,2}$', 'i');
                var spanClass = null;
                for (var i = 0; i < classes.length; i++) {
                    if (expr.test(classes[i])) {
                        spanClass = classes[i];
                        break;
                    }
                }
                return spanClass;
            },
            getSpanNumber: function (spanClass) {
                var exprNumber = new RegExp('\\d{1,2}', 'i');
                return parseInt(spanClass.match(exprNumber));
            },
            notClone: function (span, ui) {
                return ui === null || span[0] !== ui.draggable[0] && span[0] !== ui.helper[0] ? true : false;
            },
            calcSpanNumber: function (row, ui) {
                var rowEdge = row.hasClass('motopress-row-edge') ? row : row.find('.motopress-row-edge').first();
                var spans = rowEdge.children('.motopress-clmn');
                var spanCount = 0;
                if (spans.length) {
                    spans.each(function () {
                        if (MP.Utils.notClone($(this), ui)) {
                            var spanNumber = MP.Utils.getSpanNumber(MP.Utils.getSpanClass($(this).prop('class').split(' ')));
                            spanCount += spanNumber;
                        }
                    });
                }
                return spanCount;
            },
            getEdgeSpan: function (span) {
                return span.hasClass('motopress-clmn-edge') ? span : span.find('.motopress-clmn-edge').first();
            },
            getEdgeRow: function (row) {
                return row.hasClass('motopress-row-edge') ? row : row.find('.motopress-row-edge').first();
            },
            detectSpanNestingLvl: function (span) {
                return span.closest('.motopress-row').parent('.motopress-content-wrapper').length ? 1 : 2;
            },
            detectRowNestingLvl: function (row) {
                return row.parent('.motopress-content-wrapper').length ? 1 : 2;
            },
            getHandleClass: function (classes) {
                var expr = new RegExp('^ui-resizable-(n|e|s|w|se|sw)$', 'i');
                var handleClass = null;
                for (var i = 0; i < classes.length; i++) {
                    if (expr.test(classes[i])) {
                        handleClass = classes[i];
                        break;
                    }
                }
                return handleClass;
            },
            setup: function () {
                var userAgent = navigator.userAgent.toLowerCase();
                this.Browser = {
                    Version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
                    Chrome: /chrome/.test(userAgent),
                    Safari: /webkit/.test(userAgent),
                    Opera: /opera/.test(userAgent),
                    IE: /msie/.test(userAgent) && !/opera/.test(userAgent),
                    Mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
                };
            },
            getEditorActiveMode: function (classes) {
                var expr = new RegExp('^(tmce|html)-active$', 'i');
                var activeMode = null;
                for (var i = 0; i < classes.length; i++) {
                    if (expr.test(classes[i])) {
                        activeMode = classes[i];
                    }
                }
                return activeMode;
            },
            addWindowFix: function () {
                if (typeof tb_show === 'function' && typeof tb_remove === 'function') {
                    this.tbStyle = $('<style />', {
                        type: 'text/css',
                        text: '#TB_overlay {z-index: 1051;} #TB_window {z-index: 1052;}'
                    }).appendTo('head');    
                }    
            },
            removeWindowFix: function () {
                if (this.tbStyle !== null) {
                    this.tbStyle.remove();
                }    
            },
            base64_decode: function (data) {
                var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
                var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = '', tmp_arr = [];
                if (!data) {
                    return data;
                }
                data += '';
                do {
                    h1 = b64.indexOf(data.charAt(i++));
                    h2 = b64.indexOf(data.charAt(i++));
                    h3 = b64.indexOf(data.charAt(i++));
                    h4 = b64.indexOf(data.charAt(i++));
                    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
                    o1 = bits >> 16 & 255;
                    o2 = bits >> 8 & 255;
                    o3 = bits & 255;
                    if (h3 == 64) {
                        tmp_arr[ac++] = String.fromCharCode(o1);
                    } else if (h4 == 64) {
                        tmp_arr[ac++] = String.fromCharCode(o1, o2);
                    } else {
                        tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                    }
                } while (i < data.length);
                dec = tmp_arr.join('');
                dec = this.utf8_decode(dec);
                return dec;
            },
            base64_encode: function (data) {
                var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
                var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = '', tmp_arr = [];
                if (!data) {
                    return data;
                }
                data = this.utf8_encode(data + '');
                do {
                    o1 = data.charCodeAt(i++);
                    o2 = data.charCodeAt(i++);
                    o3 = data.charCodeAt(i++);
                    bits = o1 << 16 | o2 << 8 | o3;
                    h1 = bits >> 18 & 63;
                    h2 = bits >> 12 & 63;
                    h3 = bits >> 6 & 63;
                    h4 = bits & 63;
                    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
                } while (i < data.length);
                enc = tmp_arr.join('');
                var r = data.length % 3;
                return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
            },
            utf8_decode: function (str_data) {
                var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0;
                str_data += '';
                while (i < str_data.length) {
                    c1 = str_data.charCodeAt(i);
                    if (c1 < 128) {
                        tmp_arr[ac++] = String.fromCharCode(c1);
                        i++;
                    } else if (c1 > 191 && c1 < 224) {
                        c2 = str_data.charCodeAt(i + 1);
                        tmp_arr[ac++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
                        i += 2;
                    } else {
                        c2 = str_data.charCodeAt(i + 1);
                        c3 = str_data.charCodeAt(i + 2);
                        tmp_arr[ac++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                        i += 3;
                    }
                }
                return tmp_arr.join('');
            },
            utf8_encode: function (argString) {
                if (argString === null || typeof argString === 'undefined') {
                    return '';
                }
                var string = argString + '';
                var utftext = '', start, end, stringl = 0;
                start = end = 0;
                stringl = string.length;
                for (var n = 0; n < stringl; n++) {
                    var c1 = string.charCodeAt(n);
                    var enc = null;
                    if (c1 < 128) {
                        end++;
                    } else if (c1 > 127 && c1 < 2048) {
                        enc = String.fromCharCode(c1 >> 6 | 192) + String.fromCharCode(c1 & 63 | 128);
                    } else {
                        enc = String.fromCharCode(c1 >> 12 | 224) + String.fromCharCode(c1 >> 6 & 63 | 128) + String.fromCharCode(c1 & 63 | 128);
                    }
                    if (enc !== null) {
                        if (end > start) {
                            utftext += string.slice(start, end);
                        }
                        utftext += enc;
                        start = end = n + 1;
                    }
                }
                if (end > start) {
                    utftext += string.slice(start, stringl);
                }
                return utftext;
            },
            nl2br: function (str, is_xhtml) {
                var breakTag = is_xhtml || typeof is_xhtml === 'undefined' ? '<br ' + '/>' : '<br>';
                return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
            },
            br2nl: function (str) {
                return str.replace(/<br[^>]*>\s*\r*\n*/g, '\n');
            },
            addWpFrontEndEditorFix: function () {
                var events = $('#post-preview').data('events');
                if (typeof events !== 'undefined' && events.hasOwnProperty('click')) {
                    var clickEvents = events.click.slice();
                    $.each(clickEvents, function (index, value) {
                        if (value.handler.toString().indexOf('wp_fee_redirect') !== -1) {
                            MP.Utils.wpFrontEndEditorEvents.push(value);
                            $('#post-preview').data('events').click.splice($('#post-preview').data('events').click.indexOf(value), 1);
                        }
                    });
                }
            },
            removeWpFrontEndEditorFix: function () {
                if (this.wpFrontEndEditorEvents.length) {
                    $.merge($('#post-preview').data('events').click, this.wpFrontEndEditorEvents);
                    this.wpFrontEndEditorEvents.length = 0;
                }
            },
            getTinyMCEVersion: function () {
                return typeof tinyMCE !== 'undefined' ? tinyMCE.majorVersion + '.' + tinyMCE.minorVersion : false;
            },
            fixTabsBaseTagConflict: function (tabsEl, doc, loc) {
                doc = $(typeof doc === 'undefined' ? document : doc);
                loc = typeof loc === 'undefined' ? location : loc;
                if (doc.find('base').length) {
                    tabsEl.find('ul li a').each(function () {
                        $(this).attr('href', loc.href.toString() + $(this).attr('href'));
                    });
                }
            },
            getObjectChanges: function (prev, now) {
                var changes = {};
                for (var prop in now) {
                    if (!prev || prev[prop] !== now[prop]) {
                        if ($.isPlainObject(now[prop])) {
                            var c = getObjectChanges(prev[prop], now[prop]);
                            if (!$.isEmptyObject(c))
                                changes[prop] = c;
                        } else {
                            changes[prop] = now[prop];
                        }
                    }
                }
                return changes;
            },
            moveArrayElement: function (arr, from, to) {
                arr.splice(to, 0, arr.splice(from, 1)[0]);
            }
        }, 
        {});
    }(jQuery));
    (function ($) {
        can.Control('CE.Iframe', 
        {
            myThis: null,
            window: null,
            $: null,
            $window: null,
            contents: null,
            wpEditor: null,
            wpTextarea: null
        }, 
        {
            minWidth: null,
            gridObj: null,
            grid: $('<div />', {
                id: 'motopress-ce-grid',
                'class': 'mp-container'
            }),
            divDisablePlugin: $('<div />', { 'class': 'motopress-disable-plugin' }),
            isHeadwayTheme: null,
            $topBody: $('body'),
            body: null,
            sceneContent: null,
            sceneContainer: null,
            rowExample: null,
            wpAttachmentDetails: [],
            $form: $('form#mpce-form'),
            $postForm: $('form#post'),
            $postFormMPFields: $('form#post .mpce-form-fields:eq(0)'),
            init: function (el) {
                CE.Iframe.myThis = this;
                CE.Iframe.window = this.element[0].contentWindow;
                CE.Iframe.$window = $(CE.Iframe.window);
                CE.Iframe.wpTextarea = $('#wp-content-editor-container #content');
                el.addClass('motopress-tmp-iframe-width');
                CE.Iframe.myThis.gridObj = parent.motopressCE.settings.library.grid;
                CE.Iframe.myThis.getTinyMCEContent();
                this.$topBody.one('MPCESceneDocError', el, CE.Iframe.myThis.proxy('onError'));
                this.$topBody.one('MPCESceneDocReady', el, CE.Iframe.myThis.proxy('onReady'));
                this.$topBody.one('MPCESceneDocReady', el, CE.Iframe.myThis.proxy('onLoad'));
                this.$topBody.one('MPCESceneDocReady', el, function () {
                    MP.Editor.triggerIfr('ParentEditorReady');
                });    
            },
            destroy: function () {
                try {
                    $(CE.Iframe.window).off('beforeunload.CE.Iframe');
                    $(parent.window).off('beforeunload.CE.Iframe');
                    CE.Iframe.window.CE.Dialog.myThis._destroy();
                    CE.Navbar.myThis._destroy();
                } catch (e) {
                }
                this._super();
            },
            onError: function (e, errorType) {
                var msg = {};
                switch (errorType) {
                case 'nonce':
                    msg = {
                        name: localStorage.getItem('editorNonceErrorName'),
                        message: localStorage.getItem('editorNonceErrorMessage')
                    };
                    break;
                case 'access':
                default:
                    msg = {
                        name: localStorage.getItem('editorAccessErrorName'),
                        message: localStorage.getItem('editorAccessErrorMessage')
                    };
                    break;
                }
                MP.Error.log(msg);
            },
            onReady: function () {
                CE.Iframe.contents = this.element.contents();
                CE.Iframe.$ = CE.Iframe.window.jQuery;
                this.body = CE.Iframe.contents.find('body');
                this.$entryContent = this.body.find('#mpce-editable-content-marker').parent();
                CE.Iframe.$(this.$entryContent).html(decodeURIComponent(this.body.find('#mpce-post-content-template').html() + ''));
                CE.Iframe.contents.find('link[href*="js_composer"]').remove();
                MP.Utils.addWpFrontEndEditorFix();
                CE.Iframe.myThis.wpAttachmentDetails = CE.Iframe.window.mpce_wp_attachment_details;
                this.sceneContent = this.body.find('.motopress-content-wrapper');
                this.contentSectionExists = this.sceneContent.length;    
            },
            onLoad: function () {
                var self = this;
                CE.Navbar.myThis.onIframeLoad(this.element);
                var head = CE.Iframe.contents.find('head')[0];
                this.preventUnload();
                this.body.find('#wp-motopress-tmp-editor-wrap').hide();
                if (!this.sceneContent.length) {
                    this.body.append(this.divDisablePlugin);
                    if (this.isHeadwayTheme) {
                        MP.Flash.setFlash(localStorage.getItem('CENeedHeadwayThemeGrid'), 'error');
                    } else {
                        MP.Flash.setFlash(localStorage.getItem('CENeedContentOutput'), 'error');
                    }
                }
                this.element.removeClass('motopress-tmp-iframe-width');
                var sceneContentWidth = this.sceneContent.width();
                this.body.addClass('motopress-body');
                this.sceneContent.find('script').remove();
                this.sceneContent.wrap('<div class="' + CE.Iframe.myThis.gridObj.span.fullclass + '" />').parent().wrap('<div class="' + CE.Iframe.myThis.gridObj.row.class + ' ' + CE.Iframe.myThis.gridObj.row.edgeclass + ' motopress-row" />').parent().wrap('<div id="motopress-container" class="mp-container" />');
                this.sceneContainer = this.sceneContent.closest('#motopress-container');
                this.rowExample = this.sceneContainer.children('.motopress-row');
                var wrappers = this.sceneContainer.parents();
                var lastIndex = wrappers.length - 3;
                wrappers.each(function (i) {
                    $(this).addClass('motopress-overflow-visible');
                    return i < lastIndex;
                });
                var rowExampleMarginLeft = parseFloat(this.rowExample.css('margin-left'));
                this.rowExample.attr('data-margin-left', rowExampleMarginLeft);
                this.sceneContent.find('.' + CE.Iframe.myThis.gridObj.span.minclass + '.motopress-clmn').addClass('motopress-clmn-min');
                this.setSceneWidth(sceneContentWidth);
                this.unwrapGrid();
                this.body.prepend(this.grid);
                this.$topBody.hide(0, function () {
                    self.$topBody.show();
                });
            },
            setSceneWidth: function (sceneContentWidth) {
                this.sceneContainer.css('max-width', '');
                sceneContentWidth = typeof sceneContentWidth !== 'undefined' ? sceneContentWidth : this.sceneContent.width();
                var docWidth = CE.Iframe.contents.width(), rowExampleMarginLeft = parseFloat(this.rowExample.css('margin-left')), rowExampleMarginRight = parseFloat(this.rowExample.css('margin-right'));
                sceneContentWidth = sceneContentWidth - rowExampleMarginLeft - rowExampleMarginRight;
                if (sceneContentWidth > docWidth)
                    sceneContentWidth = docWidth + (rowExampleMarginLeft + rowExampleMarginRight);
                this.sceneContainer.css('max-width', sceneContentWidth);
                this.grid.css('max-width', sceneContentWidth);
            },
            unwrapGrid: function () {
                this.body.find('div[data-motopress-group="mp_grid"]').each(function () {
                    var $this = $(this);
                    var group = $this.attr('data-motopress-group');
                    var name = $this.attr('data-motopress-shortcode');
                    var attrs = $this.attr('data-motopress-parameters');
                    var styles = $this.attr('data-motopress-styles');
                    var child = $this.children('div');
                    child.attr('data-motopress-group', group);
                    child.attr('data-motopress-shortcode', name);
                    if (attrs.length)
                        child.attr('data-motopress-parameters', attrs);
                    if (styles.length)
                        child.attr('data-motopress-styles', styles);
                    child.unwrap();
                });
            },
            renderContent: function (title, editableContent, pageTemplate) {
                if (typeof title === 'undefined')
                    title = '';
                if (typeof editableContent === 'undefined')
                    editableContent = '';
                if (typeof pageTemplate === 'undefined')
                    pageTemplate = '';
                editableContent = editableContent.replace(/(?:<p>)?<!--more(.*?)?-->(?:<\/p>)?/, '<section class="mpce-wp-more-tag"></section>').replace(/(?:<p>)?<!--more(.*?)?-->(?:<\/p>)?/, '');
                var postStatus = $('#motopress-ce-btn').data('post-status');
                this.$form.find('[name="mpce_title"]').val(title);
                this.$form.find('[name="mpce_editable_content"]').val(editableContent);
                this.$form.find('[name="mpce_page_template"]').val(pageTemplate);
                var expr = new RegExp('\\[/' + CE.Iframe.myThis.gridObj.row.shortcode + '\\]', 'ig');
                if (editableContent.length && !expr.test(editableContent)) {
                    MP.Flash.setFlash(localStorage.getItem('CEDefaultWPEditor'), 'info');
                }
                CE.Iframe.myThis.isHeadwayTheme = motopressCE.info.is_headway_themes;
                if (typeof CE.Iframe.myThis.isHeadwayTheme === 'string') {
                    CE.Iframe.myThis.isHeadwayTheme = parseInt(CE.Iframe.myThis.isHeadwayTheme);
                }
                if (postStatus === 'auto-draft') {
                    var oldTarget = this.$postForm.attr('target'), sceneFormFields = this.$form.find('.mpce-form-fields:eq(0)');
                    this.$postForm.attr('target', 'motopress-content-editor-scene');
                    this.$postFormMPFields.html(sceneFormFields.html());
                    this.$postFormMPFields.find('[name]').each(function () {
                        $(this).val(sceneFormFields.find('[name="' + $(this).attr('name') + '"]').val());
                    });
                    this.$postFormMPFields.append($('<input>', {
                        'type': 'hidden',
                        'name': 'mpce_auto_draft_redirect',
                        'value': this.$form.attr('action')
                    }));
                    this.$postForm.submit();
                    if (typeof oldTarget === 'undefined') {
                        this.$postForm.removeAttr('target');
                    } else {
                        this.$postForm.attr('target', oldTarget);
                    }
                    this.$postFormMPFields.html('');
                } else {
                    this.$form.submit();
                }
                MP.Preloader.myThis.load(CE.Iframe.shortName);
            },
            getTinyMCEContent: function () {
                if (wp.hasOwnProperty('autosave')) {
                    var postData = wp.autosave.getPostData();
                } else {
                    var editor = typeof tinymce !== 'undefined' && tinymce.get('content');
                    if (editor && !editor.isHidden())
                        editor.save();
                    var postData = {
                        post_title: $('#title').val() || '',
                        content: $('#content').val() || '',
                        excerpt: $('#excerpt').val() || ''
                    };
                }
                var self = this, title = postData.post_title, pageTemplateEl = $('[name="page_template"]'), pageTemplate = pageTemplateEl.length ? pageTemplateEl.val() : '';
                if (typeof tinyMCE !== 'undefined') {
                    var activeMode = MP.Utils.getEditorActiveMode($('#wp-content-wrap').prop('class').split(' '));
                    CE.Iframe.wpEditor = tinyMCE.get('content');
                    if (activeMode === 'html-active') {
                        if (switchEditors.hasOwnProperty('switchto')) {
                            switchEditors.switchto($('#content-tmce')[0]);
                        } else {
                            switchEditors.go('content', 'tmce');
                        }
                        if (typeof CE.Iframe.wpEditor === 'undefined' || CE.Iframe.wpEditor === null) {
                            $.when(motopressCE.tinyMCEEditorInited).done(function (editor) {
                                CE.Iframe.wpEditor = editor;
                                self.renderContent(title, self.getEditableContent(CE.Iframe.wpEditor), pageTemplate);
                            });
                        } else {
                            self.renderContent(title, self.getEditableContent(CE.Iframe.wpEditor), pageTemplate);
                        }
                    } else {
                        self.renderContent(title, self.getEditableContent(CE.Iframe.wpEditor), pageTemplate);
                    }
                } else {
                    self.renderContent(title, self.getEditableContent(null), pageTemplate);
                }
            },
            getEditableContent: function (editor) {
                if (editor) {
                    return editor.getContent({ format: 'html' });    
                } else {
                    return CE.Iframe.wpTextarea.val().length ? switchEditors._wp_Autop(CE.Iframe.wpTextarea.val()).replace(new RegExp('\n', 'g'), '') : '';
                }
            },
            appendScript: function (head, script) {
                head.appendChild(script);
            },
            prependScript: function (parent, script) {
                parent.insertBefore(script, parent.firstChild);
            },
            wpLinkCloseCallback: function (callback) {
                $('#wp-link').on('wpdialogclose.motopress', function (e) {
                    $('#wp-link').off('wpdialogclose.motopress');
                    callback();
                });
            },
            preventUnload: function () {
                this.body.find('a').on('click', function (e) {
                    e.preventDefault();
                });
                this.body.find('form').on('submit', function (e) {
                    e.preventDefault();
                });
                var isParentReload = false;
                $(window).on('beforeunload.CE.Iframe', function () {
                    isParentReload = true;
                });
                $(CE.Iframe.window).on('beforeunload.CE.Iframe', function () {
                    if (!isParentReload)
                        return localStorage.getItem('postSaveAlert');
                    isParentReload = false;
                });
            },
            resizeWindow: function () {
                CE.Iframe.window.CE.Utils.triggerWindowEvent('resize');
            },
            setMinWidth: function () {
                this.element.css('min-width', this.minWidth);
            },
            unsetMinWidth: function () {
                this.element.css('min-width', '');
            }
        });
    }(jQuery));
    (function ($) {
        can.Control('CE.Navbar', 
        { myThis: null }, 
        {
            iframe: $('#motopress-content-editor-scene'),
            editorEl: $('#motopress-content-editor'),
            editorWrapperEl: $('#motopress-content-editor-scene-wrapper'),
            scrollWidth: 15,
            postStatus: null,
            postType: null,
            wpPostForm: null,
            presetsMetaField: null,
            privatesMetaField: null,
            postNameObj: null,
            postNameObjInput: null,
            wpPostNameForm: null,
            wpPostNameFormPrompt: null,
            wpPostName: null,
            tutorialsCounter: 0,
            $titles: null,
            hiddenChar: '&zwnj;',
            hiddenCharUnicode: '‌',
            $openEditorBtn: null,
            init: function (el) {
                CE.Navbar.myThis = this;
                CE.Iframe.myThis = null;
                this.wpPostForm = $('form[name="post"]');
                this.wpPostNameForm = this.wpPostForm.find('input[name="post_title"]');
                this.wpPostNameFormPrompt = this.wpPostForm.find('#title-prompt-text');
                this.presetsLastIdMetaField = this.wpPostForm.find('input[name="' + motopressCE.styleEditor.const.wpPostMetaPresetsLastId + '"]');
                this.presetsMetaField = this.wpPostForm.find('textarea[name="' + motopressCE.styleEditor.const.wpPostMetaPresetStyles + '"]');
                this.privatesMetaField = this.wpPostForm.find('textarea[name="' + motopressCE.styleEditor.const.wpPostMetaPrivateStyle + '"]');
                this.postType = el.find('.motopress-page-name #motopress-post-type').text();
                this.postNameObj = el.find('.motopress-page-name #motopress-title');
                this.postNameObjInput = el.find('.motopress-page-name').children('#motopress-input-edit-title');
                this.addWidgetBtn = el.find('#mpce-add-widget');
                this.$openEditorBtn = $('#motopress-ce-btn');
                this.setupBtns();
                $('link[href*="js_composer"]').remove();
                this.showContentEditor();
                this.$openEditorBtn.on('click', function () {
                    CE.Navbar.myThis.iframe = $('#motopress-content-editor-scene');
                    MP.Preloader.myThis.reopen();
                    new MP.Preloader($('#motopress-preload'));
                    new CE.Iframe(CE.Navbar.myThis.iframe);
                    CE.Navbar.myThis.showContentEditor();
                });
                if (this.editorWrapperEl.height() === 0) {
                    var h1 = this.editorWrapperEl.parent().height() - 53;
                    if (h1 > 0)
                        this.editorWrapperEl.height(h1);
                    var h2 = this.editorEl.parent().height() - 32;
                    if (h2 > 0)
                        this.editorEl.height(h2);
                    $(window).resize(function () {
                        var h1 = CE.Navbar.myThis.editorWrapperEl.parent().height() - 53;
                        if (h1 > 0)
                            CE.Navbar.myThis.editorWrapperEl.height(h1);
                        var h2 = CE.Navbar.myThis.editorEl.parent().height() - 32;
                        if (h2 > 0)
                            CE.Navbar.myThis.editorEl.height(h2);
                    });
                }
                MP.Preloader.myThis.load(CE.Navbar.shortName);
            },
            _destroy: function () {
                this.setWidgetBtnInactive();
            },
            onIframeLoad: function (iframe) {
                this.wpPostName = this.wpPostNameForm.val();
                if (this.wpPostName.length === 0) {
                    this.postNameObj.empty().append($('<i />', { text: localStorage.getItem('CEEmptyPostTitle') }));
                    this.postNameObjInput.val('');
                } else {
                    this.postNameObj.text(this.wpPostName);
                    this.postNameObjInput.val(this.wpPostName);
                }
                var titlesRegexp = new RegExp('[' + this.hiddenCharUnicode + ']+');
                this.$titles = CE.Iframe.contents.find(':header:not(:has(canvas))').filter(function () {
                    return titlesRegexp.test($(this).text());
                });
                this.scrollWidth = MP.Utils.getScrollbarWidth();
                var minWidth = this.scrollWidth + 724 + 80;
                CE.Iframe.myThis.minWidth = minWidth;
                CE.Iframe.myThis.setMinWidth();
                $('.motopress-content-editor-navbar.ce_navbar').css('min-width', minWidth);
            },
            setupBtns: function () {
                var saveBtn = $('form#post input#save-post');
                var btnText = '';
                if (saveBtn.length) {
                    this.postStatus = 'draft';
                    btnText = localStorage.getItem('CEPublishBtnText');
                } else {
                    this.postStatus = 'published';
                    btnText = localStorage.getItem('CEUpdateBtnText');
                    $('#motopress-content-editor-save').hide();
                }
                $('#motopress-content-editor-publish').text(btnText);
            },
            '#motopress-title click': function (el, e) {
                this.postNameObj.addClass('motopress-hide');
                this.postNameObjInput.removeClass('motopress-hide').select();
            },
            '#motopress-input-edit-title blur': function (el, e) {
                var self = el[0];
                if (self.value == '') {
                    this.postNameObj.empty().append($('<i />', { text: localStorage.getItem('CEEmptyPostTitle') }));
                    this.wpPostNameForm.val(self.value);
                    this.wpPostNameFormPrompt.removeClass('screen-reader-text');
                } else {
                    this.postNameObj.text(self.value);
                    this.wpPostNameForm.val(self.value);
                    this.wpPostNameFormPrompt.addClass('screen-reader-text');
                }
                this.renderTitle(self.value);
                this.postNameObjInput.addClass('motopress-hide');
                this.postNameObj.removeClass('motopress-hide');
                CE.Save.changeContent();
            },
            '#motopress-input-edit-title keypress': function (el, event) {
                var self = el[0];
                if (event.keyCode == '13') {
                    if (self.value == '') {
                        this.postNameObj.empty().append($('<i />', { text: localStorage.getItem('CEEmptyPostTitle') }));
                        this.wpPostNameForm.val(self.value);
                        this.wpPostNameFormPrompt.removeClass('screen-reader-text');
                    } else {
                        this.postNameObj.text(self.value);
                        this.wpPostNameForm.val(self.value);
                        this.wpPostNameFormPrompt.addClass('screen-reader-text');
                    }
                    this.renderTitle(self.value);
                    this.postNameObjInput.addClass('motopress-hide');
                    this.postNameObj.removeClass('motopress-hide');
                    CE.Save.changeContent();
                }
            },
            '#motopress-content-editor-tutorials click': function (e) {
                var modalData = jQuery('#motopress-tutorials-modal'), bodyBG = jQuery('body');
                modalData.mpmodal('toggle');
                if (this.tutorialsCounter === 0) {
                    jQuery.ajax({
                        type: 'post',
                        dataType: 'html',
                        url: motopress.ajaxUrl,
                        data: { action: 'motopress_tutorials' },
                        success: function (response) {
                            if (response != 0 && response != 'nothing') {
                                modalData.find('.modal-body').html(response);
                            } else {
                                modalData.find('.modal-body').html('<h1>Error: can\'t load tutorials.<h1>');
                            }
                        }
                    });
                }
                this.tutorialsCounter++;
            },
            '#motopress-content-editor-publish click': function (el) {
                CE.Save.convertAndInsert();
                if (!el.hasClass('motopress-ajax-update')) {
                    MP.Preloader.myThis.show();
                    this.setPluginAutoOpen(true);
                    CE.Save.publishWithReload();
                } else {
                    el.prop('disabled', true).text(localStorage.getItem('CEUpdating'));
                    var $this = this;
                    var jqSaveXHR = CE.Save.saveAJAX();
                    jqSaveXHR.done(function () {
                        el.prop('disabled', false).text(localStorage.getItem('CEUpdateBtnText'));
                        var previewLink = jQuery('#post-preview').attr('href');
                        MP.Flash.setFlash(parent.MP.Utils.strtr(localStorage.getItem('CEPostSaved'), {
                            '%postType%': $this.postType,
                            '%link%': previewLink,
                            '%preview%': localStorage.getItem('CEPreviewBtnText')
                        }), 'success');
                        MP.Flash.showMessage();
                    });
                }
            },
            '#motopress-content-editor-save click': function (el) {
                CE.Save.convertAndInsert();
                var $this = this;
                if (!el.hasClass('motopress-ajax-update')) {
                    MP.Preloader.myThis.show();
                    CE.Navbar.myThis.setPluginAutoOpen(true);
                    CE.Save.saveWithReload();
                } else {
                    el.prop('disabled', true).text(localStorage.getItem('CESaving'));
                    var jqSaveXHR = CE.Save.saveAJAX();
                    jqSaveXHR.done(function () {
                        el.prop('disabled', false).text(localStorage.getItem('CESaveBtnText'));
                        var previewLink = jQuery('#post-preview').attr('href');
                        MP.Flash.setFlash(parent.MP.Utils.strtr(localStorage.getItem('CEPostSaved'), {
                            '%postType%': $this.postType,
                            '%link%': previewLink,
                            '%preview%': localStorage.getItem('CEPreviewBtnText')
                        }), 'success');
                        MP.Flash.showMessage();
                    });
                }
            },
            '#motopress-content-editor-preview click': function () {
                CE.Save.convertAndInsert();
                $('form#post #post-preview').click();
            },
            '#mpce-add-widget click': function ($btn) {
                if ($btn.hasClass('active')) {
                    this.setWidgetBtnInactive();
                    this.setLeftBarInactive();
                } else {
                    this.setWidgetBtnActive();
                    this.setLeftBarActive();
                }
            },
            setWidgetBtnActive: function () {
                this.addWidgetBtn.addClass('active');
            },
            setWidgetBtnInactive: function () {
                this.addWidgetBtn.removeClass('active');
            },
            setLeftBarActive: function () {
                CE.Iframe.window.CE.LeftBar.myThis.setActive();
                CE.Iframe.window.CE.LeftBar.myThis.show(true);
            },
            setLeftBarInactive: function () {
                CE.Iframe.window.CE.LeftBar.myThis.setInactive();
                CE.Iframe.window.CE.LeftBar.myThis.hide(true);
            },
            '#motopress-content-editor-delete click': function () {
                CE.Iframe.window.CE.Tools.myThis.removeBlock();
                CE.Save.changeContent();
            },
            '#motopress-content-editor-duplicate click': function () {
                CE.Iframe.window.CE.Tools.myThis.duplicateBlock();
                CE.Save.changeContent();
            },
            '#motopress-content-editor-close click': function () {
                CE.Save.convertAndInsert();
                this.hideContentEditor();
                MP.Utils.removeWindowFix();
                MP.Utils.removeWpFrontEndEditorFix();
                this.hideObjectControlBtns();
                this.iframe.remove();
                MP.Editor.myThis.close();
            },
            '#motopress-content-editor-device-mode-preview click': function (el, e) {
                this.hide();
                CE.PreviewDevice.myThis.show();
                CE.PreviewDevice.myThis.preview('desktop');
            },
            hide: function () {
                this.abortShow();
                this.element.addClass('motopress-ce-navbar-hide').one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function (el, e) {
                    CE.Navbar.myThis.element.addClass('motopress-hide');
                    CE.Navbar.myThis.element.removeClass('motopress-ce-navbar-hide');
                });
            },
            show: function () {
                this.abortHide();
                this.element.addClass('motopress-ce-navbar-show').removeClass('motopress-hide').one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function () {
                    CE.Navbar.myThis.element.removeClass('motopress-ce-navbar-show');
                });
            },
            abortShow: function () {
                this.element.removeClass('motopress-ce-navbar-show').off('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd');
            },
            abortHide: function () {
                this.element.removeClass('motopress-ce-navbar-hide').off('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd');
            },
            renderTitle: function (value) {
                var self = this;
                this.$titles.each(function () {
                    $(this).html($(this).html().replace(new RegExp(self.hiddenCharUnicode + '.*' + self.hiddenCharUnicode, 'g'), self.hiddenChar + value + self.hiddenChar));
                });
            },
            hideContentEditor: function () {
                MP.Error.terminate();
            },
            showContentEditor: function () {
                $('html').css({
                    overflow: 'hidden',
                    paddingTop: 0
                });
                this.editorEl.siblings(':not("#' + MP.Preloader.myThis.element.attr('id') + ', script, link")').each(function () {
                    if (!$(this).is(':hidden')) {
                        $(this).addClass('motopress-hide');
                    }
                });
                $('#wpwrap').height('100%').children('#wpcontent').children('#wpadminbar').prependTo('body');
                this.editorEl.show();
            },
            showObjectControlBtns: function () {
                $('.motopress-object-control-btns').css('display', 'inline-block');
            },
            hideObjectControlBtns: function () {
                $('.motopress-object-control-btns').hide();
            },
            setPluginAutoOpen: function (value) {
                sessionStorage.setItem('motopressPluginAutoOpen', value);
            },
            getPluginAutoOpen: function () {
                sessionStorage.getItem('motopressPluginAutoOpen');
            }
        });
    }(jQuery));
    (function ($) {
        CE.PreviewDevice = can.Control.extend(
        { myThis: null }, 
        {
            mode: null,
            previewClassPrefix: 'motopress-ce-device-mode-',
            init: function (el) {
                CE.PreviewDevice.myThis = this;
            },
            hide: function () {
                this.abortShow();
                this.element.addClass('motopress-content-editor-preview-device-panel-hide').one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function (el, e) {
                    CE.PreviewDevice.myThis.element.addClass('motopress-hide').removeClass('motopress-content-editor-preview-device-panel-hide');
                });
            },
            isHiding: function () {
                return this.element.hasClass('motopress-content-editor-preview-device-panel-hide');
            },
            show: function () {
                this.abortHide();
                this.element.addClass('motopress-content-editor-preview-device-panel-show').removeClass('motopress-hide').one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function (el, e) {
                    CE.PreviewDevice.myThis.element.removeClass('motopress-content-editor-preview-device-panel-show');
                });
            },
            abortShow: function () {
                this.element.removeClass('motopress-content-editor-preview-device-panel-show').off('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd');
            },
            abortHide: function () {
                this.element.removeClass('motopress-content-editor-preview-device-panel-hide').off('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd');
            },
            '.motopress-content-editor-preview-mode-btn click': function (el, e) {
                if (this.isHiding()) {
                    this.show();
                    CE.Navbar.myThis.hide();
                }
                var mode = $(el).attr('data-mode');
                this.preview(mode);
            },
            '.motopress-content-editor-preview-edit click': function (el, e) {
                this.unsetPreview();
                this.hide();
                CE.Navbar.myThis.show();
            },
            preview: function (mode) {
                if (this.mode === null) {
                    CE.Iframe.window.CE.Selectable.myThis.unselect();
                    CE.Iframe.window.CE.StyleEditor.myThis.unsetEmulateCSSMode();
                    CE.Iframe.window.CE.InlineEditor.destroyAll();
                    CE.Iframe.window.CE.Utils.addSceneAction('device-preview');
                    CE.Iframe.myThis.unsetMinWidth();
                }
                if (mode !== this.mode) {
                    var oldModeClass = this.mode !== null ? this.previewClassPrefix + this.mode : '';
                    var modeClass = this.previewClassPrefix + mode;
                    CE.Navbar.myThis.iframe.removeClass(oldModeClass).addClass(modeClass);
                    CE.Navbar.myThis.editorWrapperEl.addClass('motopress-ce-full-height');
                    CE.Iframe.myThis.body.removeClass(oldModeClass).addClass(modeClass);
                    CE.Iframe.window.CE.Utils.triggerWindowEvent('resize');
                    this.mode = mode;
                }
            },
            unsetPreview: function () {
                var previewClass = this.previewClassPrefix + this.mode;
                CE.Navbar.myThis.iframe.removeClass(previewClass);
                CE.Iframe.window.CE.StyleEditor.myThis.setEmulateCSSMode();
                CE.Iframe.window.CE.InlineEditor.reinitAll();
                CE.Navbar.myThis.editorWrapperEl.removeClass('motopress-ce-full-height');
                CE.Iframe.myThis.body.removeClass(previewClass);
                CE.Iframe.myThis.setMinWidth();
                CE.Iframe.window.CE.Utils.removeSceneAction('device-preview');
                this.mode = null;
            }
        });
    }(jQuery));
    (function ($) {
        CE.Save = can.Construct({
            isContentChanged: false,
            excerpt: '',
            contentSavedInCE: false,
            isNeedSaveExcerpt: false,
            compareString: '',
            storedBeforeunload: [],
            _storeEditorIsDirtyFunc: null,
            _editorIsDirty: false,
            _hasDirtyFunc: false,
            wpEditor: null,
            init: function () {
                this.wpEditor = tinyMCE.get('content');
                this.storeEditorFunc();
                this.storeWpEvents();
                MP.Editor.on('EditorOpen', this.proxy('open'));
                MP.Editor.on('EditorClose', this.proxy('close'));
            },
            open: function () {
                this.bindCustomEditorFunc();
            },
            close: function () {
                this.unbindCustomEditorFunc();
                this.bindWpEvents();
            },
            getCompareString: function () {
                return ($('#title').val() || '') + '::' + ($('#content').val() || '') + '::' + ($('#excerpt').val() || '');
            },
            saveWithReload: function () {
                this.saveContent();
                $('form#post #save-post').click();
            },
            publishWithReload: function () {
                this.saveContent();
                $('form#post #publish').click();
            },
            saveAJAX: function () {
                this.saveContent();
                var data = $('form#post').serializeArray();
                var $this = this;
                return $.ajax({
                    type: 'post',
                    data: data,
                    success: function (responce) {
                        MP.Editor.triggerEverywhere('AfterUpdate');
                        $this.contentSavedInCE = true;
                    },
                    error: function (jqXHR) {
                        console.log(jqXHR);
                    }
                });
            },
            saveContent: function () {
                MP.Editor.triggerEverywhere('BeforeSave');
                this.isContentChanged = false;
                CE.Save._editorIsDirty = false;
                this.unbindWpEvents();
            },
            convertAndInsert: function () {
                var dom = CE.Iframe.contents.find('body .motopress-content-wrapper');
                if (dom.length) {
                    var src = '';
                    this.isNeedSaveExcerpt = false;
                    this.excerpt = '';
                    src = this.getSources(src, dom);
                    if (parent.CE.Iframe.wpEditor !== null) {
                        parent.CE.Iframe.wpEditor.setContent(src, { format: 'html' });
                        tinyMCE.triggerSave();
                    } else {
                        parent.CE.Iframe.wpTextarea.val(parent.switchEditors._wp_Nop(src));
                    }
                    if (parent.MP.Settings.saveExcerpt && this.isNeedSaveExcerpt) {
                        var excerptEl = $('#postexcerpt #excerpt', parent.document);
                        if (excerptEl.length) {
                            excerptEl.val(parent.switchEditors._wp_Nop(this.excerpt));
                        }
                    }
                }
            },
            getSources: function (src, dom, level) {
                if (typeof level === 'undefined')
                    level = 1;
                var $this = this, mpRow = null, mpSpan = null;
                if (level === 1) {
                    mpRow = parent.CE.Iframe.myThis.gridObj.row.shortcode;
                } else {
                    mpRow = parent.CE.Iframe.myThis.gridObj.row.inner;
                }
                dom.children('.motopress-row, .mpce-wp-more-tag').each(function () {
                    var row = $(this);
                    if (level === 1 && row.hasClass('mpce-wp-more-tag')) {
                        $this.isNeedSaveExcerpt = true;
                        $this.excerpt = src;
                        src += '<!--more-->';
                    } else {
                        var rowEdge = parent.MP.Utils.getEdgeRow($(this));
                        src += '<p>[' + mpRow + $this.getAttributes(row) + ']</p>';
                        rowEdge.children('.motopress-clmn').each(function () {
                            var span = $(this), spanEdge = MP.Utils.getEdgeSpan(span), spanClass = MP.Utils.getSpanClass(span.prop('class').split(' ')), col = MP.Utils.getSpanNumber(spanClass), style = '', mpSpanAttr = '';
                            var minHeight = span.get(0).style.minHeight;
                            if (minHeight.length) {
                                var minHeightInt = parseInt(minHeight);
                                if (!isNaN(minHeightInt) && minHeightInt !== CE.Iframe.window.CE.Resizer.myThis.minHeight && minHeightInt !== CE.Iframe.window.CE.Resizer.myThis.spaceMinHeight) {
                                    style = ' style="min-height: ' + minHeight + ';"';
                                }
                            }
                            if (parent.CE.Iframe.myThis.gridObj.span.type && parent.CE.Iframe.myThis.gridObj.span.type === 'multiple') {
                                if (level === 1) {
                                    mpSpan = parent.CE.Iframe.myThis.gridObj.span.shortcode[col - 1];
                                    mpSpanAttr = '';
                                } else {
                                    mpSpan = parent.CE.Iframe.myThis.gridObj.span.inner[col - 1];
                                    mpSpanAttr = '';
                                }
                            } else {
                                mpSpanAttr = ' ' + parent.CE.Iframe.myThis.gridObj.span.attr + '="' + col + '"';
                                if (level === 1) {
                                    mpSpan = parent.CE.Iframe.myThis.gridObj.span.shortcode;
                                } else {
                                    mpSpan = parent.CE.Iframe.myThis.gridObj.span.inner;
                                }
                            }
                            src += '<p>[' + mpSpan + mpSpanAttr + style + $this.getAttributes(span) + ']</p>';
                            if (spanEdge.children('.motopress-row').length) {
                                src = $this.getSources(src, spanEdge, level + 1);
                            } else {
                                src = $this.getShortcode(src, spanEdge.find('.motopress-block-content > [data-motopress-shortcode]'));
                            }
                            src += '<p>[/' + mpSpan + ']</p>';
                        });
                        src += '<p>[/' + mpRow + ']</p>';
                    }
                });
                return src;
            },
            getShortcode: function (src, shortcode) {
                if (shortcode.length) {
                    var shortcodeSrc = '';
                    var name = shortcode.attr('data-motopress-shortcode');
                    var closeType = shortcode.attr('data-motopress-close-type');
                    var unwrap = typeof shortcode.attr('data-motopress-unwrap') === 'undefined' ? false : true;
                    var start = '';
                    var end = '';
                    if (closeType === 'enclosed') {
                        var content = shortcode.attr('data-motopress-content');
                        content = !content ? '' : content.replace(/\[\]/g, '[');
                        shortcodeSrc += content;
                        end = '<p>[/' + name + ']</p>';
                    }
                    if (!unwrap || !this.isEmptyStyles(shortcode)) {
                        start = '<p>[' + name + this.getAttributes(shortcode) + ']</p>';
                        shortcodeSrc = start + shortcodeSrc + end;
                    }
                    src += shortcodeSrc;
                }
                return src;
            },
            changeContent: function () {
                if (!this.isContentChanged) {
                    var wpEditor = parent.CE.Iframe.wpEditor;
                    if (wpEditor) {
                        this.bindWpEvents();
                        CE.Save._editorIsDirty = true;
                        this.isContentChanged = true;
                    }
                }
            },
            getAttributes: function (obj) {
                var attributes = {};
                var parameters = obj.attr('data-motopress-parameters') ? JSON.parse(obj.attr('data-motopress-parameters')) : {};
                var styles = obj.attr('data-motopress-styles') ? JSON.parse(obj.attr('data-motopress-styles')) : {};
                $.extend(attributes, parameters, styles);
                var result = '';
                if (attributes) {
                    var shortcodeGroup = obj.attr('data-motopress-group'), shortcodeName = obj.attr('data-motopress-shortcode');
                    var shortcodeParameters = CE.Iframe.window.CE.LeftBar.myThis.library[shortcodeGroup].objects[shortcodeName].parameters;
                    if (shortcodeName === parent.CE.Iframe.myThis.gridObj.span.shortcode || shortcodeName === parent.CE.Iframe.myThis.gridObj.span.inner) {
                        if (obj.hasClass('motopress-empty')) {
                            if (!attributes.hasOwnProperty(parent.CE.Iframe.myThis.gridObj.span.custom_class_attr)) {
                                attributes[parent.CE.Iframe.myThis.gridObj.span.custom_class_attr] = {};
                            }
                            if (!attributes[parent.CE.Iframe.myThis.gridObj.span.custom_class_attr].hasOwnProperty('value')) {
                                attributes[parent.CE.Iframe.myThis.gridObj.span.custom_class_attr].value = '';
                            }
                            attributes[parent.CE.Iframe.myThis.gridObj.span.custom_class_attr].value = attributes[parent.CE.Iframe.myThis.gridObj.span.custom_class_attr].value + ' motopress-empty mp-hidden-phone';
                        }
                        if (obj.hasClass('motopress-space')) {
                            if (!attributes.hasOwnProperty(parent.CE.Iframe.myThis.gridObj.span.custom_class_attr)) {
                                attributes[parent.CE.Iframe.myThis.gridObj.span.custom_class_attr] = {};
                            }
                            if (!attributes[parent.CE.Iframe.myThis.gridObj.span.custom_class_attr].hasOwnProperty('value')) {
                                attributes[parent.CE.Iframe.myThis.gridObj.span.custom_class_attr].value = '';
                            }
                            attributes[parent.CE.Iframe.myThis.gridObj.span.custom_class_attr].value = attributes[parent.CE.Iframe.myThis.gridObj.span.custom_class_attr].value + ' motopress-space';
                        }
                    }
                    $.each(attributes, function (key, attrs) {
                        if (shortcodeParameters.hasOwnProperty(key) && shortcodeParameters[key].hasOwnProperty('saveInContent') && shortcodeParameters[key].saveInContent == 'true') {
                            attrs.value = '';
                        }
                        if ($.inArray(shortcodeName, [
                                'mp_row',
                                'mp_row_inner'
                            ]) !== -1) {
                            if (shortcodeParameters.hasOwnProperty(key) && typeof shortcodeParameters[key].disabled !== 'undefined' && shortcodeParameters[key].disabled === 'true' && $.inArray(key, [
                                    'bg_video_youtube',
                                    'bg_video_youtube_cover',
                                    'bg_video_webm',
                                    'bg_video_mp4',
                                    'bg_video_ogg',
                                    'bg_video_cover',
                                    'parallax_image',
                                    'parallax_bg_size'
                                ]) !== -1) {
                                return;
                            }
                            if (key === 'full_height' && shortcodeParameters.hasOwnProperty(key) && shortcodeParameters[key]['default'] === attrs.value) {
                                attrs.value = '';
                            }
                            if (shortcodeParameters.hasOwnProperty(key) && shortcodeParameters[key].dependency && attributes[shortcodeParameters[key].dependency.parameter].value !== shortcodeParameters[key].dependency.value && (typeof shortcodeParameters[key].disabled === 'undefined' || shortcodeParameters[key].disabled === 'false')) {
                                return;
                            }
                        }
                        if (typeof attrs.value !== 'undefined' && attrs.value !== '')
                            result += ' ' + key + '="' + attrs.value + '"';
                    });
                }
                return result;
            },
            storeWpEvents: function () {
                var storedBeforeunload = [];
                if (MP.Utils.version_compare($.fn.jquery, '1.8', '<')) {
                    storedBeforeunload = $(window).data('events').beforeunload;
                } else {
                    storedBeforeunload = $._data(window, 'events').beforeunload;
                }
                if (typeof storedBeforeunload !== 'undefined') {
                    this.storedBeforeunload = storedBeforeunload.slice();
                }
                if (typeof window.onbeforeunload === 'function') {
                    this.storedBeforeunload.unshift({
                        'handler': window.onbeforeunload,
                        'namespace': 'edit-post'
                    });
                    window.onbeforeunload = null;
                }
            },
            storeEditorFunc: function () {
                if (this.wpEditor && typeof this.wpEditor.isDirty !== 'undefined') {
                    this._storeEditorIsDirtyFunc = this.wpEditor.isDirty;
                    this._hasDirtyFunc = true;
                } else {
                    this._hasDirtyFunc = false;
                }
            },
            bindCustomEditorFunc: function () {
                if (this._hasDirtyFunc) {
                    this.wpEditor.focus();
                    this.wpEditor.isDirty = this._editorIsDirtyFunc;
                    tinyMCE.activeEditor.isDirty = this._editorIsDirtyFunc;
                }
            },
            unbindCustomEditorFunc: function () {
                if (this._hasDirtyFunc) {
                    this.wpEditor.isDirty = this._storeEditorIsDirtyFunc;
                    tinyMCE.activeEditor.isDirty = this._storeEditorIsDirtyFunc;
                }
            },
            _editorIsDirtyFunc: function () {
                return CE.Save._editorIsDirty;
            },
            bindWpEvents: function () {
                if (typeof this.storedBeforeunload !== 'undefined' && this.storedBeforeunload.length) {
                    this.unbindWpEvents();
                    for (var i = 0; i < this.storedBeforeunload.length; i++) {
                        if (this.storedBeforeunload[i].namespace === 'edit-post') {
                            $(window).bind('beforeunload.edit-post', this.storedBeforeunload[i].handler);
                        }
                    }
                }
            },
            unbindWpEvents: function () {
                $(window).unbind('beforeunload.edit-post');
            },
            isEmptyStyles: function (shortcodeObj) {
                var isEmpty = true;
                var styles = shortcodeObj.attr('data-motopress-styles') ? JSON.parse(shortcodeObj.attr('data-motopress-styles')) : {};
                $.each(styles, function (name, attrs) {
                    if (typeof attrs.value !== 'undefined' && attrs.value !== '') {
                        isEmpty = false;
                        return;
                    }
                });
                return isEmpty;
            }
        }, {});
    }(jQuery));
    (function ($) {
        MP.Settings = can.Construct(
        {
            siteUrl: null,
            debug: null,
            adminUrl: null,
            pluginRootUrl: null,
            pluginName: null,
            pluginDirUrl: null,
            palettes: null,
            lang: null,
            langName: null,
            loadScriptsUrl: null,
            spellcheck: null,
            saveExcerpt: null,
            removeWpPanels: function () {
                $('#footer, #adminmenuwrap, #adminmenuback, .update-nag').remove();
                $('#wpcontent').css('margin-left', 0);
                $('#wpbody-content').css('padding-bottom', 0);
                $('#wpfooter').remove();
            },
            getSiteUrl: function () {
                var href = window.location.href;
                var hrefLen = href.indexOf('/wp-admin/');
                this.siteUrl = href.substr(0, hrefLen);
            },
            getWpSettings: function () {
                var data = motopressCE.settings.wp;
                MP.Settings.debug = data.debug;
                MP.Settings.adminUrl = data.admin_url;
                MP.Settings.pluginRootUrl = data.plugin_root_url;
                MP.Settings.pluginName = data.plugin_name;
                MP.Settings.pluginDirUrl = data.plugin_dir_url;
                MP.Settings.palettes = data.palettes;
                MP.Settings.licenseType = data.license_type;
                MP.Settings.lang = data.lang;
                MP.Settings.loadScriptsUrl = data.load_scripts_url;
                MP.Settings.spellcheck = data.spellcheck == '1';
                MP.Settings.saveExcerpt = data.save_excerpt === '1';
                if (MP.Utils.Browser.IE || MP.Utils.Browser.Opera) {
                    window.location = MP.Settings.adminUrl + '?page=' + MP.Settings.pluginName;
                }
            }
        }, 
        {
            setup: function () {
                if (typeof CE === 'undefined')
                    this.removeWpPanels();
                MP.Settings.getSiteUrl();
                MP.Settings.getWpSettings();
            }
        });
    }(jQuery));
    (function ($) {
        can.Construct('MP.Language', {}, {
            init: function () {
                localStorage.clear();
                $.each(motopressCE.settings.translations, function (key, value) {
                    localStorage.setItem(key, value);
                });
                MP.Preloader.myThis.load(MP.Language.shortName);
            }
        });
    }(jQuery));
    (function ($) {
        CE.PresetSaveModal = can.Control.extend(
        {
            myThis: null,
            listensTo: [
                'show',
                'shown',
                'hide'
            ]
        }, 
        {
            saveBtn: null,
            updateBtn: null,
            privateStyleObj: null,
            presetStyleObj: null,
            presetSelect: null,
            presetSelectWrapper: null,
            presetNameInput: null,
            presetNameInputWrapper: null,
            presetInheritanceDesc: null,
            presetInheritanceName: null,
            init: function () {
                CE.PresetSaveModal.myThis = this;
                this.initButtons();
                this.initForm();
                this.element.mpmodal({
                    'backdrop': 'static',
                    'show': false
                });
            },
            initButtons: function () {
                this.createBtn = this.element.find('#motopress-ce-create-preset');
                this.updateBtn = this.element.find('#motopress-ce-update-preset');
            },
            initForm: function () {
                this.presetSelect = this.element.find('#motopress-ce-save-preset-select');
                this.presetSelectWrapper = this.element.find('.motopress-ce-save-preset-select-wrapper');
                this.presetNameInput = this.element.find('#motopress-ce-save-preset-name');
                this.presetNameInputWrapper = this.element.find('.motopress-ce-save-preset-name-wrapper');
                this.presetInheritanceDesc = this.element.find('.motopress-ce-preset-inheritance');
                this.presetInheritanceName = this.presetInheritanceDesc.find('.motopress-ce-preset-inheritance-name');
            },
            ' show': function (el, e) {
                this.updatePresetsList();
                this.formReset();
            },
            ' shown': function () {
                this.presetNameInput.focus();
            },
            ' hide': function (el, e) {
                this.defer.reject();
            },
            updatePresetsList: function () {
                var list = CE.Iframe.window.CE.StyleEditor.myThis.getPresetsList();
                var options = [];
                $.each(list, function (name, label) {
                    options.push($('<option />', {
                        value: name,
                        text: label
                    }));
                });
                this.presetSelect.find('optgroup').html(options);
                if (!options.length) {
                    this.presetSelect.find('optgroup').addClass('motopress-hide');
                } else {
                    this.presetSelect.find('optgroup').removeClass('motopress-hide');
                }
            },
            '#motopress-ce-save-preset-select change': function () {
                this.updateControlsVisibility();
            },
            'keydown': function (el, e) {
                if (e.which === $.ui.keyCode.ENTER) {
                    $(this.createBtn, this.updateBtn).filter(':not(.motopress-hide)').click();
                }
            },
            updateControlsVisibility: function () {
                var presetName = this.presetSelect.val();
                if (presetName === '') {
                    this.presetNameInputWrapper.removeClass('motopress-hide');
                    this.updateBtn.addClass('motopress-hide');
                    this.createBtn.removeClass('motopress-hide');
                } else {
                    this.presetNameInputWrapper.addClass('motopress-hide');
                    this.updateBtn.removeClass('motopress-hide');
                    this.createBtn.addClass('motopress-hide');
                }
            },
            formReset: function () {
                this.presetSelect.val('');
                this.presetNameInput.val('');
                if (this.presetStyleObj !== null) {
                    this.presetInheritanceName.text(this.presetStyleObj.getLabel());
                    this.presetInheritanceDesc.removeClass('motopress-hide');
                } else {
                    this.presetInheritanceName.text('');
                    this.presetInheritanceDesc.addClass('motopress-hide');
                }
                this.updateControlsVisibility();
            },
            showModal: function (privateStyleObj, presetStyleObj) {
                this.privateStyleObj = privateStyleObj;
                this.presetStyleObj = presetStyleObj;
                this.element.mpmodal('show');
                this.defer = $.Deferred();
                return this.defer.promise();
            },
            '#motopress-ce-create-preset click': function () {
                var presetLabel = $.trim(this.presetNameInput.val());
                var presetSettings = this.presetStyleObj !== null ? this.presetStyleObj.getSettings() : {};
                $.extend(true, presetSettings, this.privateStyleObj.getSettings());
                var newPresetObj = CE.Iframe.window.CE.StyleEditor.myThis.createPreset(presetLabel, presetSettings);
                this.defer.resolve(newPresetObj.getClassName());
                this.element.mpmodal('hide');
            },
            '#motopress-ce-update-preset click': function () {
                var presetClass = this.presetSelect.val();
                var selectedPresetObj = CE.Iframe.window.CE.StyleEditor.myThis.getPresetStyleInstance(presetClass);
                var presetSettings = this.presetStyleObj !== null ? this.presetStyleObj.getSettings() : {};
                $.extend(true, presetSettings, this.privateStyleObj.getSettings());
                selectedPresetObj.update(presetSettings);
                this.defer.resolve(selectedPresetObj.getClassName());
                this.element.mpmodal('hide');
            }
        });
    }(jQuery));
    (function ($) {
        CE.CodeModal = can.Control.extend(
        {
            myThis: null,
            currentShortcode: null,
            currentTextareaTinymce: null,
            listensTo: [
                'show',
                'shown',
                'hide'
            ]
        }, 
        {
            iframeBody: null,
            content: null,
            editor: null,
            saveBtn: null,
            saveHandler: null,
            isHiding: false,
            init: function () {
                CE.CodeModal.myThis = this;
                this.container = this.element.find('#wp-motopresscodecontent-editor-container');
                this.content = this.element.find('#motopresscodecontent');
                if (typeof tinyMCE !== 'undefined' && typeof tinyMCE.get('motopresscodecontent') !== 'undefined') {
                    this.editor = tinyMCE.get('motopresscodecontent');
                }
                this.saveBtn = this.element.find('#motopress-save-code-content');
                var tools = this.element.find('#wp-motopresscodecontent-editor-tools');
                if (tools.height() === 0) {
                    tools.height(33);
                }
                this.element.mpmodal({
                    'backdrop': 'static',
                    'show': false
                });
                $(window).on('resize', this.proxy('resize'));
                MP.Utils.addWindowFix();
                if (parent.MP.Utils.version_compare(parent.motopressCE.settings.wp.wordpress_version, '4.0.0', '>=')) {
                    this.element.find('.wp-switch-editor.switch-html, .wp-switch-editor.switch-tmce').on('click', function () {
                        CE.CodeModal.myThis.recalcTabSizeWP4();
                    });
                }
            },
            setSize: function (isHidden) {
                var footer = this.element.find('.modal-footer');
                var footerWidth = this.element.width() - (parseFloat(footer.css('padding-left')) + parseFloat(footer.css('padding-right')));
                footer.width(footerWidth);
                var body = this.element.find('.modal-body');
                var bodyHeight = this.element.height() - this.element.find('.modal-header').outerHeight() - parseFloat(body.css('margin-top')) - parseFloat(body.css('margin-bottom')) - footer.outerHeight();
                body.height(bodyHeight);
                if (isHidden) {
                    this.element.css({
                        display: 'block',
                        visibility: 'hidden'
                    });
                }
                var magicPixels = parent.MP.Utils.version_compare(parent.motopressCE.settings.wp.wordpress_version, '4.1.0', '>=') ? 2 : 0;
                var containerHeight = this.element.find('#wp-motopresscodecontent-wrap').height() - this.element.find('#wp-motopresscodecontent-editor-tools').outerHeight() - parseFloat(this.container.css('border-top-width')) - parseFloat(this.container.css('border-bottom-width')) - magicPixels;
                this.container.height(containerHeight);
                if (parent.MP.Utils.version_compare(parent.motopressCE.settings.wp.wordpress_version, '4.0.0', '<')) {
                    this.recalcTabSizeWPOld();
                } else {
                    this.recalcTabSizeWP4();
                }
                if (isHidden) {
                    this.element.css({
                        display: '',
                        visibility: ''
                    });
                    this.content.removeAttr('rows');
                }
            },
            recalcTabSizeWPOld: function () {
                var contentHeight = this.container.height() - parseFloat(this.container.css('border-top-width')) - parseFloat(this.container.css('border-bottom-width')) - this.element.find('#qt_motopresscodecontent_toolbar').outerHeight() - parseFloat(this.content.css('padding-top')) - parseFloat(this.content.css('padding-bottom'));
                this.content.height(contentHeight);
                var contentIfr = this.element.find('#motopresscodecontent_ifr');
                var mceFirst = this.container.find('.mce-first, tr.mceFirst').first();
                var mceLast = this.container.find('.mce-statusbar, tr.mceLast').last();
                var contentIfrHeight = this.container.height() - parseFloat(this.container.css('border-top-width')) - parseFloat(this.container.css('border-bottom-width')) - mceFirst.outerHeight() - mceLast.outerHeight();
                contentIfr.height(contentIfrHeight);
            },
            recalcTabSizeWP4: function () {
                var activeMode = MP.Utils.getEditorActiveMode(this.element.find('#wp-motopresscodecontent-wrap').prop('class').split(' '));
                switch (activeMode) {
                case 'html-active':
                    var contentHeight = this.container.height() - this.element.find('#qt_motopresscodecontent_toolbar').outerHeight() - parseFloat(this.content.css('padding-top')) - parseFloat(this.content.css('padding-bottom'));
                    this.content.height(contentHeight);
                    break;
                case 'tmce-active':
                    var editAreaHeight = this.container.height() - parseFloat(this.container.find('.mce-toolbar-grp').outerHeight()) - parseFloat(this.container.find('.mce-statusbar').outerHeight());
                    this.container.find('.mce-edit-area').height(editAreaHeight);
                    break;
                }
            },
            resize: function () {
                if (this.element.data('modal').isShown) {
                    this.setSize(false);
                }
            },
            ' show': function (el, e) {
                this.isHiding = false;
                this.switchVisual();
                this.setSize(true);
                if (this.saveHandler !== null && typeof this.saveHandler === 'function') {
                    this.saveBtn.off('click').on('click', this.saveHandler);
                }
                if (this.iframeBody === null) {
                    this.iframeBody = this.element.find('#motopresscodecontent_ifr').contents().find('.motopresscodecontent');
                    this.iframeBody.css('max-width', 'none');
                }
                if (CE.Iframe.window.CE.Dialog.myThis.element.dialog('isOpen') && !el.data('modal').hasOwnProperty('closeDialog')) {
                    CE.Iframe.window.CE.Dialog.myThis.element.dialog('close');
                }
            },
            ' shown': function () {
                if (this.editor !== null) {
                    this.editor.execCommand('mceFocus', false);
                } else {
                    this.content.focus();
                }
                $('body').hide(0, function () {
                    $('body').show();
                });
            },
            ' hide': function (el, e) {
                if (!this.isHiding) {
                    this.isHiding = true;
                    var handle = CE.CodeModal.currentShortcode.closest('.motopress-clmn').find('.' + CE.Iframe.window.CE.DragDrop.myThis.helper.attr('class')).first().children('.' + CE.Iframe.window.CE.DragDrop.myThis.dragHandle.attr('class'));
                    handle.prev().focus();
                    this.content.val('');
                    if (this.editor !== null)
                        this.editor.setContent('');
                    this.saveHandler = null;
                    if (CE.Iframe.wpEditor !== null)
                        CE.Iframe.wpEditor.focus();
                    if (el.data('modal').hasOwnProperty('closeDialog')) {
                        delete el.data('modal').closeDialog;
                    }
                    if (!CE.Iframe.window.CE.Dialog.myThis.element.dialog('isOpen')) {
                        CE.Iframe.window.CE.Dialog.myThis.open(handle);
                    }
                    var t = setTimeout(function () {
                        CE.CodeModal.currentShortcode = null;
                        CE.CodeModal.currentTextareaTinymce = null;
                        clearTimeout(t);
                    }, 0);
                }
            },
            switchVisual: function () {
                var activeMode = MP.Utils.getEditorActiveMode(this.element.find('#wp-motopresscodecontent-wrap').prop('class').split(' '));
                if (typeof tinyMCE !== 'undefined' && activeMode === 'html-active') {
                    if (switchEditors.hasOwnProperty('switchto')) {
                        switchEditors.switchto(this.element.find('#motopresscodecontent-tmce')[0]);
                    } else {
                        switchEditors.go('motopresscodecontent', 'tmce');
                    }
                    if (this.editor === null) {
                        this.editor = tinyMCE.get('motopresscodecontent');
                    }
                }
            }
        });
    }(jQuery));
    (function ($) {
        if ($.hasOwnProperty('fn') && $.fn.hasOwnProperty('button') && $.fn.button.hasOwnProperty('noConflict')) {
            $.fn.btn = $.fn.button.noConflict();
        }
        new MP.Editor();    
    }(jQuery));
} catch (e) {
    MP.Error.log(e);
}