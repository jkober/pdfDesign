Ext.define('AppDesign.view.design.ParamExtras', {
			extend : 'Ext.data.Model',
			fields : ['name', "value", 'comentario']
		});
Ext.create('Ext.data.Store', {
			storeId : 'storeParamExtras',
			model : 'AppDesign.view.design.ParamExtras',
			data : [],
			proxy : {
				type : 'memory',
				reader : {
					type : 'json'
				}
			}
		});
Ext.define("AppDesign.view.design.PdfOpciones", {
	extend : 'Ext.window.Window',
	alias : "widget.pdfOpciones",
	modal : true,
	closable : false,

	title : "Configurar Opciones del Reporte",
	width : 580,
	// ----------------------------------------------------------------------------------------------
	buttons : [{
				text : 'Guardar',
				itemId : "guardar"
			}, {
				text : 'Cancelar',
				itemId : "cancelar"
			}],
	// ----------------------------------------------------------------------------------------------
	initComponent : function() {
		var me = this
		me.editing = Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1
				})
		var itemsjose = [

		{
			title : "Pagina (mm)",
			xtype : 'container',
			layout : 'vbox',
			items : [{
						xtype : "fieldset",
						height : 60,
						title : "Margenes",
						width : me.width,
						autoHeight : true,
						defaults : {
							padding : 0,
							labelAlign : 'right'
						},
						items : [{
									xtype : 'fieldcontainer',
									fieldLabel : 'Superior',
									layout : 'hbox',
									labelAlign : 'right',
									defaults : {
										padding : 0,
										width : 115,
										hideTrigger : true,
										xtype : 'NumberPostition',
										labelAlign : 'right',
										// height : 20,
										allowBlank : false,
										minValue : 0,

										maxValue : 999
									},
									items : [{
												width : 50,
												name : 'MarginTop'
											}, {
												labelWidth : 60,
												fieldLabel : 'Inferior',
												name : 'MarginBottom'
											}, {
												labelWidth : 60,
												fieldLabel : 'Izquierda',
												name : 'MarginLeft'
											}, {
												labelWidth : 60,
												fieldLabel : 'Derecha',
												name : 'MarginRight'
											}]
								}]
					}, {
						xtype : "fieldset",
						title : "Pagina",
						autoHeight : true,
						defaults : {
							padding : 0,
							labelAlign : 'right'
						},
						items : [{
									height : 40,
									xtype : 'fieldcontainer',
									fieldLabel : "Tipo Hoja",
									labelAlign : 'right',
									layout : 'hbox',
									defaults : {
										padding : 0,
										labelAlign : 'right',
										// height : 20,
										allowBlank : false,
										minValue : 1
									},
									items : [{
												width : 70,
												name : 'PageType',
												xtype : "comboPageType"
											}, {
												fieldLabel : 'Orientacion',
												xtype : 'fieldcontainer',
												labelAlign : 'right',
												layout : 'hbox',
												width : 500,
												defaults : {
													padding : 0,
													xtype : 'radiofield',
													labelWidth : 200,
													width : 120,
													labelAlign : 'left',
													name : "PageOrienta"
												},
												items : [{
															boxLabel : "Horizontal",
															name : 'PageOrienta',
															inputValue : 'L'
														}, {
															boxLabel : "Vertical",
															name : 'PageOrienta',
															inputValue : 'P'
														}]
											}]
								}]
					}]
		}, {
			xtype : "fieldset",
			title : "Parametros para Sql",
			defaults : {
				labelAlign : 'right',
				allowBlank : false,
				labelWidth : 200,
				align : 'left'
			},

			anchor : "100%",
			autoHeight : true,
			items : [{
						xtype : "textfield",
						name : "bdName",
						fieldLabel : "Base de Datos"
					}, {
						xtype : 'grid',
						height : 300,
						itemId : 'gridExtras',
						selModel : {
							selType : 'cellmodel'
						},
						plugins : [me.editing],

						store : Ext.data.StoreManager
								.lookup('storeParamExtras'),
						columns : [{
									header : 'Name',
									dataIndex : 'name',
									editor : {
										allowBlank : false
									}
								}, {
									header : 'Valor',
									dataIndex : 'value',
									flex : 1,
									editor : {}
								}],

						dockedItems : [{
									xtype : 'toolbar',
									dock : 'top',
									items : [{
												xtype : 'button',
												iconCls : 'addBtn',
												scope : me,
												handler : me.addParam,
												text : 'Agregar Parametro'
											}, {
												xtype : 'button',
												iconCls : 'dropBtn',
												text : 'Borrar Parametro'
											}]
								}]

					}]
		}, {
			xtype : "fieldset",
			title : "Parametros de Creacion de Objetos",
			autoHeight : true,
			defaults : {
				labelAlign : 'right',
				allowBlank : false,
				labelWidth : 200,
				align : 'left'
			},
			items : [{
						xtype : "ComboBoxFont",
						name : "FontFamily",
						editable : false,
						fieldLabel : "Fuente"
					}, {
						xtype : "numberfield",
						name : "FontSize",
						editable : false,
						minValue : 1,
						fieldLabel : "Tamaño de Fuente"
					}, {
						xtype : "ComboBoxFontAlign",
						editable : false,
						name : "FontAlign",
						fieldLabel : "Alineación"
					},

					{
						xtype : "checkboxfield",
						editable : false,
						name : "FontItalic",
						inputValue : true,
						fieldLabel : "Cursiva"
					}, {
						xtype : "checkboxfield",
						inputValue : true,
						name : "FontBold",
						fieldLabel : "Negrita"
					}, {
						xtype : "ComboBoxColor",
						editable : false,
						name : "FontColor",
						fieldLabel : "Color de Fuente"
					}, {
						xtype : "ComboBoxBorder",
						editable : false,
						name : "BorderType",
						allowBlank : true,

						fieldLabel : "BordeType"
					}, {
						xtype : "ComboBoxRotacion",
						editable : false,
						name : "LabelRotacion",
						allowBlank : true,

						fieldLabel : "Rotación"
					}]
		}]
		me.items = [{
					xtype : "form",
					height : 400,
					items : [{
								xtype : 'tabpanel',
								items : itemsjose
							}]

				}]

		me.callParent(arguments);

	},
	addParam : function() {
		var rec = AppDesign.view.design.ParamExtras({
					name : '',
					value : ''
				})
		this.editing.cancelEdit();
		this.storeRef.insert(0, rec)
		this.editing.startEditByPosition({
					row : 0,
					column : 0
				});
	}
});