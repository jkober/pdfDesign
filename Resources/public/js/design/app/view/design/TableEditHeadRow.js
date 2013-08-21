Ext.define('AppDesign.view.design.TableEditHeadRow', {
	extend : 'Ext.form.Panel',
	alias : "widget.TableEditHeadRow",
	bodyPadding : 5,
	width : 420,
	height : 400,
	layout : {
		type : 'hbox',
		align : 'stretch',
		padding : 5
	},
	getIte : function() {
		var lista1 = new Array()
		var ob
		for (var i in this.meVal.items) {
			ob = this.meVal.items[i]
			lista1.push({
						name : ob.name,
						dat : ob
					})
		}
		this.stTo.loadData(lista1)
	},
	close : function() {
		this.ownerCt.close()
		kc.pdfStruc.element.tableDraw(this.meVal.refParent)
	},
	save : function() {
		this.close()
	},
	initComponent : function() {
		// ------------------------------------------------------------------------------------------
		var me = this
		// ------------------------------------------------------------------------------------------
		this.stTo = Ext.getStore("st.listColum");
		// ------------------------------------------------------------------------------------------
		this.getIte()
		// ------------------------------------------------------------------------------------------
		var stTo = Ext.getStore("st.tableField");
		var arr = new Array()

		if (me.meVal.refParent.Sources.sourceName == "2") {
			stTo.loadData(me.meVal.refParent.Sources.fields)
			/*
			 * for (var ii in me.meVal.refParent.Sources.fields){ var val =
			 * me.meVal.refParent.Sources.fields[ii] arr.push(val) }
			 */
		} else {
			for (var ii in me.meVal.refParent.Sources.fieldsArray) {
				var val = me.meVal.refParent.Sources.fieldsArray[ii]
				arr.push({
							name : val.name,
							nameDisp : val.name,
							extra : {
								name : val.name,
								nameDisp : val.name
							}
						})
			}
			stTo.loadData(arr)

		}
		// ------------------------------------------------------------------------------------------
		// ------------------------------------------------------------------------------------------
		me.buttons = [{
					text : "volver",
					handler : Ext.Function.bind(me.save, me)
				}]
		// ------------------------------------------------------------------------------------------
		me.items = [{
			xtype : 'grid',
			style : {
				"borderStyle" : 'solid',
				"border-width" : 1
			},
			// region : 'center',
			height : 350,
			width : 100,
			listeners : {
				scope : me,
				select : function(rowModel, record, rowId) {
					this.prop.setRefe(record.data.dat)
					this.prop.setSource(record.data.dat);
				}
			},
			dockedItems : [{
						xtype : 'toolbar',
						dock : 'bottom',
						items : [{
									xtype : 'button',
									iconCls : 'addBtn',
									itemId : 'add',
									handler : Ext.Function
											.bind(me.addTable, me)
								}, {
									xtype : 'button',
									iconCls : 'dropBtn',
									itemId : 'drop',
									handler : Ext.Function.bind(me.dropTable,
											me)
								}]
					}],
			// hideHeaders: true,
			store : 'st.listColum',
			columns : [{
						text : "Column",
						flex : 1,
						sortable : false,
						dataIndex : 'name'

					}]
		}, {
			xtype : 'gridPro',
			style : {
				"borderStyle" : 'solid',
				"border-width" : 1
			},
			width : 300,
			flex : 1,
			height : 350,
			helpPanelOculto : true,
			conboSelect : false,
			source : [],
			setRefe : function(ref) {
				this.ref = ref;
			},
			setInObjectHtml : false,
			setValProp : function(name, value) {
				if (value != undefined)
					this.ref[name] = value
			},
			getValProp : function(name) {
				return this.ref[name]
			},
			onAfterInit : function() {
				this.customReadOnly.name = true
				this.customExclude = {
					refView : true,
					refParent : true,
					TabletCount : true
				}
			}
		}]
		me.callParent(arguments);
		me.prop = me.items.getAt(1);
	},
	addTableHead : function() {
		if (confirm("Desea Agregar una columna nueva")) {
			this.addcol()
		} else {
			return false
		}
	},
	addcol : function() {
		// ----------------------------------------------------------------------------------
		this.meVal.refParent.TabletCount++
		// ----------------------------------------------------------------------------------
		var i = this.meVal.refParent.TabletCount;
		// ----------------------------------------------------------------------------------
		this.meVal.refParent.TableHead.items[i] = Ext
				.clone(kc.pdfStruc.TableRowH);
		this.meVal.refParent.TableHead.refParent = this.meVal.refParent
		this.meVal.refParent.TableHead.items[i].name = "col" + i
		this.meVal.refParent.TableHead.items[i].Title = "col" + i
		// ----------------------------------------------------------------------------------
		this.meVal.refParent.TableRow.items[i] = Ext
				.clone(kc.pdfStruc.TableRow);
		this.meVal.refParent.TableRow.refParent = this.meVal.refParent
		this.meVal.refParent.TableRow.items[i].name = "rowDef" + i
		// ----------------------------------------------------------------------------------
		this.meVal.refParent.TableRow.items[i].SourceName.refParent = this.meVal.refParent
		this.meVal.refParent.TableRow.items[i].SourceCode.refParent = this.meVal.refParent
		// ----------------------------------------------------------------------------------
		this.getIte()
		// ----------------------------------------------------------------------------------
	},
	addcolFoot : function() {
		this.meVal.refParent.TabletFCount++
		var i = this.meVal.refParent.TabletFCount;
		// ----------------------------------------------------------------------------------
		this.meVal.refParent.TableFoot.items[i] = Ext
				.clone(kc.pdfStruc.TableRowF);
		this.meVal.refParent.TableFoot.refParent = this.meVal.refParent
		this.meVal.refParent.TableFoot.items[i].name = "footer " + i
		this.getIte()

	},
	addFooter : function() {
		if (confirm("Desea agregar una nueva columna al footer")) {
			this.addcolFoot()
		}
		return false;

	},
	addTableRow : function() {
		if (confirm("Desea agregar una Columna nueva, para luego editar las propiedades de la FILA")) {
			this.addcol()
		}
		return false;
	},
	_recordSelect : null,
	_veoRowSelect : function() {
		var grd = this.items.getAt(0)
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
	addTable : function() {
		if (this.headTable == true) {
			this.addTableHead()
		} else {
			if (this.footTable == true) {
				this.addFooter()
			} else {
				this.addTableRow()
			}
		}
	},
	dropTable : function() {
		alert("drop ")
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