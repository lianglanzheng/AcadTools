var PileCalcPrj;
var ImportJsonButton;
var DrillSelect;
var PileSelect;
var DrillInfo;
var ConInfo;
var CurrentDrill;
var CurrentPile;
var CurrentPile_Name;
var CalcInfo;
var Pi = 3.141592654;

function DecimalCalc(value) {
	return Number(value.toPrecision(10));
}

function ObjAsg(value) {
	return JSON.parse(JSON.stringify(value));
}

function NumTextFix(value) {
	if (isNaN(parseFloat(value))) return 0;
	else return value;
}

function LineCount(str) {
	lines = str.split("\n");
	return lines.length;
}

function TriggerClick(obj) {
	var MouseEvents = document.createEvent("MouseEvents");
	MouseEvents.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	obj.dispatchEvent(MouseEvents);
}

function init() {
	ImportJsonButton = document.getElementById("ImportJsonButton");
	ExportJsonButton = document.getElementById("ExportJsonButton");
	ExportResultButton = document.getElementById("ExportResultButton");
	DrillSelect = document.getElementById("DrillSelect");
	PileSelect = document.getElementById("PileSelect");
	DrillInfo = new Object();
	DrillInfo.钻孔编号 = document.getElementById("DrillInfo").children.钻孔编号;
	DrillInfo.孔口标高 = document.getElementById("DrillInfo").children.孔口标高;
	DrillInfo.钻孔深度 = document.getElementById("DrillInfo").children.钻孔深度;
	DrillInfo.线别工程名称 = document.getElementById("DrillInfo").children.线别工程名称;
	DrillInfo.土层列表 = document.getElementById("DrillInfo").children.土层列表;
	ConInfo = new Object();
	ConInfo.桩柱名称 = document.getElementById("ConInfo").children.桩柱名称;
	ConInfo.备注 = document.getElementById("ConInfo").children.备注;
	ConInfo.参考钻孔 = document.getElementById("ConInfo").children.参考钻孔;
	ConInfo.孔口标高 = document.getElementById("ConInfo").children.孔口标高;
	ConInfo.土层列表 = document.getElementById("ConInfo").children.土层列表;
	ConInfo.桩径 = document.getElementById("ConInfo").children.桩径;
	ConInfo.桩顶标高 = document.getElementById("ConInfo").children.桩顶标高;
	ConInfo.桩底标高 = document.getElementById("ConInfo").children.桩底标高;
	ConInfo.计算结果 = document.getElementById("ConInfo").children.计算结果;
}

function ImportJson() {
	init();
	ImportJsonButton.disabled = true;
	ExportJsonButton.disabled = false;
	ExportResultButton.disabled = false;
	var reader = new FileReader();
	reader.readAsText(ImportJsonButton.files[0]);
	reader.onload = function(evt) {
		PileCalcPrj = JSON.parse(evt.target.result);
		FillDrillSelect();
		RefreshPileSelect();
	};
}

function ExportJson() {
	var Export_Blob = new Blob([JSON.stringify(PileCalcPrj)]);
	var SaveLink = document.createElement("a");
	SaveLink.href = URL.createObjectURL(Export_Blob);
	SaveLink.download = "新建桩柱钻孔工程.json";
	TriggerClick(SaveLink);
}

function ExportResult() {
	var ExWin = window.open("");
	ExWin.document.charset = "UTF-8";
	ExWin.document.title = "计算结果";
	var ele = ExWin.document.createElement("h1");
	ele.textContent = "计算结果";
	ExWin.document.body.append(ele);

	var Keys桩柱集 = Object.keys(PileCalcPrj.桩柱集);
	Keys桩柱集.sort().forEach(element => {
		var ele = ExWin.document.createElement("h3");
		ele.textContent = element;
		ExWin.document.body.append(ele);
		var thisCalcInfo = CalcPile(element, PileCalcPrj.桩柱集[element]);
		var ele = ExWin.document.createElement("ol");
		ele.style = "padding: 0";
		var li = document.createElement("li");
		li.style = "list-style-type:none; font-weight: bold";
		li.textContent = "桩长: " + thisCalcInfo.桩长 + "m";
		ele.appendChild(li);
		var li = document.createElement("li");
		li.style = "list-style-type:none; font-weight: bold";
		li.textContent = "桩径: " + thisCalcInfo.桩径 + "m";
		ele.appendChild(li);
		var li = document.createElement("li");
		li.style = "list-style-type:none; font-weight: bold";
		li.textContent = "桩顶标高: " + thisCalcInfo.桩顶标高 + "m";
		ele.appendChild(li);
		var li = document.createElement("li");
		li.style = "list-style-type:none; font-weight: bold";
		li.textContent = "桩底标高: " + thisCalcInfo.桩底标高 + "m";
		ele.appendChild(li);
		var li = document.createElement("li");
		li.style = "list-style-type:none; font-weight: bold";
		li.textContent = "桩顶承载力容许值[Ra]: " + thisCalcInfo.承载力容许值 + "kN";
		ele.appendChild(li);
		ExWin.document.body.append(ele);
		var ele = ExWin.document.createElement("textarea");
		ele.style = "resize: none; width: 100%";
		ele.textContent = thisCalcInfo.ResultText;
		ele.rows = LineCount(thisCalcInfo.ResultText);
		ExWin.document.body.append(ele);
	});
	var Export_Blob = new Blob([ExWin.document.documentElement.outerHTML]);
	var SaveLink = document.createElement("a");
	SaveLink.href = URL.createObjectURL(Export_Blob);
	SaveLink.download = "计算结果.html";
	TriggerClick(SaveLink);
}

function FillDrillSelect() {
	var Keys钻孔集 = Object.keys(PileCalcPrj.钻孔集);
	var option = document.createElement("option");
	option.text = "选择钻孔";
	option.value = "";
	DrillSelect.add(option, null);
	Keys钻孔集.sort().forEach(element => {
		var option = document.createElement("option");
		option.text = element;
		option.value = element;
		DrillSelect.add(option, null);
	});
}

function RefreshPileSelect() {
	while (PileSelect.childNodes.length > 0) PileSelect.removeChild(PileSelect.firstChild);
	var option = document.createElement("option");
	option.text = "选择桩柱";
	option.value = "";
	PileSelect.add(option, null);
	var Keys桩柱集 = Object.keys(PileCalcPrj.桩柱集);
	Keys桩柱集.sort().forEach(element => {
		var option = document.createElement("option");
		option.text = element;
		option.value = element;
		PileSelect.add(option, null);
	});
}

function RefreshDrill_基本() {
	DrillInfo.钻孔编号.value = DrillSelect.value;
	DrillInfo.孔口标高.value = CurrentDrill.孔口标高;
	DrillInfo.钻孔深度.value = CurrentDrill.钻孔深度;
	DrillInfo.线别工程名称.value = CurrentDrill.线别工程名称;
}

function RefreshDrill_土层() {
	var ol = DrillInfo.土层列表;
	while (ol.childNodes.length > 0) ol.removeChild(ol.firstChild);
	if (true) {
		var li = document.createElement("li");
		li.style = "list-style-type:none; font-weight: bold";
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 20px";
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 16%";
		lidiv.align = "center";
		lidiv.textContent = "地层编号";
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 37%";
		lidiv.align = "center";
		lidiv.textContent = "土类名称";
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 10%";
		lidiv.align = "center";
		lidiv.textContent = "层厚";
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 15%";
		lidiv.align = "center";
		lidiv.textContent = "qk";
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 15%";
		lidiv.align = "center";
		lidiv.textContent = "fa0";
		li.appendChild(lidiv);
		ol.appendChild(li);
	}
	var 层顶标高 = DecimalCalc(CurrentDrill.孔口标高);
	var 层底标高;
	CurrentDrill.地层集.forEach(element => {
		var li = document.createElement("li");
		li.style = "list-style-type:none; border: 1px solid #DDF";
		li.title = element.年代成因 + " " + element.野外描述;
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 20px; background-color: #DDF";
		lidiv.align = "center";
		lidiv.textContent = element.地层序号;
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 15%";
		lidiv.align = "center";
		lidiv.textContent = element.地层编号;
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 38%";
		lidiv.align = "center";
		lidiv.textContent = element.土类名称;
		li.appendChild(lidiv);
		层底标高 = DecimalCalc(CurrentDrill.孔口标高 - element.换层深度);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 10%";
		lidiv.align = "center";
		lidiv.textContent = DecimalCalc(层顶标高 - 层底标高) + "m";
		li.appendChild(lidiv);
		层顶标高 = 层底标高;
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 15%";
		lidiv.align = "center";
		lidiv.textContent = element.侧摩阻力标准值 + "kPa";
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 15%";
		lidiv.align = "center";
		lidiv.textContent = element.容许承载力 + "kPa";
		li.appendChild(lidiv);
		ol.appendChild(li);
	});
}

function RefreshDrillInfo() {
	if (DrillSelect.firstChild.value == "") DrillSelect.removeChild(DrillSelect.firstChild);
	CurrentDrill = PileCalcPrj.钻孔集[DrillSelect.value];
	RefreshDrill_基本();
	RefreshDrill_土层();
}

function NewPile() {
	if (CurrentDrill != null) {
		CurrentPile_Name = ObjAsg(CurrentDrill.线别工程名称 + "-" + DrillInfo.钻孔编号.value);
		CurrentPile = new Object();
		CurrentPile["备注"] = Date();
		CurrentPile["参考钻孔"] = ObjAsg(DrillInfo.钻孔编号.value);
		CurrentPile["桩径"] = 1;
		CurrentPile["桩顶标高"] = CurrentDrill.孔口标高;
		CurrentPile["桩底标高"] = DecimalCalc(CurrentDrill.孔口标高 - CurrentDrill.钻孔深度);
		CurrentPile["施工地质"] = ObjAsg(CurrentDrill);
		RefreshPileInfo();
	}
}

function SavePile() {
	if (CurrentPile_Name == "") alert("桩柱名称不能为空。");
	else {
		if (Object.keys(PileCalcPrj.桩柱集).length != 0 && PileCalcPrj.桩柱集[CurrentPile_Name] != undefined)
		{
			if (confirm(CurrentPile_Name + "已存在，是否覆盖？")) PileCalcPrj.桩柱集[CurrentPile_Name] = ObjAsg(CurrentPile);
		}
		else PileCalcPrj.桩柱集[CurrentPile_Name] = ObjAsg(CurrentPile);
	}
	RefreshPileSelect();
}

function LoadPile() {
	CurrentPile_Name = PileSelect.value;
	CurrentPile = ObjAsg(PileCalcPrj.桩柱集[PileSelect.value]);
	RefreshPileInfo();
}

function DelPile() {
	if (PileSelect.value != "" && confirm("删除" + PileSelect.value + "？")) {
		delete PileCalcPrj.桩柱集[PileSelect.value];
		RefreshPileSelect();
	}
}

function RefreshPile_基本() {
	ConInfo.桩柱名称.value = CurrentPile_Name;
	ConInfo.备注.value = CurrentPile.备注;
	ConInfo.参考钻孔.value = CurrentPile.参考钻孔;
	ConInfo.孔口标高.value = CurrentPile.施工地质.孔口标高;
	ConInfo.桩径.value = CurrentPile.桩径;
	ConInfo.桩顶标高.value = CurrentPile.桩顶标高;
	ConInfo.桩底标高.value = CurrentPile.桩底标高;
	ConInfo.孔口标高.onchange = PileEdit_Chg孔口标高;
	ConInfo.桩柱名称.onchange = PileEdit_Chg桩柱名称;
	ConInfo.备注.onchange = PileEdit_Chg备注;
	ConInfo.桩径.onchange = PileEdit_Chg桩径;
	ConInfo.桩顶标高.onchange = PileEdit_Chg桩顶标高;
	ConInfo.桩底标高.onchange = PileEdit_Chg桩底标高;
}

function RefreshPile_土层() {
	var ol = ConInfo.土层列表;
	while (ol.childNodes.length > 0) ol.removeChild(ol.firstChild);
	if (true) {
		var li = document.createElement("li");
		li.style = "list-style-type:none; font-weight: bold";
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 20px";
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 15%";
		lidiv.align = "center";
		lidiv.textContent = "地层编号";
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 32%";
		lidiv.align = "center";
		lidiv.textContent = "土类名称";
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 13%";
		lidiv.align = "center";
		lidiv.textContent = "层底标高";
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 12%";
		lidiv.align = "center";
		lidiv.textContent = "qk";
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 12%";
		lidiv.align = "center";
		lidiv.textContent = "fa0";
		li.appendChild(lidiv);
		ol.appendChild(li);
	}
	CurrentPile.施工地质.地层集.forEach(element => {
		var ei = CurrentPile.施工地质.地层集.indexOf(element);
		var li = document.createElement("li");
		li.style = "list-style-type:none; border: 1px solid #FDD";
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 20px; background-color: #FDD";
		lidiv.align = "center";
		lidiv.textContent = element.地层序号;
		li.appendChild(lidiv);
		var liin = document.createElement("input");
		liin.name = ei;
		liin.style = "text-align: center; width: 15%; background-color: #FEE; border:1px solid #FDD";
		liin.value = element.地层编号;
		liin.onchange = PileEdit_Chg地层编号;
		li.appendChild(liin);
		var liin = document.createElement("input");
		liin.name = ei;
		liin.style = "text-align: center; width: 35%; background-color: #FEE; border:1px solid #FDD";
		liin.value = element.土类名称;
		liin.onchange = PileEdit_Chg土类名称;
		li.appendChild(liin);
		var liin = document.createElement("input");
		liin.name = ei;
		liin.type = "number";
		liin.style = "text-align: center; width: 10%; background-color: #FEE; border:1px solid #FDD";
		liin.value = DecimalCalc(CurrentPile.施工地质.孔口标高 - element.换层深度);
		liin.onchange = PileEdit_Chg层底标高;
		li.appendChild(liin);
		var liin = document.createElement("input");
		liin.name = ei;
		liin.type = "number";
		liin.style = "text-align: center; width: 12%; background-color: #FEE; border:1px solid #FDD";
		liin.value = element.侧摩阻力标准值;
		liin.onchange = PileEdit_Chg侧摩阻力标准值;
		li.appendChild(liin);
		var liin = document.createElement("input");
		liin.name = ei;
		liin.type = "number";
		liin.style = "text-align: center; width: 12%; background-color: #FEE; border:1px solid #FDD";
		liin.value = element.容许承载力;
		liin.onchange = PileEdit_Chg容许承载力;
		li.appendChild(liin);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 10px";
		li.appendChild(lidiv);
		var libt = document.createElement("button");
		libt.style = "padding: 0; width: 20px";
		libt.textContent = "+";
		libt.value = ei;
		libt.onclick = PileEdit_Add地层;
		li.appendChild(libt);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 10px";
		li.appendChild(lidiv);
		var libt = document.createElement("button");
		libt.style = "padding: 0; width: 20px";
		libt.textContent = "-";
		libt.value = ei;
		libt.onclick = PileEdit_Del地层;
		li.appendChild(libt);
		ol.appendChild(li);
	});
}

function CalcPile(name, target) {
	var thisCalcInfo = new Object();
	thisCalcInfo = ObjAsg(target);
	thisCalcInfo.isError = false;
	thisCalcInfo.ResultText = "";
	thisCalcInfo.承载力容许值 = 0;
	thisCalcInfo.钢筋砼容重 = 26;
	thisCalcInfo.土容重 = 18;
	thisCalcInfo.桩端发挥系数 = 0.1;
	thisCalcInfo.清底系数m0 = 0.85;
	thisCalcInfo.修正系数λ = 0.65;
	thisCalcInfo.桩长 = DecimalCalc(thisCalcInfo.桩顶标高 - thisCalcInfo.桩底标高);
	if (thisCalcInfo.桩长 < 0) {
		thisCalcInfo.isError = true;
		thisCalcInfo.ResultText += "错误: 桩长为负。\n";
	}
	thisCalcInfo.桩周长 = DecimalCalc(thisCalcInfo.桩径 * Pi);
	if (thisCalcInfo.桩周长 < 0) {
		thisCalcInfo.isError = true;
		thisCalcInfo.ResultText += "错误: 桩周长为负。\n";
	}
	thisCalcInfo.桩截面积 = DecimalCalc(Math.pow(thisCalcInfo.桩径 / 2, 2) * Pi);
	if (thisCalcInfo.桩截面积 < 0) {
		thisCalcInfo.isError = true;
		thisCalcInfo.ResultText += "错误: 桩截面积为负。\n";
	}
	var 当前标高 = thisCalcInfo.施工地质.孔口标高;
	thisCalcInfo.施工地质.地层集.forEach(element => {
		element.层顶标高 = 当前标高;
		element.层底标高 = DecimalCalc(thisCalcInfo.施工地质.孔口标高 - element.换层深度);
		element.层厚 = DecimalCalc(element.层顶标高 - element.层底标高);
		element.计算厚度 = DecimalCalc(Math.max(Math.min(thisCalcInfo.桩顶标高, element.层顶标高) - Math.max(thisCalcInfo.桩底标高, element.层底标高), 0));
		当前标高 = element.层底标高;
		if (element.层厚 < 0) {
			thisCalcInfo.isError = true;
			thisCalcInfo.ResultText += "错误: 地层\"" + element.地层序号 + " " + element.土类名称 + "\"层厚为负。\n";
		}
	});
	if (!thisCalcInfo.isError) {
		thisCalcInfo.侧摩阻因子合计 = 0;
		thisCalcInfo.施工地质.地层集.forEach(element => {
			element.侧摩阻因子 = 0;
			if (element.计算厚度 > 0) {
				element.侧摩阻因子 = DecimalCalc(element.计算厚度 * element.侧摩阻力标准值);
				thisCalcInfo.ResultText += element.地层序号 + " " + element.土类名称 + ": " + element.侧摩阻力标准值 + "kPa * " + element.计算厚度 + "m = " + element.侧摩阻因子 + "kN/m\n";
			}
			thisCalcInfo.侧摩阻因子合计 = DecimalCalc(thisCalcInfo.侧摩阻因子合计 + element.侧摩阻因子);
		});
		thisCalcInfo.ResultText += "侧摩阻因子合计: " + thisCalcInfo.侧摩阻因子合计 + "kN/m\n";
		thisCalcInfo.侧摩阻力项 = DecimalCalc(0.5 * thisCalcInfo.侧摩阻因子合计 * thisCalcInfo.桩周长);
		thisCalcInfo.ResultText = "侧摩阻力项: 1/2 * " + thisCalcInfo.桩径 + "m * π * " + thisCalcInfo.侧摩阻因子合计 + "kN/m = " + thisCalcInfo.侧摩阻力项 + "kN\n" + thisCalcInfo.ResultText;
		thisCalcInfo.ResultText += "\n";

		thisCalcInfo.桩重 =	DecimalCalc(thisCalcInfo.桩截面积 * thisCalcInfo.桩长 * thisCalcInfo.钢筋砼容重);
		thisCalcInfo.土重 = 0;
		thisCalcInfo.施工地质.地层集.forEach(element => thisCalcInfo.土重 = DecimalCalc(thisCalcInfo.土重 + thisCalcInfo.桩截面积 * element.计算厚度 * thisCalcInfo.土容重));
		thisCalcInfo.置换土重项 = DecimalCalc(thisCalcInfo.土重 - thisCalcInfo.桩重);
		thisCalcInfo.ResultText += "置换土重项: " + thisCalcInfo.置换土重项 + "kN\n";
		thisCalcInfo.ResultText += "桩重: π/4 * " + thisCalcInfo.桩径 + "m * " + thisCalcInfo.桩长 + "m * " + thisCalcInfo.钢筋砼容重 + "kN/m^3 = " + thisCalcInfo.桩重 + "kN\n";
		thisCalcInfo.ResultText += "土重: (土容重: " + thisCalcInfo.土容重 + "kN/m^3) " + thisCalcInfo.土重 + "kN\n";
		thisCalcInfo.ResultText += "\n";

		thisCalcInfo.桩端处土承载力fa0 = 0;
		thisCalcInfo.施工地质.地层集.forEach(element => {
			if (thisCalcInfo.桩底标高 <= element.层顶标高 && thisCalcInfo.桩底标高 >= element.层底标高) thisCalcInfo.桩端处土承载力fa0 = element.容许承载力;
		});
		thisCalcInfo.桩端承载力计算值 = DecimalCalc(thisCalcInfo.桩截面积 * thisCalcInfo.清底系数m0 * thisCalcInfo.修正系数λ * thisCalcInfo.桩端处土承载力fa0);
		thisCalcInfo.桩端承载力限值 = DecimalCalc(thisCalcInfo.侧摩阻力项 * (thisCalcInfo.桩端发挥系数 / (1 - thisCalcInfo.桩端发挥系数)));
		thisCalcInfo.桩端承载力项 = DecimalCalc(Math.min(thisCalcInfo.桩端承载力计算值, thisCalcInfo.桩端承载力限值));
		thisCalcInfo.ResultText += "桩端承载力项: " + thisCalcInfo.桩端承载力项 + "kN\n";
		thisCalcInfo.ResultText += "桩端承载力限值: (发挥系数: " + thisCalcInfo.桩端发挥系数 + ") " + thisCalcInfo.桩端承载力限值 + "kN\n";
		thisCalcInfo.ResultText += "桩端承载力计算值: (清底系数m0: " + thisCalcInfo.清底系数m0 + ", 修正系数λ: " + thisCalcInfo.修正系数λ + ", 桩端处土承载力fa0:" + thisCalcInfo.桩端处土承载力fa0 + "kPa) " + thisCalcInfo.桩端承载力计算值 + "kN\n";

		thisCalcInfo.承载力容许值 = DecimalCalc(thisCalcInfo.侧摩阻力项 + thisCalcInfo.桩端承载力项 + thisCalcInfo.置换土重项);
		var ResultText_Summary;
		ResultText_Summary = "桩长: " + thisCalcInfo.桩长 + "m, 桩径: " + thisCalcInfo.桩径 + "m, 桩顶标高: " + thisCalcInfo.桩顶标高 + "m, 桩底标高: " + thisCalcInfo.桩底标高 + "m\n";
		ResultText_Summary += "桩顶承载力容许值[Ra]: " + thisCalcInfo.承载力容许值 + "kN\n";
		ResultText_Summary += "1/2u SUM(qi*li) + Ap*qr = " + thisCalcInfo.侧摩阻力项 + "kN + " + thisCalcInfo.桩端承载力项 + "kN + " + thisCalcInfo.置换土重项 + "kN = " + thisCalcInfo.承载力容许值 + "kN\n";
		ResultText_Summary += "\n";
		thisCalcInfo.ResultText = ResultText_Summary + thisCalcInfo.ResultText;
		thisCalcInfo.ResultText = name + " " + thisCalcInfo.备注 + "\n" + thisCalcInfo.ResultText;
	}
	return thisCalcInfo;
}

function RefreshPile_计算结果() {
	CalcInfo = CalcPile(CurrentPile_Name, CurrentPile);
	ConInfo.计算结果.value = CalcInfo.ResultText;
}

function RefreshPileInfo() {
	if (PileSelect.length != 0 && PileSelect.firstChild.value == "") PileSelect.removeChild(PileSelect.firstChild);
	RefreshPile_基本();
	RefreshPile_土层();
	RefreshPile_计算结果();
}

function PileEdit_AfterChange地层() {
	CurrentPile.施工地质.地层集.forEach(element => {
		var ei = CurrentPile.施工地质.地层集.indexOf(element);
		element.地层序号 = String(ei + 1);
	});
	RefreshPileInfo();
}

function PileEdit_Add地层(action) {
	var index = Number(action.target.value);
	var 地层集 = CurrentPile.施工地质.地层集;
	var preCol = ObjAsg(地层集.slice(0, index));
	var eleCol = ObjAsg(地层集.slice(index, index + 1));
	var sufCol = ObjAsg(地层集.slice(index, 地层集.length));
	sufCol[0].土类代码 = "";
	sufCol[0].年代成因 = "";
	sufCol[0].野外描述 = "";
	CurrentPile.施工地质.地层集 = preCol.concat(eleCol).concat(sufCol);
	PileEdit_AfterChange地层();
}

function PileEdit_Del地层(action) {
	var index = Number(action.target.value);
	var 地层集 = CurrentPile.施工地质.地层集;
	var preCol = ObjAsg(地层集.slice(0, index));
	var sufCol = ObjAsg(地层集.slice(index + 1, 地层集.length));
	CurrentPile.施工地质.地层集 = preCol.concat(sufCol);
	PileEdit_AfterChange地层();
}

function PileEdit_Chg桩柱名称(action) {
	var value = action.target.value;
	CurrentPile_Name = value;
	RefreshPileInfo();
}

function PileEdit_Chg备注(action) {
	var value = action.target.value;
	CurrentPile.备注 = value;
	RefreshPileInfo();
}

function PileEdit_Chg桩径(action) {
	action.target.value = NumTextFix(action.target.value);
	var value = DecimalCalc(parseFloat(action.target.value));
	CurrentPile.桩径 = value;
	RefreshPileInfo();
}

function PileEdit_Chg桩顶标高(action) {
	action.target.value = NumTextFix(action.target.value);
	var value = DecimalCalc(parseFloat(action.target.value));
	CurrentPile.桩顶标高 = value;
	RefreshPileInfo();
}

function PileEdit_Chg桩底标高(action) {
	action.target.value = NumTextFix(action.target.value);
	var value = DecimalCalc(parseFloat(action.target.value));
	CurrentPile.桩底标高 = value;
	RefreshPileInfo();
}

function PileEdit_Chg孔口标高(action) {
	action.target.value = NumTextFix(action.target.value);
	var value = DecimalCalc(parseFloat(action.target.value));
	var inc = DecimalCalc(value - CurrentPile.施工地质.孔口标高);
	CurrentPile.施工地质.孔口标高 = value;
	CurrentPile.施工地质.地层集.forEach(element => element.换层深度 = DecimalCalc(element.换层深度 + inc));
	RefreshPileInfo();
}

function PileEdit_Chg地层编号(action) {
	var index = Number(action.target.name);
	var value = action.target.value;
	CurrentPile.施工地质.地层集[index].地层编号 = value;
	RefreshPileInfo();
}

function PileEdit_Chg土类名称(action) {
	var index = Number(action.target.name);
	var value = action.target.value;
	CurrentPile.施工地质.地层集[index].土类名称 = value;
	RefreshPileInfo();
}

function PileEdit_Chg层底标高(action) {
	var index = Number(action.target.name);
	action.target.value = NumTextFix(action.target.value);
	var value = DecimalCalc(parseFloat(action.target.value));
	CurrentPile.施工地质.地层集[index].换层深度 = DecimalCalc(CurrentPile.施工地质.孔口标高 - value);
	RefreshPileInfo();
}

function PileEdit_Chg侧摩阻力标准值(action) {
	var index = Number(action.target.name);
	action.target.value = NumTextFix(action.target.value);
	var value = DecimalCalc(parseFloat(action.target.value));
	CurrentPile.施工地质.地层集[index].侧摩阻力标准值 = value;
	RefreshPileInfo();
}

function PileEdit_Chg容许承载力(action) {
	var index = Number(action.target.name);
	action.target.value = NumTextFix(action.target.value);
	var value = DecimalCalc(parseFloat(action.target.value));
	CurrentPile.施工地质.地层集[index].容许承载力 = value;
	RefreshPileInfo();
}
