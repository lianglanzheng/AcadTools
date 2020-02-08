var PileCalcPrj;
var ImportJsonButton;
var DrillSelect;
var DrillInfo;
var ConInfo;
var CurrentDrill;
var CurrentPile;

function DecimalCalc(value) {
	return Number(value.toPrecision(10));
}

function init() {
	ImportJsonButton = document.getElementById("ImportJsonButton");
	DrillSelect = document.getElementById("DrillSelect");
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
}

function ImportJson() {
	init();
	ImportJsonButton.disabled = true;
	var reader = new FileReader();
	reader.readAsText(ImportJsonButton.files[0]);
	reader.onload = function(evt) {
		PileCalcPrj = JSON.parse(evt.target.result);
		FillDrillSelect();
	};
}

function FillDrillSelect() {
	var Keys钻孔集 = Object.keys(PileCalcPrj.钻孔集);
	Keys钻孔集.sort().forEach(element => {
		var option = document.createElement("option");
		option.text = element;
		option.value = element;
		DrillSelect.add(option, null);
	});
}

function RefreshDrillSelect() {
	CurrentDrill = PileCalcPrj.钻孔集[DrillSelect.value];
	DrillInfo.钻孔编号.value = DrillSelect.value;
	DrillInfo.孔口标高.value = CurrentDrill.孔口标高;
	DrillInfo.钻孔深度.value = CurrentDrill.钻孔深度;
	DrillInfo.线别工程名称.value = CurrentDrill.线别工程名称;
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

function NewPile() {
	CurrentPile = new Object();
	if (CurrentDrill != null)
	{
		CurrentPile["桩柱名称"] = JSON.parse(JSON.stringify(CurrentDrill.线别工程名称 + "-" + DrillInfo.钻孔编号.value));
		CurrentPile["备注"] = "";
		CurrentPile["参考钻孔"] = JSON.parse(JSON.stringify(DrillInfo.钻孔编号.value));
		CurrentPile["孔口标高"] = JSON.parse(JSON.stringify(CurrentDrill.孔口标高));
		CurrentPile["施工地质"] = JSON.parse(JSON.stringify(CurrentDrill));
		RefreshPileInfo();
	}
}

function RefreshPileInfo() {
	ConInfo.桩柱名称.value = CurrentPile.桩柱名称;
	ConInfo.备注.value = CurrentPile.备注;
	ConInfo.参考钻孔.value = CurrentPile.参考钻孔;
	ConInfo.孔口标高.value = CurrentPile.孔口标高;
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
		var li = document.createElement("li");
		li.style = "list-style-type:none; border: 1px solid #FDD";
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 20px; background-color: #FDD";
		lidiv.align = "center";
		lidiv.textContent = element.地层序号;
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 15%";
		lidiv.align = "center";
		lidiv.textContent = element.地层编号;
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 35%";
		lidiv.align = "center";
		lidiv.textContent = element.土类名称;
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 10%";
		lidiv.align = "center";
		lidiv.textContent = DecimalCalc(CurrentPile.施工地质.孔口标高 - element.换层深度);
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 12%";
		lidiv.align = "center";
		lidiv.textContent = element.侧摩阻力标准值;
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 12%";
		lidiv.align = "center";
		lidiv.textContent = element.容许承载力;
		li.appendChild(lidiv);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 10px";
		li.appendChild(lidiv);
		var libt = document.createElement("button");
		libt.style = "padding: 0; width: 20px";
		libt.textContent = "+";
		li.appendChild(libt);
		var lidiv = document.createElement("div");
		lidiv.style = "display: inline-block; width: 10px";
		li.appendChild(lidiv);
		var libt = document.createElement("button");
		libt.style = "padding: 0; width: 20px";
		libt.textContent = "-";
		li.appendChild(libt);
		ol.appendChild(li);
	});
}
