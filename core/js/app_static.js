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
			
			base.$elem = $(el);
			base.options = $.extend({}, $.fn.qenruGrid.options, base.$elem.data(), options);
			
			
			base.userOptions = options;
			base.loadContent();
			base.customEvents();

		},

		loadContent : function (sortBy,orderBy) {

			var base = this;

			if(sortBy !== undefined){
				base.sortElements(sortBy,orderBy);
			}
			

			base.setGridWidth();
			base.optionBuilder();
			base.setPage();
			

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
			el.addClass('sortable');
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
				"prev_page" 	: "<a href='#prev' class='qenruPager %s'>&#x21d0;</a>",
				"next_page" 	: "<a href='#next' class='qenruPager %s'>&#8658;</a>",
				"page_index"	: "<a href='#%s' class='qenruPager'>%s</a>",
				"inline_search"	: "<input type='text' class='qenruInlineSearch' placeholder='%s'/>"
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
			base.$elem.on("qenru.inline-search", function (e) {
				var self = $(e.target);
				if(base.options.colSearch)
					base.inlineSearch(self);

			});
		},

		makePager: function(page){
			var base = this;
			page = page === undefined ? 1 : page;
			base.totalRow = $('.qenruRow').length;

			base.totalPage = base.totalRow / base.options.rowPerPage;

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
			base.current_page_id = $('.qenruRow:visible').data('row-id') !== undefined ? $('.qenruRow:visible').data('row-id') : -1;
			

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
							if(data_id != 1)
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
			var colIndex = el.parent().prevAll().length;
			var value = el.val().toLowerCase();;
			$(".qenruRow").each(function (ix, el) {
				var row = $(this);
				var cell = row.find(".qenruRowData:eq("+colIndex+")");


				var cell_value = cell.text().toLowerCase();;

				row.toggle(cell_value.indexOf(value) >= 0);
				
				
			});
			base.setPage();
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
		}

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
		colSearch:false
	};


}(jQuery, window, document));