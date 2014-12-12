// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();


//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Tab 1',
    window:win1
});

var label1 = Titanium.UI.createLabel({
	color:'#999',
	text:'Bar code',
	top: 30
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'top',
	width:'auto'
});

win1.add(label1);

// create send button
var button1 = Titanium.UI.createButton({
    width:'200',
    height: '80',
    top: '120',
    title: 'Send'
});

button1.addEventListener('click', function() {
    //web service push;
    var url = "http://54.183.225.155/RecoServer/svc/reco/1643";
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	        Ti.API.debug(this.responseText);
	        var json = JSON.parse(this.responseText);
		    alert('Sent');
		    win1.close();
	    },
	    onerror: function(e) {
	 // this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        alert('error');
	    },
	    timeout:5000 /* in milliseconds */
	});
	xhr.open('GET',url);
	xhr.send();  // request is actually sent with this statement	
});

win1.add(button1);


//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'Tab 2',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Check',
    window:win2
});

var label2 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 2',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

//win2.add(label2);

// Create list of Items
var scrollView  = Ti.UI.createScrollView();

createIdList();
function createIdList(){
	var url = "http://54.183.225.155/RecoServer/svc/reco/1643";
	var xhr = Ti.Network.createHTTPClient({
	  onload: function(e) {
		Ti.API.debug(this.responseText);
		var json = JSON.parse(this.responseText);
		var ids = json.valueList;
//		alert(ids);
	    scrollView.contentWidth = Ti.Platform.displayCaps.platformWidth;
	    scrollView.contentHeight = 'auto';
	    scrollView.showVerticalScrollIndicator = true;
	
	    
	   for (i = 0; i < 1; i++)
	    {
	        //-- The label
	        var toppingLabel = Ti.UI.createLabel({
	            color:'#999',
				text:'AA: ' + ids[0],
				font:{fontSize:18,fontFamily:'Helvetica Neue'},
				textAlign:'top',
				width:'auto'
	        });	                
	        var toggler = Ti.UI.createView({
	            width:Ti.Platform.displayCaps.platformWidth,
	            height:20,
	            top: i * 20
	        });
	         
	        //-- We use the singletap event rather than the click since its in a scroll view
	        toggler.add(toppingLabel);         
	        scrollView.add(toggler);
	    }
	    win2.add(scrollView);
     },
    onerror: function(e) {
 // this function is called when an error occurs, including a timeout
        Ti.API.debug(e.error);
        alert('error');
    },
    timeout:5000 /* in milliseconds */
});
xhr.open('GET',url);
xhr.send();  // request is actually sent with this statement
};


//Add scanner window

/*
 * This code example illustrates how to integrate the Scandit SDK 
 * into your own application.  
 * 
 * IMPORTANT NOTE: Since we added support for landscape scanning
 * in the 1.1.0 version of our plugin, you will need to update the 
 * way you instantiate the Scandit SDK in your Titanium app. See
 * example below for more details. 
 *   
 * The example shows how to add a "start scan" button that invokes
 * the scan view. A Ti.Gesture.addEventListener is used to detect 
 * orientation changes and to update the Scandit SDK picker to 
 * update the camera feed accordingly. If you are intending to 
 * use portrait and landscape mode in your app, make sure that the 
 * supported interface orientations are set correctly in the XCode 
 * project. 
 * 
 * NOTE: You will need a Scandit SDK App Key! If you don't have one
 * yet, sign up at http://www.scandit.com. The Scandit SDK App Key
 * is then available from your Scandit SDK account. 
 * 
 * For more information, see http://www.scandit.com/support or
 * contact us at info@scandit.com. 
 */
// load the Scandit SDK module
var scanditsdk = require("com.mirasense.scanditsdk");

var picker;
// Create a window to add the picker to and display it. 
var window = Titanium.UI.createWindow({  
        title:'Scandit SDK',
        navBarHidden:true
});
// Sets up the scanner and starts it in a new window.
var openScanner = function() {
	
    // Instantiate the Scandit SDK Barcode Picker view
    picker = scanditsdk.createView({
        width:"100%",
        height:"100%"
    });
    // Initialize the barcode picker, remember to paste your own app key here.
    picker.init("B9iJHKzrF6Un9PFmpFezi/LsDL1ZB1qiE9ea3TeyiF4", 0);
    picker.showSearchBar(true);
   
    // Set callback functions for when scanning succeedes and for when the 
    // scanning is canceled.
    picker.setSuccessCallback(function(e) {
        alert("success (" + e.symbology + "): " + e.barcode);
        label1.text=e.barcode;
        closeScanner();
        win1.open();
    });
    picker.setCancelCallback(function(e) {
        closeScanner();
    });
    window.add(picker);
    window.addEventListener('open', function(e) {
        // Adjust to the current orientation.
        // since window.orientation returns 'undefined' on ios devices 
        // we are using Ti.UI.orientation (which is deprecated and no longer 
        // working on Android devices.)
        if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
            picker.setOrientation(Ti.UI.orientation);
        }   
        else {
            picker.setOrientation(window.orientation);
        }
        
        picker.setSize(Ti.Platform.displayCaps.platformWidth, 
                       Ti.Platform.displayCaps.platformHeight);
        picker.startScanning();     // startScanning() has to be called after the window is opened. 
    });
    window.open();
};
// Stops the scanner, removes it from the window and closes the latter.
var closeScanner = function() {
    if (picker != null) {
        picker.stopScanning();
        window.remove(picker);
    }
    window.close();
};

// create start scanner button
var button = Titanium.UI.createButton({
    "width":200,
    "height": 80,
    "title": "start scanner"
});
button.addEventListener('click', function() {
    openScanner();
});
var rootWindow = Titanium.UI.createWindow({
    backgroundColor:'#fff'
});
//rootWindow.add(window);
rootWindow.add(button);
//rootWindow.open();

var tab3 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Scan',
    window:rootWindow
});


//
//  add tabs
//
tabGroup.addTab(tab3);   // Scanner  
tabGroup.addTab(tab2);   //Check
  

// open tab group
tabGroup.open();
