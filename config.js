var Config = Array();
var helpWindow = new helpWindow();
     
Amarok.Window.addToolsMenu("Googlemusic", "Configure Google Music...", Amarok.Info.scriptPath() + "/images/logo.png");
Amarok.Window.ToolsMenu.Googlemusic['triggered()'].connect(configureDialog); 
     
function configurationEditor() {
     this.window = new QMainWindow(this);
     this.dialog = new QWidget(this);

     this.show = function() { this.window.show(); };
     
     this.accept = function () {
	  this.saveConfiguration();
	  helpWindow.close();
	  this.window.close();
     };

     this.close = function() {
	  helpWindow.close();
	  this.window.close();
     };
		
     this.gp = function () {
	  browser = new QProcess();
	  browser.start("xdg-open", ["https://music.google.com"]);
     };
     
     this.pb = function() {};
     
     this.help = function() { helpWindow.events(); };
     
     this.web = function () {
	  browser = new QProcess();
	  browser.start("xdg-open", ["http://kde-apps.org/content/show.php?content=155090"]);
     };
     
     this.readConfiguration = function() {
	  try {
	       Config["gpUserID"] = Amarok.Script.readConfig("gpUserID", "");
	       Config["gpPass"] = Amarok.Script.readConfig("gpPass", "");	       
	  } catch(err) { Amarok.debug(err); }
	  return true;
     };

     this.saveConfiguration = function() {
	  try {		
	    Config["gpUserID"] = this.gpUserInput.text;
	       Config["gpPass"] = this.gpPassInput.text;
	       
	       Amarok.Script.writeConfig("gpUserID", Config["gpUserID"]);
	       Amarok.Script.writeConfig("gpPass", Config["gpPass"]);
	       
	  } catch(err) { Amarok.debug(err); }
	  return true;
     };
     
     this.readConfiguration();

     this.Title = new QHBoxLayout();
     this.Label = new QLabel("<b>Configure - Google Music</b>");
     this.Title.addWidget(this.Label,0,Qt.AlignLeft);
	
     this.Logo = new QHBoxLayout();
     this.logo = new QPixmap(Amarok.Info.scriptPath() + "/images/logo.png");
     this.logoLabel = new QLabel();
     this.logoLabel.setPixmap(this.logo);
     this.Logo.addWidget(this.logoLabel,0,Qt.AlignRight);
     
    
     // Google
     this.gpUserBox = new QHBoxLayout();
     this.gpUserLabel = new QLabel("User:");
     this.gpUserInput = new QLineEdit(Config["gpUserID"]);
     this.gpUserInput.setMinimumSize(210,0);

     this.gpUserInput.setDisabled(false);
     this.gpUserBox.addWidget(this.gpUserLabel,0,Qt.AlignLeft);
     this.gpUserBox.addWidget(this.gpUserInput,0,Qt.AlignRight);

     this.gpPassBox = new QHBoxLayout();
     this.gpPassLabel = new QLabel("Password:");
     this.gpPassInput = new QLineEdit(Config["gpPass"], "password");
     this.gpPassInput.setMinimumSize(210,0);

     this.gpPassInput.setDisabled(false);
     this.gpPassInput.echoMode = QLineEdit.Password;
     this.gpPassBox.addWidget(this.gpPassLabel,0,Qt.AlignLeft);
     this.gpPassBox.addWidget(this.gpPassInput,0,Qt.AlignLeft);	
     
     // Main
     this.mainHeader = new QHBoxLayout();
     this.mainHeader.addLayout(this.Title,0);
     this.mainHeader.addLayout(this.Logo,0);	
     
     this.HeadearTab = new QWidget();
     this.HeadearTab.setLayout(this.mainHeader);
     
      // Google
     this.gpBox = new QGridLayout();
     this.gpBox.addLayout(this.gpUserBox,1,0);
     this.gpBox.addLayout(this.gpPassBox,2,0);
     
     this.gpTab = new QGroupBox("Google Music Options");
     this.gpTab.setLayout(this.gpBox);
     
     this.buttonBox = new QDialogButtonBox();
     this.buttonBox.addButton(QDialogButtonBox.Help);
     this.buttonBox.addButton(QDialogButtonBox.Ok);
     this.buttonBox.addButton(QDialogButtonBox.Cancel);
     this.buttonBox.accepted.connect(this,this.accept);
     this.buttonBox.rejected.connect(this,this.close);
     this.buttonBox.helpRequested.connect(this,this.help);

     this.mainTabs = new QTabWidget();
     this.mainTabs.addTab(this.gpTab, new QIcon(Amarok.Info.scriptPath() + "/images/google_music_logo.png"), "Google");  
     
     this.vblSet = new QVBoxLayout(this.dialog);
     this.vblSet.addWidget(this.HeadearTab,0,0);
     this.vblSet.addWidget(this.mainTabs,0,0);
     this.vblSet.addWidget(this.buttonBox,0,0);
     
     var QRect = new QDesktopWidget;
     var Size = QRect.screenGeometry()
     var W = (Size.width()-350)/2;
     var H = (Size.height()-400)/2;	
	
     this.dialog.setLayout(this.vblSet);
     this.dialog.sizeHint = new QSize(350,400);
     this.dialog.size = new QSize(350,400);
     this.window.move(W,H);
     this.window.setWindowTitle("Configure - SocialRok");
     this.window.windowIcon = new QIcon(Amarok.Info.scriptPath() + "/images/logo.png");
     this.window.setCentralWidget(this.dialog);
          
     this.toolsMenu = this.window.menuBar().addMenu("Tools");
     this.toolsGpApp = this.toolsMenu.addAction(new QIcon(Amarok.Info.scriptPath() + "/images/google.png"), "Go to Google Music");
     this.toolsGpApp.triggered.connect(this, this.gp);
     	
     this.helpMenu = this.window.menuBar().addMenu("Help");
     this.helpHlp = this.helpMenu.addAction(new QIcon(Amarok.Info.scriptPath() + "/images/help.png"), "Help");
     this.helpHlp.triggered.connect(this, this.help);	
     this.helpWeb = this.helpMenu.addAction(new QIcon(Amarok.Info.scriptPath() + "/images/logo.png"), "WebSite");
     this.helpWeb.triggered.connect(this, this.web);
	
     return true;
}

function helpWindow() {
     this.helpWindow = new QWidget(this);

     this.events = function() { if (this.helpWindow.visible == false) this.helpWindow.show(); else this.helpWindow.close(); };
     this.close = function() { this.helpWindow.close(); };
	
    helpText = "<h3>How to configure Google Music for Amarok</h3>";
     helpText += "This app allows you to listen the music that you have uploaded in Google Music!<br /><br />";
     helpText += "In order to listen your music you need an account on Google Music.<br>";
     helpText += "To grant access to the Google Music click on <b>Tools</b> menu put your username and password of Google. ";
     helpText += "<i>This actions require a restart of Amarok, or alternatively reload the Script.</i><br /><br />";
     helpText += "<b>Username:</b> Your username/email used in Google.<br />";
     helpText += "<b>Password:</b> Your password.<br />";
     helpText += "<b>Skype Tab</b><br />";     
     helpText += "If you have a Skype account, you can authorize SocialRok to change the mood text on every track change. To do this, you must have Skype installed and running. When Skype will ask you to allow SocialRok to change mood text check \"Remember this selection\" and then click YES! To work, curl and python-dbus must be installed in your system.<br /><br />";     
     helpText += "<b>Flickr Tab</b><br />";
     helpText += "If you have a Flickr account, you can authorize SocialRok to upload the Cover Arts on your space so you can post the Covers on Facebook as a link instead of as a normal picture, if you're interested to this option, go to Grant Access page for Facebook and after Login you can Grant Access for Flickr. This option can also be activated after you have already Granted Access to Facebook.<br /><br />";

	
     var QRect = new QDesktopWidget;
     var Size = QRect.screenGeometry()
     var W = (Size.width()-530)/2;
     var H = (Size.height()-350)/2;

     this.helpText = new QTextEdit(helpText,this);
     this.helpText.readOnly = true;
     this.layout = new QVBoxLayout(this.helpWindow);
     this.layout.addWidget(this.helpText,0,0);

     this.helpWindow.setLayout(this.layout);
     this.helpWindow.sizeHint = new QSize(530,350);
     this.helpWindow.size = new QSize(530,350);
     this.helpWindow.move(W,H);
     this.helpWindow.setWindowTitle("How to configure Google Music");
     this.helpWindow.windowIcon = new QIcon(Amarok.Info.scriptPath() + "/images/help.png");

     return true;
}

function configureDialog() {
     var configEdit = new configurationEditor();
     configEdit.show();
}