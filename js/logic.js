/* Backbone-based UI code */

/*
 * MODELS / COLLECTIONS:
 * - Record
 * - Records
 *
 * VIEWS:
 * - InputView
 * - RecordView
 * - RecordsView
 */

var dbclickTimer,
    deleteCheck;

// simple focuser on TAB press
document.addEventListener("keypress", function(event) {
    if (event.keyCode == 97 && !($("#keyInput").is(":focus") || $("#contentInput").is(":focus"))) {
        event.preventDefault();
        $("#keyInput").focus();
    }
});

var Record = Backbone.Model.extend({

    urlRoot: "/ambrosia/api/ciphers",

});

var Records = Backbone.Collection.extend({

    url: "/ambrosia/api/ciphers",

    model: Record

});

var InputView = Backbone.View.extend({
    
    id: "input",

    initialize: function(options) {
        // nothin
    },

    events: {
        "click #submit": "newRecord",
        "keypress": "onKeyPress",
    },

    newRecord: function() {
        keyEl = $("#keyInput")[0];
        contentEl = $("#contentInput")[0];

        key = keyEl.value;
        content = contentEl.value;

        if (key.trim() != "" && content.trim() != "") {
            var newRecord = new Record({ key: key, content: content});
            records.add(newRecord);

            keyEl.value = contentEl.value = "";

            newRecord.save();
        }
    },
    
    onKeyPress: function(event) {
        if (event.keyCode == 13) this.newRecord();
    },

    render: function() {
        this.$el.html("<input autofocus placeholder='key' type='text' id='keyInput'></input><input placeholder='content' type='text' id='contentInput'></input><div id='submit'>ADD</div>");
        return this;
    }

});

var RecordView = Backbone.View.extend({
    
    className: "record",

    initialize: function(options) {
        // this.model = options.model
    },

    events: {
        // double click to delete record
        "click": "deleteRecordCheck"
    },

    deleteRecordCheck: function() {
        if (deleteCheck) this.deleteRecord();
        deleteCheck = true;

        dbclickTimer = setTimeout(function() {
             deleteCheck = false;
        }, 250);
        
    },
      
    deleteRecord: function() {
        this.remove();
        this.unbind();
        this.model.destroy();
    },
    
    render: function() {
        selfKey = this.model.get("key");
        selfContent = this.model.get("content");
        htmls = '<b>' + selfKey + '</b><i>' + selfContent + '</i>';

        this.$el.html(htmls);

        return this;
    }
});

var RecordsView = Backbone.View.extend({
      
    id: "records-container",

    initialize: function(options) {
        this.collection = options.collection;
        
        this.collection.on("add", this.render, this);
    },

    render: function() {
        var self = this;
        self.$el.html("");

        this.collection.each(function(record) {
            self.$el.append(new RecordView({ model: record }).render().$el);
        });

        console.log("rerendered");

        return this;
    }

});

var records = new Records();
records.fetch();

var inputView = new InputView();
var recordsView = new RecordsView({ collection: records });

$("#input-container").html(inputView.render().$el);
$("#records-container").html(recordsView.render().$el);

