(function(cfg) {
	let $ = go.GraphObject.make;
	let palette = myPalette = $(go.Palette, "myPaletteDiv",// must name or refer to the DIV HTML element
	{
		scrollsPageOnFocus : false,
		model : new go.GraphLinksModel([ // specify the contents of the Palette
		{
			title : "接口",
			figure : "AndGate"
		}, {
			title : "选择",
			figure : "OrGate"
		}, {
			title : "常量",
			figure : "Circle"
		}, {
			title : "变量",
			figure : "Triangle"
		} ])
	});
	palette.nodeTemplate = nodeTemplate(cfg);
	palette.linkTemplate = linkTemplate(20);
}).push({});