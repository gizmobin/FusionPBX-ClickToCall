/*
 * Copyright (c) 2011 Jack Senechal, 2013 Aleksandar Cvijovic, 2018 Robin Mulloy. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */

// load options
chrome.extension.sendRequest({action: 'options'}, function(response) {

	var url = response.options.domain +
	"/app/click_to_call/click_to_call.php?" +
	'src_cid_name=WebDialer' + 
	'&dest_cid_name='   + response.options.dest_cid_name +
	'&dest_cid_number=' + response.options.dest_cid_number +
	'&src=' + response.options.src +
	'&rec=' + response.options.rec +
	'&ringback=' + response.options.ringback;
	
	var inject = [	'function WebDial(dest) {',
					'	win=window.open("","Dialing","height=50,width=50");',
					'	if (window.focus) {win.focus();}',
					
					'	var form = document.createElement("form");',
					'	form.setAttribute("method", "post");',
					'	form.setAttribute("action", "'+url+'&dest=\"+dest+\"&src_cid_number=\"+dest);',
					'	form.setAttribute("target", "Dialing");',

					'	var userField = document.createElement("input");',
					'	userField.setAttribute("type", "hidden");',
					'	userField.setAttribute("name", "username");',
					'	userField.setAttribute("value", "'+response.options.username+'");',
					'	form.appendChild(userField);',
					
					'	var passField = document.createElement("input");',
					'	passField.setAttribute("type", "hidden");',
					'	passField.setAttribute("name", "password");',
					'	passField.setAttribute("value", "'+response.options.password+'");',
					'	form.appendChild(passField);',
					
					'	document.body.appendChild(form);',

					//	window.open('', 'view');

					'	form.submit();',
					'	form.parentNode.removeChild(form);',
					
                    '   setTimeout("win.close()",2000);',
					'	return false;',
					'}'
				].join('\n');

	var script = document.createElement('script');
	script.textContent = inject;
	(document.head||document.documentElement).appendChild(script);
	script.parentNode.removeChild(script);

	// the localStorage mechanism converts the regex to a string, so we have to convert it back
	var stripper = /^\/|\/$/g;
	var intlRegex = RegExp(response.options.intlRegex.replace(stripper, ''), 'gm');
	var homeRegex = RegExp(response.options.homeRegex.replace(stripper, ''), 'gm');


	var vopts = "'Popup','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=420,height=400,left=430,top=23'";

	var intlReplacement = '<a href="javascript:void(0);" title="Dial number with FusionPBX" onclick="WebDial(\''+response.options.intlReplacement+'\');">$&</a>';
	//'<a href="'+url+'&dest='+response.options.intlReplacement+'">$&</a>';
	var homeReplacement = '<a href="javascript:void(0);" title="Dial number with FusionPBX" onclick="WebDial(\''+response.options.homeReplacement+'\');">$&</a>';
	//'<a href="'+url+'&dest='+response.options.homeReplacement+'">$&</a>';

	var found = false;

	// Test the text of the body element against our international regular expression.
	if (intlRegex.test(document.body.innerText)) {
		$(document).find(':not(textarea)').replaceText( intlRegex, intlReplacement );
		found = true;
	}
	// Test the text of the body element against our home regular expression.
	if (homeRegex.test(document.body.innerText)) {
		$(document).find(':not(textarea)').replaceText( homeRegex, homeReplacement );
		found = true;
	}
	if (found) {
		// Notify the background page to update the page icon
		chrome.extension.sendRequest({action: 'showPageAction'}, function() {});
	}
});

// Check that options are set. If not, set them using the defaults from options.js
for (key in defaults) {
	if (!localStorage[key]) {
		localStorage[key] = defaults[key];
	}
}

// Called when a message is passed.
function onRequest(request, sender, sendResponse) {

	if (request.action == 'options') {
		// Send the localStorage variable to the content script so that it
		// can use the options set in the options page
		sendResponse({ options: localStorage });
	} else if (request.action == 'showPageAction') {
		// Show the page action for the tab that the sender (content script)
		// was on.
		chrome.pageAction.show(sender.tab.id);
	}
	// Return nothing to let the connection be cleaned up.
	sendResponse({});
};

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);

var path = "nothing";

function dynamic () {
	var newPath = location.href;
	if (newPath !== path) {
        if(chrome.pageAction) {
            chrome.pageAction.show(sender.tab.id);
        }
		path = newPath;
	}
}

setInterval(dynamic, 500);
