/*
 *  This Script allows you to listen the music allocated in google
 *  music account using Amarok
 *
 * Copyright (C) 
 *
 *  (C)  2013 Josep Batalle Oronich <jbatalle3@gmail.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Version: 1.2
 */
var Config = Array();

function detectCurl() {
    var p = new QProcess();
    p.start("which", ["curl"], QIODevice.ReadOnly);
    p.waitForFinished()
    var Response = p.readAllStandardOutput();
    var textStream = new QTextStream(Response, QIODevice.ReadOnly);
    var checkCurl = textStream.readAll();
    if (checkCurl) return true;
    else false;
}

function doCurl(args) {
    var p = new QProcess();
    p.setWorkingDirectory(Amarok.Info.scriptPath());
    p.start("curl", args, QIODevice.ReadOnly);
    p.waitForFinished()
    var Response = p.readAllStandardOutput();
    var textStream = new QTextStream(Response, QIODevice.ReadOnly);
    return textStream.readAll();
}

function getStreamByCurl(args) {
    var p = new QProcess();
    p.setWorkingDirectory(Amarok.Info.scriptPath());
    p.start("curl", args, QIODevice.ReadOnly);
    p.waitForFinished()
    return p.readAllStandardOutput();
}
function readConfiguration() {
        try {
            Config["gpUserID"] = Amarok.Script.readConfig("gpUserID", "");
            Config["gpPass"] = Amarok.Script.readConfig("gpPass", "");
        } catch (err) {
            Amarok.debug(err);
        }
        return true;
    };
function curlAuth() {
    var args = new Array();
    var clientLoginUrl = "https://www.google.com/accounts/ClientLogin";
readConfiguration();
    var email = Config["gpUserID"];
    var password = Config["gpPass"];

    args[0] = clientLoginUrl;
    args[1] = "--data-urlencode";
    args[2] = "Email=" + email;
    args[3] = "--data-urlencode";
    args[4] = "Passwd=" + password;
    args[5] = "-d";
    args[6] = "accountType=GOOGLE";
    args[7] = "-d";
    args[8] = "service=sj";

    var authResponse = doCurl(args);
    /*
    var auth = authResponse;
    var re = new RegExp("SID=(.+)", "g");
    var myArray = auth.match(re);
    var SID = myArray[0].split("SID=");
    var LSID = myArray[1].split("SID=");
    Amarok.debug(SID[1]);
    Amarok.debug(LSID[1]);
*/
    m = authResponse.match(/SID=([\s\S]*?)LSID=([\s\S]*?)Auth=([\s\S]*)/)
    var SID = m[1];
    var LSID = m[2];
    var Auth = m[3];
    return Auth;
}

function listSongs(AuthToken) {
    var args = new Array();
    Amarok.debug(AuthToken);
    args[0] = "--header";
    args[1] = "Authorization: GoogleLogin auth=" + AuthToken;
    args[2] = "https://www.googleapis.com/sj/v1beta1/tracks";
    args[3] = ">";
    args[4] = "ListSongs.json";

    var Response = getStreamByCurl(args);
    var textStream = new QTextStream(Response, QIODevice.ReadOnly);
    var tinyURL = textStream.readAll();
    var listSongs = tinyURL;
    //    Amarok.debug(tinyURL);
    Amarok.debug(Amarok.Info.scriptPath());
    var file = new QFile(Amarok.Info.scriptPath() + "/ListSongs.json");
    file.open(QIODevice.WriteOnly);
    file.write(Response);
    file.close();
}

function getCookie(type) {
    var email = Config["gpUserID"];
    var password = Config["gpPass"];

    var args = new Array();
    args[0] = "-b";
    args[1] = "cookie.txt";
    args[2] = "-c";
    args[3] = "cookie.txt";
    args[4] = "https://accounts.google.com/ServiceLogin?service=sj";

    var authResponse = doCurl(args);
    var auth = authResponse;
    var re = new RegExp('id="dsh" value="(.*)"', "g");
    var myArray = auth.match(re);
    var dsh = myArray[0].split('value="');
    var dsh = dsh[1].split('"');
    Amarok.debug(dsh[0]);

    var re = new RegExp('  value="(.*)"', "g");
    var myArray = auth.match(re);
    var galx = myArray[0].split('value="');
    var galx = galx[1].split('"');
    Amarok.debug(galx[0]);

    var DSH = dsh[0];
    var GALX = galx[0];
    getCookie2(DSH, GALX);
}

function getCookie2(DSH, GALX) {
    var email = Config["gpUserID"];
    var password = Config["gpPass"];
    var args = new Array();
    args[0] = "-b";
    args[1] = "cookie.txt";
    args[2] = "-c";
    args[3] = "cookie.txt";
    args[4] = "-d";
    args[5] = "service=sj&dsh=" + DSH + "&GALX=" + GALX + "&pstMsg=1&dnConn=&checkConnection=youtube%3A138%3A1&checkedDomains=youtube&timeStmp=&secTok=&Email=" + email + "&PersistentCookie=no&Passwd=" + password + "&signIn=Sign+in";
    args[6] = "-X";//music.google.com
    args[7] = "POST";
    args[8] = "https://accounts.google.com/ServiceLoginAuth";

    var authResponse = doCurl(args);
    var auth = authResponse;
}

function getSong(songId) {
    var args = new Array();
    args[0] = "-b";
    args[1] = "cookie.txt";
    args[2] = "-c";
    args[3] = "cookie.txt";
    args[4] = "https://music.google.com/music/play?u=0&songid=" + songId + "&pt=e";

    var authResponse = doCurl(args);
    Amarok.debug(authResponse);
    if(authResponse.match("^<HTM"))//In the first execution doesn't work! We need more cookies: sjsaid value
					authResponse = doCurl(args);//And after this don't get the name of the song, only a number
    var song = (new Function("return " + authResponse))();
    Amarok.debug(song.url);
    return song.url;
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