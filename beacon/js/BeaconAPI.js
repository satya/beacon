/**
* Beacon - API
*
* Copyright (c) Beacon Dev Team
* Licensed under GPLv3
*
* Plugins belong to their respective
* authors as mentioned.
*
*/

var BeaconAPI = function(o, beacon) {
    // Lets have our papa bear object
    this.beacon = beacon;

    // Store the id
    this.id = o.id;

    // Store the plugin name
    this.plugin = o.plugin;

    // Fetch the plugin specific DTD
    this.dtd = eval(this.plugin + "_dtd()");

    // All the UI elements
    this.uiElementNames = this.getUIList();

    // Cache
    this.src = "";
    this.html = "";

    // Revisions
    this.revisions = [];

    // Our state object.
    this.state = {
        viewingSource: false,
        fetchingSource: false,
        fetchingHTML: false,
        fetchingRevisions: false,
        saving: false,
        editing: false
    };

    // Storage for editables
    this.editingNode = null;
    this.currentEditor = null;

    this.tree = {};
    this.nodeCounter = 0;

    // Init the UI storage
    this.ui = {};

    // Build up our UI quick reference
    for (var i = 0; i < this.uiElementNames.length; i++) {
        this.ui[this.uiElementNames[i]] = {};
        this.ui[this.uiElementNames[i]].id = "#" + this.id + this.uiElementNames[i];
    }

    // Save the iframe separately
    this.iframe = document.getElementById(this.id + "Iframe").contentWindow;

    // Tabify
    this.tabs = $(this.ui["Content"].id).tabs({
        select: this.viewChange.attach(this)
    });

    this.tabIndex = 0;

    // Show the pretty accordion
    $(this.ui["Accordion"].id).accordion();


    // Init the time stamps
    $(this.ui["TimeStamp"].id).attr("title", iso8601(new Date()));
    $(this.ui["TimeStamp"].id).timeago();

    $(this.ui["Iframe"].id).load(function() {
        // Store the html intially for emergency restore
        this.html = '<body>' + $(this.ui["Iframe"].id).contents().find("body").html() + '</body>';

        // Let us attach the events
        $(this.ui["SaveButton"].id).bind("click", this.saveDocument.attach(this));

        // window.setInterval(this.autoSave.attach(this), 300000);

        // Set the close button
        $(this.ui["CloseButton"].id).bind("click", this.closeDocument.attach(this));

        $(this.ui["InsertInlineButton"].id).bind("click", this.insertInline.attach(this));

        $(this.ui["Restore"].id).bind("click", this.restoreTo.attach(this));

        // Make the iframe clickable
        $(this.ui["Iframe"].id).contents().bind("click", this.frameClick.attach(this));
        $(this.ui["Iframe"].id).contents().bind("keydown", this.frameKeyDown.attach(this));

        this.selectionEvents();
        
        this.buildTree();

    }.attach(this));
};

BeaconAPI.prototype.getUIList = function() {
    var list = ["Document", "Content", "Sidebar", "RightToolBar", "Accordion",
              "ToolHolder", "Iframe", "SourceView", "CloseButton", "SaveButton",
              "ViewSourceButton", "DownloadButton", "TimeStamp", "Loading",
              "InsertInlineButton", "InsertInlineList", "BeaconTreeContainer",
              "TextBox", "RevisionsView", "TabList", "DesignViewLoading",
              "SourceViewLoading", "RevisionsViewLoading", "RevisionFrame",
              "Restore", "RestoreTo", "RevisionList", "RevisionContainer"];

    return list;
};

BeaconAPI.prototype.frameClick = function(e) {
     // Get the node which was clicked
    if (!e) var obj = window.event.srcElement;
    else var obj = e.target;

    if (this.state["editing"]) {
        // If already editing then see if the editor is removable
        if (this.cleanEditor(obj)) {
            // Clear the editing state
            this.state["editing"] = false;
        }
    } else {
        // Try and create an editor
        if (this.initEditor(obj)) {
            // Set editing state
            this.state["editing"] = true;
        }
    }

    // Let's prevent default action and propagation
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();

    return false;
};

BeaconAPI.prototype.frameKeyDown = function(e) {
    if (!e) e = window.event;

    switch(e.keyCode) {
        // Close any editor in case of Enter Key
        case 13:
            if (this.state["editing"]) {
                // If already editing then see if the editor is removable
                if (this.cleanEditor(false)) {
                    // Clear the editing state
                    this.state["editing"] = false;
                }
            }

            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
        break;
    }
};

BeaconAPI.prototype.initEditor = function(o) {
    // Copy over the DTD if exists
    var nodeDef = this.dtd[o.title] || null;

    // If not found in DTD let's move on
    if (!nodeDef) {
        //BeaconMessage.init("Not found in DTD!");
        return false;
    }

    // Check the node type
    if (nodeDef.type === "inline") {
        while (o.nodeName.toLowerCase() !== "body") {
            o = o.parentNode;
            nodeDef = this.dtd[o.title] || null;

            if (nodeDef) {
                if (nodeDef.type === "block") {
                    break;
                }
            }
        }
    }

    if (nodeDef.editorType) {
        switch (nodeDef.editorType) {
            case "richText":
                // Fire up the rich text editor
                this.currentEditor = new BeaconRichTextEditor(o, this.iframe);

                // Store the object we are editing
                this.editingNode = o;

                this.buildInlineInsertMenu(nodeDef);
                break;

            case "lineedit":
                // Fire up the line editor
                this.currentEditor = new BeaconLineEditor(o, this.iframe);

                // Store the object we are editing
                this.editingNode = o;
                break;

            case "plaintext":
                // Fire up the plain text editor
                this.currentEditor = new BeaconPlainTextEditor(o, this.iframe);

                // Store the object we are editing
                this.editingNode = o;
                break;

            default:
                return false;
        }
    } else {
        return false;
    }

    return true;
};

BeaconAPI.prototype.cleanEditor = function(o) {
    var nodeDef = this.dtd[o.title] || null;

    var editorType = this.currentEditor.getType();

    if (editorType === "richtext") {
        if (o === this.editingNode) {
            return false;
        }

        if (nodeDef) {
            if (nodeDef.type === "inline") {
                if ($(this.editingNode).find(o.tagName).index(o) > -1)
                    return false;
            }
        }

        this.buildInlineInsertMenu(false);
        this.currentEditor.restoreNode();
        this.currentEditor = {};
    } else if (editorType === "lineedit") {
        if (o === this.currentEditor.getNode()) {
            return false;
        }

        this.currentEditor.restoreNode();
        this.currentEditor = {}
    } else if (editorType === "plaintext") {
        if (o === this.currentEditor.getNode()) {
            return false;
        }

        this.currentEditor.restoreNode();
        this.currentEditor = {}
    } else {
        return false;
    }

    return true;
};

BeaconAPI.prototype.buildInlineInsertMenu = function(nodeDef) {
    var list = nodeDef.inlineChildren;

    if (this.list === false) {
        return;
    }

    var html = '<option value="-1">Select Any One</option>';

    if (!list) {
        $(this.ui["InsertInlineList"].id).html(html);
        return;
    }

    for (var i = 0; i < list.length; i++) {
      
        if(list[i]==="docbookXref"){
          html += "<optgroup label='General Editorial Tags'></optgroup>";
        }
        if(list[i]==="docbookSGMLTag"){
          html += "<optgroup label='Computer Language Tags'></optgroup>";
        }
      
        html += '<option value="'+list[i]+'">';
        html += list[i];
        html += '</option>';
    }

    $(this.ui["InsertInlineList"].id).html(html);
};

BeaconAPI.prototype.insertInline = function() {
  
    if (!this.state["editing"]) {
        BeaconMessage.init("You are not editing anything!");
        return;
    }

    if (this.currentEditor.getType() !== "richtext") {
        BeaconMessage.init("You cannot insert a node in non-richtext type editor.");
        return;
    }

    var val = $(this.ui["InsertInlineList"].id).val();

    if (val === "-1") {
        BeaconMessage.init("Select something!");
        return;
    }

    var insertDef = this.dtd[val] || null;

    if (!insertDef) {
        return;
    }

    var text = this.iframe.getSelection();

    if (insertDef.inlineType === "generic") {
        // If it's generic then just dump it in the iframe
        var html = this.buildHTML(val, insertDef.markup, text);
        this.currentEditor.insertText(html);
    }
    
    if (insertDef.inlineType === "prompt") {
        // If it's "prompt" then prompt for input on attributes that have value "prompt"
        var thisElement = $.extend(true,{},insertDef.markup);
        var promptFields = "";
        
        for(var k in thisElement.attributes){
          if(thisElement.attributes[k] === "prompt"){
            var promptName = k;
            if(k==="linkend"){
              // for linkend, gather tree nodes with IDs
              promptFields += "<label for='" + promptName + "'>" + promptName + "</label>";
              promptFields += "<select name='" + promptName + "' id='" + promptName + "' class='text ui-widget-content ui-corner-all'>";
              for(var n in this.tree){
                if(this.tree[n].node.id!==""){
                  var thisId = this.tree[n].node.id;
                  var thisName = this.tree[n].node.firstElementChild.innerHTML;
                  promptFields += "<option value='" + thisId + "'>" + thisName + "</option>";
                }
              }
              promptFields += "</select>";
              
            }else{
              promptFields += "<label for='" + promptName + "'>" + promptName + "</label>";
              promptFields += "<input type='text' name='" + promptName + "' id='" + promptName + "' class='text ui-widget-content ui-corner-all' />";
            }
          }
        }
        
        var promptDialog = $("<div class='prompt-dialog' title='Attribute values'><p class='validateTips'>All form fields are required.</p><form><fieldset>" + promptFields + "</fieldset></form></div>");
        
        var thisParent = this;
        
        $(promptDialog).dialog({
          autoOpen: false,
          draggable: true,
          height: 300,
          width: 350,
          modal: true,
          buttons: {
            Save: function() {
              var bValid = true;
              if ( bValid ) {
                
                var formValues = $($(promptDialog).find("form")[0]).serializeArray();
                
                for(var k in formValues){
                  var formValue = formValues[k];
                  thisElement.attributes[formValue.name] = formValue.value;
                }
                $( this ).dialog( "close" );
              }
            }
          },
          close: function() {
            //allFields.val( "" ).removeClass( "ui-state-error" );
            var html = thisParent.buildHTML(val, thisElement, text);
            thisParent.currentEditor.insertText(html);
          }
        });
        
        $(promptDialog).dialog("open");
    }

    
};

BeaconAPI.prototype.buildHTML = function(title, markup, text) {
    // Build starting
    var html = '<' + markup.tag;

    // Add attributes
    for (var a in markup.attributes) {
        if (a === "className") {
            html += ' class="' + markup.attributes[a] + '"';
        } else {
            html += ' ' + a + '="' + markup.attributes[a] + '"';
        }
    }

    // Add the title attribute so it can be parse back
    html += ' title="' + title + '"';

    // If our HTML is empty and sampleText exists then add that instead
    if (markup.sampleText && $.trim(text) === "") {
        text = markup.sampleText;
    }

    // Add text and close tag
    html += '>' + text + '</' + markup.tag + '>';

    // Return
    return html;
};

BeaconAPI.prototype.buildBlockInsertMenu = function(nodeDef) {
    var list = nodeDef.siblings;

    if (this.list === false) {
        return;
    }

    var html = '<option value="-1">Select Any One</option>';

    if (!list) {
        $(this.ui["InsertBlockList"].id).html(html);
        return;
    }

    for (var i = 0; i < list.length; i++) {
        html += '<option value="'+list[i]+'">';
        html += list[i];
        html += '</option>';
    }

    return html;
};

BeaconAPI.prototype.insertBlock = function() {
    if (!this.state["editing"]) {
        BeaconMessage.init("You are not editing anything!");
        return;
    }

    var name = $(this.ui["InsertBlockList"].id).val();

    var position = $('input[name=insertAt]:checked').val();

    if (name === "-1") {
        BeaconMessage.init("Select Something!");
        return;
    }

    var editingNodeDef = this.dtd[this.editingNode.title];

    if (editingNodeDef.standAlone) {
        var html = "";

        html = this.buildNodeStructure(name);

        var o = this.editingNode;

        if (position === "before") {
            $(html).insertBefore(o);
        } else if (position === "after") {
            $(html).insertAfter(o);
        }
    } else {
        var html = "";

        html = this.buildNodeStructure(name);

        var o = this.editingNode;

        while (o.nodeName.toLowerCase() !== "body") {
            o = o.parentNode;

            if (o.title === name[0]) {
                break;
            }
        }

        if (o.title !== name[0]) {
            return;
        }

        if (position === "before") {
            $(html).insertBefore(o);
        } else if (position === "after") {
            $(html).insertAfter(o);
        }
    }
};

BeaconAPI.prototype.buildNodeStructure = function(title) {
    var nodeDef = this.dtd[title];

    var html = "";

    if (nodeDef.markup.requiredChildNodes) {
        for (var i = 0; i < nodeDef.markup.requiredChildNodes.length; i++) {
            html += this.buildNodeStructure(nodeDef.markup.requiredChildNodes[i]);
        }
    }

    html = this.buildHTML(title, nodeDef.markup, html);

    return html;
};




// --------------------- Save and close Functions ------------------------------

BeaconAPI.prototype.closeDocument = function() {
  
    if (this.state["editing"]) {
        BeaconMessage.init("Please finish editing before closing.");
        return;
    }

  
  var thisDocument = this;
  
    $("<div title='Close Document'>Do you want to save the current changes?</div>").dialog({
      resizable: false,
      modal: true,
      buttons: {
        "Cancel": function() {
          $(this).dialog("close");
        },
        "Close without saving": function() {
          thisDocument.beacon.closeDoc(thisDocument.id);
          $(this).dialog("close");
        },
        "Save and close": function() {
          thisDocument.saveDocument();
          thisDocument.beacon.closeDoc(thisDocument.id);
          $(this).dialog("close");
        }
      }
    });
  
  return false;
  /*
    if (confirm("Do you want to save the current changes?")) {
        this.saveDocument();
    }
  */

    //this.beacon.closeDoc(this.id);
};

BeaconAPI.prototype.autoSave = function() {
    if (this.state["fetchingSource"] || this.state["fetchingHTML"] || this.state["saving"]) {
        return;
    }

    if (this.state["editing"]) {
        return;
    }

    this.saveDocument();
};

BeaconAPI.prototype.saveDocument = function() {
    if (this.state["fetchingSource"] || this.state["fetchingHTML"] || this.state["saving"]) {
        BeaconMessage.init("Please Wait for the current operation to be completed!");
        return;
    }

    if (this.state["editing"]) {
        BeaconMessage.init("Please finish editing before saving.");
        return;
    }

    this.state["saving"] = true;

    var html = $(this.ui["Iframe"].id).contents().find("body").html();
    html = encodeURIComponent(html);

    var o = {
        action: "savedoc",
        payload: {
            id: this.id,
            plugin: this.plugin,
            html: html
        }
    };

    $.ajax({
        url: this.beacon.getURL("handler"),
        type: "POST",
        data: JSON.stringify(o),
        success: function(result) {
            BeaconMessage.init("Save done!");
            this.state["saving"] = false;
        }.attach(this)
    });
    return false;
};



// --------------------- Views (source, html, revisions) -----------------------

BeaconAPI.prototype.viewChange = function(event, ui) {
    if (this.state["fetchingSource"] ||
        this.state["fetchingHTML"] ||
        this.state["saving"] ||
        this.state["fetchingRevisions"]) {

        BeaconMessage.init("Please let the current operation complete!");
        return false;
    }

    var index = ui.index;

    switch(index) {
        case 0:
            if (this.tabIndex === 1)
                this.getHTML();
            else if (this.tabIndex === 2)
                this.buildTree();
            break;

        case 1:
            if (this.tabIndex === 0 || this.tabIndex === 2)
                this.getSource();
            break;

        case 2:
            this.getRevisions();
            break;
    }

    this.tabIndex = index;
};

// Emergency Restore Function
BeaconAPI.prototype.restoreDocument = function() {
    BeaconMessage.init("The server could not parse! Restoring back to last known stable document.");

    document.getElementById(this.id+"Iframe").contentWindow.document.body.innerHTML = this.html;

    this.state = {
        viewingSource: false,
        fetchingSource: false,
        fetchingHTML: false,
        saving: false,
        editing: false
    };

    $(this.ui["TextBox"].id).show();
    $(this.ui["SourceViewLoading"].id).hide();
    $(this.ui["Iframe"].id).show();

    this.tabs.tabs('select', 0);
};

// Emergency Restore Function
BeaconAPI.prototype.restoreSourceView = function() {
    BeaconMessage.init("The server could not parse the XML! Please check for any formatting errors. \
    Restoring back to last known stable document.");

    $(this.ui["TextBox"].id).val(this.src);

    this.state = {
        viewingSource: true,
        fetchingSource: false,
        fetchingHTML: false,
        saving: false,
        editing: false
    };

    $(this.ui["TextBox"].id).show();
    $(this.ui["DesignViewLoading"].id).hide();
    $(this.ui["Iframe"].id).show();

    this.tabs.tabs('select', 1);
};

BeaconAPI.prototype.getSource = function(displayFlag) {
    this.state["fetchingSource"] = true;

    $(this.ui["TextBox"].id).hide();
    $(this.ui["SourceViewLoading"].id).show();

    var html = $(this.ui["Iframe"].id).contents().find("body").html();

    html = encodeURIComponent(html);

    var o = {
        action: "getsrc",
        payload: {
            id: this.id,
            plugin: this.plugin,
            html: html
        }
    };

    $.ajaxq("beaconapi", {
        url: this.beacon.getURL("handler"),
        type: "POST",
        data: JSON.stringify(o),
        error: function() {
            this.restoreDocument();
        },
        success: function(src) {
            if ($.trim(src) === "FAIL") {
                this.restoreDocument();
                return;
            }
            src = decodeURIComponent(src);

            this.state["fetchingSource"] = false;
            this.src = src;
            $(this.ui["TextBox"].id).val($.trim(src));

            $(this.ui["TextBox"].id).show();
            $(this.ui["SourceViewLoading"].id).hide();

            $(this.ui["BeaconTreeContainer"].id).html("You cannot view the document tree while viewing source.");
        }.attach(this)
    });

};

BeaconAPI.prototype.getHTML = function(displayFlag) {
    this.state["fetchingHTML"] = true;

    $(this.ui["Iframe"].id).hide();
    $(this.ui["DesignViewLoading"].id).show();

    var src = $(this.ui["TextBox"].id).val();

    src = encodeURIComponent(src);

    var o = {
        action: "gethtml",
        payload: {
            id: this.id,
            plugin: this.plugin,
            src: src
        }
    };

    $.ajaxq("beaconapi", {
        url: this.beacon.getURL("handler"),
        type: "POST",
        data: JSON.stringify(o),
        error: function() {
            this.restoreSourceView();
        },
        success: function(html) {
            if ($.trim(html) === "FAIL") {
                this.restoreSourceView();
                return;
            }
            html = decodeURIComponent(html);

            this.state["fetchingHTML"] = false;

            this.html = html;
            document.getElementById(this.id+"Iframe").contentWindow.document.body.innerHTML = html;

            $(this.ui["DesignViewLoading"].id).hide();
            $(this.ui["Iframe"].id).show();
            
            this.selectionEvents();

            this.buildTree();
        }.attach(this)
    });
};

BeaconAPI.prototype.selectionEvents = function(){
  
  var elements = ['div','h1','h2','h3','h4','h5','h6','p'];
  
  for(i in elements){
    var element = elements[i];
    $(document.getElementById(this.id+"Iframe").contentWindow.document).find(element).click(function(evt){
      
      var el = evt.target;
      var nodeId = getNodeId(this.id,getElementPath(el));
      selectTreeNode(nodeId);
      
      $($(el).parents("body")[0]).find(".selected").removeClass("selected");
      $(el).addClass("selected");

      
      //evt.stopPropagation();
      
    }.attach(this));
  }
  
}

BeaconAPI.prototype.getRevisions = function() {
    this.state["fetchingRevisions"] = true;

    $(this.ui["RevisionContainer"].id).hide();
    $(this.ui["RevisionFrame"].id).hide();

    $(this.ui["RevisionsViewLoading"].id).show();

    var o = {
        action: "getrevisions",
        payload: {
            id: this.id,
        }
    };

    $.ajaxq("beaconapi", {
        url: this.beacon.getURL("handler"),
        type: "POST",
        data: JSON.stringify(o),
        dataType: "json",
        error: function() {

        },
        success: function(json) {
            this.revisions = json.revisions;

            if (json.revisions.length === 0) {
                BeaconMessage.init("No Revisions Found!");
                this.state["fetchingRevisions"] = false;

                $(this.ui["RevisionsViewLoading"].id).hide();
            } else {
                var html = "", url = "";

                for (i = 0; i < json.revisions.length; i++) {
                    url = "ajax.php?type=revision&plugin="+this.plugin+"&id=" + json.revisions[i].id;
                    html += '<p><a href="'+url+'" target="';
                    html += this.id+'RevisionFrame">Rev. ';
                    html += json.revisions[i].num+'</a>';
                    html += '</p>';
                }

                $(this.ui["RevisionList"].id).html(html);

                this.state["fetchingRevisions"] = false;

                $(this.ui["RevisionContainer"].id).show();
                $(this.ui["RevisionFrame"].id).show();

                $(this.ui["RevisionsViewLoading"].id).hide();
            }
        }.attach(this)
    });
};

BeaconAPI.prototype.restoreTo = function() {
    var html = document.getElementById(this.id+"RevisionFrame").contentWindow.document.body.innerHTML;
    document.getElementById(this.id+"Iframe").contentWindow.document.body.innerHTML = html;
    this.tabs.tabs('select', 0);
};

//------------------------ Tree Functions --------------------------------------

BeaconAPI.prototype.generateTreeNodeID = function() {
    var randomID = this.id + "_node_" + this.nodeCounter;

    if (!this.tree[randomID]) {
        this.nodeCounter++;
        return randomID;
    } else {
        return this.generateTreeNodeID();
    }
};

BeaconAPI.prototype.buildTree = function() {
    var html = "";
    
    var icon_path = "../beacon/img/";

    var root = this.iframe.document.body;

    html = "<ul>" + this.walkDOM(root) + "</ul>";

    $(this.ui["BeaconTreeContainer"].id).html(html);

    $(this.ui["BeaconTreeContainer"].id).tree({
        ui : {
          theme_path:'../beacon/img/',
            context : [
            {
                id    : this.id + "addSiblingBefore",
                icon  : icon_path + "create.png",
                label  : "Add Sibling Before This Node",
                visible  : function (node) {
                    var name = $(this.tree[node.attr("id")].node).attr("title");

                    if (!this.dtd[name]) {
                        return false;
                    }

                    if (!this.dtd[name].siblings) {
                        return false;
                    }

                    return true;

                }.attach(this),
                action  : function (node) {
                    var iframeNode = this.tree[node.attr("id")].node;

                    $(this.ui["Iframe"].id).scrollTo(iframeNode, {
                        duration: 600
                    });

                    var name = iframeNode.title;

                    var randomID = this.generateTreeNodeID();

                    var html = this.buildBlockInsertMenu(this.dtd[name]);
                    html = '<select id="' + this.id + 'nodeInsertBefore">' + html + '</select>';
                    html = '<li id="' + randomID + '">' + html + '</li>';

                    $(html).insertBefore(node);

                    var obj = {
                        api: this,
                        newNodeID: randomID,
                        existingNodeID: node.attr("id"),
                        iframeNode: iframeNode
                    };

                    $("#" + this.id + "nodeInsertBefore").change(function() {
                        var val = $("#" + this.api.id + "nodeInsertBefore").val();

                        if (val === "-1") {
                            BeaconMessage.init("Select something!");
                            return;
                        }

                        var html = this.api.buildNodeStructure(val);

                        var n = $(html).hide();
                        n.insertBefore(this.iframeNode);
                        n.show("slow");
                        n.attr("id", this.newNodeID + "_newNode");

                        var nDOM = this.api.iframe.document.getElementById(this.newNodeID + "_newNode");

                        var text = '<a href="#">' + val + '</a>';

                        if (nDOM.childNodes.length > 0) {
                            for (var i=0; i<nDOM.childNodes.length; i++) {
                                var t = "<ul>" + this.api.walkDOM(nDOM.childNodes[i]) + "</ul>";
                                if (t == "<ul></ul>") {
                                    t = "";
                                }
                                text += t;
                            }
                        }

                        $("#" + this.newNodeID).html(text);

                        $.tree_reference(this.api.id + "BeaconTreeContainer").refresh();

                        this.api.tree[this.newNodeID] = {};
                        this.api.tree[this.newNodeID].node = nDOM;

                        $(this.api.ui["Iframe"].id).scrollTo(n, {
                            duration: 600
                        });

                    }.attach(obj));

                    return true;

                }.attach(this)
            },
            {
                id    : this.id + "addSiblingAfter",
                label  : "Add Sibling After This Node",
                icon  : icon_path + "create.png",
                visible  : function (node) {
                    var name = $(this.tree[node.attr("id")].node).attr("title");

                    if (!this.dtd[name]) {
                        return false;
                    }

                    if (!this.dtd[name].siblings) {
                        return false;
                    }

                    return true;

                }.attach(this),
                action  : function (node) {
                    var iframeNode = this.tree[node.attr("id")].node;

                    $(this.ui["Iframe"].id).scrollTo(iframeNode, {
                        duration: 600
                    });

                    var name = iframeNode.title;

                    var randomID = this.generateTreeNodeID();

                    var html = this.buildBlockInsertMenu(this.dtd[name]);
                    html = '<select id="' + this.id + 'nodeInsertAfter">' + html + '</select>';
                    html = '<li id="' + randomID + '">' + html + '</li>';

                    $(html).insertAfter(node);

                    var obj = {
                        api: this,
                        newNodeID: randomID,
                        existingNodeID: node.attr("id"),
                        iframeNode: iframeNode
                    };

                    $("#" + this.id + "nodeInsertAfter").change(function() {
                        var val = $("#" + this.api.id + "nodeInsertAfter").val();

                        if (val === "-1") {
                            BeaconMessage.init("Select something!");
                            return;
                        }

                        var html = this.api.buildNodeStructure(val);

                        var n = $(html).hide();
                        n.insertAfter(this.iframeNode);
                        n.show("slow");
                        n.attr("id", this.newNodeID + "_newNode");

                        var nDOM = this.api.iframe.document.getElementById(this.newNodeID + "_newNode");

                        var text = '<a href="#">' + val + '</a>';

                        if (nDOM.childNodes.length > 0) {
                            for (var i=0; i<nDOM.childNodes.length; i++) {
                                var t = "<ul>" + this.api.walkDOM(nDOM.childNodes[i]) + "</ul>";
                                if (t == "<ul></ul>") {
                                    t = "";
                                }
                                text += t;
                            }
                        }

                        $("#" + this.newNodeID).html(text);

                        $.tree_reference(this.api.id + "BeaconTreeContainer").refresh();

                        this.api.tree[this.newNodeID] = {};
                        this.api.tree[this.newNodeID].node = nDOM;

                        $(this.api.ui["Iframe"].id).scrollTo(n, {
                            duration: 600
                        });

                    }.attach(obj));

                    return true;

                }.attach(this)
            },
            {
                 id    : this.id + "removeNode",
                 label  : "Delete this Node",
                 icon  : icon_path + "remove.png",
                 visible  : function (node) {
                     var name = $(this.tree[node.attr("id")].node).attr("title");

                     if (!this.dtd[name]) {
                         return false;
                     }

                     if (this.dtd[name].removable) {
                         if (this.dtd[name].removable === false) {
                             return false;
                         }
                     }

                     return true;

                 }.attach(this),
                 action  : function (node, tree) {
                     $(this.ui["Iframe"].id).scrollTo(node, {
                         duration: 600
                     });

                     var id = node.attr("id");

                     if (!this.tree[id]) {
                         BeaconMessage.init("Boohoo! Something b0rked. :( Blame the devs...");
                         return;
                     }

                     var n = this.tree[id].node;

                     delete this.tree[id];

                     var nParent = n.parentNode;
                     nParent.removeChild(n);

                     var tN = document.getElementById(id);
                     var tParent = tN.parentNode;
                     tParent.removeChild(tN);

                     tree.refresh();

                     return true;
                 }.attach(this)
            }
            ],
        },

        callback : {
            beforechange: function(node) { $($(node).parents(".tree")[0]).find(".clicked").removeClass("clicked"); },
            beforeopen  : function() {  },
            beforeclose : function() {  },
            beforemove  : function() {  },
            beforecreate: function() {  },
            beforerename: function() {  },
            beforedelete: function() {  },
            onselect    : function(node) {
              var id = node.id;
              $($(this.tree[id].node).parents("body")[0]).find(".selected").removeClass("selected");
              $(this.tree[id].node).addClass("selected");
            }.attach(this),
            ondeselect  : function() {  },
            onchange    : function() {  },
            onrename    : function() {  },
            onmove      : function() {  },
            oncopy      : function() {  },
            oncreate    : function() {  },
            ondelete    : function() {  },
            onopen      : function() {  },
            onopen_all  : function() {  },
            onclose     : function() {  },
            error       : function() {  },

            ondblclk    : function(node) {
              var id = node.id;
              if($("#"+id).hasClass("closed")){
                $("#"+id).removeClass("closed").addClass("open");
              }
              $(this.ui["Iframe"].id).scrollTo(this.tree[id].node, {
                duration: 600
              });
            }.attach(this),

            onrgtclk    : function() {  },
            onload      : function() {  },
            onfocus     : function() {  },
            ondrop      : function() {  }
        }
    });
};



//------------------------------- Utility functions ----------------------------

BeaconAPI.prototype.walkDOM = function(root) {
    var html = "";

    var name = root.title || "foo";

    if (name != "foo") {
        if (this.dtd[name]) {
            if (this.dtd[name].type === "inline") {
                return html;
            }
        }

        var randomID = this.generateTreeNodeID();

        this.tree[randomID] = {};
        this.tree[randomID].node = root;

        html += '<li id="' + randomID + '">';

        html += '<a href="#">' + root.title + "</a>";

        if (root.childNodes.length > 0) {
            for (var i=0; i<root.childNodes.length; i++) {
               var text = "<ul>" + this.walkDOM(root.childNodes[i]) + "</ul>";
               if (text == "<ul></ul>") {
                   text = "";
               }
               html += text;
            }
        }

        html += "</li>";
    } else {
        if (root.childNodes.length > 0) {
            for (var i=0; i<root.childNodes.length; i++) {
               html += this.walkDOM(root.childNodes[i]);
            }
        }
    }

    return html;
};




//-----------------------------Different Editors -------------------------------

var BeaconRichTextEditor = function(o, iframe) {
  
    // Store this node
    this.node = o;

    // Store the iframe reference
    this.iframe = iframe;

    // Store the initial HTML
    this.html = this.node.innerHTML;

    // Make the node Editable
    this.node.contentEditable = true

    // Copy over old styles
    this.style = {};

    // Set new styles
    this.node.style.outline = "#000000 solid thin";

    // Focus the node to set cursor
    this.node.focus();
};

BeaconRichTextEditor.prototype.restoreNode = function() {
    // Reset to no outline
    this.node.style.outline = "";

    // Make it uneditable
    this.node.contentEditable = false;
};

BeaconRichTextEditor.prototype.insertText =  function(html) {
    // Stuff it in
    this.iframe.document.execCommand('inserthtml', false, html);
};

BeaconRichTextEditor.prototype.keyPressed = function() {

};

BeaconRichTextEditor.prototype.getType = function() {
    // Return type
    return "richtext";
};


function getElementPath(element)
{
    var elementTitleArray = [];
    $(element).parents().not('html').not('body').each(function() {
      if(typeof this.title !== "undefined" && this.title!==""){
        var entry = this.title;
        if ($(this).siblings(this.tagName+"[title="+this.title+"]").length > 0) {
            entry += "[" + $(this).prevAll(this.tagName+"[title="+this.title+"]").length + "]";
        }
        elementTitleArray.push(entry);
      }
    });
    elementTitleArray.reverse();
    
    var entry = element.title;
    if ($(element).siblings(element.tagName+"[title="+element.title+"]").length > 0) {
        entry += "[" + $(element).prevAll(element.tagName+"[title="+element.title+"]").length + "]";
    }
    elementTitleArray.push(entry);

    
    return elementTitleArray;
}

/*
an example of how to select and open nodes in the tree from outside of the tree (a bit of a hack)

$("#14BeaconTreeContainer .clicked").removeClass("clicked");
$("#14_node_13").removeClass("closed").addClass('open').find(">a").addClass("clicked");
*/

function getNodeId(documentId,elementPath){
  
  // root node of tree
  var thisNode = $("#"+documentId+"BeaconTreeContainer>ul>li")[0];
  var nextElement = elementPath.shift();
  var depth = 0;
  
  // possibly unnecessary to evaluate root
  if($(thisNode).find(">a").text()===nextElement){
    while(elementPath.length>0){
      
      nextElement = elementPath.shift();
      
      var regex = /[\w]+/g;
      var matches = nextElement.match(regex);
      
      if(matches.length>0){
        
        var elementName = "";
        var elementIndex = 0;
        
        elementName = matches[0];
        if(matches.length>1){
          elementIndex = parseInt(matches[1],10);
        }
        
        var nodesText = new Array();
        var goodIterator = 0;
        
        $(thisNode).find(">ul>li").each(function(i,el){
          
          var thisAnchor = $(el).find(">a")[0];
          if($(thisAnchor).text()===elementName){
            if(goodIterator===elementIndex){
              thisNode = el;
            }
            goodIterator++;
          }          
        });
        
      }
      depth++;
    }
  }
  
  return thisNode.id;
  
}

function selectTreeNode(nodeId){

  if($("#"+nodeId).length>0){
    var $thisNode = $("#"+nodeId);
    do{
      if(!$thisNode.hasClass("leaf")){
        $thisNode.removeClass("closed").addClass('open');
      }
      $thisNode = $thisNode.parent();
    }while(!$thisNode.parent().hasClass(".tree"));
    
    $($("#"+nodeId).parents(".tree")[0]).find(".clicked").removeClass("clicked");
    $("#"+nodeId).find(">a").addClass("clicked");
  }
  
}


var BeaconLineEditor = function(o, iframe) {
  /*
    // need to open up visual tree when clicking on something.
    console.log(o);
    console.log(getElementPath(o));
    
    var documentId = iframe.frameElement.id.replace("Iframe","");
    var nodeId = getNodeId(documentId,getElementPath(o));
    selectTreeNode(nodeId);
    */
    // Store this node
    this.node = o;

    // Store the iframe reference
    this.iframe = iframe;

    // Store the initial HTML
    var html = this.node.innerHTML;

    var editTitle = document.createElement('input');
    editTitle.type = "text";
    editTitle.value = $.trim(this.node.innerHTML);
    $(editTitle).addClass($(this.node).attr('class'));
    $(this.node).html("");
    $(this.node).append(editTitle);

    this.editor = editTitle;

    // Focus the node to set cursor
    editTitle.focus();
};

BeaconLineEditor.prototype.restoreNode = function() {
    var html = $(this.editor).val();
    $(this.node).html(html);
};


BeaconLineEditor.prototype.keyPressed = function() {

};

BeaconLineEditor.prototype.getType = function() {
    // Return type
    return "lineedit";
};

BeaconLineEditor.prototype.getNode = function() {
    // Return type
    return this.editor;
};



var BeaconPlainTextEditor = function(o, iframe) {
  
    // Store this node
    this.node = o;

    // Store the iframe reference
    this.iframe = iframe;

    // Store the initial HTML
    var html = this.node.innerHTML;

    var editText = document.createElement('textarea');
    editText.value = $.trim(this.node.innerHTML);
    $(editText).addClass($(this.node).attr('class'));
    editText.style.height = $(this.node).height();
    editText.style.width = "100%";
    $(this.node).html("");
    $(this.node).append(editText);

    this.editor = editText;

    // Focus the node to set cursor
    editText.focus();
};

BeaconPlainTextEditor.prototype.restoreNode = function() {
    var html = $(this.editor).val();
    $(this.node).html(html);
};


BeaconPlainTextEditor.prototype.keyPressed = function() {

};

BeaconPlainTextEditor.prototype.getType = function() {
    // Return type
    return "plaintext";
};

BeaconPlainTextEditor.prototype.getNode = function() {
    // Return type
    return this.editor;
};
