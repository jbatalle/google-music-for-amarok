Importer.loadQtBinding("qt.core");
Importer.loadQtBinding("qt.gui");
Importer.include("config.js");
Importer.include("libs.js");

var counter=0;
var update = true;
var delayedArgs = null;

/*
function Stream( name, url, description ){
 /*   var serviceDataJson = ImportJsonFile(ListFiles(ScriptBaseDir(),"ListSongs.json")[0]);
Amarok.alert("JSON "+serviceDataJson.kind);
Amarok.alert("JSON "+serviceDataJson.data.items[0]);
Amarok.alert("JSON "+serviceDataJson.data.items[0].title);

    this.name = name;
    this.url = url;
    this.description = description;
}*/
var myRadioService=new RadioService("RADIO SERVICE", "aaa", "HTML DEscription", "aaaaaa", "Message");
var categoryName = "Google Music";
var categoryImageFullPath = ScriptBaseDir() + "/Defaults/Category.default.image.png";
var categoryHtmlDescr = "text";
var categoryObj = myRadioService.addCategory(categoryName, categoryImageFullPath, categoryHtmlDescr);

var serviceDataJson;
function newItems(){
  Amarok.debug("save stations");
  
  serviceDataJson = ImportJsonFile(ListFiles(ScriptBaseDir(),"ListSongs.json")[0]);
  var categoryObj = myRadioService.addCategory(categoryName, categoryImageFullPath, categoryHtmlDescr);
//  Amarok.alert("New items "+serviceDataJson.kind);
  var items = serviceDataJson.data.items;
  
  for(var i in items){
        categoryObj.addStream(items[i].title, items[i].id, items[i].artist);
  }

//       categoryObj.addStation("..5..", "...", "aaa");
//       ScriptableServiceScript.populate.connect( onPopulating );
//       onPopulating(0, 0, 0);
update=false;
onPopulating(delayedArgs[0], delayedArgs[1], delayedArgs[2]);
Amarok.debug("end");
}


function GoogleMusic(){
    ScriptableServiceScript.call( this, "Google Music", 2, "Songs allocated in Google music", "GoogleMusic2", false );
    Amarok.debug( "ok." );
}

function onConfigure(){
    Amarok.alert( "Este script no requiere configuracion." );
}

function onPopulating(level, callbackData, filter) {
  Amarok.debug("ON POPULATING--------------------------------------------");
  if (update == true){
		delayedArgs = [level, callbackData, filter];
	      newItems();
		Amarok.Window.Statusbar.shortMessage("ZX2C4 Music collection is loading...");
		return;
	}
	update = true;
  Amarok.debug("Populating... "+level);
  //Amarok.alert("CAllback... "+callbackData);

  Amarok.debug("Number of categories: "+myRadioService.categoriesList.length);
  if ( level == 1 ) {
    /*
level == 1
callbackData = ""
filter = completely ignored
*/
    
    for (var cat_index = 0; cat_index < myRadioService.categoriesList.length; cat_index++) {
      var category=myRadioService.categoriesList[cat_index];
      item = Amarok.StreamItem;
      item.level = 1;
      item.callbackData = cat_index; /* Coding caution:
item.callbackData will be stringified
So it must not be an object nor a function!!! */
      item.itemName = category.categoryName;
      item.playableUrl = ""; /* It is a category, so it will not play any URL by itself
Stations have a playable url, but not categories */
      item.infoHtml = category.categoryHtmlDescription;
      item.coverUrl = category.categoryImageFullPath;
      script.insertItem( item );
    }
  }
  else if ( level == 0 ) {
    for (var cat_index = 0; cat_index < myRadioService.categoriesList.length; cat_index++) {
    var category = myRadioService.categoriesList[cat_index];
    var stationsList = category.stationsList;
    for (var sta_index = 0; sta_index < stationsList.length; sta_index++) {
      var station = stationsList[sta_index];
      Amarok.debug("DEBUUUUUUG             "+station.stationName);
      item = Amarok.StreamItem;
      item.level = 0;
      item.callbackData = "";
      item.itemName = station.stationName;
      item.playableUrl = station.stationUrl;
      item.album = category.categoryName;
      item.infoHtml = station.stationHtmlDescription;
      item.artist = station.stationName;
      item.coverUrl = ""; /* A category has an image associated, but
a station does not any image associated
That's why this attribute is left blank */
      script.insertItem( item );
    }
  }
  }
  script.donePopulating();
}

Amarok.Playlist.trackInserted.connect(function(frow, row){
  
  
  if (counter ==0){
    counter=1;
  Amarok.alert(Amarok.Playlist.trackAt(row).title);
  
//  Amarok.alert(frow);
//  Amarok.alert(Amarok.Playlist.trackAt(row).title);
//  Amarok.alert(Amarok.Playlist.trackAt(row).path);
  var uri = getUrl(Amarok.Playlist.trackAt(row).path);
  uri = uri.replace(/[\n\r]/g, '');//delete carrier return
  Amarok.debug(uri);
  Amarok.Playlist.addMedia(new QUrl(uri));
  Amarok.Playlist.removeByIndex(row);
  }
});

 
function onCustomize() {
    var currentDir = Amarok.Info.scriptPath() + "/";
    var iconPixmap = new QPixmap(currentDir+"icon.png");
    script.setIcon(iconPixmap);
}


Amarok.configured.connect( onConfigure );

Amarok.Window.addToolsSeparator();
Amarok.Window.addToolsMenu( "updateList", "Update Google Music List", "amarok" );
function actionClicked() {
  Amarok.debug( "FMC: actionClicked" );
  executeScript();
  //script = new GoogleMusic();
//script.populate.connect( onPopulating );
  update=false;
newItems();
//script.populate.connect( onPopulating );
//  QDesktopServices.openUrl( votingUrl );
}
script = new GoogleMusic();
script.populate.connect( onPopulating );
script.customize.connect( onCustomize );
//Amarok.Window.ToolsMenu.updateList['triggered()'].connect( onVote );
Amarok.Window.ToolsMenu.updateList['triggered()'].connect(actionClicked);