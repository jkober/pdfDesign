Ext.define('Ext.org.ImageView', {
    extend: 'Ext.view.View',
    alias : 'widget.imageview',
//                    '<img src="web/img/report/{fileName}" />',  
    
    tpl: [
        '<tpl for=".">',
        	'<center>',
            '<div class="thumb-wrap">',
                '<div class="thumb">',
                    '<img src="'+kcPatch.appWeb+'{fileName}" />',  
                '</div>',
            '</div>',
        	'</center>',
        '</tpl>'
    ],
    
    itemSelector: 'div.thumb-wrap',
    multiSelect: true,
    singleSelect: false,
    cls: 'x-image-view',
    autoScroll: true,
    
    initComponent: function() {
        this.store = Ext.getStore("st.pdfImagenView");
        this.callParent();
    }
});			

var firstGridStore = Ext.create('Ext.data.Store', {
		storeId:'st.pdfImagen',
	    fields : ['fileName',"TypeImagen","width","height"],
        data: []
    });
var secondGridStore = Ext.create('Ext.data.Store', {
		storeId:'st.pdfImagenView',
	    fields : ['fileName',"TypeImagen","width","height"],
        data: []
    });

Ext.define("AppDesign.view.design.PdfImagen",{
	extend 		: 'Ext.window.Window',
	alias 		: "widget.pdfImagen",
	layout		: "border",
	modal 		: true,
	closable 	: false,
	title 		: "Seleccionar la Imagen",
	width 		: 580,
	height		: 400,
	initComponent : function() {
		var me 			= this
		this.stFrom 	= Ext.getStore("st.pdfImagen");
		this.viewStore	= Ext.getStore("st.pdfImagenView")		
		Ajax.MyAjax.get().setController("imagen");
		Ajax.MyAjax.get().setAction("listar");
		//----------------------------------------------------------------------
		Ajax.MyAjax.get().setJson("");
		var result = Ajax.MyAjax.get().getInfo();
		//----------------------------------------------------------------------
		if (result.def != undefined) {
			this.stFrom.loadData(result.def)	
		}
		me.lastData = null
		me.items = [
			{	
				region			: 'west',
				xtype			: 'gridpanel',
				width			: 200,
		        store           : 'st.pdfImagen',
	        	columns         : [{text: 'Imagen', flex: 1, sortable: true, dataIndex: 'fileName'}],
		        stripeRows      : true,
		        margins         : '0 2 0 0',
				listeners: {
						scope:me,
				        'select':function(n,e){
				        	this.viewStore.loadData([e.data])
				        	this.lastData = e.data;
				        }
					}			
				},
			{
				region	: 'center',
				xtype	: 'imageview'
			}
		]
		me.buttons = [{
							text	: 'Seleccionar',
							itemId	: 'seleccionar'
						}, {
							text	: 'Cancelar',
							itemId	: 'cancelar'
						}]
		me.callParent(arguments);
	}
})