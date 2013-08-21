var firstGridStore = Ext.create('Ext.data.Store', {
		storeId:'st.pdfAbrir',
	    fields : ['fileName'],
        data: []
    });

Ext.define("AppDesign.view.design.PdfAbrir", {
			extend : 'Ext.window.Window',
			alias : "widget.pdfAbrir",
			layout : "border",
			modal : true,
			closable : false,
			title : "Seleccionar el Archivo para Abrir",
			width : 220,
			height : 400,
			initComponent : function() {
				var me = this
				this.stAbrir = Ext.getStore("st.pdfAbrir");
				Ajax.MyAjax.get().setController("reporte");
				Ajax.MyAjax.get().setAction("AbrirListar/"+this._OpenBkp);
				// ----------------------------------------------------------------------
				Ajax.MyAjax.get().setJson("");
				var result = Ajax.MyAjax.get().getInfo();
				// ----------------------------------------------------------------------
				if (result.def != undefined) {
					this.stAbrir.loadData( result.def )
				}
				me.lastData = null
				me.items = [{
							region : 'west',
							xtype : 'gridpanel',
							width : 200,
							store : 'st.pdfAbrir',
							columns : [{
										text : 'Archivo',
										flex : 1,
										sortable : true,
										dataIndex : 'fileName'
									}],
							stripeRows : true,
							margins : '0 2 0 0'/*,
							listeners : {
								scope : me,
								'select' : function(n, e) {
									this.viewStore.loadData([e.data])
									this.lastData = e.data;
								}
							}*/
						}]
				me.buttons = [{
							text : 'Seleccionar',
							itemId : 'seleccionar'
						}, {
							text : 'Cancelar',
							itemId : 'cancelar'
						}]
				me.callParent(arguments);
			}
		})