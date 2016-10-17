parent.MP.Editor.oneIfr('ParentEditorReady', function () {
    try {
        (function ($) {
            MP.BootstrapSelect = can.Construct(
            {
                setSelected: function (option) {
                    option.prop('selected', true);
                    option.closest('select').next('.bootstrap-select').find('.filter-option').text(option.text());
                },
                setDisabled: function (option, flag) {
                    if (typeof flag == 'undefined')
                        flag = true;
                    var select = option.closest('select');
                    var index = option.prop('index');
                    var a = select.next('.bootstrap-select').find('ul[data-select-id="' + select.prop('id') + '"] > li[rel="' + index + '"] > a');
                    if (flag) {
                        a.attr('data-disabled', '');
                    } else {
                        a.removeAttr('data-disabled');
                    }
                },
                appendOption: function (select, option) {
                    var li = $('<li />', { rel: option.prop('index') });
                    var a = $('<a />', {
                        tabindex: '-1',
                        href: '#',
                        text: option.text()
                    });
                    if (typeof option.attr('data-disabled') != 'undefined')
                        a.attr('data-disabled', '');
                    a.appendTo(li);
                    select.next('.bootstrap-select').find('ul[data-select-id="' + select.prop('id') + '"]').append(li);
                },
                removeOption: function (option) {
                    var select = option.closest('select');
                    if (select.find('option').length > 1) {
                        var index = option.prop('index');
                        var li = select.next('.bootstrap-select').find('ul[data-select-id="' + select.prop('id') + '"] > li[rel="' + index + '"]');
                        li.nextAll('li').each(function () {
                            $(this).attr('rel', parseInt($(this).attr('rel')) - 1);
                        });
                        li.remove();
                        if (option.parent().is('optgroup') && !option.siblings('option').length) {
                            option.parent('optgroup').remove();
                            if (select.children('optgroup').length == 1) {
                                var optIndex = select.find('optgroup:first option:last').prop('index');
                                var optLi = select.next('.bootstrap-select').find('ul[data-select-id="' + select.prop('id') + '"] > li[rel="' + optIndex + '"]');
                                optLi.removeClass('optgroup-div');
                            }
                        } else {
                            option.remove();
                        }
                        setSelected(select.find('option:first'));
                    }
                },
                updateOptionText: function (option, text) {
                    var select = option.closest('select');
                    var index = option.prop('index');
                    var a = select.next('.bootstrap-select').find('ul[data-select-id="' + select.prop('id') + '"] > li[rel="' + index + '"] > a');
                    option.text(text);
                    a.text(text);
                }
            }, 
            {});
        }(jQuery));
        (function ($) {
            CE.Utils = can.Construct(
            {
                body: $('body'),
                addSceneAction: function (action) {
                    this.body.addClass('motopress-' + action + '-action');
                },
                isSceneAction: function (action) {
                    return this.body.hasClass('motopress-' + action + '-action');
                },
                removeSceneAction: function (action) {
                    this.body.removeClass('motopress-' + action + '-action');
                },
                triggerWindowEvent: function (eventName) {
                    $(window).trigger(eventName);
                    CE.Utils.fixFlexslider();
                },
                fixFlexslider: function () {
                    $('.motopress-flexslider').each(function () {
                        if ($(this).data('flexslider')) {
                            $(this).data('flexslider').resize();
                        }
                    });    
                },
                addSceneState: function (state) {
                    this.body.addClass('motopress-' + state + '-state');
                },
                removeSceneState: function (state) {
                    this.body.removeClass('motopress-' + state + '-state');
                },
                isSceneState: function (state) {
                    return this.body.hasClass('motopress-' + state + '-state');
                }
            }, 
            {});
        }(jQuery));
        (function ($) {
            CE.WPMore = can.Construct(
            {
                _instance: null,
                getInstance: function () {
                    if (this._instance === null) {
                        this._instance = new CE.WPMore();
                    }
                    return this._instance;
                }
            }, 
            {
                $body: $('body'),
                $contentWrapper: parent.CE.Iframe.myThis.sceneContent,
                contentSectionExists: parent.CE.Iframe.myThis.contentSectionExists,
                $moreTag: $('<section class="mpce-wp-more-tag" />'),
                $style: $(),
                pointClass: '.mpce-wp-more-point',
                pointClassName: 'mpce-wp-more-point',
                tagClass: '.mpce-wp-more-tag',
                tagClassName: 'mpce-wp-more-tag',
                pointPosClassNamePrefix: 'mpce-wp-more-point-',
                pointPosClassPrefix: '.mpce-wp-more-point-',
                selectedState: 'wp-more-selected',
                init: function () {
                    this.$contentWrapper = parent.CE.Iframe.myThis.sceneContent;
                    this.contentSectionExists = parent.CE.Iframe.myThis.contentSectionExists;
                    this.initState();
                    this.initStyle();
                    this.initEvents();
                },
                initState: function () {
                    if (this.contentSectionExists && this.$contentWrapper.find(this.tagClass).length) {
                        this.$moreTag = this.$contentWrapper.find(this.tagClass);
                        CE.Utils.addSceneState(this.selectedState);
                        this.fixTagDOMPosition();
                    }
                    this.$moreTag.attr('title', localStorage.getItem('CEMoreHandlerTitle'));
                },
                initEvents: function () {
                    this.$contentWrapper.on('click', '>' + this.pointClass + ', >.motopress-handle-middle-in>' + this.pointClass + '', this.proxy('onPointClick')).on('click', '>' + this.tagClass, this.proxy('onTagClick'));
                    parent.MP.Editor.oneIfr('EditorLoad', this.proxy('updateStyle'));
                    parent.MP.Editor.onIfr('LeftBarShow LeftBarHide', this.proxy('updateStyle'));
                    parent.MP.Editor.onIfr('Resize', this.proxy('updateStyle'));
                },
                initStyle: function () {
                    this.$style = $('<style type="text/css" id="mpce-wp-more-style" />');
                    this.$body.append(this.$style);
                },
                updateStyle: function () {
                    var styleText = '';
                    if (CE.LeftBar.myThis.isVisible() && this.contentSectionExists) {
                        var left = this.$contentWrapper.offset().left - CE.LeftBar.myThis.getSpace();
                        if (left < 0) {
                            left = Math.abs(left);
                            styleText = '.motopress-edit-more-action [class^="mpce-wp-more"]{left:' + left + 'px !important;}';
                        }
                    }
                    this.$style.text(styleText);
                },
                onPointClick: function (e, $el) {
                    $el = $(e.target);
                    switch (this.getPositionType($el)) {
                    case 'first':
                        this.$moreTag.prependTo(this.$contentWrapper);
                        break;
                    case 'last':
                        this.$contentWrapper.find('>.motopress-row:last').after(this.$moreTag);
                        break;
                    case 'middle':
                    default:
                        $el.parent().before(this.$moreTag);
                        break;
                    }
                    CE.Utils.addSceneState(this.selectedState);
                },
                onTagClick: function () {
                    CE.Utils.removeSceneState(this.selectedState);
                    this.$moreTag.detach();
                },
                fixTagDOMPosition: function () {
                    var moreTagWrapper = this.$moreTag.closest('.motopress-content-wrapper>.motopress-row');
                    if (moreTagWrapper.length) {
                        moreTagWrapper.after(this.$moreTag);
                    }
                },
                getPointTemplate: function (type) {
                    return $('<div />', {
                        'class': this.pointClassName + ' ' + this.getPointClassByType(type),
                        'title': localStorage.getItem('CEWPMorePointTitle')
                    });
                },
                pointAppendTo: function ($el, type) {
                    if ($el.length && !this.isPointExists(type)) {
                        $el.append(this.getPointTemplate(type));
                    }
                },
                pointPrependTo: function ($el, type) {
                    if ($el.length && !this.isPointExists(type)) {
                        $el.prepend(this.getPointTemplate(type));
                    }
                },
                isPointExists: function (type) {
                    return !!(typeof type !== 'undefined' && type && this.contentSectionExists && this.$contentWrapper.find(this.pointPosClassPrefix + type).length);
                },
                getPointClassByType: function (type) {
                    return typeof type !== 'undefined' && type ? this.pointPosClassNamePrefix + type : '';
                },
                getPositionType: function ($el) {
                    if ($el.hasClass(this.getPointClassByType('first'))) {
                        return 'first';
                    } else if ($el.hasClass(this.getPointClassByType('last'))) {
                        return 'last';
                    } else {
                        return 'middle';
                    }
                }
            });
        }(jQuery));
        (function ($) {
            CE.Grid = can.Control.extend(
            { myThis: null }, 
            {
                columnWidthPiece: null,
                columnMarginPiece: null,
                splitterWidthPiece: null,
                splitterMarginPiece: null,
                column: null,
                padding: null,
                columnCount: parent.CE.Iframe.myThis.gridObj.row.col,
                columnWidthStatus: null,
                colWidthByNumber: [],
                rowEl: $('<div />', { 'class': parent.CE.Iframe.myThis.gridObj.row.class }),
                columnEl: $('<div />', {}),
                setup: function (el) {
                    var col = null;
                    el.append(this.rowEl);
                    for (var i = 1; i <= this.columnCount; i++) {
                        col = this.columnEl.clone().addClass(parent.CE.Iframe.myThis.gridObj.span.class + i).appendTo(this.rowEl);
                        this.colWidthByNumber[i] = parseFloat(col.width());
                    }
                    this.columnEl.clone().addClass(parent.CE.Iframe.myThis.gridObj.span.class + 1).appendTo(this.rowEl);
                },
                init: function (el) {
                    CE.Grid.myThis = this;
                    this.column = el.find('.' + parent.CE.Iframe.myThis.gridObj.span.minclass + ':last');
                    this.setSize();
                    parent.MP.Editor.onIfr('Resize', this.proxy('setSize'));
                },
                setSize: function () {
                    var columnWidthStatus = this.column.width();
                    this.padding = parseFloat(this.column.css('padding-left'));
                    this.columnWidthPiece = parseFloat(this.column.width());
                    this.columnMarginPiece = parseFloat(this.column.css('margin-left'));
                    this.splitterWidthPiece = this.columnMarginPiece / 100 * 66.66666;
                    this.splitterMarginPiece = this.columnMarginPiece / 100 * 83.33333;
                    if (this.columnWidthStatus) {
                        CE.Resizer.myThis.updateSplittableOptions(null, null, null, 'init');
                        CE.Resizer.myThis.updateSplitterHeight(null, 'init');
                    }
                    this.columnWidthStatus = columnWidthStatus;    
                }
            });
        }(jQuery));
        (function ($) {
            can.Construct('CE.LeftBar', 
            { myThis: null }, 
            {
                width: 56,
                leftBar: $('<div />', {
                    'class': 'motopress-default mpce-leftbar-hidden',
                    id: 'motopress-content-editor-leftbar',
                    tabIndex: -1
                }),
                leftBarOverlap: $('<div />', { 'class': 'motopress-leftbar-overlap' }),
                widgetsWrapper: $('<div id="mpce-leftbar-widgets-wrapper" />'),
                customWrapper: $('<div id="mpce-leftbar-custom-wrapper" />'),
                group: $('<div />', { 'class': 'motopress-leftbar-group motopress-default' }),
                groupInner: $('<div />', { 'class': 'motopress-leftbar-group-inner motopress-default' }),
                groupIcon: $('<div />', { 'class': 'motopress-leftbar-group-icon' }),
                groupActive: $('<div />', { 'class': 'motopress-leftbar-group-active motopress-default' }),
                object: $('<section />', { 'class': 'motopress-ce-object motopress-default-drag' }),
                objectInner: $('<div />', { 'class': 'motopress-ce-object-inner motopress-default' }),
                objectDot: $('<div />', { 'class': 'motopress-ce-object-dot motopress-default' }),
                objectIcon: $('<div />', { 'class': 'motopress-ce-object-icon' }),
                objectName: $('<span />', { 'class': 'motopress-ce-object-name motopress-default motopress-no-color-text' }),
                library: null,
                visibility: true,
                bodyEl: null,
                active: false,
                setup: function () {
                    this.groupIcon.append(this.groupActive).appendTo(this.groupInner);
                    this.groupInner.append(this.groupPopover).appendTo(this.group);
                    this.objectInner.append(this.objectDot, this.objectIcon, this.objectName).appendTo(this.object);
                    this.bodyEl = $('body');
                    this.leftBar.append(this.widgetsWrapper, this.customWrapper);
                    this.bodyEl.prepend(this.leftBar).append(this.leftBarOverlap);
                },
                init: function () {
                    CE.LeftBar.myThis = this;
                    if (!this.leftBar.hasClass('mpce-leftbar-hidden')) {
                        this.setActive();
                        this.setVisible();
                        parent.CE.Navbar.myThis.setWidgetBtnActive();
                    }
                    this.initLibrary();
                    this.initCustom();
                    this.hoverActive();
                    new CE.DragDrop();
                    var templatesEl = $('#motopress-templates');
                    if (templatesEl.length)
                        new CE.Template(templatesEl);
                    this.addMetaInputs();
                    parent.MP.Preloader.myThis.load(CE.LeftBar.shortName);
                },
                initCustom: function () {
                    var self = this, groupStr, $group, $btns = {};
                    groupStr = '<div class="mpce-leftbar-custom-group-1">' + '<div class="motopress-leftbar-group motopress-default mpce-leftbar-more-btn" title="' + localStorage.getItem('CELeftBarWPMoreTitle') + '">' + '<div class="motopress-leftbar-group-inner motopress-default">' + '<div class="motopress-leftbar-group-icon mpce-leftbar-more-icon">' + '<div class="motopress-leftbar-group-active motopress-default"></div>' + '</div>' + '</div>' + '</div>';
                    if (!parent.motopressCE.settings.wp.white_label_active) {
                        groupStr += '<div class="motopress-leftbar-group motopress-default mpce-leftbar-addons-btn" title="' + localStorage.getItem('CELeftBarAddonsTitle') + '">' + '<div class="motopress-leftbar-group-inner motopress-default">' + '<div class="motopress-leftbar-group-icon mpce-leftbar-addons-icon">' + '<a href="' + parent.motopressCE.settings.wp.home_addons_url + '" target="_blank" class="motopress-leftbar-group-active motopress-default"></a>' + '</div>' + '</div>' + '</div>';
                    }
                    groupStr += '</div>';
                    $group = $(groupStr);
                    $.each([
                        'more',
                        'addons'
                    ], function (key, name) {
                        $btns[name] = $group.find('.mpce-leftbar-' + name + '-btn');
                    });
                    $group.find('.motopress-leftbar-group').on('mouseover', function (e) {
                        self.customGrpOnMouseover(e, this);
                    }).on('mouseout', function (e) {
                        self.customGrpOnMouseout(e, this);
                    });
                    $btns['more'].find('.motopress-leftbar-group-active').on('mousedown', function (e) {
                        self.customActiveGrpOnMousedown(e, this);
                    });
                    $group.appendTo(this.customWrapper);
                },
                addMetaInputs: function () {
                    if (!$('form#post #motopress-ce-edited-post', parent.document).length) {
                        $('form#post', parent.document).prepend($('<input>', {
                            type: 'hidden',
                            id: 'motopress-ce-edited-post',
                            name: 'motopress-ce-edited-post',
                            value: parent.motopressCE.postID
                        }));
                    }
                },
                initLibrary: function () {
                    var library = parent.motopressCE.settings.library;
                    CE.LeftBar.myThis.library = $.extend(true, {}, library.groups);
                    this.initLibraryStyles();
                    if ($.isPlainObject(library.globalPredefinedClasses) && !$.isEmptyObject(library.globalPredefinedClasses)) {
                        CE.Style.globalPredefinedClasses = library.globalPredefinedClasses;
                    }
                    if ($.isArray(library.tinyMCEStyleFormats) && !$.isEmptyObject(library.tinyMCEStyleFormats)) {
                        CE.InlineEditor.styleFormats = library.tinyMCEStyleFormats;
                    }
                    if ($.isPlainObject(library.templates) && !$.isEmptyObject(library.templates)) {
                        CE.Template.templates = library.templates;
                    }
                    CE.LeftBar.myThis.createGroup();
                },
                initLibraryStyles: function () {
                    var library = parent.motopressCE.settings.library, limitations, disableAllPaddings, disableAllMargins, disableAllBorderWidth;
                    $.each(library.groups, function (groupName, groupDetails) {
                        if (groupDetails.hasOwnProperty('objects')) {
                            $.each(groupDetails.objects, function (objName, objDetails) {
                                CE.LeftBar.myThis.library[groupName].objects[objName].styles = $.extend(true, {}, CE.Style.props, CE.LeftBar.myThis.library[groupName].objects[objName].styles);
                                if (CE.Shortcode.isGrid(groupName)) {
                                    CE.LeftBar.myThis.library[groupName].objects[objName].styles.margin.sides.splice(2);
                                    CE.LeftBar.myThis.library[groupName].objects[objName].styles.margin.default.splice(2);
                                } else {
                                    CE.LeftBar.myThis.library[groupName].objects[objName].styles.margin.regExp = new RegExp('^' + CE.LeftBar.myThis.library[groupName].objects[objName].styles.margin.classPrefix + '(?:|(' + CE.LeftBar.myThis.library[groupName].objects[objName].styles.margin.sides.join('|') + ')-)(' + CE.LeftBar.myThis.library[groupName].objects[objName].styles.margin.values.slice(1).join('|') + ')$', 'i');
                                }
                                if (objDetails.styles.hasOwnProperty('mp_custom_style') && objDetails.styles.mp_custom_style.hasOwnProperty('limitation')) {
                                    limitations = objDetails.styles.mp_custom_style.limitation;
                                    $.each(limitations, function (key, limitation) {
                                        if (CE.LeftBar.myThis.library[groupName].objects[objName].styles.mp_custom_style.parameters.hasOwnProperty(limitation)) {
                                            delete CE.LeftBar.myThis.library[groupName].objects[objName].styles.mp_custom_style.parameters[limitation];
                                        }
                                    });
                                }
                            });
                        }
                    });
                },
                createGroup: function () {
                    if (this.library !== null && !$.isEmptyObject(this.library)) {
                        var self = this;
                        var group, icon;
                        for (var g in this.library) {
                            if (this.library[g]['show']) {
                                group = this.group.clone();
                                icon = group.find('.motopress-leftbar-group-icon');
                                icon.css('background-image', 'url(' + this.library[g]['icon'] + ')');
                                group.clickover({
                                    html: true,
                                    animation: false,
                                    width: this.getPopupWidth(this.library[g]),
                                    title: localStorage.getItem('addBlockTip'),
                                    content: this.createObject(this.library[g]['id'], this.library[g]['objects']),
                                    onShown: function () {
                                        self.popoverOnShown(this);
                                    },
                                    onHidden: function () {
                                        self.popoverOnHidden(this);
                                    }
                                });
                                group.find('.motopress-leftbar-group-active').on('mousedown', this.proxy('activeGrpOnMousedown'));
                                group.appendTo(this.widgetsWrapper);
                            }
                        }    
                    }
                },
                popoverOnShown: function (obj) {
                    obj.$tip.find('.arrow').removeClass('arrow').addClass('motopress-ce-arrow');
                    var shadow = obj.$element.is(':first-child') ? 5 : 0;
                    var tipTop = parseInt(obj.$tip.css('top')) + parseInt(obj.$tip.css('height')) / 2 - 23 + shadow;
                    obj.$tip.css('top', tipTop);
                    var tipTitle = obj.$tip.find('.popover-title');
                    tipTitle.addClass('motopress-default motopress-default-text');
                    if (tipTitle.next('.popover-content').length) {
                        var tipContent = tipTitle.next();
                        tipTitle.insertAfter(tipContent);
                        tipContent.addClass('motopress-ce-object-container');
                    }
                    CE.DragDrop.myThis.makeDraggableNewBlock();
                },
                popoverOnHidden: function (obj) {
                    obj.$element.find('.motopress-leftbar-group-active').removeClass('active');
                },
                activeGrpOnMousedown: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                },
                activeGrpOnMouseover: function () {
                    $(this).addClass('active');
                },
                customGrpOnMouseover: function (e, el) {
                    this.hideActiveWidgetsGroup();
                },
                customGrpOnMouseout: function (e, el) {
                    $(el).find('.motopress-leftbar-group-active').removeClass('active');
                },
                customActiveGrpOnMousedown: function (e, el) {
                    if ($(el).hasClass('selected')) {
                        $(el).removeClass('selected');
                        CE.Utils.removeSceneAction('edit-more');
                    } else {
                        $(el).addClass('selected');
                        CE.Utils.addSceneAction('edit-more');
                    }
                },
                getPopupWidth: function (group) {
                    return Object.keys(group.objects).length < 6 ? '205px' : '620px';
                },
                createObject: function (group, objects) {
                    if (!$.isEmptyObject(objects)) {
                        var result = $('<div />'), object, icon, name;
                        for (var o in objects) {
                            if (objects[o]['show']) {
                                object = this.object.clone();
                                this.setAttrs(object, group, objects[o]);
                                icon = object.find('.motopress-ce-object-icon');
                                icon.css('background-image', 'url(' + objects[o]['icon'] + ')');
                                name = object.find('.motopress-ce-object-name');
                                name.text(objects[o]['name']);
                                result.append(object);
                            }
                        }
                        return result;
                    }
                },
                setAttrs: function (object, group, attrs) {
                    object.attr({
                        'data-motopress-close-type': attrs['closeType'],
                        'data-motopress-shortcode': attrs['id'],
                        'data-motopress-group': group,
                        'data-motopress-resize': attrs['resize']
                    });
                    var parameters = attrs['parameters'], parametersObj;
                    if (!$.isEmptyObject(parameters)) {
                        parametersObj = {};
                        $.each(parameters, function (key) {
                            parametersObj[key] = {};
                        });
                        object.attr('data-motopress-parameters', JSON.stringify(parametersObj));
                    }
                    var styles = this.getStyleAttrs(group, attrs['id']);
                    $.extend(true, styles, attrs['styles'], styles);
                    if (!$.isEmptyObject(styles)) {
                        var stylesObj = {};
                        $.each(styles, function (key) {
                            stylesObj[key] = {};
                        });
                        object.attr('data-motopress-styles', JSON.stringify(stylesObj));
                    }
                },
                hoverActive: function () {
                    $('.motopress-leftbar-group .motopress-leftbar-group-active').mouseover(this.activeGrpOnMouseover);
                },
                disable: function () {
                    this.leftBarOverlap.show();
                },
                enable: function () {
                    this.leftBarOverlap.hide();
                },
                setActive: function () {
                    this.active = true;
                },
                setInactive: function () {
                    this.active = false;
                },
                isActive: function () {
                    return this.active;
                },
                setVisible: function () {
                    this.visibility = true;
                },
                setInvisible: function () {
                    this.visibility = false;
                },
                isVisible: function () {
                    return this.visibility;
                },
                hide: function (hard) {
                    hard = typeof hard === 'undefined' ? false : hard;
                    if (hard || this.isActive()) {
                        this.setInvisible();
                        this.hideActiveWidgetsGroup();
                        this.leftBar.addClass('mpce-leftbar-hidden');
                        parent.MP.Editor.triggerIfr('LeftBarHide');
                    }    
                },
                show: function (hard) {
                    hard = typeof hard === 'undefined' ? false : hard;
                    if (hard || this.isActive()) {
                        this.setVisible();
                        this.leftBar.removeClass('mpce-leftbar-hidden');
                        parent.MP.Editor.triggerIfr('LeftBarShow');
                    }    
                },
                hideActiveWidgetsGroup: function () {
                    this.leftBar.find('.motopress-leftbar-group[data-clickover-open="1"]').trigger('mousedown');
                },
                getSpace: function () {
                    return this.isVisible() ? this.width : 0;
                },
                getWidth: function () {
                    return this.width;
                },
                getStyleAttrs: function (groupName, shortcodeName) {
                    return $.extend(true, {}, this.library[groupName].objects[shortcodeName].styles);
                },
                getPrivateStyleAttrs: function (groupName, shortcodeName) {
                    var styles = this.getStyleAttrs(groupName, shortcodeName);
                    return styles['mp_custom_style'].parameters;
                },
                getParametersAttrs: function (groupName, shortcodeName) {
                    return $.extend(true, {}, this.library[groupName].objects[shortcodeName].parameters);
                },
                getShortcodeLabel: function (groupName, shortcodeName) {
                    return this.library[groupName].objects[shortcodeName].name;
                }
            });
        }(jQuery));
        (function ($) {
            CE.ShortcodeStyle = can.Construct(
            {
                generateStateCSS: function (settings) {
                    var important = ' !important;';
                    var styles = [];
                    $.each(settings, function (name, value) {
                        if (value !== '') {
                            switch (name) {
                            case 'padding-top':
                            case 'padding-bottom':
                            case 'padding-left':
                            case 'padding-right':
                            case 'margin-top':
                            case 'margin-bottom':
                            case 'margin-left':
                            case 'margin-right':
                            case 'border-top-width':
                            case 'border-bottom-width':
                            case 'border-left-width':
                            case 'border-right-width':
                            case 'border-top-left-radius':
                            case 'border-top-right-radius':
                            case 'border-bottom-left-radius':
                            case 'border-bottom-right-radius':
                                if (!isNaN(value)) {
                                    styles.push(CE.ShortcodeStyle.generateStyleRule(name, value + 'px' + important));
                                }
                                break;
                            case 'background-position-x':
                            case 'background-position-y':
                                if (!isNaN(value)) {
                                    styles.push(CE.ShortcodeStyle.generateStyleRule(name, value + '%' + important));
                                }
                                break;
                            case 'background-gradient':
                                if (value !== '') {
                                    var gradientParameters = CE.CtrlGradient.parseGradientStr(value);
                                    if (gradientParameters && !(gradientParameters['initial-color'] === '' && gradientParameters['final-color'] === '')) {
                                        var angle = gradientParameters['angle'] + 'deg';
                                        var initialColor = gradientParameters['initial-color'] !== '' ? gradientParameters['initial-color'] : 'transparent';
                                        var finalColor = gradientParameters['final-color'] !== '' ? gradientParameters['final-color'] : 'transparent';
                                        value = angle + ',' + initialColor + ',' + finalColor;
                                        var gradients = [];
                                        gradients.push('-moz-linear-gradient(' + value + ')' + important);
                                        gradients.push('-webkit-linear-gradient(' + value + ')' + important);
                                        gradients.push('linear-gradient(' + value + ')' + important);
                                        styles.push(CE.ShortcodeStyle.generateStyleRule('background-image', gradients));
                                    }
                                }
                                break;
                            case 'background-image-type':
                                if (value === 'none') {
                                    styles.push(CE.ShortcodeStyle.generateStyleRule('background-image', 'none' + important));
                                }
                                break;
                            case 'background-image':
                                styles.push(CE.ShortcodeStyle.generateStyleRule(name, 'url(' + value + ')' + important));
                                break;
                            case 'background-color':
                            case 'border-color':
                            case 'color':
                                styles.push(CE.ShortcodeStyle.generateStyleRule(name, value + important));
                                break;
                            case 'background-position':
                                if (value !== 'custom') {
                                    styles.push(CE.ShortcodeStyle.generateStyleRule(name, value + important));
                                }
                                break;
                            case 'border-radius':
                                styles.push(CE.ShortcodeStyle.generateStyleRule('-webkit-' + name, value + important));
                                styles.push(CE.ShortcodeStyle.generateStyleRule('-moz-' + name, value + important));
                                styles.push(CE.ShortcodeStyle.generateStyleRule(name, value + important));
                                break;
                            default:
                                styles.push(CE.ShortcodeStyle.generateStyleRule(name, value + important));
                                break;
                            }
                        }
                    });
                    return styles;
                },
                generateCSS: function (className, settings, emulateMode) {
                    if (typeof emulateMode === undefined)
                        emulateMode = false;
                    if (className === null)
                        className = '%className%';
                    var css = '';
                    if (settings.hasOwnProperty('up')) {
                        $.each(CE.ShortcodeStyle.generateStateCSS(settings.up), function (index, styleRule) {
                            css += '.' + className + styleRule;
                            if (emulateMode) {
                                css += '.' + className + '.' + CE.ShortcodeStyle.previewStateClassPrefix + 'up' + styleRule;
                            }
                        });
                    }
                    if (settings.hasOwnProperty('hover')) {
                        $.each(CE.ShortcodeStyle.generateStateCSS(settings.hover), function (index, styleRule) {
                            if (emulateMode) {
                                css += '.' + className + '.' + CE.ShortcodeStyle.previewStateClassPrefix + 'hover' + styleRule;
                            } else {
                                css += '.' + className + ':hover' + styleRule;
                            }
                        });
                    }
                    if (settings.hasOwnProperty('tablet')) {
                        $.each(CE.ShortcodeStyle.generateStateCSS(settings.tablet), function (index, styleRule) {
                            if (emulateMode) {
                                css += '.' + className + '.' + CE.ShortcodeStyle.previewStateClassPrefix + 'tablet' + styleRule;
                            } else {
                                css += '@media (max-width: 768px) { .' + className + styleRule + '}';
                            }
                        });
                    }
                    if (settings.hasOwnProperty('mobile')) {
                        $.each(CE.ShortcodeStyle.generateStateCSS(settings.mobile), function (index, styleRule) {
                            if (emulateMode) {
                                css += '.' + className + '.' + CE.ShortcodeStyle.previewStateClassPrefix + 'mobile' + styleRule;
                            } else {
                                css += '@media (max-width: 320px) { .' + className + styleRule + '}';
                            }
                        });
                    }
                    return css;
                },
                generateStyleRule: function (name, value) {
                    var styleRule = ':not(.' + parent.motopressCE.styleEditor['const'].prefixRuleDisable + name + '){';
                    if (!$.isArray(value)) {
                        value = [value];
                    }
                    $.each(value, function () {
                        styleRule += name + ':' + this;
                    });
                    styleRule += '}';
                    return styleRule;
                },
                previewStateClassPrefix: 'motopress-ce-preview-state-'
            }, 
            {
                settings: null,
                css: null,
                emulateCSS: null,
                className: null,
                updateMetaField: function () {
                },
                init: function (className, settings, css) {
                    this.className = className;
                    this.settings = typeof settings !== 'undefined' ? settings : {};
                    if (typeof css !== 'undefined') {
                        this.css = css;
                        this.emulateCSS = CE.ShortcodeStyle.generateCSS(this.className, this.settings, true);
                    } else {
                        this.regenerateCSS();
                    }
                    this.detectStyleTag();
                    this.updateStyleTag();    
                },
                getClassName: function () {
                    return this.className;
                },
                getCSS: function () {
                    return this.css;
                },
                getEmulateCSS: function () {
                    return this.emulateCSS;
                },
                getSettings: function () {
                    return $.extend({}, this.settings);
                },
                getStateSettings: function (state) {
                    return this.settings.hasOwnProperty(state) ? $.extend({}, this.settings[state]) : {};
                },
                isEmpty: function () {
                    var isEmpty = true;
                    $.each(this.settings, function (state, details) {
                        $.each(details, function (name, value) {
                            if (value !== '') {
                                isEmpty = false;
                                return;
                            }
                        });
                        if (!isEmpty)
                            return;
                    });
                    return isEmpty;
                },
                regenerateCSS: function () {
                    this.css = CE.ShortcodeStyle.generateCSS(this.className, this.settings, false);
                    this.emulateCSS = CE.ShortcodeStyle.generateCSS(this.className, this.settings, true);
                },
                'update': function (settings) {
                    this.settings = settings;
                    this.regenerateCSS();
                    this.updateStyleTag();
                    this.updateMetaField();
                },
                updateState: function (state, settings) {
                    this.settings[state] = settings;
                    this.regenerateCSS();
                    this.updateStyleTag();
                    this.updateMetaField();
                },
                'delete': function () {
                    this.styleTag.remove();
                    this.updateMetaField();
                },
                updateStyleTag: function () {
                    var css = CE.StyleEditor.myThis.isEmulateCSSMode() ? this.getEmulateCSS() : this.getCSS();
                    this.styleTag.text(css);
                },
                detectStyleTag: function () {
                    var styleTag = this.stylesWrapper.children('#' + this.className);
                    if (!styleTag.length) {
                        styleTag = this.generateStyleTag();
                    }
                    this.styleTag = styleTag;
                },
                generateStyleTag: function () {
                    var styleTag = $('<style />', {
                        'id': this.getClassName(),
                        'text': this.getCSS()
                    });
                    this.stylesWrapper.append(styleTag);
                    return styleTag;
                }
            });
        }(jQuery));
        (function ($) {
            CE.ShortcodeStyle('CE.ShortcodePrivateStyle', 
            {
                stylesWrapper: $('#motopress-ce-private-styles-wrapper'),
                addRenderedStyleTags: function (styleTags) {
                    styleTags.filter(function (index, privateStyleTag) {
                        return CE.ShortcodePrivateStyle.stylesWrapper.children('#' + $(privateStyleTag).attr('id')).length === 0;
                    });
                    CE.ShortcodePrivateStyle.stylesWrapper.append(styleTags);
                }
            }, 
            {
                styleTag: null,
                stylesWrapper: null,
                init: function (name, settings, css) {
                    this.stylesWrapper = CE.ShortcodePrivateStyle.stylesWrapper;
                    this._super(name, settings, css);
                },
                updateMetaField: function () {
                    CE.StyleEditor.myThis.udpatePrivateStylesMeta();
                },
                clear: function () {
                    this.update({});
                    CE.StyleEditor.myThis.udpatePrivateStylesMeta();
                }
            });
        }(jQuery));
        (function ($) {
            CE.ShortcodeStyle('CE.ShortcodePresetStyle', 
            { stylesWrapper: $('#motopress-ce-preset-styles-wrapper') }, 
            {
                styleTag: null,
                label: '',
                stylesWrapper: null,
                init: function (className, settings, css, label) {
                    this.stylesWrapper = CE.ShortcodePresetStyle.stylesWrapper;
                    this._super(className, settings, css);
                    this.setLabel(label);
                },
                getLabel: function () {
                    return this.label;
                },
                setLabel: function (label) {
                    this.label = label;
                },
                updateLabel: function (label) {
                    this.label = label;
                    CE.StyleEditor.myThis.updatePresetStylesMeta();
                },
                updateMetaField: function () {
                    CE.StyleEditor.myThis.updatePresetStylesMeta();
                }
            });
        }(jQuery));
        (function ($) {
            CE.StyleEditor = can.Construct(
            { myThis: null }, 
            {
                presets: {},
                presetsMetaField: null,
                presetsLastIdMetaField: null,
                privateStyles: {},
                presetStyles: {},
                presetsLastId: null,
                presetDefaultLabel: null,
                privateMetaField: null,
                prefixPresetClass: null,
                prefixPrivateClass: null,
                privateStylesWrapper: null,
                presetStylesWrapper: null,
                presetSaveModal: null,
                emulateCSSMode: true,
                init: function () {
                    CE.StyleEditor.myThis = this;
                    this.presetSaveModal = parent.CE.PresetSaveModal.myThis;
                    this.initPrivateStyles();
                    this.initPresetStyles();
                    this.initEvents();
                },
                initPresetStyles: function () {
                    var $this = this;
                    this.prefixPresetClass = parent.motopressCE.styleEditor.const.prefixPresetClass;
                    this.presetsLastIdMetaField = parent.CE.Navbar.myThis.presetsLastIdMetaField;
                    this.presetsMetaField = parent.CE.Navbar.myThis.presetsMetaField;
                    this.presetsLastId = parent.motopressCE.styleEditor.presets_last_id;
                    this.presetDefaultLabel = parent.motopressCE.styleEditor.const.presetDefaultLabel;
                    $.each(parent.motopressCE.styleEditor.presets, function (name, properties) {
                        $this.presetStyles[name] = new CE.ShortcodePresetStyle(name, properties.settings, properties.css, properties.label);
                    });
                },
                initEvents: function () {
                    parent.MP.Editor.onIfr('AfterUpdate', this.proxy('clearPresetsField'));
                },
                getPresetsLastId: function () {
                    return this.presetsLastId;
                },
                incPresetsLastId: function () {
                    this.presetsLastId++;
                    return this.presetsLastId;
                },
                initPrivateStyles: function () {
                    var $this = this;
                    this.prefixPrivateClass = parent.motopressCE.styleEditor.const.prefixPrivateClass;
                    this.privateMetaField = parent.CE.Navbar.myThis.privatesMetaField;
                    $.each(this.getPrivateStylesMeta(), function (name, properties) {
                        $this.privateStyles[name] = new CE.ShortcodePrivateStyle(name, properties.settings);
                    });
                },
                udpatePrivateStylesMeta: function () {
                    this.privateMetaField.val(this.getPrivateStylesString());
                    parent.CE.Save.changeContent();
                },
                getPrivateStylesMeta: function () {
                    return $.parseJSON(this.privateMetaField.val());
                },
                getPrivateStylesString: function () {
                    var styles = {};
                    $.each(this.privateStyles, function (className, obj) {
                        if (!obj.isEmpty()) {
                            styles[className] = {
                                'settings': obj.getSettings(),
                                'css': obj.getCSS()
                            };
                        }
                    });
                    return JSON.stringify(styles);
                },
                getPrivateStyleInstance: function (classes) {
                    var privateClass = this.retrievePrivateClass(classes);
                    if (privateClass !== '' && this.privateStyles.hasOwnProperty(privateClass)) {
                        return this.privateStyles[privateClass];
                    } else {
                        var newClassName = this.generatePrivateClass();
                        return this.createPrivateStyle(newClassName);
                    }
                },
                getPresetStyleInstance: function (classes) {
                    var presetClass = this.retrievePresetClass(classes);
                    return this.isExistsPreset(presetClass) ? this.presetStyles[presetClass] : null;
                },
                createPrivateStyle: function (name, settings) {
                    this.privateStyles[name] = new CE.ShortcodePrivateStyle(name, settings);
                    return this.privateStyles[name];
                },
                retrievePrivateClass: function (classes) {
                    var privateClassRegExp = new RegExp('(?:^|\\s)+(' + this.prefixPrivateClass + '[\\d]+-[\\S]+)(?:$|\\s)+');
                    var privateClass = privateClassRegExp.exec(classes);
                    return privateClass !== null && privateClass.length === 2 ? privateClass[1] : '';
                },
                generatePrivateClass: function () {
                    var postId = parent.motopressCE.postID;
                    var uniqueId = parent.MP.Utils.uniqid(this.prefixPrivateClass + postId + '-');
                    return !this.privateStyles.hasOwnProperty(uniqueId) ? uniqueId : this.generatePrivateClass();
                },
                getPresetsString: function () {
                    var styles = {};
                    $.each(this.presetStyles, function (className, obj) {
                        styles[className] = {
                            'settings': obj.getSettings(),
                            'css': obj.getCSS(),
                            'label': obj.getLabel()
                        };
                    });
                    return JSON.stringify(styles);
                },
                getPresetsList: function (withNone) {
                    var list = {};
                    $.each(this.presetStyles, function (index, presetObj) {
                        list[presetObj.getClassName()] = presetObj.getLabel();
                    });
                    if (withNone) {
                        list = $.extend({ '': localStorage.getItem('CENone') }, list);
                    }
                    return list;
                },
                getPresetsListSelect2: function () {
                    var list = [];
                    $.each(this.presetStyles, function (index, presetObj) {
                        list.push({
                            id: presetObj.getClassName(),
                            text: presetObj.getLabel()
                        });
                    });
                    return list;
                },
                generatePresetClassName: function () {
                    return this.prefixPresetClass + this.incPresetsLastId();
                },
                createPreset: function (label, settings) {
                    var presetName = this.generatePresetClassName();
                    if (label === '') {
                        label = this.presetDefaultLabel + this.getPresetsLastId();
                    }
                    this.presetStyles[presetName] = new CE.ShortcodePresetStyle(presetName, settings, undefined, label);
                    this.updatePresetStylesMeta();
                    return this.presetStyles[presetName];
                },
                deletePreset: function (presetName) {
                    if (this.isExistsPreset(presetName)) {
                        this.presetStyles[presetName].delete();
                        delete this.presetStyles[presetName];
                        this.updatePresetStylesMeta();
                    }
                    return true;
                },
                updatePresetStylesMeta: function () {
                    parent.motopressCE.styleEditor.presets = this.presetStyles;
                    this.presetsLastIdMetaField.val(this.getPresetsLastId());
                    this.presetsMetaField.val(this.getPresetsString());
                    parent.CE.Save.changeContent();
                },
                clearPresetsField: function () {
                    this.presetsLastIdMetaField.val('');
                    this.presetsMetaField.val('');
                },
                isExistsPreset: function (presetClass) {
                    return this.presetStyles.hasOwnProperty(presetClass);
                },
                retrievePresetClass: function (classes) {
                    var presetClassRegExp = new RegExp('(?:^|\\s)+(' + this.prefixPresetClass + '[\\d]+)(?:$|\\s)+');
                    var presetClass = presetClassRegExp.exec(classes);
                    return presetClass !== null && presetClass.length === 2 ? presetClass[1] : '';
                },
                changePrivateClassToDuplicated: function (classStr) {
                    if (classStr !== '') {
                        var privateClass = CE.StyleEditor.myThis.retrievePrivateClass(classStr);
                        if (privateClass !== '') {
                            var newPrivateStyle = CE.StyleEditor.myThis.duplicatePrivateStyle(privateClass);
                            classStr = classStr.replace(privateClass, newPrivateStyle.getClassName());
                        }
                    }
                    return classStr;
                },
                duplicatePrivateStyle: function (privateClass) {
                    var newPrivateStyle;
                    var newClass = this.generatePrivateClass();
                    if (this.privateStyles.hasOwnProperty(privateClass)) {
                        newPrivateStyle = this.createPrivateStyle(newClass, this.privateStyles[privateClass].getSettings());
                    } else {
                        newPrivateStyle = this.createPrivateStyle(newClass);
                    }
                    this.udpatePrivateStylesMeta();
                    return newPrivateStyle;
                },
                setEmulateCSSMode: function () {
                    this.emulateCSSMode = true;
                    $.each(this.presetStyles, function () {
                        this.updateStyleTag();
                    });
                    $.each(this.privateStyles, function () {
                        this.updateStyleTag();
                    });
                },
                unsetEmulateCSSMode: function () {
                    this.emulateCSSMode = false;
                    $.each(this.presetStyles, function () {
                        this.updateStyleTag();
                    });
                    $.each(this.privateStyles, function () {
                        this.updateStyleTag();
                    });
                },
                isEmulateCSSMode: function () {
                    return this.emulateCSSMode;
                }
            });
        }(jQuery));
        (function ($) {
            CE.ImageLibrary = can.Construct(
            { myThis: null }, 
            {
                frame: null,
                propertyImage: null,
                init: function () {
                    CE.ImageLibrary.myThis = this;
                    this.frame = parent.wp.media({
                        id: 'motopress-image-library',
                        multiple: false,
                        describe: false,
                        toolbar: 'select',
                        sidebar: 'settings',
                        content: 'upload',
                        router: 'browse',
                        menu: 'default',
                        searchable: true,
                        filterable: false,
                        sortable: false,
                        title: localStorage.getItem('CEImageLibraryText'),
                        button: { text: localStorage.getItem('CEImageLibraryText') },
                        library: { type: 'image' },
                        contentUserSetting: true,
                        syncSelection: true
                    });
                    this.frame.on('open', this.proxy('onOpen'));
                    this.frame.on('select', this.proxy('setImage'));
                    this.frame.on('close', this.proxy('onClose'));
                },
                onOpen: function () {
                    this.frame.reset();
                    this.propertyImage = CE.Dialog.myThis.element.find('[data-motopress-open-img-lib="1"]');
                    var imgCtrl = this.propertyImage.control();
                    if (imgCtrl.id !== null) {
                        var attachment = parent.wp.media.attachment(imgCtrl.id);
                        attachment.fetch();
                        this.frame.state().get('selection').add(attachment);
                    }
                },
                setImage: function () {
                    var attributes = this.frame.state().get('selection').models[0].attributes;
                    var size = 'full';
                    if (attributes.sizes.hasOwnProperty('medium')) {
                        size = 'medium';
                    } else if (attributes.sizes.hasOwnProperty('thumbnail')) {
                        size = 'thumbnail';
                    }
                    var src = attributes.sizes[size].url;
                    var imgCtrl = this.propertyImage.control();
                    var props = {
                        id: attributes.id,
                        src: src,
                        full: attributes.sizes.full.url
                    };
                    imgCtrl.set(props);
                    imgCtrl.showTools();
                    imgCtrl.element.trigger('change');
                    this.propertyImage.removeAttr('data-motopress-open-img-lib');
                },
                onClose: function () {
                    $('.' + CE.Dialog.myThis.dialogClass).focus();
                    var HtmlBody = $(parent.document).find('html, body');
                    HtmlBody.addClass('motopress-ce-jumping-fix');
                    var tJumpFix = setTimeout(function () {
                        HtmlBody.removeClass('motopress-ce-jumping-fix');
                        clearTimeout(tJumpFix);
                    }, 0);
                }
            });
        }(jQuery));
        (function ($) {
            CE.Link = can.Construct(
            {
                myThis: null,
                wpLink: null,
                submitCallback: null,
                closeCallback: null,
                inputs: {}
            }, 
            {
                init: function () {
                    CE.Link.myThis = this;
                    CE.Link.wpLink = parent.wpLink;
                    CE.Link.inputs.submit = $('#wp-link-submit', parent.document);
                    CE.Link.inputs.cancel = $('#wp-link-cancel', parent.document);
                    if (parent.MP.Utils.version_compare(parent.motopressCE.settings.wp.wordpress_version, '4.2', '>=')) {
                        CE.Link.inputs.url = $('#wp-link-url', parent.document);
                        CE.Link.inputs.title = $('#wp-link-text', parent.document);
                        CE.Link.inputs.openInNewTab = $('#wp-link-target', parent.document);
                    } else {
                        CE.Link.inputs.url = $('#url-field', parent.document);
                        CE.Link.inputs.title = $('#link-title-field', parent.document);
                        CE.Link.inputs.openInNewTab = $('#link-target-checkbox', parent.document);
                    }
                },
                open: function (element, showObj, submitCallback, cancelCallback) {
                    var show = {
                        url: true,
                        title: true,
                        target: true
                    };
                    if (typeof showObj !== 'undefined')
                        $.extend(show, showObj);
                    if (typeof CE.Link.wpLink == 'undefined')
                        return;
                    CE.Link.submitCallback = submitCallback;
                    CE.Link.inputs.submit.off('mousedown.motopress-wplink-submit').on('mousedown.motopress-wplink-submit', this.wpSubmitButtonHandler);
                    CE.Link.inputs.cancel.off('click.motopress-wplink-cancel').on('click.motopress-wplink-cancel', cancelCallback);
                    parent.wpActiveEditor = parent.tinyMCE.activeEditor.id;
                    var url = null;
                    CE.Link.wpLink.setDefaultValues = function () {
                        var openInNewTab = null, textarea = null;
                        if ($.isPlainObject(element)) {
                            url = element.href;
                            openInNewTab = element.target === '_blank' ? true : false;
                            textarea = element.textarea;
                        } else {
                            url = element.val();
                            textarea = element;
                        }
                        if (url === '' || url === '#')
                            url = 'http://';
                        CE.Link.inputs.url.val(url);
                        CE.Link.inputs.openInNewTab.prop('checked', openInNewTab);
                        CE.Link.wpLink.textarea = textarea;
                    };
                    CE.Link.wpLink.open();
                    if (!url) {
                        if ($.isPlainObject(element)) {
                            url = element.href;
                        } else {
                            url = element.val();
                        }
                        CE.Link.inputs.url.val(url);
                    }
                    if (typeof CE.Link.inputs.close === 'undefined')
                        CE.Link.inputs.close = $('.ui-dialog-titlebar-close', parent.document);
                    CE.Link.inputs.close.off('mousedown.motopress-wplink-close').on('mousedown.motopress-wplink-close', cancelCallback);
                    if (!show.url)
                        CE.Link.inputs.url.closest('div').hide();
                    if (!show.title)
                        CE.Link.inputs.title.closest('div').hide();
                    if (!show.target)
                        CE.Link.inputs.openInNewTab.closest('div').hide();
                    parent.CE.Iframe.myThis.wpLinkCloseCallback(this.onDialogClose);
                },
                wpCancelButtonHandler: function (event) {
                    CE.Link.wpLink.close();
                    return false;
                },
                wpSubmitButtonHandler: function (event) {
                    var attrs = CE.Link.wpLink.getAttrs();
                    if (!attrs.href || attrs.href == 'http://')
                        return;
                    if (CE.Link.submitCallback)
                        CE.Link.submitCallback(attrs);
                    CE.Link.wpLink.close();
                    return false;
                },
                onDialogClose: function () {
                    CE.Link.inputs.submit.off('mousedown.motopress-wplink-submit');
                    CE.Link.inputs.cancel.off('click.motopress-wplink-cancel');
                    CE.Link.inputs.close.off('mousedown.motopress-wplink-close');
                    CE.Link.inputs.url.closest('div').show();
                    CE.Link.inputs.title.closest('div').show();
                    CE.Link.inputs.openInNewTab.closest('div').show();
                }
            });
        }(jQuery));
        (function ($) {
            CE.WPGallery = can.Construct({ myThis: null }, {
                frame: null,
                ctrl: null,
                init: function () {
                    CE.WPGallery.myThis = this;
                    var media = parent.wp.media, Attachment = media.model.Attachment;
                    media.controller.CEGallery = media.controller.FeaturedImage.extend({
                        defaults: parent._.defaults({
                            id: 'motopress-media-library-gallery',
                            title: localStorage.getItem('CEWpGalleryText'),
                            toolbar: 'main-insert',
                            filterable: 'uploaded',
                            library: media.query({ type: 'image' }),
                            multiple: 'add',
                            editable: true,
                            priority: 60,
                            syncSelection: false
                        }, media.controller.Library.prototype.defaults),
                        updateSelection: function () {
                            var selection = this.get('selection'), ids = CE.WPGallery.myThis.ctrl.get(), attachments;
                            if ('' !== ids && -1 !== ids) {
                                attachments = parent._.map(ids.split(/,/), function (id) {
                                    return Attachment.get(id);
                                });
                            }
                            selection.reset(attachments);
                        }
                    });
                    media.view.MediaFrame.CEGallery = media.view.MediaFrame.Post.extend({
                        createStates: function () {
                            var options = this.options;
                            this.states.add([
                                new media.controller.CEGallery()]);
                        },
                        bindHandlers: function () {
                            media.view.MediaFrame.Select.prototype.bindHandlers.apply(this, arguments);
                            this.on('toolbar:create:main-insert', this.createToolbar, this);
                            var handlers = {
                                content: {
                                    'embed': 'embedContent',
                                    'edit-selection': 'editSelectionContent'
                                },
                                toolbar: { 'main-insert': 'mainInsertToolbar' }
                            };
                            parent._.each(handlers, function (regionHandlers, region) {
                                parent._.each(regionHandlers, function (callback, handler) {
                                    this.on(region + ':render:' + handler, this[callback], this);
                                }, this);
                            }, this);
                        },
                        mainInsertToolbar: function (view) {
                            var controller = this;
                            this.selectionStatusToolbar(view);
                            view.set('insert', {
                                style: 'primary',
                                priority: 80,
                                text: localStorage.getItem('CEWpGalleryText'),
                                requires: { selection: true },
                                click: function () {
                                    var state = controller.state(), selection = state.get('selection');
                                    controller.close();
                                    state.trigger('insert', selection).reset();
                                }
                            });
                        }
                    });
                    this.frame = new media.view.MediaFrame.CEGallery(parent._.defaults({}, {
                        state: 'motopress-media-library-gallery',
                        title: localStorage.getItem('CEWpGalleryText'),
                        library: { type: 'image' },
                        multiple: true
                    }));
                    this.frame.on('open', this.proxy('onOpen'));
                    this.frame.on('close', this.proxy('onClose'));
                    this.frame.on('insert', this.proxy('setImage'));
                },
                open: function (ctrl) {
                    this.ctrl = ctrl;
                    this.frame.open();
                },
                onOpen: function () {
                    var frame = this.frame;
                    frame.reset();
                    var ids = this.ctrl.getArray();
                    if (ids !== null) {
                        var attachment = null;
                        ids.forEach(function (id) {
                            attachment = parent.wp.media.attachment(id);
                            attachment.fetch();
                            frame.state().get('selection').add(attachment);
                        });
                    }
                },
                onClose: function () {
                    $('.' + CE.Dialog.myThis.dialogClass).focus();
                    var HtmlBody = $(parent.document).find('html, body');
                    HtmlBody.addClass('motopress-ce-jumping-fix');
                    var tJumpFix = setTimeout(function () {
                        HtmlBody.removeClass('motopress-ce-jumping-fix');
                        clearTimeout(tJumpFix);
                    }, 0);
                },
                setImage: function () {
                    var ids = [];
                    var models = this.frame.state().get('selection').models;
                    $.each(models, function (key, model) {
                        var attributes = model.attributes;
                        ids.push(attributes.id);
                    });
                    this.ctrl.set(ids);
                    this.ctrl.element.trigger('change');
                }
            });
        }(jQuery));
        (function ($) {
            CE.Dialog = can.Construct(
            { myThis: null }, 
            {
                dialogClass: 'motopress-dialog',
                element: $('<div />', { id: 'motopress-dialog' }),
                shortcode: null,
                oldShortcode: null,
                dialog: null,
                minimizeRestoreBtn: $('<button />', { 'class': 'ui-dialog-titlebar-minimize' }),
                state: {
                    minimized: 'minimized',
                    restored: 'restored'
                },
                tabs: $('<div />', { id: 'motopress-dialog-tabs' }),
                settingsTitle: $('<li />'),
                styleTitle: $('<li />'),
                settingsTab: $('<div />', { id: 'motopress-dialog-settings-tab' }),
                styleTab: $('<div />', { id: 'motopress-dialog-style-tab' }),
                styleEditorContainer: $('<div />', {
                    id: 'motopress-style-editor-container',
                    'class': 'motopress-hide'
                }),
                mode: 'tabs',
                setup: function () {
                    var ul = $('<ul />');
                    $('<a />', {
                        href: '#' + this.settingsTab.attr('id'),
                        'class': 'motopress-text-no-color-text',
                        text: localStorage.getItem('CESettings')
                    }).append($('<i />', { 'class': 'motopress-settings-icon' })).appendTo(this.settingsTitle);
                    $('<a />', {
                        href: '#' + this.styleTab.attr('id'),
                        'class': 'motopress-text-no-color-text',
                        text: localStorage.getItem('CEStyle')
                    }).append($('<i />', { 'class': 'motopress-style-icon' })).appendTo(this.styleTitle);
                    ul.append(this.settingsTitle, this.styleTitle);
                    this.tabs.append(ul, this.settingsTab, this.styleTab).appendTo(this.element);
                    this.styleEditorContainer.appendTo(this.element);
                    this.element.appendTo('body');
                },
                'setMode': function (mode) {
                    switch (mode) {
                    case 'tabs':
                        this.styleEditorContainer.addClass('motopress-hide');
                        this.tabs.removeClass('motopress-hide');
                        break;
                    case 'style-editor':
                        this.tabs.addClass('motopress-hide');
                        this.styleEditorContainer.removeClass('motopress-hide');
                        break;
                    }
                    this.mode = mode;
                    this.updateTitle();
                },
                updateTitle: function () {
                    var shortcodeCtrl = this.shortcode.control();
                    switch (this.getMode()) {
                    case 'tabs':
                        this.setTitle(shortcodeCtrl.shortcodeLabel);
                        break;
                    case 'style-editor':
                        var styleEditorCtrl = this.styleEditorContainer.children().control();
                        this.setTitle(shortcodeCtrl.shortcodeLabel + ' - ' + styleEditorCtrl.getTitle());
                        break;
                    }
                },
                getMode: function () {
                    return this.mode;
                },
                init: function () {
                    CE.Dialog.myThis = this;
                    var dialog = null;
                    var isHandleN = false;
                    var scrollTop = 0;
                    var jqVersion = parent.MP.Utils.version_compare($.fn.jquery, '1.9.0', '<');
                    var left = sessionStorage.getItem('motopressDialogLeft');
                    var top = sessionStorage.getItem('motopressDialogTop');
                    var position = left !== null && top !== null ? [
                        parseInt(left),
                        parseInt(top)
                    ] : {
                        my: 'right-20 top+20',
                        at: 'right top',
                        of: window
                    };
                    var width = sessionStorage.getItem('motopressDialogWidth');
                    var height = sessionStorage.getItem('motopressDialogHeight');
                    if (width === null)
                        width = 300;
                    if (height === null)
                        height = 500;
                    $.ui.dialog.prototype._focusTabbable = function () {
                    };
                    this.element.dialog({
                        autoOpen: false,
                        closeOnEscape: true,
                        closeText: '',
                        dialogClass: this.dialogClass,
                        draggable: true,
                        modal: false,
                        position: position,
                        resizable: true,
                        minWidth: 280,
                        width: width,
                        minHeight: 280,
                        height: height,
                        maxHeight: $(window).height(),
                        create: function () {
                            CE.Dialog.myThis.dialog = CE.Dialog.myThis.element.dialog('widget');
                            dialog = CE.Dialog.myThis.dialog;
                            dialog.on('resizestart', function (e, ui) {
                                isHandleN = $(e.originalEvent.target).hasClass('ui-resizable-n');
                                scrollTop = $(document).scrollTop();
                                if (jqVersion) {
                                    if (!isHandleN)
                                        $(this).css('top', parseInt($(this).css('top')) - scrollTop);
                                }
                            });
                            dialog.on('resize', function (e, ui) {
                                if (jqVersion && isHandleN)
                                    $(this).css('top', parseInt($(this).css('top')) - scrollTop);
                            });
                            dialog.on('resizestop', function (e, ui) {
                                CE.Dialog.myThis.savePosition(ui);
                                CE.Dialog.myThis.saveSize(ui);
                            });
                            $(this).prev('.ui-dialog-titlebar').find('.ui-dialog-titlebar-close').before(CE.Dialog.myThis.minimizeRestoreBtn);
                            var draggableCancelOption = dialog.draggable('option', 'cancel') + ', .ui-dialog-titlebar-minimize, .ui-dialog-titlebar-restore';
                            dialog.draggable('option', 'cancel', draggableCancelOption);
                            CE.Dialog.myThis.minimizeRestoreBtn.on('click', function () {
                                if ($(this).hasClass('ui-dialog-titlebar-minimize')) {
                                    CE.Dialog.myThis.minimize();
                                } else {
                                    CE.Dialog.myThis.restore();
                                }
                            });    
                        },
                        dragStart: function (e, ui) {
                            CE.LeftBar.myThis.disable();
                        },
                        dragStop: function (e, ui) {
                            CE.Dialog.myThis.savePosition(ui);
                            CE.LeftBar.myThis.enable();
                        },
                        close: function () {
                            CE.Dialog.myThis.close();
                        },
                        beforeClose: function (e, ui) {
                        },
                        open: function () {
                            var selected = $('.' + CE.Selectable.myThis.selectedClass);
                            if (selected.length)
                                CE.Selectable.focusWithoutScroll(selected.prev());
                            var dLeft = parseInt(sessionStorage.getItem('motopressDialogLeft'));
                            var dTop = parseInt(sessionStorage.getItem('motopressDialogTop'));
                            var dWidth = dialog.width(), dHeight = dialog.height();
                            var wWidth = $(window).width(), wHeight = $(window).height();
                            if (dHeight > wHeight) {
                                dHeight = wHeight;
                                dialog.height(dHeight);
                            }
                            if (dTop < 0)
                                dialog.css('top', 0);
                            else if (dHeight < wHeight && dTop + dHeight > wHeight)
                                dialog.css('top', wHeight - dHeight);
                            else if (dTop + dHeight > wHeight)
                                dialog.css('top', wHeight - dHeight);
                            else
                                dialog.css('top', dTop);
                            if (dLeft < 0)
                                dialog.css('left', 0);
                            else if (dWidth < wWidth && dLeft + dWidth > wWidth)
                                dialog.css('left', wWidth - dWidth);
                            else
                                dialog.css('left', dLeft);
                        },
                        resizeStart: function () {
                            CE.LeftBar.myThis.disable();
                        },
                        resizeStop: function () {
                            CE.LeftBar.myThis.enable();
                        }
                    });
                    $(parent.window).on('resize.CE.Dialog', this.proxy('onResize'));
                    parent.MP.Utils.fixTabsBaseTagConflict(this.tabs, document, location);
                    this.tabs.tabs({
                        activate: function (e, ui) {
                            CE.Dialog.myThis.shortcode.attr('data-motopress-dialog-tab', ui.newTab.index());
                        }
                    });
                },
                _destroy: function () {
                    $(parent.window).off('resize.CE.Dialog');
                },
                onResize: function () {
                    this.element.dialog('option', 'maxHeight', $(window).height());
                },
                open: function (dragHandle) {
                    this.oldShortcode = this.shortcode;
                    if (dragHandle.hasClass('motopress-clmn-select-handle')) {
                        this.shortcode = dragHandle.closest('.motopress-clmn');
                    } else if (dragHandle.hasClass('motopress-row-select-handle')) {
                        this.shortcode = dragHandle.closest('.motopress-row');
                    } else {
                        this.shortcode = dragHandle.closest('.motopress-clmn').find('.motopress-block-content').first().children('[data-motopress-shortcode]');
                    }
                    var sameDialog = false;
                    if (typeof this.shortcode !== 'undefined' && this.shortcode && this.shortcode.length && (typeof this.oldShortcode !== 'undefined' && this.oldShortcode && this.oldShortcode.length)) {
                        if (this.shortcode[0] === this.oldShortcode[0]) {
                            sameDialog = true;
                        }
                    }
                    var ctrl = this.shortcode.control(CE.Controls);
                    if (CE.LeftBar.myThis.library !== null && typeof ctrl.group !== 'undefined' && typeof ctrl.shortcodeName !== 'undefined') {
                        if (CE.LeftBar.myThis.library[ctrl.group].objects.hasOwnProperty(ctrl.shortcodeName)) {
                            var object = CE.LeftBar.myThis.library[ctrl.group].objects[ctrl.shortcodeName];
                            var isEmptyParameters = $.isEmptyObject(object.parameters);
                            var styleProps = this.isGrid ? 'gridProps' : 'props';
                            if (!isEmptyParameters || !$.isEmptyObject(CE.Style[styleProps])) {
                                this.setTitle(ctrl.shortcodeLabel);
                                var isNew = false;
                                if (this.shortcode.hasClass('motopress-new-object')) {
                                    isNew = true;
                                    this.shortcode.removeClass('motopress-new-object');
                                }
                                if (!sameDialog) {
                                    ctrl.display(isNew);
                                }
                                if (sessionStorage.getItem('motopressDialogState') === this.state.minimized) {
                                    this.minimize();
                                } else {
                                    this.restore();
                                }
                                var activeTab = !isEmptyParameters ? this.settingsTitle.index() : this.styleTitle.index();
                                var shortcodeTab = this.shortcode.attr('data-motopress-dialog-tab');
                                if (typeof shortcodeTab !== 'undefined')
                                    activeTab = shortcodeTab;
                                if (!isEmptyParameters) {
                                    if (this.tabs.tabs('option', 'disabled') !== false)
                                        this.tabs.tabs('enable', this.settingsTitle.index());
                                } else {
                                    this.tabs.tabs('disable', this.settingsTitle.index());
                                }
                                this.tabs.tabs('option', 'active', activeTab);
                                this.element.dialog('open');
                                this.element.find('.motopress-controls').trigger('dialogOpen');
                            }
                        }
                    }
                },
                close: function () {
                    if (this.getMode() === 'style-editor') {
                        var formStyleEditorCtrl = this.styleEditorContainer.children().control();
                        formStyleEditorCtrl.confirm();
                    }
                    this.setTitle();
                    var selected = $('.' + CE.Selectable.myThis.selectedClass);
                    if (selected.length)
                        CE.Selectable.focusWithoutScroll(selected.prev());
                },
                setTitle: function (title) {
                    title = typeof title !== 'undefined' ? title : '';
                    if (typeof title === 'string') {
                        this.element.dialog('option', 'title', title);
                        var widget = this.element.dialog('widget');
                        widget.find('.ui-dialog-title').attr('title', title);
                    }
                },
                savePosition: function (ui) {
                    sessionStorage.setItem('motopressDialogLeft', this.dialog.css('left'));
                    sessionStorage.setItem('motopressDialogTop', this.dialog.css('top'));    
                },
                saveSize: function (ui) {
                    sessionStorage.setItem('motopressDialogWidth', ui.size.width);
                    sessionStorage.setItem('motopressDialogHeight', ui.size.height);
                },
                minimize: function () {
                    this.minimizeRestoreBtn.removeClass('ui-dialog-titlebar-minimize').addClass('ui-dialog-titlebar-restore');
                    sessionStorage.setItem('motopressDialogState', this.state.minimized);
                    this.element.nextAll().add(this.element).addClass('motopress-hide');
                    this.dialog.removeClass('motopress-dialog-' + this.state.restored).addClass('motopress-dialog-' + this.state.minimized);
                },
                restore: function () {
                    this.minimizeRestoreBtn.removeClass('ui-dialog-titlebar-restore').addClass('ui-dialog-titlebar-minimize');
                    sessionStorage.setItem('motopressDialogState', this.state.restored);
                    this.element.nextAll().add(this.element).removeClass('motopress-hide');
                    this.dialog.removeClass('motopress-dialog-' + this.state.minimized).addClass('motopress-dialog-' + this.state.restored);
                }
            });
        }(jQuery));
        (function ($) {
            CE.WPMedia = can.Construct(
            { myThis: null }, 
            {
                frame: null,
                propertyMedia: null,
                init: function () {
                    CE.WPMedia.myThis = this;
                    this.frame = parent.wp.media({
                        id: 'motopress-media-library',
                        multiple: false,
                        describe: false,
                        toolbar: 'select',
                        sidebar: 'settings',
                        content: 'upload',
                        router: 'browse',
                        menu: 'default',
                        searchable: true,
                        filterable: false,
                        sortable: false,
                        title: localStorage.getItem('CEMediaLibraryText'),
                        button: { text: localStorage.getItem('CEMediaLibraryText') },
                        contentUserSetting: true,
                        syncSelection: true
                    });
                    this.frame.on('open', this.proxy('onOpen'));
                    this.frame.on('select', this.proxy('setMedia'));
                    this.frame.on('close', this.proxy('onClose'));
                },
                onOpen: function () {
                    var attachment, dataMediaId;
                    this.propertyMedia = CE.Dialog.myThis.element.find('[data-motopress-open-media-lib=1]');
                    this.propertyMediaID = this.propertyMedia.find('.motopress-property-media-id');
                    this.propertyMediaSrc = this.propertyMedia.find('.motopress-property-media');
                    dataMediaId = this.propertyMediaID.val();
                    if (dataMediaId !== null) {
                        attachment = parent.wp.media.attachment(dataMediaId);
                    } else {
                        attachment = parent.wp.media.attachment();
                    }
                    attachment.fetch();
                    this.frame.state().get('selection').add(attachment);
                },
                setMedia: function () {
                    var attributes = this.frame.state().get('selection').models[0].attributes, mediaCtrl = this.propertyMedia.control();
                    var id = attributes.id;
                    var url = attributes.url;
                    this.propertyMediaID.val(id);
                    this.propertyMediaSrc.val(url);
                    mediaCtrl.element.removeAttr('data-motopress-open-media-lib');
                    mediaCtrl.element.trigger('change');
                },
                onClose: function () {
                    $('.' + CE.Dialog.myThis.dialogClass).focus();
                    this.propertyMedia.removeAttr('data-motopress-open-media-lib');
                    var HtmlBody = $(parent.document).find('html, body');
                    HtmlBody.addClass('motopress-ce-jumping-fix');
                    var tJumpFix = setTimeout(function () {
                        HtmlBody.removeClass('motopress-ce-jumping-fix');
                        clearTimeout(tJumpFix);
                    }, 0);
                }
            });
            CE.WPAudio = can.Construct(
            { myThis: null }, 
            {
                frame: null,
                propertyAudio: null,
                propertyAudioTitle: null,
                init: function () {
                    CE.WPAudio.myThis = this;
                    this.frame = parent.wp.media({
                        id: 'motopress-audio-library',
                        multiple: false,
                        describe: false,
                        toolbar: 'select',
                        sidebar: 'settings',
                        content: 'upload',
                        router: 'browse',
                        menu: 'default',
                        searchable: true,
                        filterable: false,
                        sortable: false,
                        title: 'Set audio file',
                        button: {
                            text: 'Set audio file'
                        },
                        library: { type: 'audio' },
                        contentUserSetting: true,
                        syncSelection: true
                    });
                    this.frame.on('open', this.proxy('onOpen'));
                    this.frame.on('select', this.proxy('setAudio'));
                    this.frame.on('close', this.proxy('onClose'));
                },
                onOpen: function () {
                    var attachment, dataAudioId;
                    this.propertyAudio = CE.Dialog.myThis.element.find('.motopress-property-audio-id');
                    this.propertyAudioTitle = CE.Dialog.myThis.element.find('.motopress-property-audio-title');
                    dataAudioId = this.propertyAudio.val();
                    if (dataAudioId !== null) {
                        attachment = parent.wp.media.attachment(dataAudioId);
                    } else {
                        attachment = parent.wp.media.attachment();
                    }
                    attachment.fetch();
                    this.frame.state().get('selection').add(attachment);
                },
                setAudio: function () {
                    var attributes = this.frame.state().get('selection').models[0].attributes;
                    this.propertyAudio.val(attributes.id);
                    this.propertyAudioTitle.val(attributes.title);
                    this.propertyAudio.trigger('change');
                },
                onClose: function () {
                    $('.' + CE.Dialog.myThis.dialogClass).focus();
                    var HtmlBody = $(parent.document).find('html, body');
                    HtmlBody.addClass('motopress-ce-jumping-fix');
                    var tJumpFix = setTimeout(function () {
                        HtmlBody.removeClass('motopress-ce-jumping-fix');
                        clearTimeout(tJumpFix);
                    }, 0);
                }
            });
            CE.WPVideo = can.Construct(
            { myThis: null }, 
            {
                frame: null,
                propertyVideo: null,
                init: function () {
                    CE.WPVideo.myThis = this;
                    this.frame = parent.wp.media({
                        id: 'motopress-video-library',
                        multiple: false,
                        describe: false,
                        toolbar: 'select',
                        sidebar: 'settings',
                        content: 'upload',
                        router: 'browse',
                        menu: 'default',
                        searchable: true,
                        filterable: false,
                        sortable: false,
                        title: localStorage.getItem('CEVideoLibraryText'),
                        button: { text: localStorage.getItem('CEVideoLibraryText') },
                        library: { type: 'video' },
                        contentUserSetting: true,
                        syncSelection: true
                    });
                    this.frame.on('open', this.proxy('onOpen'));
                    this.frame.on('select', this.proxy('setVideo'));
                    this.frame.on('close', this.proxy('onClose'));
                },
                onOpen: function () {
                    this.propertyVideo = CE.Dialog.myThis.element.find('[data-motopress-open-video-lib=1]');
                },
                setVideo: function () {
                    var attributes = this.frame.state().get('selection').models[0].attributes;
                    var url = attributes.url;
                    var videoCtrl = this.propertyVideo.control();
                    videoCtrl.set(url);
                    videoCtrl.element.removeAttr('data-motopress-open-video-lib');
                    videoCtrl.element.trigger('change');
                },
                onClose: function () {
                    $('.' + CE.Dialog.myThis.dialogClass).focus();
                    this.propertyVideo.removeAttr('data-motopress-open-video-lib');
                    var HtmlBody = $(parent.document).find('html, body');
                    HtmlBody.addClass('motopress-ce-jumping-fix');
                    var tJumpFix = setTimeout(function () {
                        HtmlBody.removeClass('motopress-ce-jumping-fix');
                        clearTimeout(tJumpFix);
                    }, 0);
                }
            });
        }(jQuery));
        (function ($) {
            CE.Style = can.Construct(
            {
                gridProps: null,
                props: {
                    mp_custom_style: {
                        type: 'style_editor',
                        label: localStorage.getItem('CECustomStyle'),
                        description: localStorage.getItem('CECustomStyleDesc'),
                        parameters: {
                            'background-color': {
                                'type': 'color-picker',
                                'label': localStorage.getItem('CEBgColor'),
                                'default': ''
                            },
                            'color': {
                                'type': 'color-picker',
                                'label': 'Text Color',
                                'default': ''
                            },
                            'background-image-type': {
                                'type': 'radio-buttons',
                                'label': 'Background Type',
                                'default': 'image',
                                'list': {
                                    'image': 'Image',
                                    'gradient': 'Gradient',
                                    'none': 'None'
                                }
                            },
                            'background-image': {
                                'type': 'image-src',
                                'label': localStorage.getItem('CEBgImage'),
                                'default': '',
                                'dependency': {
                                    'parameter': 'background-image-type',
                                    'value': 'image'
                                }
                            },
                            'background-repeat': {
                                'type': 'select',
                                'label': localStorage.getItem('CEBgImageRepeat'),
                                'default': '',
                                'list': {
                                    '': localStorage.getItem('CEDefault'),
                                    'repeat': localStorage.getItem('CERepeat'),
                                    'repeat-x': localStorage.getItem('CERepeatX'),
                                    'repeat-y': localStorage.getItem('CERepeatY'),
                                    'no-repeat': localStorage.getItem('CENoRepeat')
                                },
                                'dependency': {
                                    'parameter': 'background-image',
                                    'except': ''
                                }
                            },
                            'background-size': {
                                'type': 'select',
                                'label': localStorage.getItem('CEBgImageSize'),
                                'default': '',
                                'list': {
                                    '': localStorage.getItem('CEDefault'),
                                    'cover': localStorage.getItem('CECover'),
                                    'contain': localStorage.getItem('CEContain'),
                                    'auto': localStorage.getItem('CEAuto')
                                },
                                'dependency': {
                                    'parameter': 'background-image',
                                    'except': ''
                                }
                            },
                            'background-position': {
                                'type': 'select',
                                'label': localStorage.getItem('CEBgImagePosition'),
                                'default': '',
                                'list': {
                                    '': localStorage.getItem('CEDefault'),
                                    'center center': localStorage.getItem('CECenter') + ' ' + localStorage.getItem('CEMiddle'),
                                    'center top': localStorage.getItem('CECenter') + ' ' + localStorage.getItem('CETop'),
                                    'center bottom': localStorage.getItem('CECenter') + ' ' + localStorage.getItem('CEBottom'),
                                    'left top': localStorage.getItem('CELeft') + ' ' + localStorage.getItem('CETop'),
                                    'left center': localStorage.getItem('CELeft') + ' ' + localStorage.getItem('CEMiddle'),
                                    'left bottom': localStorage.getItem('CELeft') + ' ' + localStorage.getItem('CEBottom'),
                                    'right top': localStorage.getItem('CERight') + ' ' + localStorage.getItem('CETop'),
                                    'right center': localStorage.getItem('CERight') + ' ' + localStorage.getItem('CECenter'),
                                    'right bottom': localStorage.getItem('CERight') + ' ' + localStorage.getItem('CEBottom'),
                                    'custom': localStorage.getItem('CECustom')
                                },
                                'dependency': {
                                    'parameter': 'background-image',
                                    'except': ''
                                }
                            },
                            'background-position-x': {
                                'type': 'spinner',
                                'label': localStorage.getItem('CEBgImagePositionX'),
                                'min': 0,
                                'max': 100,
                                'step': 1,
                                'default': '50',
                                'dependency': {
                                    'parameter': 'background-position',
                                    'value': 'custom'
                                }
                            },
                            'background-position-y': {
                                'type': 'spinner',
                                'label': localStorage.getItem('CEBgImagePositionY'),
                                'min': 0,
                                'max': 100,
                                'step': 1,
                                'default': '50',
                                'dependency': {
                                    'parameter': 'background-position',
                                    'value': 'custom'
                                }
                            },
                            'background-attachment': {
                                'type': 'select',
                                'label': localStorage.getItem('CEBgImageAttachment'),
                                'default': '',
                                'list': {
                                    '': localStorage.getItem('CEDefault'),
                                    'fixed': localStorage.getItem('CEFixed'),
                                    'scroll': localStorage.getItem('CEScroll')
                                },
                                'dependency': {
                                    'parameter': 'background-image',
                                    'except': ''
                                }
                            },
                            'background-gradient': {
                                'type': 'gradient-picker',
                                'label': '',
                                'default': '',
                                'dependency': {
                                    'parameter': 'background-image-type',
                                    'value': 'gradient',
                                    'needDependenceValue': true
                                }
                            },
                            'padding-top': {
                                'type': 'text',
                                'label': localStorage.getItem('CEPaddingTop'),
                                'default': ''
                            },
                            'padding-bottom': {
                                'type': 'text',
                                'label': localStorage.getItem('CEPaddingBottom'),
                                'default': ''
                            },
                            'padding-left': {
                                'type': 'text',
                                'label': localStorage.getItem('CEPaddingLeft'),
                                'default': ''
                            },
                            'padding-right': {
                                'type': 'text',
                                'label': localStorage.getItem('CEPaddingRight'),
                                'default': ''
                            },
                            'margin-top': {
                                'type': 'text',
                                'label': localStorage.getItem('CEMarginTop'),
                                'default': ''
                            },
                            'margin-bottom': {
                                'type': 'text',
                                'label': localStorage.getItem('CEMarginBottom'),
                                'default': ''
                            },
                            'margin-left': {
                                'type': 'text',
                                'label': localStorage.getItem('CEMarginLeft'),
                                'default': ''
                            },
                            'margin-right': {
                                'type': 'text',
                                'label': localStorage.getItem('CEMarginRight'),
                                'default': ''
                            },
                            'border-style': {
                                'type': 'select',
                                'label': localStorage.getItem('CEBorderStyle'),
                                'default': '',
                                'list': {
                                    '': localStorage.getItem('CEDefault'),
                                    'none': localStorage.getItem('CENone'),
                                    'solid': localStorage.getItem('CESolid'),
                                    'dotted': localStorage.getItem('CEDotted'),
                                    'dashed': localStorage.getItem('CEDashed'),
                                    'double': localStorage.getItem('CEDouble'),
                                    'grouve': localStorage.getItem('CEGrouve'),
                                    'ridge': localStorage.getItem('CERidge'),
                                    'inset': localStorage.getItem('CEInset'),
                                    'outset': localStorage.getItem('CEOutset')
                                }
                            },
                            'border-top-width': {
                                'type': 'text',
                                'label': localStorage.getItem('CEBorderWidthTop'),
                                'default': '',
                                'dependency': {
                                    'parameter': 'border-style',
                                    'except': 'none'
                                }
                            },
                            'border-bottom-width': {
                                'type': 'text',
                                'label': localStorage.getItem('CEBorderWidthBottom'),
                                'default': '',
                                'dependency': {
                                    'parameter': 'border-style',
                                    'except': 'none'
                                }
                            },
                            'border-left-width': {
                                'type': 'text',
                                'label': localStorage.getItem('CEBorderWidthLeft'),
                                'default': '',
                                'dependency': {
                                    'parameter': 'border-style',
                                    'except': 'none'
                                }
                            },
                            'border-right-width': {
                                'type': 'text',
                                'label': localStorage.getItem('CEBorderWidthRight'),
                                'default': '',
                                'dependency': {
                                    'parameter': 'border-style',
                                    'except': 'none'
                                }
                            },
                            'border-color': {
                                'type': 'color-picker',
                                'label': localStorage.getItem('CEBorderColor'),
                                'default': '',
                                'dependency': {
                                    'parameter': 'border-style',
                                    'except': 'none'
                                }
                            },
                            'border-top-left-radius': {
                                'type': 'text',
                                'label': localStorage.getItem('CEBorderRadiusTopLeft'),
                                'default': ''
                            },
                            'border-top-right-radius': {
                                'type': 'text',
                                'label': localStorage.getItem('CEBorderRadiusTopRight'),
                                'default': ''
                            },
                            'border-bottom-left-radius': {
                                'type': 'text',
                                'label': localStorage.getItem('CEBorderRadiusBottomLeft'),
                                'default': ''
                            },
                            'border-bottom-right-radius': {
                                'type': 'text',
                                'label': localStorage.getItem('CEBorderRadiusBottomRight'),
                                'default': ''
                            }
                        }
                    },
                    mp_style_classes: {
                        type: 'select2',
                        label: localStorage.getItem('CEStyleClassesLabel'),
                        description: localStorage.getItem('CEStyleClassesLabelDesc')
                    },
                    margin: {
                        type: 'margin',
                        label: localStorage.getItem('CEMarginLabel'),
                        sides: [
                            'top',
                            'bottom',
                            'left',
                            'right'
                        ],
                        values: [
                            'none',
                            0,
                            10,
                            15,
                            20,
                            25,
                            50,
                            100
                        ],
                        'default': [
                            'none',
                            'none',
                            'none',
                            'none'
                        ],
                        classPrefix: 'motopress-margin-',
                        regExp: ''
                    }
                },
                getStyleEditorProps: function () {
                    return $.extend({}, CE.Style.props['mp_custom_style'].parameters);
                },
                globalPredefinedClasses: {}
            }, 
            {});
        }(jQuery));
        (function ($) {
            CE.Ctrl = can.Control.extend({
                bodyEl: $('body'),
                processValue: function (value, defaultValue, isNew) {
                    value = typeof isNew !== 'undefined' && isNew && typeof value === 'undefined' ? defaultValue : value;
                    if (!value)
                        value = '';
                    return String(value);
                }
            }, {
                name: null,
                dependency: false,
                disabled: false,
                hided: false,
                isPermanentHided: false,
                customized: false,
                shortcode: null,
                shortcodeName: null,
                shortcodeCtrl: null,
                formCtrl: null,
                init: function (el, args) {
                    this.customized = false;
                    this.name = args.name;
                    this.dependency = args.dependency;
                    this.disabled = args.disabled;
                    this.isPermanentHided = args.hasOwnProperty('isPermanentHided') && args.isPermanentHided;
                    this.formCtrl = args.formCtrl;
                    if (args.hasOwnProperty('innerForm')) {
                        this.innerForm = args.innerForm;
                    }
                    this.shortcode = args.shortcode;
                    this.shortcodeName = CE.Shortcode.getShortcodeName(this.shortcode);
                    this.shortcodeGroup = CE.Shortcode.getShortcodeGroup(this.shortcode);
                    this.shortcodeCtrl = args.shortcode.control();
                },
                afterInit: function () {
                    if (this.isPermanentHided) {
                        this.hide();
                    }
                },
                get: function () {
                },
                set: function () {
                },
                hide: function () {
                    this.element.closest('[data-motopress-parameter]').addClass('motopress-hide');
                    this.hided = true;
                },
                show: function () {
                    if (!this.isPermanentHided) {
                        this.element.closest('[data-motopress-parameter]').removeClass('motopress-hide');
                        this.hided = false;
                    }
                },
                isHided: function () {
                    return this.hided;
                },
                'change': function (el, e, doSave) {
                    e.stopPropagation();
                    if (typeof doSave === 'undefined')
                        doSave = true;
                    this.hideDependencedControls();
                    if (doSave) {
                        this.formCtrl.changeProperty(this);
                    }
                },
                ' customize': function (el, e) {
                    if (this.customized) {
                        return false;
                    } else {
                        this.customized = true;
                    }
                },
                hideDependencedControls: function () {
                    var $this = this;
                    var dependencedCtrl;
                    $this.formCtrl.form.find('> [data-motopress-parameter] > .motopress-controls:not(".select2-container"), > [data-motopress-parameter] > :not(".motopress-property-legend, .motopress-property-label, .motopress-property-description, hr") > .motopress-controls').each(function () {
                        dependencedCtrl = $(this).control();
                        if (dependencedCtrl.dependency) {
                            if ($this.name === dependencedCtrl.dependency.parameter) {
                                if (dependencedCtrl.isShouldBeHiddenByDependency()) {
                                    dependencedCtrl.hide();
                                } else {
                                    dependencedCtrl.show();
                                }
                                dependencedCtrl.hideDependencedControls();
                            }
                        }
                    });
                },
                isShouldBeHiddenByDependency: function () {
                    var isHide = false;
                    if (this.hasOwnProperty('dependency') && this.dependency.hasOwnProperty('parameter')) {
                        var dependencyCtrl = this.formCtrl.getCtrlByName(this.dependency.parameter);
                        var isValueCorrect = this.dependency.hasOwnProperty('value') ? $.isArray(this.dependency.value) ? $.inArray(dependencyCtrl.get(), this.dependency.value) !== -1 : dependencyCtrl.get() == this.dependency.value : true;
                        var isValueExcepted = this.dependency.hasOwnProperty('except') ? $.isArray(this.dependency.except) ? $.inArray(dependencyCtrl.get(), this.dependency.except) !== -1 : dependencyCtrl.get() == this.dependency.except : false;
                        if (!isValueCorrect || isValueExcepted) {
                            isHide = true;
                        } else if (dependencyCtrl.dependency) {
                            isHide = dependencyCtrl.isShouldBeHiddenByDependency();
                        }
                    }
                    return isHide;
                }
            });
            CE.Ctrl('CE.CtrlInput', {}, {
                get: function () {
                    return this.element.val();
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    this.element.val(value);
                }
            });
            CE.Ctrl('CE.CtrlSpinner', { listensTo: ['customize'] }, {
                spinning: false,
                min: null,
                max: null,
                step: 1,
                init: function (el, args) {
                    this._super(el, args);
                    if (args.hasOwnProperty('min'))
                        this.min = args.min;
                    if (args.hasOwnProperty('max'))
                        this.max = args.max;
                    if (args.hasOwnProperty('step'))
                        this.step = args.step;
                },
                ' customize': function (el, e) {
                    if (this.customized)
                        return false;
                    else
                        this.customized = true;
                    var $this = this;
                    el.spinner({
                        disabled: this.disabled,
                        min: this.min,
                        max: this.max,
                        step: this.step,
                        stop: function (event, ui) {
                            if ($this.spinning) {
                                el.trigger('change', $this.oldValue);
                                $this.spinning = false;
                                $this.oldValue = null;
                            }
                        },
                        spin: function (event, ui) {
                            if (!$this.spinning) {
                                $this.spinning = true;
                                $this.oldValue = $this.get();
                            }
                        }
                    });
                },
                'change': function (el, e, oldValue) {
                    var value = this.get();
                    if (value !== null && oldValue !== value && value >= this.min && value <= this.max && (value / this.step).toFixed(12) % 1 === 0) {
                        CE.Ctrl.prototype.change.apply(this, [
                            el,
                            e
                        ]);
                    }
                },
                get: function () {
                    return this.element.spinner('value');
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    if (typeof this.element.data('uiSpinner') !== 'undefined') {
                        this.element.spinner('value', value);
                    } else {
                        this.element.val(value);
                    }
                }
            });
            CE.Ctrl('CE.CtrlDateTimePicker', { listensTo: ['customize'] }, {
                returnMode: null,
                displayMode: null,
                input: null,
                button: null,
                changeTimeout: null,
                init: function (el, args) {
                    this._super(el, args);
                    this.returnMode = args.returnMode;
                    this.displayMode = args.displayMode;
                    this.input = el.find('.motopress-property-datetime-picker-input');
                    this.wrapper = el.find('.motopress-property-datetime-picker-wrapper');
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    this.input.val(value);
                },
                get: function () {
                    return this.input.val();
                },
                ' customize': function (el, e) {
                    this._super(el, e);
                    var self = this;
                    this.wrapper.datetimepicker({
                        'format': this.returnMode,
                        'debug': false,
                        'icons': {
                            time: 'fa fa-clock-o',
                            date: 'fa fa-calendar',
                            up: 'fa fa-chevron-up',
                            down: 'fa fa-chevron-down',
                            previous: 'fa fa-chevron-left',
                            next: 'fa fa-chevron-right',
                            today: 'glyphicon glyphicon-screenshot',
                            clear: 'fa fa-trash-o'
                        }
                    })    
.on('dp.change', function (e) {
                        clearTimeout(self.changeTimeout);
                        self.changeTimeout = setTimeout(function () {
                            self.element.trigger('change');
                        }, 500);
                    });
                }
            });
            CE.Ctrl('CE.CtrlLink', {}, {
                get: function () {
                    return $('.motopress-property-link-input', this.element).val();
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    $('.motopress-property-link-input', this.element).val(value);
                },
                '.motopress-property-button-default click': function (el) {
                    var input = $('.motopress-property-link-input', this.element);
                    CE.Link.myThis.open(input, {
                        title: false,
                        target: false
                    }, function (atts) {
                        if (input.val == atts.href)
                            return;
                        input.val(atts.href);
                        input.trigger('change');
                    }, CE.Link.myThis.wpCancelButtonHandler);
                    return false;
                }
            });
            CE.Ctrl('CE.CtrlTextarea', {}, {
                get: function () {
                    return this.element.val();
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    this.element.val(value);
                }
            });
            CE.Ctrl('CE.CtrlTextarea64', {}, {
                get: function () {
                    return parent.MP.Utils.base64_encode(this.element.val());
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    this.element.val(parent.MP.Utils.base64_decode(value));
                }
            });
            CE.Ctrl('CE.CtrlTextareaTable', {}, {
                get: function () {
                    var value = parent.MP.Utils.nl2br(this.element.val());
                    return value;    
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    value = value.replace(new RegExp('^<p>'), '').replace(new RegExp('</p>$'), '');
                    value = parent.MP.Utils.br2nl(value);
                    this.element.val(value);    
                }
            });
            CE.Ctrl('CE.CtrlTextareaTinymce', {}, {
                textarea: null,
                currentShortcode: null,
                init: function (el, args) {
                    this._super(el, args);
                    this.textarea = el.children('.motopress-property-textarea');
                    this.currentShortcode = args.currentShortcode;
                },
                get: function () {
                    return this.textarea.val();
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    this.textarea.val(value);
                },
                '.motopress-property-button-default click': function (el, e) {
                    var editor = parent.CE.CodeModal.myThis.editor;
                    parent.CE.CodeModal.currentShortcode = this.currentShortcode;
                    parent.CE.CodeModal.currentTextareaTinymce = this.element;
                    var content = this.get();
                    if (content.length) {
                        if (editor !== null)
                            editor.setContent(content, { format: 'html' });
                        parent.CE.CodeModal.myThis.content.val(content);
                    }
                    parent.CE.CodeModal.myThis.saveHandler = this.saveHandler;
                    parent.CE.CodeModal.myThis.element.data('modal').closeDialog = false;
                    parent.CE.CodeModal.myThis.element.mpmodal('show');
                },
                saveHandler: function (e) {
                    var $this = parent.CE.CodeModal.myThis;
                    $this.switchVisual();
                    var controller = parent.CE.CodeModal.currentTextareaTinymce.control();
                    var content = $this.editor.getContent({ format: 'html' });
                    if (content.length) {
                        controller.set(content);
                        parent.CE.CodeModal.currentTextareaTinymce.trigger('change');
                    }
                    $this.element.mpmodal('hide');
                }
            });
            CE.Ctrl('CE.CtrlAudio', {}, {
                init: function (el, args) {
                    this._super(el, args);
                    $('.motopress-property-audio-title', this.element).val(args.audioTitle).attr('disabled', 'disabled');
                },
                get: function () {
                    var audioTitle = $('.motopress-property-audio-id', this.element).val();
                    return audioTitle;
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    $('.motopress-property-audio-id', this.element).val(value);
                },
                '.motopress-property-button-default click': function (el) {
                    CE.WPAudio.myThis.frame.open(this);
                }
            });
            CE.Ctrl('CE.CtrlMediaVideo', {}, {
                init: function (el, args) {
                    this._super(el, args);
                },
                get: function () {
                    var videoUrl = $('.motopress-property-video-url', this.element).val();
                    return videoUrl;
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    $('.motopress-property-video-url', this.element).val(value);
                },
                '.motopress-property-button-default click': function (el) {
                    this.element.attr('data-motopress-open-video-lib', 1);
                    CE.WPVideo.myThis.frame.open(this);
                }
            });
            CE.Ctrl('CE.CtrlMedia', { listensTo: ['dialogOpen'] }, {
                init: function (el, args) {
                    this._super(el, args);
                    if (args.returnMode == 'id') {
                        var massOfDetails = parent.CE.Iframe.myThis.wpAttachmentDetails;
                        for (var key in massOfDetails) {
                            if (args.value == key) {
                                $('.motopress-property-media-id', this.element).val(key);
                                $('.motopress-property-media', this.element).val(massOfDetails[key]).attr('disabled', 'disabled');
                            }
                        }
                    } else {
                        $('.motopress-property-media', this.element).val(args.value);
                    }
                },
                get: function () {
                    if (this.options.returnMode == 'id') {
                        var mediaId = $('.motopress-property-media-id', this.element).val();
                        return mediaId;
                    } else {
                        var mediaSrc = $('.motopress-property-media', this.element).val();
                        return mediaSrc;
                    }
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    if (this.options.returnMode == 'id') {
                        $('.motopress-property-media-id', this.element).val(value);
                    } else {
                        $('.motopress-property-media', this.element).val(value);
                    }
                },
                '.motopress-property-button-default click': function (el) {
                    this.element.attr('data-motopress-open-media-lib', 1);
                    CE.WPMedia.myThis.frame.open(this);
                }
            });
            CE.Ctrl('CE.CtrlImageGeneral', { listensTo: ['dialogOpen'] }, {
                autoOpen: false,
                init: function (el, args) {
                    this._super(el, args);
                    if (args.isNew && args.autoOpen === 'true')
                        this.autoOpen = true;
                }
            });
            CE.CtrlImageGeneral('CE.CtrlImage', { thumbnail: parent.MP.Settings.pluginDirUrl + 'images/ce/imageThumbnail.png' + parent.motopress.pluginVersionParam }, {
                returnMode: 'id',
                pseudoRender: false,
                value: null,
                init: function (el, args) {
                    this._super(el, args);
                    this.pseudoRender = args.pseudoRender;
                    if (args.hasOwnProperty('returnMode')) {
                        this.returnMode = args.returnMode;
                    }
                },
                ' dialogOpen': function (el) {
                    if (this.autoOpen) {
                        el.find('.motopress-thumbnail-crop').trigger('click');
                        this.autoOpen = false;
                    }
                },
                get: function () {
                    return this.value !== null ? this.value : '';
                },
                set: function (value, defaultValue, isNew) {
                    if ($.isPlainObject(value) && value.hasOwnProperty('id') && value.hasOwnProperty('src') && value.hasOwnProperty('full')) {
                        this.value = this.returnMode === 'id' ? value.id : value.full;
                        this.setThumbnail(value.src, defaultValue, isNew);
                        if (this.pseudoRender) {
                            this.setFullSrc(value.full);
                            this.shortcode.css('background-image', 'url(\'' + value.full + '\')');
                        }
                    } else {
                        if (this.value === null) {
                            if (this.returnMode === 'id' && $.isNumeric(value)) {
                                this.showPreloader();
                                this.value = value;
                                var ctrl = this;
                                $.ajax({
                                    url: parent.motopress.ajaxUrl,
                                    type: 'POST',
                                    dataType: 'text',
                                    data: {
                                        action: 'motopress_ce_get_attachment_thumbnail',
                                        nonce: parent.motopressCE.nonces.motopress_ce_get_attachment_thumbnail,
                                        postID: parent.motopressCE.postID,
                                        id: ctrl.value
                                    },
                                    success: function (data) {
                                        data = $.parseJSON(data);
                                        ctrl.setThumbnail(data.medium, defaultValue, isNew);
                                        ctrl.setFullSrc(data.full);
                                        ctrl.hidePreloader();
                                    },
                                    error: function (jqXHR) {
                                        var error = $.parseJSON(jqXHR.responseText);
                                        if (error.debug) {
                                            console.log(error.message);
                                        } else {
                                            parent.MP.Flash.setFlash(error.message, 'error');
                                            parent.MP.Flash.showMessage();
                                        }
                                        ctrl.setThumbnail(CE.CtrlImage.thumbnail, defaultValue, isNew);
                                        ctrl.hidePreloader();
                                    }
                                });
                            }
                        }
                        if (this.returnMode === 'src' && typeof value === 'string') {
                            if (value === '') {
                                this.removeValue();
                            } else {
                                this.value = value;
                                this.setThumbnail(this.value, defaultValue, isNew);
                                this.setFullSrc(this.value);
                                this.showTools();
                            }
                        }
                    }
                },
                setThumbnail: function (value, defaultValue, isNew) {
                    var val = CE.Ctrl.processValue(value, defaultValue, isNew);
                    this.element.find('.motopress-thumbnail').attr('src', val);
                },
                setFullSrc: function (value) {
                    this.element.find('.motopress-thumbnail').attr('data-full-src', value);
                },
                '.motopress-thumbnail-crop click': function (el, e) {
                    if (!el.hasClass(CE.Shortcode.preloaderClass)) {
                        this.element.attr('data-motopress-open-img-lib', 1);
                        CE.ImageLibrary.myThis.frame.open();
                    }
                },
                '.motopress-icon-trash click': function () {
                    this.removeValue();
                    this.element.trigger('change');
                },
                removeValue: function () {
                    this.value = null;
                    this.element.find('.motopress-thumbnail').attr('src', CE.CtrlImage.thumbnail);
                    this.hideTools();
                    if (this.pseudoRender) {
                        this.shortcode.css('background-image', '');
                        this.element.find('.motopress-thumbnail').removeAttr('data-full-src');
                    }
                },
                showTools: function () {
                    this.element.children('.motopress-image-tools').show();
                },
                hideTools: function () {
                    this.element.children('.motopress-image-tools').hide();
                },
                showPreloader: function () {
                    this.element.children('.motopress-thumbnail-crop').addClass(CE.Shortcode.preloaderClass).children('.motopress-thumbnail').css('visibility', 'hidden');
                    this.hideTools();
                },
                hidePreloader: function () {
                    var thumbnailCrop = this.element.children('.motopress-thumbnail-crop');
                    var thumbnail = thumbnailCrop.children('.motopress-thumbnail');
                    thumbnailCrop.removeClass(CE.Shortcode.preloaderClass);
                    thumbnail.css('visibility', 'visible');
                    if (thumbnail.attr('src') !== CE.CtrlImage.thumbnail) {
                        this.showTools();
                    }
                }
            });
            CE.CtrlImageGeneral('CE.CtrlImageSlider', {}, {
                ids: null,
                init: function (el, args) {
                    this._super(el, args);
                },
                ' dialogOpen': function (el) {
                    if (this.autoOpen) {
                        el.trigger('click');
                        this.autoOpen = false;
                    }
                },
                get: function () {
                    return this.ids !== null ? this.ids : '';
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    var valueType = typeof value;
                    if (valueType === 'object') {
                        var idsStr = '';
                        var idsLen = value.length;
                        for (var i = 0; i < idsLen; i++) {
                            if (i < idsLen - 1)
                                idsStr += value[i] + ',';
                            else
                                idsStr += value[i];
                        }
                        this.ids = idsStr;
                    } else if (valueType === 'number' || valueType === 'string') {
                        this.ids = $.trim(value);
                    }    
                },
                getArray: function () {
                    var idsArr = [];
                    if (this.ids) {
                        idsArr = this.ids.split(',');
                        var id;
                        for (var i = 0; i < idsArr.length; i++) {
                            id = parseInt(idsArr[i], 10);
                            if (id)
                                idsArr[i] = id;
                            else
                                delete idsArr[i];
                        }
                    }
                    return idsArr;
                },
                'click': function (el) {
                    if (!el.hasClass(CE.Shortcode.preloaderClass)) {
                        CE.WPGallery.myThis.open(this);
                    }
                }
            });
            CE.Ctrl('CE.CtrlVideo', {}, {
                init: function (el, args) {
                    this._super(el, args);
                    this.element.on('paste', function () {
                        var t = setTimeout(function () {
                            el.blur();
                            clearTimeout(t);
                        }, 0);
                    });
                },
                get: function () {
                    return this.element.val();
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    this.element.val(value);
                }
            });
            CE.Ctrl('CE.CtrlCheckbox', {}, {
                get: function () {
                    return this.element.is(':checked').toString();
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    value === 'true' ? this.element.attr('checked', 'checked') : this.element.removeAttr('checked');
                }
            });
            CE.CtrlCheckbox('CE.CtrlGroupCheckbox', {}, {
                'change': function (el, e) {
                    if (el.is(':checked')) {
                        el.closest('.motopress-property-group-accordion-item').siblings().find('.motopress-property-group-accordion-item-content > [data-motopress-parameter="' + this.name + '"] > .motopress-controls').each(function () {
                            var ctrl = $(this).control();
                            if (ctrl.get() === 'true') {
                                ctrl.set('false');
                                CE.Ctrl.prototype.change.apply(ctrl, [
                                    $(this),
                                    e
                                ]);
                            }
                        });
                    }
                    CE.Ctrl.prototype.change.apply(this, [
                        el,
                        e
                    ]);
                }
            });
            CE.Ctrl('CE.CtrlSelect', {
                listensTo: ['customize'],
                init: function () {
                    CE.Ctrl.bodyEl.on('click', '.motopress-property-select:not(.open) > .dropdown-toggle', function () {
                        var menu = $(this).next();
                        var lastIndex = menu.find('ul > li').length;
                        lastIndex = lastIndex >= 6 ? 5 : lastIndex - 1;
                        menu.find('li:eq(' + lastIndex + ') > a').focus();
                        menu.find('ul > li > a.motopress-dropdown-selected').focus();
                    });
                },
                setSelected: function (el) {
                    var options = el.find('option');
                    var selectedIndex = options.index(options.filter(':selected'));
                    var customOptions = el.next().find('.dropdown-menu > ul > li');
                    customOptions.children('a.motopress-dropdown-selected').removeClass('motopress-dropdown-selected');
                    customOptions.filter('[rel="' + selectedIndex + '"]').children('a').addClass('motopress-dropdown-selected');
                }
            }, {
                get: function () {
                    return this.element.val();
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    this.element.find('[value="' + value + '"]').attr('selected', 'selected');
                },
                'change': function (el, e) {
                    this._super(el, e);
                    CE.CtrlSelect.setSelected(el);
                },
                refresh: function () {
                    this.element.selectpicker('refresh');
                    this.clearSelectpicker();
                    CE.CtrlSelect.setSelected(this.element);
                },
                clearSelectpicker: function () {
                    var customSelect = this.element.next();
                    customSelect.removeClass('ce_ctrl_select motopress-controls');
                    var dropdownToogle = customSelect.children('.dropdown-toggle');
                    dropdownToogle.html(dropdownToogle.html().replace(/&nbsp;/g, ''));
                },
                ' customize': function (el) {
                    if (typeof el.data('selectpicker') !== 'undefined') {
                        el.next().remove();
                        $.removeData(el[0], 'selectpicker');
                    }
                    el.selectpicker({ size: 6 });
                    this.clearSelectpicker();
                    CE.CtrlSelect.setSelected(el);
                },
                updateOptions: function (list, selected) {
                    var options = CE.CtrlTemplates.generateOptions(list, selected);
                    this.element.html(options);
                    this.refresh();
                }
            });
            CE.Ctrl('CE.CtrlSelectMultiple', { listensTo: ['customize'] }, {
                init: function (el, args) {
                    this._super(el, args);
                },
                get: function () {
                    var data = this.element.select2('data');
                    var result = '';
                    data.forEach(function (el, index) {
                        result += result !== '' ? ',' + el.id : el.id;
                    });
                    return result;
                },
                set: function (value, defaultValue, isNew) {
                    var self = this;
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    var values = value.split(',');
                    this.element.find('option').removeAttr('selected');
                    $.each(values, function (index, value) {
                        self.element.find('option[value="' + value + '"]').attr('selected', 'selected');
                    });
                },
                ' customize': function (el, args) {
                    el.select2({
                        separator: ',',
                        closeOnSelect: false,
                        'containerCssClass': 'motopress-select2',
                        'dropdownCssClass': 'motopress-select2-dropdown motopress-multiple-select-control-dropdown',
                        'adaptContainerCssClass': function (clazz) {
                            if (clazz !== 'motopress-controls')
                                return clazz;
                        }
                    });
                }
            });
            CE.Ctrl('CE.CtrlSelect2', { listensTo: ['customize'] }, {
                isPreview: false,
                previewClass: null,
                unsetClasses: [],
                data: null,
                select2DropdownClass: 'motopress-property-select2-custom-class',
                uniqueDropdownClass: null,
                init: function (el, args) {
                    this._super(el, args);
                    this.options.style = CE.LeftBar.myThis.library[this.options.formCtrl.shortcodeGroup].objects[this.options.formCtrl.shortcodeName].styles['mp_style_classes'];
                    this.uniqueDropdownClass = parent.MP.Utils.uniqid('motopress-select2-dropdown-');
                },
                get: function () {
                    var self = this;
                    var data = this.element.select2('data');
                    var result = '';
                    if (this.isPreview) {
                        data = data.filter(function (el) {
                            return $.inArray(el.id, self.unsetClasses) === -1;
                        });
                    }
                    data.forEach(function (el, index) {
                        if (!el.hasOwnProperty('locked') && el.locked !== true) {
                            result += result !== '' ? ' ' + el.id : el.id;
                        }
                    });
                    if (this.isPreview) {
                        result += result !== '' ? ' ' + this.previewClass : this.previewClass;
                    }
                    return result;
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    if (!$.isEmptyObject(this.options.style.basic)) {
                        var basicClasses = this.getBasicClassesString();
                        value = value ? basicClasses + ' ' + value : basicClasses;
                    }
                    this.options.value = value;
                    this.element.val(value);
                },
                ' customize': function (el, args) {
                    if (this.customized) {
                        return false;
                    } else {
                        this.customized = true;
                    }
                    var self = this;
                    this.data = this.getClassesList();
                    el.select2({
                        'multiple': true,
                        separator: ' ',
                        closeOnSelect: false,
                        createSearchChoice: function (term, data) {
                            var allowedSymbolsRegExp = /^[-_A-Za-z0-9]+$/;
                            if (allowedSymbolsRegExp.test(term)) {
                                if ($(data).filter(function () {
                                        return !this.hasOwnProperty('id') ? $(this.children).filter(function () {
                                            return this.text.toUpperCase().localeCompare(term.toUpperCase()) === 0 || this.id.toUpperCase().localeCompare(term.toUpperCase()) === 0;
                                        }).length !== 0 : this.text.toUpperCase().localeCompare(term.toUpperCase()) === 0 || this.id.toUpperCase().localeCompare(term.toUpperCase()) === 0;
                                    }).length === 0) {
                                    return {
                                        id: term.toLowerCase(),
                                        text: term,
                                        custom: true
                                    };
                                }
                            }
                        },
                        initSelection: function (element, callback) {
                            callback(self.valueToData(self.options.value.split(' ')));
                        },
                        'query': function (query) {
                            self.options.value = self.element.val();
                            var data = {};
                            var result;
                            data.results = [];
                            $.each(self.data, function (key, val) {
                                if (val.hasOwnProperty('children')) {
                                    result = {
                                        text: val.text,
                                        children: []
                                    };
                                    result.children = $.makeArray(val.children.filter(function (el) {
                                        return (el.id.toUpperCase().indexOf(query.term.toUpperCase()) >= 0 || el.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0) && $.inArray(el.id, self.options.value.split(' ') === -1);
                                    }));
                                    if (result.children.length) {
                                        data.results.push(result);
                                    }
                                } else {
                                    if ((val.id.toUpperCase().indexOf(query.term.toUpperCase()) >= 0 || val.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0) && $.inArray(val.id, self.options.value.split(' ')) === -1) {
                                        data.results.push(val);
                                    }
                                }
                            });
                            query.callback(data);
                        },
                        'formatNoMatches': function () {
                            return localStorage.getItem('CEStyleClassesFormatNoMatches');
                        },
                        'formatResult': function (state, container) {
                            if (state.hasOwnProperty('children')) {
                                return state.text;
                            } else {
                                if (state.hasOwnProperty('disabled') && state.disabled) {
                                    container.attr('title', localStorage.getItem('CELiteTooltipText'));
                                }
                                var dataExternal = state.hasOwnProperty('external') && typeof state.external !== 'undefined' ? ' data-external="' + state.external + '"' : '';
                                return '<i class="select2-preview-icon"' + dataExternal + ' data-value="' + state.id + '"></i>' + state.text;
                            }
                        },
                        'containerCssClass': 'motopress-select2',
                        'dropdownCssClass': 'motopress-select2-dropdown select2-control-dropdown ' + self.select2DropdownClass + ' ' + self.uniqueDropdownClass
                    });
                    el.on('select2-highlight', function (e) {
                        self.unsetClasses = self.getUnsetClasses(e.val);
                    });
                    $('.' + self.uniqueDropdownClass).on('mouseover', '.select2-preview-icon', function () {
                        var external = $(this).attr('data-external');
                        if (typeof external !== 'undefined' && $('[href="' + external + '"]').length === 0) {
                            var cssLink = $('<link />', {
                                'rel': 'stylesheet',
                                'type': 'text/css',
                                'href': external
                            });
                            $('head').append(cssLink);
                        }
                        var val = $(this).attr('data-value');
                        self.unsetClasses = self.getUnsetClasses(val);
                        self.isPreview = true;
                        self.setPreviewClass(val);
                        CE.Ctrl.bodyEl.trigger('MPCEObjectStylePreviewOver', {
                            'objElement': self.shortcode,
                            'objName': self.shortcodeName
                        });
                    });
                    $('.' + self.uniqueDropdownClass).on('mouseleave', '.select2-preview-icon', function () {
                        self.isPreview = false;
                        self.unsetClasses = [];
                        self.setPreviewClass();
                        CE.Ctrl.bodyEl.trigger('MPCEObjectStylePreviewOut', {
                            'objElement': self.shortcode,
                            'objName': self.shortcodeName
                        });
                    });
                    el.on('select2-blur', function (e) {
                        self.isPreview = false;
                        self.unsetClasses = [];
                        self.setPreviewClass();
                    });
                    el.on('select2-close', function (e) {
                        self.isPreview = false;
                        self.unsetClasses = [];
                        self.setPreviewClass();
                    });
                    el.on('select2-selecting', function (e) {
                        self.isPreview = false;
                        if (e.object.hasOwnProperty('external') && $('[href="' + e.object.external + '"]').length === 0) {
                            var cssLink = $('<link />', {
                                'rel': 'stylesheet',
                                'type': 'text/css',
                                'href': e.object.external
                            });
                            $('head').append(cssLink);
                        }
                        var oldValue = $(self.element).select2('val');
                        var value = self.excludeGroupValues(oldValue);
                        if (e.object.hasOwnProperty('custom') && e.object.custom === true) {
                            self.data.push({
                                'id': e.object.id,
                                'text': e.object.text,
                                'custom': e.object.custom
                            });
                        }
                        self.element.select2('data', self.valueToData(value));
                    });
                    el.on('select2-loaded', function (e, items) {
                        $('.' + self.uniqueDropdownClass + '>.select2-results>li.select2-result.select2-selected').each(function () {
                            var $this = $(this);
                            if ($this.find('.select2-disabled:not(.select2-selected)').length) {
                                $this.removeClass('select2-selected');
                            }
                        });
                    });
                },
                'valueToData': function (value) {
                    var self = this;
                    var data = [];
                    $.each(value, function (index, val) {
                        $.each(self.data, function (el) {
                            if (self.data[el].hasOwnProperty('children')) {
                                $.each(self.data[el].children, function (el2) {
                                    if (self.data[el].children[el2].id === val) {
                                        data.push(self.data[el].children[el2]);
                                    }
                                });
                            } else {
                                if (self.data[el].id === val) {
                                    data.push(self.data[el]);
                                }
                            }
                        });
                    });
                    return data;
                },
                'excludeGroupValues': function (value) {
                    var self = this;
                    value = value.filter(function (el) {
                        return $.inArray(el, self.unsetClasses) === -1;
                    });
                    return value;
                },
                'setPreviewClass': function (cls) {
                    this.previewClass = cls;
                    this.options.formCtrl.changeProperty(this);
                },
                'getUnsetClasses': function (clsName) {
                    var unsetClasses = [];
                    $.each(this.data, function (key, value) {
                        var flag = false;
                        if (value.hasOwnProperty('children') && (value.allowMultiple === undefined || value.allowMultiple === false)) {
                            $.each(value.children, function (key, value) {
                                if (value.id === clsName) {
                                    flag = true;
                                } else {
                                    unsetClasses.push(value.id);
                                }
                            });
                            if (flag) {
                                return false;
                            } else {
                                unsetClasses = [];
                            }
                        }
                    });
                    return unsetClasses;
                },
                'getClassesList': function () {
                    var predefinedClasses = this.getPredefinedClasses();
                    var selectedClasses = this.options.value !== '' ? this.options.value.split(' ') : [];
                    var globalPredefinedClasses = this.getGlobalPredefinedClasses();
                    var basicClasses = this.getBasicClasses();
                    var classes = basicClasses.concat(globalPredefinedClasses, predefinedClasses);
                    selectedClasses.forEach(function (el, index) {
                        if ($(classes).filter(function () {
                                var res = false;
                                if (this.hasOwnProperty('children')) {
                                    res = $(this.children).filter(function () {
                                        return this.hasOwnProperty('id') ? this.id.localeCompare(el) === 0 : false;
                                    }).length !== 0;
                                } else {
                                    res = this.hasOwnProperty('id') ? this.id.localeCompare(el) === 0 : false;
                                }
                                return res;
                            }).length === 0) {
                            classes.push({
                                id: el,
                                text: el
                            });
                        }
                    });
                    return classes;
                },
                'getBasicClasses': function () {
                    var basicClasses = [];
                    if (!$.isEmptyObject(this.options.style.basic)) {
                        if (this.options.style.basic.hasOwnProperty('class')) {
                            basicClasses.push({
                                id: this.options.style.basic['class'],
                                text: this.options.style.basic.label,
                                locked: true
                            });
                        } else {
                            $.each(this.options.style.basic, function (key, value) {
                                basicClasses.push({
                                    id: value['class'],
                                    text: value.label,
                                    locked: true
                                });
                            });
                        }
                    }
                    return basicClasses;
                },
                'getBasicClassesString': function () {
                    var basicClasses = this.getBasicClasses();
                    var result = [];
                    $.each(basicClasses, function (key, val) {
                        result.push(val.id);
                    });
                    return result.join(' ');
                },
                'getPredefinedClasses': function () {
                    var result = [];
                    if (!$.isEmptyObject(this.options.style.predefined)) {
                        var data = this.options.style.predefined;
                        for (var group in data) {
                            if (data[group].hasOwnProperty('values')) {
                                var children = [];
                                for (var el in data[group]['values']) {
                                    children.push({
                                        id: data[group]['values'][el]['class'],
                                        text: data[group]['values'][el].label,
                                        'disabled': data[group]['values'][el].hasOwnProperty('disabled') && data[group]['values'][el]['disabled'],
                                        'external': data[group]['values'][el]['external']
                                    });
                                }
                                result.push({
                                    text: data[group].label,
                                    children: children,
                                    allowMultiple: data[group].allowMultiple
                                });
                            } else {
                                result.push({
                                    id: data[group]['class'],
                                    text: data[group]['label'],
                                    'disabled': data[group].hasOwnProperty('disabled') && data[group]['disabled'],
                                    'external': data[group]['external']
                                });
                            }
                        }
                    }
                    return result;
                },
                getGlobalPredefinedClasses: function () {
                    var result = [];
                    $.each(CE.Style.globalPredefinedClasses, function (key, value) {
                        if (value.hasOwnProperty('values')) {
                            var children = [];
                            $.each(value.values, function (k, val) {
                                children.push({
                                    id: val['class'],
                                    text: val.label,
                                    'disabled': val.hasOwnProperty('disabled') && val['disabled']
                                });
                            });
                            result.push({
                                text: value.label,
                                children: children,
                                allowMultiple: value.allowMultiple
                            });
                        } else {
                            result.push({
                                id: value['class'],
                                text: value.label,
                                'disabled': value.hasOwnProperty('disabled') && value['disabled']
                            });
                        }
                    });
                    return result;
                }
            });
            CE.Ctrl('CE.CtrlStyleEditor', { listensTo: ['customize'] }, {
                privateStyleObj: null,
                previewState: null,
                select2DropdownClass: 'motopress-property-select2-style-editor',
                isPreview: false,
                previewClass: null,
                unsetClasses: [],
                uniqueDropdownClass: null,
                init: function (el, args) {
                    this._super(el, args);
                    this.uniqueDropdownClass = parent.MP.Utils.uniqid('motopress-select2-dropdown-');
                },
                get: function () {
                    var self = this;
                    var data = this.element.select2('data');
                    var result = '';
                    if (!this.privateStyleObj.isEmpty()) {
                        result += this.privateStyleObj.getClassName();
                    }
                    if (this.isPreview) {
                        data = data.filter(function (el) {
                            return $.inArray(el.id, self.unsetClasses) === -1;
                        });
                    }
                    data.forEach(function (el, index) {
                        if (!el.hasOwnProperty('locked') && el.locked !== true) {
                            if (CE.StyleEditor.myThis.isExistsPreset(el.id)) {
                                result += result !== '' ? ' ' + el.id : el.id;
                            }
                        }
                    });
                    if (this.isPreview) {
                        result += result !== '' ? ' ' + this.previewClass : this.previewClass;
                    }
                    return result;
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    var newValue = '';
                    if (!this.privateStyleObj) {
                        this.privateStyleObj = CE.StyleEditor.myThis.getPrivateStyleInstance(value);
                    }
                    newValue += this.privateStyleObj.getClassName();
                    var presetClass = CE.StyleEditor.myThis.retrievePresetClass(value);
                    if (!CE.StyleEditor.myThis.isExistsPreset(presetClass)) {
                        presetClass = '';
                    } else {
                        newValue += ' ' + presetClass;
                    }
                    this.element.val(newValue);
                },
                selectPreset: function (preset) {
                    var presetObj = CE.StyleEditor.myThis.getPresetStyleInstance(preset);
                    this.element.select2('data', [
                        this.getPrivateBtn(),
                        {
                            id: presetObj.getClassName(),
                            text: presetObj.getLabel()
                        }
                    ]);
                    this.privateStyleFormCtrl.setPresetStyleObj(presetObj);
                },
                ' customize': function () {
                    if (this.customized) {
                        return false;
                    } else {
                        this.customized = true;
                    }
                    this.privateStyleForm = $('<div />', { 'class': 'motopress-style-editor-forms motopress-style-editor-private-forms' });
                    this.presetStyleForm = $('<div />', { 'class': 'motopress-style-editor-forms motopress-style-editor-preset-forms' });
                    this.privateStyleFormCtrl = new CE.PrivateStyleControlsForm(this.privateStyleForm, {
                        'formsMainCtrl': this.formCtrl.formsMainCtrl,
                        'styleEditorCtrl': this,
                        'editedStyleObj': this.privateStyleObj
                    });
                    this.presetStyleFormCtrl = new CE.PresetStyleControlsForm(this.presetStyleForm, {
                        'formsMainCtrl': this.formCtrl.formsMainCtrl,
                        'styleEditorCtrl': this
                    });
                    this.customizeSelect();
                },
                refresh: function () {
                    var data = this.element.select2('data');
                    $(data).filter(function (index, details) {
                        var isPrivateStyle = details.hasOwnProperty('locked') && details.locked;
                        if (isPrivateStyle) {
                            return true;
                        } else if (CE.StyleEditor.myThis.isExistsPreset(details.id)) {
                            var presetObj = CE.StyleEditor.myThis.getPresetStyleInstance(details.id);
                            details.text = presetObj.getLabel();
                            return true;
                        }
                        return false;
                    });
                    this.element.select2('data', data);
                    this.element.trigger('change');
                },
                setPreviewClass: function (cls) {
                    this.previewClass = cls;
                    this.formCtrl.changeProperty(this);
                },
                getPrivateBtn: function () {
                    return {
                        id: this.privateStyleObj.getClassName(),
                        text: 'Edit Element Style',
                        locked: true
                    };
                },
                customizeSelect: function () {
                    var self = this;
                    self.data = CE.StyleEditor.myThis.getPresetsList(true);
                    this.element.select2({
                        'multiple': true,
                        separator: ' ',
                        closeOnSelect: true,
                        initSelection: function (element, callback) {
                            callback(self.valueToData(self.element.val().split(' ')));
                        },
                        'query': function (query) {
                            var data = { results: [] };
                            $.each(CE.StyleEditor.myThis.getPresetsListSelect2(), function (key, val) {
                                if (val.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0) {
                                    data.results.push(val);
                                }
                            });
                            query.callback(data);
                        },
                        'formatNoMatches': function () {
                            return localStorage.getItem('CEStylePresetsFormatNoMatches');
                        },
                        'formatResult': function (state, container) {
                            return '<i class="select2-preview-icon" data-value="' + state.id + '"></i>' + state.text;
                        },
                        'containerCssClass': 'motopress-select2',
                        'dropdownCssClass': 'motopress-select2-dropdown select2-control-dropdown ' + self.select2DropdownClass + ' ' + this.uniqueDropdownClass
                    });
                    this.element.select2('container').on('click', '.select2-search-choice', function (e) {
                        var data = $(this).data('select2Data');
                        if (data.hasOwnProperty('locked') && data.locked) {
                            self.privateStyleFormCtrl.setPresetStyleObj(self.getSelectedPresetInstance());
                            self.privateStyleFormCtrl.display(true);
                        } else {
                            var presetStyleObj = self.getSelectedPresetInstance();
                            if (presetStyleObj !== null) {
                                self.presetStyleFormCtrl.setEditedStyleObj(presetStyleObj);
                                self.presetStyleFormCtrl.display(true);
                            }
                        }
                    });
                    this.element.on('select2-highlight', function (e) {
                        self.unsetClasses = self.getUnsetClasses(e.val);
                    });
                    $('.' + self.uniqueDropdownClass).on('mouseover', '.select2-preview-icon', function () {
                        var val = $(this).attr('data-value');
                        self.setPreview(val);
                        CE.Ctrl.bodyEl.trigger('MPCEObjectStylePreviewOver', {
                            'objElement': self.shortcode,
                            'objName': self.shortcodeName
                        });
                    });
                    $('.' + self.uniqueDropdownClass).on('mouseleave', '.select2-preview-icon', function () {
                        self.isPreview = false;
                        self.unsetClasses = [];
                        self.setPreviewClass();
                        CE.Ctrl.bodyEl.trigger('MPCEObjectStylePreviewOut', {
                            'objElement': self.shortcode,
                            'objName': self.shortcodeName
                        });
                    });
                    this.element.on('select2-blur select2-close', function (e) {
                        self.isPreview = false;
                        self.unsetClasses = [];
                        self.setPreviewClass();
                    });
                    this.element.on('select2-selecting', function (e) {
                        self.isPreview = false;
                        var oldValue = self.element.select2('val');
                        var value = self.excludeValues(oldValue);
                        self.element.select2('data', self.valueToData(value));
                    });
                },
                setPreview: function (clsName) {
                    this.unsetClasses = this.getUnsetClasses(clsName);
                    this.isPreview = true;
                    this.setPreviewClass(clsName);
                },
                unsetPreview: function () {
                    this.isPreview = false;
                    this.unsetClasses = [];
                    this.setPreviewClass();
                },
                'valueToData': function (value) {
                    var self = this;
                    var data = [];
                    $.each(value, function (index, val) {
                        if (CE.StyleEditor.myThis.isExistsPreset(val)) {
                            var presetCtrl = CE.StyleEditor.myThis.getPresetStyleInstance(val);
                            data.push({
                                id: presetCtrl.getClassName(),
                                text: presetCtrl.getLabel()
                            });
                        } else if (CE.StyleEditor.myThis.retrievePrivateClass(val)) {
                            data.push(self.getPrivateBtn());
                        }
                    });
                    return data;
                },
                getUnsetClasses: function (clsName) {
                    var presets = CE.StyleEditor.myThis.getPresetsList();
                    delete presets[clsName];
                    return $.map(presets, function (element, index) {
                        return index;
                    });
                },
                excludeValues: function (value) {
                    var self = this;
                    value = value.filter(function (el) {
                        return $.inArray(el, self.unsetClasses) === -1;
                    });
                    return value;
                },
                getSelectedPreset: function () {
                    var value = this.get();
                    return CE.StyleEditor.myThis.retrievePresetClass(value);
                },
                getSelectedPresetInstance: function () {
                    var presetClass = this.getSelectedPreset();
                    return CE.StyleEditor.myThis.getPresetStyleInstance(presetClass);
                },
                setStatePreview: function (state) {
                    this.unsetStatePreview();
                    var previewStates = [];
                    switch (state) {
                    case 'up':
                        previewStates.push('up');
                        break;
                    case 'hover':
                        previewStates.push('up');
                        previewStates.push('hover');
                        break;
                    case 'tablet':
                        previewStates.push('up');
                        previewStates.push('tablet');
                        break;
                    case 'mobile':
                        previewStates.push('up');
                        previewStates.push('tablet');
                        previewStates.push('mobile');
                        break;
                    }
                    var previewStateClasses = previewStates.map(function (val) {
                        return CE.ShortcodeStyle.previewStateClassPrefix + val;
                    }).join(' ');
                    var targetElement = this.formCtrl.getTargetElement(this);
                    if (targetElement !== null) {
                        targetElement.addClass(previewStateClasses);
                    }
                },
                unsetStatePreview: function () {
                    var allPreviewStateClasses = [
                        'up',
                        'hover',
                        'mobile',
                        'tablet'
                    ].map(function (val) {
                        return CE.ShortcodeStyle.previewStateClassPrefix + val;
                    }).join(' ');
                    var targetElement = this.formCtrl.getTargetElement(this);
                    if (targetElement !== null) {
                        targetElement.removeClass(allPreviewStateClasses);
                    }
                }
            });
            CE.Ctrl('CE.CtrlComplex', { listensTo: ['customize'] }, {
                innerForm: null,
                innerFormCtrl: null,
                parameters: {},
                init: function (el, args) {
                    this._super(el, args);
                    this.innerForm = this.element.children('.motopress-property-inner-form');
                    this.innerFormCtrl = new CE.ControlsSubForm(this.innerForm, {
                        'formsMainCtrl': this.formCtrl.formsMainCtrl,
                        'parentPropertyCtrl': this
                    });
                    this.innerFormCtrl.display(true);
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    this.innerFormCtrl.set(this.convertValueToFormData(value));
                },
                get: function () {
                    var formData = this.innerFormCtrl.get();
                    return this.convertFormDataToValue(formData);
                },
                convertValueToFormData: function () {
                    return {};
                },
                convertFormDataToValue: function () {
                    return '';
                },
                getParameters: function () {
                    return this.parameters;
                }
            });
            CE.CtrlComplex('CE.CtrlGradient', {
                valueSeparator: ' , ',
                parseGradientStr: function (str) {
                    var gradientParameters = false;
                    if (str !== '') {
                        var valuesArr = str.split(CE.CtrlGradient.valueSeparator);
                        if (valuesArr.length === 3) {
                            gradientParameters = {
                                'angle': String(parseInt(valuesArr[0])),
                                'initial-color': valuesArr[1],
                                'final-color': valuesArr[2]
                            };
                        }
                    }
                    return gradientParameters;
                }
            }, {
                parameters: {
                    'angle': {
                        'type': 'spinner',
                        'label': 'Gradient Angle',
                        'min': 0,
                        'max': 360,
                        'step': 1,
                        'default': '0'
                    },
                    'final-color': {
                        'type': 'color-picker',
                        'label': 'Gradient Initial Color',
                        'default': ''
                    },
                    'initial-color': {
                        'type': 'color-picker',
                        'label': 'Gradient Final Color',
                        'default': ''
                    }
                },
                convertValueToFormData: function (value) {
                    var formData = CE.CtrlGradient.parseGradientStr(value);
                    if (!formData) {
                        formData = {
                            'angle': this.parameters['angle']['default'],
                            'initial-color': this.parameters['initial-color']['default'],
                            'final-color': this.parameters['final-color']['default']
                        };
                    }
                    return formData;
                },
                convertFormDataToValue: function (formData) {
                    if (formData.hasOwnProperty('angle') && !isNaN(parseInt(formData.angle))) {
                        formData['angle'] = String(parseInt(formData.angle));
                    } else {
                        formData['angle'] = '0';
                    }
                    if (!formData.hasOwnProperty('initial-color') || formData['initial-color'] === '') {
                        formData['initial-color'] = '';
                    }
                    if (!formData.hasOwnProperty('final-color') || formData['final-color'] === '') {
                        formData['final-color'] = '';
                    }
                    var value = formData['angle'] + CE.CtrlGradient.valueSeparator + formData['initial-color'] + CE.CtrlGradient.valueSeparator + formData['final-color'];
                    return value;
                }
            });
            CE.Ctrl('CE.CtrlEditorButton', {}, {
                dragHandle: null,
                init: function (el, args) {
                    this._super(el, args);
                    this.dragHandle = args.shortcode.closest('.motopress-clmn').find('.motopress-helper').first().children('.motopress-drag-handle');
                },
                'click': function () {
                    this.dragHandle.click();
                }
            });
            CE.Ctrl('CE.CtrlColorPicker', {
                listensTo: [
                    'customize',
                    'dialogOpen'
                ],
                'paletteAddBtn': $('<span />', { 'class': 'palette-add' })
            }, {
                lastTimerId: null,
                input: null,
                init: function (el, args) {
                    this._super(el, args);
                    this.input = el.children('.motopress-property-input');
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    if (this.input.data('spectrum.id') !== undefined) {
                        this.input.spectrum('set', value);
                    } else {
                        this.input.val(value);
                    }
                },
                get: function () {
                    return this.input.val();
                },
                'paletteAdd': function () {
                    var curColor = this.get();
                    if (curColor !== '') {
                        var newPalettes = parent.MP.Settings.palettes;
                        newPalettes.pop();
                        newPalettes.unshift(curColor);
                        $.ajax({
                            url: parent.motopress.ajaxUrl,
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                action: 'motopress_ce_colorpicker_update_palettes',
                                nonce: parent.motopressCE.nonces.motopress_ce_colorpicker_update_palettes,
                                postID: parent.motopressCE.postID,
                                palettes: newPalettes
                            },
                            success: function (data) {
                                parent.MP.Settings.palettes = data.data.palettes;
                                $('.motopress-property-color-picker>.motopress-property-input').each(function () {
                                    $(this).spectrum('option', 'palette', parent.MP.Settings.palettes);
                                });
                            },
                            error: function (jqXHR) {
                                var error = $.parseJSON(jqXHR.responseText);
                                if (error.debug) {
                                    console.log(error.message);
                                } else {
                                    parent.MP.Flash.setFlash(error.message, 'error');
                                    parent.MP.Flash.showMessage();
                                }
                            }
                        });
                    }
                },
                'move.spectrum': function (el, e, color) {
                    var self = this;
                    if (color === null) {
                        color = '';
                    }
                    clearTimeout(this.lastTimerId);
                    this.lastTimerId = setTimeout(function () {
                        self.input.val(color);
                        self.element.trigger('change');
                    }, 500);
                },
                ' customize': function (el, e) {
                    if (this.customized)
                        return false;
                    else
                        this.customized = true;
                    this.input.spectrum({
                        allowEmpty: true,
                        showAlpha: true,
                        showInput: true,
                        showInitial: true,
                        showPalette: true,
                        showSelectionPalette: false,
                        showButtons: false,
                        appendTo: this.element,
                        palette: parent.MP.Settings.palettes,
                        preferredFormat: 'rgb',
                        containerClassName: 'motopress-property-colorpicker mpce-spectrum-theme',
                        replacerClassName: 'mpce-spectrum-theme'
                    });
                    this.replacer = this.element.find('.sp-replacer');
                    this.container = this.element.find('.sp-container');
                    this.initPaletteAddBtn();
                },
                initPaletteAddBtn: function () {
                    var self = this, paletteAddBtn = CE.CtrlColorPicker.paletteAddBtn.clone();
                    paletteAddBtn.on('click', function () {
                        self.paletteAdd();
                    });
                    this.container.prepend(paletteAddBtn);
                }
            });
            CE.Ctrl('CE.CtrlSlider', {}, {
                slider: null,
                span: null,
                init: function (el, args) {
                    var self = this;
                    this._super(el, args);
                    this.slider = el.children('.motopress-property-slider');
                    this.span = el.children('.motopress-property-slider-value');
                    this.slider.slider({
                        range: 'min',
                        min: parseInt(args.min),
                        max: parseInt(args.max),
                        step: parseInt(args.step),
                        value: parseInt(args.value),
                        slide: function (event, ui) {
                            self.span.html(ui.value);
                        },
                        change: function (event, ui) {
                            if (typeof event.handleObj !== 'undefined') {
                                el.trigger('change');
                            }
                        },
                        disabled: args.disabled == 'true'
                    });
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    this.span.text(value);
                    this.slider.slider('value', value);
                },
                get: function () {
                    return this.slider.slider('option', 'value');
                }
            });
            CE.Ctrl('CE.CtrlRadioButtons', {}, {
                init: function (el, args) {
                    this._super(el, args);
                    this.element.buttonset();
                },
                set: function (value, defaultValue, isNew) {
                    value = typeof value !== 'undefined' ? value : defaultValue;
                    this.element.find(':radio[value="' + value + '"]').attr('checked', true);
                    this.element.find(':radio[value="' + value + '"]').button('refresh');
                },
                get: function () {
                    return this.element.find(':radio:checked').val();
                }
            });
            CE.Ctrl('CE.CtrlGroup', { listensTo: ['render'] }, {
                currentSpan: null,
                group: null,
                label: null,
                accordion: null,
                button: null,
                oldItemIndex: null,
                childFormCtrls: null,
                init: function (el, args) {
                    this._super(el, args);
                    this.currentSpan = args.currentSpan;
                    this.shortcodeCtrl = args.shortcode.control();
                    this.label = args.label;
                    this.rules = args.rules;
                    this.events = args.events;
                    this.hasRules = !!(this.rules && this.rules.hasOwnProperty('rootSelector') && this.rules.rootSelector);
                    this.hasActiveRules = !!(this.hasRules && this.rules.hasOwnProperty('activeSelector') && this.rules.hasOwnProperty('activeClass') && this.rules.activeClass);
                    this.hasEvents = !!(this.events && (this.events.hasOwnProperty('onActive') || this.events.hasOwnProperty('onInactive')));
                    this.childFormCtrls = [];
                    this.accordion = el.children('.motopress-property-group-accordion');
                    this.button = el.find('> .motopress-property-button-wrapper > .motopress-property-button-default');
                },
                addChildFormCtrl: function (childFormCtrl) {
                    this.childFormCtrls.push(childFormCtrl);
                },
                reassignShortcodes: function () {
                    var shortcode;
                    var $this = this;
                    $.each(this.childFormCtrls, function (index, childFormCtrl) {
                        shortcode = $this.formCtrl.shortcode.find('[data-motopress-shortcode]:eq(' + index + ')');
                        childFormCtrl.setShortcode(shortcode);
                    });
                },
                ' render': function (el, e, isNew) {
                    this.updateLabel();
                    var $this = this;
                    var active = this.shortcode.attr('data-motopress-active-item');
                    active = isNew && typeof active !== 'undefined' ? parseInt(active) : false;
                    var accordionSettings = {
                        active: active,
                        header: '> div > h3',
                        heightStyle: 'content',
                        collapsible: true,
                        create: function (event, ui) {
                            var active = $this.accordion.accordion('option', 'active');
                            if (active !== false) {
                                $this.accordion.find('.motopress-property-group-accordion-item:eq(' + active + ') .motopress-controls').trigger('customize');
                            }
                        },
                        beforeActivate: function (event, ui) {
                            if (event.hasOwnProperty('originalEvent') && event.originalEvent.hasOwnProperty('target') && $(event.originalEvent.target).hasClass('motopress-property-group-accordion-item-remove')) {
                                event.preventDefault();    
                            }
                        },
                        activate: function (event, ui) {
                            var oldIndex = -1, newIndex = -1;
                            if (typeof ui.oldHeader[0] !== 'undefined') {
                                oldIndex = ui.oldHeader.parent('.motopress-property-group-accordion-item').index();
                            }
                            if (typeof ui.newHeader[0] !== 'undefined') {
                                newIndex = ui.newHeader.parent('.motopress-property-group-accordion-item').index();
                            }
                            var childName = $this.shortcodeCtrl.childName;
                            if (oldIndex >= 0) {
                                $this.interact('deactivate', oldIndex);
                                $this.shortcode.removeAttr('data-motopress-active-item');
                            }
                            if (newIndex >= 0) {
                                $this.interact('activate', newIndex);
                                $this.shortcode.attr('data-motopress-active-item', newIndex);
                                ui.newHeader.parent('.motopress-property-group-accordion-item').find('.motopress-controls').trigger('customize');
                            }
                            if (childName && $this.hasRules && $this.hasEvents) {
                                var children = $this.shortcode.find($this.rules.rootSelector);
                                if (children.length) {
                                    var activeChild, activeTagItem;
                                    if (oldIndex >= 0 && $this.events.hasOwnProperty('onInactive')) {
                                        if (children.eq(0).closest('[data-motopress-shortcode="' + childName + '"]').length) {
                                            activeChild = children.closest('[data-motopress-shortcode="' + childName + '"]').eq(oldIndex).find($this.rules.rootSelector);
                                        } else {
                                            activeChild = children.eq(oldIndex);
                                        }
                                        activeTagItem = $this.hasActiveRules && $this.rules.activeSelector ? activeChild.find($this.rules.activeSelector) : activeChild;
                                        if (activeChild.length && (!$this.hasActiveRules || $this.hasActiveRules && activeTagItem.hasClass($this.rules.activeClass))) {
                                            if ($this.events.onInactive.selector) {
                                                activeChild.find($this.events.onInactive.selector).triggerHandler($this.events.onInactive.event);
                                            } else {
                                                activeChild.triggerHandler($this.events.onInactive.event);
                                            }
                                            if ($this.hasActiveRules) {
                                                activeTagItem.removeClass($this.rules.activeClass);
                                            }
                                        }
                                    }
                                    if (newIndex >= 0 && $this.events.hasOwnProperty('onActive')) {
                                        if (children.eq(0).closest('[data-motopress-shortcode="' + childName + '"]').length) {
                                            activeChild = children.closest('[data-motopress-shortcode="' + childName + '"]').eq(newIndex).find($this.rules.rootSelector);
                                        } else {
                                            activeChild = children.eq(newIndex);
                                        }
                                        activeTagItem = $this.hasActiveRules && $this.rules.activeSelector ? activeChild.find($this.rules.activeSelector) : activeChild;
                                        if (activeChild.length && (!$this.hasActiveRules || $this.hasActiveRules && !activeTagItem.hasClass($this.rules.activeClass))) {
                                            if ($this.events.onActive.selector) {
                                                activeChild.find($this.events.onActive.selector).triggerHandler($this.events.onActive.event);
                                            } else {
                                                activeChild.triggerHandler($this.events.onActive.event);
                                            }
                                            if ($this.hasActiveRules) {
                                                if ($this.rules.activeSelector) {
                                                    children.find($this.rules.activeSelector).removeClass($this.rules.activeClass);
                                                } else {
                                                    children.removeClass($this.rules.activeClass);
                                                }
                                                activeTagItem.addClass($this.rules.activeClass);
                                            }
                                        }
                                    }
                                }
                            }    
                        }
                    };
                    this.accordion.accordion(accordionSettings).sortable({
                        axis: 'y',
                        handle: 'h3 > .ui-accordion-header-icon',
                        update: function (e, ui) {
                            var newItemIndex = ui.item.closest('.motopress-property-group-accordion-item').index();
                            var tabs = $this.shortcode.children('div').find('[data-motopress-shortcode]');
                            if ($this.oldItemIndex < newItemIndex) {
                                tabs.eq($this.oldItemIndex).insertAfter(tabs.eq(newItemIndex));
                                parent.MP.Utils.moveArrayElement($this.childFormCtrls, $this.oldItemIndex, newItemIndex);
                            } else {
                                tabs.eq($this.oldItemIndex).insertBefore(tabs.eq(newItemIndex));
                                parent.MP.Utils.moveArrayElement($this.childFormCtrls, $this.oldItemIndex, newItemIndex);
                            }
                            $this.accordion.accordion('refresh');
                            $this.shortcode.attr('data-motopress-active-item', $this.accordion.accordion('option', 'active'));
                            el.trigger('change');
                        },
                        start: function (e, ui) {
                            $this.oldItemIndex = ui.item.closest('.motopress-property-group-accordion-item').index();
                        }
                    });
                    if (this.disabled) {
                        if (!isNew || isNew && this.accordion.children('.motopress-property-group-accordion-item').length) {
                            this.button.attr('disabled', true);
                        }
                    }
                },
                'change': function (el, e, isNew) {
                    this.updateLabel();
                    var content = '';
                    $.each(this.childFormCtrls, function (index, childFormCtrl) {
                        if (isNew && childFormCtrl.shortcode.attr('data-motopress-new') === 'true') {
                            var parameters = typeof childFormCtrl.shortcode.attr('data-motopress-parameters') !== 'undefined' ? childFormCtrl.shortcode.attr('data-motopress-parameters') : null;
                            childFormCtrl.setDefaultAttrs(parameters);
                            $(this).removeAttr('data-motopress-new');
                        }
                        content = parent.CE.Save.getShortcode(content, childFormCtrl.shortcode);
                    });
                    this.shortcode.attr('data-motopress-content', content);
                    CE.Ctrl.prototype.change.apply(this, [
                        el,
                        e
                    ]);
                },
                '> .motopress-property-button-wrapper > .motopress-property-button-default click': function (el, e, count) {
                    e.stopPropagation();
                    if (!this.disabled || typeof count !== 'undefined') {
                        var newItem = $('<div />', { 'data-motopress-new': 'true' });
                        var attrs = null;
                        var contains = this.shortcodeCtrl.childName;
                        attrs = CE.LeftBar.myThis.library[this.shortcodeGroup].objects[contains];
                        if (attrs !== null)
                            CE.LeftBar.myThis.setAttrs(newItem, this.shortcodeGroup, attrs);
                        if (typeof count !== 'undefined') {
                            var newItems = $();
                            for (var i = 0; i < count; i++) {
                                newItems = newItems.add(newItem.clone());
                            }
                            newItem = newItems;
                        }
                        this.shortcodeCtrl.child.append(newItem);
                        if (typeof count === 'undefined') {
                            var active = this.shortcodeCtrl.child.find('[data-motopress-shortcode]').index($(newItem).eq(-1));
                            this.shortcode.attr('data-motopress-active-item', active);
                        }
                        this.formCtrl.regenerateGroupControl(this.name);
                        this.formCtrl.display(true, this.name, true);
                    }
                },
                '.motopress-property-group-accordion-item-remove click': function (el, e) {
                    e.stopPropagation();
                    var index = el.closest('.motopress-property-group-accordion-item').index();
                    this.shortcode.children('div').find('[data-motopress-shortcode]:eq(' + index + ')').remove();
                    this.shortcode.removeAttr('data-motopress-active-item');
                    this.formCtrl.regenerateGroupControl(this.name);
                    this.formCtrl.display(false, this.name, true);
                },
                updateLabel: function () {
                    if (this.label.hasOwnProperty('parameter')) {
                        var $this = this;
                        this.accordion.find('.motopress-property-group-accordion-item-label-text').each(function () {
                            var formCtrl = $(this).closest('.motopress-property-group-accordion-item').control();
                            var ctrl = formCtrl.getCtrlByName($this.label.parameter);
                            if (ctrl) {
                                $(this).text(ctrl.get());
                            }
                        });
                    }
                },
                interact: function (action, index) {
                    if (index !== false && index >= 0) {
                        var childObjEl = this.shortcode.find('[data-motopress-shortcode]').eq(index);
                        if (childObjEl.length) {
                            CE.Ctrl.bodyEl.trigger('MPCEObjectInteraction', {
                                'action': action,
                                'interacted': 'child',
                                'objElement': this.shortcode,
                                'objName': this.shortcodeName,
                                'objData': this.shortcode.data('motopress-parameters'),
                                'childObjElement': childObjEl,
                                'childObjName': this.shortcodeCtrl.childName,
                                'childObjData': childObjEl.data('motopress-parameters')
                            });
                        }
                    }
                }
            });
            CE.Ctrl('CE.CtrlMargin', {}, {
                margin: null,
                init: function (el, args) {
                    this._super(el, args);
                    this.margin = args.margin;
                },
                get: function () {
                    var margin = [];
                    var $this = this;
                    var allNone = true;
                    $.each($this.margin.sides, function (i, side) {
                        var val = $this.element.find('[data-motopress-margin-side="' + side + '"] .' + $this.margin.classPrefix + 'value').text();
                        margin.push(val);
                        if (val !== $this.margin.values[0])
                            allNone = false;
                    });
                    return allNone ? '' : margin.join(',');
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    if (typeof value === 'string') {
                        if (!value.length)
                            return;
                        value = value.split(',');
                    }
                    var $this = this;
                    $.each(value, function (i, val) {
                        var intVal = parseInt(val);
                        if (!isNaN(intVal))
                            val = intVal;
                        var tr = $this.element.find('[data-motopress-margin-side="' + $this.margin.sides[i] + '"]');
                        var icon = tr.find('.' + $this.margin.classPrefix + 'icon');
                        var valueEl = tr.find('.' + $this.margin.classPrefix + 'value');
                        var values = tr.find('.' + $this.margin.classPrefix + 'values');
                        valueEl.text(val);
                        values.removeAttr('data-motopress-margin-disabled');
                        values.filter('[data-motopress-margin-value="' + val + '"]').attr('data-motopress-margin-disabled', '');
                        if (val !== $this.margin['default'][i]) {
                            icon.attr('data-motopress-margin-active', '');
                            valueEl.attr('data-motopress-margin-active', '');
                        } else {
                            icon.removeAttr('data-motopress-margin-active');
                            valueEl.removeAttr('data-motopress-margin-active');
                        }
                    });
                },
                '.motopress-margin-values click': function (el) {
                    if (typeof el.attr('data-motopress-margin-disabled') === 'undefined') {
                        var tr = el.closest('[data-motopress-margin-side]');
                        var index = tr.index();
                        var icon = tr.find('.' + this.margin.classPrefix + 'icon');
                        var valueEl = tr.find('.' + this.margin.classPrefix + 'value');
                        var values = tr.find('.' + this.margin.classPrefix + 'values');
                        var val = el.text();
                        var intVal = parseInt(val);
                        if (!isNaN(intVal))
                            val = intVal;
                        valueEl.text(val);
                        values.removeAttr('data-motopress-margin-disabled');
                        el.attr('data-motopress-margin-disabled', '');
                        if (val !== this.margin['default'][index]) {
                            icon.attr('data-motopress-margin-active', '');
                            valueEl.attr('data-motopress-margin-active', '');
                        } else {
                            icon.removeAttr('data-motopress-margin-active');
                            valueEl.removeAttr('data-motopress-margin-active');
                        }
                        this.element.trigger('change');
                    }
                },
                getClasses: function (value) {
                    var marginClasses = [];
                    if (typeof value !== 'undefined' && value.length) {
                        if (typeof value === 'string')
                            value = value.split(',');
                        var uniqueValues = [];
                        $.each(value, function (i, val) {
                            if ($.inArray(val, uniqueValues) === -1) {
                                uniqueValues.push(val);
                            }
                        });
                        var isSame = uniqueValues.length === 1;
                        if (value.length === 4 && isSame && uniqueValues[0] !== this.margin.values[0]) {
                            marginClasses.push(this.margin.classPrefix + uniqueValues[0]);
                        } else {
                            var $this = this;
                            $.each(value, function (i, val) {
                                if (val !== $this.margin['default'][i]) {
                                    marginClasses.push($this.margin.classPrefix + $this.margin.sides[i] + '-' + val);
                                }
                            });
                        }
                    }
                    return marginClasses.join(' ');
                }
            });
            CE.Ctrl('CE.CtrlIconPicker', { listensTo: ['customize'] }, {
                emptyIcon: false,
                emptyIconValue: null,
                firstChanged: true,
                oldValue: '',
                get: function () {
                    return this.element.find('option:selected').attr('data-value');
                },
                set: function (value, defaultValue, isNew) {
                    value = CE.Ctrl.processValue(value, defaultValue, isNew);
                    this.element.find('[data-value="' + value + '"]').attr('selected', 'selected');
                },
                'change': function (el, e) {
                    if (this.firstChange) {
                        this.firstChange = false;
                        this.oldValue = this.get();
                        return false;
                    } else {
                        if (this.oldValue != this.get()) {
                            this._super(el, e);
                            CE.CtrlSelect.setSelected(el);
                            this.oldValue = this.get();
                        } else {
                            return false;
                        }
                    }
                },
                init: function (el, args) {
                    this._super(el, args);
                    this.firstChange = true;
                    this.oldValue = this.get();
                    if (typeof args.emptyValue !== 'undefined') {
                        this.emptyIcon = true;
                        this.emptyIconValue = typeof args.emptyValue !== 'undefined' ? args.emptyValue : '';
                    }
                },
                ' customize': function (el) {
                    if (this.customized)
                        return false;
                    else
                        this.customized = true;
                    el.fontIconPicker({
                        emptyIcon: this.emptyIcon,
                        emptyIconValue: this.emptyIconValue,
                        theme: 'fip-mpce',
                        iconsPerPage: 1000    
                    });
                    var classes = el.get(0).className;
                    el.siblings('.icons-selector').addClass(classes).removeClass('ce_ctrl_icon_picker motopress-controls');
                }
            });
        }(jQuery));
        (function ($) {
            CE.CtrlTemplates = can.Construct({
                createLegend: function (text) {
                    if (typeof text !== 'undefined' && text.length) {
                        var legend = $('<div />', {
                            'class': 'motopress-property-legend',
                            html: text
                        });
                        return $.merge(legend, $('<hr />'));
                    }
                    return null;
                },
                createLabel: function (text) {
                    var label = $('<label />', {
                        'class': 'motopress-property-label',
                        text: text
                    });
                    return label;
                },
                createDescription: function (text) {
                    var description = $('<div />', {
                        'class': 'motopress-property-description',
                        html: text
                    });
                    return $.merge(description, $('<hr />'));
                },
                createInput: function (attrs, name, type, className) {
                    if (typeof name === 'undefined')
                        name = null;
                    if (typeof type === 'undefined')
                        type = 'text';
                    if (typeof className === 'undefined')
                        className = 'input';
                    var accept = {};
                    if (attrs.hasOwnProperty('disabled')) {
                        var disabled = attrs.disabled === 'true';
                        if (disabled)
                            accept.disabled = disabled;
                    }
                    var text = $('<input />', {
                        'class': 'motopress-property-' + className,
                        type: type,
                        name: name
                    });
                    this.setAttrs(text, attrs, accept);
                    return text;
                },
                createLink: function (attrs, name) {
                    var accept = {};
                    var linkWrapper = $('<div />', { 'class': 'motopress-property-link' });
                    var text = this.createInput(attrs, name, undefined, 'link-input');
                    var linkSelector = this.createButton(attrs);
                    linkWrapper.append(text, linkSelector);
                    this.setAttrs(linkWrapper, attrs, accept);
                    return linkWrapper;
                },
                createMedia: function (attrs, name) {
                    if (typeof name === 'undefined')
                        name = null;
                    var textInputClass = '';
                    var accept = {};
                    var linkWrapper = $('<div />', { 'class': 'motopress-property-link' });
                    switch (attrs.type) {
                    case 'audio':
                        var hidden = this.createInput(attrs, name, 'hidden', 'audio-id').appendTo(linkWrapper);
                        textInputClass = 'audio-title';
                        break;
                    case 'media-video':
                        textInputClass = 'video-url';
                        break;
                    case 'media':
                        this.createInput(attrs, name, 'hidden', 'media-id').appendTo(linkWrapper);
                        textInputClass = 'media';
                        break;
                    }
                    var text = this.createInput(attrs, name, 'text', textInputClass).appendTo(linkWrapper);
                    var linkSelector = this.createButton(attrs, name).appendTo(linkWrapper);
                    this.setAttrs(text, attrs, accept);
                    this.setAttrs(linkSelector, attrs, accept);
                    return linkWrapper;
                },
                createTextarea: function (attrs) {
                    var accept = {
                        rows: 5,
                        cols: 10
                    };
                    if (attrs.hasOwnProperty('disabled')) {
                        var disabled = attrs.disabled === 'true';
                        if (disabled)
                            accept.disabled = disabled;
                    }
                    var textarea = $('<textarea />', { 'class': 'motopress-property-textarea' });
                    this.setAttrs(textarea, attrs, accept);
                    return textarea;
                },
                createTextareaTinyMCE: function (attrs) {
                    var textarea = this.createTextarea(attrs);
                    var button = this.createButton(attrs);
                    var wrapper = $('<div />', { 'class': 'motopress-property-textarea-tinymce' }).append(textarea, button);
                    return wrapper;
                },
                createImage: function (attrs) {
                    var accept = {};
                    var image = $('<div />', { 'class': 'motopress-property-image' });
                    var tools = $('<div />', { 'class': 'motopress-image-tools' });
                    $('<div />', { 'class': 'motopress-default motopress-icon-trash motopress-icon-white' }).appendTo(tools);
                    if (!attrs.hasOwnProperty('value') || !attrs.value) {
                        tools.hide();
                    }
                    var thumbnailWrapper = $('<div />', { 'class': 'motopress-thumbnail-crop' });
                    var thumbnail = $('<img />', {
                        src: CE.CtrlImage.thumbnail,
                        'class': 'motopress-thumbnail'
                    }).appendTo(thumbnailWrapper);
                    image.append(thumbnailWrapper, tools);
                    if (attrs.hasOwnProperty('disabled')) {
                        var disabled = attrs.disabled === 'true';
                        if (disabled) {
                            image.append($('<div />', { 'class': 'motopress-image-disabled' }));
                        }
                    }
                    this.setAttrs(thumbnail, attrs, accept);
                    return image;
                },
                createVideo: function (attrs, name) {
                    if (typeof name === 'undefined')
                        name = null;
                    var accept = {};
                    var video = this.createInput(attrs, name, 'text', 'video');
                    this.setAttrs(video, attrs, accept);
                    return video;
                },
                createCheckbox: function (attrs, name) {
                    if (typeof name === 'undefined')
                        name = null;
                    var accept = {};
                    var checkbox = this.createInput(attrs, name, 'checkbox', 'checkbox-input motopress-property-input');
                    this.setAttrs(checkbox, attrs, accept);
                    return checkbox;
                },
                _createSelect: function (attrs, name, type) {
                    if (typeof name === 'undefined')
                        name = null;
                    var isMultiple = false;
                    var suffix;
                    switch (type) {
                    case 'select':
                        suffix = 'select';
                        break;
                    case 'select-multiple':
                        suffix = 'select-multiple';
                        isMultiple = true;
                        break;
                    }
                    var accept = {};
                    if (attrs.hasOwnProperty('disabled')) {
                        var disabled = attrs.disabled === 'true';
                        if (disabled)
                            accept.disabled = disabled;
                    }
                    var select = $('<select />', {
                        'class': 'motopress-property-' + suffix + ' motopress-bootstrap-dropdown motopress-dropdown-select',
                        'multiple': isMultiple ? 'multiple' : false,
                        name: name
                    });
                    var options = CE.CtrlTemplates.generateOptions(attrs.list);
                    select.append(options);
                    this.setAttrs(select, attrs, accept);
                    return select;
                },
                generateOptions: function (list, selected) {
                    var options = [];
                    var optionAttrs;
                    $.each(list, function (value, label) {
                        optionAttrs = {
                            value: value,
                            text: label
                        };
                        if (typeof selected !== 'undefined' && selected === value) {
                            optionAttrs['selected'] = 'selected';
                        }
                        options.push($('<option />', optionAttrs));
                    });
                    return options;
                },
                createSelect: function (attrs, name) {
                    return this._createSelect(attrs, name, 'select');
                },
                createSelectMultiple: function (attrs, name) {
                    return this._createSelect(attrs, name, 'select-multiple');
                },
                createColorSelect: function (attrs, name) {
                    if (typeof name === 'undefined')
                        name = null;
                    var accept = {};
                    if (attrs.hasOwnProperty('disabled')) {
                        var disabled = attrs.disabled === 'true';
                        if (disabled)
                            accept.disabled = disabled;
                    }
                    var select = $('<select />', {
                        'class': 'motopress-property-select motopress-bootstrap-dropdown color-select motopress-dropdown-select',
                        name: name
                    });
                    var classPrefix = typeof attrs['class-prefix'] === 'undefined' ? '' : attrs['class-prefix'];
                    $.each(attrs.list, function (name, value) {
                        var colorClass = typeof name == 'string' ? name.toLowerCase() : '';
                        select.append($('<option />', {
                            value: name,
                            text: value
                        }).attr('data-content', '<span class="color ' + classPrefix + colorClass + '"></span><span>' + value + '</span>'));
                    });
                    this.setAttrs(select, attrs, accept);
                    return select;
                },
                createButton: function (attrs, name, type) {
                    if (typeof name === 'undefined')
                        name = null;
                    if (typeof type === 'undefined' || !type)
                        type = 'default';
                    var accept = {};
                    if (attrs.hasOwnProperty('disabled')) {
                        var disabled = attrs.disabled === 'true';
                        if (disabled)
                            accept.disabled = disabled;
                    }
                    var addinitionalClasses = attrs.hasOwnProperty('class') ? ' ' + attrs.class : '';
                    var button = $('<button />', {
                        'class': 'motopress-property-button-' + type + addinitionalClasses,
                        text: attrs.text,
                        name: name
                    });
                    this.setAttrs(button, attrs, accept);
                    return button;
                },
                createColorPicker: function (attrs, name) {
                    var accept = {};
                    var input = this.createInput(attrs, name, 'hidden');
                    var wrapper = $('<div />', { 'class': 'motopress-property-color-picker' }).append(input);
                    this.setAttrs(wrapper, attrs, accept);
                    return wrapper;
                },
                createSlider: function (attrs, name) {
                    var slider = $('<div>', { 'class': 'motopress-property-slider' });
                    var span = $('<span>', {
                        type: 'text',
                        'class': 'motopress-property-slider-value',
                        text: attrs['default']
                    });
                    var wrapper = $('<div>', { 'class': 'motopress-property-slider' });
                    slider.appendTo(wrapper);
                    span.appendTo(wrapper);
                    return wrapper;
                },
                createRadioButtons: function (attrs) {
                    var self = this;
                    var accept = {};
                    if (attrs.hasOwnProperty('disabled')) {
                        var disabled = attrs.disabled === 'true';
                        if (disabled)
                            accept.disabled = disabled;
                    }
                    var group = $('<div />', { 'class': 'motopress-property-radio-buttons' });
                    var id = parent.MP.Utils.uniqid();
                    var unique = 0;
                    $.each(attrs.list, function (key, value) {
                        var radioButton = $('<input />', {
                            type: 'radio',
                            id: id + unique,
                            name: id,
                            value: key
                        });
                        self.setAttrs(radioButton, attrs, accept);
                        var label = $('<label />', {
                            'for': id + unique,
                            text: value
                        });
                        group.append(radioButton, label);
                        unique++;
                    });
                    this.setAttrs(group, attrs, accept);
                    return group;
                },
                createGroup: function (attrs) {
                    var accept = {};
                    var wrapper = $('<div />', { 'class': 'motopress-property-group' });
                    var accordion = $('<div />', { 'class': 'motopress-property-group-accordion' }).appendTo(wrapper);
                    var buttonWrapper = $('<div />', { 'class': 'motopress-property-button-wrapper' }).appendTo(wrapper);
                    var buttonAttrs = $.extend({}, attrs);
                    if (attrs.hasOwnProperty('disabled')) {
                        var disabled = attrs.disabled === 'true';
                        if (disabled) {
                            delete buttonAttrs.disabled;
                            var disabledDiv = $('<div />', { 'class': 'motopress-property-disabled' }).appendTo(buttonWrapper);
                        }
                    }
                    var button = this.createButton(buttonAttrs).appendTo(buttonWrapper);
                    this.setAttrs(wrapper, attrs, accept);
                    return wrapper;
                },
                createItem: function (attrs, index) {
                    var labelText = $('<span />', {
                        'class': 'motopress-property-group-accordion-item-label-text',
                        text: attrs.label['default'] + ' ' + index
                    });
                    var btnRemove = $('<span />', { 'class': 'motopress-property-group-accordion-item-remove' });
                    var label = $('<h3 />', { 'class': 'motopress-property-group-accordion-item-label' }).append(labelText, btnRemove);
                    var content = $('<div />', { 'class': 'motopress-property-group-accordion-item-content' });
                    var wrapper = $('<div />', { 'class': 'motopress-property-group-accordion-item' }).append(label, content);
                    return wrapper;
                },
                createMargin: function (props) {
                    var table = $('<table />', { 'class': 'motopress-property-margin' });
                    $.each(props.sides, function (i, side) {
                        var tr = $('<tr />', { 'data-motopress-margin-side': side }).appendTo(table);
                        $('<td />').append($('<i />', { 'class': props.classPrefix + 'icon ' + props.classPrefix + 'icon-' + side })).appendTo(tr);
                        $('<td />').append($('<div />', {
                            'class': props.classPrefix + 'value',
                            text: props['default'][i]
                        })).appendTo(tr);
                        $.each(props.values, function (i, val) {
                            $('<td />').append($('<div />', {
                                'class': props.classPrefix + 'values',
                                'data-motopress-margin-value': val,
                                text: val
                            })).appendTo(tr);
                        });
                    });
                    return table;
                },
                createIconPicker: function (attrs, name) {
                    if (typeof name === 'undefined')
                        name = null;
                    var accept = {};
                    if (attrs.hasOwnProperty('disabled')) {
                        var disabled = attrs.disabled === 'true';
                        if (disabled)
                            accept.disabled = disabled;
                    }
                    var select = $('<select />', {
                        'class': 'motopress-property-icon-picker',
                        name: name
                    });
                    var options = '';
                    for (var name in attrs.list) {
                        var value = attrs.list[name];
                        options += '<option value="' + value.class + '" data-value="' + name + '" >' + value.label + '</option>';
                    }
                    select.get(0).innerHTML = options;
                    this.setAttrs(select, attrs, accept);
                    return select;
                },
                createDateTimePicker: function (attrs, name) {
                    var accept = {};
                    var datepickerWrapper = $('<div />', { 'class': 'motopress-property-datetime-picker' });
                    var divForm = $('<div />', { 'class': 'form-group' });
                    var divWrapper = $('<div />', { 'class': 'input-group date motopress-property-datetime-picker-wrapper ' });
                    attrs.readonly = 'readonly';
                    var input = this.createInput(attrs, name, undefined, 'datetime-picker-input form-control');
                    var buttonSelector = $('<span />', { 'class': 'input-group-addon motopress-property-datetime-picker-button' });
                    var iconButton = $('<span />', { 'class': 'motopress-calendar-icon fa fa-calendar' });
                    var button = buttonSelector.append(iconButton);
                    divForm.append(divWrapper.append(input, button));
                    datepickerWrapper.append(divForm);
                    this.setAttrs(datepickerWrapper, attrs, accept);
                    return datepickerWrapper;
                },
                createStyleEditor: function (attrs, name) {
                    var accept = {};
                    var styleEditorWrapper = $('<div />', { 'class': 'motopress-property-style-editor-wrapper' });
                    var presetSelectInput = this.createInput({});
                    styleEditorWrapper.append(presetSelectInput);
                    this.setAttrs(styleEditorWrapper, attrs, accept);
                    return styleEditorWrapper;
                },
                createComplexCtrl: function (attrs, name) {
                    var accept = {};
                    var wrapper = $('<div />', { 'class': 'motopress-property-complex' });
                    var innerForm = $('<div />', { 'class': 'motopress-property-inner-form' });
                    wrapper.append(innerForm);
                    this.setAttrs(wrapper, attrs, accept);
                    return wrapper;
                },
                setAttrs: function (form, attrs, accept) {
                    if (typeof attrs !== 'object')
                        attrs = {};
                    $.each(accept, function (name, value) {
                        if (typeof attrs[name] !== 'undefined') {
                            form.attr(name, attrs[name]);
                        } else {
                            if (value !== null) {
                                form.attr(name, value);
                            }
                        }
                    });
                }
            }, {});
        }(jQuery));
        (function ($) {
            CE.Shortcode = can.Control.extend({
                listensTo: ['render'],
                preloaderClass: 'motopress-small-preload',
                isGrid: function (groupName) {
                    return groupName === CE.LeftBar.myThis.library.mp_grid.id;
                },
                getChild: function (shortcode) {
                    var child = shortcode.children('.motopress-ce-child-detector');
                    if (!child.length) {
                        child = shortcode.children('div');    
                    }
                    return child;
                },
                getShortcodeName: function (el) {
                    return el.attr('data-motopress-shortcode');
                },
                getShortcodeGroup: function (el) {
                    return el.attr('data-motopress-group');
                }
            }, {
                group: null,
                isGrid: false,
                shortcodeName: null,
                shortcodeLabel: null,
                shortcode: null,
                child: null,
                groupItemName: null,
                childName: null,
                activeParameter: 'active',
                init: function (el, args) {
                    this.group = CE.Shortcode.getShortcodeGroup(el);
                    this.isGrid = CE.Shortcode.isGrid(this.group);
                    this.shortcodeName = CE.Shortcode.getShortcodeName(el);
                    this.shortcodeLabel = CE.LeftBar.myThis.getShortcodeLabel(this.group, this.shortcodeName);
                    this.groupItemName = null;
                    this.childName = null;
                    this.activeParameter = 'active';
                    this.shortcode = el;
                    if (!this.isGrid) {
                        this.child = CE.Shortcode.getChild(this.shortcode);
                    }
                },
                setGroupItemName: function (name) {
                    this.groupItemName = name;
                },
                setChildName: function (name) {
                    this.childName = name;
                },
                setActiveParameter: function (name) {
                    this.activeParameter = name;
                }
            });
        }(jQuery));
        (function ($) {
            CE.ControlsForm = can.Control.extend({}, {
                form: null,
                init: function (el, args) {
                    this.beforeInit();
                    this.formsMainCtrl = args.formsMainCtrl;
                    this.detectForm();
                    this.detectShortcode(args.hasOwnProperty('shortcode') ? args.shortcode : false);
                    this.generate();
                },
                beforeInit: function () {
                },
                detectForm: function () {
                    this.form = this.element;
                },
                detectShortcode: function (customShortcode) {
                    var shortcode = customShortcode === false ? this.formsMainCtrl.shortcode : customShortcode;
                    this.setShortcode(shortcode);
                    this.shortcodeGroup = CE.Shortcode.getShortcodeGroup(this.shortcode);
                    this.shortcodeName = CE.Shortcode.getShortcodeName(this.shortcode);
                },
                setShortcode: function (shortcode) {
                    this.shortcode = shortcode;
                },
                generate: function () {
                    var attrs = this.getAttrs();
                    var generalAttrs = this.getGeneralAttrs();
                    if (generalAttrs) {
                        var propertiesControls = this.generatePropertiesControls(generalAttrs, attrs);
                        this.form.append(propertiesControls);
                    }
                },
                changeProperty: function (ctrl) {
                    throw new Error('Must be implemented by subclass!');
                },
                getGeneralAttrs: function () {
                    throw new Error('Must be implemented by subclass!');
                },
                getAttrs: function () {
                    throw new Error('Must be implemented by subclass!');
                },
                save: function () {
                    throw new Error('Must be implemented by subclass!');
                },
                display: function (isNew) {
                    throw new Error('Must be implemented by subclass!');
                },
                generatePropertiesControls: function (properties, curAttrs) {
                    var $this = this;
                    var id, form, legend, label, description, descriptionStr;
                    var propertiesControls = [];
                    $.each(properties, function (name, props) {
                        id = parent.MP.Utils.uniqid();
                        props.value = curAttrs.hasOwnProperty(name) && curAttrs[name].hasOwnProperty('value') ? curAttrs[name].value : props.default;
                        legend = CE.CtrlTemplates.createLegend(props.legend);
                        label = CE.CtrlTemplates.createLabel(props.label);
                        descriptionStr = props.description;
                        if (props.hasOwnProperty('additional_description')) {
                            descriptionStr += ' ' + props.additional_description;
                        }
                        description = CE.CtrlTemplates.createDescription(descriptionStr);
                        var wrapper = $('<div />', {
                            'data-motopress-parameter': name,
                            'data-motopress-disabled': props.disabled
                        });
                        var controlSettings = {
                            name: name,
                            dependency: props.hasOwnProperty('dependency') ? props.dependency : false,
                            disabled: props.disabled === 'true',
                            isNew: $this.formsMainCtrl.isNew,
                            shortcode: $this.formsMainCtrl.shortcode,
                            formCtrl: $this
                        };
                        switch (props.type) {
                        case 'text':
                            form = CE.CtrlTemplates.createInput(props, name);
                            form.ce_ctrl_input($.extend(controlSettings, {}));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'text-hidden':
                            form = CE.CtrlTemplates.createInput(props, name, 'hidden');
                            form.ce_ctrl_input($.extend(controlSettings, {}));
                            wrapper.append(form);
                            break;
                        case 'link':
                            form = CE.CtrlTemplates.createLink(props, name);
                            form.ce_ctrl_link($.extend(controlSettings, {}));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'spinner':
                            form = CE.CtrlTemplates.createInput(props, name, null, 'spinner');
                            form.ce_ctrl_spinner($.extend(controlSettings, {
                                min: props.min,
                                max: props.max,
                                step: props.step
                            }));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'longtext':
                            form = CE.CtrlTemplates.createTextarea(props);
                            form.ce_ctrl_textarea($.extend(controlSettings, {}));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'longtext64':
                            form = CE.CtrlTemplates.createTextarea(props);
                            form.ce_ctrl_textarea64($.extend(controlSettings, {}));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'longtext-table':
                            form = CE.CtrlTemplates.createTextarea(props);
                            form.ce_ctrl_textarea_table($.extend(controlSettings, {}));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'longtext-tinymce':
                            form = CE.CtrlTemplates.createTextareaTinyMCE(props);
                            form.ce_ctrl_textarea_tinymce($.extend(controlSettings, { currentShortcode: $this.formsMainCtrl.element }));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'image':
                            props.src = props.value;
                            form = CE.CtrlTemplates.createImage(props);
                            form.ce_ctrl_image($.extend(controlSettings, {
                                autoOpen: props.autoOpen,
                                pseudoRender: name === 'parallax_image' && ($this.shortcodeName === 'mp_row' || $this.shortcodeName === 'mp_row_inner') ? true : false
                            }));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'image-src':
                            props.src = props.value;
                            form = CE.CtrlTemplates.createImage(props);
                            form.ce_ctrl_image($.extend(controlSettings, {
                                returnMode: 'src',
                                autoOpen: props.autoOpen,
                                pseudoRender: name === 'parallax_image' && ($this.shortcodeName === 'mp_row' || $this.shortcodeName === 'mp_row_inner') ? true : false
                            }));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'audio':
                            form = CE.CtrlTemplates.createMedia(props);
                            var thisTitle = $this.formsMainCtrl.child.attr('data-audio-title');
                            form.ce_ctrl_audio($.extend(controlSettings, {
                                audioTitle: thisTitle    
                            }));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'media':
                            var mediaReturnMode = typeof props.returnMode === 'undefined' || $.inArray(props.returnMode, [
                                'id',
                                'url'
                            ]) === -1 ? 'url' : props.returnMode;
                            var value = props.value;
                            form = CE.CtrlTemplates.createMedia(props);
                            form.ce_ctrl_media($.extend(controlSettings, {
                                returnMode: mediaReturnMode,
                                value: value
                            }));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'media-video':
                            form = CE.CtrlTemplates.createMedia(props);
                            form.ce_ctrl_media_video($.extend(controlSettings, {}));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'multi-images':
                            form = CE.CtrlTemplates.createButton(props, null, 'default');
                            form.ce_ctrl_image_slider($.extend(controlSettings, { autoOpen: props.autoOpen }));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'video':
                            form = CE.CtrlTemplates.createVideo(props, name);
                            form.ce_ctrl_video($.extend(controlSettings, {}));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'checkbox':
                            form = CE.CtrlTemplates.createCheckbox(props);
                            form.ce_ctrl_checkbox($.extend(controlSettings, {}));
                            label.addClass('motopress-property-checkbox-label');
                            wrapper.append(legend, form, label, description);
                            break;
                        case 'group-checkbox':
                            form = CE.CtrlTemplates.createCheckbox(props);
                            form.ce_ctrl_group_checkbox($.extend(controlSettings, {}));
                            label.addClass('motopress-property-checkbox-label');
                            wrapper.append(legend, form, label, description);
                            break;
                        case 'select':
                            form = CE.CtrlTemplates.createSelect(props);
                            form.ce_ctrl_select($.extend(controlSettings, {}));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'select-multiple':
                            form = CE.CtrlTemplates.createSelectMultiple(props);
                            form.ce_ctrl_select_multiple($.extend(controlSettings, {}));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'color-select':
                            form = CE.CtrlTemplates.createColorSelect(props);
                            form.ce_ctrl_select($.extend(controlSettings, {}));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'editor-button':
                            form = CE.CtrlTemplates.createButton(props, null, 'default');
                            form.ce_ctrl_editor_button($.extend(controlSettings, {}));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'color-picker':
                            form = CE.CtrlTemplates.createColorPicker(props, name);
                            form.ce_ctrl_color_picker($.extend(controlSettings, {}));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'group':
                            var shortcodeCtrl = $this.formsMainCtrl.shortcode.control(), childName = props.contains;
                            shortcodeCtrl.setGroupItemName(name);
                            shortcodeCtrl.setChildName(childName);
                            if (props.hasOwnProperty('activeParameter') && props.activeParameter)
                                shortcodeCtrl.setActiveParameter(props.activeParameter);
                            form = CE.CtrlTemplates.createGroup(props);
                            var accordion = form.children('.motopress-property-group-accordion');
                            form.ce_ctrl_group($.extend(controlSettings, {
                                currentSpan: $this.formsMainCtrl.element,
                                label: props.hasOwnProperty('items') ? props.items.label : null,
                                rules: props.hasOwnProperty('rules') ? props.rules : null,
                                events: props.hasOwnProperty('events') ? props.events : null
                            }));
                            $this.formsMainCtrl.shortcode.attr('data-motopress-wrap-render', 'true');
                            var groupCtrl = form.control();
                            $this.formsMainCtrl.shortcode.find('[data-motopress-shortcode]').each(function (index, innerShortcode) {
                                var item = CE.CtrlTemplates.createItem(props.items, index);
                                groupCtrl.addChildFormCtrl(new CE.SettingsControlsChildForm(item, {
                                    'parentFormCtrl': $this,
                                    'formsMainCtrl': $this.formsMainCtrl,
                                    'shortcode': $(innerShortcode),
                                    'groupCtrl': groupCtrl
                                }));
                                accordion.append(item);
                            });
                            wrapper.attr('data-motopress-grouped', 'true');
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'slider':
                            form = CE.CtrlTemplates.createSlider(props);
                            form.ce_ctrl_slider($.extend(controlSettings, {
                                min: typeof props.min !== 'undefined' && !isNaN(props.min) ? props.min : 0,
                                max: typeof props.max !== 'undefined' && !isNaN(props.max) ? props.max : 100,
                                step: typeof props.step !== 'undefined' && !isNaN(props.step) ? props.step : 1,
                                value: props.value
                            }));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'radio-buttons':
                            form = CE.CtrlTemplates.createRadioButtons(props);
                            form.ce_ctrl_radio_buttons($.extend(controlSettings, { value: props.value }));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'icon-picker':
                            form = CE.CtrlTemplates.createIconPicker(props);
                            form.ce_ctrl_icon_picker($.extend(controlSettings, { value: props.value }));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'datetime-picker':
                            var returnMode = typeof props.returnMode === 'undefined' ? 'YYYY-MM-DD H:m:s' : props.returnMode;
                            var displayMode = typeof props.displayMode === 'undefined' || $.inArray(props.displayMode, [
                                'date',
                                'datetime'
                            ]) === -1 ? 'datetime' : props.displayMode;
                            form = CE.CtrlTemplates.createDateTimePicker(props);
                            form.ce_ctrl_date_time_picker($.extend(controlSettings, {
                                value: props.value,
                                returnMode: returnMode,
                                displayMode: displayMode
                            }));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'margin':
                            form = CE.CtrlTemplates.createMargin(props);
                            form.ce_ctrl_margin($.extend(controlSettings, { margin: props }));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'select2':
                            form = CE.CtrlTemplates.createInput(props, name);
                            form.ce_ctrl_select2($.extend(controlSettings, {}));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'style_editor':
                            form = CE.CtrlTemplates.createInput(props, name);
                            form.ce_ctrl_style_editor($.extend(controlSettings, {}));
                            wrapper.append(legend, label, form, description);
                            break;
                        case 'gradient-picker':
                            form = CE.CtrlTemplates.createComplexCtrl(props, name);
                            form.ce_ctrl_gradient($.extend(controlSettings, {}));
                            wrapper.append(legend, label, form, description);
                            break;    
                        }
                        var formCtrl = form.control();
                        formCtrl.afterInit();
                        propertiesControls.push(wrapper);
                        if (props.hasOwnProperty('disabled')) {
                            var disabled = props.disabled === 'true';
                            if (disabled) {
                                var disabledDiv = null;
                                if (props.type === 'group') {
                                    disabledDiv = form.find('> .motopress-property-button-wrapper > .motopress-property-disabled');
                                } else {
                                    disabledDiv = $('<div />', { 'class': 'motopress-property-disabled' }).appendTo(wrapper);
                                }
                                if (!disabledDiv.data('popover')) {
                                    disabledDiv.mppopover({
                                        'placement': 'top',
                                        'trigger': 'manual',
                                        'container': wrapper,
                                        'content': localStorage.getItem('CELiteTooltipText')
                                    });
                                }
                                disabledDiv.on('click', function () {
                                    $(this).mppopover('show');
                                    var t = setTimeout(function () {
                                        disabledDiv.mppopover('hide');
                                        clearTimeout(t);
                                    }, 2000);
                                });
                            }
                        }
                        form.addClass('motopress-controls');
                        form.attr('id', id);
                        label.attr('for', id);
                    });
                    return propertiesControls;
                },
                resolveDependencies: function () {
                    var $this = this;
                    var ctrl, dependencyCtrl;
                    $.each(this.getGeneralAttrs(), function (name, props) {
                        ctrl = $this.getCtrlByName(name);
                        if (ctrl.dependency) {
                            dependencyCtrl = $this.getCtrlByName(ctrl.dependency.parameter);
                            if (dependencyCtrl.name === ctrl.dependency.parameter) {
                                if (ctrl.isShouldBeHiddenByDependency()) {
                                    ctrl.hide();
                                } else {
                                    ctrl.show();
                                }
                            }
                        }
                    });
                },
                getParameterElByName: function (name) {
                    var el = this.form.find('> [data-motopress-parameter="' + name + '"] > .motopress-controls, > [data-motopress-parameter="' + name + '"] > :not(".motopress-property-legend, .motopress-property-label, .motopress-property-description, hr") > .motopress-controls');
                    return el.length ? el : false;
                },
                getCtrlByName: function (name) {
                    var el = this.getParameterElByName(name);
                    return el ? el.control() : false;
                }
            });
        }(jQuery));
        (function ($) {
            CE.ControlsForm('CE.SettingsControlsForm', {}, {
                init: function (el, args) {
                    this._super(el, args);
                },
                getGeneralAttrs: function () {
                    return CE.LeftBar.myThis.getParametersAttrs(this.shortcodeGroup, this.shortcodeName);
                },
                getAttrs: function () {
                    var attrs = this.shortcode.attr('data-motopress-parameters');
                    return attrs ? $.parseJSON(attrs) : false;
                },
                setAttrs: function (attrs) {
                    this.shortcode.attr('data-motopress-parameters', JSON.stringify(attrs));
                },
                setDefaultAttrs: function (attrs) {
                    if (null !== attrs) {
                        var JSONParameters = $.parseJSON(attrs);
                        var generalAttrs = this.getGeneralAttrs();
                        var $this = this;
                        $.each(JSONParameters, function (name, values) {
                            if (typeof values.value === 'undefined' || !values.value) {
                                if (generalAttrs[name].hasOwnProperty('saveInContent') && generalAttrs[name].saveInContent === 'true') {
                                    $this.shortcode.attr('data-motopress-content', generalAttrs[name]['default']);
                                } else {
                                    values.value = generalAttrs[name]['default'];
                                }
                            }
                        });
                        this.setAttrs(JSONParameters);
                        return JSON.stringify(JSONParameters);
                    } else {
                        return attrs;
                    }
                },
                regenerateGroupControl: function (propertyName) {
                    var attrs = this.getAttrs();
                    if (attrs) {
                        var generalAttrs = this.getGeneralAttrs(undefined);
                        var obj = {};
                        obj[propertyName] = generalAttrs[propertyName];
                        generalAttrs = obj;
                        var settingsPropertiesControls = this.generatePropertiesControls(generalAttrs, attrs);
                        this.form.append(settingsPropertiesControls);
                    }
                    var oldWrapper = this.form.children('[data-motopress-parameter="' + propertyName + '"]:first');
                    var newWrapper = this.form.children('[data-motopress-parameter="' + propertyName + '"]:last');
                    oldWrapper.replaceWith(newWrapper);
                },
                changeProperty: function (ctrl) {
                    this.save(ctrl);
                },
                save: function (ctrl) {
                    if (typeof ctrl !== 'undefined' && typeof ctrl.name !== 'undefined') {
                        var $this = this;
                        var attrs = this.getAttrs();
                        if (attrs) {
                            var generalAttrs = this.getGeneralAttrs();
                            var props = generalAttrs[ctrl.name];
                            var value = ctrl.get();
                            if (props.hasOwnProperty('saveInContent') && props.saveInContent === 'true') {
                                this.shortcode.attr('data-motopress-content', value);
                            } else {
                                attrs[ctrl.name].value = value !== undefined && typeof value === 'string' ? value.replace(new RegExp(/"/g), '\'').replace(new RegExp(/[\[\]]/g), '') : value;
                            }
                            this.setAttrs(attrs);
                            this.formsMainCtrl.renderShortcode();
                            if (this.shortcodeName === 'mp_row' || this.shortcodeName === 'mp_row_inner') {
                                switch (ctrl.name) {
                                case 'bg_media_type':
                                    this.setRowMediaBG(value);
                                    break;
                                case 'parallax_image':
                                case 'parallax_bg_size':
                                    this.setRowParallaxBGSize();
                                    break;
                                case 'bg_video_youtube':
                                case 'bg_video_youtube_cover':
                                    $this.clearRowMediaBG(this.shortcode);
                                    $this.renderYoutubeBG();
                                    break;
                                case 'bg_video_webm':
                                case 'bg_video_mp4':
                                case 'bg_video_ogg':
                                case 'bg_video_cover':
                                    $this.clearRowMediaBG(this.shortcode);
                                    $this.renderHTML5VideoBG();
                                    break;
                                case 'stretch':
                                    var stretchClass = $this.getStretchClassByValue(value);
                                    if (stretchClass) {
                                        $this.setRowWidth(stretchClass);
                                    } else {
                                        $this.clearRowWidth();
                                    }
                                    parent.MP.Editor.triggerIfr('Resize');
                                    break;
                                case 'width_content':
                                    var rowWidth = this.getContentWidthClassByValue(value);
                                    this.setRowWidth(rowWidth);
                                    parent.MP.Editor.triggerIfr('Resize');
                                    break;
                                case 'full_height':
                                    var fullHeightClass = 'mp-row-fullheight';
                                    if (value === 'true') {
                                        this.shortcode.addClass(fullHeightClass);
                                    } else {
                                        this.shortcode.removeClass(fullHeightClass);
                                    }
                                    parent.MP.Editor.triggerIfr('Resize');
                                    break;    
                                }
                            }
                        }
                    }
                },
                getStretchClassByValue: function (value) {
                    var result = '';
                    switch (value) {
                    case '':
                        break;
                    case 'full':
                        var contentWidth = this.getCtrlByName('width_content').get();
                        result = this.getContentWidthClassByValue(contentWidth);
                        break;
                    case 'fixed':
                        result = 'mp-row-fixed-width';
                        break;
                    }
                    return result;
                },
                getContentWidthClassByValue: function (value) {
                    var result = '';
                    switch (value) {
                    case '':
                    default:
                        result = 'mp-row-fullwidth';
                        break;
                    case 'full':
                        result = 'mp-row-fullwidth-content';
                        break;
                    case 'fixed':
                        result = 'mp-row-fixed-width-content';
                        break;
                    }
                    return result;
                },
                display: function (isNew, property, change) {
                    if (typeof property === 'undefined') {
                        CE.Dialog.myThis.settingsTab.children('.motopress-settings-forms').detach();
                        CE.Dialog.myThis.settingsTab.html(this.form);
                    }
                    var shortcodeAttrs = this.getAttrs();
                    if (shortcodeAttrs) {
                        var $this = this;
                        var el = null;
                        var value = null;
                        var generalAttrs = this.getGeneralAttrs();
                        if (typeof property !== 'undefined') {
                            var obj = {};
                            obj[property] = generalAttrs[property];
                            generalAttrs = obj;
                        }
                        var defaultValue = null;
                        var ctrl = null;
                        $.each(generalAttrs, function (name, props) {
                            el = $this.getParameterElByName(name);
                            if (el.hasClass('motopress-property-group')) {
                                if (change)
                                    el.trigger('change', isNew);
                                el.find('.motopress-property-group-accordion-item').each(function () {
                                    var childFormCtrl = $(this).control();
                                    childFormCtrl.display(isNew);
                                });
                                el.trigger('render', isNew);
                            }
                            ctrl = el.control();
                            if (props.hasOwnProperty('saveInContent') && props.saveInContent === 'true') {
                                if (typeof $this.shortcode.attr('data-motopress-content') !== 'undefined') {
                                    value = $this.shortcode.attr('data-motopress-content').replace(/\[\]/g, '[');
                                }
                            } else {
                                value = shortcodeAttrs[ctrl.name].value;
                            }
                            defaultValue = generalAttrs[ctrl.name]['default'];
                            ctrl.set(value, defaultValue, isNew);
                            el.trigger('customize');
                        });
                        this.resolveDependencies();
                    }
                },
                renderYoutubeBG: function () {
                    var $this = this;
                    var parameters = typeof this.shortcode.attr('data-motopress-parameters') !== 'undefined' ? this.shortcode.attr('data-motopress-parameters') : null;
                    parameters = $.parseJSON(parameters);
                    $.ajax({
                        url: parent.motopress.ajaxUrl,
                        type: 'POST',
                        dataType: 'text',
                        data: {
                            action: 'motopress_ce_render_youtube_bg',
                            nonce: parent.motopressCE.nonces.motopress_ce_render_youtube_bg,
                            postID: parent.motopressCE.postID,
                            bg_video_youtube: parameters['bg_video_youtube']['value'],
                            bg_video_youtube_cover: parameters['bg_video_youtube_cover']['value'],
                            bg_video_youtube_repeat: parameters['bg_video_youtube_repeat']['value'],
                            bg_video_youtube_mute: parameters['bg_video_youtube_mute']['value']
                        },
                        success: function (data) {
                            $this.shortcode.addClass('mp-row-video').children('.motopress-row-helper').before(data);
                            mpInitYouTubePlayers($this.shortcode.children('.mp-video-container').find('.mp-youtube-video'));
                            mpFixBackgroundVideoSize($this.shortcode.children('.mp-video-container'));
                        },
                        error: function (jqXHR) {
                            console.log(jqXHR);
                        }
                    });
                },
                renderHTML5VideoBG: function () {
                    var $this = this;
                    var parameters = typeof this.shortcode.attr('data-motopress-parameters') !== 'undefined' ? this.shortcode.attr('data-motopress-parameters') : null;
                    parameters = $.parseJSON(parameters);
                    $.ajax({
                        url: parent.motopress.ajaxUrl,
                        type: 'POST',
                        dataType: 'text',
                        data: {
                            action: 'motopress_ce_render_video_bg',
                            nonce: parent.motopressCE.nonces.motopress_ce_render_video_bg,
                            postID: parent.motopressCE.postID,
                            bg_video_mp4: parameters['bg_video_mp4']['value'],
                            bg_video_webm: parameters['bg_video_webm']['value'],
                            bg_video_ogg: parameters['bg_video_ogg']['value'],
                            bg_video_cover: parameters['bg_video_cover']['value'],
                            bg_video_mute: parameters['bg_video_mute']['value'],
                            bg_video_repeat: parameters['bg_video_repeat']['value']
                        },
                        success: function (data) {
                            $this.shortcode.addClass('mp-row-video').children('.motopress-row-helper').before(data);
                            mpFixBackgroundVideoSize($this.shortcode.children('.mp-video-container'));
                        },
                        error: function (jqXHR) {
                            console.log(jqXHR);
                        }
                    });
                },
                setRowWidth: function (widthClass) {
                    this.clearRowWidth();
                    this.shortcode.addClass(widthClass);
                },
                clearRowWidth: function () {
                    var allWidthClasses = 'mp-row-fullwidth mp-row-fullwidth-content mp-row-fixed-width mp-row-fixed-width-content';
                    this.shortcode.removeClass(allWidthClasses);
                    this.shortcode.css({
                        'width': '',
                        'padding-left': '',
                        'margin-left': '',
                        'padding-right': '',
                        'margin-right': ''
                    });
                },
                setRowMediaBG: function (type) {
                    this.clearRowMediaBG(this.shortcode);
                    switch (type) {
                    case 'disabled':
                        break;
                    case 'video':
                        this.renderHTML5VideoBG();
                        break;
                    case 'youtube':
                        this.renderYoutubeBG();
                        break;
                    case 'parallax':
                        var img = this.form.find('[data-motopress-parameter="parallax_image"] [data-full-src]').length ? this.form.find('[data-motopress-parameter="parallax_image"] [data-full-src]').attr('data-full-src') : null;
                        this.shortcode.addClass('motopress-row-parallax').attr('data-stellar-background-ratio', 0.5);
                        if (img) {
                            this.shortcode.css('background-image', 'url(\'' + img + '\')');
                        }
                        this.setRowParallaxBGSize();
                        $.stellar('refresh');
                        break;
                    }
                },
                clearRowMediaBG: function (element) {
                    element.children('.mp-video-container').remove();
                    element.removeClass('mp-row-video motopress-row-parallax').css('background-image', '').css('background-position', '').css('background-size', '');
                    element.removeAttr('data-stellar-background-ratio').removeData('stellarBackgroundIsActive stellarBackgroundRatio stellarBackgroundStartingLeft stellarBackgroundStartingTop');
                    $.stellar('refresh');
                },
                setRowParallaxBGSize: function () {
                    var value = this.getCtrlByName('parallax_bg_size').get();
                    value = value === undefined || value === 'normal' ? '' : value;
                    this.shortcode.css('background-size', value);
                }
            });
        }(jQuery));
        (function ($) {
            CE.SettingsControlsForm('CE.SettingsControlsChildForm', {}, {
                init: function (el, args) {
                    this._super(el, args);
                    this.parentFormCtrl = args.parentFormCtrl;
                    this.groupCtrl = args.groupCtrl;
                },
                changeProperty: function (ctrl) {
                    this.save(ctrl);
                    this.groupCtrl.element.trigger('change');
                },
                setDefaultAttrs: function (parameters) {
                    if (null !== parameters) {
                        var JSONParameters = $.parseJSON(parameters);
                        var generalAttrs = this.getGeneralAttrs();
                        var $this = this;
                        $.each(JSONParameters, function (name, values) {
                            if (typeof values.value === 'undefined' || !values.value) {
                                if ($this.shortcodeName === 'mp_tab' && name === 'id') {
                                    values.value = parent.MP.Utils.uniqid();
                                } else if (generalAttrs[name].hasOwnProperty('saveInContent') && generalAttrs[name].saveInContent === 'true') {
                                    $this.shortcode.attr('data-motopress-content', generalAttrs[name]['default']);
                                } else {
                                    values.value = generalAttrs[name]['default'];
                                }
                            }
                        });
                        this.setAttrs(JSONParameters);
                        return JSON.stringify(JSONParameters);
                    } else {
                        return parameters;
                    }
                },
                detectForm: function () {
                    this.form = this.element.children('.motopress-property-group-accordion-item-content');
                },
                save: function (ctrl) {
                    if (typeof ctrl !== 'undefined' && typeof ctrl.name !== 'undefined') {
                        var shortcodeAttrs = this.getAttrs();
                        if (shortcodeAttrs) {
                            var generalAttrs = this.getGeneralAttrs();
                            var props = generalAttrs[ctrl.name];
                            var value = ctrl.get();
                            if (props.hasOwnProperty('saveInContent') && props.saveInContent === 'true') {
                                this.shortcode.attr('data-motopress-content', value);
                            } else {
                                shortcodeAttrs[ctrl.name].value = value !== undefined && typeof value === 'string' ? value.replace(new RegExp(/"/g), '\'').replace(new RegExp(/[\[\]]/g), '') : value;
                            }
                            this.setAttrs(shortcodeAttrs);
                        }
                    }
                },
                display: function (isNew, property) {
                    var shortcodeAttrs = this.getAttrs();
                    if (shortcodeAttrs) {
                        var $this = this;
                        var value = null;
                        var generalAttrs = this.getGeneralAttrs();
                        if (typeof property !== 'undefined') {
                            var obj = {};
                            obj[property] = generalAttrs[property];
                            generalAttrs = obj;
                        }
                        var defaultValue = null;
                        var ctrl = null;
                        $.each(generalAttrs, function (name, props) {
                            ctrl = $this.getCtrlByName(name);
                            if (props.hasOwnProperty('saveInContent') && props.saveInContent === 'true') {
                                if (typeof $this.shortcode.attr('data-motopress-content') !== 'undefined') {
                                    value = $this.shortcode.attr('data-motopress-content').replace(/\[\]/g, '[');
                                }
                            } else {
                                value = shortcodeAttrs[ctrl.name].value;
                            }
                            if (name === 'id' && $this.shortcodeName === 'mp_accordion_item' && typeof value === 'undefined') {
                                value = $this.shortcode.find('.motopress-accordion-item').attr('id');
                            }
                            defaultValue = generalAttrs[ctrl.name]['default'];
                            ctrl.set(value, defaultValue, isNew);
                        });
                        this.resolveDependencies();
                    }
                }
            });
        }(jQuery));
        (function ($) {
            CE.ControlsForm('CE.StyleControlsForm', {}, {
                init: function (el, args) {
                    this._super(el, args);
                },
                changeProperty: function (ctrl) {
                    this.save(ctrl);
                    $('body').trigger('MPCEObjectStyleChanged', {
                        'objElement': this.shortcode,
                        'objName': this.shortcodeName
                    });
                },
                getGeneralAttrs: function () {
                    return CE.LeftBar.myThis.getStyleAttrs(this.shortcodeGroup, this.shortcodeName);
                },
                getAttrs: function () {
                    var shortcodeStyle = this.shortcode.attr('data-motopress-styles');
                    if (shortcodeStyle) {
                        shortcodeStyle = $.parseJSON(shortcodeStyle);
                        if (!this.formsMainCtrl.isGrid && shortcodeStyle.hasOwnProperty('margin') && $.isEmptyObject(shortcodeStyle.margin)) {
                            shortcodeStyle = this.fixMarginValue(shortcodeStyle);
                        }
                        return shortcodeStyle;
                    } else {
                        return false;
                    }
                },
                fixMarginValue: function (attrs) {
                    if (this.formsMainCtrl.child.length) {
                        var generalAttrs = this.getGeneralAttrs();
                        var margin = generalAttrs.margin['default'].slice();
                        var classes = this.formsMainCtrl.child.prop('class').split(' ');
                        var marginClasses = classes.filter(function (str) {
                            return generalAttrs.margin.regExp.test(str);
                        });
                        if (marginClasses.length) {
                            $.each(marginClasses, function (i, className) {
                                var matches = className.match(generalAttrs.margin.regExp);
                                var side = matches[1];
                                var value = parseInt(matches[2]);
                                if (typeof side === 'undefined') {
                                    $.each(margin, function (j, val) {
                                        if (value !== generalAttrs.margin['default'][j]) {
                                            margin[j] = value;
                                        }
                                    });
                                } else {
                                    var index = $.inArray(side, generalAttrs.margin.sides);
                                    if (index !== -1) {
                                        margin[index] = value;
                                    }
                                }
                            });
                            attrs.margin.value = margin.join(',');
                            this.setAttrs(attrs);
                            attrs = this.getAttrs();
                        }
                    }
                    return attrs;
                },
                setAttrs: function (shortcodeStyle) {
                    this.shortcode.attr('data-motopress-styles', JSON.stringify(shortcodeStyle));
                },
                setDefaultAttrs: function (styleJSON) {
                    var style = typeof styleJSON === 'undefined' ? this.getAttrs() : $.parseJSON(styleJSON);
                    var styleAttrs = CE.LeftBar.myThis.getStyleAttrs(this.shortcodeGroup, this.shortcodeName);
                    $.each(style, function (name, values) {
                        if (typeof values.value === 'undefined' || !values.value) {
                            var defaultVal = styleAttrs[name]['default'];
                            switch (styleAttrs[name].type) {
                            case 'margin':
                                var allNone = true;
                                $.each(styleAttrs[name]['default'], function (i, val) {
                                    if (val !== styleAttrs[name].values[0])
                                        allNone = false;
                                });
                                defaultVal = allNone ? '' : defaultVal.join(',');
                                break;
                            case 'select2':
                                var defaultClassesList = [];
                                if (styleAttrs['mp_style_classes'].hasOwnProperty('default')) {
                                    $.each(styleAttrs['mp_style_classes']['default'], function (i, v) {
                                        defaultClassesList.push(v);
                                    });
                                }
                                defaultVal = defaultClassesList.join(' ');
                                break;
                            }
                            values.value = defaultVal;
                        }
                    });
                    this.setAttrs(style);
                    return JSON.stringify(style);
                },
                display: function (isNew) {
                    CE.Dialog.myThis.styleTab.children('.motopress-style-forms').detach();
                    CE.Dialog.myThis.styleTab.html(this.form);
                    var shortcodeStyle = this.getAttrs();
                    if (shortcodeStyle) {
                        var $this = this;
                        var ctrl = null;
                        var el = null;
                        var value = null;
                        var defaultValue = null;
                        var styles = this.getGeneralAttrs();
                        $.each(shortcodeStyle, function (name, props) {
                            el = $this.getParameterElByName(name);
                            ctrl = el.control();
                            value = shortcodeStyle[ctrl.name].value;
                            defaultValue = styles[ctrl.name]['default'];
                            ctrl.set(value, defaultValue, isNew);
                            el.trigger('customize');
                        });
                        this.resolveDependencies();
                    }
                },
                save: function (ctrl) {
                    var shortcodeStyle = this.getAttrs();
                    if (shortcodeStyle) {
                        if (typeof ctrl === 'undefined' && this.formsMainCtrl.isGrid) {
                            var $this = this;
                            $.each(shortcodeStyle, function (name) {
                                ctrl = $this.getCtrlByName(name);
                                $this._save(shortcodeStyle, ctrl, false);
                            });
                        } else {
                            this._save(shortcodeStyle, ctrl);
                            CE.Resizer.myThis.updateAllHandles();
                            $(window).trigger('resize');
                        }
                    }
                },
                getTargetElement: function (ctrl) {
                    var selectorEl = null;
                    if (this.formsMainCtrl.isGrid) {
                        selectorEl = this.shortcode;
                    } else if (this.formsMainCtrl.child.length) {
                        selectorEl = this.formsMainCtrl.child;
                    }
                    if ((ctrl.name === 'mp_style_classes' || ctrl.name === 'mp_custom_style') && CE.LeftBar.myThis.library[this.shortcodeGroup].objects[this.shortcodeName].styles[ctrl.name].hasOwnProperty('selector')) {
                        var selector = CE.LeftBar.myThis.library[this.shortcodeGroup].objects[this.shortcodeName].styles[ctrl.name].selector;
                        if (selector === false) {
                            selectorEl = null;
                        } else if (selector.length) {
                            selectorEl = selectorEl.find(selector);
                        }
                    }
                    return selectorEl;
                },
                _save: function (shortcodeStyle, ctrl, change) {
                    if (typeof change === 'undefined')
                        change = true;
                    var oldValue = shortcodeStyle[ctrl.name].value;
                    var value = change ? ctrl.get() : oldValue;
                    if (change) {
                        shortcodeStyle[ctrl.name].value = value;
                        this.setAttrs(shortcodeStyle);
                    }
                    var selectorEl = this.getTargetElement(ctrl);
                    switch (ctrl.name) {
                    case 'margin':
                        var oldMarginClasses = ctrl.getClasses(oldValue);
                        if (oldMarginClasses.length)
                            oldValue = oldMarginClasses;
                        var marginClasses = ctrl.getClasses(value);
                        if (marginClasses.length)
                            value = marginClasses;
                        break;
                    case 'mp_style_classes':
                        if (!change) {
                            if (!$.isEmptyObject(ctrl.options.style.basic)) {
                                var basic = '';
                                if ($.isArray(ctrl.options.style.basic)) {
                                    $.each(ctrl.options.style.basic, function (i, val) {
                                        basic += val['class'] + ' ';
                                    });
                                } else {
                                    basic = ctrl.options.style.basic['class'] + ' ';
                                }
                                value = basic + value;
                            }
                        }
                        break;    
                    }
                    if (selectorEl !== null && selectorEl.length) {
                        if (change)
                            selectorEl.removeClass(oldValue);
                        selectorEl.addClass(value);
                    }
                }
            });
        }(jQuery));
        (function ($) {
            CE.ControlsForm('CE.StyleEditorControlsForm', {}, {
                emptyStyleValue: '',
                editedStyleObj: null,
                loadedAttrs: {},
                styleEditorCtrl: null,
                propertiesWrapper: null,
                statesWrapper: null,
                actionsWrapper: null,
                state: null,
                beforeInit: function () {
                    this._super();
                    this.generateStatesWrapper();
                    this.generatePropertiesWrapper();
                    this.generateActionsWrapper();
                },
                init: function (el, args) {
                    this.styleEditorCtrl = args.styleEditorCtrl;
                    this._super(el, args);
                },
                generateStatesWrapper: function () {
                    var $this = this;
                    this.statesWrapper = $('<div />', { 'class': 'motopress-ce-style-editor-states-wrapper' });
                    this.statesWrapper.append($('<a />', {
                        'href': '#',
                        'data-state': 'up',
                        'title': localStorage.getItem('CEDesktopStyle')
                    }), $('<a />', {
                        'href': '#',
                        'data-state': 'tablet',
                        'title': localStorage.getItem('CETabletStyle')
                    }), $('<a />', {
                        'href': '#',
                        'data-state': 'mobile',
                        'title': localStorage.getItem('CEMobileStyle')
                    }), $('<a />', {
                        'href': '#',
                        'data-state': 'hover',
                        'title': localStorage.getItem('CEHoverStyle')
                    }));
                    this.statesWrapper.children('a').on('click', function (e) {
                        e.preventDefault();
                        $this.setState($(this).attr('data-state'));
                    });
                    this.element.append(this.statesWrapper);
                },
                generatePropertiesWrapper: function () {
                    this.propertiesWrapper = $('<div />', { 'class': 'motopress-ce-style-editor-properties-wrapper' });
                    this.element.append(this.propertiesWrapper);
                },
                generateActionsWrapper: function () {
                    var $this = this;
                    this.actionsWrapper = $('<div />', { 'class': 'motopress-ce-style-editor-actions-wrapper' });
                    var applyBtn = $('<button />', {
                        'class': 'motopress-ce-style-editor-apply-button btn',
                        'text': localStorage.getItem('CEApply')
                    }).on('click', function (e) {
                        e.preventDefault();
                        $this.confirm();
                    });
                    var actionsMenu = $('<ul />', { 'class': 'dropdown-menu' });
                    $.each(this.generateActionButtons(), function (index, $btn) {
                        var $li = $('<li />');
                        if (typeof $btn.data('mpce-parent-classes') !== 'undefined') {
                            $li.addClass($btn.data('mpce-parent-classes'));
                        }
                        $li.append($btn).appendTo(actionsMenu);
                    });
                    var dropdownBtnWrapper = $('<div />', { 'class': 'btn-group motopress-bootstrap-dropdown motopress-dropdown-button dropup' }).append(applyBtn, '<button class="dropdown-toggle btn" data-toggle="dropdown"><span class="caret"></span></button>', actionsMenu);
                    this.actionsWrapper.append(dropdownBtnWrapper);
                    this.element.append(this.actionsWrapper);
                    dropdownBtnWrapper.on('keydown', function (e) {
                        e.stopPropagation();
                    });
                },
                generateActionButtons: function () {
                    var $this = this;
                    return [$('<a />', {
                            'href': '#',
                            'class': 'motopress-ce-style-editor-cancel-button',
                            'text': localStorage.getItem('CECancel')
                        }).on('click', function (e) {
                            e.preventDefault();
                            $this.cancel();
                        })];
                },
                generate: function () {
                    var generalAttrs = this.getGeneralAttrs();
                    var propertiesControls = this.generatePropertiesControls(generalAttrs, {});
                    this.form.append(propertiesControls);
                },
                detectForm: function () {
                    this.form = this.propertiesWrapper;
                },
                display: function (isNew) {
                    var defaultState = 'up';
                    this.attachForm();
                    this.highlightState(defaultState);
                    this.rememberSettings();
                    var stateAttrs = this.getStateAttrs(defaultState);
                    this.fillForm(stateAttrs, 'customize');
                    this.resolveDependencies();
                    this.show();
                },
                attachForm: function () {
                    CE.Dialog.myThis.styleEditorContainer.children().detach();
                    CE.Dialog.myThis.styleEditorContainer.html(this.element);
                },
                getState: function () {
                    return this.state;
                },
                setState: function (state) {
                    this.highlightState(state);
                    this.fillForm(this.getStateAttrs(state), false);
                },
                highlightState: function (state) {
                    this.statesWrapper.children('a').removeClass('motopress-ce-style-editor-state-active');
                    this.statesWrapper.children('[data-state="' + state + '"]').addClass('motopress-ce-style-editor-state-active');
                    this.state = state;
                    this.styleEditorCtrl.setStatePreview(state);
                },
                setEditedStyleObj: function (editedStyleObj) {
                    this.editedStyleObj = editedStyleObj;
                },
                rememberSettings: function () {
                    this.loadedAttrs = this.editedStyleObj.getSettings();
                },
                getFormValues: function () {
                    var ctrl, value;
                    var values = {};
                    var $this = this;
                    var generalAttrs = this.getGeneralAttrs();
                    $.each(generalAttrs, function (name, details) {
                        ctrl = $this.getCtrlByName(name);
                        if (!ctrl.isHided()) {
                            value = ctrl.get();
                            value = $this.filterValue(name, value);
                            if (value !== $this.emptyStyleValue) {
                                values[name] = value;
                            }
                        }
                    });
                    if (values.hasOwnProperty('background-image-type') && values['background-image-type'] !== 'none') {
                        if (!values.hasOwnProperty('background-gradient') && !values.hasOwnProperty('background-image')) {
                            delete values['background-image-type'];
                        }
                    }
                    return values;
                },
                getEmptyValues: function () {
                    var generalAttrs = this.getGeneralAttrs();
                    var $this = this;
                    return $.map(generalAttrs, function () {
                        return $this.emptyStyleValue;
                    });
                },
                getCleanFormValues: function (state) {
                    var formValues = this.getFormValues();
                    var inheritValues = this.getInheritValues(state);
                    var originalValues = parent.MP.Utils.getObjectChanges(inheritValues, formValues);
                    var $this = this;
                    $.each(originalValues, function (name, value) {
                        $this.preventLossDependencyValues(name, originalValues, formValues);
                    });
                    return originalValues;
                },
                preventLossDependencyValues: function (name, originalValues, formValues) {
                    var ctrl = this.getCtrlByName(name);
                    if (ctrl.dependency && ctrl.dependency.hasOwnProperty('needDependenceValue') && ctrl.dependency.needDependenceValue && !originalValues.hasOwnProperty(ctrl.dependency.parameter)) {
                        originalValues[ctrl.dependency.parameter] = formValues[ctrl.dependency.parameter];
                        this.preventLossDependencyValues(ctrl.dependency.parameter, originalValues, formValues);
                    }
                },
                filterValue: function (name, value) {
                    switch (name) {
                    case 'padding-top':
                    case 'padding-bottom':
                    case 'padding-left':
                    case 'padding-right':
                    case 'border-top-width':
                    case 'border-bottom-width':
                    case 'border-left-width':
                    case 'border-right-width':
                    case 'border-top-left-radius':
                    case 'border-top-right-radius':
                    case 'border-bottom-left-radius':
                    case 'border-bottom-right-radius':
                        value = value.replace(/[^0-9]/gi, '');
                        break;
                    case 'margin-top':
                    case 'margin-bottom':
                    case 'margin-left':
                    case 'margin-right':
                        value = value.replace(/[^0-9-]/gi, '');
                        break;
                    case 'background-position-x':
                    case 'background-position-y':
                        if (value === null) {
                            value = '';
                        }
                        break;
                    }
                    return value;
                },
                fillForm: function (attrs, event) {
                    var $this = this;
                    var el, ctrl, value, defaultValue;
                    var generalAttrs = this.getGeneralAttrs();
                    $.each(generalAttrs, function (name, props) {
                        el = $this.getParameterElByName(name);
                        ctrl = el.control();
                        defaultValue = generalAttrs[ctrl.name].hasOwnProperty('default') ? generalAttrs[ctrl.name]['default'] : $this.emptyStyleValue;
                        value = attrs.hasOwnProperty(name) ? attrs[name] : defaultValue;
                        ctrl.set(value, defaultValue, false);
                        if (event) {
                            el.trigger(event);
                        }
                    });
                    this.resolveDependencies();
                },
                changeProperty: function (ctrl) {
                    this.save();
                    this.styleEditorCtrl.element.trigger('change');
                },
                save: function () {
                    var state = this.getState();
                    var stateSettings = this.getCleanFormValues(state);
                    this.editedStyleObj.updateState(state, stateSettings);
                },
                getTitle: function () {
                    return '';
                },
                show: function () {
                    CE.Dialog.myThis.setMode('style-editor');
                    this.propertiesWrapper.scrollTop(0);
                },
                hide: function () {
                    CE.Dialog.myThis.setMode('tabs');
                    this.styleEditorCtrl.unsetStatePreview();
                },
                cancel: function () {
                    this.editedStyleObj.update(this.loadedAttrs);
                    this.styleEditorCtrl.element.trigger('change');
                    this.hide();
                },
                confirm: function () {
                    this.styleEditorCtrl.element.trigger('change');
                    this.hide();
                }
            });
        }(jQuery));
        (function ($) {
            CE.StyleEditorControlsForm('CE.PrivateStyleControlsForm', {}, {
                presetStyleObj: null,
                init: function (el, args) {
                    this._super(el, args);
                    this.editedStyleObj = args.editedStyleObj;
                },
                setPresetStyleObj: function (presetStyleObj) {
                    this.presetStyleObj = presetStyleObj;
                },
                generateActionButtons: function () {
                    var $this = this;
                    var inheritBtns = this._super();
                    var btns = [
                        $('<a />', {
                            'href': '#',
                            'class': 'motopress-ce-style-editor-save-button',
                            'text': localStorage.getItem('CESaveAs')    
                        })    .on('click', function (e) {
                            e.preventDefault();
                            $this.saveAsPreset();
                        })    ,
                        $('<a />', {
                            'href': '#',
                            'class': 'motopress-ce-style-editor-clear-button',
                            'text': localStorage.getItem('CEClear')
                        }).on('click', function (e) {
                            e.preventDefault();
                            $this.clear();
                        })
                    ];
                    return $.merge(btns, inheritBtns);
                },
                getGeneralAttrs: function () {
                    return CE.LeftBar.myThis.getPrivateStyleAttrs(this.shortcodeGroup, this.shortcodeName);
                },
                getPrivateStateAttrs: function (state) {
                    return this.editedStyleObj.getStateSettings(state);
                },
                getPresetStateAttrs: function (state) {
                    return this.presetStyleObj !== null ? this.presetStyleObj.getStateSettings(state) : {};
                },
                getStateAttrs: function (state) {
                    if (typeof state === 'undefined') {
                        state = this.getState();
                    }
                    var attrs = {};
                    switch (state) {
                    case 'up':
                        $.extend(attrs, this.getPresetStateAttrs('up'), this.getPrivateStateAttrs('up'));
                        break;
                    case 'hover':
                        $.extend(attrs, this.getPresetStateAttrs('up'), this.getPresetStateAttrs('hover'), this.getPrivateStateAttrs('up'), this.getPrivateStateAttrs('hover'));
                        break;
                    case 'tablet':
                        $.extend(attrs, this.getPresetStateAttrs('up'), this.getPresetStateAttrs('tablet'), this.getPrivateStateAttrs('up'), this.getPrivateStateAttrs('tablet'));
                        break;
                    case 'mobile':
                        $.extend(attrs, this.getPresetStateAttrs('up'), this.getPresetStateAttrs('tablet'), this.getPresetStateAttrs('mobile'), this.getPrivateStateAttrs('up'), this.getPrivateStateAttrs('tablet'), this.getPrivateStateAttrs('mobile'));
                        break;
                    }
                    return attrs;
                },
                resetForm: function () {
                    this.fillForm(this.getStateAttrs(), false);
                    this.styleEditorCtrl.element.trigger('change');
                },
                getInheritValues: function (state) {
                    var inheritValues = {};
                    var emptyValues = this.getEmptyValues();
                    switch (state) {
                    case 'up':
                        $.extend(inheritValues, emptyValues, this.getPresetStateAttrs('up'));
                        break;
                    case 'hover':
                        $.extend(inheritValues, emptyValues, this.getPresetStateAttrs('up'), this.getPresetStateAttrs('hover'), this.getPrivateStateAttrs('up'));
                        break;
                    case 'tablet':
                        $.extend(inheritValues, emptyValues, this.getPresetStateAttrs('up'), this.getPresetStateAttrs('tablet'), this.getPrivateStateAttrs('up'));
                        break;
                    case 'mobile':
                        $.extend(inheritValues, emptyValues, this.getPresetStateAttrs('up'), this.getPresetStateAttrs('tablet'), this.getPresetStateAttrs('mobile'), this.getPrivateStateAttrs('tablet'), this.getPrivateStateAttrs('up'));
                        break;
                    }
                    return inheritValues;
                },
                saveAsPreset: function (el, e) {
                    var $this = this;
                    $.when(CE.StyleEditor.myThis.presetSaveModal.showModal(this.editedStyleObj, this.presetStyleObj)).then(function (presetName) {
                        $this.styleEditorCtrl.selectPreset(presetName);
                        $this.clear();
                        $this.rememberSettings();
                        $this.styleEditorCtrl.refresh();
                        CE.Dialog.myThis.updateTitle();
                    });
                },
                clear: function () {
                    this.editedStyleObj.clear();
                    this.resetForm();
                },
                getTitle: function () {
                    var title = 'Element Style';
                    if (this.presetStyleObj !== null) {
                        title += ' (inherit from ' + this.presetStyleObj.getLabel() + ')';
                    }
                    return title;
                },
                show: function () {
                    this._super();
                },
                hide: function () {
                    this._super();
                }
            });
        }(jQuery));
        (function ($) {
            CE.StyleEditorControlsForm('CE.PresetStyleControlsForm', {}, {
                generateActionButtons: function () {
                    var $this = this;
                    var inheritBtns = this._super();
                    var btns = [
                        $('<a />', {
                            'href': '#',
                            'class': 'motopress-ce-style-editor-rename-button',
                            'text': localStorage.getItem('CERename')
                        }).on('click', function (e) {
                            e.preventDefault();
                            $this.renamePreset();
                        }),
                        $('<a />', {
                            'href': '#',
                            'class': 'motopress-ce-style-editor-delete-button',
                            'text': localStorage.getItem('CEDelete')
                        }).on('click', function (e) {
                            e.preventDefault();
                            $this.deletePreset();
                        })
                    ];
                    return $.merge(btns, inheritBtns);
                },
                getGeneralAttrs: function () {
                    return CE.Style.getStyleEditorProps();
                },
                getAttrs: function () {
                    return this.editedStyleObj.getSettings();
                },
                getStateAttrs: function (state) {
                    var attrs = {};
                    switch (state) {
                    case 'up':
                        $.extend(attrs, this.editedStyleObj.getStateSettings('up'));
                        break;
                    case 'hover':
                        $.extend(attrs, this.editedStyleObj.getStateSettings('up'), this.editedStyleObj.getStateSettings('hover'));
                        break;
                    case 'tablet':
                        $.extend(attrs, this.editedStyleObj.getStateSettings('up'), this.editedStyleObj.getStateSettings('tablet'));
                        break;
                    case 'mobile':
                        $.extend(attrs, this.editedStyleObj.getStateSettings('up'), this.editedStyleObj.getStateSettings('tablet'), this.editedStyleObj.getStateSettings('mobile'));
                        break;
                    }
                    return attrs;
                },
                getInheritValues: function (state) {
                    var inheritValues = {};
                    var emptyValues = this.getEmptyValues();
                    switch (state) {
                    case 'up':
                        $.extend(inheritValues, emptyValues);
                        break;
                    case 'hover':
                        $.extend(inheritValues, emptyValues, this.editedStyleObj.getStateSettings('up'));
                        break;
                    case 'tablet':
                        $.extend(inheritValues, emptyValues, this.editedStyleObj.getStateSettings('up'));
                        break;
                    case 'mobile':
                        $.extend(inheritValues, emptyValues, this.editedStyleObj.getStateSettings('up'), this.editedStyleObj.getStateSettings('tablet'));
                        break;
                    }
                    return inheritValues;
                },
                renamePreset: function (el, e) {
                    var renamePresetPromptText = localStorage.getItem('CERenamePresetPrompt').replace('%presetLabel%', this.editedStyleObj.getLabel());
                    var newLabel = prompt(renamePresetPromptText, this.editedStyleObj.getLabel());
                    if (newLabel !== null) {
                        newLabel = newLabel.trim();
                        if (newLabel !== '') {
                            this.editedStyleObj.updateLabel(newLabel);
                            CE.Dialog.myThis.updateTitle();
                            this.styleEditorCtrl.refresh();
                        } else {
                            parent.MP.Flash.setFlash(localStorage.getItem('CERenamePresetEmptyError'), 'error');
                            parent.MP.Flash.showMessage();
                        }
                    }
                },
                deletePreset: function (el, e) {
                    var deletePresetConfirmText = localStorage.getItem('CEDeletePresetConfirm').replace('%presetLabel%', this.editedStyleObj.getLabel());
                    var isDelete = confirm(deletePresetConfirmText);
                    if (isDelete) {
                        CE.StyleEditor.myThis.deletePreset(this.editedStyleObj.getClassName());
                        this.styleEditorCtrl.refresh();
                        this.hide();
                    }
                },
                getTitle: function () {
                    var title = 'Preset "' + this.editedStyleObj.getLabel() + '"';
                    return title;
                }
            });
        }(jQuery));
        (function ($) {
            CE.ControlsForm('CE.ControlsSubForm', {}, {
                parentPropertyCtrl: null,
                init: function (el, args) {
                    this.parentPropertyCtrl = args.parentPropertyCtrl;
                    this._super(el, args);
                },
                getGeneralAttrs: function () {
                    return this.parentPropertyCtrl.getParameters();
                },
                getAttrs: function () {
                    return {};
                },
                save: function () {
                    this.parentPropertyCtrl.element.trigger('change');
                },
                display: function (isNew) {
                    var $this = this;
                    var generalAttrs = this.getGeneralAttrs();
                    var el;
                    $.each(generalAttrs, function (name, props) {
                        el = $this.getParameterElByName(name);
                        el.trigger('customize');
                    });
                },
                changeProperty: function (ctrl) {
                    this.save();
                },
                set: function (formData) {
                    var generalAttrs = this.getGeneralAttrs();
                    var ctrl, value;
                    var $this = this;
                    $.each(generalAttrs, function (name, details) {
                        ctrl = $this.getCtrlByName(name);
                        value = formData.hasOwnProperty(name) ? formData[name] : '';
                        ctrl.set(value);
                    });
                    this.resolveDependencies();
                },
                get: function () {
                    var ctrl, value;
                    var values = {};
                    var $this = this;
                    var generalAttrs = this.getGeneralAttrs();
                    $.each(generalAttrs, function (name, details) {
                        ctrl = $this.getCtrlByName(name);
                        if (!ctrl.isHided()) {
                            value = ctrl.get();
                            values[name] = value;
                        }
                    });
                    return values;
                }
            });
        }(jQuery));
        (function ($) {
            CE.Shortcode('CE.Controls', {}, {
                settingsForms: null,
                styleForms: null,
                settingsCtrl: null,
                stylesCtrl: null,
                isNew: false,
                init: function (el, args) {
                    this._super(el, args);
                    this.isNew = args.isNew;
                    this.settingsForms = $('<div />', { 'class': 'motopress-settings-forms' });
                    this.settingsCtrl = new CE.SettingsControlsForm(this.settingsForms, { 'formsMainCtrl': this });
                    this.styleForms = $('<div />', { 'class': 'motopress-style-forms' });
                    this.stylesCtrl = new CE.StyleControlsForm(this.styleForms, { 'formsMainCtrl': this });
                },
                render: function (flag) {
                    if (!this.isGrid) {
                        if (flag || typeof flag === 'undefined') {
                            CE.Resizer.myThis.updateBottomInHandleMiddle();
                            CE.Resizer.myThis.updateHandle();
                            CE.Resizer.myThis.updateHandleMiddle();
                        }
                        CE.Resizer.myThis.updateSplitterHeight(this.element, 'render');
                        this.shortcode.find('a').attr('tabindex', -1);
                    }
                },
                renderShortcode: function (status) {
                    if (!this.isGrid) {
                        switch (typeof status) {
                        case 'undefined':
                            status = 'updated';
                            break;
                        case 'boolean':
                            if (status) {
                                status = 'created';
                            } else {
                                status = 'updated';
                            }
                            break;
                        }
                        var $this = this;
                        var handle = this.element.closest('.motopress-clmn').find('.' + CE.DragDrop.myThis.helper.attr('class')).first().children('.' + CE.DragDrop.myThis.dragHandle.attr('class'));
                        handle.addClass(CE.Shortcode.preloaderClass);
                        var closeType = this.element.attr('data-motopress-close-type');
                        var wrapRender = typeof this.element.attr('data-motopress-wrap-render') !== 'undefined' ? this.element.attr('data-motopress-wrap-render') : null;
                        var parameters = typeof this.element.attr('data-motopress-parameters') !== 'undefined' ? this.element.attr('data-motopress-parameters') : null;
                        var styles = typeof this.element.attr('data-motopress-styles') !== 'undefined' ? this.element.attr('data-motopress-styles') : null;
                        if (status === 'created' && parameters)
                            parameters = this.settingsCtrl.setDefaultAttrs(parameters);
                        if (status === 'created' && styles)
                            styles = this.stylesCtrl.setDefaultAttrs(styles);
                        var content = typeof this.element.attr('data-motopress-content') !== 'undefined' ? this.element.attr('data-motopress-content').replace(/\[\]/g, '[') : null;
                        if (typeof this.element.attr('data-motopress-active-item') !== 'undefined') {
                            var JSONParameters = $.parseJSON(parameters);
                            JSONParameters[this.activeParameter] = { value: this.element.attr('data-motopress-active-item') };
                            parameters = JSON.stringify(JSONParameters);
                        }
                        $.ajax({
                            url: parent.motopress.ajaxUrl,
                            type: 'POST',
                            dataType: 'html',
                            data: {
                                action: 'motopress_ce_render_shortcode',
                                nonce: parent.motopressCE.nonces.motopress_ce_render_shortcode,
                                postID: parent.motopressCE.postID,
                                closeType: closeType,
                                shortcode: $this.shortcodeName,
                                wrapRender: wrapRender,
                                parameters: parameters,
                                styles: styles,
                                content: content
                            },
                            success: function (dirtyData) {
                                var privateStyles = $(dirtyData).find('.motopress-ce-private-styles-updates-wrapper').andSelf().filter('.motopress-ce-private-styles-updates-wrapper').children('style');
                                CE.ShortcodePrivateStyle.addRenderedStyleTags(privateStyles);
                                var data = $(dirtyData).find('.motopress-ce-rendered-content-wrapper').andSelf().filter('.motopress-ce-rendered-content-wrapper').children();
                                var span = $this.element.closest('.motopress-clmn');
                                if (!span.closest('.motopress-row').parent('.motopress-content-wrapper').length) {
                                    var handleMiddleLast = span.closest('.motopress-row').nextAll('.motopress-handle-middle-in:last');
                                    var minHeight = parseInt(handleMiddleLast.css('min-height'));
                                    handleMiddleLast.height(minHeight);
                                }
                                $('.motopress-content-wrapper > .motopress-handle-middle-in:last').height('');
                                $this.element.html(data);
                                $this.child = CE.Shortcode.getChild($this.shortcode);
                                var images = $this.shortcode.find('img');
                                var imgCount = images.length, count = 0;
                                if (imgCount) {
                                    images.on('load', function () {
                                        count++;
                                        if (count === imgCount)
                                            $this.element.trigger('render');
                                    });
                                }
                                var parameters = CE.LeftBar.myThis.getParametersAttrs($this.group, $this.shortcodeName), childParams, groupControl;
                                if ($this.groupItemName) {
                                    groupControl = $this.settingsForms.find('.motopress-property-group').control();
                                    childParams = parameters[$this.groupItemName];
                                    if (status === 'created') {
                                        if (childParams.hasOwnProperty('items') && childParams.items.hasOwnProperty('count') && childParams.items.count > 0) {
                                            $this.settingsForms.find('> [data-motopress-parameter="' + $this.groupItemName + '"] > .motopress-property-group > .motopress-property-button-wrapper > .motopress-property-button-default').trigger('click', childParams.items.count);
                                        }
                                        if (groupControl.dependency) {
                                            $this.settingsForms.find('[data-motopress-parameter="' + groupControl.dependency.parameter + '"] .motopress-controls').trigger('change', false);
                                        }
                                    }
                                    groupControl.reassignShortcodes();
                                }
                                if (status === 'duplicated' || status === 'created') {
                                    $('body').trigger('MPCEObjectCreated', [
                                        $this.element,
                                        $this.shortcodeName
                                    ]);
                                } else {
                                    $('body').trigger('MPCEObjectUpdated', [
                                        $this.element,
                                        $this.shortcodeName
                                    ]);
                                }
                                $this.element.trigger('render');
                                handle.removeClass(CE.Shortcode.preloaderClass);
                                parent.CE.Save.changeContent();
                                if ($this.groupItemName) {
                                    if (groupControl.accordion.hasClass('ui-accordion')) {
                                        var activeIndex = groupControl.accordion.accordion('option', 'active');
                                        groupControl.interact('activate', activeIndex);
                                    }
                                }
                            },
                            error: function (jqXHR) {
                                var error = $.parseJSON(jqXHR.responseText);
                                if (error.debug) {
                                    console.log(error.message);
                                } else {
                                    parent.MP.Flash.setFlash(error.message, 'error');
                                    parent.MP.Flash.showMessage();
                                }
                                handle.removeClass(CE.Shortcode.preloaderClass);
                            }
                        });
                    }
                },
                display: function (isNew) {
                    this.settingsCtrl.display(isNew);
                    this.stylesCtrl.display(isNew);
                }
            });
        }(jQuery));
        (function ($) {
            CE.Controls('CE.InlineEditor', {
                curElement: null,
                styleFormats: false,
                init: function () {
                    $(document).on('mousedown', '.mce-tinymce.mce-panel', function (event) {
                        event.preventDefault();
                    });
                    $(document).on('keydown', '[data-motopress-shortcode="mp_text"], [data-motopress-shortcode="mp_heading"]', function (e) {
                        if (e.which === $.ui.keyCode.TAB) {
                            CE.Selectable.myThis.unselect();
                        } else if (e.which === $.ui.keyCode.ESCAPE) {
                            if (CE.InlineEditor.curElement)
                                CE.InlineEditor.curElement.control().close(true, 'show');
                            var handle = $(this).closest('.motopress-clmn').find('.' + CE.DragDrop.myThis.helper.attr('class')).first().children('.' + CE.DragDrop.myThis.dragHandle.attr('class'));
                            CE.Selectable.focusWithoutScroll(handle.prev());
                            if (!CE.Dialog.myThis.element.dialog('isOpen')) {
                                CE.Dialog.myThis.open(handle);
                            }
                        }
                    });
                    $(parent.document).on('mousedown', function (e) {
                        if (CE.InlineEditor.curElement && !$(e.target).closest('.ui-dialog').length) {
                            CE.InlineEditor.curElement.control().close(true, 'show');
                        }
                    });
                },
                isTinymce: function (e) {
                    var isTinymce = false;
                    if (!$(e.target).hasClass('motopress-drag-handle')) {
                        var clickedEl = $(e.currentTarget.activeElement);
                        if (clickedEl.length && (clickedEl.closest('[data-motopress-shortcode]').length || clickedEl.closest('.mce-tinymce').length || clickedEl.closest('.mce-window').length || clickedEl.closest('.mce-popover').length)) {
                            isTinymce = true;
                        }
                    }
                    return isTinymce;
                },
                destroyAll: function () {
                    var ctrl;
                    parent.CE.Iframe.myThis.sceneContent.find('[data-motopress-shortcode="mp_text"], [data-motopress-shortcode="mp_heading"]').each(function () {
                        ctrl = $(this).control();
                        ctrl.destroyEditor();
                    });
                },
                reinitAll: function () {
                    var ctrl;
                    parent.CE.Iframe.myThis.sceneContent.find('[data-motopress-shortcode="mp_text"], [data-motopress-shortcode="mp_heading"]').each(function () {
                        ctrl = $(this).control();
                        ctrl.initEditor();
                    });
                }
            }, {
                id: null,
                isOpen: false,
                editor: null,
                helpers: null,
                blockContent: null,
                floatpanel: null,
                saved: false,
                init: function (el, args) {
                    this._super(el, args);
                    this.id = parent.MP.Utils.uniqid();
                    this.blockContent = this.element.parent('.' + CE.DragDrop.myThis.blockContent.attr('class'));
                    var helperContainer = this.element.closest('.motopress-clmn').find('.' + CE.DragDrop.myThis.helper.attr('class')).first();
                    this.helpers = helperContainer.add(helperContainer.children().not('.motopress-splitter, .motopress-clmn-select-handle'));
                    this.resizers = this.blockContent.nextAll('.ui-resizable-handle');
                    var handle = helperContainer.children('.' + CE.DragDrop.myThis.dragHandle.attr('class'));
                    handle.on('click', this.proxy('onClick'));
                },
                destroy: function () {
                    CE.InlineEditor.curElement = null;
                    if (this.floatpanel)
                        this.floatpanel.remove();
                    this._super();
                },
                initEditor: function () {
                    var $this = this;
                    var handle = this.element.closest('.motopress-clmn').find('.' + CE.DragDrop.myThis.helper.attr('class')).first().children('.' + CE.DragDrop.myThis.dragHandle.attr('class'));
                    var tinymceTimer = setTimeout(function () {
                        var toolbar = 'bold italic underline | ';
                        if (!$.isEmptyObject(CE.InlineEditor.styleFormats)) {
                            toolbar += 'styleselect | ';
                        }
                        toolbar += 'formatselect | fontsizeselect forecolor | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | link unlink hr removeformat';
                        tinyMCE.init({
                            selector: '#' + $this.id,
                            inline: true,
                            plugins: 'link hr textcolor',
                            visual: false,
                            convert_urls: false,
                            menubar: false,
                            toolbar: toolbar,
                            fontsize_formats: '8px 9px 10px 11px 12px 13px 14px 15px 16px 18px 24px 30px 36px 42px 48px 60px 72px 96px',
                            language: parent.MP.Settings.lang.tinymce,
                            skin: 'motopresscontenteditor',
                            browser_spellcheck: parent.MP.Settings.spellcheck,
                            style_formats_merge: false,
                            style_formats: CE.InlineEditor.styleFormats,
                            setup: function (editor) {
                                $this.editor = editor;
                                editor.on('loadContent', function () {
                                    $this.autoOpen(handle, 1);
                                });
                                editor.on('execCommand', function (e) {
                                    switch (e.command) {
                                    case 'mceToggleEditor':
                                        if (!$this.floatpanel) {
                                            var floatpanel = $('body').children('.mce-floatpanel:last');
                                            if (floatpanel.length) {
                                                $this.floatpanel = floatpanel;
                                                if (floatpanel.height() > 50) {
                                                    var fixedWidth = 723;
                                                    var fixedHeight = floatpanel.find('.mce-container-body.mce-flow-layout > [role="toolbar"]:first').outerHeight(true) - 2;
                                                    floatpanel.width(fixedWidth).height(fixedHeight);
                                                    var panel2 = floatpanel.children('.mce-container-body.mce-abs-layout').width(fixedWidth).height(fixedHeight);
                                                    var panel3 = panel2.children('.mce-container.mce-panel').width(fixedWidth).height(fixedHeight);
                                                    panel3.children('.mce-container-body.mce-stack-layout').width(fixedWidth).height(fixedHeight);
                                                }
                                            }
                                        }
                                        var floatpanelPos = $this.floatpanel.offset().left + $this.floatpanel.width();
                                        if (floatpanelPos > $(window).width()) {
                                            var left = $this.element.offset().left + $this.element.width() - $this.floatpanel.width();
                                            $this.floatpanel.css('left', left);
                                        }
                                        break;    
                                    }
                                });
                            },
                            init_instance_callback: function (editor) {
                                var menu = editor.menuItems.formats.menu;
                                $.each(menu, function (key1, val1) {
                                    if (val1.text === 'Blocks') {
                                        $.each(val1.menu, function (key2, val2) {
                                            if (val2.text === 'Div')
                                                delete val1.menu[key2];
                                        });
                                    }
                                });
                                $(editor.getBody()).on('blur', function () {
                                    $this.save();
                                });
                                $(editor.getBody()).on('focus', function () {
                                    $this.saved = false;
                                    if (handle.hasClass(CE.Selectable.myThis.selectedClass)) {
                                        handle.trigger('click');
                                    } else {
                                        var t = setTimeout(function () {
                                            CE.LeftBar.myThis.leftBar.focus();
                                            clearTimeout(t);
                                        }, 0);    
                                    }
                                });
                            }
                        });
                        clearTimeout(tinymceTimer);
                    }, 0);
                },
                destroyEditor: function () {
                    this.editor.destroy();
                    this.editor = null;
                },
                ' render': function () {
                    var editorArea = this.shortcode.children('div');
                    editorArea.attr('id', this.id);
                    this.initEditor();
                },
                onClick: function (e) {
                    if ($(e.target).hasClass(CE.Selectable.myThis.selectedClass) && !this.isOpen) {
                        this.isOpen = true;
                        CE.InlineEditor.curElement = this.element;
                        if (CE.Dialog.myThis.element.dialog('isOpen')) {
                            CE.Dialog.myThis.element.dialog('close');
                        }
                        this.helpers.hide();
                        $('.motopress-content-wrapper > .motopress-handle-middle-in:last').height('');
                        this.resizers.hide();
                        this.blockContent.addClass('motopress-overflow-visible-important');
                        this.editor.execCommand('mceToggleEditor', false);
                        this.showHideFloatpanel('show');
                    }
                },
                close: function (resizerFlag, mode) {
                    if (this.isOpen) {
                        this.isOpen = false;
                        this.save();
                        this.helpers.show();
                        if (typeof resizerFlag !== 'undefined') {
                            if (mode === 'show') {
                                this.resizers.show();
                            } else if (mode === 'hide') {
                                this.resizers.hide();
                            }
                        }
                        this.showHideFloatpanel('hide');
                        this.blockContent.removeClass('motopress-overflow-visible-important');
                        CE.Resizer.myThis.updateHandle();
                        parent.CE.Save.changeContent();
                    }
                },
                save: function () {
                    if (!this.saved) {
                        this.shortcode.attr('data-motopress-content', this.editor.getContent({ format: 'html' }));
                        this.saved = true;
                        CE.Resizer.myThis.updateBottomInHandleMiddle();
                        CE.Resizer.myThis.updateSplitterHeight(this.element, 'split');
                        CE.Resizer.myThis.updateHandleMiddle();
                    }
                },
                autoOpen: function (handle, count) {
                    if (count <= 3) {
                        if (count > 1 && handle.hasClass(CE.Selectable.myThis.selectedClass)) {
                            if (CE.Dialog.myThis.element.dialog('isOpen')) {
                                CE.Dialog.myThis.element.dialog('close');
                            }
                            $(this.editor.getBody()).trigger('blur').trigger('focus');
                            handle.trigger('click');
                        } else {
                            var $this = this;
                            var tId = setTimeout(function () {
                                $this.autoOpen(handle, count + 1);
                                clearTimeout(tId);
                            }, 500);
                        }
                    }
                },
                showHideFloatpanel: function (mode) {
                    if (this.floatpanel) {
                        mode === 'show' ? this.floatpanel.show() : this.floatpanel.hide();
                    }
                }
            });
        }(jQuery));
        (function ($) {
            CE.Controls('CE.CodeEditor', {}, 
            {
                init: function (el, args) {
                    this._super(el, args);
                    var handle = this.element.closest('.motopress-clmn').find('.' + CE.DragDrop.myThis.helper.attr('class')).first().children('.' + CE.DragDrop.myThis.dragHandle.attr('class'));
                    this.autoOpen(handle, 1);
                    handle.on('click', this.proxy('onClick'));
                },
                destroy: function () {
                    this._super();
                },
                ' render': function () {
                    this.shortcode.find('.row').removeClass('row').addClass(parent.CE.Iframe.myThis.gridObj.row.class);
                    this.shortcode.find('a').attr('tabindex', -1);
                    CE.Resizer.myThis.updateAllHandles();
                },
                autoOpen: function (handle, count) {
                    if (count <= 3) {
                        if (count > 1 && handle.hasClass(CE.Selectable.myThis.selectedClass)) {
                            handle.trigger('click');
                        } else {
                            var $this = this;
                            var tId = setTimeout(function () {
                                $this.autoOpen(handle, count + 1);
                                clearTimeout(tId);
                            }, 500);
                        }
                    }
                },
                onClick: function (e) {
                    if ($(e.target).hasClass(CE.Selectable.myThis.selectedClass)) {
                        var editor = parent.CE.CodeModal.myThis.editor;
                        parent.CE.CodeModal.currentShortcode = this.element;
                        var content = this.shortcode.attr('data-motopress-content');
                        if (typeof content !== 'undefined') {
                            var expr = new RegExp('\\[\\]', 'ig');
                            content = content.replace(expr, '[');
                            if (editor !== null)
                                editor.setContent(content, { format: 'html' });
                            parent.CE.CodeModal.myThis.content.val(parent.switchEditors._wp_Nop(content));
                        }
                        parent.CE.CodeModal.myThis.saveHandler = this.saveHandler;
                        parent.CE.CodeModal.myThis.element.mpmodal('show');
                    }
                },
                saveHandler: function (e) {
                    var $this = parent.CE.CodeModal.myThis;
                    $this.switchVisual();
                    var controller = parent.CE.CodeModal.currentShortcode.control();
                    var content = $this.editor !== null ? $this.editor.getContent({ format: 'html' }) : parent.switchEditors._wp_Autop($this.content.val());
                    if (content.length) {
                        controller.shortcode.attr('data-motopress-content', content);
                    } else {
                        controller.shortcode.removeAttr('data-motopress-content');
                    }
                    controller.renderShortcode();
                    $this.element.mpmodal('hide');
                }
            });
        }(jQuery));
        (function ($) {
            CE.Tools = can.Construct(
            { myThis: null }, 
            {
                init: function () {
                    CE.Tools.myThis = this;
                },
                removeBlock: function () {
                    CE.Utils.removeSceneAction('select');
                    var spanRemovable = $('.motopress-selected').closest('.motopress-clmn');
                    var rowFrom = spanRemovable.closest('.motopress-row');
                    CE.Selectable.setScrollY(window.scrollY);
                    if (CE.Dialog.myThis.element.dialog('isOpen'))
                        CE.Dialog.myThis.element.dialog('close');
                    parent.CE.Navbar.myThis.hideObjectControlBtns();
                    var blockSiblings = spanRemovable.siblings('.motopress-clmn');
                    var spanClassRemovable = parent.MP.Utils.getSpanClass(spanRemovable.prop('class').split(' '));
                    spanClassRemovable = CE.DragDrop.myThis.removeEmptyBlocks(spanRemovable, spanClassRemovable);
                    var fromPos = rowFrom.children('.motopress-clmn').index(spanRemovable);
                    var newSizes = CE.DragDrop.myThis.canBeMoved(rowFrom, null, fromPos);
                    if (spanRemovable.hasClass('ce_inline_editor')) {
                        var ctrl = spanRemovable.control();
                        var id = ctrl.child.attr('id');
                        if (typeof id !== 'undefined') {
                            var editor = tinymce.get(id);
                            if (typeof editor !== 'undefined') {
                                editor.destroy();
                            }
                        }
                    }
                    spanRemovable.remove();
                    var resObj = CE.DragDrop.myThis.clearIfEmpty(rowFrom, 'remove');
                    var isUnwrapped = false;
                    if (resObj && resObj.hasOwnProperty('row')) {
                        isUnwrapped = true;
                        rowFrom = resObj.row;
                    }
                    if (CE.DragDrop.myThis.isEmptyScene()) {
                        $('.motopress-handle-middle-in').remove();
                        CE.DragDrop.myThis.emptySceneHelper.show();
                        CE.Utils.addSceneState('empty-scene');
                    }
                    if (!isUnwrapped)
                        CE.DragDrop.myThis.resize(rowFrom, spanRemovable, 'remove', newSizes);
                    CE.Resizer.myThis.updateSplittableOptions(null, rowFrom, null);
                    CE.Resizer.myThis.updateAllHandles();
                    $(window).trigger('resize');
                    var shortcodes, shortcodeName, apiParams = {};
                    apiParams.involvedElements = {};
                    if (blockSiblings.length) {
                        shortcodes = blockSiblings.find('.motopress-block-content > [data-motopress-shortcode]');
                        if (shortcodes.length) {
                            shortcodes.each(function () {
                                shortcodeName = $(this).attr('data-motopress-shortcode');
                                if (!apiParams.involvedElements.hasOwnProperty(shortcodeName))
                                    apiParams.involvedElements[shortcodeName] = [];
                                apiParams.involvedElements[shortcodeName].push(this);
                            });
                        }
                    }
                    $('body').trigger('MPCEObjectRemove', apiParams);
                },
                cloneShortcodes: function (el) {
                    var src = '';
                    if (el.hasClass('motopress-row')) {
                    } else if (el.hasClass('motopress-clmn')) {
                    } else {
                        src = parent.CE.Save.getShortcode(src, el);
                    }
                    var shortcodeRenderDefer = $.Deferred();
                    $.ajax({
                        url: parent.motopress.ajaxUrl,
                        type: 'POST',
                        dataType: 'html',
                        data: {
                            action: 'motopress_ce_render_shortcodes_string',
                            nonce: parent.motopressCE.nonces.motopress_ce_render_shortcodes_string,
                            postID: parent.motopressCE.postID,
                            content: src
                        },
                        success: function (data) {
                            shortcodeRenderDefer.resolve(data);
                        },
                        error: function (jqXHR) {
                            var error = $.parseJSON(jqXHR.responseText);
                            shortcodeRenderDefer.reject(error);
                            if (error.debug) {
                                console.log(error.message);
                            } else {
                                parent.MP.Flash.setFlash(error.message, 'error');
                                parent.MP.Flash.showMessage();
                            }
                        }
                    });
                    return shortcodeRenderDefer.promise();
                }    
,
                duplicateBlock: function () {
                    var spanDuplicatable = $('.motopress-selected').closest('.motopress-clmn');
                    CE.Selectable.myThis.unselect();
                    var rowFrom = spanDuplicatable.closest('.motopress-row');
                    var rowFromEdge = parent.MP.Utils.getEdgeRow(rowFrom);
                    var insertPos = rowFromEdge.children('.motopress-clmn').index(spanDuplicatable);
                    var newSizes;
                    var isNewSpan = true;
                    var isNewBlock = false;
                    var spanClone = parent.MP.Utils.detectSpanNestingLvl(spanDuplicatable) === 1 ? CE.DragDrop.myThis.spanHtml.clone() : CE.DragDrop.myThis.spanInnerHtml.clone();
                    var shortcodeClonePrototype = spanDuplicatable.children('.motopress-block-content').children('[data-motopress-shortcode]').clone();
                    var shortcodeStyleAttrsJSON = shortcodeClonePrototype.attr('data-motopress-styles');
                    var shortcodeStyleAttrs = $.parseJSON(shortcodeStyleAttrsJSON);
                    if (shortcodeStyleAttrs.hasOwnProperty('mp_custom_style') && shortcodeStyleAttrs.mp_custom_style.hasOwnProperty('value')) {
                        shortcodeStyleAttrs.mp_custom_style.value = CE.StyleEditor.myThis.changePrivateClassToDuplicated(shortcodeStyleAttrs.mp_custom_style.value);
                        shortcodeStyleAttrsJSON = JSON.stringify(shortcodeStyleAttrs);
                        shortcodeClonePrototype.attr('data-motopress-styles', shortcodeStyleAttrsJSON);
                    }
                    if (shortcodeClonePrototype.attr('data-motopress-shortcode') === 'mp_space') {
                        spanClone.addClass(CE.DragDrop.myThis.spaceClass);
                        var spaceHeight = spanDuplicatable.css('min-height');
                        spanClone.css({ 'min-height': spaceHeight });
                    }
                    CE.DragDrop.myThis._setAttrs(spanClone);
                    CE.DragDrop.myThis.makeEditable(spanClone, null, isNewSpan);
                    spanClone.find('.motopress-filler-content').replaceWith(shortcodeClonePrototype);
                    CE.DragDrop.myThis.initShortcodeController(shortcodeClonePrototype, isNewBlock);
                    var ctrl = shortcodeClonePrototype.control(CE.Controls);
                    ctrl.renderShortcode('duplicated');
                    if (newSizes = CE.DragDrop.myThis.canBeMoved(null, rowFrom, null, insertPos, null, 'out', null, true)) {
                        rowTo = spanDuplicatable.closest('.motopress-row');
                        spanDuplicatable.after(spanClone);
                        CE.DragDrop.myThis.resize(rowFrom, spanClone, 'right-out', newSizes);
                    } else {
                        CE.DragDrop.interruptInsert = false;
                        CE.Resizer.myThis.changeSpanClass(spanClone, parent.CE.Iframe.myThis.gridObj.span.fullclass);
                        var rowTo = parent.MP.Utils.detectRowNestingLvl(rowFrom) ? CE.DragDrop.myThis.rowHtml.clone() : CE.DragDrop.myThis.rowInnerHtml.clone();
                        rowTo.find('.motopress-filler-content').replaceWith(spanClone);
                        rowFrom.next('.motopress-handle-middle-in').after(rowTo);
                        CE.DragDrop.myThis.makeRowEditable(rowTo, true);
                        var t = setTimeout(function () {
                            CE.DragDrop.myThis.addHandleMiddle(rowTo);
                            CE.DragDrop.myThis.resize(rowFrom, spanClone, 'middle');
                            clearTimeout(t);
                        }, 0);
                    }
                    var duplicateTimeout = setTimeout(function () {
                        CE.Selectable.myThis.select(spanClone.children('.motopress-helper').children('.motopress-drag-handle'));
                        CE.DragDrop.myThis.makeDroppable();
                        CE.Resizer.myThis.updateSplittableOptions(spanClone, rowFrom, rowTo);
                        CE.Resizer.myThis.updateAllHandles();
                        $(window).trigger('resize');
                        var shortcodes, shortcodeName, apiParams = {};
                        apiParams.involvedElements = {};
                        apiParams.duplicatedElement = spanClone.children('.motopress-block-content').children('[data-motopress-shortcode]');
                        var spanCloneSiblings = spanClone.siblings('.motopress-clmn');
                        if (spanCloneSiblings.length) {
                            shortcodes = spanCloneSiblings.find('.motopress-block-content > [data-motopress-shortcode]');
                            if (shortcodes.length) {
                                shortcodes.each(function () {
                                    shortcodeName = $(this).attr('data-motopress-shortcode');
                                    if (!apiParams.involvedElements.hasOwnProperty(shortcodeName))
                                        apiParams.involvedElements[shortcodeName] = [];
                                    apiParams.involvedElements[shortcodeName].push(this);
                                });
                            }
                        }
                        $('body').trigger('MPCEObjectDuplicated', apiParams);
                        clearTimeout(duplicateTimeout);
                    }, 0);
                }    
            });
        }(jQuery));
        (function ($) {
            CE.Resizer = can.Construct(
            { myThis: null }, 
            {
                minHeight: 30,
                minWidth: 8,
                spaceMinHeight: 10,
                gmapMinHeight: 150,
                handle: null,
                addedStyleProperties: [
                    'position',
                    'top',
                    'left',
                    'width',
                    'height',
                    'background-position',
                    'background-repeat'
                ],
                emptySpan: null,
                gridColumnSizeClassesString: '',
                splitter: $('<div />', { 'class': 'motopress-splitter' }),
                oldWidth: null,
                emptySpanNumber: 0,
                resizeWindowTimer: null,
                container: $('#motopress-container'),
                bodyEl: $('body'),
                setup: function () {
                    this.setGridColumnSizeClassesString();
                    this.setEmptySpan();
                },
                init: function () {
                    CE.Resizer.myThis = this;
                    if (CE.Grid.myThis.padding) {
                        this.splitter.css({
                            'width': CE.Grid.myThis.padding * 2,
                            'margin-left': CE.Grid.myThis.padding * 2 * -1
                        });
                    }
                    $(window).on('resize', function (e) {
                        parent.CE.Iframe.myThis.setSceneWidth();
                        if (e.target === this) {
                            CE.Resizer.myThis.proxy('updateHandle');
                        }
                        if (CE.Resizer.myThis.resizeWindowTimer) {
                            clearTimeout(CE.Resizer.myThis.resizeWindowTimer);
                        }
                        CE.Resizer.myThis.resizeWindowTimer = setTimeout(function () {
                            parent.MP.Editor.triggerIfr('Resize');
                        }, 500);
                    });
                    parent.MP.Editor.onIfr('Resize', function (e) {
                        CE.Resizer.myThis.updateAllHandles();
                    });
                },
                setGridColumnSizeClassesString: function () {
                    var gridColumnSizeClasses = [];
                    for (var i = 1; i <= parent.CE.Iframe.myThis.gridObj.row.col; i++) {
                        gridColumnSizeClasses.push(parent.CE.Iframe.myThis.gridObj.span.class + i);
                    }
                    this.gridColumnSizeClassesString = gridColumnSizeClasses.join(' ');
                },
                setEmptySpan: function () {
                    var emptySpan = $(parent.motopressCE.rendered_shortcodes.empty[parent.CE.Iframe.myThis.gridObj.span.shortcode]);
                    CE.DragDrop.setEdgeSpan(emptySpan, true);
                    emptySpan.find('.motopress-filler-content').remove();
                    emptySpan.removeClass(this.gridColumnSizeClassesString);
                    var obj = parent.CE.Iframe.myThis.gridObj.span.shortcode;
                    CE.LeftBar.myThis.setAttrs(emptySpan, CE.LeftBar.myThis.library.mp_grid.id, CE.LeftBar.myThis.library.mp_grid.objects[obj]);
                    this.emptySpan = emptySpan;
                },
                getMinHeight: function (obj) {
                    var shortcode = obj.find('.motopress-block-content > [data-motopress-shortcode]');
                    if (shortcode.length) {
                        var shortcodeName = shortcode.attr('data-motopress-shortcode');
                        if (shortcodeName === 'mp_gmap') {
                            return this.gmapMinHeight;
                        }
                    }
                    return obj.hasClass(CE.DragDrop.myThis.spaceClass) ? this.spaceMinHeight : this.minHeight;
                },
                makeResizable: function (obj) {
                    var $this = this;
                    obj.not('[data-motopress-wrapper-id], .motopress-empty').each(function () {
                        var shortcode = $(this).find('.motopress-block-content > [data-motopress-shortcode]'), shortcodeName = shortcode.length ? shortcode.attr('data-motopress-shortcode') : null, handleClass;
                        $(this).resizable({
                            grid: [
                                1,
                                10
                            ],
                            handles: 'e, s, w, se, sw',
                            helper: 'motopress-resizer-helper',
                            minWidth: 2,
                            minHeight: CE.Resizer.myThis.getMinHeight($(this)),
                            zIndex: 1002,
                            create: function () {
                                $(this).resizable('option', 'maxWidth', parseFloat($(this).css('width')));
                                $(this).children('.ui-resizable-handle').hide();
                                var offset = CE.Grid.myThis.padding - 4;
                                $(this).children('.ui-resizable-e, .ui-resizable-se').css('right', offset);
                                $(this).children('.ui-resizable-w, .ui-resizable-sw').css('left', offset);
                            },
                            start: function (e, ui) {
                                CE.Utils.addSceneAction('resize');
                                CE.LeftBar.myThis.disable();
                                CE.LeftBar.myThis.hide();
                                $this.hideSplitters();
                                $this.hideEmptySpans();
                                $('.motopress-content-wrapper > .motopress-handle-middle-in:last').height('');
                                $(this).find('.motopress-handle-bottom-in').css({
                                    bottom: '',
                                    height: ''
                                });
                                if (CE.Dialog.myThis.element.dialog('isOpen'))
                                    CE.Dialog.myThis.element.dialog('close');
                                CE.Resizer.myThis.handle = $(e.originalEvent.target);
                                $this.oldWidth = parseFloat(ui.element.css('width'));
                                handleClass = parent.MP.Utils.getHandleClass(CE.Resizer.myThis.handle.prop('class').split(' '));
                                var empty = null, emptySpanWidth = 0;
                                if (handleClass === 'ui-resizable-e' || handleClass === 'ui-resizable-se') {
                                    empty = ui.element.next('.motopress-empty');
                                } else {
                                    empty = ui.element.prev('.motopress-empty');
                                }
                                var spanClass = parent.MP.Utils.getSpanClass(ui.element.prop('class').split(' '));
                                var spanNumber = parent.MP.Utils.getSpanNumber(spanClass);
                                $this.oldSpanNumber = spanNumber;
                                var emptySpanNumber = 0;
                                if (empty && empty.length) {
                                    var emptySpanClass = parent.MP.Utils.getSpanClass(empty.prop('class').split(' '));
                                    emptySpanNumber = parent.MP.Utils.getSpanNumber(emptySpanClass);
                                }
                                var maxSpanNumber = spanNumber + emptySpanNumber;
                                CE.Resizer.myThis.maxSpanNumber = maxSpanNumber;
                                var rowWidthPiece = $(this).parent('.motopress-row-edge').width() / 100;
                                var maxColWidthPct = CE.Grid.myThis.colWidthByNumber[maxSpanNumber];
                                var maxColWidth = rowWidthPiece * maxColWidthPct;
                                ui.element.resizable('option', 'maxWidth', maxColWidth);
                                var snapGird = [];
                                for (var i = 1; i <= maxSpanNumber; i++) {
                                    snapGird[i] = rowWidthPiece * CE.Grid.myThis.colWidthByNumber[i];    
                                }
                                var snapGridMiddle = Math.floor(maxSpanNumber / 2);
                                var isEven = maxSpanNumber % 2 === 0;
                                for (var i = 1; i <= snapGridMiddle; i++) {
                                    if (snapGird[i] - CE.Grid.myThis.padding * 2 < 0) {
                                        snapGird[i] = snapGird[i] * -1;
                                        if (isEven) {
                                            if (i !== snapGridMiddle) {
                                                snapGird[maxSpanNumber - i] = snapGird[maxSpanNumber - i] * -1;
                                            }
                                        } else {
                                            snapGird[maxSpanNumber - i] = snapGird[maxSpanNumber - i] * -1;
                                        }
                                    }
                                }
                                ui.element.data('mp-snap-grid', snapGird);
                                CE.Resizer.myThis.handle.addClass('motopress-resizable-handle-hover');
                                ui.element.css({
                                    'position': 'relative',
                                    'top': 0,
                                    'left': 0    
                                });
                                if (!$(this).closest('.motopress-row').parent('.motopress-content-wrapper').length) {
                                    var handleMiddleLast = $(this).closest('.motopress-row').nextAll('.motopress-handle-middle-in:last');
                                    var minHeight = parseInt(handleMiddleLast.css('min-height'));
                                    handleMiddleLast.height(minHeight);
                                }
                                $('body').trigger('MPCEObjectResizeStart', {
                                    'objElement': shortcode,
                                    'objName': shortcodeName,
                                    'handle': handleClass
                                });
                            },
                            stop: function (e, ui) {
                                CE.Utils.removeSceneAction('resize');
                                CE.LeftBar.myThis.enable();
                                CE.LeftBar.myThis.show();
                                $this.showSplitters();
                                $this.showEmptySpans();
                                CE.Resizer.myThis.splitterHandle = false;
                                CE.Resizer.myThis.handle.removeClass('motopress-resizable-handle-hover');
                                var resetAddedStyleProperties = {};
                                for (var i = 0; i < CE.Resizer.myThis.addedStyleProperties.length; i++) {
                                    resetAddedStyleProperties[CE.Resizer.myThis.addedStyleProperties[i]] = '';
                                }
                                ui.element.css(resetAddedStyleProperties);
                                if ($(this).hasClass('ce_controls') && !CE.Dialog.myThis.element.dialog('isOpen')) {
                                    var dragHandle = ui.element.find('.motopress-drag-handle');
                                    CE.Dialog.myThis.open(dragHandle);
                                }
                                var prevEmptySpan = ui.element.prev('.motopress-empty');
                                var nextEmptySpan = ui.element.next('.motopress-empty');
                                CE.DragDrop.myThis.makeEditableEmptySpan(prevEmptySpan.add(nextEmptySpan));
                                $this.updateSplittableOptions(prevEmptySpan, null, null);
                                $this.updateSplittableOptions(nextEmptySpan, null, null);
                                CE.Resizer.myThis.updateAllHandles();
                                parent.CE.Save.changeContent();
                                $('body').trigger('MPCEObjectResizeStop', {
                                    'objElement': shortcode,
                                    'objName': shortcodeName,
                                    'handle': handleClass
                                });
                            },
                            resize: function (e, ui) {
                                switch (handleClass) {
                                case 'ui-resizable-s':
                                    CE.Resizer.myThis.verticalResize(ui);
                                    break;
                                case 'ui-resizable-w':
                                    CE.Resizer.myThis.horizontalResize(handleClass, ui);
                                    break;
                                case 'ui-resizable-e':
                                    CE.Resizer.myThis.horizontalResize(handleClass, ui);
                                    break;
                                case 'ui-resizable-sw':
                                    CE.Resizer.myThis.verticalResize(ui);
                                    CE.Resizer.myThis.horizontalResize(handleClass, ui);
                                    break;
                                case 'ui-resizable-se':
                                    CE.Resizer.myThis.verticalResize(ui);
                                    CE.Resizer.myThis.horizontalResize(handleClass, ui);
                                    break;
                                }
                                $('body').trigger('MPCEObjectResize', {
                                    'objElement': shortcode,
                                    'objName': shortcodeName,
                                    'handle': handleClass
                                });
                            }
                        });
                        if (shortcode.length) {
                            var resize = shortcode.attr('data-motopress-resize');
                            if (typeof resize === 'undefined') {
                                var groupName = shortcode.attr('data-motopress-group');
                                resize = CE.LeftBar.myThis.library[groupName].objects[shortcodeName].resize;
                            }
                            switch (resize) {
                            case 'none':
                                $(this).children('.ui-resizable-handle').addClass('motopress-hide');
                                break;
                            case 'horizontal':
                                $(this).children('.ui-resizable-handle:not(".ui-resizable-e, .ui-resizable-w")').addClass('motopress-hide');
                                break;
                            case 'vertical':
                                $(this).children('.ui-resizable-handle:not(".ui-resizable-s")').addClass('motopress-hide');
                                break;
                            }
                        }
                    });
                },
                horizontalResize: function (handleClass, ui) {
                    var newSpanWidth = parseFloat(ui.helper.css('width'));
                    ui.element.css({
                        top: 0,
                        left: 0    
                    });
                    if (newSpanWidth === this.oldWidth)
                        return false;
                    var direction1 = newSpanWidth < this.oldWidth ? -1 : 1;
                    var snapGird = ui.element.data('mp-snap-grid');
                    var maxCols = snapGird.length - 1;
                    var half = false;
                    for (var i = 1; i <= maxCols; i++) {
                        if (snapGird[i] <= 0)
                            continue;
                        half = false;
                        if (i === 1) {
                            if (direction1 < 0) {
                                half = snapGird[i];
                            } else {
                                half = Math.abs(snapGird[i + 1]) - Math.abs(snapGird[i]);
                            }
                        } else if (i == maxCols) {
                            half = Math.abs(snapGird[i]) - Math.abs(snapGird[i - 1]);
                        } else {
                            if (direction1 < 0) {
                                half = Math.abs(snapGird[i]) - Math.abs(snapGird[i - 1]);
                            } else {
                                half = Math.abs(snapGird[i + 1]) - Math.abs(snapGird[i]);
                            }
                        }
                        if (!half)
                            continue;
                        half = Math.abs(half) / 2;
                        if (newSpanWidth >= snapGird[i] - half / 2 && newSpanWidth <= snapGird[i] + half) {
                            var diff = i - this.oldSpanNumber;
                            if (diff === 0)
                                continue;
                            var empty = null, direction2;
                            var originalSpanClass = parent.MP.Utils.getSpanClass(ui.element.prop('class').split(' '));
                            CE.Resizer.myThis.changeSpanClass(ui.element, parent.CE.Iframe.myThis.gridObj.span.class + i);
                            if (handleClass === 'ui-resizable-e' || handleClass === 'ui-resizable-se') {
                                direction2 = 'east';
                                empty = ui.element.next('.motopress-empty');
                            } else {
                                direction2 = 'west';
                                empty = ui.element.prev('.motopress-empty');
                            }
                            if (empty && empty.length) {
                                var originalEmptyClass = parent.MP.Utils.getSpanClass(empty.prop('class').split(' '));
                                var originalEmptyNumber = parent.MP.Utils.getSpanNumber(originalEmptyClass);
                                if (diff < originalEmptyNumber)
                                    CE.Resizer.myThis.changeSpanClass(empty, parent.CE.Iframe.myThis.gridObj.span.class + (originalEmptyNumber - diff));
                                else
                                    empty.remove();
                            } else {
                                var emptySpanClone = CE.Resizer.myThis.emptySpan.clone();
                                emptySpanClone.addClass(parent.CE.Iframe.myThis.gridObj.span.class + Math.abs(diff)).addClass('motopress-empty-hide');
                                if (direction2 === 'east')
                                    ui.element.after(emptySpanClone);
                                else
                                    ui.element.before(emptySpanClone);
                            }
                            ui.element.css({ width: '' });
                            this.oldWidth = newSpanWidth;
                            this.oldSpanNumber = i;
                            break;
                        }
                    }
                    return false;
                },
                verticalResize: function (ui) {
                    var minHeight = parseInt(ui.element.css('min-height'));
                    var newSpanHeight = ui.helper.height();
                    if (minHeight === newSpanHeight)
                        ui.element.css('min-height', '');
                    ui.element.css('min-height', newSpanHeight);
                    ui.element.css('height', newSpanHeight);
                },
                getMinChildColumn: function (wrapper) {
                    var minColNumber = CE.Grid.myThis.columnCount;
                    wrapper.find('.motopress-clmn').each(function () {
                        var colNumber = parent.MP.Utils.getSpanNumber(parent.MP.Utils.getSpanClass($(this).prop('class').split(' ')));
                        if (colNumber < minColNumber)
                            minColNumber = colNumber;
                    });
                    return minColNumber;
                },
                isAllowedColSize: function (colNumber, wrapperWidth) {
                    var colWidth = wrapperWidth / 100 * CE.Grid.myThis.colWidthByNumber[colNumber];
                    if (colWidth - CE.Grid.myThis.padding * 2 < 0) {
                        return false;
                    }
                    return true;
                },
                makeSplittable: function (obj) {
                    if (!obj.length)
                        return false;
                    var $this = this;
                    var splitter = obj.hasClass('motopress-splitter') ? obj : obj.find('.motopress-splitter');
                    var oldUIPosLeft, removableBlock, triggerStop;
                    splitter.draggable({
                        axis: 'x',
                        cursor: 'col-resize',
                        grid: [
                            1,
                            0
                        ],
                        helper: 'clone',
                        zIndex: 1,
                        start: function (e, ui) {
                            CE.Utils.addSceneAction('split');
                            ui.helper.hide();
                            $this.hideSplitters($(this));
                            $this.hideEmptySpans();
                            $('.motopress-content-wrapper > .motopress-handle-middle-in:last').height('');
                            oldUIPosLeft = null;
                            triggerStop = false;
                            CE.LeftBar.myThis.disable();
                            CE.LeftBar.myThis.hide();
                            $(this).addClass('motopress-splitter-hover');
                            if (CE.Dialog.myThis.element.dialog('isOpen'))
                                CE.Dialog.myThis.element.dialog('close');
                            var row = ui.helper.closest('.motopress-row');
                            row.find('.motopress-drag-handle').css('cursor', 'col-resize');
                            var rowEdge = parent.MP.Utils.getEdgeRow(row);
                            var rowWidthPiece = rowEdge.width() / 100;
                            var currentBlock = $(this).closest('.motopress-clmn');
                            var nextBlock = currentBlock.prev('.motopress-clmn');
                            var curBlockNumber = parent.MP.Utils.getSpanNumber(parent.MP.Utils.getSpanClass(currentBlock.prop('class').split(' ')));
                            var nextBlockNumber = parent.MP.Utils.getSpanNumber(parent.MP.Utils.getSpanClass(nextBlock.prop('class').split(' ')));
                            var nextBlockLeft = nextBlock.offset().left;
                            if (nextBlock.is('[data-motopress-wrapper-id]')) {
                                var nextBlockMinChildCol = $this.getMinChildColumn(nextBlock);
                            }
                            if (currentBlock.is('[data-motopress-wrapper-id]')) {
                                var curBlockMinChildCol = $this.getMinChildColumn(currentBlock);
                            }
                            var maxSpanNumber = curBlockNumber + nextBlockNumber - 1;
                            var snapGird = [];
                            for (var i = 1; i <= maxSpanNumber; i++) {
                                snapGird[i] = rowWidthPiece * CE.Grid.myThis.colWidthByNumber[i];
                            }
                            var _snapGird = snapGird.slice();
                            var curColWidth, factor, i, j;
                            for (i = 1; i < nextBlockNumber; i++) {
                                if (snapGird[i] - CE.Grid.myThis.padding * 2 < 0) {
                                    snapGird[i] = (nextBlockLeft + snapGird[i]) * -1;
                                } else {
                                    factor = 1;
                                    curColWidth = Math.abs(snapGird[i]);
                                    if (snapGird[i] > 0 && nextBlock.is('[data-motopress-wrapper-id]')) {
                                        if (!$this.isAllowedColSize(nextBlockMinChildCol, curColWidth))
                                            factor = -1;
                                    }
                                    snapGird[i] = (nextBlockLeft + snapGird[i]) * factor;
                                }
                            }
                            j = nextBlockNumber - 1;
                            for (i = curBlockNumber; i >= 1; i--) {
                                j++;
                                if (_snapGird[i] - CE.Grid.myThis.padding * 2 < 0) {
                                    snapGird[j] = (nextBlockLeft + snapGird[j]) * -1;
                                } else {
                                    factor = 1;
                                    curColWidth = _snapGird[i];
                                    if (_snapGird[i] > 0 && currentBlock.is('[data-motopress-wrapper-id]')) {
                                        if (!$this.isAllowedColSize(curBlockMinChildCol, curColWidth))
                                            factor = -1;
                                    }
                                    snapGird[j] = (nextBlockLeft + snapGird[j]) * factor;
                                }
                            }
                            $(this).data('mp-snap-grid', snapGird);
                            $this.currentI = nextBlockNumber;
                            $this.curSplitterArea = '';
                            var shortcodes, shortcodeName, apiParams = {};
                            apiParams.involvedElements = {};
                            if (currentBlock.length) {
                                shortcodes = currentBlock.find('.motopress-block-content > [data-motopress-shortcode]');
                                if (shortcodes.length) {
                                    shortcodes.each(function () {
                                        shortcodeName = $(this).attr('data-motopress-shortcode');
                                        if (!apiParams.involvedElements.hasOwnProperty(shortcodeName))
                                            apiParams.involvedElements[shortcodeName] = [];
                                        apiParams.involvedElements[shortcodeName].push(this);
                                    });
                                }
                            }
                            if (nextBlock.length) {
                                shortcodes = nextBlock.find('.motopress-block-content > [data-motopress-shortcode]');
                                if (shortcodes.length) {
                                    shortcodes.each(function () {
                                        shortcodeName = $(this).attr('data-motopress-shortcode');
                                        if (!apiParams.involvedElements.hasOwnProperty(shortcodeName))
                                            apiParams.involvedElements[shortcodeName] = [];
                                        apiParams.involvedElements[shortcodeName].push(this);
                                    });
                                }
                            }
                            $('body').trigger('MPCEObjectSplitStart', apiParams);
                        },
                        stop: function (e, ui) {
                            CE.Utils.removeSceneAction('split');
                            CE.LeftBar.myThis.enable();
                            CE.LeftBar.myThis.show();
                            $this.showSplitters();
                            $this.showEmptySpans();
                            ui.helper.closest('.motopress-row').find('.motopress-drag-handle').css('cursor', 'move');
                            $(this).removeClass('motopress-splitter-hover');
                            var currentBlock = $(this).closest('.motopress-clmn');
                            var nextBlock = currentBlock.prev('.motopress-clmn');
                            CE.Resizer.myThis.updateSplittableOptions(currentBlock, null, null, 'split');
                            CE.Resizer.myThis.updateAllHandles();
                            if (triggerStop && removableBlock.length)
                                removableBlock.remove();
                            parent.CE.Save.changeContent();
                            var shortcodes, shortcodeName,
                                apiParams = {};
                            apiParams.involvedElements = {};
                            if (currentBlock.length) {
                                shortcodes = currentBlock.find('.motopress-block-content > [data-motopress-shortcode]');
                                if (shortcodes.length) {
                                    shortcodes.each(function () {
                                        shortcodeName = $(this).attr('data-motopress-shortcode');
                                        if (!apiParams.involvedElements.hasOwnProperty(shortcodeName))
                                            apiParams.involvedElements[shortcodeName] = [];
                                        apiParams.involvedElements[shortcodeName].push(this);
                                    });
                                }
                            }
                            if (nextBlock.length) {
                                shortcodes = nextBlock.find('.motopress-block-content > [data-motopress-shortcode]');
                                if (shortcodes.length) {
                                    shortcodes.each(function () {
                                        shortcodeName = $(this).attr('data-motopress-shortcode');
                                        if (!apiParams.involvedElements.hasOwnProperty(shortcodeName))
                                            apiParams.involvedElements[shortcodeName] = [];
                                        apiParams.involvedElements[shortcodeName].push(this);
                                    });
                                }
                            }
                            $('body').trigger('MPCEObjectSplitStop', apiParams);
                        },
                        drag: function (e, ui) {
                            var resizeDone = false;
                            var curUIPosLeft = ui.offset.left - CE.Grid.myThis.padding / 2;
                            if (oldUIPosLeft === null)
                                oldUIPosLeft = curUIPosLeft;
                            if (curUIPosLeft === oldUIPosLeft)
                                return;
                            var currentBlock = $(this).closest('.motopress-clmn');
                            var nextBlock = null;
                            var parentRowWidth = currentBlock.closest('.motopress-row-edge').width();
                            var half1, half2;
                            var snapGird = $(this).data('mp-snap-grid');
                            var maxCols = snapGird.length - 1;
                            if (maxCols > 1) {
                                half1 = Math.abs(snapGird[2]) - Math.abs(snapGird[1]);
                                half2 = Math.abs(snapGird[maxCols]) - Math.abs(snapGird[maxCols - 1]);
                            } else {
                                half1 = half2 = parentRowWidth / 100 * CE.Grid.myThis.colWidthByNumber[1];
                            }
                            if (half1 > CE.Grid.myThis.padding)
                                half1 -= CE.Grid.myThis.padding;
                            if (half1 > CE.Grid.myThis.padding)
                                half1 -= CE.Grid.myThis.padding;
                            if (half2 > CE.Grid.myThis.padding)
                                half2 -= CE.Grid.myThis.padding;
                            var cond1 = e.pageX <= 2 || curUIPosLeft <= Math.abs(snapGird[1]) - half1;
                            var cond2 = e.pageX >= $(document).width() - 2 || curUIPosLeft >= Math.abs(snapGird[maxCols]) + half2 * 1.5;
                            if (cond1 || cond2) {
                                if (cond1 && $this.curSplitterArea === 'left')
                                    return;
                                if (cond2 && $this.curSplitterArea === 'right')
                                    return;
                                nextBlock = currentBlock.prev('.motopress-clmn');
                                var curBlockOldSpan = parent.MP.Utils.getSpanClass(currentBlock.prop('class').split(' '));
                                var nextBlockOldSpan = parent.MP.Utils.getSpanClass(nextBlock.prop('class').split(' '));
                                var curBlockOldNumber = parent.MP.Utils.getSpanNumber(curBlockOldSpan);
                                var nextBlockOldNumber = parent.MP.Utils.getSpanNumber(nextBlockOldSpan);
                                if (cond1) {
                                    $this.curSplitterArea = 'left';
                                    if (nextBlock.hasClass('motopress-empty')) {
                                        CE.Resizer.myThis.changeSpanClass(currentBlock, parent.CE.Iframe.myThis.gridObj.span.class + (curBlockOldNumber + nextBlockOldNumber));
                                        removableBlock = nextBlock;
                                        triggerStop = true;
                                        $(window).trigger('resize');
                                        resizeDone = true;
                                    } else {
                                        var minCol = 0;
                                        for (var i = 1; i <= maxCols; i++) {
                                            if (snapGird[i] > 0) {
                                                minCol = i;
                                                break;
                                            }
                                        }
                                        if (minCol) {
                                            CE.Resizer.myThis.changeSpanClass(currentBlock, parent.CE.Iframe.myThis.gridObj.span.class + (maxCols + 1 - minCol));
                                            CE.Resizer.myThis.changeSpanClass(nextBlock, parent.CE.Iframe.myThis.gridObj.span.class + minCol);
                                            $this.currentI = minCol;
                                            $(window).trigger('resize');
                                            resizeDone = true;
                                        }
                                    }
                                } else {
                                    $this.curSplitterArea = 'right';
                                    if (currentBlock.hasClass('motopress-empty')) {
                                        CE.Resizer.myThis.changeSpanClass(nextBlock, parent.CE.Iframe.myThis.gridObj.span.class + (nextBlockOldNumber + curBlockOldNumber));
                                        removableBlock = currentBlock;
                                        triggerStop = true;
                                        $(window).trigger('resize');
                                        resizeDone = true;
                                    } else {
                                        var maxCol = 0;
                                        for (var i = maxCols; i >= 1; i--) {
                                            if (snapGird[i] > 0) {
                                                maxCol = i;
                                                break;
                                            }
                                        }
                                        if (maxCol) {
                                            CE.Resizer.myThis.changeSpanClass(currentBlock, parent.CE.Iframe.myThis.gridObj.span.class + (maxCols + 1 - maxCol));
                                            CE.Resizer.myThis.changeSpanClass(nextBlock, parent.CE.Iframe.myThis.gridObj.span.class + maxCol);
                                            $this.currentI = maxCol;
                                            $(window).trigger('resize');
                                            resizeDone = true;
                                        }
                                    }
                                }
                            } else {
                                $this.curSplitterArea = 'center';
                                var direction1 = curUIPosLeft < oldUIPosLeft ? -1 : 1;
                                var half = false;
                                for (var i = 1; i <= maxCols; i++) {
                                    if (snapGird[i] <= 0)
                                        continue;
                                    half = false;
                                    if (maxCols > 1) {
                                        if (i === 1) {
                                            half = Math.abs(snapGird[i + 1]) - Math.abs(snapGird[i]);
                                        } else if (i == maxCols) {
                                            half = Math.abs(snapGird[i]) - Math.abs(snapGird[i - 1]);
                                        } else {
                                            if (direction1 < 0) {
                                                half = Math.abs(snapGird[i]) - Math.abs(snapGird[i - 1]);
                                            } else {
                                                half = Math.abs(snapGird[i + 1]) - Math.abs(snapGird[i]);
                                            }
                                        }
                                    } else {
                                        half = parentRowWidth / 100 * CE.Grid.myThis.colWidthByNumber[1];
                                    }
                                    if (!half)
                                        continue;
                                    half = Math.abs(half) / 2;
                                    if (curUIPosLeft >= snapGird[i] - half / 2 && curUIPosLeft <= snapGird[i] + half) {
                                        var diff = i - $this.currentI;
                                        triggerStop = false;
                                        if (diff === 0)
                                            continue;
                                        var empty = null, direction2;
                                        currentBlock = $(this).closest('.motopress-clmn');
                                        nextBlock = currentBlock.prev('.motopress-clmn');
                                        var curBlockOldSpan = parent.MP.Utils.getSpanClass(currentBlock.prop('class').split(' '));
                                        var nextBlockOldSpan = parent.MP.Utils.getSpanClass(nextBlock.prop('class').split(' '));
                                        var nextBlockOldSpan = parent.MP.Utils.getSpanClass(nextBlock.prop('class').split(' '));
                                        var curBlockOldNumber = parent.MP.Utils.getSpanNumber(curBlockOldSpan);
                                        var nextBlockOldNumber = parent.MP.Utils.getSpanNumber(nextBlockOldSpan);
                                        var curBlockNewNumber = curBlockOldNumber - diff;
                                        var nextBlockNewNumber = nextBlockOldNumber + diff;
                                        CE.Resizer.myThis.changeSpanClass(currentBlock, parent.CE.Iframe.myThis.gridObj.span.class + curBlockNewNumber);
                                        CE.Resizer.myThis.changeSpanClass(nextBlock, parent.CE.Iframe.myThis.gridObj.span.class + nextBlockNewNumber);
                                        $this.currentI = i;
                                        $(window).trigger('resize');
                                        resizeDone = true;
                                        break;
                                    }
                                }
                            }
                            if (currentBlock && currentBlock.length) {
                                var top = parseInt(currentBlock.css('margin-top')) + parseInt(currentBlock.css('border-top-width'));
                                var rowHeight = $(this).closest('.motopress-row').height();
                                $(this).css({
                                    top: -top,
                                    height: rowHeight
                                });
                                if (triggerStop)
                                    e.preventDefault();
                            }
                            if (resizeDone) {
                                CE.Resizer.myThis.updateSplitterHeight();
                                var shortcodes, shortcodeName, apiParams = {};
                                apiParams.involvedElements = {};
                                if (currentBlock && currentBlock.length) {
                                    shortcodes = currentBlock.find('.motopress-block-content > [data-motopress-shortcode]');
                                    if (shortcodes.length) {
                                        shortcodes.each(function () {
                                            shortcodeName = $(this).attr('data-motopress-shortcode');
                                            if (!apiParams.involvedElements.hasOwnProperty(shortcodeName))
                                                apiParams.involvedElements[shortcodeName] = [];
                                            apiParams.involvedElements[shortcodeName].push(this);
                                        });
                                    }
                                }
                                if (nextBlock && nextBlock.length) {
                                    shortcodes = nextBlock.find('.motopress-block-content > [data-motopress-shortcode]');
                                    if (shortcodes.length) {
                                        shortcodes.each(function () {
                                            shortcodeName = $(this).attr('data-motopress-shortcode');
                                            if (!apiParams.involvedElements.hasOwnProperty(shortcodeName))
                                                apiParams.involvedElements[shortcodeName] = [];
                                            apiParams.involvedElements[shortcodeName].push(this);
                                        });
                                    }
                                }
                                $('body').trigger('MPCEObjectSplit', apiParams);
                            }
                        }
                    });
                },
                calcSplitterOptions: function (obj, type) {
                    var elements = null;
                    var rowWidth = null;
                    var splitter = null;
                    if (type === 'column') {
                        rowWidth = obj.parent('.motopress-row-edge').width();
                        elements = obj;
                    } else if (type === 'row') {
                        var rowEdge = parent.MP.Utils.getEdgeRow(obj);
                        rowWidth = rowEdge.width();
                        elements = rowEdge.children('.motopress-clmn');
                    } else {
                        return false;
                    }
                    if (!CE.Grid.myThis.padding) {
                        var rowWidthPiece = rowWidth / 100;
                        var spanMargin = rowWidthPiece * CE.Grid.myThis.columnMarginPiece;
                        var splitterWidth = rowWidthPiece * CE.Grid.myThis.splitterWidthPiece + spanMargin;
                        var splitterMargin = -(rowWidthPiece * CE.Grid.myThis.splitterMarginPiece + spanMargin / 2);
                    }
                    elements.each(function () {
                        splitter = $(this).find('.motopress-helper > .motopress-splitter');
                        CE.Resizer.myThis.makeSplittable(splitter);
                        if (!CE.Grid.myThis.padding) {
                            splitter.width(splitterWidth);
                            splitter.css('margin-left', splitterMargin - parseInt($(this).css('border-left-width')));
                        }
                        if (!$(this).children('.motopress-row').length) {
                            CE.Resizer.myThis.makeResizable($(this));
                        }
                    });
                },
                updateSplittableOptions: function (block, rowFrom, rowTo, action) {
                    if (typeof action === 'undefined')
                        action = 'default';
                    if (action === 'init' || action === 'split') {
                        var rows = null;
                        if (action === 'init') {
                            rows = $('.motopress-content-wrapper .motopress-row');
                        } else if (action === 'split') {
                            var necessaryRow = block.parents('.motopress-row, .motopress-content-wrapper').eq(-2);
                            if (typeof necessaryRow !== 'undefined') {
                                rows = $.merge($.merge([], necessaryRow), necessaryRow.find('.motopress-row'));
                            }
                        }
                        if (rows && typeof rows !== 'undefined') {
                            $.each(rows, function () {
                                CE.Resizer.myThis.calcSplitterOptions($(this), 'row');
                            });
                        }
                    } else {
                        if (block)
                            this.calcSplitterOptions(block, 'column');
                        if (rowFrom) {
                            $.each($.merge($.merge([], rowFrom), rowFrom.find('.motopress-row')), function () {
                                CE.Resizer.myThis.calcSplitterOptions($(this), 'row');
                            });
                        }
                        if (rowTo) {
                            $.each($.merge($.merge([], rowTo), rowTo.find('.motopress-row')), function () {
                                CE.Resizer.myThis.calcSplitterOptions($(this), 'row');
                            });
                        }
                    }
                },
                updateSplitterHeight: function (obj, action) {
                    var t = setTimeout(function () {
                        var necessaryRow = null;
                        necessaryRow = $('.motopress-content-wrapper .motopress-row');
                        $.each(necessaryRow.get().reverse(), function () {
                            var rowEdge = parent.MP.Utils.getEdgeRow($(this));
                            var spans = rowEdge.children('.motopress-clmn');
                            var emptySpans = spans.filter('.motopress-empty');
                            emptySpans.css('height', '');
                            var rowEdgeHeight = rowEdge.height();
                            $.each(emptySpans, function () {
                                var emptySpanMargins = parseFloat($(this).css('margin-top')) + parseFloat($(this).css('margin-bottom'));
                                var emptySpanOuterHeight = rowEdgeHeight - emptySpanMargins;
                                $(this).outerHeight(emptySpanOuterHeight);
                            });
                        });
                        $.each(necessaryRow, function () {
                            var row = $(this);
                            var rowEdge = parent.MP.Utils.getEdgeRow(row);
                            var spans = rowEdge.children('.motopress-clmn');
                            var spanIndent = 0;
                            if (CE.Grid.myThis.padding) {
                                spanIndent = CE.Grid.myThis.padding * 2;
                            } else {
                                spanIndent = rowEdge.width() / 100 * CE.Grid.myThis.columnMarginPiece;
                            }
                            var rowEdgeHeight = rowEdge.outerHeight();
                            spans.each(function () {
                                var span = $(this);
                                var spanEdge = parent.MP.Utils.getEdgeSpan(span);
                                var handleIntermediateLeft = CE.Grid.myThis.padding && span.is('[data-motopress-wrapper-id]') ? spanIndent / 2 : spanIndent;
                                var spanEdgeTopGap = spanEdge.offset().top - rowEdge.offset().top;
                                var top = spanEdgeTopGap + parseFloat(spanEdge.css('border-top-width'));
                                span.find('.motopress-splitter').css({
                                    height: rowEdgeHeight,
                                    top: -top
                                });
                                span.find('.motopress-handle-intermediate').css({
                                    width: spanIndent,
                                    height: rowEdgeHeight,
                                    top: -top,
                                    left: -handleIntermediateLeft - parseInt(span.css('border-left-width'))
                                });
                            });
                        });
                        clearTimeout(t);
                    }, 50);
                },
                hideSplitters: function (exclude) {
                    exclude = typeof exclude === 'undefined' ? exclude = false : exclude;
                    var splitters = $('.motopress-content-wrapper .motopress-clmn .motopress-splitter');
                    if (!exclude)
                        splitters.addClass('motopress-hide');
                    else
                        splitters.not(exclude).addClass('motopress-hide');
                },
                showSplitters: function () {
                    $('.motopress-content-wrapper .motopress-clmn .motopress-splitter').removeClass('motopress-hide');
                },
                hideEmptySpans: function () {
                    $('.motopress-content-wrapper .motopress-clmn.motopress-empty').addClass('motopress-empty-hide').height(1);
                },
                showEmptySpans: function () {
                    $('.motopress-content-wrapper .motopress-clmn.motopress-empty').removeClass('motopress-empty-hide');
                },
                calculateRowGap: function (row, side) {
                    var gap = 0;
                    var rowEdge = parent.MP.Utils.getEdgeRow(row);
                    if (!row.is(rowEdge)) {
                        switch (side) {
                        case 'top':
                            gap += rowEdge.offset().top - row.offset().top;
                            break;
                        case 'bottom':
                            var rowBottom = row.offset().top + row.outerHeight();
                            var rowEdgeBottom = rowEdge.offset().top + rowEdge.outerHeight();
                            gap += rowBottom - rowEdgeBottom;
                            break;
                        case 'left':
                            gap += rowEdge.offset().left - row.offset().left;
                            break;
                        case 'right':
                            var rowRight = row.offset().left + row.outerWidth();
                            var rowEdgeRight = rowEdge.offset().left + rowEdge.outerWidth();
                            gap += rowRight - rowEdgeRight;
                            break;
                        }
                    }
                    gap += parseFloat(rowEdge.css('padding-' + side));
                    gap += parseFloat(rowEdge.css('border-' + side + '-width'));
                    return gap;
                },
                updateHandle: function () {
                    var t = setTimeout(function () {
                        if (!CE.DragDrop.myThis.isEmptyScene()) {
                            var rowFirst = $('.motopress-content-wrapper > .motopress-row:first');
                            var rowFirstOffset = rowFirst.offset();
                            var rowFirstMarginLeft = parseFloat(rowFirst.css('margin-left'));
                            var rowLast = $('.motopress-content-wrapper > .motopress-row:last');
                            var leftBarWidth = 0;
                            var handleOffset = rowFirstOffset.left - leftBarWidth;
                            $('.motopress-content-wrapper > .motopress-row').each(function () {
                                var row = $(this);
                                var rowHeight = row.outerHeight();
                                var rowEdge = parent.MP.Utils.getEdgeRow(row);
                                rowEdge.children('.motopress-clmn:first, .motopress-clmn:last').each(function () {
                                    var span = $(this);
                                    var spanEdge = parent.MP.Utils.getEdgeSpan(span);
                                    var spanEdgeTopGap = spanEdge.offset().top - row.offset().top;
                                    var top = spanEdgeTopGap + parseFloat(spanEdge.css('border-top-width'));
                                    span.children('.motopress-wrapper-helper, .motopress-helper').each(function () {
                                        var isWrapper = $(this).hasClass('motopress-wrapper-helper');
                                        $(this).find('.motopress-handle-left, .motopress-handle-right').each(function () {
                                            var side = $(this).hasClass('motopress-handle-left') ? 'left' : 'right';
                                            var spanEdgeBorder = parseFloat(spanEdge.css('border-' + side + '-width'));
                                            if (side === 'left') {
                                                var spanEdgeOffset = spanEdge.offset().left - leftBarWidth;
                                            } else {
                                                var spanEdgeOffset = $(window).width() - spanEdge.offset().left - spanEdge.outerWidth();
                                            }
                                            var width = spanEdgeOffset + spanEdgeBorder + CE.Grid.myThis.padding;
                                            if (Math.floor(width) <= 0) {
                                                width = 25;
                                                spanEdgeOffset = 0;
                                            }
                                            var properties = {
                                                top: -top,
                                                width: width,
                                                height: rowHeight
                                            };
                                            var sidePosition = isWrapper ? spanEdgeOffset + spanEdgeBorder : spanEdgeOffset + spanEdgeBorder + CE.Grid.myThis.padding;
                                            properties[side] = -sidePosition;
                                            $(this).css(properties);
                                        });
                                    });
                                });
                            });
                            var container = $('html'), doc = $(document);
                            var handleMiddleWidth = doc.width() - leftBarWidth;
                            var handleMiddleFirst = $('.motopress-content-wrapper > .motopress-handle-middle-in:first');
                            var handleMiddleLast = $('.motopress-content-wrapper > .motopress-handle-middle-in:last');
                            var handleMiddlePrevLast = handleMiddleLast.prevAll('.motopress-handle-middle-in:first');
                            if (handleMiddlePrevLast[0] !== handleMiddleFirst[0]) {
                                handleMiddlePrevLast.css({
                                    width: '',
                                    left: '',
                                    height: '',
                                    'margin-top': ''
                                });
                            }
                            var htmlHeight = doc.height();
                            var containerTop = parseInt(container.css('top'));
                            var handleMiddleLastHeight = htmlHeight - handleMiddleLast.offset().top;
                            if (htmlHeight < containerTop + doc.outerHeight(true)) {
                                handleMiddleLastHeight += containerTop;
                            }
                            var rowLastMarginBottom = parseInt(rowLast.css('margin-bottom'));
                            if (Math.abs(parseInt(handleMiddleLast.css('margin-top'))) !== rowLastMarginBottom) {
                                handleMiddleLastHeight += rowLastMarginBottom;
                            }
                            var rowFirstMarginTop = parseInt(rowFirst.css('margin-top'));
                            handleMiddleFirst.css({
                                width: handleMiddleWidth,
                                height: rowFirstOffset.top,
                                top: rowFirstMarginTop - rowFirstOffset.top,
                                left: -handleOffset + rowFirstMarginLeft,
                                'margin-top': ''
                            });
                            handleMiddleLast.css({
                                width: handleMiddleWidth,
                                left: -handleOffset + rowFirstMarginLeft,
                                height: handleMiddleLastHeight,
                                'margin-top': -rowLastMarginBottom
                            });    
                        }
                        clearTimeout(t);
                    }, 50);
                },
                updateBottomInHandleMiddle: function () {
                    var t = setTimeout(function () {
                        if (!CE.DragDrop.myThis.isEmptyScene()) {
                            $('.motopress-content-wrapper > .motopress-row').each(function () {
                                CE.Resizer.myThis.setHandleHeight($(this));
                            });
                        }
                        clearTimeout(t);
                    }, 50);
                },
                setHandleHeight: function (row) {
                    var minHeight = parseInt(row.find('.motopress-handle-middle-in:last').css('min-height'));
                    row.find('.motopress-handle-middle-in').each(function () {
                        $(this).height(minHeight);
                    });
                    var rowEdge = parent.MP.Utils.getEdgeRow(row);
                    rowEdge.children('.motopress-clmn:not(".motopress-empty")').each(function () {
                        var span = $(this);
                        var spanEdge = parent.MP.Utils.getEdgeSpan(span);
                        var spanEdgeWidth = spanEdge.width();
                        var childRow = spanEdge.children('.motopress-row');
                        var bottom = row.is(':last-of-type') ? 0 : 5;
                        var top = row.is(':first-of-type') ? 0 : 5;
                        var spanEdgeBottom = spanEdge.offset().top + spanEdge.outerHeight();
                        var rowBottom = row.offset().top + row.outerHeight();
                        if (childRow.length) {
                            var handleMiddleLast = spanEdge.children('.motopress-handle-middle-in:last-of-type');
                            var bottomGapBetweenSpanRow = rowBottom - spanEdgeBottom;
                            var rowPrev = handleMiddleLast.prev('.motopress-row');
                            var rowPrevBottom = rowPrev.offset().top + rowPrev.outerHeight();
                            var handleMiddleLastMinHeight = parseFloat(handleMiddleLast.css('min-height'));
                            handleMiddleLast.css({
                                'bottom': -bottomGapBetweenSpanRow + handleMiddleLastMinHeight,
                                'height': rowBottom - rowPrevBottom,
                                'width': spanEdgeWidth
                            });
                            var handleMiddleFirst = spanEdge.children('.motopress-handle-middle-in:first-of-type');
                            var spanPaddingTop = parseFloat(spanEdge.css('padding-top'));
                            var spanBorderTop = parseFloat(spanEdge.css('border-top'));
                            var topGapBetweenSpanRow = spanEdge.offset().top - row.offset().top;
                            var handleMiddleFirstMinHeight = parseFloat(handleMiddleFirst.css('min-height'));
                            handleMiddleFirst.css({
                                'top': -topGapBetweenSpanRow - spanBorderTop,
                                'height': topGapBetweenSpanRow + spanBorderTop + spanPaddingTop + handleMiddleFirstMinHeight,
                                'width': spanEdgeWidth
                            });
                            childRow.each(function () {
                                CE.Resizer.myThis.setHandleHeight($(this));
                            });
                        } else {
                            var bottomIn = span.find('.motopress-handle-bottom-in');
                            var bottomInMinHeight = parseFloat(bottomIn.css('min-height'));
                            var spanEdgeBottom = spanEdge.offset().top + spanEdge.outerHeight();
                            var rowBottom = row.offset().top + row.outerHeight();
                            var gapBetweenSpanRowBottom = spanEdgeBottom - rowBottom;
                            bottomIn.css({
                                bottom: bottom + gapBetweenSpanRowBottom,
                                height: bottomInMinHeight - gapBetweenSpanRowBottom + parseFloat(spanEdge.css('border-bottom-width'))
                            });
                            var gapBetweenSpanRowTop = spanEdge.offset().top - row.offset().top;
                            var topIn = span.find('.motopress-handle-top-in');
                            var topMinHeight = parseInt(topIn.css('min-height'));
                            topIn.css({
                                top: top - gapBetweenSpanRowTop,
                                height: topMinHeight + gapBetweenSpanRowTop + parseFloat(spanEdge.css('border-top-width'))
                            });
                        }    
                    });    
                },
                updateHandleMiddle: function () {
                    var t = setTimeout(function () {
                        var elements = $('.motopress-content-wrapper > .motopress-handle-middle-in:not(":first-of-type, :last-of-type"), .motopress-content-wrapper .motopress-row-edge > .motopress-clmn .motopress-handle-middle-in:not(":first-of-type, :last-of-type")');
                        elements.each(function () {
                            var handleMiddle = $(this);
                            var prevRow = handleMiddle.prev('.mpce-wp-more-tag').length ? handleMiddle.prev('.mpce-wp-more-tag').prev('.motopress-row') : handleMiddle.prev('.motopress-row');
                            var nextRow = handleMiddle.next('.motopress-row');
                            var prevRowMarginBottom = prevRow.length ? parseInt(prevRow.css('margin-bottom')) : 0;
                            var nextRowMarginTop = nextRow.length ? parseInt(nextRow.css('margin-top')) : 0;
                            var marginTop = -prevRowMarginBottom - 5;
                            var height = Math.max(prevRowMarginBottom, nextRowMarginTop) + 10;
                            var parameters = {};
                            parameters['width'] = handleMiddle.parent('.motopress-clmn-edge, .motopress-content-wrapper').width();
                            if (height > 0) {
                                parameters['margin-top'] = marginTop;
                                parameters['height'] = height;
                            } else {
                                parameters['margin-top'] = '';
                                parameters['height'] = '';
                            }
                            parameters['bottom'] = '';
                            handleMiddle.css(parameters);
                        });
                        $('.motopress-content-wrapper > .motopress-handle-middle-in:first-of-type, .motopress-content-wrapper > .motopress-handle-middle-in:last-of-type').css({
                            'margin-left': '',
                            'margin-right': ''
                        });
                        clearTimeout(t);
                    }, 70);
                },
                changeSpanClass: function (obj, newClass) {
                    if (parent.CE.Iframe.myThis.gridObj.span.type && parent.CE.Iframe.myThis.gridObj.span.type === 'multiple') {
                        var shortcode = obj.attr('data-motopress-shortcode');
                        if (typeof shortcode !== 'undefined') {
                            spanNumber = parent.MP.Utils.getSpanNumber(newClass);
                            obj.attr('data-motopress-shortcode', parent.CE.Iframe.myThis.gridObj.span.shortcode[spanNumber - 1]);
                        }
                    }
                    if (newClass === parent.CE.Iframe.myThis.gridObj.span.minclass) {
                        newClass += ' motopress-clmn-min';
                    }
                    obj.removeClass(this.gridColumnSizeClassesString + ' motopress-clmn-min').addClass(newClass);
                },
                updateAllHandles: function () {
                    CE.Resizer.myThis.updateBottomInHandleMiddle();
                    CE.Resizer.myThis.updateSplitterHeight();
                    CE.Resizer.myThis.updateHandle();
                    CE.Resizer.myThis.updateHandleMiddle();
                }
            });
        }(jQuery));
        (function ($) {
            can.Construct('CE.DragDrop', 
            {
                myThis: null,
                interruptInsert: false,
                curHandle: null,
                setEdgeRow: function (rows) {
                    $.each(rows, function () {
                        if ($(this).hasClass(parent.CE.Iframe.myThis.gridObj.row.edgeclass)) {
                            $(this).addClass('motopress-row-edge');
                        } else {
                            $(this).find('.' + parent.CE.Iframe.myThis.gridObj.row.edgeclass).first().addClass('motopress-row-edge');
                        }
                    });
                },
                setEdgeSpan: function (spans, isFillerExpected, isRemoveFiller) {
                    isFillerExpected = typeof isFillerExpected !== 'undefined' && isFillerExpected;
                    isRemoveFiller = typeof isRemoveFiller !== 'undefined' && isRemoveFiller;
                    var spanChildSelector = isFillerExpected ? '.motopress-filler-content' : '[data-motopress-shortcode]';
                    var spanChild;
                    $.each(spans, function () {
                        spanChild = $(this).find(spanChildSelector).first();
                        spanChild.parent().addClass('motopress-clmn-edge');
                        if (isRemoveFiller) {
                            spanChild.remove();
                        }
                    });
                }
            }, 
            {
                inited: false,
                blockContent: $('<div />', { 'class': 'motopress-block-content' }),
                handleTopIn: $('<div />', {
                    'class': 'motopress-handle-top-in',
                    'data-motopress-position': 'top-in'
                }),
                handleBottomIn: $('<div />', {
                    'class': 'motopress-handle-bottom-in',
                    'data-motopress-position': 'bottom-in'
                }),
                handleIntermediate: $('<div />', {
                    'class': 'motopress-handle-intermediate',
                    'data-motopress-position': 'intermediate'
                }),
                handleLeftOut: $('<div />', {
                    'class': 'motopress-handle-left-out',
                    'data-motopress-position': 'left-out'
                }),
                handleRightOut: $('<div />', {
                    'class': 'motopress-handle-right-out',
                    'data-motopress-position': 'right-out'
                }),
                handleLeftIn: $('<div />', {
                    'class': 'motopress-handle-left-in',
                    'data-motopress-position': 'left-in'
                }),
                handleRightIn: $('<div />', {
                    'class': 'motopress-handle-right-in',
                    'data-motopress-position': 'right-in'
                }),
                handleLeft: $('<div />', {
                    'class': 'motopress-outer-handle motopress-handle-left motopress-outer-handle-hidden',
                    'data-motopress-position': 'left'
                }),
                handleRight: $('<div />', {
                    'class': 'motopress-outer-handle motopress-handle-right motopress-outer-handle-hidden',
                    'data-motopress-position': 'right'
                }),
                overlay: $('<div />', { 'class': 'motopress-overlay' }),
                dragHandle: $('<div />', {
                    'class': 'motopress-drag-handle'    
                }),
                focusArea: $('<div />', {
                    'class': 'motopress-focus-area',
                    tabindex: -1
                }),
                helper: $('<section />', { 'class': 'motopress-helper' }),
                handleMiddleOut: $('<span />', {
                    'class': 'motopress-handle-middle-out',
                    'data-motopress-position': 'middle-out'
                }),
                handleMiddleIn: $('<span />', {
                    'class': 'motopress-outer-handle motopress-handle-middle-in motopress-outer-handle-hidden',
                    'data-motopress-position': 'middle-in'
                }),
                emptySceneHelper: $('<section />', { id: 'motopress-empty-scene-helper' }),
                emptySceneDroppable: $('<div />', {
                    'class': 'motopress-empty-scene',
                    html: '<div class="motopress-empty-scene-container-first"><div class="motopress-empty-scene-image"></div><div class="motopress-empty-scene-wrapper-right"><div class="motopress-empty-scene-title">' + localStorage.getItem('CEEmptySceneHelperTitle') + '</div><div class="motopress-empty-scene-content">' + localStorage.getItem('CEEmptySceneHelperContent') + '</div></div></div>' + '<div class="motopress-empty-scene-container-second"><div class="motopress-empty-scene-or-label">' + localStorage.getItem('CEEmptySceneHelperOr') + '</div><input type="text" class="motopress-empty-scene-type-here" value="' + localStorage.getItem('CEEmptySceneHelperInputText') + '"></div>'
                }),
                templates: $('<div />', {
                    'class': 'motopress-templates-container',
                    html: '<div class="motopress-templates-title">' + '<div class="motopress-templates-separator"><div class="motopress-templates-separator-line"></div></div>' + '<div class="motopress-templates-label">' + localStorage.getItem('CEChooseLayout') + '</div>' + '<div class="motopress-templates-separator"><div class="motopress-templates-separator-line"></div></div>' + '</div>' + '<div id="motopress-templates"></div>'
                }),
                handleInsert: $('<div />', {
                    'class': 'motopress-handle-insert',
                    'data-motopress-position': 'insert'
                }),
                emptySpanOverlay: $('<div />', { 'class': 'motopress-overlay' }),
                emptySpanHelper: $('<section />', { 'class': 'motopress-helper' }),
                handleWrapper: $('<div />', { 'class': 'motopress-handle-wrapper' }),
                wrapperHelper: $('<section />', { 'class': 'motopress-wrapper-helper' }),
                wrapperHelperResizer: $('<section />', { 'class': 'motopress-helper' }),
                wrapperId: 0,
                lineHelperIntermediate: $('<div />', { 'class': 'motopress-line-helper-intermediate' }),
                lineHelperLeftOut: $('<div />', { 'class': 'motopress-line-helper-left-out' }),
                lineHelperRightOut: $('<div />', { 'class': 'motopress-line-helper-right-out' }),
                lineHelperLeft: $('<div />', { 'class': 'motopress-line-helper-left' }),
                lineHelperRight: $('<div />', { 'class': 'motopress-line-helper-right' }),
                lineHelperLeftIn: $('<div />', { 'class': 'motopress-line-helper-left-in' }),
                lineHelperRightIn: $('<div />', { 'class': 'motopress-line-helper-right-in' }),
                lineHelperTopIn: $('<div />', { 'class': 'motopress-line-helper-top-in' }),
                lineHelperBottomIn: $('<div />', { 'class': 'motopress-line-helper-bottom-in' }),
                lineHelperHandleMiddle: $('<div />', {
                    'class': 'motopress-line-helper-middle-in'
                }),
                lineHelperInsert: $('<div />', { 'class': 'motopress-line-helper-insert' }),
                textHelperIntermediate: $('<div />', {
                    'class': 'motopress-text-helper-intermediate',
                    text: localStorage.getItem('helperNewColumn')
                }),
                textHelperLeftOut: $('<div />', {
                    'class': 'motopress-text-helper-left-out',
                    text: localStorage.getItem('helperNewColumn')
                }),
                textHelperRightOut: $('<div />', {
                    'class': 'motopress-text-helper-right-out',
                    text: localStorage.getItem('helperNewColumn')
                }),
                textHelperLeft: $('<div />', {
                    'class': 'motopress-text-helper-left',
                    text: localStorage.getItem('helperNewColumn')
                }),
                textHelperRight: $('<div />', {
                    'class': 'motopress-text-helper-right',
                    text: localStorage.getItem('helperNewColumn')
                }),
                textHelperLeftIn: $('<div />', {
                    'class': 'motopress-text-helper-left-in',
                    text: localStorage.getItem('helperInsert')
                }),
                textHelperRightIn: $('<div />', {
                    'class': 'motopress-text-helper-right-in',
                    text: localStorage.getItem('helperInsert')
                }),
                textHelperTopIn: $('<div />', {
                    'class': 'motopress-text-helper-top-in',
                    text: localStorage.getItem('helperInsert')
                }),
                textHelperBottomIn: $('<div />', {
                    'class': 'motopress-text-helper-bottom-in',
                    text: localStorage.getItem('helperInsert')
                }),
                textHelperHandleMiddle: $('<div />', {
                    'class': 'motopress-text-helper-middle-in',
                    text: localStorage.getItem('helperMiddle')
                }),
                textHelperInsert: $('<div />', {
                    'class': 'motopress-text-helper-insert',
                    text: localStorage.getItem('helperInsert')
                }),
                textHelperHalfSize: null,
                lineHelperThickness: null,
                lineHelperHalfThickness: null,
                handleMiddleHalfThickness: null,
                moreHandler: null,
                helperContainer: $('<div />', { 'class': 'motopress-helper-container' }).appendTo('body'),
                newBlock: null,
                spaceClass: 'motopress-space',
                resizer: null,
                tools: null,
                wpMore: null,
                canDrop: false,
                spanSizeRules: null,
                rowHtml: null,
                rowInnerHtml: null,
                spanHtml: null,
                spanInnerHtml: null,
                bodyEl: $('body'),
                container: $('#motopress-container'),
                init: function () {
                    this.setEdges();
                    new CE.Grid($('#motopress-ce-grid'));
                    this.setupNewBlock();
                    this.resizer = new CE.Resizer();
                    this.tools = new CE.Tools();
                    this.wpMore = CE.WPMore.getInstance();
                    this.generateSpanSizeRules();
                    this.setCalcWrapperWidth(this.helper);
                    this.setCalcWrapperWidth(this.emptySpanHelper);
                    this.setCalcWrapperWidth(this.wrapperHelper);
                    this.setCalcWrapperWidth(this.wrapperHelperResizer);
                    if (CE.Grid.myThis.padding) {
                        this.helper.css('left', CE.Grid.myThis.padding);
                        this.emptySpanHelper.css('left', CE.Grid.myThis.padding);
                        this.wrapperHelperResizer.css('left', CE.Grid.myThis.padding);
                    }
                    this.overlay.append(this.handleIntermediate.clone(), this.handleLeft.clone(), this.handleTopIn, this.handleBottomIn, this.handleLeftOut, this.handleRightOut, this.handleLeftIn, this.handleRightIn, this.handleRight.clone());
                    this.helper.append(this.overlay, this.focusArea.clone(), this.dragHandle.clone(), 
                    this.resizer.splitter.clone());
                    this.emptySpanOverlay.append(this.handleIntermediate.clone(), this.handleLeft.clone(), 
                    this.handleRight.clone(), this.handleInsert.clone());
                    this.emptySpanHelper.append(this.emptySpanOverlay, this.resizer.splitter.clone());
                    this.wrapperHelper.append(this.handleIntermediate.clone(), this.handleLeft.clone(), this.handleRight.clone());
                    this.wrapperHelperResizer.append(this.resizer.splitter.clone());
                    var calcT = setTimeout(function () {
                        CE.DragDrop.myThis.textHelperHalfSize = Math.round(CE.DragDrop.myThis.textHelperHandleMiddle.height() / 2);
                        CE.DragDrop.myThis.lineHelperThickness = CE.DragDrop.myThis.lineHelperLeftIn.outerWidth();
                        CE.DragDrop.myThis.lineHelperHalfThickness = Math.round(CE.DragDrop.myThis.lineHelperHandleMiddle.height() / 2);
                        CE.DragDrop.myThis.handleMiddleHalfThickness = Math.round(6 / 2);
                        clearTimeout(calcT);
                    }, 0);
                    this.emptySceneHelper.append(this.emptySceneDroppable, this.templates).appendTo($('.motopress-content-wrapper'));
                    this.helperContainer.append(
                    this.lineHelperIntermediate, this.lineHelperLeftOut, this.lineHelperRightOut, this.lineHelperLeft, this.lineHelperRight, this.lineHelperLeftIn, this.lineHelperRightIn, this.lineHelperTopIn, this.lineHelperBottomIn, this.lineHelperHandleMiddle, this.lineHelperInsert, 
                    this.textHelperIntermediate, this.textHelperLeftOut, this.textHelperRightOut, this.textHelperLeft, this.textHelperRight, this.textHelperLeftIn, this.textHelperRightIn, this.textHelperTopIn, this.textHelperBottomIn, this.textHelperHandleMiddle, this.textHelperInsert);
                    this.wpMore.pointAppendTo(this.handleMiddleIn);
                    this.setupDefaultGridHtml();
                    CE.DragDrop.myThis = this;
                    this.main();
                    parent.MP.Preloader.myThis.load(CE.DragDrop.shortName);
                    parent.MP.Preloader.myThis.hide();    
                },
                setEdges: function () {
                    var editableRows = $('.motopress-content-wrapper .motopress-row').not('.motopress-content-wrapper [data-motopress-group]:not([data-motopress-group="mp_grid"]) .motopress-row');
                    CE.DragDrop.setEdgeRow(editableRows);
                    var editableSpans = $('.motopress-content-wrapper .motopress-clmn').not('.motopress-content-wrapper [data-motopress-group]:not([data-motopress-group="mp_grid"]) .motopress-clmn');
                    CE.DragDrop.setEdgeSpan(editableSpans.not('.motopress-empty'));
                    CE.DragDrop.setEdgeSpan(editableSpans.filter('.motopress-empty'), true, true);
                },
                setupNewBlock: function () {
                    var newBlock = $(parent.motopressCE.rendered_shortcodes.grid[parent.CE.Iframe.myThis.gridObj.span.shortcode]);
                    newBlock.addClass(parent.CE.Iframe.myThis.gridObj.span.minclass);
                    CE.DragDrop.setEdgeSpan(newBlock, true, true);
                    this.newBlock = newBlock;
                },
                setupDefaultGridHtml: function () {
                    this.spanHtml = $(parent.motopressCE.rendered_shortcodes.grid[parent.CE.Iframe.myThis.gridObj.span.shortcode]);
                    CE.DragDrop.setEdgeSpan(this.spanHtml, true);
                    CE.Resizer.myThis.changeSpanClass(this.spanHtml, '');
                    this.spanInnerHtml = $(parent.motopressCE.rendered_shortcodes.grid[parent.CE.Iframe.myThis.gridObj.span.inner]);
                    CE.DragDrop.setEdgeSpan(this.spanInnerHtml, true);
                    CE.Resizer.myThis.changeSpanClass(this.spanInnerHtml, '');
                    this.rowHtml = $(parent.motopressCE.rendered_shortcodes.grid[parent.CE.Iframe.myThis.gridObj.row.shortcode]);
                    this.rowInnerHtml = $(parent.motopressCE.rendered_shortcodes.grid[parent.CE.Iframe.myThis.gridObj.row.inner]);
                },
                main: function () {
                    if (!this.inited)
                        this.sceneEvents();
                    var editableRows = $('.motopress-content-wrapper .motopress-row').not('.motopress-content-wrapper [data-motopress-group]:not([data-motopress-group="mp_grid"]) .motopress-row');
                    var editableSpans = $('.motopress-content-wrapper .motopress-clmn').not('.motopress-content-wrapper [data-motopress-group]:not([data-motopress-group="mp_grid"]) .motopress-clmn');
                    if (!this.inited)
                        this.addEmptySceneHelper();
                    if (!this.inited)
                        this.addHandleMoreDisable();
                    this.recursiveAddHandleMiddle($('.motopress-content-wrapper'));
                    this.makeEditable(editableSpans.not('.motopress-empty'));
                    this.makeRowEditable(editableRows);
                    this.makeEditableEmptySpan(editableSpans.filter('.motopress-empty'));
                    this.resizer.updateSplittableOptions(null, null, null, 'init');
                    this.resizer.updateAllHandles();
                    if (this.isEmptyScene())
                        CE.Utils.addSceneState('empty-scene');
                    this.inited = true;
                },
                isEmptyScene: function () {
                    return !$('.motopress-content-wrapper>.motopress-row').length;
                },
                addEmptySceneHelper: function () {
                    this.makeEmptySceneHelperDroppable();
                    this.makeEmptySceneHelperFocusable();
                    if (this.isEmptyScene()) {
                        this.emptySceneHelper.show();
                        CE.Utils.removeSceneState('empty-scene');
                    }
                },
                addHandleMoreDisable: function () {
                    var contentWrapper = $('.motopress-content-wrapper');
                    this.wpMore.pointPrependTo(contentWrapper, 'first');
                    this.wpMore.pointPrependTo(contentWrapper, 'last');
                },
                makeEmptySceneHelperFocusable: function () {
                    var self = this;
                    $('.motopress-empty-scene-type-here').off('focusin').on('focusin', function (e) {
                        self.emptySceneTypeHereOnFocusein(e, this);
                    });
                },
                emptySceneTypeHereOnFocusein: function (e, el) {
                    var self = this;
                    this.emptySceneHelper.hide().css('opacity', 1);
                    var rowTo = $(el).closest('.motopress-row');
                    var rowFrom = null;
                    var block = this.newBlock.clone();
                    this.resizer.changeSpanClass(block, parent.CE.Iframe.myThis.gridObj.span.fullclass);
                    var ui = {
                        helper: $('<div />', {
                            'data-motopress-close-type': CE.LeftBar.myThis.library.mp_text.objects.mp_text.closeType,
                            'data-motopress-shortcode': CE.LeftBar.myThis.library.mp_text.objects.mp_text.id,
                            'data-motopress-group': CE.LeftBar.myThis.library.mp_text.id,
                            'data-motopress-resize': CE.LeftBar.myThis.library.mp_text.objects.mp_text.resize
                        })
                    };
                    var parameters = CE.LeftBar.myThis.library.mp_text.objects.mp_text.parameters;
                    if (!$.isEmptyObject(parameters)) {
                        var parametersObj = {};
                        $.each(parameters, function (key) {
                            parametersObj[key] = {};
                        });
                        ui.helper.attr('data-motopress-parameters', JSON.stringify(parametersObj));
                    }
                    var styles = CE.LeftBar.myThis.getStyleAttrs(CE.LeftBar.myThis.library.mp_text.id, CE.LeftBar.myThis.library.mp_text.objects.mp_text.id);
                    if (!$.isEmptyObject(styles)) {
                        var stylesObj = {};
                        $.each(styles, function (key) {
                            stylesObj[key] = {};
                        });
                        ui.helper.attr('data-motopress-styles', JSON.stringify(stylesObj));
                    }
                    this.makeEditable(block, ui, true);
                    var rowTo = this.rowHtml.clone().find('.motopress-filler-content').replaceWith(block).end();
                    this.makeRowEditable(rowTo, true);
                    $('.motopress-content-wrapper').append(rowTo);
                    var t1 = setTimeout(function () {
                        self.addHandleMiddle(rowTo, parent.CE.Iframe.myThis.gridObj.span.fullclass);
                        clearTimeout(t1);
                    }, 0);
                    var t2 = setTimeout(function () {
                        CE.Selectable.myThis.select(block.find('.motopress-drag-handle'));
                        self.makeDroppable();
                        self.resizer.updateSplittableOptions(block, rowFrom, rowTo);
                        self.resizer.updateAllHandles();
                        clearTimeout(t2);
                    }, 0);
                    parent.CE.Save.changeContent();
                    CE.Utils.removeSceneState('empty-scene');
                },
                makeSpanSelectable: function (obj) {
                    var spanHandle = $('<div />', { 'class': 'motopress-clmn-select-handle' });
                    obj.children('.motopress-helper').append(spanHandle.clone());
                },
                makeRowEditable: function (obj, isNew) {
                    isNew = typeof isNew !== 'undefined' && isNew;
                    obj.each(function () {
                        var $this = $(this);
                        CE.DragDrop.setEdgeRow($this);
                        var $rowEdge = parent.MP.Utils.getEdgeRow($this);
                        if (!$rowEdge.children('.motopress-row-helper').length) {
                            var rowHelper = $('<span />', { 'class': 'motopress-row-helper' });
                            var rowSelectHandle = $('<div />', { 'class': 'motopress-row-select-handle' });
                            rowHelper.append(rowSelectHandle.clone());
                            $rowEdge.append(rowHelper.clone());
                            var shortcode = $this.attr('data-motopress-shortcode');
                            if (isNew || !shortcode)
                                CE.DragDrop.myThis.setAttrs($this);
                        }
                        if (typeof $this.control(CE.Controls) === 'undefined')
                            $this.ce_controls({ isNew: isNew });
                        var ctrl = $this.control(CE.Controls);
                        if ((isNew || !shortcode) && ctrl) {
                            ctrl.stylesCtrl.setDefaultAttrs();
                            var parameters = typeof $this.attr('data-motopress-parameters') !== 'undefined' ? $this.attr('data-motopress-parameters') : null;
                            ctrl.settingsCtrl.setDefaultAttrs(parameters);
                            ctrl.stylesCtrl.save();
                        }
                    });
                },
                makeEditable: function (obj, ui, isNew) {
                    isNew = typeof isNew !== 'undefined' && isNew;
                    obj.each(function () {
                        var $this = $(this);
                        CE.DragDrop.setEdgeSpan($(this));
                        var spanEdge = parent.MP.Utils.getEdgeSpan($this);
                        if (!$this.closest('.motopress-block-content').length) {
                            CE.DragDrop.myThis.addHelpers($this);
                            CE.DragDrop.myThis.resizer.makeResizable($this);
                            CE.DragDrop.myThis.resizer.makeSplittable($this);
                            CE.DragDrop.myThis.makeDraggable($this);
                            CE.DragDrop.myThis.makeDroppable();
                            if (typeof ui !== 'undefined' && ui !== null)
                                CE.DragDrop.myThis.setAttrs($this, ui);
                            if (isNew)
                                $this.addClass('motopress-new-object');
                            $this.ce_controls({ isNew: isNew });
                            var spanCtrl = $this.control(CE.Controls);
                            if (isNew && spanCtrl) {
                                spanCtrl.stylesCtrl.setDefaultAttrs();
                                var parameters = typeof $this.attr('data-motopress-parameters') !== 'undefined' ? $this.attr('data-motopress-parameters') : null;
                                spanCtrl.settingsCtrl.setDefaultAttrs(parameters);
                                spanCtrl.stylesCtrl.save();
                            }
                            var blockContent = spanEdge.children('.motopress-block-content');
                            if (blockContent.length) {
                                var shortcode = blockContent.children('[data-motopress-shortcode]');
                                CE.DragDrop.myThis.initShortcodeController(shortcode, isNew);
                                var ctrl = shortcode.control(CE.Controls);
                                if (ctrl) {
                                    isNew ? ctrl.renderShortcode(isNew) : ctrl.element.trigger('render');
                                }    
                            }
                            if (!$this.children('.motopress-clmn-select-handle').length) {
                                CE.DragDrop.myThis.makeSpanSelectable($this);
                            }
                        }
                    });
                },
                initShortcodeController: function (shortcode, isNew) {
                    var scName = shortcode.attr('data-motopress-shortcode');
                    if (isNew)
                        shortcode.addClass('motopress-new-object');
                    switch (scName) {
                    case 'mp_text':
                    case 'mp_heading':
                        shortcode.ce_inline_editor({ isNew: isNew });
                        break;
                    case 'mp_code':
                        shortcode.ce_code_editor({ isNew: isNew });
                        break;
                    default:
                        shortcode.ce_controls({ isNew: isNew });
                    }
                },
                makeEditableEmptySpan: function (obj) {
                    if (obj.length) {
                        CE.DragDrop.setEdgeSpan(obj, true, true);
                        obj.each(function () {
                            if (!$(this).children('.motopress-helper').length) {
                                $(this).append(CE.DragDrop.myThis.emptySpanHelper.clone());
                            }
                        });
                        var t = setTimeout(function () {
                            CE.DragDrop.myThis.makeDroppable();
                            clearTimeout(t);
                        }, 0);
                        this.resizer.makeSplittable(obj);
                    }
                },
                addHelpers: function (obj) {
                    obj.each(function () {
                        var span = $(this);
                        var spanEdge = parent.MP.Utils.getEdgeSpan(span);
                        if (!spanEdge.children('.motopress-block-content').length && !spanEdge.children('.motopress-row').length) {
                            spanEdge.find('script').remove().end().wrapInner(CE.DragDrop.myThis.blockContent.clone());
                            if (!spanEdge.children('.motopress-block-content').children().length) {
                                spanEdge.children('.motopress-block-content').append('<div />');
                            }
                            var scEl = spanEdge.find('.motopress-block-content > [data-motopress-shortcode]');
                            if (scEl.length && scEl.attr('data-motopress-shortcode') === 'mp_space') {
                            }
                        }
                        if (!span.children('.motopress-helper').length) {
                            if (spanEdge.children('.motopress-row').length) {
                                span.attr('data-motopress-wrapper-id', CE.DragDrop.myThis.wrapperId);
                                CE.DragDrop.myThis.setCalcWrapperWidth(spanEdge.children('.motopress-handle-middle-in'));
                                span.prepend(CE.DragDrop.myThis.wrapperHelperResizer.clone());
                                var mainWrapperHelper = null;
                                if (span.closest('.motopress-row').parent('.motopress-content-wrapper').length) {
                                    mainWrapperHelper = CE.DragDrop.myThis.wrapperHelper.clone();
                                    span.prepend(mainWrapperHelper);
                                } else {
                                    mainWrapperHelper = span.closest('.motopress-clmn:has(".motopress-wrapper-helper")').children('.motopress-wrapper-helper');
                                }
                                CE.DragDrop.myThis.wrapperId++;
                            } else {
                                span.append(CE.DragDrop.myThis.helper.clone());
                            }
                        }
                    });
                },
                setAttrs: function (block, ui) {
                    this._setAttrs(block);
                    var shortcode = block.find('> .motopress-block-content > div');
                    if (shortcode.length) {
                        var sourceEl = ui.draggable ? ui.draggable : ui.helper;
                        var source = this.getAttrsFromElement(sourceEl);
                        this._setAttrs(shortcode, source);
                    }
                },
                getAttrsFromElement: function (sourceEl) {
                    var attrs = {
                        'closeType': sourceEl.attr('data-motopress-close-type'),
                        'id': sourceEl.attr('data-motopress-shortcode'),
                        'group': sourceEl.attr('data-motopress-group'),
                        'resize': sourceEl.attr('data-motopress-resize')
                    };
                    var parameters = sourceEl.attr('data-motopress-parameters');
                    if (typeof parameters !== 'undefined')
                        attrs.parameters = parameters;
                    var styles = sourceEl.attr('data-motopress-styles');
                    if (typeof styles !== 'undefined')
                        attrs.styles = styles;
                    return attrs;
                },
                _setAttrs: function (el, source) {
                    if (typeof source === 'undefined') {
                        var obj = null;
                        if (el.hasClass('motopress-row')) {
                            obj = el.parent('.motopress-content-wrapper').length ? parent.CE.Iframe.myThis.gridObj.row.shortcode : parent.CE.Iframe.myThis.gridObj.row.inner;
                        } else {
                            if (parent.CE.Iframe.myThis.gridObj.span.type === 'multiple') {
                                var spanClass = parent.MP.Utils.getSpanClass(el.prop('class').split(' '));
                                var spanNumber = parent.MP.Utils.getSpanNumber(spanClass);
                                obj = parent.CE.Iframe.myThis.gridObj.span.shortcode[spanNumber - 1];
                            } else {
                                obj = parent.CE.Iframe.myThis.gridObj.span.shortcode;
                            }
                        }
                        CE.LeftBar.myThis.setAttrs(el, CE.LeftBar.myThis.library.mp_grid.id, CE.LeftBar.myThis.library.mp_grid.objects[obj]);
                    } else {
                        el.attr({
                            'data-motopress-close-type': source.closeType,
                            'data-motopress-shortcode': source.id,
                            'data-motopress-group': source.group,
                            'data-motopress-resize': source.resize
                        });
                        if (source.hasOwnProperty('parameters'))
                            el.attr('data-motopress-parameters', source.parameters);
                        if (source.hasOwnProperty('styles'))
                            el.attr('data-motopress-styles', source.styles);    
                    }
                },
                makeDraggable: function (obj) {
                    var $this = this;
                    var dragHandle = obj.find('.motopress-drag-handle');
                    obj.draggable({
                        cursor: 'move',
                        distance: 5,
                        helper: 'clone',
                        handle: '.motopress-drag-handle',
                        opacity: '0',
                        zIndex: 1,
                        appendTo: '.motopress-content-wrapper:first',
                        start: function (ui) {
                            CE.Utils.addSceneAction('drag');
                            CE.LeftBar.myThis.disable();
                            CE.LeftBar.myThis.hide();
                            $this.showOuterHandles();
                            $this.canDrop = true;
                            CE.Selectable.myThis.unselect(dragHandle);
                            $('.motopress-splitter').addClass('motopress-hide');
                            $(this).css('opacity', 0.3);
                            $('.motopress-content-wrapper .motopress-clmn .motopress-drag-handle').addClass('motopress-start-drag');
                        },
                        stop: function (e, ui) {
                            CE.Utils.removeSceneAction('drag');
                            CE.LeftBar.myThis.enable();
                            CE.LeftBar.myThis.show();
                            $this.hideOuterHandles();
                            $('.motopress-splitter').removeClass('motopress-hide');
                            $(this).css('opacity', '');
                            $('.motopress-content-wrapper .motopress-clmn .motopress-drag-handle').removeClass('motopress-start-drag');
                            CE.Selectable.myThis.select(dragHandle);
                            CE.DragDrop.myThis.helperContainer.children().hide();
                        },
                        drag: function () {
                            CE.DragDrop.myThis.onDrag();
                        }
                    }).removeClass('ui-draggable');
                },
                makeDraggableNewBlock: function () {
                    var $this = this, cursorAt = {
                            top: -10,
                            left: -10
                        }, contentWrapper = $('.motopress-content-wrapper:first'), contentWrapperTop = contentWrapper.length ? contentWrapper.offset().top : 0;
                    $('.motopress-ce-object').draggable({
                        cursor: 'move',
                        cursorAt: cursorAt,
                        helper: 'clone',
                        zIndex: 10002,
                        appendTo: '.motopress-content-wrapper:first',
                        start: function (e, ui) {
                            CE.Utils.addSceneAction('drag');
                            CE.LeftBar.myThis.disable();
                            CE.LeftBar.myThis.hide();
                            $this.showOuterHandles();
                            $this.canDrop = true;
                            ui.position.top = e.pageY - contentWrapperTop - cursorAt.top;
                            var selectedDragHandle = $('.motopress-content-wrapper .motopress-clmn .motopress-drag-handle.' + CE.Selectable.myThis.selectedClass);
                            if (selectedDragHandle.length)
                                CE.Selectable.myThis.unselect(selectedDragHandle);
                            $('.motopress-empty-scene-type-here').addClass('motopress-empty-scene-type-here-nohover');
                            ui.helper.children('.motopress-ce-object-inner').css('cssText', 'box-shadow: none !important');
                            $('.motopress-splitter').addClass('motopress-hide');
                            $('.motopress-content-wrapper .motopress-clmn .motopress-drag-handle').addClass('motopress-start-drag');
                            ui.helper.data('dropped', false);
                        },
                        stop: function (e, ui) {
                            CE.Utils.removeSceneAction('drag');
                            CE.LeftBar.myThis.enable();
                            CE.LeftBar.myThis.show();
                            $this.hideOuterHandles();
                            $('.motopress-empty-scene-type-here').removeClass('motopress-empty-scene-type-here-nohover');
                            $('.motopress-splitter').removeClass('motopress-hide');
                            $('.motopress-content-wrapper .motopress-clmn .motopress-drag-handle').removeClass('motopress-start-drag');
                            if (ui.helper.data('dropped') === false) {
                                var dropped = CE.DragDrop.myThis.dropOnStageHandler(e, ui);
                                if (dropped)
                                    parent.CE.Save.changeContent();
                            }
                            CE.DragDrop.myThis.helperContainer.children().hide();
                        },
                        drag: function (e, ui) {
                            ui.position.top = e.pageY - contentWrapperTop - cursorAt.top;
                            CE.DragDrop.myThis.onDrag();
                        }
                    });
                },
                onDrag: function () {
                    var handleEl = this.container.find('.motopress-droppable-hover');
                    if (handleEl.length) {
                        var curHandle = handleEl.attr('data-motopress-position');
                        if (curHandle !== null) {
                            var helpers = '.motopress-line-helper-' + curHandle + ', .motopress-text-helper-' + curHandle;
                            var children = this.helperContainer.children();
                            children.not(helpers).hide();
                            children.filter(helpers).show();
                        }
                    } else {
                        this.helperContainer.children().hide();
                    }
                },
                dropOnStageHandler: function (e, ui) {
                    var isNewBlock = ui.helper.hasClass('motopress-ce-object');
                    var lastMiddleIn = $('.motopress-content-wrapper').find('.motopress-handle-middle-in:last');
                    if (isNewBlock && lastMiddleIn && lastMiddleIn.hasClass('motopress-handle-middle-in')) {
                        var rowFrom, rowTo, myUI = null;
                        var _dragDrop = CE.DragDrop.myThis;
                        var block = _dragDrop.newBlock.clone();
                        if (ui.helper.attr('data-motopress-shortcode') === 'mp_space') {
                            block.addClass(_dragDrop.spaceClass);
                        }
                        _dragDrop.makeEditable(block, ui, true);
                        var spanClassDraggable = parent.MP.Utils.getSpanClass(block.prop('class').split(' '));
                        rowTo = CE.DragDrop.myThis.rowHtml.clone().find('.motopress-filler-content').replaceWith(block).end();
                        lastMiddleIn.after(rowTo);
                        CE.DragDrop.myThis.makeRowEditable(rowTo, isNewBlock);
                        var droppableTimeout = setTimeout(function () {
                            _dragDrop.addHandleMiddle(rowTo, 'motopress-content-wrapper');
                            _dragDrop.resize(rowFrom, block, 'middle');
                            var dragHandle = block.find('.motopress-drag-handle');
                            CE.Selectable.myThis.select(dragHandle);
                            _dragDrop.makeDroppable();
                            CE.Resizer.myThis.updateSplittableOptions(block, rowFrom, rowTo);
                            CE.Resizer.myThis.updateAllHandles();
                            clearTimeout(droppableTimeout);
                        }, 0);
                        return true;
                    }
                    return false;
                },
                makeEmptySceneHelperDroppable: function () {
                    var $this = this;
                    this.emptySceneDroppable.droppable({
                        accept: '.motopress-ce-object',
                        tolerance: 'pointer',
                        drop: function (e, ui) {
                            if (!$this.canDrop) {
                                return false;
                            } else {
                                $this.canDrop = false;
                            }
                            CE.DragDrop.myThis.emptySceneHelper.hide();
                            $(this).css('opacity', 1);
                            var span = $(this).closest('.motopress-clmn');
                            if (span.length == 0)
                                span = $(this);
                            var spanClass = parent.MP.Utils.getSpanClass(span.prop('class').split(' '));
                            var spanClassDraggable = null;
                            var rowFrom = null;
                            var rowTo = $(this).closest('.motopress-row');
                            var myUI = null;
                            var block = null;
                            var isNewBlock = ui.draggable.hasClass('motopress-ce-object');
                            if (!isNewBlock) {
                                myUI = ui;
                                block = myUI.draggable;
                                rowFrom = block.parent('.motopress-row');    
                            } else {
                                myUI = null;
                                block = CE.DragDrop.myThis.newBlock.clone();
                                if (ui.draggable.attr('data-motopress-shortcode') === 'mp_space') {
                                    block.addClass(CE.DragDrop.myThis.spaceClass);
                                }
                                CE.DragDrop.myThis.makeEditable(block, ui, true);
                                rowFrom = null;
                            }
                            spanClassDraggable = parent.MP.Utils.getSpanClass(block.prop('class').split(' '));
                            spanClassDraggable = CE.DragDrop.myThis.removeEmptyBlocks(block, spanClassDraggable);
                            var flag = false;
                            if (spanClass == null) {
                                spanClass = parent.CE.Iframe.myThis.gridObj.span.fullclass;
                                flag = true;
                            }
                            rowTo = CE.DragDrop.myThis.rowHtml.clone().find('.motopress-filler-content').replaceWith(block).end();
                            $('.motopress-content-wrapper').append(rowTo);
                            CE.DragDrop.myThis.makeRowEditable(rowTo, isNewBlock);
                            var t = setTimeout(function () {
                                rowFrom = CE.DragDrop.myThis.clearIfEmpty(rowFrom);
                                if (flag)
                                    spanClass = 'motopress-content-wrapper';
                                CE.DragDrop.myThis.addHandleMiddle(rowTo, spanClass);
                                CE.DragDrop.myThis.resize(rowFrom, block, 'middle');
                                clearTimeout(t);
                            }, 0);
                            var droppableTimeout = setTimeout(function () {
                                var dragHandle = block.find('.motopress-drag-handle');
                                CE.Selectable.myThis.select(dragHandle);
                                CE.DragDrop.myThis.makeDroppable();
                                CE.Resizer.myThis.updateSplittableOptions(block, rowFrom, rowTo);
                                CE.Resizer.myThis.updateAllHandles();
                                clearTimeout(droppableTimeout);
                            }, 0);
                            parent.CE.Save.changeContent();
                            CE.Utils.removeSceneState('empty-scene');
                        },
                        over: function () {
                            $(this).css('opacity', 0.5);
                        },
                        out: function () {
                            $(this).css('opacity', 1);
                        }
                    });
                },
                makeDroppable: function () {
                    var $this = this;
                    $('.motopress-content-wrapper').find('.motopress-handle-intermediate, .motopress-handle-left, .motopress-handle-top-in, .motopress-handle-bottom-in, .motopress-handle-left-out, .motopress-handle-right-out, .motopress-handle-left-in, .motopress-handle-right-in, .motopress-handle-middle-in, .motopress-handle-insert, .motopress-handle-right').droppable({
                        accept: '.motopress-clmn, .motopress-ce-object',
                        tolerance: 'pointer',
                        hoverClass: 'motopress-droppable-hover',
                        drop: function (e, ui) {
                            var handle = $(this).attr('data-motopress-position');
                            if (typeof $this.hoveredHandles !== 'undefined' && $this.hoveredHandles.length > 1 && $this.hoveredHandles.filter('.motopress-handle-left, .motopress-handle-right').length) {
                                if ($.inArray(handle, [
                                        'left',
                                        'right'
                                    ]) > -1) {
                                    $this.canDrop = true;
                                } else {
                                    return false;
                                }
                            }
                            if (!$this.canDrop) {
                                return false;
                            } else {
                                $this.canDrop = false;
                            }
                            ui.helper.data('dropped', true);
                            var span = $(this).closest('.motopress-clmn');
                            if (span.length === 0)
                                span = $(this);
                            var spanClass = parent.MP.Utils.getSpanClass(span.prop('class').split(' '));
                            var spanClassDraggable = null;
                            var rowFrom = null;
                            var rowTo = $(this).closest('.motopress-row');
                            var rowToEdge = parent.MP.Utils.getEdgeRow(rowTo);
                            var fromPos = null, toPos = null;
                            var myUI = null;
                            var block = null;
                            var isNewBlock = ui.draggable.hasClass('motopress-ce-object');
                            if (!isNewBlock) {
                                myUI = ui;
                                block = myUI.draggable;
                                rowFrom = block.closest('.motopress-row');    
                            } else {
                                myUI = null;
                                block = CE.DragDrop.myThis.newBlock.clone();
                                if (ui.draggable.attr('data-motopress-shortcode') === 'mp_space') {
                                    block.addClass(CE.DragDrop.myThis.spaceClass);
                                }
                                CE.DragDrop.myThis.makeEditable(block, ui, true);
                                rowFrom = null;
                            }
                            var newSizes;
                            var _blockPrev = null;
                            if (rowFrom !== null    ) {
                                var rowFromEdge = parent.MP.Utils.getEdgeRow(rowFrom);
                                fromPos = rowFromEdge.children('.motopress-clmn').index(block);
                                _blockPrev = block.prev();
                                if (_blockPrev.length && _blockPrev.hasClass('motopress-empty')) {
                                    fromPos--;
                                }
                            }
                            toPos = rowToEdge.children('.motopress-clmn');
                            spanClassDraggable = parent.MP.Utils.getSpanClass(block.prop('class').split(' '));
                            spanClassDraggable = CE.DragDrop.myThis.removeEmptyBlocks(block, spanClassDraggable);
                            switch (handle) {
                            case 'top-in':
                                toPos = 0;
                                if ((newSizes = CE.DragDrop.myThis.canBeMoved(rowFrom, null, fromPos, toPos, myUI)) !== false) {
                                    var draggableSpanInRow = CE.DragDrop.myThis.rowInnerHtml.clone().find('.motopress-filler-content').replaceWith(block).end();
                                    var wrapperSpan = CE.DragDrop.myThis.spanHtml.clone().addClass(spanClass);
                                    CE.DragDrop.setEdgeSpan(wrapperSpan);
                                    span.before(wrapperSpan);
                                    var innerRow = CE.DragDrop.myThis.rowInnerHtml.clone().find('.motopress-filler-content').replaceWith(span).end();
                                    wrapperSpan.find('.motopress-filler-content').replaceWith(innerRow);
                                    innerRow.before(draggableSpanInRow);
                                    CE.DragDrop.myThis.makeRowEditable(draggableSpanInRow.add(innerRow), isNewBlock);
                                    wrapperSpan.attr({ 'data-motopress-wrapper-id': CE.DragDrop.myThis.wrapperId }).prepend(CE.DragDrop.myThis.wrapperHelperResizer.clone());
                                    CE.DragDrop.myThis.resizer.makeSplittable(wrapperSpan);
                                    var mainWrapperHelper = null;
                                    if (wrapperSpan.closest('.motopress-row').parent('.motopress-content-wrapper').length) {
                                        mainWrapperHelper = CE.DragDrop.myThis.wrapperHelper.clone();
                                        wrapperSpan.prepend(mainWrapperHelper);
                                    } else {
                                        mainWrapperHelper = wrapperSpan.closest('.motopress-clmn:has(".motopress-wrapper-helper")').children('.motopress-wrapper-helper');
                                    }
                                    CE.DragDrop.myThis.makeEditable(wrapperSpan, ui, true);
                                    CE.DragDrop.myThis.wrapperId++;
                                    var t = setTimeout(function () {
                                        rowFrom = CE.DragDrop.myThis.clearIfEmpty(rowFrom);
                                        CE.DragDrop.myThis.addHandleMiddle(innerRow, spanClass);
                                        CE.DragDrop.myThis.resize(rowFrom, block, 'top-in', newSizes);
                                        clearTimeout(t);
                                    }, 0);
                                }
                                break;
                            case 'bottom-in':
                                toPos = 0;
                                if ((newSizes = CE.DragDrop.myThis.canBeMoved(rowFrom, null, fromPos, toPos, myUI)) !== false) {
                                    var draggableSpanInRow = CE.DragDrop.myThis.rowInnerHtml.clone().find('.motopress-filler-content').replaceWith(block).end();
                                    var wrapperSpan = CE.DragDrop.myThis.spanHtml.clone().addClass(spanClass);
                                    CE.DragDrop.setEdgeSpan(wrapperSpan);
                                    span.before(wrapperSpan);
                                    var innerRow = CE.DragDrop.myThis.rowInnerHtml.clone().find('.motopress-filler-content').replaceWith(span).end();
                                    wrapperSpan.find('.motopress-filler-content').replaceWith(innerRow);
                                    innerRow.after(draggableSpanInRow);
                                    CE.DragDrop.myThis.makeRowEditable(draggableSpanInRow.add(innerRow), isNewBlock);
                                    wrapperSpan.attr({ 'data-motopress-wrapper-id': CE.DragDrop.myThis.wrapperId }).prepend(CE.DragDrop.myThis.wrapperHelperResizer.clone());
                                    CE.DragDrop.myThis.resizer.makeSplittable(wrapperSpan);
                                    var mainWrapperHelper = null;
                                    if (wrapperSpan.closest('.motopress-row').parent('.motopress-content-wrapper').length) {
                                        mainWrapperHelper = CE.DragDrop.myThis.wrapperHelper.clone();
                                        wrapperSpan.prepend(mainWrapperHelper);
                                    } else {
                                        mainWrapperHelper = wrapperSpan.closest('.motopress-clmn:has(".motopress-wrapper-helper")').children('.motopress-wrapper-helper');
                                    }
                                    CE.DragDrop.myThis.makeEditable(wrapperSpan, ui, true);
                                    CE.DragDrop.myThis.wrapperId++;
                                    var t = setTimeout(function () {
                                        rowFrom = CE.DragDrop.myThis.clearIfEmpty(rowFrom);
                                        CE.DragDrop.myThis.addHandleMiddle(innerRow, spanClass);
                                        CE.DragDrop.myThis.resize(rowFrom, block, 'bottom-in', newSizes);
                                        clearTimeout(t);
                                    }, 0);
                                }
                                break;
                            case 'left-out':
                            case 'left':
                            case 'intermediate':
                                toPos = handle === 'left' ? 0 : toPos.index(span);
                                toPos = toPos < 0 ? 0 : toPos;
                                if ((newSizes = CE.DragDrop.myThis.canBeMoved(rowFrom, rowTo, fromPos, toPos, myUI, 'out')) !== false) {
                                    if (span.parent().length)
                                        span.before(block);
                                    var t = setTimeout(function () {
                                        rowFrom = CE.DragDrop.myThis.clearIfEmpty(rowFrom);
                                        if (rowFrom === null || rowFrom[0] !== rowTo[0]) {
                                            CE.DragDrop.myThis.resize(rowFrom, block, 'left-out', newSizes);
                                        } else {
                                            var containsSpanNumber = parent.MP.Utils.calcSpanNumber(rowFrom, myUI);
                                            CE.Resizer.myThis.changeSpanClass(block, parent.CE.Iframe.myThis.gridObj.span.class + (parent.CE.Iframe.myThis.gridObj.row.col - containsSpanNumber));
                                        }
                                        clearTimeout(t);
                                    }, 0);
                                }
                                break;
                            case 'right-out':
                            case 'right':
                                toPos = handle === 'right' ? toPos.length : toPos.index(span) + 1;
                                if ((newSizes = CE.DragDrop.myThis.canBeMoved(rowFrom, rowTo, fromPos, toPos, myUI, 'out')) !== false) {
                                    if (span.parent().length)
                                        span.after(block);
                                    var t = setTimeout(function () {
                                        rowFrom = CE.DragDrop.myThis.clearIfEmpty(rowFrom);
                                        if (rowFrom === null || rowFrom[0] !== rowTo[0]) {
                                            CE.DragDrop.myThis.resize(rowFrom, block, 'right-out', newSizes);
                                        } else {
                                            var containsSpanNumber = parent.MP.Utils.calcSpanNumber(rowFrom, myUI);
                                            CE.Resizer.myThis.changeSpanClass(block, parent.CE.Iframe.myThis.gridObj.span.class + (parent.CE.Iframe.myThis.gridObj.row.col - containsSpanNumber));
                                        }
                                        clearTimeout(t);
                                    }, 0);
                                }
                                break;
                            case 'left-in':
                                toPos = 0;
                                if (parent.MP.Utils.getSpanNumber(spanClass) > 1 && (newSizes = CE.DragDrop.myThis.canBeMoved(rowFrom, rowTo, fromPos, toPos, myUI, 'left-in', span)) !== false) {
                                    var wrapperSpan = CE.DragDrop.myThis.spanHtml.clone().addClass(spanClass);
                                    CE.DragDrop.setEdgeSpan(wrapperSpan);
                                    span.before(wrapperSpan);
                                    var innerRow = CE.DragDrop.myThis.rowInnerHtml.clone().find('.motopress-filler-content').replaceWith(span).end();
                                    wrapperSpan.find('.motopress-filler-content').replaceWith(innerRow);
                                    span.before(block);
                                    CE.DragDrop.myThis.makeRowEditable(innerRow, isNewBlock);
                                    wrapperSpan.attr({ 'data-motopress-wrapper-id': CE.DragDrop.myThis.wrapperId }).prepend(CE.DragDrop.myThis.wrapperHelperResizer.clone());
                                    CE.DragDrop.myThis.resizer.makeSplittable(wrapperSpan);
                                    var mainWrapperHelper = null;
                                    if (wrapperSpan.closest('.motopress-row').parent('.motopress-content-wrapper').length) {
                                        mainWrapperHelper = CE.DragDrop.myThis.wrapperHelper.clone();
                                        wrapperSpan.prepend(mainWrapperHelper);
                                    } else {
                                        mainWrapperHelper = wrapperSpan.closest('.motopress-clmn:has(".motopress-wrapper-helper")').children('.motopress-wrapper-helper');
                                    }
                                    CE.DragDrop.myThis.makeEditable(wrapperSpan, ui, true);
                                    CE.DragDrop.myThis.wrapperId++;
                                    var t = setTimeout(function () {
                                        rowFrom = CE.DragDrop.myThis.clearIfEmpty(rowFrom);
                                        CE.DragDrop.myThis.addHandleMiddle(innerRow, spanClass);
                                        CE.DragDrop.myThis.resize(rowFrom, block, 'left-in', newSizes);
                                        clearTimeout(t);
                                    }, 0);
                                }
                                break;
                            case 'right-in':
                                toPos = 1;
                                if (parent.MP.Utils.getSpanNumber(spanClass) > 1 && (newSizes = CE.DragDrop.myThis.canBeMoved(rowFrom, rowTo, fromPos, toPos, myUI, 'right-in', span)) !== false) {
                                    var wrapperSpan = CE.DragDrop.myThis.spanHtml.clone().addClass(spanClass);
                                    CE.DragDrop.setEdgeSpan(wrapperSpan);
                                    span.before(wrapperSpan);
                                    var innerRow = CE.DragDrop.myThis.rowInnerHtml.clone().find('.motopress-filler-content').replaceWith(span).end();
                                    wrapperSpan.find('.motopress-filler-content').replaceWith(innerRow);
                                    span.after(block);
                                    CE.DragDrop.myThis.makeRowEditable(innerRow, isNewBlock);
                                    wrapperSpan.attr({ 'data-motopress-wrapper-id': CE.DragDrop.myThis.wrapperId }).prepend(CE.DragDrop.myThis.wrapperHelperResizer.clone());
                                    CE.DragDrop.myThis.resizer.makeSplittable(wrapperSpan);
                                    var mainWrapperHelper = null;
                                    if (wrapperSpan.closest('.motopress-row').parent('.motopress-content-wrapper').length) {
                                        mainWrapperHelper = CE.DragDrop.myThis.wrapperHelper.clone();
                                        wrapperSpan.prepend(mainWrapperHelper);
                                    } else {
                                        mainWrapperHelper = wrapperSpan.closest('.motopress-clmn:has(".motopress-wrapper-helper")').children('.motopress-wrapper-helper');
                                    }
                                    CE.DragDrop.myThis.makeEditable(wrapperSpan, ui, true);
                                    CE.DragDrop.myThis.wrapperId++;
                                    var t = setTimeout(function () {
                                        rowFrom = CE.DragDrop.myThis.clearIfEmpty(rowFrom);
                                        CE.DragDrop.myThis.addHandleMiddle(innerRow, spanClass);
                                        CE.DragDrop.myThis.resize(rowFrom, block, 'right-in', newSizes);
                                        clearTimeout(t);
                                    }, 0);
                                }
                                break;
                            case 'middle-in':
                                toPos = 0;
                                if ((newSizes = CE.DragDrop.myThis.canBeMoved(rowFrom, null, fromPos, toPos, myUI)) !== false) {
                                    var flag = false;
                                    if (spanClass == null) {
                                        spanClass = parent.CE.Iframe.myThis.gridObj.span.fullclass + ' motopress-clmn';
                                        flag = true;
                                    }
                                    var minHeight = parseInt($(this).css('min-height'));
                                    $(this).siblings('.motopress-handle-middle-in').add(this).each(function () {
                                        $(this).height(minHeight);
                                    });
                                    $('.motopress-content-wrapper > .motopress-handle-middle-in:last').height('');
                                    if ($(this).parent('.motopress-content-wrapper').length) {
                                        rowTo = CE.DragDrop.myThis.rowHtml.clone().find('.motopress-filler-content').replaceWith(block).end();
                                    } else {
                                        rowTo = CE.DragDrop.myThis.rowInnerHtml.clone().find('.motopress-filler-content').replaceWith(block).end();
                                    }
                                    $(this).after(rowTo);
                                    CE.DragDrop.myThis.makeRowEditable(rowTo, isNewBlock);
                                    rowToEdge = parent.MP.Utils.getEdgeRow(rowTo);
                                    var t = setTimeout(function () {
                                        rowFrom = CE.DragDrop.myThis.clearIfEmpty(rowFrom);
                                        if (flag)
                                            spanClass = 'motopress-content-wrapper';
                                        CE.DragDrop.myThis.addHandleMiddle(rowTo, spanClass);
                                        CE.DragDrop.myThis.resize(rowFrom, block, 'middle', newSizes);
                                        clearTimeout(t);
                                    }, 0);
                                }
                                break;
                            case 'insert':
                                var dropSpanClass = parent.MP.Utils.getSpanClass(span.prop('class').split(' '));
                                if (span.parent().length)
                                    span.replaceWith(block);
                                $this.resizer.changeSpanClass(block, dropSpanClass);
                                toPos = toPos.index(span);
                                if (rowFrom) {
                                    newSizes = CE.DragDrop.myThis.canBeMoved(rowFrom, null, fromPos, toPos, myUI, 'insert');
                                    var t = setTimeout(function () {
                                        rowFrom = CE.DragDrop.myThis.clearIfEmpty(rowFrom);
                                        CE.DragDrop.myThis.resize(rowFrom, block, 'insert', newSizes);
                                        clearTimeout(t);
                                    }, 0);
                                }
                                break;
                            }
                            var droppableTimeout = setTimeout(function () {
                                var dragHandle = block.find('.motopress-drag-handle');
                                CE.Selectable.myThis.select(dragHandle);
                                CE.DragDrop.myThis.makeDroppable();
                                CE.Resizer.myThis.updateSplittableOptions(block, rowFrom, rowTo);
                                CE.Resizer.myThis.updateAllHandles();
                                $(window).trigger('resize');
                                var shortcodes, shortcodeName, apiParams = {};
                                apiParams.involvedElements = {};
                                apiParams.droppedElement = block;
                                if (rowFrom && rowFrom.length) {
                                    shortcodes = rowFrom.find('.motopress-block-content > [data-motopress-shortcode]');
                                    if (shortcodes.length) {
                                        shortcodes.each(function () {
                                            shortcodeName = $(this).attr('data-motopress-shortcode');
                                            if (!apiParams.involvedElements.hasOwnProperty(shortcodeName))
                                                apiParams.involvedElements[shortcodeName] = [];
                                            if ($.inArray(this, apiParams.involvedElements[shortcodeName]) === -1) {
                                                apiParams.involvedElements[shortcodeName].push(this);
                                            }
                                        });
                                    }
                                }
                                if (rowTo && rowTo.length) {
                                    shortcodes = rowTo.find('.motopress-block-content > [data-motopress-shortcode]');
                                    if (shortcodes.length) {
                                        shortcodes.each(function () {
                                            shortcodeName = $(this).attr('data-motopress-shortcode');
                                            if (!apiParams.involvedElements.hasOwnProperty(shortcodeName))
                                                apiParams.involvedElements[shortcodeName] = [];
                                            if ($.inArray(this, apiParams.involvedElements[shortcodeName]) === -1) {
                                                apiParams.involvedElements[shortcodeName].push(this);
                                            }
                                        });
                                    }
                                }
                                $this.bodyEl.trigger('MPCEObjectDrop', apiParams);
                                clearTimeout(droppableTimeout);
                            }, 0);
                            parent.CE.Save.changeContent();
                        },
                        over: function () {
                            $this.hoveredHandles = $this.container.find('.motopress-droppable-hover');
                            var handle = $(this).attr('data-motopress-position');
                            var span = handle !== 'middle-in' ? $(this).closest('.motopress-clmn') : $(this);
                            CE.DragDrop.myThis.showLineTextHelper(span, handle    );
                        },
                        out: function () {
                            $this.hoveredHandles = $this.container.find('.motopress-droppable-hover');
                            var handle = $(this).attr('data-motopress-position');
                            $this.onDrag();
                        }
                    });
                },
                showLineTextHelper: function (span, handle) {
                    var spanOffset = span.offset(), spanLeft = spanOffset.left, spanTop = spanOffset.top, row = span.closest('.motopress-row'), rowEdge = parent.MP.Utils.getEdgeRow(row), rowEdgeHeight = rowEdge.height(), rowEdgeTop = rowEdge.offset().top, rowEdgeBorderTop = parseFloat(rowEdge.css('border-top-width')), rowEdgePaddingTop = parseFloat(rowEdge.css('padding-top')), linePiece, lineWidth, lineLeft, textLeft, width, lineBorder = 1, lineBorders = lineBorder * 2, nextSpan, lineHelper, textHelper;
                    if ($.inArray(handle, [
                            'intermediate',
                            'left-out',
                            'right-out',
                            'left',
                            'right'
                        ]) >= 0) {
                        width = Math.floor(span.children('.motopress-helper, .motopress-wrapper-helper').find('.motopress-handle-intermediate').width());
                        if (width > 4) {
                            linePiece = 2;
                            lineWidth = width - 4;
                            lineLeft = width - linePiece;
                        } else {
                            linePiece = 1;
                            lineWidth = lineLeft = width;
                        }
                        var leftShift = 0;
                        if (!CE.Grid.myThis.padding) {
                            leftShift = linePiece / 2;
                        }
                    }
                    switch (handle) {
                    case 'intermediate':
                        this.lineHelperIntermediate.css({
                            width: lineWidth,
                            height: rowEdgeHeight,
                            top: rowEdgeTop + rowEdgePaddingTop + rowEdgeBorderTop,
                            left: Math.ceil(spanLeft + CE.Grid.myThis.padding - lineLeft - leftShift)    
                        }).show();
                        this.textHelperIntermediate.css({
                            top: this.lineHelperIntermediate.offset().top,
                            left: this.lineHelperIntermediate.offset().left + lineWidth
                        }).show();
                        break;
                    case 'left':
                    case 'left-out':
                        if (handle === 'left') {
                            lineHelper = this.lineHelperLeft;
                            textHelper = this.textHelperLeft;
                        } else {
                            lineHelper = this.lineHelperLeftOut;
                            textHelper = this.textHelperLeftOut;
                        }
                        lineLeft = spanLeft + CE.Grid.myThis.padding + lineBorder;
                        lineWidth = 0;
                        lineHelper.css({
                            width: lineWidth,
                            height: rowEdgeHeight,
                            top: rowEdgeTop + rowEdgePaddingTop + rowEdgeBorderTop,
                            left: lineLeft
                        }).show();
                        textHelper.css({
                            top: lineHelper.offset().top,
                            left: lineLeft + lineWidth
                        }).show();
                        break;
                    case 'right':
                    case 'right-out':
                        if (handle === 'right') {
                            lineHelper = this.lineHelperRight;
                            textHelper = this.textHelperRight;
                        } else {
                            lineHelper = this.lineHelperRightOut;
                            textHelper = this.textHelperRightOut;
                        }
                        var docWidth = $(document).width();
                        lineLeft = spanLeft + span.outerWidth() - CE.Grid.myThis.padding;
                        if (lineLeft >= docWidth)
                            lineLeft = docWidth - lineBorder;
                        lineWidth = 0;
                        textLeft = lineLeft - textHelper.outerWidth();
                        lineHelper.css({
                            width: lineWidth,
                            height: rowEdgeHeight,
                            top: rowEdgeTop + rowEdgePaddingTop + rowEdgeBorderTop,
                            left: lineLeft
                        }).show();
                        textHelper.css({
                            top: lineHelper.offset().top,
                            left: textLeft
                        }).show();
                        break;
                    case 'left-in':
                        this.lineHelperLeftIn.css({
                            height: span.outerHeight(),
                            top: spanTop,
                            left: spanLeft + CE.Grid.myThis.padding
                        }).show();
                        this.textHelperLeftIn.css({
                            top: this.lineHelperLeftIn.offset().top,
                            left: this.lineHelperLeftIn.offset().left + this.lineHelperThickness
                        }).show();
                        break;
                    case 'right-in':
                        this.lineHelperRightIn.css({
                            height: span.outerHeight(),
                            top: spanTop,
                            left: spanLeft + span.outerWidth() - this.lineHelperThickness - CE.Grid.myThis.padding
                        }).show();
                        this.textHelperRightIn.css({
                            top: this.lineHelperRightIn.offset().top,
                            left: this.lineHelperRightIn.offset().left - this.textHelperRightIn.outerWidth()
                        }).show();
                        break;
                    case 'top-in':
                        this.lineHelperTopIn.css({
                            width: span.outerWidth(),
                            top: spanTop,
                            left: spanLeft
                        }).show();
                        this.textHelperTopIn.css({
                            top: spanTop,
                            left: spanLeft
                        }).show();
                        break;
                    case 'bottom-in':
                        this.lineHelperBottomIn.css({
                            width: span.outerWidth(),
                            top: spanTop + span.outerHeight() - this.lineHelperThickness,
                            left: spanLeft
                        }).show();
                        this.textHelperBottomIn.css({
                            top: this.lineHelperBottomIn.offset().top,
                            left: this.lineHelperBottomIn.offset().left
                        }).show();
                        break;
                    case 'middle-in':
                        var width = span.outerWidth();
                        var height = span.height() - parseInt(this.lineHelperHandleMiddle.css('outline-width')) * 2;
                        var top = spanTop + parseInt(this.lineHelperHandleMiddle.css('outline-width'));
                        var left = spanLeft - CE.Grid.myThis.padding;
                        var handleMiddleFirst = $('.motopress-content-wrapper > .motopress-handle-middle-in:first');
                        if (span[0] === handleMiddleFirst[0] || span[0] === $('.motopress-content-wrapper > .motopress-handle-middle-in:last')[0]) {
                            var contentWrapper = $('.motopress-content-wrapper');
                            var contentWrapperOffset = contentWrapper.offset();
                            var row = contentWrapper.find('.motopress-row');
                            width = contentWrapper.width();
                            height = 20;
                            if (span[0] === handleMiddleFirst[0]) {
                                top = contentWrapperOffset.top - height;
                            }
                            left = contentWrapperOffset.left - CE.Grid.myThis.padding;
                        }
                        this.lineHelperHandleMiddle.css({
                            width: width + CE.Grid.myThis.padding * 2,
                            height: height,
                            top: top,
                            left: left
                        }).show();
                        var lineHelperOffset = this.lineHelperHandleMiddle.offset();
                        this.textHelperHandleMiddle.css({
                            top: lineHelperOffset.top,
                            left: lineHelperOffset.left
                        }).show();
                        break;
                    case 'insert':
                        lineLeft = spanLeft + CE.Grid.myThis.padding;
                        textLeft = lineLeft - this.textHelperInsert.outerWidth();
                        if (textLeft < 0)
                            textLeft = lineLeft + span.width() + lineBorder;
                        this.lineHelperInsert.css({
                            width: span.width(),
                            height: span.outerHeight(),
                            left: lineLeft,
                            top: spanTop
                        }).show();
                        this.textHelperInsert.css({
                            top: this.lineHelperInsert.offset().top,
                            left: textLeft
                        }).show();
                        break;
                    }
                },
                removeEmptyBlocks: function (block, spanClassDraggable) {
                    var prevEmpty = block.prev('.motopress-empty');
                    var nextEmpty = block.next('.motopress-empty');
                    var prevEmptySpanNumber = 0;
                    var nextEmptySpanNumber = 0;
                    if (typeof prevEmpty[0] != 'undefined')
                        prevEmptySpanNumber = parent.MP.Utils.getSpanNumber(parent.MP.Utils.getSpanClass(prevEmpty.prop('class').split(' ')));
                    if (typeof nextEmpty[0] != 'undefined')
                        nextEmptySpanNumber = parent.MP.Utils.getSpanNumber(parent.MP.Utils.getSpanClass(nextEmpty.prop('class').split(' ')));
                    if (typeof prevEmpty[0] != 'undefined' || typeof nextEmpty[0] != 'undefined') {
                        block.removeClass(spanClassDraggable);
                        spanClassDraggable = parent.CE.Iframe.myThis.gridObj.span.class + (parent.MP.Utils.getSpanNumber(spanClassDraggable) + prevEmptySpanNumber + nextEmptySpanNumber);
                        block.addClass(spanClassDraggable);
                        prevEmpty.remove();
                        nextEmpty.remove();
                    }
                    return spanClassDraggable;
                },
                clearIfEmpty: function (rowFrom, action) {
                    if (typeof action === 'undefined')
                        action = 'default';
                    if (rowFrom !== null) {
                        var rowFromEdge = parent.MP.Utils.getEdgeRow(rowFrom);
                        var parentSpan = rowFrom.parent();
                        var rowFromChildren = rowFromEdge.children('.motopress-clmn');
                        if (!rowFromChildren.length) {
                            var i = 0;
                            while (rowFrom.parent('.motopress-content-wrapper').length === 0) {
                                if (!rowFrom.siblings('.motopress-row, .motopress-clmn').length && !rowFrom.parent('.motopress-content-wrapper').length) {
                                    if (rowFrom.parent('.motopress-clmn').length) {
                                        var wrapperId = rowFrom.parent('.motopress-clmn').attr('data-motopress-wrapper-id');
                                        $('[data-motopress-wrapper-id="' + wrapperId + '"].motopress-handle-wrapper').remove();
                                    }
                                    rowFrom.siblings('.motopress-handle-middle-in, .motopress-wrapper-helper, .motopress-helper').remove().end().unwrap();
                                } else {
                                    break;
                                }
                                i++;
                                if (i === 100) {
                                    console.log('LOOPED IN `clearIfEmpty()`');
                                    break;
                                }
                            }
                            var flag = false;
                            var newRowFrom = null;
                            if (!rowFrom.siblings('.motopress-row').length) {
                                flag = true;
                                if (rowFrom.parent(':not(.motopress-content-wrapper)').length) {
                                    newRowFrom = rowFrom.parent();
                                } else if (rowFrom.parent('.motopress-row').length) {
                                    newRowFrom = rowFrom.parent('.motopress-row');
                                }
                            }
                            rowFrom.prev('.motopress-handle-middle-in').remove().end().remove();
                            if (typeof parentSpan !== 'undefined' && parentSpan !== null && !parentSpan.hasClass('motopress-content-wrapper')) {
                                var parentSpanInnerRow = parentSpan.children('.motopress-row');
                                if (parentSpanInnerRow.length === 1) {
                                    var parentSpanInnerRowEdge = parent.MP.Utils.getEdgeRow(parentSpanInnerRow);
                                    var parentSpanInnerSpan = parentSpanInnerRowEdge.children('.motopress-clmn:not(.motopress-empty)');
                                    if (parentSpanInnerSpan.length === 1) {
                                        var sClass1 = parent.MP.Utils.getSpanClass(parentSpanInnerSpan.prop('class').split(' '));
                                        var sClass2 = parent.MP.Utils.getSpanClass(parentSpan.prop('class').split(' '));
                                        CE.Resizer.myThis.changeSpanClass(parentSpanInnerSpan, sClass2);
                                        parentSpan.replaceWith(parentSpanInnerSpan);
                                    }
                                }
                            }
                            return flag ? newRowFrom : rowFrom;    
                        } else if (rowFromChildren.length === 1 && !rowFrom.parent('.motopress-content-wrapper').length) {
                            var children, siblings, parentWrapper, replacementSpan = null;
                            rowFromChildren.parentsUntil('.motopress-content-wrapper', '.motopress-clmn').each(function () {
                                children = $(this).children('.motopress-row');
                                siblings = $(this).siblings('.motopress-clmn');
                                parentWrapper = $(this).closest('.motopress-row').parent('.motopress-content-wrapper');
                                if (children.length === 1 && (siblings.length || parentWrapper.length)) {
                                    replacementSpan = $(this);
                                    return false;
                                }
                            });
                            if (replacementSpan !== null) {
                                var rowFromChildrenClass = parent.MP.Utils.getSpanClass(rowFromChildren.prop('class').split(' '));
                                var replacementSpanClass = parent.MP.Utils.getSpanClass(replacementSpan.prop('class').split(' '));
                                CE.Resizer.myThis.changeSpanClass(rowFromChildren, replacementSpanClass);
                                replacementSpan.replaceWith(rowFromChildren);
                                rowFrom = action === 'remove' ? { row: replacementSpan.parent() } : null;
                            }
                        }
                    }
                    return rowFrom;
                },
                recursiveAddHandleMiddle: function (span) {
                    span.children('.motopress-row').each(function (index) {
                        var handleMiddle = CE.DragDrop.myThis.handleMiddleIn;
                        if (index == 0) {
                            $(this).before(handleMiddle.clone());
                        }
                        if ($(this).next('.mpce-wp-more-tag').length) {
                            $(this).next('.mpce-wp-more-tag').after(handleMiddle.clone());
                        } else {
                            $(this).after(handleMiddle.clone());
                        }
                        var rowEdge = parent.MP.Utils.getEdgeRow($(this));
                        rowEdge.children('.motopress-clmn').each(function () {
                            var clmnEdge = parent.MP.Utils.getEdgeSpan($(this));
                            if (clmnEdge.children('.motopress-row').length) {
                                CE.DragDrop.myThis.recursiveAddHandleMiddle(parent.MP.Utils.getEdgeSpan($(this)));
                            }
                        });
                    });
                },
                addHandleMiddle: function (row, spanClass) {
                    spanClass = typeof spanClass === 'undefined' ? '' : '.' + spanClass;
                    row.parent(spanClass + '.motopress-clmn, .motopress-content-wrapper').children('.motopress-row').each(function (index) {
                        var handleMiddle = null;
                        handleMiddle = CE.DragDrop.myThis.handleMiddleIn;
                        if (index == 0) {
                            var prev = $(this).prevAll('.motopress-handle-middle-in');
                            if (prev.length == 0) {
                                $(this).before(handleMiddle.clone());
                                if ($(this).parent().is('[data-motopress-wrapper-id]')) {
                                    CE.DragDrop.myThis.setCalcWrapperWidth($(this).prev());
                                }
                            } else {
                                prev.each(function (i, el) {
                                    if (i != 0) {
                                        $(el).remove();
                                    }
                                });
                            }
                        }
                        var handleMiddleClone = handleMiddle.clone();
                        var next = $(this).nextUntil('.motopress-row', '.motopress-handle-middle-in');
                        if (next.length == 0) {
                            if ($(this).next('.mpce-wp-more-tag').length) {
                                $(this).next('.mpce-wp-more-tag').after(handleMiddleClone);
                            } else {
                                $(this).after(handleMiddleClone);
                            }
                            if ($(this).parent().is('[data-motopress-wrapper-id]')) {
                                CE.DragDrop.myThis.setCalcWrapperWidth(handleMiddleClone);
                            }
                        } else {
                            next.each(function (i, el) {
                                if (i != 0) {
                                    $(el).remove();
                                }
                            });
                        }
                    });
                },
                getMinAllowedSpanSize: function (rowWidth, isWrapper, minChild) {
                    var minSize = 1;
                    var wrapperWidth;
                    for (var size = 1; size <= parent.CE.Iframe.myThis.gridObj.row.col; size++) {
                        minSize = size;
                        if (isWrapper) {
                            wrapperWidth = rowWidth / 100 * CE.Grid.myThis.colWidthByNumber[size];
                            if (this.resizer.isAllowedColSize(minChild, wrapperWidth))
                                break;
                        } else {
                            if (this.resizer.isAllowedColSize(size, rowWidth))
                                break;
                        }
                    }
                    return minSize;
                },
                canBeMoved: function (rowFrom, rowTo, fromPos, toPos, ui, handle, interactingSpan, silent) {
                    var rowToEdge, rowFromEdge;
                    if (typeof rowFrom === 'undefined' || rowFrom instanceof jQuery && !rowFrom.length) {
                        rowFromEdge = parent.MP.Utils.getEdgeRow(rowFrom);
                    } else {
                        rowFrom = null;
                        rowFromEdge = null;
                    }
                    if (typeof rowTo === 'undefined' || rowTo instanceof jQuery && !rowTo.length) {
                        rowToEdge = parent.MP.Utils.getEdgeRow(rowTo);
                    } else {
                        rowTo = null;
                        rowToEdge = null;
                    }
                    fromPos = typeof fromPos === 'undefined' ? null : fromPos;
                    toPos = typeof toPos === 'undefined' ? null : toPos;
                    ui = typeof ui === 'undefined' ? null : ui;
                    handle = typeof handle === 'undefined' ? false : handle;
                    silent = typeof silent === 'undefined' ? false : silent;
                    interactingSpan = typeof interactingSpan === 'undefined' ? null : interactingSpan;
                    var result = {};
                    var spanLimit = parent.CE.Iframe.myThis.gridObj.row.col;
                    var spanCount = 0;
                    var allowSpanWidth = true;
                    if (rowTo !== null) {
                        if (handle && handle === 'out' && rowFromEdge !== null && rowFromEdge[0] === rowToEdge[0])
                            return true;
                        rowToEdge.children('.motopress-clmn').each(function () {
                            if (parent.MP.Utils.notClone($(this), ui)    ) {
                                spanCount++;
                            }
                        });
                    }
                    if (spanCount < spanLimit || rowToEdge === null) {
                        var $this = this;
                        var realIndex, sizes, item, hasNotAllowed, needToShare, canToShare, shared, accepted, enableSkipIndex, fromNewSizes = [], toNewSizes = [], rowFromWidth, rowToWidth, sameContainerWrapperIndex = null, sameContainerWrapperWidth = null, from = [], to = [], loopCounter = 0;
                        if (rowFrom !== null) {
                            realIndex = -1;
                            rowFromWidth = parseFloat(rowFrom.css('width'));
                            var rowFromChildren = rowFromEdge.children('.motopress-clmn');
                            var rowFromSpanCount = rowFromChildren.length - 1;
                            enableSkipIndex = true;
                            if (handle && handle === 'insert') {
                                rowFromSpanCount++;
                                rowToEdge = null;
                                enableSkipIndex = false;
                            }
                            var sameContainer = false;
                            if (rowToEdge) {
                                var rowToEdgeParent = rowToEdge.closest('.motopress-row-edge');
                                if (rowFromEdge[0] === rowToEdgeParent[0]) {
                                    sameContainer = true;
                                }
                            }
                            if (rowFromSpanCount >= 1) {
                                var fromMinSize = this.getMinAllowedSpanSize(rowFromWidth, false);
                                needToShare = 0;
                                canToShare = 0;
                                hasNotAllowed = false;
                                sizes = $this.getSpanSizeRules(rowFromSpanCount);
                                var incMinSize = false;
                                if (handle && (handle === 'left-in' || handle === 'right-in')) {
                                    incMinSize = true;
                                }
                                rowFromChildren.each(function (index) {
                                    if (index !== fromPos || !enableSkipIndex) {
                                        realIndex++;
                                    } else
                                        return;
                                    item = {};
                                    item.index = realIndex;
                                    item.isWrapper = $(this).is('[data-motopress-wrapper-id]');
                                    item.size = sizes[realIndex];
                                    if (item.isWrapper) {
                                        if (sameContainer) {
                                            $(this).find('.motopress-row-edge').each(function () {
                                                if ($(this)[0] === rowToEdge[0]) {
                                                    sameContainerWrapperIndex = realIndex;
                                                    return;
                                                }
                                            });
                                        }
                                        item.wrapperWidth = rowFromWidth / 100 * CE.Grid.myThis.colWidthByNumber[sizes[realIndex]];
                                        item.minSpan = $this.resizer.getMinChildColumn($(this));
                                        item.minSize = $this.getMinAllowedSpanSize(rowFromWidth, true, item.minSpan);
                                        item.isAllowed = $this.resizer.isAllowedColSize(item.minSpan, item.wrapperWidth);
                                    } else {
                                        item.minSize = fromMinSize;
                                        if (incMinSize && this === interactingSpan[0] && item.minSize <= 1) {
                                            item.minSize = 2;
                                        }
                                        item.isAllowed = $this.resizer.isAllowedColSize(sizes[realIndex], rowFromWidth);
                                    }
                                    if (item.size < item.minSize) {
                                        needToShare += item.minSize - item.size;
                                    } else {
                                        canToShare += item.size - item.minSize;
                                    }
                                    if (!hasNotAllowed && !item.isAllowed)
                                        hasNotAllowed = true;
                                    from.push(item);
                                });
                                if (hasNotAllowed) {
                                    if (needToShare > canToShare) {
                                        allowSpanWidth = false;
                                    } else {
                                        shared = 0;
                                        accepted = 0;
                                        loopCounter = 0;
                                        while (needToShare * 2 !== shared + accepted) {
                                            for (var i = 0; i < from.length; i++) {
                                                if (from[i].isAllowed && from[i].size > from[i].minSize && shared < needToShare) {
                                                    from[i].size--;
                                                    shared++;
                                                } else if (!from[i].isAllowed && from[i].size < from[i].minSize) {
                                                    from[i].size++;
                                                    accepted++;
                                                }
                                            }
                                            if (++loopCounter >= 50) {
                                                allowSpanWidth = false;
                                                break;
                                            }
                                        }
                                        for (var i = 0; i < from.length; i++) {
                                            fromNewSizes.push(from[i].size);
                                        }
                                        result.from = fromNewSizes;    
                                    }
                                }
                                if (sameContainerWrapperIndex !== null) {
                                    if (fromNewSizes.length) {
                                        sameContainerWrapperWidth = rowFromWidth / 100 * CE.Grid.myThis.colWidthByNumber[fromNewSizes[sameContainerWrapperIndex]];
                                    } else {
                                        sameContainerWrapperWidth = rowFromWidth / 100 * CE.Grid.myThis.colWidthByNumber[sizes[sameContainerWrapperIndex]];
                                    }
                                }    
                            }
                        }
                        if (allowSpanWidth) {
                            var toMinSize;
                            if (handle && handle !== 'out' && handle !== 'insert') {
                                switch (handle) {
                                case 'left-in':
                                case 'right-in':
                                    rowToWidth = parseFloat(interactingSpan.css('width'));
                                    sizes = $this.getSpanSizeRules(2);
                                    for (var i = 0; i < sizes.length; i++) {
                                        toMinSize = this.getMinAllowedSpanSize(rowToWidth, false, sizes[i]);
                                        if (sizes[i] < toMinSize) {
                                            allowSpanWidth = false;
                                            break;
                                        }
                                    }
                                    break;
                                }
                            } else if (rowToEdge !== null) {
                                if (sameContainerWrapperWidth) {
                                    rowToWidth = sameContainerWrapperWidth;
                                } else {
                                    rowToWidth = parseFloat(rowToEdge.css('width'));
                                }
                                var rowToChildren = rowToEdge.children('.motopress-clmn');
                                var rowToChildrenLen = rowToChildren.length;
                                var newItem;
                                realIndex = -1;
                                sizes = $this.getSpanSizeRules(spanCount + 1);
                                toMinSize = this.getMinAllowedSpanSize(rowToWidth, false);
                                needToShare = 0;
                                canToShare = 0;
                                hasNotAllowed = false;
                                newItem = {
                                    'index': toPos,
                                    'isWrapper': false,
                                    'size': sizes[toPos],
                                    'minSize': toMinSize,
                                    'isAllowed': sizes[toPos] >= toMinSize
                                };
                                if (newItem.size < newItem.minSize) {
                                    needToShare += newItem.minSize - newItem.size;
                                } else {
                                    canToShare += newItem.size - newItem.minSize;
                                }
                                rowToChildren.each(function (index) {
                                    realIndex++;
                                    if (index === toPos) {
                                        to.push(newItem);
                                        if (!hasNotAllowed && !newItem.isAllowed)
                                            hasNotAllowed = true;
                                        realIndex++;
                                    }
                                    item = {};
                                    item.index = realIndex;
                                    item.isWrapper = $(this).is('[data-motopress-wrapper-id]');
                                    item.size = sizes[realIndex];
                                    if (item.isWrapper) {
                                        item.wrapperWidth = rowToWidth / 100 * CE.Grid.myThis.colWidthByNumber[sizes[realIndex]];
                                        item.minSpan = $this.resizer.getMinChildColumn($(this));
                                        item.minSize = $this.getMinAllowedSpanSize(rowToWidth, true, item.minSpan);
                                        item.isAllowed = $this.resizer.isAllowedColSize(item.minSpan, item.wrapperWidth);
                                    } else {
                                        item.minSize = toMinSize;
                                        item.isAllowed = $this.resizer.isAllowedColSize(sizes[realIndex], rowToWidth);
                                    }
                                    if (item.size < item.minSize) {
                                        needToShare += item.minSize - item.size;
                                    } else {
                                        canToShare += item.size - item.minSize;
                                    }
                                    if (!hasNotAllowed && !item.isAllowed)
                                        hasNotAllowed = true;
                                    to.push(item);
                                });
                                if (toPos === rowToChildrenLen) {
                                    to.push(newItem);
                                    if (!hasNotAllowed && !newItem.isAllowed)
                                        hasNotAllowed = true;
                                }
                                if (hasNotAllowed) {
                                    if (needToShare > canToShare) {
                                        allowSpanWidth = false;
                                    } else {
                                        shared = 0;
                                        accepted = 0;
                                        loopCounter = 0;
                                        while (needToShare * 2 !== shared + accepted) {
                                            for (var i = 0; i < to.length; i++) {
                                                if (to[i].isAllowed && to[i].size > to[i].minSize && shared < needToShare) {
                                                    to[i].size--;
                                                    shared++;
                                                } else if (!to[i].isAllowed && to[i].size < to[i].minSize) {
                                                    to[i].size++;
                                                    accepted++;
                                                }
                                            }
                                            if (++loopCounter >= 50) {
                                                allowSpanWidth = false;
                                                break;
                                            }
                                        }
                                        for (var i = 0; i < to.length; i++) {
                                            toNewSizes.push(to[i].size);
                                        }
                                        result.to = toNewSizes;    
                                    }
                                }    
                            }
                        }
                    }
                    if (spanCount >= spanLimit || !allowSpanWidth) {
                        CE.DragDrop.interruptInsert = true;
                        if (!silent) {
                            parent.MP.Flash.setFlash(localStorage.getItem('blocksOverflow'), 'error');
                            parent.MP.Flash.showMessage();
                        }
                        return false;
                    }
                    return Object.keys(result).length ? result : true;
                },
                resize: function (rowFrom, block, type, newSizes) {
                    newSizes = typeof newSizes === 'object' ? newSizes : {};
                    var sClass = null, sizes = null;
                    if (rowFrom !== null && typeof rowFrom !== 'undefined') {
                        var rowFromEdge = parent.MP.Utils.getEdgeRow(rowFrom);
                        var rowFromSpans = rowFromEdge.children('.motopress-clmn');
                        var rowFromSpanNumber = rowFromSpans.length;
                        if (rowFromSpanNumber > 0 && rowFromSpanNumber <= parent.CE.Iframe.myThis.gridObj.row.col) {
                            if (newSizes.hasOwnProperty('from')) {
                                sizes = newSizes.from;
                            } else {
                                sizes = this.getSpanSizeRules(rowFromSpanNumber);
                            }
                            rowFromSpans.each(function (i) {
                                sClass = parent.MP.Utils.getSpanClass($(this).prop('class').split(' '));
                                CE.Resizer.myThis.changeSpanClass($(this), parent.CE.Iframe.myThis.gridObj.span.class + sizes[i]);
                            });
                        }
                    }
                    if (typeof type === 'undefined' || typeof type !== 'undefined' && type !== 'insert') {
                        var rowTo = block.parent();
                        if (rowTo !== null && typeof rowTo !== 'undefined') {
                            var rowToSpans = rowTo.children('.motopress-clmn');
                            var rowToSpanNumber = rowToSpans.length;
                            if (rowToSpanNumber > 0 && rowToSpanNumber <= parent.CE.Iframe.myThis.gridObj.row.col) {
                                if (newSizes.hasOwnProperty('to')) {
                                    sizes = newSizes.to;
                                } else {
                                    sizes = this.getSpanSizeRules(rowToSpanNumber);
                                }
                                rowToSpans.each(function (i) {
                                    sClass = parent.MP.Utils.getSpanClass($(this).prop('class').split(' '));
                                    CE.Resizer.myThis.changeSpanClass($(this), parent.CE.Iframe.myThis.gridObj.span.class + sizes[i]);
                                });
                            }
                        }
                    }
                    if (typeof type !== 'undefined') {
                        if (type === 'top-in' || type === 'bottom-in') {
                            sClass = parent.MP.Utils.getSpanClass(block.prop('class').split(' '));
                            CE.Resizer.myThis.changeSpanClass(block, parent.CE.Iframe.myThis.gridObj.span.fullclass);
                            var rowIndex = type === 'top-in' ? 1 : 0;
                            var realRowFrom = block.closest('.motopress-row').parent('.motopress-clmn').children('.motopress-row').get(rowIndex);
                            realRowFrom = $(realRowFrom);
                            var realRowFromEdge = parent.MP.Utils.getEdgeRow(realRowFrom);
                            var siblingFrom = realRowFromEdge.children('.motopress-clmn');
                            if (typeof siblingFrom !== 'undefined' && siblingFrom.length) {
                                sClass = parent.MP.Utils.getSpanClass(siblingFrom.prop('class').split(' '));
                                CE.Resizer.myThis.changeSpanClass(siblingFrom, parent.CE.Iframe.myThis.gridObj.span.fullclass);
                            }
                        }
                    }
                },
                getSpanSizeRules: function (spanNumber) {
                    return this.spanSizeRules[spanNumber];    
                },
                generateSpanSizeRules: function () {
                    var col = parent.CE.Iframe.myThis.gridObj.row.col;
                    var rules = [];
                    for (var step = 1; step <= col; step++) {
                        rules[step] = [];
                        var spanNumber = Math.floor(col / step);
                        var spanAddition = col % step;
                        for (var i = 1; i <= step; i++) {
                            rules[step].push(i <= spanAddition ? spanNumber + 1 : spanNumber);
                        }
                    }
                    this.spanSizeRules = rules;
                },
                setCalcWrapperWidth: function (obj) {
                    if (CE.Grid.myThis.padding) {
                        var paddings = CE.Grid.myThis.padding * 2;
                        var prefix = '';
                        if (parent.MP.Utils.Browser.Mozilla) {
                            prefix = '-moz-';
                        } else if (parent.MP.Utils.Browser.Chrome) {
                            prefix = '-webkit-';
                        }
                        obj.css('width', prefix + 'calc(100% - ' + paddings + 'px)');
                    }
                },
                sceneEvents: function () {
                    this.container.off('hover').hover(function () {
                        CE.Utils.addSceneAction('container-hover');
                    }, function () {
                        CE.Utils.removeSceneAction('container-hover');
                    });
                },
                hideOuterHandles: function () {
                    $('.motopress-outer-handle').addClass('motopress-outer-handle-hidden');
                },
                showOuterHandles: function () {
                    $('.motopress-outer-handle').removeClass('motopress-outer-handle-hidden');
                }
            });
        }(jQuery));
        (function ($) {
            CE.Template = can.Control.extend(
            {
                myThis: null,
                templates: null
            }, 
            {
                template: $('<div />', {
                    'class': 'motopress-template',
                    html: '<img class="motopress-template-icon">' + '<p class="motopress-template-name"></p>'
                }),
                init: function (el, args) {
                    CE.Template.myThis = this;
                    if (CE.Template.templates !== null) {
                        var $this = this;
                        var templates = [];
                        $.each(CE.Template.templates, function (key, value) {
                            var template = $this.template.clone();
                            template.attr('data-motopress-template-id', value.id);
                            template.children('.motopress-template-icon').attr('src', value.icon);
                            template.children('.motopress-template-name').text(value.name);
                            templates.push(template);
                        });
                        this.element.append(templates);
                    }
                },
                '.motopress-template click': function (el, e) {
                    var templateId = el.attr('data-motopress-template-id');
                    if (templateId) {
                        parent.MP.Preloader.myThis.show();
                        $.ajax({
                            url: parent.motopress.ajaxUrl,
                            type: 'POST',
                            dataType: 'html',
                            data: {
                                action: 'motopress_ce_render_template',
                                nonce: parent.motopressCE.nonces.motopress_ce_render_template,
                                postID: parent.motopressCE.postID,
                                templateId: templateId
                            },
                            success: function (dirtyData) {
                                CE.Utils.removeSceneState('empty-scene');
                                var privateStyles = $(dirtyData).find('.motopress-ce-private-styles-updates-wrapper').andSelf().filter('.motopress-ce-private-styles-updates-wrapper').children('style');
                                CE.ShortcodePrivateStyle.addRenderedStyleTags(privateStyles);
                                var data = $(dirtyData).find('.motopress-ce-rendered-content-wrapper').andSelf().filter('.motopress-ce-rendered-content-wrapper').html();
                                CE.DragDrop.myThis.emptySceneHelper.hide();
                                CE.DragDrop.myThis.emptySceneHelper.before(data);
                                parent.CE.Iframe.myThis.unwrapGrid();
                                CE.DragDrop.myThis.setEdges();
                                CE.DragDrop.myThis.main();
                                parent.CE.Save.changeContent();
                                parent.MP.Preloader.myThis.hide();
                            },
                            error: function (jqXHR) {
                                parent.MP.Preloader.myThis.hide();
                                var error = $.parseJSON(jqXHR.responseText);
                                if (error.debug) {
                                    console.log(error.message);
                                } else {
                                    parent.MP.Flash.setFlash(error.message, 'error');
                                    parent.MP.Flash.showMessage();
                                }
                            }
                        });
                    }
                }
            });
        }(jQuery));
        (function ($) {
            CE.Selectable = can.Construct(
            {
                myThis: null,
                scrollY: 0,
                focusFlag: false,
                blurFlag: false,
                setScrollY: function (y) {
                    CE.Selectable.scrollY = y;
                },
                focusWithoutScroll: function (el) {
                    if (!CE.Selectable.focusFlag) {
                        CE.Selectable.focusFlag = true;
                        el.focus();
                        window.scrollTo(0, CE.Selectable.scrollY);
                        var t = setTimeout(function () {
                            CE.Selectable.focusFlag = false;
                            clearTimeout(t);
                        }, 0);
                    }
                    return el;
                },
                blurWithoutScroll: function (el) {
                    if (!CE.Selectable.blurFlag) {
                        CE.Selectable.blurFlag = true;
                        el.blur();
                        window.scrollTo(0, CE.Selectable.scrollY);
                        var t = setTimeout(function () {
                            CE.Selectable.blurFlag = false;
                            clearTimeout(t);
                        }, 0);
                    }
                    return el;
                }
            }, 
            {
                selectedClass: 'motopress-selected',
                init: function () {
                    CE.Selectable.myThis = this;
                    $(document).mousedown(function () {
                        CE.Selectable.setScrollY(window.scrollY);
                    });
                    $(document).mouseup(function () {
                        CE.Selectable.setScrollY(window.scrollY);
                    });
                    this.makeSelectable();
                },
                makeSelectable: function () {
                    $('.motopress-content-wrapper').on('click', '.motopress-drag-handle, .motopress-clmn-select-handle, .motopress-row-select-handle', function () {
                        if ($(this).hasClass('.motopress-clmn-select-handle') && $(this).closest('.motopress-clmn').hasClass(CE.Selectable.myThis.selectedClass) || $(this).hasClass('.motopress-row-select-handle') && $(this).closest('.motopress-row').hasClass(CE.Selectable.myThis.selectedClass) || $(this).hasClass(CE.Selectable.myThis.selectedClass)) {
                            var selectedElement = null;
                            if ($(this).hasClass('.motopress-row-select-handle')) {
                                selectedElement = $(this).closest('.motopress-row');
                            } else if ($(this).hasClass('.motopress-clmn-select-handle')) {
                                selectedElement = $(this).closest('.motopress-clmn');
                            } else {
                                selectedElement = $(this).closest('.motopress-clmn').find('.motopress-block-content').first().children('[data-motopress-shortcode]');
                            }
                            var ctrl = selectedElement.control();
                            var inlineEditorIsOpen = selectedElement.hasClass('ce_inline_editor') ? ctrl.isOpen : false;
                            if ((selectedElement.hasClass('ce_controls') || selectedElement.hasClass('ce_inline_editor') || selectedElement.hasClass('ce_code_editor') || selectedElement.hasClass('.motopress-row')) && !CE.Dialog.myThis.element.dialog('isOpen') && !parent.CE.CodeModal.myThis.element.data('modal').isShown && !inlineEditorIsOpen) {
                                CE.Dialog.myThis.open($(this));
                            }
                        } else {
                            CE.Selectable.myThis.select($(this));
                        }
                        CE.Selectable.focusWithoutScroll($(this).prev());
                    });
                    $('.motopress-content-wrapper').on('keydown', '.motopress-focus-area', function (e) {
                        if ($(this).next().hasClass(CE.Selectable.myThis.selectedClass)) {
                            if (e.which === $.ui.keyCode.ESCAPE) {
                                CE.Selectable.setScrollY(window.scrollY);
                                CE.Selectable.myThis.unselect();
                            } else if (e.which === $.ui.keyCode.DELETE || e.which === $.ui.keyCode.BACKSPACE) {
                                e.preventDefault();
                                CE.Selectable.setScrollY(window.scrollY);
                                CE.Tools.myThis.removeBlock();
                                parent.CE.Save.changeContent();
                            }
                        }
                    });
                    $(document).on('click', function (e) {
                        if (!$(e.target).hasClass(CE.Selectable.myThis.selectedClass) && !$(e.target).hasClass('motopress-clmn-select-handle') && !$(e.target).hasClass('motopress-row-select-handle') && !$(e.target).closest('.' + CE.Dialog.myThis.dialogClass).length && !CE.InlineEditor.isTinymce(e)) {
                            CE.Selectable.myThis.unselect();
                        }
                    });
                },
                select: function (el) {
                    if (CE.DragDrop.interruptInsert === false) {
                        this.unselect();
                        var container = null;
                        CE.Selectable.focusWithoutScroll(el.prev());
                        if (el.hasClass('motopress-row-select-handle')) {
                            el.closest('.motopress-row').addClass(this.selectedClass);
                            container = el.closest('.motopress-row');
                        } else if (el.hasClass('motopress-clmn-select-handle')) {
                            el.closest('.motopress-clmn').addClass(this.selectedClass);
                            container = el.closest('.motopress-clmn');
                        } else {
                            el.addClass(this.selectedClass).closest('.motopress-helper').nextAll('.ui-resizable-handle:not(".motopress-hide")').show();
                            container = el.closest('.motopress-clmn');
                        }
                        CE.Utils.addSceneAction('select');
                        if (!el.hasClass('motopress-row-select-handle') && !el.hasClass('motopress-clmn-select-handle')) {
                            parent.CE.Navbar.myThis.showObjectControlBtns();
                        }
                        if ((container.hasClass('ce_controls') || container.hasClass('ce_inline_editor') || container.hasClass('ce_code_editor') || container.hasClass('motopress-row')) && !CE.Dialog.myThis.element.dialog('isOpen')) {
                            CE.Dialog.myThis.open(el);
                        }
                    }
                    CE.DragDrop.interruptInsert = false;
                },
                unselect: function () {
                    var selected = $('.motopress-content-wrapper .' + this.selectedClass);
                    if (selected.length) {
                        selected.each(function () {
                            $(this).removeClass(CE.Selectable.myThis.selectedClass);
                            if (!$(this).hasClass('motopress-clmn') && !$(this).hasClass('motopress-row')) {
                                $(this).closest('.motopress-helper').nextAll('.ui-resizable-handle:not(".motopress-hide")').hide();
                            }
                        });
                        parent.CE.Navbar.myThis.hideObjectControlBtns();
                        if (CE.Dialog.myThis.element.dialog('isOpen'))
                            CE.Dialog.myThis.element.dialog('close');
                        if (CE.InlineEditor.curElement)
                            CE.InlineEditor.curElement.control().close();
                        CE.Selectable.blurWithoutScroll(selected.prev());
                        CE.Utils.removeSceneAction('select');
                    }
                }
            });
        }(jQuery));
        (function ($) {
            if ($.hasOwnProperty('stellar')) {
                $.stellar('refresh');
            }
            if ($.hasOwnProperty('fn') && $.fn.hasOwnProperty('button') && $.fn.button.hasOwnProperty('noConflict')) {
                $.fn.btn = $.fn.button.noConflict();
            }
            new CE.Utils();
            CE.WPMore.getInstance();
            new CE.StyleEditor();
            new CE.LeftBar();
            new CE.ImageLibrary();
            new CE.WPGallery();
            new CE.WPMedia();
            new CE.WPAudio();
            new CE.WPVideo();
            new CE.Dialog();
            new CE.Selectable();
            new CE.Link();
            parent.MP.Editor.myThis.load();    
        }(jQuery));    
    } catch (e) {
        parent.MP.Error.log(e, true);
    }
});