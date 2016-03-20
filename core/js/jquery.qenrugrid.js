/**
* qenru Grid v1.0.0
* http://themethunders.com/plugin/qenruGrid/
*
* Copyright 2016, Turhan Onur Dogucu - http://onurdogucu.com ( Under Construction )
* Written depends on needings.
*
* Released under the MIT license - http://opensource.org/licenses/MIT
*/

(function ($, window, document) {

    "use strict";

    var GetData = {

        init: function (options, el) {

            var base = this;
            base.totalRow = $('.qenruRow').length;
            base.el = el;
            base.$elem = $(el);
            base.options = $.extend({}, $.fn.qenruGrid.options, base.$elem.data(), options);


            base.userOptions = options;
            base.setRowNumberOptions();
            base.setGrid();
            base.loadContent();


            if (base.options.jsonDataRequest)
                base.customEvents();

        },

        setRowNumberOptions:function(){
            var base = this;
            var options = "";
            var current_row_number_text = base.options.rowPerPage == 999999999999 ? "All" : base.options.rowPerPage;
            var current_row_number = base.options.rowPerPage == 999999999999 ? -1 : base.options.rowPerPage;;
            options = sprintf(base.templates().row_number_options_option,current_row_number,current_row_number_text);

            for(var i = 0; i < base.options.rowNumberOptions.length;i++)
            {
                if(base.options.rowNumberOptions[i] != base.userOptions.rowPerPage)
                {
                    var row_text = base.options.rowNumberOptions[i] == -1 ? "All" : base.options.rowNumberOptions[i];
                     options += sprintf(base.templates().row_number_options_option,base.options.rowNumberOptions[i],row_text);
                }
            }
            var rowNumberSelect = sprintf(base.templates().row_number_options_select,options);
            $('.qenruPageSwitcher').html(rowNumberSelect);
        },

        updateCurrentPageId: function () {
            var base = this;
            base.current_page_id = $('.qenruRow:visible').data('row-id') !== undefined ? $('.qenruRow:visible').data('row-id') : base.current_page_id;
        },

        setGrid: function () {
            var base = this;

            if (base.options.dataSource == null) {
                base.headerDataSource = base.options.headerDataSource;
                base.rowDataSource = base.options.rowDataSource;
                if (base.headDataSource != null)
                    base.setHeadData();
                if (base.rowDataSource != null)
                    base.setRowData();
            }
            else {
                base.ajaxOptions = base.userOptions.dataSource;
                base.ajaxUrl = base.ajaxOptions.read;
                base.ajaxType = base.ajaxOptions.type;
                base.dataFields = base.ajaxOptions.dataFields;
                base.hiddenFields = base.ajaxOptions.hiddenFields;
                base.searchableFields = base.ajaxOptions.searchableFields;
                base.sortableFields = base.ajaxOptions.sortableFields;
                base.headerDataSource = base.ajaxOptions.headDataSource;
                base.getAjaxData();
                base.setHeadData();
            }
        },

        getAjaxData: function () {
            var base = this;

            $.ajax({
                type: "POST",
                url: base.ajaxUrl,
                data: "{}",
                dataType: base.ajaxType,
                contentType: "application/json",
                async: false,
                beforeSend: function () {
                    $('.qenruGridBody').append(base.templates().ajax_overlay);
                },
                success: function (response) {
                    var newJsonArr = new Array();
                    // if you are using ASP.NET WebMethod u should $.parseJSON first, otherwise ( ASP.NET MVC & PHP ) you can have data by using only response.
                    var jsonResponse = response;

                    base.rowDataSource = jsonResponse.GetRowDataSource;
                    base.setRowData();
                    $('.qenruGridBody').append(base.templates().ajax_overlay);
                    setTimeout(function () {
                        $('.gridOverlay').hide();
                    }, 500);

                },
                error: function (xhr) {
                    console.log(xhr);
                }
            });
        },

        getDataOptions: function (val) {
            var data_options = "";
            var is_hidden = val.is_hidden == true ? 1 : -1;
            var is_sortable = val.is_sortable == true ? 1 : -1;
            var is_searchable = val.is_searchable ? 1 : -1;
            if (is_hidden != -1)
                data_options += "hidden|";
            if (is_sortable != -1)
                data_options += "sortable|";
            if (is_searchable != -1)
                data_options += "searchable|";
            if (data_options.substr(data_options.length - 1) == '|') {
                data_options = data_options.substring(0, data_options.length - 1);
            }

            data_options = data_options == "" ? "" : "data-option = '" + data_options + "'";

            return data_options;

        },

        setHeadData: function () {
            var base = this;

            var headSource = base.headerDataSource;

            var headerFields = headSource.dataFields;
            var headDataHtml = "";
            $.each(headerFields, function (i, val) {
                if(val.index != "#edit")
                    var data_options = base.getDataOptions(val);

                headDataHtml += sprintf(base.templates().head_column, data_options, val.name);
            });

            $('.qenruGridHead').html(headDataHtml);
        },

        setRowData: function () {
            var base = this;
            var row = "";
            var headSource = base.headerDataSource;
            var headerFields = headSource.dataFields;
            var rowSource = base.rowDataSource;

            $.each(rowSource, function (i, val) {
                var row_data = base.getRowData(val, headerFields);
                row += sprintf(base.templates().body_row, row_data);
            });



            $('.qenruGridBody').html(row);
        },

        getRowData: function (data, headerData) {
            var base = this;
            var row_data = "";

            $.each(headerData, function (i, val) {
                var is_hidden = val.is_hidden;

                if(val.index == "#edit")
                {
                    var referID = data[val.data];
                    var text = val.text === undefined ? "" : val.text;

                    var valueFilteredByFieldType = {
                        success : true,
                        message: "",
                        val : val.text === undefined ? sprintf(base.templates().edit_button,val.editUrl + referID,"edit-icon") : sprintf(base.templates().edit_button_text,val.editUrl + referID,"edit-icon",text)
                    };
                }
                else
                    var valueFilteredByFieldType = base.getFieldType(val.type, data[val.index]);
                if (!valueFilteredByFieldType.success) {
                    valueFilteredByFieldType.val = "check console";
                    console.log(valueFilteredByFieldType.message);
                }
                if (val.appendAfter !== undefined)
                    valueFilteredByFieldType.val += val.appendAfter;
                if (is_hidden == true) {
                    row_data += sprintf(base.templates().body_row_data_hidden, valueFilteredByFieldType.val);
                } else {
                    row_data += sprintf(base.templates().body_row_data, valueFilteredByFieldType.val);
                }
            });



            return row_data;
        },

        getFieldType: function (type, val) {
            var base = this;
            
            if (val == null) {
                var result = {
                    success: false,
                    message: "null value",
                    val: ""
                };
                return result;
            } else {
                if (type !== undefined) {
                    switch (type) {
                        default:
                        val = String(val);
                        break;
                        case "string":
                        val = String(val);
                        break;
                        case "int":
                        val = parseInt(val);
                        break;
                        case "date|json":
                        val = parseJsonDate(val);
                            //val = new Date(parseInt(val.substr(6)));
                            break;
                        }
                        var result = {
                            success: true,
                            message: "",
                            val: val
                        };
                        return result;
                    }
                    else {
                        var result = {
                            success: false,
                            message: type + "is not available in qenruGrid. Please check documentation to have all field type information",
                            val: ""
                        };
                        return result;
                    }
                }
            },

            loadContent: function (sortBy, orderBy) {

                var base = this;
                base.setPage();
                base.setGridWidth();
                base.optionBuilder();

            },

            optionBuilder: function () {
                var base = this;
                base.$elem.find('.qenruCol').each(function (i) {
                    var self = $(this);
                    var options = base.getOption(self);
                    if (options != "") {
                        if (options.indexOf('|') === -1) {
                            base.optionSet(options, self);
                        }
                        else {
                            var optionArr = options.split('|');
                            base.optionSetByArray(optionArr, self);
                        }
                    }
                });

            },

            optionSetByArray: function (opt, el) {
                var base = this;
                for (var i = opt.length - 1; i >= 0; i--) {
                    base.optionSwitch(opt[i], el);
                }
            },

            optionSet: function (opt, el) {
                var base = this;
                base.optionSwitch(opt, el);
            },

            optionSwitch: function (option, el) {
                var base = this;
                switch (option) {
                    default:
                    return 0;
                    break;
                    case "hidden":
                    base.hideElement(el);
                    break;
                    case "sortable":
                    base.makeSortable(el);
                    break;
                    case "searchable":
                    base.makeSearchable(el);
                }
            },

            hideElement: function (el) {
                var base = this;
                base.setStyle(el, "display", "none");
            },

            makeSortable: function (el) {
                var base = this;
                if (base.options.colSort) {
                    el.addClass('sortable');

                }

            },

            makeSearchable: function (el) {
                var base = this;
                var inlineSearch = sprintf(base.templates().inline_search, "Filtrele");
                if (base.options.colSearch) {
                    el.find('.qenruInlineSearch').remove();
                    el.append(inlineSearch);
                }
            },

            checkIfDataExist: function (el, label, data, isLoop) {
                var status = false;
                if (isLoop == true) {
                    el.each(function () {
                        var self = $(this);
                        if (self[0].attributes[label].value == data)
                            status = true;

                    });
                } else {
                    if (el[0].attributes[label].value == data)
                        status = true;
                    else
                        status = false;
                }

                return status;

            },

            setGridWidth: function () {
                var base = this;
                var userOpt = base.options;
                if (userOpt.headerColCount > 0) {
                    if (userOpt.colCustomWidth != null) {
                        var i = 0;
                        base.makeGridWidth(userOpt.colCustomWidth,userOpt.widthType,true);
                    }
                }
                else{
                    var colCount = 0;
                    for (var i = base.headerDataSource.dataFields.length - 1; i >= 0; i--) {
                        var data = base.headerDataSource.dataFields[i];
                        if(data !== undefined){
                            if(data.is_hidden != true && data.index != "#edit")
                                colCount++;
                        }
                        else
                            colCount++;
                    }
                    var perWidth = 0;
                    if(userOpt.colCustomWidth != null){
                        base.makeGridWidth(userOpt.colCustomWidth,userOpt.widthType,true);
                    }
                    else{
                        if(userOpt.widthType != "px"){
                            perWidth = data.index == "#edit" ? 95 / colCount : 100 / colCount;

                            base.makeGridWidth(perWidth,userOpt.widthType,false);
                        }
                    }
                }
            },

            makeGridWidth: function(perWidth, widthType,isLoop){
                var base = this;
                if(isLoop)
                {
                    var i = 0;
                    base.$elem.find('.qenruGridHead .qenruCol').each(function (index) {
                        var new_perWidth = base.headerDataSource.dataFields[index].index == "#edit" ? "5" : perWidth[i];
                        var self = $(this);
                        var opt = base.getOption(self);
                        if (opt.indexOf("hidden") === -1) {

                            base.setGridRow(index, new_perWidth, widthType, false);
                            base.setStyle(self, "width", new_perWidth + widthType);
                            i++;
                        }
                        else {
                            base.setGridRow(index, new_perWidth, widthType, true);
                            return;
                        }

                    });
                }
                else
                {
                    base.$elem.find('.qenruGridHead .qenruCol').each(function (index) {
                        var new_perWidth = base.headerDataSource.dataFields[index].index == "#edit" ? "5" : perWidth;
                        var self = $(this);
                        var opt = base.getOption(self);
                        if (opt.indexOf("hidden") === -1) {
                            
                            base.setGridRow(index, new_perWidth, widthType, false);
                            base.setStyle(self, "width", new_perWidth + widthType);
                            i++;
                        }
                        else {

                            base.setGridRow(index, new_perWidth, widthType, true);
                            return;
                        }

                    });
                }
                
            },

            setGridRow: function (index, width, widthType, isNone) {
                var base = this;
                base.$elem.find('.qenruGridBody .qenruRow').each(function () {

                    var self = $(this);

                    if (isNone == true) {

                        var row = self.find('.qenruRowData:eq(' + index + ')');
                        base.setStyle(row, "display", "none");

                    } else {

                        var row = self.find('.qenruRowData:eq(' + index + ')');
                        base.setStyle(row, "width", width + widthType);

                    }

                });
            },

            setStyle: function (el, type, value) {
                el.css(type, value);
            },

            getOption: function (el) {
                var opt = el.attr('data-option');
                if (typeof opt != typeof undefined) {
                    return opt;
                }
                else
                    return "";
            },

            reloadGrid: function (el, orderBy) {
                var base = this;
                if (el !== undefined) {
                    var sortByIndex = el.prevAll().length;
                    base.sortElements(sortByIndex, orderBy);
                }
                else
                    base.loadContent();
            },

            sortElements: function (eq, orderBy) {


                var rows = $('.qenruRow');
                var newOrder = orderBy == "asc" ? "desc" : "asc";
                rows.sort(function (a, b) {
                    a = $(a).find('.qenruRowData:eq(' + eq + ')').html();
                    b = $(b).find('.qenruRowData:eq(' + eq + ')').html();
                // compare
                if (orderBy == "asc") {
                    if (a > b) {
                        return 1;
                    } else if (a < b) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
                else {
                    if (a > b) {
                        return -1;
                    } else if (a < b) {
                        return 1;
                    } else {
                        return 0;
                    }
                }

            });

                $(".qenruGridBody").append(rows);
                $('.qenruGridHead').find('.qenruCol:eq(' + eq + ')').attr('data-orderby', newOrder);
            },

            templates: function () {

                var templateContent = {

                //Pager Templates

                "prev_page": "<a href='%s' class='qenruPager %s'>&#x21d0;</a>",
                "next_page": "<a href='%s' class='qenruPager %s'>&#8658;</a>",
                "page_index": "<a href='%s' class='qenruPager %s'>%s</a>",

                //Row Number Option Template

                "row_number_options_select" : "<select id='pageSwitcher'>%s</select>",
                "row_number_options_option" : "<option value='%s'>%s</option>",

                //Column Search Filter Template

                "inline_search": "<input type='text' class='qenruInlineSearch' placeholder='%s'/>",

                //Grid Head Column Templates

                "head_column": "<div class='qenruCol' %s>%s</div>",

                //Grid Body Row Templates

                "body_row": "<div class='qenruRow'>%s</div>",
                "body_row_data_hidden": "<div class='qenruRowData' style='display:none'>%s</div>",
                "body_row_data": "<div class='qenruRowData'>%s</div>",

                //Sub Content Templates - Not available now - will be updated on next version

                "sub_content": "<div class='subContent'>%s</div>",
                "sub_content_head": "<div class='subHead'><div class='subHeadContainer'>%s</div></div>",
                "sub_content_body": "<div class='subBody'><div class='subBodyContainer'>%s</div></div>",
                "sub_content_body_row": "<div class='subBodyRow'>%s</div>",
                "sub_content_body_row_data": "<div class='subBodyRowData'>%s</div>",
                "ajax_overlay": "<div class='gridOverlay'><div class='box loading'></div></div>",

                //Editable Templates

                "edit_button" : "<a href='%s' class='editButton %s'></a>",
                "edit_button_text" : "<a href='%s' class='editButtonText %s'>%s</a>",
                "editable_select_element": "<select name='%s' id='%s' class='qenruEditableElement editableSelect'>%s</select>",
                "editable_select_option_element" : "<option value='%s'>%s</option>",
                "editable_input_text_element": "<input type='text' name='%s' class='qenruEditableElement editableText' value='%s'/>",
                "editable_input_radio_element": "<label for='%s'>%s</label><input type='radio' name='%s' id='%s' class='qenruEditableElement editableRadio'/>",
                "editable_input_checkbox_element": "<label for='%s'>%s</label><input type='checkbox' name='%s' id='%s' class='qenruEditableElement editableCheckbox'/>",
                "editable_textarea_element": "<textarea name='%s' class='qenruEditableElement editableTextarea'>%s</textarea>"
                
            }

            return templateContent;

        },

        customEvents: function () {
            var base = this;
            base.$elem.on("qenru.sort", function (e) {
                var self = $(e.target);
                base.sortData(self);
            });
            base.$elem.on("qenru.pager", function (e) {
                var self = $(e.target);
                base.pageData(self);
            });
            base.$elem.on("qenru.rowPerPage", function (e) {
                var self = $(e.target);
                base.rowsPerPage(self);
            });
            base.$elem.on("qenru.inline-search", function (e) {
                var self = $(e.target);
                if (base.options.colSearch)
                    base.inlineSearch(self);

            });
        },

        rowsPerPage: function (self) {
            var base = this;
            base.options.jsonDataRequest = false;
            var rowNo = self.val();
            base.options.rowPerPage = rowNo > 0 ? rowNo : 999999999999;

            base.init(base.options, base.el);
        },

        makePager: function (page) {
            var base = this;
            page = page === undefined ? base.current_page_id : page;
            base.totalRow = $('.qenruRow').length;
            base.totalPage = base.totalRow % base.options.rowPerPage == 0 ? base.totalRow / base.options.rowPerPage : parseInt(base.totalRow / base.options.rowPerPage) + 1;


            var next_page = (parseInt(page) + 1) > base.totalPage ? sprintf(base.templates().next_page,"javascript:void(0)", "active") : sprintf(base.templates().next_page,"#next", "");
            var prev_page = (parseInt(page) - 1) < 1 ? sprintf(base.templates().prev_page,"javascript:void(0)","active") : sprintf(base.templates().prev_page,"#prev", "");

            var html = prev_page;

            var current_page = page;
            //html += sprintf(base.templates().page_index, current_page, "active",current_page);
            html += base.setPager(current_page);

            html += next_page;
            $('.qenruGridFooter').html(html);

            $(".qenruPager").on("click", function () {
                $(this).trigger('qenru.pager');
            });
        },

        setPager:function(current_page){
            current_page = parseInt(current_page);
            var base = this;
            var rightOfCurrent,leftOfCurrent;
            var totalPageButton = base.options.totalPageButton; // Total number of page index. Ex. PAGER ---->>> < - 1 - 2 - 3 - 4 - 5 - >
            var left_pages = "";
            var right_pages = "";
            var totalPage = base.totalPage;
            var pager_indexes = "";
            if((totalPageButton - 1) % 2 == 0)
                rightOfCurrent = leftOfCurrent =  (totalPageButton - 1) / 2;
            else{
                rightOfCurrent = (totalPageButton - 1) / 2 + 0.5;
                leftOfCurrent = (totalPageButton - 1) / 2 - 0.5;
            }
            var countLeft   = 0;
            var countRight  = 0;
            var lefts = (current_page - 1) - leftOfCurrent <= 0 ? 1 : (current_page - 1) - leftOfCurrent;
            for(var i = lefts ;i <= (current_page - 1); i++ ){
                if(countLeft > leftOfCurrent)
                    break;
                left_pages += sprintf(base.templates().page_index,"#"+i,"",i);
                countLeft++;
            }
            pager_indexes += left_pages;
            var current_page_index = sprintf(base.templates().page_index, "javascript:void(0)", "active",current_page);
            pager_indexes += current_page_index;
            for(var i = current_page + 1;i <= totalPage; i++ ){
                if(countRight > rightOfCurrent)
                    break;
                right_pages += sprintf(base.templates().page_index,"#"+i,"",i);
                countRight++;
            }

            pager_indexes += right_pages;
            

            return pager_indexes;
        },

        setPage: function () {
            var base = this;
            var pageId = 1;
            $(".qenruRow:visible").each(function (i) {
                var self = $(this);
                if ((i + 1) % base.options.rowPerPage == 0) {
                    self.attr('data-row-id', pageId);
                    pageId++;
                }
                else
                    self.attr('data-row-id', pageId);
            });

            base.shapePage();
        },

        shapePage: function (trigger) {
            var base = this;
            base.updateCurrentPageId();

            if (trigger == "next") {
                var is_exist = base.checkIfDataExist($('.qenruRow'), "data-row-id", parseInt(base.current_page_id, 10) + 1, true);
                if (is_exist)
                    trigger = parseInt(base.current_page_id, 10) + 1;
                else
                    trigger = -1;
            }
            else if (trigger == "prev") {
                var is_exist = base.checkIfDataExist($('.qenruRow'), "data-row-id", parseInt(base.current_page_id, 10) - 1, true);
                if (is_exist)
                    trigger = parseInt(base.current_page_id, 10) - 1;
                else
                    trigger = -1;
            }

            if (base.current_page_id < 0) {

            } else {
                $('.qenruRow').each(function () {
                    var self = $(this);
                    var data_id = self.attr('data-row-id');
                    if (trigger !== undefined) {

                        if (data_id != trigger)
                            base.setStyle(self, "display", "none");
                        else
                            base.setStyle(self, "display", "table");
                    } else {
                        if (self.is(":visible")) {
                            if (data_id != base.current_page_id)
                                base.setStyle(self, "display", "none");
                            else
                                base.setStyle(self, "display", "table");
                        }
                    }

                });
            }

            base.makePager(trigger);

        },

        inlineSearch: function (el) {
            var base = this;
            base.updateCurrentPageId();
            var colIndex = el.parent().prevAll().length;
            var value = el.val().toLowerCase();;
            $(".qenruRow").each(function (ix, el) {

                var row = $(this);
                var page_id = row.attr('data-row-id');
                if (base.current_page_id == page_id) {
                    var cell = row.find(".qenruRowData:eq(" + colIndex + ")");


                    var cell_value = cell.text().toLowerCase();;

                    row.toggle(cell_value.indexOf(value) >= 0);
                }

            });
            base.shapePage();
        },

        pageData: function (el) {
            var base = this;
            if (el.hasClass('active') == false) {
                var to = el.attr('href').split('#')[1];
                base.shapePage(to);
            }
        },

        sortData: function (el) {
            var base = this;
            var orderBy = el.attr('data-orderby');
            $('.sortable').removeClass('order-down').removeClass('order-up')
            if (orderBy === undefined) {
                orderBy = "asc";
                el.removeClass('order-down').addClass('order-up');
            }
            else if (orderBy == "asc")
                el.removeClass('order-down').addClass('order-up');
            else
                el.removeClass('order-up').addClass('order-down');
            orderBy = orderBy === undefined ? "asc" : orderBy;
            base.reloadGrid(el, orderBy);
        },



    };

    function parseJsonDate(jsonDate) {

        var fullDate = new Date(parseInt(jsonDate.substr(6)));
        var twoDigitMonth = (fullDate.getMonth() + 1) + ""; if (twoDigitMonth.length == 1) twoDigitMonth = "0" + twoDigitMonth;

        var twoDigitDate = fullDate.getDate() + ""; if (twoDigitDate.length == 1) twoDigitDate = "0" + twoDigitDate;
        var currentDate = twoDigitDate + "." + twoDigitMonth + "." + fullDate.getFullYear();

        return currentDate;
    };


    function sprintf(format) {
        for (var i = 1; i < arguments.length; i++) {
            format = format.replace(/%s/, arguments[i]);
        }
        return format;
    }


    $.fn.qenruGrid = function (data) {
        return this.each(function () {
            var getdata = Object.create(GetData);
            getdata.init(data, this);
            $.data(this, "qenruGrid", getdata);
        });
    };



    $.fn.qenruGrid.options = {
        editable:false,
        headerColCount: 0,
        widthType: "%",
        colCustomWidth: null,
        search: true,
        responsive: true,
        rowPerPage: 10,
        totalPageButton: 5,
        colSearch: false,
        headerDataSource: null,
        rowDataSource: null,
        colSort: false,
        dataSource: null,
        rowNumberOptions:[5,10,25,50,-1],

        //Reload parameter
        jsonDataRequest: true
    };

    String.prototype.rtrim = function (s) {
        return this.replace(new RegExp(s + "/*$"), '');
    };

}(jQuery, window, document));
