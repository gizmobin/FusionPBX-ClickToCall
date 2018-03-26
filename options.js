/*
 * Copyright (c) 2011 Jack Senechal, 2013 Aleksandar Cvijovic, 2018 Robin Mulloy. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */

var defaults = {
	domain: "https://pbx",
	username: "",
	password: "",
	src_cid_name: "WebDialer",
	src_cid_number: "000",
	dest_cid_name: "caller_id_name",
	dest_cid_number: "caller_id_number",
	src: "extension",
	rec: "false",
	ringback: "us-ring",

	intlRegex: /(\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7)[0-9. -]{4,14})(?:\b|x\d+)/,
	intlReplacement: '$1',
	homeRegex: /(?:\b|(?:((?:\b|\+)1)[. -]?)|\()(\d{3})\)?[. -]?(\d{3})[. -]?(\d{4})(?:\b|x\d+)/,
	homeReplacement: '$1$2$3$4'
}

function loadOptions() {
	document.querySelector('#save-button').addEventListener('click', saveOptions);
	
	// domain
	var domain = localStorage['domain'] || defaults['domain'];
	document.getElementById('domain').value = domain.toString();
	// username
	var username = localStorage['username'] || defaults['username'];
	document.getElementById('username').value = username.toString();
	// password
	var password = localStorage['password'] || defaults['password'];
	document.getElementById('password').value = password.toString();
	// src_cid_name
	//var src_cid_name = localStorage['src_cid_name'] || defaults['src_cid_name'];
	//document.getElementById('src_cid_name').value = src_cid_name.toString();
	// src_cid_number
	//var src_cid_number = localStorage['src_cid_number'] || defaults['src_cid_number'];
	//document.getElementById('src_cid_number').value = src_cid_number.toString();
	// dest_cid_name
	var dest_cid_name = localStorage['dest_cid_name'] || defaults['dest_cid_name'];
	document.getElementById('dest_cid_name').value = dest_cid_name.toString();
	// dest_cid_number
	var dest_cid_number = localStorage['dest_cid_number'] || defaults['dest_cid_number'];
	document.getElementById('dest_cid_number').value = dest_cid_number.toString();
	// src
	var src = localStorage['src'] || defaults['src'];
	document.getElementById('src').value = src.toString();
	// rec
	var rec = localStorage['rec'] || defaults['rec'];
	var recSelect = document.getElementById('rec');
	for (var i = 0; i < recSelect.children.length; i++) {
		var child = recSelect.children[i];
		if (child.value == rec) {
			child.selected = 'true';
			break;
		}
	}
	// ringback
	var ringback = localStorage['ringback'] || defaults['ringback'];
	var ringbackSelect = document.getElementById('ringback');
	for (var i = 0; i < ringbackSelect.children.length; i++) {
		var child = ringbackSelect.children[i];
		if (child.value == ringback) {
			child.selected = 'true';
			break;
		}
	}
	// set up international number regex
	var intlRegex = localStorage['intlRegex'] || defaults['intlRegex'];
	document.getElementById('intlRegex').value = intlRegex.toString();
	// set up home number regex
	var homeRegex = localStorage['homeRegex'] || defaults['homeRegex'];
	document.getElementById('homeRegex').value = homeRegex.toString();

	// set up international number replacement
	var intlReplacement = localStorage['intlReplacement'] || defaults['intlReplacement'];
	document.getElementById('intlReplacement').value = intlReplacement.toString();
	// set up home number replacement
	var homeReplacement = localStorage['homeReplacement'] || defaults['homeReplacement'];
	document.getElementById('homeReplacement').value = homeReplacement.toString();
}

function saveOptions() {
	try {
		localStorage['domain'] = document.getElementById('domain').value;
		localStorage['username'] = document.getElementById('username').value;
		localStorage['password'] = document.getElementById('password').value;
		localStorage['dest_cid_name'] = document.getElementById('dest_cid_name').value;
		localStorage['dest_cid_number'] = document.getElementById('dest_cid_number').value;
		localStorage['src'] = document.getElementById('src').value;
		localStorage['rec'] = document.getElementById('rec').value;
		localStorage['ringback'] = document.getElementById('ringback').value;

		localStorage['intlRegex'] = RegExp(document.getElementById('intlRegex').value.replace(/^\/|\/$/g, ""));
		localStorage['homeRegex'] = RegExp(document.getElementById('homeRegex').value.replace(/^\/|\/$/g, ""));
		localStorage['intlReplacement'] = document.getElementById('intlReplacement').value;
		localStorage['homeReplacement'] = document.getElementById('homeReplacement').value;
		setStatus('Options Saved.');
	} catch (error) {
		alert(error);
	}
}

function setStatus(message) {
  var status = document.getElementById('status');
  status.innerHTML = message;
  setTimeout(function() {
    status.innerHTML = '';
  }, 4000);
}

function clearData() {
  if (confirm('Clear data in extension? (includes extension settings)')) {
    localStorage.clear();
    
    alert('Extension data cleared.');
  }
}

document.addEventListener('DOMContentLoaded', loadOptions);
