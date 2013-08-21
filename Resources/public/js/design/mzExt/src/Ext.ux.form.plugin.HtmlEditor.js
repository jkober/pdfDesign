/**
* @class Ext.ux.form.plugin.HtmlEditor
* @author Adrian Teodorescu (ateodorescu@gmail.com; http://www.mzsolutions.eu)
* @docauthor Adrian Teodorescu (ateodorescu@gmail.com; http://www.mzsolutions.eu)
* @version 1.0
* 
* Provides plugins for the HtmlEditor. Many thanks to [Shea Frederick][1] as I was inspired by his [work][2].
* 
* [1]: http://www.vinylfox.com
* [2]: http://www.vinylfox.com/plugin-set-for-additional-extjs-htmleditor-buttons/
* 
* The plugin buttons have tooltips defined in the {@link #buttonTips} property, but they are not
* enabled by default unless the global {@link Ext.tip.QuickTipManager} singleton is {@link Ext.tip.QuickTipManager#init initialized}.
*
* 
* 
#Example usage:#

{@img Ext.ux.form.plugin.HtmlEditor/Ext.ux.form.plugin.HtmlEditor.png Ext.ux.form.plugin.HtmlEditor plugins}

     var top = Ext.create('Ext.form.Panel', {
        frame:true,
        title:          'HtmlEditor plugins',
        bodyStyle:      'padding:5px 5px 0',
        width:          '80%',
        fieldDefaults: {
            labelAlign:     'top',
            msgTarget:      'side'
        },

        items: [{
            xtype:          'htmleditor',
            fieldLabel:     'Text editor',
            height:         300,
            plugins: [
                Ext.create('Ext.ux.form.plugin.HtmlEditor',{
                    enableAll:  true
                })
            ],
            anchor:         '100%'
        }],

        buttons: [{
            text: 'Save'
        },{
            text: 'Cancel'
        }]
    });

    top.render(document.body);

*/
Ext.define('Ext.ux.form.plugin.HtmlEditor', {
    mixins: {
        observable: 'Ext.util.Observable'
    },
    alternateClassName: 'Ext.form.plugin.HtmlEditor',
    requires: [
        'Ext.tip.QuickTipManager',
        'Ext.form.field.HtmlEditor'
    ],
    
    /**
    * @cfg {Boolean} enableAll Enable all available plugins
    */
    enableAll:              false,
    /**
    * @cfg {Boolean} enableUndoRedo Enable "undo" and "redo" plugins
    */
    enableUndoRedo:         false,
    /**
    * @cfg {Boolean} enableRemoveHtml Enable the plugin "remove html" which is removing all html entities from the entire text
    */
    enableRemoveHtml:       false,
    /**
    * @cfg {Boolean} enableRemoveFormatting Enable "remove format" plugin
    */
    enableRemoveFormatting: false,
    /**
    * @cfg {Boolean} enableIndenting Enable "indent" and "outdent" plugins
    */
    enableIndenting:        false,
    /**
    * @cfg {Boolean} enableSmallLetters Enable "superscript" and "subscript" plugins
    */
    enableSmallLetters:     false,
    /**
    * @cfg {Boolean} enableHorizontalRule Enable "horizontal rule" plugin
    */
    enableHorizontalRule:   false,
    /**
    * @cfg {Boolean} enableSpecialChars Enable "special chars" plugin
    */
    enableSpecialChars:     false,
    /**
    * @cfg {Boolean} enableWordPaste Enable "word paste" plugin which is cleaning the pasted text that is coming from MS Word
    */
    enableWordPaste:        false,

    enableInsertTable:      false,
    enableImages:           false,
    
    wordPasteEnabled:       false,
    
    /**
     * @cfg {Array} specialChars
     * An array of additional characters to display for user selection.  Uses numeric portion of the ASCII HTML Character Code only. For example, to use the Copyright symbol, which is &#169; we would just specify <tt>169</tt> (ie: <tt>specialChars:[169]</tt>).
     */
    specialChars: [],
    /**
     * @cfg {Array} charRange
     * Two numbers specifying a range of ASCII HTML Characters to display for user selection. Defaults to <tt>[160, 256]</tt>.
     */
    charRange: [160, 256],
    
    constructor: function(config) {
        Ext.apply(this, config);
    },
        
    init: function(editor){
        var me = this;
        me.editor = editor;
        me.mon(editor, 'initialize', me.onInitialize, me);
    },
    
    onInitialize: function(){
        var me = this, undef,
            items = [],
            baseCSSPrefix = Ext.baseCSSPrefix,
            tipsEnabled = Ext.tip.QuickTipManager && Ext.tip.QuickTipManager.isEnabled();
        
        function btn(id, toggle, handler){
            return {
                itemId : id,
                cls : baseCSSPrefix + 'btn-icon',
                iconCls: baseCSSPrefix + 'edit-'+id,
                enableToggle:toggle !== false,
                scope: me,
                handler:handler||me.relayBtnCmd,
                clickEvent:'mousedown',
                tooltip: tipsEnabled ? me.buttonTips[id] || undef : undef,
                overflowText: me.buttonTips[id].title || undef,
                tabIndex:-1
            };
        }

        if(me.enableRemoveHtml || me.enableAll){
            items.push(btn('removehtml', false, me.doRemoveHtml));
        }
        if(me.enableRemoveFormatting || me.enableAll){
            items.push(btn('removeformat', false));
        }
        if(me.enableUndoRedo || me.enableAll){
            items.push('-');
            items.push(btn('undo', false));
            items.push(btn('redo', false));
        }
        /*if(me.enableInsertTable || me.enableAll){
            items.push('-');
            items.push(btn('inserttable', false, me.doInsertTable));
        }*/
        if(me.enableIndenting || me.enableAll){
            items.push('-');
            items.push(btn('indent', false));
            items.push(btn('outdent', false));
        }
        if(me.enableSmallLetters || me.enableAll){
            items.push('-');
            items.push(btn('superscript'));
            items.push(btn('subscript'));
        }
        if(me.enableHorizontalRule || me.enableAll){
            items.push(btn('inserthorizontalrule', false));
        }
        if(me.enableSpecialChars || me.enableAll){
            items.push(btn('chars', false, me.doSpecialChars));
        }
        if(me.enableWordPaste || me.enableAll){
            items.push(btn('wordpaste', true, me.doWordPaste));
            me.wordPasteEnabled = true;
        }else{
            me.wordPasteEnabled = false;
        }
        /*if(me.enableImages){
            items.push(btn('images', false, me.doImages));
        }*/
        if(items.length > 0){
            me.editor.getToolbar().add(items);
            fn = Ext.Function.bind(me.onEditorEvent, me);
            Ext.EventManager.on(me.editor.getDoc(), {
                mousedown: fn,
                dblclick: fn,
                click: fn,
                keyup: fn,
                buffer:100
            });
            
        }
    },
    
    onEditorEvent: function(e){
        this.updateToolbar();
        
        var diffAt = 0;
        this.curLength = this.editor.getValue().length;
        
        if (e.ctrlKey) {
            var me = this,
                c = e.getCharCode();
            if (c > 0) {
                c = String.fromCharCode(c);
                if(c.toLowerCase() == 'v' && me.wordPasteEnabled){
                    me.cleanWordPaste();
                }
            }
        }
        
        this.lastLength = this.editor.getValue().length;
        this.lastValue = this.editor.getValue();

    },
    
    updateToolbar: function(){
        var me = this,
            btns, doc;
        
        if(me.editor.readOnly){
            return
        }
        
        btns = me.editor.getToolbar().items.map;
        doc = me.editor.getDoc();
        
        function updateButtons() {
            Ext.Array.forEach(Ext.Array.toArray(arguments), function(name) {
                btns[name].toggle(doc.queryCommandState(name));
            });
        }
        
        if(me.enableSmallLetters || me.enableAll){
            updateButtons('superscript', 'subscript');
        }
        
        if(me.enableWordPaste || me.enableAll){
            btns['wordpaste'].toggle(me.wordPasteEnabled);
        }
        
    },
    
    doRemoveHtml: function() {
        Ext.defer(function() {
            var me = this;
            me.editor.focus();
            var tmp = document.createElement("DIV");
            tmp.innerHTML = me.editor.getValue();
            me.editor.setValue(tmp.textContent||tmp.innerText);
        }, 10, this);
    },
    
    doInsertTable: function(){
        
    },
    
    doSpecialChars: function(){
        var specialChars = [];
        if (this.specialChars.length) {
            Ext.each(this.specialChars, function(c, i){
                specialChars[i] = ['&#' + c + ';'];
            }, this);
        }
        for (i = this.charRange[0]; i < this.charRange[1]; i++) {
            specialChars.push(['&#' + i + ';']);
        }
        var charStore = new Ext.data.ArrayStore({
            fields: ['char'],
            data: specialChars
        });
        this.charWindow = Ext.create('Ext.Window', {
            title:          this.buttonTips.chars.text,
            width:          436,
            autoHeight:     true,
            modal:          true,
            layout:         'fit',
            items: [{
                itemId:         'idDataView',
                xtype:          'dataview',
                store:          charStore,
                autoHeight:     true,
                multiSelect:    true,
                tpl: new Ext.XTemplate('<tpl for="."><div class="char-item">{char}</div></tpl><div class="x-clear"></div>'),
                overItemCls:    'char-over',
                trackOver:      true,
                itemSelector:   'div.char-item',
                listeners: {
                    itemdblclick: function(t, i, n, e){
                        this.editor.insertAtCursor(i.get('char'));
                        this.charWindow.close();
                    },
                    scope: this
                }
            }],
            buttons: [{
                text: 'Insert',
                handler: function(){
                    Ext.each(this.charWindow.down('#idDataView').selModel.getSelection(), function(rec){
                        var c = rec.get('char');
                        this.editor.focus();
                        this.editor.insertAtCursor(c);
                    }, this);
                    this.charWindow.close();
                },
                scope: this
            }, {
                text: 'Cancel',
                handler: function(){
                    this.charWindow.close();
                },
                scope: this
            }]
        });
        this.charWindow.show();
    },
    
    doWordPaste: function(){
        this.wordPasteEnabled = !this.wordPasteEnabled;
    },
    
    cleanWordPaste: function(){
        this.editor.suspendEvents();
        
        diffAt = this.findValueDiffAt(this.editor.getValue());
        var parts = [
            this.editor.getValue().substr(0, diffAt),
            this.fixWordPaste(this.editor.getValue().substr(diffAt, (this.curLength - this.lastLength))),
            this.editor.getValue().substr((this.curLength - this.lastLength)+diffAt, this.curLength)
        ];
        this.editor.setValue(parts.join(''));
        
        this.editor.resumeEvents();        
    },
    
    findValueDiffAt: function(val){
        
        for (i=0;i<this.curLength;i++){
            if (this.lastValue[i] != val[i]){
                return i;            
            }
        }
        
    },

    fixWordPaste: function(wordPaste) {
        var removals = [/&nbsp;/ig, /[\r\n]/g, /<(xml|style)[^>]*>.*?<\/\1>/ig, /<\/?(meta|object|span)[^>]*>/ig,
            /<\/?[A-Z0-9]*:[A-Z]*[^>]*>/ig, /(lang|class|type|href|name|title|id|clear)=\"[^\"]*\"/ig, /style=(\'\'|\"\")/ig, /<![\[-].*?-*>/g, 
            /MsoNormal/g, /<\\?\?xml[^>]*>/g, /<\/?o:p[^>]*>/g, /<\/?v:[^>]*>/g, /<\/?o:[^>]*>/g, /<\/?st1:[^>]*>/g, /&nbsp;/g, 
            /<\/?SPAN[^>]*>/g, /<\/?FONT[^>]*>/g, /<\/?STRONG[^>]*>/g, /<\/?H1[^>]*>/g, /<\/?H2[^>]*>/g, /<\/?H3[^>]*>/g, /<\/?H4[^>]*>/g, 
            /<\/?H5[^>]*>/g, /<\/?H6[^>]*>/g, /<\/?P[^>]*><\/P>/g, /<!--(.*)-->/g, /<!--(.*)>/g, /<!(.*)-->/g, /<\\?\?xml[^>]*>/g, 
            /<\/?o:p[^>]*>/g, /<\/?v:[^>]*>/g, /<\/?o:[^>]*>/g, /<\/?st1:[^>]*>/g, /style=\"[^\"]*\"/g, /style=\'[^\"]*\'/g, /lang=\"[^\"]*\"/g, 
            /lang=\'[^\"]*\'/g, /class=\"[^\"]*\"/g, /class=\'[^\"]*\'/g, /type=\"[^\"]*\"/g, /type=\'[^\"]*\'/g, /href=\'#[^\"]*\'/g, 
            /href=\"#[^\"]*\"/g, /name=\"[^\"]*\"/g, /name=\'[^\"]*\'/g, / clear=\"all\"/g, /id=\"[^\"]*\"/g, /title=\"[^\"]*\"/g, 
            /<span[^>]*>/g, /<\/?span[^>]*>/g, /class=/g];
                    
        Ext.each(removals, function(s){
            wordPaste = wordPaste.replace(s, "");
        });
        
        // keep the divs in paragraphs
        wordPaste = wordPaste.replace(/<div[^>]*>/g, "<p>");
        wordPaste = wordPaste.replace(/<\/?div[^>]*>/g, "</p>");
        return wordPaste;
        
    },

    doImages: function(){
        
    },
    
    relayBtnCmd: function(btn){
        this.relayCmd(btn.getItemId());
    },
    
    relayCmd: function(cmd, value) {
        Ext.defer(function() {
            var me = this;
            me.editor.focus();
            me.editor.execCmd(cmd, value);
        }, 10, this);
    },

    buttonTips : {
        undo : {
            title: 'Undo',
            text: 'Undo the last action.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        redo : {
            title: 'Redo',
            text: 'Redo the last action.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        removehtml : {
            title: 'Remove html',
            text: 'Remove html from the entire text.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        removeformat : {
            title: 'Remove formatting',
            text: 'Remove formatting for the selected area.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        inserttable : {
            title: 'Insert table',
            text: 'Insert table at the cursor.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        indent : {
            title: 'Indent',
            text: 'Indent paragraph.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        outdent : {
            title: 'Outdent',
            text: 'Outdent paragraph.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        superscript : {
            title: 'Superscript',
            text: 'Change font size to superscript.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        subscript : {
            title: 'Subscript',
            text: 'Change font size to subscript.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        inserthorizontalrule : {
            title: 'Insert horizontal rule',
            text: 'Insert horizontal rule at the cursor.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        chars : {
            title: 'Special chars',
            text: 'Insert special characters.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        wordpaste : {
            title: 'Word paste',
            text: 'Clean the pasted text.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        images : {
            title: 'Images',
            text: 'Insert images.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        }
    }
    
})
