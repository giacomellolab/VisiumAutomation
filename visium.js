/* Fanny Taborsak-Lines, 2021, National Genomics Infrastructure */

runset.clear();

var path = "C:/VWorks Workspace/Protocol Files/development/FT/visium/";
var form = "visium.VWForm";

var runsetMode = false;	// Alt settings for library prep runset (true/false)
formColumns = parseInt(formColumns, 10);

var presets = {};

presets["cDNA Cleanup"] = {
	tipColumn: (13 - formColumns),
	tipOffColumn: 1,
	sampleColumn: 1,
	bindColumn: 1,
	finalColumn: 1,
	beadColumn: 1,
	etohColumn:(formColumns + 1),
	etohAspHeight:1,
	ebColumn:((formColumns * 2) + 1),
	wasteColumn:((formColumns * 4) + 1),
	sampleVolume: 100,
	beadVolume: 60,
	totBeadVolume: 60,
	elutionVolume: 40,
	};

presets["Fragmentation"] = {
	tipColumn:1,
	tipOffColumn:1,
	sampleColumn:1,
	reagentColumn:(formColumns + 1),
	ebColumn:((formColumns * 2) + 1),
	oilColumn:((formColumns * 3) + 1),
	sampleVolume:10,
	reagentVolume:15,
	ebVolume:25,
	oilVolume:15,
	incubation1Temperature:32,
	incubation1Time:300,
	incubation2Temperature:65,
	incubation2Time:1800,
	doOffDeckIncubation:false,
	};

presets["Fragmentation Size Selection"] = {
	tipColumn:(13 - formColumns),
	tipOffColumn:(formColumns +1),
	sampleColumn:1,
	bindColumn:1,
	bind2Column:(formColumns + 1),
	finalColumn:(formColumns + 1),
	beadColumn:1,
	etohColumn:(formColumns + 1),
	etohAspHeight:20, 
	ebColumn:((formColumns * 2) + 1),
	wasteColumn:((formColumns * 4) + 1),
	sampleVolume:50,
	beadVolume1:30,
	totBeadVolume1:200,
	beadVolume2:10,
	totBeadVolume2:170,
	bindVolume:75,
	transferVolume:75, // Supernatant transfer
	elutionVolume:50.5,
	keepPlate:true,
	};

presets["Ligation"] = {
	tipColumn:(formColumns + 1),
	tipOffColumn: ((formColumns * 2) + 1),
	reagentColumn:((formColumns * 2) + 1),
	sampleColumn: (formColumns + 1),
	sampleVolume:50,
	reagentVolume:50,
	incubationTemperature:20,
	incubationTime:900,
	doOffDeckIncubation:false,
	};

presets["Ligation Cleanup"] = {
	tipColumn: (13 - (formColumns * 2)),
	tipOffColumn:((formColumns * 3) + 1),
	sampleColumn: (formColumns + 1),
	bindColumn:((formColumns * 2) + 1),
	finalColumn:((formColumns * 2) + 1),
	beadColumn:1,
	etohColumn:(formColumns + 1),
	etohAspHeight:10,
	ebColumn:((formColumns * 2) + 1),
	wasteColumn:((formColumns * 4) + 1),
	sampleVolume:100,
	beadVolume:80,
	totBeadVolume:160,
	elutionVolume:30.5,
	};

presets["Amplification"] = {
	tipColumn:((formColumns * 2) + 1),
	tipOffColumn:((formColumns * 4) + 1),
	reagentColumn:((formColumns * 3) + 1),
	indexColumn: ((formColumns * 4) + 1),
	sampleColumn: ((formColumns * 2) + 1),
	sampleVolume:30,
	reagentVolume:50,
	indexVolume:20,
	doOffDeckIncubation:true,
	};

presets["Amplification Size Selection"] = {
	tipColumn:(13 - (formColumns * 3)),
	tipOffColumn: ((formColumns * 5) + 1),
	sampleColumn: ((formColumns * 2) + 1),
	bindColumn:((formColumns * 3) + 1),
	bind2Column:((formColumns * 4) + 1),
	finalColumn:((formColumns * 3) + 1),
	beadColumn:1,
	etohColumn:(formColumns + 1),
	etohAspHeight:1,
	ebColumn:((formColumns * 2) + 1),
	wasteColumn:((formColumns * 5) + 1),
	sampleVolume:100,
	beadVolume1:60,
	totBeadVolume1:80,
	beadVolume2:20,
	totBeadVolume2:20,
	bindVolume:150,
	transferVolume:150, // Supernatant transfer
	elutionVolume:35.5,
	keepPlate:false
	};



var settings = {};

var fileNames = {};
fileNames["cDNA Cleanup"] = "Visium_illumina_spri_standalone.pro";
fileNames["Fragmentation"] = "Visium_fragmentation.pro";
fileNames["Ligation"] = "Visium_ligation.pro";
fileNames["Amplification"] = "Visium_amplification.pro";
fileNames["Fragmentation Size Selection"] = "Visium_illumina_double-spri.pro";
fileNames["Ligation Cleanup"] = "Visium_illumina_spri.pro";
fileNames["Amplification Size Selection"] = "Visium_illumina_double-spri.pro";
fileNames["Library prep"] = "visium.rst";


var runsetOrder = [];

if(formProtocol === "Library prep") {
	runsetMode = true;
	runsetOrder = ["Fragmentation","Fragmentation Size Selection",
			"Ligation","Ligation Cleanup","Amplification","Amplification Size Selection"];
	runset.openRunsetFile(path+fileNames[formProtocol], form);
} else {
	runsetMode = false;
	runset.appendProtocolFileToRunset(path+fileNames[formProtocol], 1, "", form);
	updateSettings(formProtocol);
}

function updateSettings(protocol) {
	settings = {};
	if(protocol in presets) {
		for(var s in presets[protocol]) {
			settings[s] = presets[protocol][s];
		}
	} else {
		throw "EXCEPTION__UndefinedSetting:"+protocol;
	}
	print(protocol + " preset loaded");
}

var runsetIndex = 0;
function updateRunset() {
	updateSettings(runsetOrder[runsetIndex++]);
}

/* function dph(vol) {
	var v = parseFloat(vol);
	if(v > 0 && !isNaN(v)) {
		return (0.08*v + 0.2) / v;
	} else {
		throw "ValueException";
	}
} */

// Dynamic Pipetting Height 2.0:
function dph(vol, endHeight) {
	var v = parseFloat(vol);
	var e = parseFloat(endHeight);
	if(v > 0 && e > 0 && !isNaN(v+e)) {
		return 0.078 - 9.501E-5*v + (0.734-e)/v;
	} else {
		throw "ValueException";
	}
}
