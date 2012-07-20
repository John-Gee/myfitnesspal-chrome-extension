var grid;
var data = undefined;
var columns = [
	{id: "none", name: "", field: "none", width: 100, editor: FormulaEditor},
	{id: "carbs", name: "Carbs", field: "carbs", width: 100, editor: FormulaEditor},
	{id: "fat", name: "Fat", field: "fat", width: 100, editor: FormulaEditor},
	{id: "protein", name: "Protein", field: "protein", width: 100, editor: FormulaEditor},
	{id: "totalderivedcalories", name: "Total derived calories", field: "totalderivedcalories", width: 225},
	{id: "totaldesiredcalories", name: "Total desired calories", field: "totaldesiredcalories", width: 225, editor: FormulaEditor},
	{id: "totalcaloriesdifference", name: "Total calories difference", field: "totalcaloriesdifference", width: 225},
];

var options = {
	editable: true,
	enableAddRow: false,
	enableCellNavigation: true,
	asyncEditorLoading: false,
	autoEdit: false,
	enableColumnReorder: false,
	multiSelect: false
};

function FormulaEditor(args) {
	var _self = this;
	var _editor = new Slick.Editors.Text(args);
	var _selector;

	$.extend(this, _editor);

	function init() {
		// register a plugin to select a range and append it to the textbox
		// since events are fired in reverse order (most recently added are executed first),
		// this will override other plugins like moverows or selection model and will
		// not require the grid to not be in the edit mode
		_selector = new Slick.CellRangeSelector();
		_selector.onCellRangeSelected.subscribe(_self.handleCellRangeSelected);
		args.grid.registerPlugin(_selector);
	}

	this.destroy = function () {
		_selector.onCellRangeSelected.unsubscribe(_self.handleCellRangeSelected);
		grid.unregisterPlugin(_selector);
		_editor.destroy();
	};

	this.handleCellRangeSelected = function (e, args) {
		_editor.setValue(
			_editor.getValue() +
				grid.getColumns()[args.range.fromCell].name +
				args.range.fromRow +
				":" +
				grid.getColumns()[args.range.toCell].name +
				args.range.toRow
		);
	};
	init();
}

function Refresh()
{
	var sumoftotalderivedcalories = parseInt(0);
	var sumoftotaldesiredcalories = parseInt(0);
	for (i in days) {
		if (i == days.length - 1)
		{
			data[i] = {
				none: days[i],
				carbs: "N/A",
				fat: "N/A",
				protein: "N/A",
				totalderivedcalories: sumoftotalderivedcalories,
				totaldesiredcalories: sumoftotaldesiredcalories,
				totalcaloriesdifference: parseInt(sumoftotalderivedcalories) - parseInt(sumoftotaldesiredcalories)
			};
		}
		else
		{
			if(data[i] == undefined)
			{
				data[i] = {
					none: days[i],
					carbs: parseInt(0),
					fat: parseInt(0),
					protein: parseInt(0),
					totalderivedcalories: parseInt(0),
					totaldesiredcalories: parseInt(0),
					totalcaloriesdifference: parseInt(0) - parseInt(0)
				};
			}
		
		
		
			data[i].totalderivedcalories = 
						(data[i].carbs * 4)
					+	(data[i].fat * 9)
					+	(data[i].protein * 4);
					
			data[i].totalcaloriesdifference = data[i].totalderivedcalories - data[i].totaldesiredcalories;
		}			
		sumoftotalderivedcalories = parseInt(sumoftotalderivedcalories) + parseInt(data[i].totalderivedcalories);
		sumoftotaldesiredcalories = parseInt(sumoftotaldesiredcalories) + parseInt(data[i].totaldesiredcalories);
	}
}

function Save()
{
	localStorage["data"] = JSON.stringify(data);
}

function ReloadData()
{
	var tmpJSON = localStorage["data"];
	if(( typeof( tmpJSON ) != "undefined") && (tmpJSON != "undefined") )
	{
		data = JSON.parse(tmpJSON);
	}
	if(( typeof( data ) == "undefined") || (data == "undefined") )
	{
		data = [];
	}
}

function Reset()
{
	data = []
	Refresh();
}

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Week"];
localStorage["days"] = JSON.stringify(days);
$(function() {
	//all hover and click logic for buttons
	$(".fg-button:not(.ui-state-disabled)")
	.hover(
		function(){ 
			$(this).addClass("ui-state-hover"); 
		},
		function(){ 
			$(this).removeClass("ui-state-hover"); 
		}
	)
	.mousedown(function(){
			$(this).parents('.fg-buttonset-single:first').find(".fg-button.ui-state-active").removeClass("ui-state-active");
			if( $(this).is('.ui-state-active.fg-button-toggleable, .fg-buttonset-multi .ui-state-active') ){ $(this).removeClass("ui-state-active"); }
			else { $(this).addClass("ui-state-active"); }	
	})
	.mouseup(function(){
		if(! $(this).is('.fg-button-toggleable, .fg-buttonset-single .fg-button,  .fg-buttonset-multi .fg-button') ){
			$(this).removeClass("ui-state-active");
		}
	});
	
	$("#save").click(function() {
		Save();
	});
	
	$("#reload").click(function() {
		ReloadData();
		grid.setData(data);
		grid.render();
	});
	
	$("#reset").click(function() {
		Reset();
		grid.setData(data);
		grid.render();
	});
	
	ReloadData();
	
	if(data.length == 0 )
	  Refresh();
	
	grid = new Slick.Grid("#myGrid", data, columns, options);
	
	grid.onSelectedRowsChanged.subscribe(function(args){
		Refresh();
		grid.setData(data);
		grid.render();
	});
	
	grid.setSelectionModel(new Slick.CellSelectionModel());
	grid.registerPlugin(new Slick.AutoTooltips());
	
	// set keyboard focus on the grid
	grid.getCanvasNode().focus();
	
	var copyManager = new Slick.CellCopyManager();
	grid.registerPlugin(copyManager);
	
	copyManager.onPasteCells.subscribe(function (e, args) {
		if (args.from.length !== 1 || args.to.length !== 1) {
			throw "This implementation only supports single range copy and paste operations";
		}
		var from = args.from[0];
		var to = args.to[0];
		var val;
		for (var i = 0; i <= from.toRow - from.fromRow; i++) {
			for (var j = 0; j <= from.toCell - from.fromCell; j++) {
				if (i <= to.toRow - to.fromRow && j <= to.toCell - to.fromCell) {
					val = data[from.fromRow + i][columns[from.fromCell + j].field];
					data[to.fromRow + i][columns[to.fromCell + j].field] = val;
					grid.invalidateRow(to.fromRow + i);
				}
			}
		}
		
		grid.render();
	});
	
	grid.onAddNewRow.subscribe(function (e, args) {
      var item = args.item;
      var column = args.column;
      grid.invalidateRow(data.length);
      data.push(item);
      grid.updateRowCount();
      grid.render();
    });
})