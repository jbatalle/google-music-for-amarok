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

function curlAuth(type) {
    type = "default";
    if (type == "default") var dirScript = ".kde4/share/apps/amarok/scripts/google_music/"; //~/Documents by default
    else var dirScript = "../.kde4/share/apps/amarok/scripts/google_music/"; //~/Documents by default other systems
    var nameScript = "google_music.sh";
    var args = new Array();
    var clientLoginUrl = "https://www.google.com/accounts/ClientLogin";
    var service = "sj";
    var email = Config["gpUserID"];
    var password = Config["gpPass"];

    //   args[0] = clientLoginUrl+" --data-urlencode Email="+email+" --data-urlencode Passwd="+password+" -d accountType=GOOGLE -d service=sj";
    args[0] = clientLoginUrl;
    args[1] = "--data-urlencode";
    args[2] = "Email=" + email;
    args[3] = "--data-urlencode";
    args[4] = "Passwd=" + password;
    args[5] = "-d";
    args[6] = "accountType=GOOGLE";
    args[7] = "-d";
    args[8] = "service=sj";
    var p = new QProcess();
    p.setWorkingDirectory(dirScript);
    p.start("curl", args, QIODevice.ReadOnly);
    p.waitForFinished()
    var Response = p.readAllStandardOutput();
    var textStream = new QTextStream(Response, QIODevice.ReadOnly);
    var tinyURL = textStream.readAll();
    var authResponse = tinyURL;
    Amarok.debug(tinyURL);
    var auth = tinyURL;
    var re = new RegExp("SID=(.+)", "g");
    var myArray = auth.match(re);
    var SID = myArray[0].split("SID=");
    var LSID = myArray[1].split("SID=");
    Amarok.debug(SID[1]);
    Amarok.debug(LSID[1]);

    m = auth.match(/SID=([\s\S]*?)LSID=([\s\S]*?)Auth=([\s\S]*)/)
    var SID = m[1];
    var LSID = m[2];
    var Auth = m[3];

}

function listSongs() {
    curl--header "Authorization: GoogleLogin auth=${authToken}"
    https: //www.googleapis.com/sj/v1beta1/tracks > ListSongs.json
    type = "default";
    if (type == "default") var dirScript = ".kde4/share/apps/amarok/scripts/google_music/"; //~/Documents by default
    else var dirScript = "../.kde4/share/apps/amarok/scripts/google_music/"; //~/Documents by default other systems
    var nameScript = "google_music.sh";
    var args = new Array();

    args[0] = "--header";
    args[1] = "Authorization: GoogleLogin auth=" + AuthToken;
    args[2] = "https://www.googleapis.com/sj/v1beta1/tracks";
    //args[3] = ">";
    //    args[4] = "ListSongs.json";

    var p = new QProcess();
    p.setWorkingDirectory(dirScript);
    p.start("curl", args, QIODevice.ReadOnly);
    p.waitForFinished()
    var Response = p.readAllStandardOutput();
    var textStream = new QTextStream(Response, QIODevice.ReadOnly);
    var tinyURL = textStream.readAll();
    var listSongs = tinyURL;
    Amarok.debug(tinyURL);

    var file = new QFile(".kde4/share/apps/amarok/scripts/google_music/ListSongs.json");
    file.open(QIODevice.WriteOnly);
    file.write(Response);
    file.close();
}

function executeScript(type) {
    Config["gpUserID"] = Amarok.Script.readConfig("gpUserID", "");
    Config["gpPass"] = Amarok.Script.readConfig("gpPass", "");
    if (type == "default") var dirScript = ".kde4/share/apps/amarok/scripts/google_music/"; //~/Documents by default
    else var dirScript = "../.kde4/share/apps/amarok/scripts/google_music/"; //~/Documents by default other systems
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
    if (type == "default") var dirScript = ".kde4/share/apps/amarok/scripts/google_music/"; //~/Documents by default
    else var dirScript = "../.kde4/share/apps/amarok/scripts/google_music/"; //~/Documents by default other systems
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
    if (json_file != null) {
        eval("var JSON_obj = " + ReadTextFile(json_file));
        return JSON_obj;
    } else {
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