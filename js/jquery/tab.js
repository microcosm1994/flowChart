/**
 * 添加tab选项卡
 * 
 * @param {Object}
 *            $tab
 * @param {Object}
 *            param {"title": "", "id": "", "content": ""}
 */
function addTab($tab, param) {
	if (isExists($tab, param["id"])) {
		// 如果选项卡已经存在，则调用selectTab函数将其选中
		selectTab($tab, param["id"]);
	} else {
		// 如果选项卡不存在，则先创建再将其选中
		// 去掉选项卡标签的选中样式
		$tab.children("ul").children().removeClass("tab-header-selected");
		// 创建选项卡标签
		$newHeaderItem = $("<li></li>");
		$newHeaderItem.text(param["title"]).attr("target", param["id"]).addClass("tab-header-item").addClass("tab-header-selected").append($("<span class=\"close\"></span>")).appendTo($tab.children("ul"));
		// 隐藏所有选项卡面板
		$tab.children("div").children().addClass("hide");
		// 创建新的选项卡面板
		$newContentItem = $("<div></div>");
		$newContentItem.html(param["content"]).attr("id", param["id"]).addClass("tab-content-item")// .addClass("hide")
		.appendTo($tab.children("div"));
	}
}
/**
 * 添加tab选项卡和面板，再从远程url获取数据填充到面板中
 * 
 * @param {Object}
 *            $tab
 * @param {Object}
 *            param {"title": "", "id": "", "url": "", "method": ""}
 */
function addRemoteTab($tab, param) {
	// 添加选项卡
	addTab($tab, {
		"title" : param["title"],
		"id" : param["id"],
		"content" : ""
	});
	// 获取数据，然后填充到新添加的面板
	$.ajax({
		type : param["method"] || "post",
		dataType : "html",
		url : param["url"],
		cache : false,
		success : function(data) {
			// 填充数据到面板
			$tab.find("#" + param["id"]).html(data);
		}
	});
}
/**
 * 删除tab选项卡
 * 
 * @param {Object}
 *            $tab
 * @param {Object}
 *            tabId
 */
function removeTab($tab, tabId) {
	// 获取待删除选项卡标签
	var headerItem = $tab.children("ul").children("li[target=" + tabId + "]");
	// 获取该选项卡是否被选中
	var selected = headerItem.hasClass("tab-header-selected");
	// 获取前一个选项卡
	var prevItem = headerItem.prev();
	// 如果没有前一个，则获取后一个
	if (!prevItem[0]) {
		prevItem = headerItem.next();
	}
	// 删除选项卡标签
	headerItem.remove();
	// 删除选项卡面板
	$tab.children("div").children("#" + tabId).remove();
	// 如果待删除选项卡已经被选中且有相邻标签，则将相邻选项卡选中
	if (selected && prevItem) {
		// 标签样式
		prevItem.addClass("tab-header-selected");
		// 面板样式
		$tab.children("div").children("#" + prevItem.attr("target")).removeClass("hide");
	}
}
/**
 * 选中指定tab标签
 * 
 * @param {Object}
 *            $tab
 * @param {Object}
 *            tabId
 */
function selectTab($tab, tabId) {
	// 调整选项卡标签样式
	$tab.find("li[target=" + tabId + "]").addClass("tab-header-selected").siblings().removeClass("tab-header-selected");
	// 调整选项卡面板样式
	$tab.children("div").children("#" + tabId).removeClass("hide").siblings().addClass("hide");
}
/**
 * 判断是否选中指定tab标签
 * 
 * @param {Object}
 *            $tab
 * @param {Object}
 *            tabId
 */
function isSelected($tab, tabId) {
	return $tab.find("li[target=" + tabId + "]").hasClass("tab-header-selected");
}
/**
 * 判断指定tab标签是否存在
 * 
 * @param {Object}
 *            $tab
 * @param {Object}
 *            tabId
 */
function isExists($tab, tabId) {
	return $tab.find("li[target=" + tabId + "]")[0] != undefined;
}
(function($) {
	/**
	 * 初始化tab总高度、内容面板高度
	 * 
	 * @param {Object}
	 *            $tab
	 */
	function initContentHeight($tab) {
		$tab.css("height", ($tab.parent().height() - 2) + "px").find(".tab-content").css("height", ($tab.parent().height() - 58) + "px");
		// .children().css("height", ($tab.parent().height() - 56) + "px");
	}
	/**
	 * 初始化tab选项卡、面板样式
	 * 
	 * @param {Object}
	 *            $tab
	 */
	function initTab($tab) {
		$tab.children("ul").addClass("tab-header")// .addClass("clearfix")
		.children("li").addClass("tab-header-item").append($("<span class=\"close\"></span>")).eq(0).addClass("tab-header-selected");
		$tab.children("div").addClass("tab-content").children("div").addClass("tab-content-item").addClass("hide").eq(0).removeClass("hide");
	}
	/**
	 * 初始化选项卡点击事件、关闭按钮点击事件
	 * 
	 * @param {Object}
	 *            $tab
	 */
	function initEvents($tab) {
		$tab
		// 选项卡点击事件
		.delegate(".tab-header-item", "click", function() {
			var selected = $(this).hasClass("tab-header-selected");
			if (!selected) {
				// 如果这个选项卡没有选中，就调用selectTab函数进行选中
				selectTab($tab, $(this).attr("target"));
			}
		})
		// 关闭按钮点击事件
		.delegate(".close", "click", function() {
			// 获取需要关闭的tab标签的tabId
			var tabId = $(this).parent().attr("target");
			// 调用removeTab函数关闭指定标签
			removeTab($tab, tabId);
		});
	}
	$.fn.tab = function(options, param) {
		// 保存对象
		var tab = $(this);
		if (typeof options == 'string') {
			switch (options) {
			case 'addTab':
				return addTab(tab, param);
			case 'addRemoteTab':
				return addRemoteTab(tab, param);
			case 'removeTab':
				return removeTab(tab, param);
			case 'selectTab':
				return selectTab(tab, param);
			case 'isSelected':
				return isSelected(tab, param);
			case 'isExists':
				return isExists(tab, param);
			}
		}
		options = options || {};
		return this.each(function() {
			// 初始化tab选项卡、面板样式
			initTab(tab);
			// 初始化tab总高度、内容面板高度
			initContentHeight(tab);
			// 初始化选项卡点击事件、关闭按钮点击事件
			initEvents(tab);
		});
	};
})(jQuery);