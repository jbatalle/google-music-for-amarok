Importer.loadQtBinding("qt.core");
Importer.loadQtBinding("qt.gui");
Importer.include("config.js");
Importer.include("libs.js");

var delayedArgs = null;
var update = true;

//var myRadioService = new RadioService("RADIO SERVICE", "aaa", "HTML DEscription", "aaaaaa", "Message");
var myRadioService = new RadioService("Google Music SERVICE", "", "Listen your uploaded Music!", "", "You need a Google Music Account");
var categoryName = "Google Music";
var categoryImageFullPath = ScriptBaseDir() + "/Defaults/Category.default.image.png";
var categoryHtmlDescr = "text";
var categoryObj = myRadioService.addCategory(categoryName, categoryImageFullPath, categoryHtmlDescr);

var serviceDataJson;

function newItems() {
    serviceDataJson = ImportJsonFile(ListFiles(ScriptBaseDir(), "ListSongs.json")[0]);
    if(serviceDataJson != null){
    	var categoryObj = myRadioService.addCategory(categoryName, categoryImageFullPath, categoryHtmlDescr);
    	//  Amarok.alert("New items "+serviceDataJson.kind);
    	var items = serviceDataJson.data.items;
	
   	 for (var i in items) {
        	categoryObj.addStream(items[i].title, items[i].id, items[i].artist);
    	}
    }
    update = false;
    onPopulating(delayedArgs[0], delayedArgs[1], delayedArgs[2]);
}


function GoogleMusicforAmarok() {
    ScriptableServiceScript.call(this, "Google Music for Amarok", 2, "Songs allocated in Google music", "GoogleMusic2", false);
}

function onConfigure() {
    Amarok.alert("Este script no requiere configuracion.");
}

function onPopulating(level, callbackData, filter) {
    if (update == true) {
        delayedArgs = [level, callbackData, filter];
        newItems();
        Amarok.Window.Statusbar.shortMessage("Google Music collection is loading...");
        return;
    }
    update = true;
    Amarok.debug("Populating... " + level);

    if (level == 1) {
        for (var cat_index = 0; cat_index < myRadioService.categoriesList.length; cat_index++) {
            var category = myRadioService.categoriesList[cat_index];
            item = Amarok.StreamItem;
            item.level = 1;
            item.callbackData = cat_index;
            /* Coding caution:
item.callbackData will be stringified
So it must not be an object nor a function!!! */
            item.itemName = category.categoryName;
            item.playableUrl = "";
            /* It is a category, so it will not play any URL by itself
Stations have a playable url, but not categories */
            item.infoHtml = category.categoryHtmlDescription;
            item.coverUrl = category.categoryImageFullPath;
            script.insertItem(item);
        }
    } else if (level == 0) {
        for (var cat_index = 0; cat_index < myRadioService.categoriesList.length; cat_index++) {
            var category = myRadioService.categoriesList[cat_index];
            var stationsList = category.stationsList;
            for (var sta_index = 0; sta_index < stationsList.length; sta_index++) {
                var station = stationsList[sta_index];
                item = Amarok.StreamItem;
                item.level = 0;
                item.callbackData = "";
                item.itemName = station.stationName;
                item.playableUrl = station.stationUrl;
                item.album = category.categoryName;
                item.infoHtml = station.stationHtmlDescription;
                item.artist = station.stationName;
                item.coverUrl = "";
                /* A category has an image associated, but
a station does not any image associated
That's why this attribute is left blank */
                script.insertItem(item);
            }
        }
    }
    script.donePopulating();
}


function getNewURL(frow, row) {
    var google_for_amarok = "Google Music";
    if (Amarok.Playlist.trackAt(row).album == google_for_amarok) {
        //  Amarok.alert(Amarok.Playlist.trackAt(row).album);
//        var uri = getUrl(Amarok.Playlist.trackAt(row).path);
        var uri = getSong(Amarok.Playlist.trackAt(row).path);

        uri = uri.replace(/[\n\r]/g, ''); //delete carrier return
        Amarok.debug(uri);
        Amarok.Playlist.addMedia(new QUrl(uri));
        Amarok.Playlist.removeByIndex(row);
    }
}
Amarok.Playlist.trackInserted.connect(getNewURL);

function onCustomize() {
    var currentDir = Amarok.Info.scriptPath() + "/";
    var iconPixmap = new QPixmap(currentDir + "icon.png");
    script.setIcon(iconPixmap);
}

Amarok.configured.connect(onConfigure);
script = new GoogleMusicforAmarok();
script.populate.connect(onPopulating);
script.customize.connect(onCustomize);