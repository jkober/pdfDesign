// --------------------------------------------------------------------------------------------------
Ext.create('Ext.data.Store', {
			storeId : 'st.listFieldTable',
			fields : ['name', 'extra', 'nameDisp'],
			data : []
		});
// --------------------------------------------------------------------------------------------------
Ext.define('AppDesign.view.design.ParamExtrasTable', {
			extend : 'Ext.data.Model',
			fields : ['name', "value", 'comentario']
		});
Ext.create('Ext.data.Store', {
			storeId : 'st.paramSqlTable',
			model : 'AppDesign.view.design.ParamExtrasTable',
			data : []
		});
// --------------------------------------------------------------------------------------------------
Ext.create('Ext.data.Store', {
			storeId : 'st.listFieldArray',
			model : 'AppDesign.view.design.ParamExtrasTable',
			data : []
		});

// --------------------------------------------------------------------------------------------------
Ext.define('AppDesign.view.design.TableEditSource', {
	extend : 'Ext.form.Panel',
	alias : "widget.TableEditSource",
	bodyPadding : 5,
	width : 620,
	height : 550,
	fieldTable : null,
	buttons : [{
				text : "Volver",
				itemId : 'cancelar'
			}, {
				text : "Guardar",
				itemId : 'guardar'
			}],
	initComponent : function() {
		// ------------------------------------------------------------------------------------------
		var me = this;
		var arr = new Array();
		// ------------------------------------------------------------------------------------------
		me.fieldTable = Ext.getStore("st.listFieldTable");
		me.fieldTable.loadData(this.meVal.fields)
		// ------------------------------------------------------------------------------------------
		this.stParam = Ext.getStore("st.paramSqlTable");
		this.stParam.loadData(this.meVal.params)
		// ------------------------------------------------------------------------------------------
		this.stParamArray = Ext.getStore("st.listFieldArray");
		this.stParamArray.loadData(this.meVal.fieldsArray)
		me.editingArray = Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1
				})
		// ------------------------------------------------------------------------------------------
		me.editing = Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1
				})
		// ------------------------------------------------------------------------------------------
		widtTab = 550;
		// ------------------------------------------------------------------------------------------
		me.items = [
{
                    xtype       : 'radiogroup',
                    fieldLabel  : "Tipo de Origen",
                    anchor      : 'none',
                    name        : "sourceNameS",
                    itemId      : 'sourceNameS',
                    layout: {
                        autoFlex: false
                    },
                    defaults: {
                        name: 'sourceName',
                        margin: '0 15 0 0'
                    },
                    items: [{
                        inputValue: '1',
                        boxLabel: 'From Codigo',
                        checked: true
                    }, {
                        inputValue: '2',
                        boxLabel: 'From Sql'
                    }]},                    
                
                
                        /*{
					xtype : 'combo',
					name : "sourceName_",
					itemId : 'sourceName_',
					fieldLabel : "Tipo de Origen",
					displayField : 'sourceName',
					valueField : 'sourceType',
					queryMode : 'local',
					store : {
						fields : ['sourceName', 'sourceType'],
						data : [{
									"sourceName" : "From Codigo",
									"sourceType" : "1"
								}, {
									"sourceName" : "From Sql",
									"sourceType" : "2"
								}]
					}
				}*/, {
					xtype : 'tabpanel',
					height : 550,
					itemId : 'tabCont',
					items : [{
						xtype : 'container',
						title : 'Codigo',
						itemId : 'tabCode',
						// layout : 'anchor',
						layout : {
							type : 'vbox',
							align : 'stretch'// ,
							// padding : 5
						},
						items : [{
							width : widtTab,
							itemId : 'code',
							name : 'code',
							xtype : 'codemirror',
							pathModes : kcPatch.appDir
									+ 'js/design/mzExt/CodeMirror-2.2/mode',
							pathExtensions : kcPatch.appDir
									+ 'js/design/mzExt/CodeMirror-2.2/lib/util',
							labelSeparator : ' ',
							showModes : false,
							// anchor : '100% 100%',
							editorHeight : 100,
							value : "",
							theme : "rubyblue",
							mode : 'text/x-php'
						}, {
							xtype : 'label',
							// forId: 'code',
							// anchor : '100% 100%',
							height : 130,
							// autoScroll : true,
							html : "<div style='height:110;overflow:auto'><b>argumentos que recibe la funcion:</b>$GenPdf,$pdfReg,$reg,$row,$obj <br>"
									+ "<b>$GenPdf</b> : Hace referencia al generador de pdf se puede tocar todo.<br>"
									+ "<b>$pdfReg</b> : Hace referencia al registro principal.<br>"
									+ "<b>$reg</b>    : Hace referencia al registro actual para interactuar con la row<br>"
									+ "<b>$row</b>	 : Es el objeto row espeficicamente aqui se puede tocar todo comportamiento <br>"
									+ "<b>$obj</b>	 : Es un objeto que se crea en el init de la tabla. y puede mantener propiedades, tras las lecturas consecutivas<br>"
									+ "			si lo $obj->a en el init fue puesto en $obj->a=33 aca puedo sumarle uno y retornar ese valor. que es el que se mostrara. <br>"
									+ "<b>Ej.: $a= array(); </b><br>"
									+ " $a[] = array('a1'=>'a1 value');  <br>"
									+ " $a[] = array('a1'=>'a2 value');   <br>"
									+ " return $a;</div>"
						}, {
							title : 'Fields Name from Array',
							xtype : 'grid',
							// anchor : '100% 100%',
							height : 150,
							width : widtTab,
							itemId : 'grdCodeField',
							store : 'st.listFieldArray',
							selModel : {
								selType : 'cellmodel'
							},
							plugins : [me.editingArray],

							dockedItems : [{
								xtype : 'toolbar',
								dock : 'top',
								items : [{
									xtype : 'button',
									iconCls : 'addBtn',
									itemId : 'add',
									handler : Ext.Function.bind(
											me.addParamArray, me)
								}, {
									xtype : 'button',
									iconCls : 'dropBtn',
									itemId : 'drop',
									handler : Ext.Function.bind(
											me.dropParamArray, me)
								}, {
									xtype : 'button',
									iconCls : 'editBtn',
									itemId : 'edit'
								}]
							}],
							// hideHeaders:true,
							columns : [{
										flex : 1,
										dataIndex : 'name',
										text : "Nombre Parametro",
										editor : {
											allowBlank : false
										}
									}, {
										width : 80,
										text : "Valor",
										dataIndex : 'value',
										editor : {
											allowBlank : false
										}
									}, {
										text : "Comentario",
										width : 80,
										dataIndex : 'comentario',
										editor : {
											allowBlank : false
										}
									}]
						}]
					}, {
						xtype : 'container',
						title : 'Sql Define',
						itemId : 'tabSql',
						layout : 'anchor',
						items : [{
							itemId : 'sql',
							width : widtTab,
							name : 'sql',
							xtype : 'codemirror',
							pathModes : kcPatch.appDir
									+ 'js/design/mzExt/CodeMirror-2.2/mode',
							pathExtensions : kcPatch.appDir
									+ 'js/design/mzExt/CodeMirror-2.2/lib/util',
							labelSeparator : ' ',
							showModes : false,
							anchor : '100%',
							editorHeight : 180,
							value : "",
							mode : 'text/x-mysql'
						}, {
							xtype : 'container',
							layout : {
								type : 'hbox',
								align : 'stretch'
							},
							items : [{
								title : 'Lista parametros Sql',
								xtype : 'grid',
								style : {
									"borderStyle" : 'solid',
									"border-width" : 1
								},

								height : 200,
								width : 400,
								itemId : 'sqlParam',
								store : 'st.paramSqlTable',
								selModel : {
									selType : 'cellmodel'
								},
								plugins : [me.editing],

								dockedItems : [{
									xtype : 'toolbar',
									dock : 'top',
									items : [{
										xtype : 'button',
										iconCls : 'addBtn',
										itemId : 'add',
										handler : Ext.Function.bind(
												me.addParam, me)
									}, {
										xtype : 'button',
										iconCls : 'dropBtn',
										itemId : 'drop',
										handler : Ext.Function.bind(
												me.dropParam, me)
									}, {
										xtype : 'button',
										iconCls : 'editBtn',
										itemId : 'edit'
									}, {
										xtype : 'button',
										itemId : 'update'
									}]
								}],
								sortableColumns : false,
								enableColumnMove : false,
								hideCollapseTool : true,
								enableColumnHide : false,
								columns : [{
											flex : 1,
											dataIndex : 'name',
											text : "Nombre Parametro",
											editor : {
												allowBlank : false
											}
										}, {
											width : 60,
											text : "Valor",
											dataIndex : 'value',
											editor : {
												allowBlank : false
											}
										}, {
											text : "Comentario",
											width : 85,
											dataIndex : 'comentario',
											editor : {
												allowBlank : false
											}
										}]
							}, {
								title : 'Lista Fields',
								xtype : 'grid',
								sortableColumns : false,

								style : {
									"borderStyle" : 'solid',
									"border-width" : 1
								},

								height : 200,
								width : 205,
								itemId : 'grdFielSql',
								store : 'st.listFieldTable',
								dockedItems : [{
											xtype : 'toolbar',
											dock : 'top',
											items : [{
														xtype : 'button',
														itemId : 'updateSql',
														iconCls : 'refreshBtn',
														text : "Actualizar Sql"
													}]
										}],
								hideHeaders : true,
								columns : [{
											flex : 1,
											dataIndex : 'nameDisp'
										}]
							}]
						}]
					}]
				}]
		me.callParent(arguments);

	},
	addParamArray : function() {
		var rec = AppDesign.view.design.ParamExtrasTable({
					name : '',
					value : '',
					comentario : ''
				})
		// ------------------------------------------------------------------------------------------
		this.editingArray.cancelEdit();
		this.stParamArray.insert(0, rec)
		// ------------------------------------------------------------------------------------------
		this.editingArray.startEditByPosition({
					row : 0,
					column : 0
				});
	},
	dropParamArray : function() {
		if (this._veoRowSelect(this.grdArray)) {
			alert("si")
		} else {
			alert("Usted no ha seleccionado un parametro para borrar")
		}
	},

	addParam : function() {
		// ------------------------------------------------------------------------------------------
		var rec = AppDesign.view.design.ParamExtrasTable({
					name : '',
					value : '',
					comentario : ''
				})
		// ------------------------------------------------------------------------------------------
		this.editing.cancelEdit();
		this.stParam.insert(0, rec)
		// ------------------------------------------------------------------------------------------
		this.editing.startEditByPosition({
					row : 0,
					column : 0
				});
		// ------------------------------------------------------------------------------------------
	},
	dropParam : function() {
		if (this._veoRowSelect(this.grd)) {
			alert("si")
		} else {
			alert("Usted no ha seleccionado un parametro para borrar")
		}
	},
	afterRender : function() {
		this.callParent(arguments)
		// return true;
		this.getForm().loadRecord({
					data : this.meVal
				})
	},
	_veoRowSelect : function(grd) {
		// var grd = this.grd
		var model;
		try {
			model = grd.getSelectionModel()
		} catch (e) {
			return false;
		}
		/**
		 * @type Array()
		 */
		var records = model.getSelection();
		if (records.length == 0) {
			return false;
		}
		this._recordSelect = records[0]
		return true;
	},
	onAfterInit : function() {
		this.customReadOnly = {
			name : true
		}
		this.store.reader.customExclude = {
			name : true
		}
	}
})