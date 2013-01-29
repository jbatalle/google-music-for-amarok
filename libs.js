function detectCurl() {
    var p = new QProcess();
    p.start("which", ["curl"], QIODevice.ReadOnly);
    p.waitForFinished()
    var Response = p.readAllStandardOutput();
    var textStream = new QTextStream(Response, QIODevice.ReadOnly);
    var checkPython = textStream.readAll();
    if (checkPython) return true;
    else false;
}

function executeScript(type) {
    Config["gpUserID"] = Amarok.Script.readConfig("gpUserID", "");
    Config["gpPass"] = Amarok.Script.readConfig("gpPass", "");
    if(type == "default")
      var dirScript = ".kde4/share/apps/amarok/scripts/google_music/"; //~/Documents by default
    else
      var dirScript = "../.kde4/share/apps/amarok/scripts/google_music/"; //~/Documents by default other systems
    var nameScript = "google_music.sh";
    
    var args = new Array();
    args[0] = nameScript;
    args[1] = "getList";
    args[2] = Config["gpUserID"];
    args[3] = Config["gpPass"];
    var p = new QProcess();
    p.setWorkingDirectory(dirScript);
    p.start("sh", args, QIODevice.ReadOnly);
    p.waitForFinished();
    var Response = p.readAllStandardOutput();
    var textStream = new QTextStream(Response, QIODevice.ReadOnly);
    var tinyURL = textStream.readAll();
    return tinyURL;
}

function getUrl(id) {
    if(type == "default")
      var dirScript = ".kde4/share/apps/amarok/scripts/google_music/"; //~/Documents by default
    else
      var dirScript = "../.kde4/share/apps/amarok/scripts/google_music/"; //~/Documents by default other systems
    var nameScript = "google_music.sh"; //getUrl
    var args = new Array();
    args[0] = nameScript;
    args[1] = "getUrlSong";
    args[2] = id;

    var p = new QProcess();
    p.setWorkingDirectory(dirScript);
    p.start("sh", args, QIODevice.ReadOnly);
    p.waitForFinished();
    var Response = p.readAllStandardOutput();
    var textStream = new QTextStream(Response, QIODevice.ReadOnly);
    var tinyURL = textStream.readAll();
    return tinyURL;
}


function ImportJsonFile(json_file) {
    if(json_file != null){
    	eval("var JSON_obj = " + ReadTextFile(json_file));
    	return JSON_obj;
    }
    else{
    	return null;    	
    }
}

function ScriptBaseDir() {
    var ScriptFullPath = Amarok.Info.scriptPath();
    return ScriptFullPath;
}

function ListFiles(fullPath, patternFilter) {
    Importer.loadQtBinding("qt.core");
    var arr_filesFullPath = []
    var qd_base = new QDir(fullPath);
    qd_base.setFilter(QDir.Files);
    var arr_files = qd_base.entryList([patternFilter]);
    for (index in arr_files) {
        arr_filesFullPath[index] = qd_base.absoluteFilePath(arr_files[index])
    }
    //arr_filesFullPath is now filled
    return arr_filesFullPath;
}

function ReadTextFile(file) {
    Importer.loadQtBinding("qt.core");
    var tmpFile = new QFile(file);
    tmpFile.open(QIODevice.ReadOnly);
    var tmpTxtStr = new QTextStream(tmpFile);
    var text_from_file = tmpTxtStr.readAll();
    tmpFile.close();
    return text_from_file;
}

function RadioService(serviceName, serviceSlogan, serviceHtmlDescription, serviceImageFullPath, serviceNoConfigMessage) {
    this.serviceName = serviceName; //ex: "Radios Portuguesas"
    this.serviceSlogan = serviceSlogan; //ex: "Escuta em directo as inumeras radios regionais portuguesas"
    this.serviceHtmlDescription = serviceHtmlDescription; //ex: '<iframe src="http://amarokradiosscript.blogspot.com/"></iframe>';
    this.serviceImageFullPath = serviceImageFullPath //ex: "/xxx/.../xxx/RadioService.image.png"
    this.serviceNoConfigMessage = serviceNoConfigMessage; //ex: "Este script nao necessita de configuraçao"
    this.categoriesList = [];

    function Category(categoryName, categoryImageFullPath, categoryHtmlDescription) {
        this.categoryName = categoryName; //ex: "Açores"
        this.categoryImageFullPath = categoryImageFullPath; //ex: "/xxx/.../xxx/Category.Açores/Category.Açores.image.png"
        this.categoryHtmlDescription = categoryHtmlDescription; //ex: '<iframe src="http://amarokradiosscript.blogspot.com/"></iframe>'
        this.stationsList = [];

        function Stream(stationName, stationUrl, stationHtmlDescription) {
            this.stationName = stationName; //ex: "Rádio Pico"
            this.stationUrl = stationUrl; //ex: "mms://stream.radio.com.pt/ROLI-ENC-420"
            this.stationHtmlDescription = stationHtmlDescription; //ex: "Rádio Pico, Freq: 100.2, Distrito: Açores, Concelho: Madalena"
        }
        this.addStream = function addStream(stationName, stationUrl, stationHtmlDescription) {
            this.stationsList.push(new Stream(stationName, stationUrl, stationHtmlDescription));
            return this;
        }
    }
    this.addCategory = function addCategory(categoryName, categoryImageFullPath, categoryHtmlDescription) {
        var newCategory = new Category(categoryName, categoryImageFullPath, categoryHtmlDescription);
        this.categoriesList.push(newCategory);
        return newCategory;
    }
}