// Taken from: https://code.google.com/archive/p/js-uri/
// Constructor for the URI object.  Parse a string into its components.
function URI(str) {
    if (!str) str = "";
    // Based on the regex in RFC2396 Appendix B.
    var parser = /^(?:([^:\/?\#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)(?:\?([^\#]*))?(?:\#(.*))?/;
    var result = str.match(parser);
    this.scheme    = result[1] || null;
    this.authority = result[2] || null;
    this.path      = result[3] || null;
    this.query     = result[4] || null;
    this.fragment  = result[5] || null;
}

// Restore the URI to it's stringy glory.
URI.prototype.toString = function () {
    var str = "";
    if (this.scheme) {
        str += this.scheme + ":";
    }
    if (this.authority) {
        str += "//" + this.authority;
    }
    if (this.path) {
        str += this.path;
    }
    if (this.query) {
        str += "?" + this.query;
    }
    if (this.fragment) {
        str += "#" + this.fragment;
    }
    return str;
};

// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function Robot (name) {
    return "https://robohash.org/"+name+".png?set=set1"
}
function Monster (name) {
    return "https://robohash.org/"+name+".png?set=set2"
}
function Head (name) {
    return "https://robohash.org/"+name+".png?set=set3"
}
function Cat (name) {
    return "https://robohash.org/"+name+".png?set=set4"
}

function callback(urlString) {
    var uri = new URI(urlString);
    var scheme = uri.scheme;
    var authority = uri.authority;
    var robotUrl = Robot(scheme+"://"+authority);
    chrome.storage.sync.set({url: robotUrl}, function() {
        console.log(robotUrl);
    });
};

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({'url': ''}, function() {
        console.log('Robophish installed!');
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({})],
                actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    callback(tab.url);
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    console.log(activeInfo.tabId);
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
        var activeTab = arrayOfTabs[0];
        var activeTabUrl = activeTab.url;
        console.log(activeTabUrl);
        callback(activeTabUrl);
    });
});
