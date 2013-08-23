Ext.create('Ext.data.Store', {
			storeId : 'statesjkTipo',
			fields : ['name', "value"],
			data : [{
						name : 'Sum',
						value : 'Sum'
					}, {
						name : 'Count',
						value : 'Count'
					}, {
						name : 'Avg',
						value : 'Avg'
					}, {
						name : 'Formula',
						value : 'Formula'
					}]
		});
Ext.create('Ext.data.Store', {
			storeId : 'fieldJkReset',
			fields : ['name', "value", "gpId"],
			data : []
		});
Ext.create('Ext.data.Store', {
	storeId : 'fieldJkBasadoEn',
	fields : ['name'],
	data : []
	});
Ext.define("AppDesign.view.design.PdfTotalField", {
	extend : 'Ext.window.Window',
	alias : "widget.pdfTotalField",
	modal : true,
	closable : false,

	title : "Actualizar Total Field",
	width : 580,
	buttons : [{
				text : 'Guardar',
				itemId : "guardar"
			}, {
				text : "Cancelar",
				itemId : "cancelar"
			}],

	initComponent : function() {
		var me 			= this
		me.fieldRef 	= Ext.getStore("fieldJkBasadoEn");
		me.storeReset 	= Ext.getStore("fieldJkReset");
		var ob;
		var arr 		= new Array();
		var basadoEn 	= new Array();
		for (var i in me.pdfStruc.reportExtras.field) {
			ob = me.pdfStruc.reportExtras.field[i]
			basadoEn.push({
						name : ob.name + " (f)"
					})
		}
		for (i in me.pdfStruc.TotalFields) {
			ob = me.pdfStruc.TotalFields[i];
			if (this.action == "edit") {
				if (me.recordRef.get("FieldName") != ob.FieldName) {
					if (ob.Type == "Formula") {
						basadoEn.push({
									name : ob.FieldName + " (t)"
								})
					}
				}
			} else {
				if (ob.Type == "Formula") {
					basadoEn.push({
								name : ob.FieldName + " (t)"
							})
				}
			}
		}
		me.fieldRef.loadData(basadoEn)
		arr.push({
					name : "Nunca",
					value : "Nunca"
				})
		for (var i in me.pdfStruc.GroupBy) {
			ob = "Grupo: " + i + "->"
			for (ii in me.pdfStruc.GroupBy[i]) {
				ob = ob + me.pdfStruc.GroupBy[i][ii] + " "
			}
			arr.push({
						name : ob,
						value : ob,
						gpId : i
					})
		}
		me.storeReset.loadData(arr)
		me.items = [{
			xtype : "form",
			layout : 'vbox',
			height : 400,
			defaults : {
				xtype : 'textfield',
				fieldLabel : ' ',
				allowBlank : false,
				labelAlign : 'right'
			},
			items : [{
						fieldLabel : 'Name',
						name : 'FieldName',
						itemId : 'FieldName'
					}, {
						fieldLabel : 'Tipo',
						xtype : "combo",
						name : 'TypeRef',
						displayField : 'name',
						valueField : 'name',
						selectOnFocus : true,
						forceSelection : true,
						itemId : 'tipo',
						store : "statesjkTipo",
						queryMode : 'local',
						listeners : {
							change : {
								scope : me,
								fn : me._changTipo
							}
						}
					}, {
						fieldLabel : 'Basado en',
						xtype : "combo",
						name : 'FieldSummarizeAux',
						displayField : 'name',
						valueField : 'name',
						selectOnFocus : true,
						forceSelection : true,
						itemId : "basadoEn",
						store : "fieldJkBasadoEn",
						queryMode : 'local'
					}, {
						fieldLabel : 'Resetear en',
						xtype : "combo",
						name : 'Reset',
						displayField : 'name',
						itemId : 'reset',
						valueField : 'gpId',
						selectOnFocus : true,
						forceSelection : true,
						store : "fieldJkReset",
						queryMode : 'local'
					}, {
						value : 'Formula ($$->Total) ($@->Field) ($PdfGen->PdfObject)',
						xtype : 'displayfield',
						labelSeparator : ' '
					},
					{
						itemId : "formula",
						name : 'Expression',
						xtype : 'codemirror',
						pathModes : kcPatch.appDir + 'js/design/mzExt/CodeMirror-2.2/mode',
						pathExtensions : kcPatch.appDir + 'js/design/mzExt/CodeMirror-2.2/lib/util',
						labelSeparator : ' ',
						showModes : false,
						fieldLabel : 'Code',
                                                width:550,
						anchor : '100% 100%',
						editorHeight : 200,
						theme : "rubyblue",

						mode : 'text/x-php',
						readOnly : false
					}
			]
		}]

		me.callParent(arguments);
		if (this.action == "edit") {
			var form = me.items.getAt(0).getForm();
			form.loadRecord(me.recordRef)
			form = this.items.getAt(0)
			me.items.getAt(0).items.get("tipo").setReadOnly(true)
			me.items.getAt(0).items.get("FieldName").setReadOnly(true)
			form.items.get("reset").setValue(this.recordRef.get("Reset"))
			form.items.get("basadoEn").setValue(this.recordRef.get("FieldSummarizeAux"))
			form.items.get("tipo").setValue(this.recordRef.get("Type"))
			if ( this.recordRef.get("Type") =="Formula") {
				form.items.get("formula").setReadOnly(true)
			}

		}
		me.items.getAt(0).getForm().isValid()
	},
	show : function() {
		this.callParent(arguments);
		/*if (this.action == "edit") {
			var form = this.items.getAt(0).getForm();
			form.loadRecord(this.recordRef)
			form = this.items.getAt(0)
			//this.items.getAt(0).getForm().loadRecord(this.recordRef)
			form.items.get("basadoEn").setValue(this.recordRef.FieldSummarize)
			form.items.get("tipo").setValue(this.recordRef.Type)
		}*/

	},
	_changTipo : function(ref, newValue, oldValue) {
		//------------------------------------------------------------------------------------------
		var basado = this.items.getAt(0).items.get("basadoEn")
		var formula = this.items.getAt(0).items.get("formula")
		var reset = this.items.getAt(0).items.get("reset")
		//------------------------------------------------------------------------------------------
		basado.setReadOnly(true)
		formula.setReadOnly(true)
		reset.setReadOnly(true)
		//------------------------------------------------------------------------------------------
		reset.allowBlank = true
		basado.allowBlank = true
		formula.allowBlank = true
		//------------------------------------------------------------------------------------------
		if (newValue == "Formula") {
			basado.setValue("")
			reset.setValue("Nunca")
			formula.allowBlank = false
			formula.setReadOnly(false)
			//reset.setReadOnly(true)
		} else {
			basado.allowBlank = false
			basado.setReadOnly(false)
			reset.setReadOnly(false)
		}
		//------------------------------------------------------------------------------------------
		basado.isValid()
		formula.isValid()
		reset.isValid()
		//------------------------------------------------------------------------------------------
	}
});