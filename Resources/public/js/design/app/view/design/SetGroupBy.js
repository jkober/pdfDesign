Ext.define('groupByModel', {
    extend: 'Ext.data.Model',
    fields : ['name',"extra","nameDisp"]
});
var firstGridStore = Ext.create('Ext.data.Store', {
		storeId:'st.groupBy',
        model: 'groupByModel',
        data: []
    });

var secondGridStore = Ext.create('Ext.data.Store', {
		storeId:'st.groupBySecond',
        model: 'groupByModel'
    });
Ext.define("AppDesign.view.design.SetGroupBy",{
	extend : 'Ext.window.Window',
	alias : "widget.SetGroupBy",
	modal : true,
	//zIndexManager:999999,
	closable : false,

	title : "Setear el group By",
	width : 580,
	initComponent : function() {
		var me 			= this
		this.stFrom 	= Ext.getStore("st.groupBy");
		this.stTo		= Ext.getStore("st.groupBySecond");
		var lista1 		= new Array()
		var lista2 		= new Array()
		var encuentra	= false
		var field;
		var field2;
		for (var i = 0 ;i<kc.pdfStrucRefActiva.reportExtras.field.length;i++) {			
			field = kc.pdfStrucRefActiva.reportExtras.field[i]
			encuentra=false
			for (var ii = 0 ; ii < this.group.GroupBy.length;ii++) {
				field2 = this.group.GroupBy[ii]
				if (field.name == field2) {
					encuentra=true
					break;
				}
			}
			if (encuentra) {
				lista2.push(field)	
			}else{
				lista1.push(field)	

			}
		}
		this.stFrom.loadData(lista1)
		this.stTo.loadData(lista2)
		me.items = [
			{
				xtype		: 'gridpanel',
				height		: 200,
				multiSelect	: true,
				        viewConfig	: {
				            plugins	: {
				                ptype		: 'gridviewdragdrop',
				                dragGroup	: 'firstGridDDGroup',
				                dropGroup	: 'secondGridDDGroup'
				            },
				            listeners	: {
				                drop: function(node, data, dropRec, dropPosition) {
				                    var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
				                }
				            }
				        },
				        store            : 'st.groupBy',
			        	columns          : [{text: "Record Name", flex: 1, sortable: true, dataIndex: 'name'}],
				        stripeRows       : true,
				        title            : 'First Grid',
				        margins          : '0 2 0 0'
			},
			{
				xtype	: 'gridpanel',
				height	: 200,

			viewConfig: {
			            plugins: {
			                ptype		: 'gridviewdragdrop',
			                dragGroup	: 'secondGridDDGroup',
			                dropGroup	: 'firstGridDDGroup'
			            },
			            listeners: {
			                drop: function(node, data, dropRec, dropPosition) {
			                    var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
			                }
			            }
			        },
			        store            : "st.groupBySecond",
			        columns          : [{text: "Record Name", flex: 1, sortable: true, dataIndex: 'name'}],
			        stripeRows       : true,
			        title            : 'Second Grid',
			        margins          : '0 0 0 3'			
			}
		]
		me.buttons = [{
					text : 'Guardar',
					handler : me.save.bind(me)
				}, {
					text : 'Cancelar',
					handler : me.close.bind(me)
				}]
		
		me.callParent(arguments);
	},
	save:function(){
		for (var ii = 0 ; ii<this.group.GroupBy.length;ii++ ) {
			delete this.group.GroupBy[ii]
		}
		this.group.GroupBy.length=0
		for (var i = 0;i<this.stTo.getCount();i++){
			var c= this.stTo.getAt(i).data.name
			this.group.GroupBy.push(c)
		}
		this.close();
	}
})