// Launcher script for Chrome Apps in the Chrome Web Store.
chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create("index.html", {
		id: "mainWindow",
		innerBounds: {
			width: [[window-width]],
			height: [[window-height]]
		},
		minWidth: [[window-width]],
		minHeight: [[window-height]],
		resizable: false
	});
});