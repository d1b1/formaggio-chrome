// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

// The onClicked callback function.
function onClickHandler(info, tab) {

  console.log(info.menuItemId);
  
  if (info.menuItemId == 'contextselection') {
    var text = info.selectionText;
    var url = 'http://api.formagg.io/cheese/distinct?term=' + text + '&field=name&withstats=no&api_key=guest-key&Yeee=1';

    chrome.contextMenus.remove('APIResults');
    chrome.contextMenus.create({"title": "Seach Results...", "contexts": ['selection'], "id": "APIResults"});

    $.ajax({
       url: url,
       success: function(data) {
          _.each(data, function(idx) {
            console.log(idx.value);
            chrome.contextMenus.create({"title": idx.value, "contexts": ['selection'], "parentId": "APIResults", "id": "child1" + guidGenerator() });
          });
       }
    });

    console.log('Search for This', text)
  }

};

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
  // Create one test item for each context type.
  // var contexts = ["page", "selection", "link", "editable", "image" ];
  var contexts = ["selection"];

  for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title = "Find a Cheese " + context + "...";

    var id = chrome.contextMenus.create({"title": title, "contexts":[context], "id": "context" + context});
    // console.log("'" + context + "' item:" + id);
  }

  // Create a parent item and two children.
  chrome.contextMenus.create({"title": "Test parent item", "id": "parent"});
  chrome.contextMenus.create({"title": "Child 1", "parentId": "parent", "id": "child1"});
  chrome.contextMenus.create({"title": "Child 2", "parentId": "parent", "id": "child2"});
  console.log("parent child1 child2");

  // Create some radio items.
  // chrome.contextMenus.create({"title": "Radio 1", "type": "radio", "id": "radio1"});
  // chrome.contextMenus.create({"title": "Radio 2", "type": "radio", "id": "radio2"});
  // console.log("radio1 radio2");

  // Create some checkbox items.
  // chrome.contextMenus.create({"title": "Checkbox1", "type": "checkbox", "id": "checkbox1"});
  // chrome.contextMenus.create({"title": "Checkbox2", "type": "checkbox", "id": "checkbox2"});
  // console.log("checkbox1 checkbox2");

  // Intentionally create an invalid item, to show off error checking in the
  // create callback.
  // console.log("About to try creating an invalid item - an error about " + "duplicate item child1 should show up");
  // chrome.contextMenus.create({"title": "Oops", "id": "child1"}, function() {
  //   if (chrome.extension.lastError) {
  //     console.log("Got expected error: " + chrome.extension.lastError.message);
  //   }
  // });

});
