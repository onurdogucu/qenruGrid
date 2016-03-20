/**
* qenru Grid v1.0.0
* http://plugin.softbax.com/qenruGrid
*
* Copyright 2016, Turhan Onur Dogucu - http://onurdogucu.com ( Under Construction )
* Written because of needings.
*
* Released under the MIT license - http://opensource.org/licenses/MIT
*/

(function ($, window, document) {

	"use strict";

	var GetData = {

		init : function (options, el) {

			var base = this;
			base.totalRow = $('.qenruRow').length;
			base.el = el;
			base.$elem = $(el);
			base.options = $.extend({}, $.fn.qenruGrid.options, base.$elem.data(), options);
			
			
			base.userOptions = options;
			base.setGrid();
			base.loadContent();
			base.customEvents();

		},

		updateCurrentPageId: function(){
			var base = this;
			base.current_page_id = $('.qenruRow:visible').data('row-id') !== undefined ? $('.qenruRow:visible').data('row-id') : base.current_page_id;
		},

		setGrid: function(){
			var base = this;

			var headDataSource  = base.options.headerDataSource;
			var rowDataSource   = base.options.rowDataSource;
			if (headDataSource != null)
				base.setHeadData();
			if (rowDataSource != null)
				base.setRowData();
		},

		getDataOptions: function(val,hidden,sortable,searchable){
			var data_options = "";
			var is_hidden       = hidden != "#All" ? jQuery.inArray(val, hidden) : 1;
			var is_sortable     = sortable != "#All" ? jQuery.inArray(val, sortable) : 1;
			var is_searchable = searchable != "#All" ? jQuery.inArray(val, searchable) : 1;
			if (is_hidden != -1)
				data_options += "hidden|";
			if (is_sortable != -1)
				data_options += "sortable|";
			if (is_searchable != -1)
				data_options += "searchable|";
			if (data_options.substr(data_options.length - 1) == '|') {
				data_options = data_options.substring(0,data_options.length - 1);
			}

			data_options = data_options == "" ? "" : "data-option = '" + data_options + "'";

			return data_options;

		},

		setHeadData: function(){
			var base = this;

			var headSource          = base.options.headerDataSource;
			var hiddenFields        = headSource.hiddenFields.split(',');
			var sortableFields      = headSource.sortableFields.split(',');
			var searchableFields    = headSource.searchableFields.split(',');
			var headerFields        = headSource.dataFields.split(',');
			var headDataHtml = "";
			$.each(headerFields, function (i, val) {
				var data_options = base.getDataOptions(val, hiddenFields, sortableFields, searchableFields);
				headDataHtml += sprintf(base.templates().head_column,data_options,val);
			});

			$('.qenruGridHead').html(headDataHtml);
		},

		setRowData:function(){
			var base = this;
			var row = "";
			var headSource = base.options.headerDataSource;
			var hiddenFields = headSource.hiddenFields.split(',');
			var headerFields = headSource.dataFields.split(',');
			var rowSource = base.options.rowDataSource;

			$.each(rowSource, function (i, val) {
				var row_data = base.getRowData(val, hiddenFields, headerFields);
				row += sprintf(base.templates().body_row, row_data);
			});

			$('.qenruGridBody').html(row);
		},

		getRowData: function(data,hidden,headerData){
			var base = this;
			var row_data = "";

			$.each(headerData, function (i, val) {
				var is_hidden = jQuery.inArray(val, hidden);
				if (is_hidden == -1) {
					row_data += sprintf(base.templates().body_row_data, data[val]);
				} else {
					row_data += sprintf(base.templates().body_row_data_hidden, data[val]);
				}
			});



			return row_data;
		},

		loadContent : function (sortBy,orderBy) {

			var base = this;

			if(sortBy !== undefined){
				base.sortElements(sortBy,orderBy);
			}
			else
				base.setPage();
			

			base.setGridWidth();
			base.optionBuilder();

			$( ".qenruInlineSearch" ).keyup(function() {
				var self = $(this);
				$(this).trigger('qenru.inline-search');
			});
			

		},

		optionBuilder: function(){
			var base = this;
			base.$elem.find('.qenruCol').each(function(i){
				var self = $(this);
				var options = base.getOption(self);
				if(options != ""){
					if(options.indexOf('|') === -1){
						base.optionSet(options,self);
					}
					else{
						var optionArr = options.split('|');
						base.optionSetByArray(optionArr,self);
					}
				}
			});

		},

		optionSetByArray : function(opt,el){
			var base = this;
			for (var i = opt.length - 1; i >= 0; i--) {
				base.optionSwitch(opt[i],el);
			}
		},

		optionSet : function(opt,el){
			var base = this;
			base.optionSwitch(opt,el);
		},

		optionSwitch : function(option,el){
			var base = this;
			switch(option){
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

		hideElement: function(el){
			var base = this;
			base.setStyle(el,"display","none");
		},

		makeSortable:function(el){
			var base = this;
			if(base.options.colSort){
				el.addClass('sortable');
				
			}
			
		},

		makeSearchable: function(el){
			var base = this;
			var inlineSearch = sprintf(base.templates().inline_search,"Filtrele");
			if(base.options.colSearch){
				el.find('.qenruInlineSearch').remove();
				el.append(inlineSearch);
			}
		},

		checkIfDataExist : function(el,label,data,isLoop){
			var status = false;
			if(isLoop == true){
				el.each(function(){
					var self = $(this);
					if(self[0].attributes[label].value == data)
						status = true;

				});
			}else{
				if(el[0].attributes[label].value == data)
					status = true;
				else
					status = false;
			}

			return status;
			
		},

		setGridWidth : function(){
			var base = this;
			var userOpt = base.options;
			if(userOpt.headerColCount > 0)
			{
				if(userOpt.colCustomWidth != null )
				{
					var i = 0;
					base.$elem.find('.qenruGridHead .qenruCol').each(function(index){
						var self = $(this);
						var opt = base.getOption(self);
						if(opt.indexOf("hidden") === -1){

							base.setGridRow(index,userOpt.colCustomWidth[i],userOpt.widthType,false);
							base.setStyle(self,"width",userOpt.colCustomWidth[i] + userOpt.widthType);
							i++;
						}
						else
						{
							base.setGridRow(index,userOpt.colCustomWidth[i],userOpt.widthType,true);
							return;
						}

					});
				}
			}
		},

		setGridRow: function(index,width,widthType,isNone){
			var base = this;
			base.$elem.find('.qenruGridBody .qenruRow').each(function(){

				var self = $(this);

				if(isNone == true){

					var row = self.find('.qenruRowData:eq('+index+')');
					base.setStyle(row,"display","none");

				}else{

					var row = self.find('.qenruRowData:eq('+index+')');
					base.setStyle(row,"width",width + widthType);

				}

			});
		},

		setStyle: function(el,type,value){
			el.css(type,value);
		},

		getOption : function(el){
			var opt = el.attr('data-option');
			if(typeof opt != typeof undefined){
				return opt;
			}
			else
				return "";
		},

		reloadGrid : function(el,orderBy){
			var base = this;
			if(el !== undefined){
				var sortByIndex = el.prevAll().length;
				base.loadContent(sortByIndex,orderBy);
			}
			else
				base.loadContent();
		},

		sortElements: function(eq,orderBy){
			var rows = $('.qenruRow');
			var newOrder = orderBy == "asc" ? "desc" : "asc";
			rows.sort(function (a, b) {
				a = $(a).find('.qenruRowData:eq('+eq+')').html();
				b = $(b).find('.qenruRowData:eq('+eq+')').html();
			    // compare
			    if(orderBy == "asc"){
			    	if(a > b) {
			    		return 1;
			    	} else if(a < b) {
			    		return -1;
			    	} else {
			    		return 0;
			    	}
			    }
			    else
			    {
			    	if(a > b) {
			    		return -1;
			    	} else if(a < b) {
			    		return 1;
			    	} else {
			    		return 0;
			    	}
			    }

			});

			$(".qenruGridBody").append(rows);
			$('.qenruGridHead').find('.qenruCol:eq('+eq+')').attr('data-orderby',newOrder);
		},

		templates: function(){

			var templateContent = {
				"prev_page" 	            : "<a href='#prev' class='qenruPager %s'>&#x21d0;</a>",
				"next_page" 	            : "<a href='#next' class='qenruPager %s'>&#8658;</a>",
				"page_index"	            : "<a href='#%s' class='qenruPager'>%s</a>",
				"inline_search"             : "<input type='text' class='qenruInlineSearch' placeholder='%s'/>",
				"head_column"               : "<div class='qenruCol' %s>%s</div>",
				"body_row"                  : "<div class='qenruRow'>%s</div>",
				"body_row_data_hidden"      : "<div class='qenruRowData' style='display:none'>%s</div>",
				"body_row_data"             : "<div class='qenruRowData'>%s</div>",
				"sub_content"               : "<div class='subContent'>%s</div>",
				"sub_content_head"          : "<div class='subHead'><div class='subHeadContainer'>%s</div></div>",
				"sub_content_body"          : "<div class='subBody'><div class='subBodyContainer'>%s</div></div>",
				"sub_content_body_row"      : "<div class='subBodyRow'>%s</div>",
				"sub_content_body_row_data" : "<div class='subBodyRowData'>%s</div>"
			}
			return templateContent;

		},

		customEvents : function () {
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
				if(base.options.colSearch)
					base.inlineSearch(self);

			});
		},

		rowsPerPage: function(self){
			var base = this;
			var rowNo = self.val();
			base.options.rowPerPage = rowNo > 0 ? rowNo : 999999999999;

			base.init(base.options,base.el);
		},

		makePager: function(page){
			var base = this;
			page = page === undefined ? base.current_page_id : page;
			base.totalRow = $('.qenruRow').length;
			base.totalPage = base.totalRow % base.options.rowPerPage == 0 ? base.totalRow / base.options.rowPerPage : parseInt(base.totalRow / base.options.rowPerPage) + 1;


			var next_page = (page + 1) > base.totalPage ? sprintf(base.templates().next_page, "active") : sprintf(base.templates().next_page, "");
			var prev_page = (page - 1) < 1 ? sprintf(base.templates().prev_page, "active") : sprintf(base.templates().prev_page, "");

			var html = prev_page;

			var current_page = page;

			html += sprintf(base.templates().page_index, current_page, current_page);

			html += next_page;
			$('.qenruGridFooter').html(html);

			$(".qenruPager").on("click",function(){
				$(this).trigger('qenru.pager');
			});
		},

		setPage: function(){
			var base = this;
			var pageId = 1;
			$(".qenruRow:visible").each(function(i){
				var self = $(this);
				console.log(base.options.rowPerPage);
				if((i + 1) % base.options.rowPerPage == 0)
				{
					self.attr('data-row-id',pageId);
					pageId++;
				}
				else
					self.attr('data-row-id',pageId);
			});

			base.shapePage();
		},

		shapePage : function(trigger){
			var base = this;
			base.updateCurrentPageId();
			
			if(trigger == "next"){
				var is_exist = base.checkIfDataExist($('.qenruRow'),"data-row-id",parseInt(base.current_page_id,10) + 1,true);
				if(is_exist)
					trigger = parseInt(base.current_page_id,10) + 1;
				else
					trigger = -1;
			}
			else if(trigger == "prev"){
				var is_exist = base.checkIfDataExist($('.qenruRow'),"data-row-id",parseInt(base.current_page_id,10) - 1,true);
				if(is_exist)
					trigger = parseInt(base.current_page_id,10) - 1;
				else
					trigger = -1;
			}
			if(base.current_page_id < 0){

			}else
			{
				$('.qenruRow').each(function(){
					var self = $(this);
					var data_id = self.attr('data-row-id');
					if(trigger !== undefined){

						if(data_id != trigger)
							base.setStyle(self,"display","none");
						else
							base.setStyle(self,"display","block");
					}else{
						if(self.is(":visible")){
							if(data_id != base.current_page_id)
								base.setStyle(self,"display","none");
							else
								base.setStyle(self,"display","block");
						}
					}

				});
			}

			base.makePager(trigger);

		},

		inlineSearch: function(el){
			var base = this;
			base.updateCurrentPageId();
			var colIndex = el.parent().prevAll().length;
			var value = el.val().toLowerCase();;
			$(".qenruRow").each(function (ix, el) {

				var row = $(this);
				var page_id = row.attr('data-row-id');
				if(base.current_page_id == page_id){
					var cell = row.find(".qenruRowData:eq("+colIndex+")");


					var cell_value = cell.text().toLowerCase();;

					row.toggle(cell_value.indexOf(value) >= 0);
				}
				
			});
			base.shapePage();
		},

		pageData: function(el){
			var base = this;
			if(el.hasClass('active') == false){
				var to = el.attr('href').split('#')[1];
				base.shapePage(to);
			}
		},

		sortData: function(el){
			var base = this;
			var orderBy = el.attr('data-orderby');
			$('.sortable').removeClass('order-down').removeClass('order-up')
			if(orderBy === undefined){
				orderBy = "asc";
				el.removeClass('order-down').addClass('order-up');
			}
			else if(orderBy == "asc")
				el.removeClass('order-down').addClass('order-up');
			else
				el.removeClass('order-up').addClass('order-down');
			orderBy = orderBy === undefined ? "asc" : orderBy;
			base.reloadGrid(el,orderBy);
		},

		

	};

	function sprintf( format )
	{
		for( var i=1; i < arguments.length; i++ ) {
			format = format.replace( /%s/, arguments[i] );
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

		headerColCount : 0,
		widthType : "px",
		colCustomWidth : [],
		search:true,
		responsive:true,
		rowPerPage:10,
		totalPageButton: 5,
		colSearch: false,
		headerDataSource: null,
		rowDataSource: null,
		colSort:false
	};

	String.prototype.rtrim = function (s) {
		return this.replace(new RegExp(s + "/*$"), '');
	};

}(jQuery, window, document));