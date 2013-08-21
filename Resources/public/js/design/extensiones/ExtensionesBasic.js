Ext.namespace("Extensiones.ExtensionesBasic");
// kc.fonts = null;
kc.widthRelacion = new Object()
kc.widthRelacion.date = 20
kc.widthRelacion.datetime = 36
kc.widthRelacion.fontSize = 12;
kc.widthRelacion.fontName = "Arial";
kc.widthRelacion.fonts = null;
kc.widthRelacion.k = 72 / 25.4;
kc.widthRelacion.setFonts = function(fonts) {
	this.fonts = fonts// Ext.decode( fonts)
}
kc.widthRelacion.getWidthString = function(cantZ, name, size, bold, italc,
		underLine, type) {
	var nameFont;
	switch (name) {
		case "Arial" :
			// --------------------------------------------------------------------------------------
			nameFont = "times"
			// --------------------------------------------------------------------------------------
			break;
		case "Courier" :
			// --------------------------------------------------------------------------------------
			nameFont = "courier"
			// --------------------------------------------------------------------------------------
			break;

		default :
			// --------------------------------------------------------------------------------------
			nameFont = "times"
			// --------------------------------------------------------------------------------------
			alert("Retorna el tamaño segun la arial, falta terminar esto")
			break;
	}
	var isnum = false
	var types = "max"
	switch (type) {
		case "num" :
			isnum = true
			break;
		case "date" :
			types = "maxNum"
			/*
			 * if (nameFont != "courier") cantZ = cantZ - 2
			 */
			break;
		case "datetime" :
			types = "maxNum"
			/*
			 * if (nameFont != "courier") cantZ = cantZ - 4
			 */
			break;
	}
	// datetime

	nameFont = nameFont + (bold == true ? "b" : "");
	nameFont = nameFont + (italc == true ? "i" : "");
	if (this.fonts == null) {
		Ajax.MyAjax.get().setController("font");
		Ajax.MyAjax.get().setAction("getFont");
		// -----------------------------------------------------------------------------------------
		Ajax.MyAjax.get().setJson(Ext.encode({
					font : kc.widthRelacion.fontName
				}));
		// -----------------------------------------------------------------------------------------

		var result = Ajax.MyAjax.get().getInfo();
		if (result == null) {
			alert("No hay definicion de fuentes")
			return false;
		}
		if (result.def == undefined) {
			alert("No hay definicion de fuentes")
			return false;
		}
		if (result.def == null) {
			alert("No hay definicion de fuentes")
			return false;
		}
		if (result.def == "[]") {
			alert("No hay definicion de fuentes")
			return false;
		}
		this.fonts = Ext.decode(result.def)
		// kc.widthRelacion.fonts = Ext.decode( result.def)
		// kc.widthRelacion.fonts = result.def
	}
	// ---------------------------------------------------------------------------------------------
	var font = this.fonts[nameFont]
	var longi = parseInt(font[types]) * cantZ;
	// ---------------------------------------------------------------------------------------------
	var aux = longi * (parseInt(size) / this.k) / 1000;
	var aux1 = Math.round(aux)
	// ---------------------------------------------------------------------------------------------
	if (aux1 > aux) {
		return aux1;
	} else {
		if (aux > aux1) {
			return aux1 + 1;
		}
		return aux;
	}
	// ---------------------------------------------------------------------------------------------
}
var tableHlist = Ext.create('Ext.data.Store', {
			storeId : 'st.listColum',
			fields : ['name', "dat"],
			data : []
		});
Ext.define('kc.HeadRow', {
			extend : 'Ext.form.field.Picker',
			requires : ["AppDesign.view.design.TableEditHeadRow"],
			expand : function() {
				var me = this, picker = me.getPicker();
			},
			matchFieldWidth : false,
			multiSelect : true,
			focusOnToFront : false,
			meVal : null,
			createPicker : function() {
				var me = this
				Ext.create("Ext.window.Window", {
							modal : true,
							closable : false,
							title : me.values,
							items : [{
										xtype : 'TableEditHeadRow',
										pickerField : me,
										headTable : me.headTable,
										footTable : me.footTable,
										meVal : me.meVal
									}]
						}).show()
				return false;
			},
			setValue : function(value) {
				var me = this;
				if (value != undefined) {
					if (Ext.isObject(value)) {
						if (value.items != undefined) {
							me.meVal = value
						}
					}
				}
				var values = this.values
				me.setRawValue(me.valueToRaw(values));
				return me.mixins.field.setValue.call(me, values);
			}
		});
Ext.define('kc.SourceCode', {
			extend : 'Ext.form.field.Picker',
			requires : ["AppDesign.view.design.TableEditSourceCode"],
			expand : function() {
				var me = this, picker = me.getPicker();
			},
			matchFieldWidth : false,
			multiSelect : true,
			focusOnToFront : false,
			meVal : null,
			createPicker : function() {
				var me = this
				Ext.create("Ext.window.Window", {
							modal : true,
							closable : false,
							title : me.values,
							items : [{
										xtype : 'TableEditSourceCode',
										pickerField : me,
										mePrope : me.mePrope,
										meVal : me.meVal
									}]
						}).show()
				return false;
			},
			setValue : function(value) {
				var me = this;
				if (value != undefined) {
					if (Ext.isObject(value)) {
						if (value.name != undefined) {
							me.meVal = value
						}
					}
				}
				var values = this.values
				me.setRawValue(me.valueToRaw(values));
				return me.mixins.field.setValue.call(me, values);
			}
		});
Ext.define('kc.SourceCodePrintIf', {
			extend : 'Ext.form.field.Picker',
			requires : ["AppDesign.view.design.TableEditSourceCodePrintIf"],
			expand : function() {
				var me = this, picker = me.getPicker();
			},
			matchFieldWidth : false,
			multiSelect : true,
			focusOnToFront : false,
			meVal : null,
			createPicker : function() {
				var me = this
				Ext.create("Ext.window.Window", {
							modal : true,
							closable : false,
							title : me.values,
							items : [{
										xtype : 'TableEditSourceCodePrintIf',
										pickerField : me,
										propName : me.propName,
										mePrope : me.mePrope,
										meVal : me.meVal
									}]
						}).show()
				return false;
			},
			setValue : function(value) {
				var me = this;
				if (value != undefined) {
					if (Ext.isObject(value)) {
						if (value.name != undefined) {
							me.meVal = value
						}
					}
				}
				var values = this.values
				me.setRawValue(me.valueToRaw(values));
				return me.mixins.field.setValue.call(me, values);
			}
		})

// --------------------------------------------------------------------------------------------------
Ext.create('Ext.data.Store', {
			storeId : 'st.tableField',
			fields : ['name', "extra", "nameDisp"],
			data : []
		});
Ext.define('kc.SourceName', {
			extend : "Ext.form.field.ComboBox",
			displayField : 'nameDisp',
			valueField : 'extra',
			forceSelection : true,
			store : "st.tableField",
			queryMode : 'local',
			listConfig : {
				getInnerTpl : function() {
					return '<div data-qtip="{name}" ">{nameDisp}</div>';
				}
			}
		})
Ext.define('kc.TableSource', {
			extend : 'Ext.form.field.Picker',
			expand : function() {
				var me = this, picker = me.getPicker();
			},
			matchFieldWidth : false,
			multiSelect : true,
			focusOnToFront : false,
			meVal : null,
			createPicker : function() {
				var me = this
				if (me.meVal.code == null) {
					me.meVal.code = ""
				}
				if (me.meVal.sql == null) {
					me.meVal.sql = ""
				}
				var win = Ext.create("Ext.window.Window", {
							modal : true,
							closable : false,
							items : [{
										xtype : 'TableEditSource',
										pickerField : me,
										meVal : me.meVal
									}]
						}).show()
				return false;
			},
			setValue : function(value) {
				var me = this;
				if (value != undefined) {
					if (Ext.isObject(value)) {
						if (value.sourceName != undefined) {
							me.meVal = value
						}
					}
				}
				var values = this.values
				me.setRawValue(me.valueToRaw(values));
				return me.mixins.field.setValue.call(me, values);
			}
		});
Ext._myClone = function(item) {
	if (item === null || item === undefined) {
		return item;
	}
	if (item.nodeType && item.cloneNode) {
		return item.cloneNode(true);
	}
	var type = toString.call(item);
	if (type === '[object Date]') {
		return new Date(item.getTime());
	}
	var i, j, k, clone, key;
	if (type === '[object Array]') {
		i = item.length;
		clone = [];
		while (i--) {
			clone[i] = this._myClone(item[i]);
		}
	} else if (type === '[object Object]' && item.constructor === Object) {
		clone = {};
		for (key in item) {
			if (key != "refView" && key != "refParent")
				clone[key] = this._myClone(item[key]);
			else
				clone[key] = null;
		}
	}
	return clone || item;
}

Ext._myClone2 = function(obj) {
	var s = {};
	for (var i in obj) {
		if (i != "refParent" && i != "refView") {
			s[i] = obj[i];
		}
	}
	return Ext.clone(s);
},
Ext.define('Ext.form.field.comboPageType', {
			extend : "Ext.form.field.ComboBox",
			alias : "widget.comboPageType",
			displayField : 'name',
			valueField : 'name',
			forceSelection : true,
			store : "statesjkPageType",
			queryMode : 'local'
		})
Ext.form.field.comboPageType.override({
			setValue : function(a, b) {
				if (a != undefined) {
					if (a.name != undefined) {
						arguments[0] = a.name
						return this.callOverridden(arguments)
					} else {
						return this.callOverridden(arguments)
					}
				} else {
					return this.callOverridden(arguments)
				}
			}
		})
// --------------------------------------------------------------------------------------------------
Ext.define('Ext.form.field.comboPageOrienta', {
			extend : "Ext.form.field.ComboBox",
			alias : "widget.comboPageOrienta",
			displayField : 'name',
			valueField : 'value',
			forceSelection : true,
			store : "statesjkPageOrienta",
			queryMode : 'local'
		})
// --------------------------------------------------------------------------------------------------
Ext.define('Ext.form.field.ComboBoxFontAlign', {
			extend : "Ext.form.field.ComboBox",
			alias : "widget.ComboBoxFontAlign",
			displayField : 'fN',
			valueField : 'fN',
			forceSelection : true,
			store : "statesjkFontAlign",
			queryMode : 'local',
			listConfig : {
				getInnerTpl : function() {
					return '<div data-qtip="{fN} " >{fN}</div>';
				}
			}
		});
// --------------------------------------------------------------------------------------------------
Ext.define('Ext.form.field.ComboBoxMask', {
			extend : "Ext.form.field.ComboBox",
			displayField : 'fNd',
			valueField : 'fN',
			forceSelection : true,
			store : "statesjkMask",
			queryMode : 'local',
			listConfig : {
				getInnerTpl : function() {
					return '<div data-qtip="{fN} " >{fNd}</div>';
				}
			}
		});
// --------------------------------------------------------------------------------------------------
Ext.define('Ext.form.field.ComboBoxFont', {
			extend : "Ext.form.field.ComboBox",
			alias : "widget.ComboBoxFont",
			displayField : 'fN',
			valueField : 'fN',
			forceSelection : true,
			store : "statesjkFont",
			queryMode : 'local',
			listConfig : {
				getInnerTpl : function() {
					return '<div data-qtip="{fN} " >{fN}</div>';
				}
			}
		})
// --------------------------------------------------------------------------------------------------
Ext.define('Ext.form.field.ComboBoxColor', {
	extend : "Ext.form.field.ComboBox",
	alias : "widget.ComboBoxColor",
	displayField : 'cN',
	forceSelection : true,
	listeners : {
		beforeselect : function(element, record) {
			element.setFieldStyle("background:" + record.get("cN"))
		}
	},
	valueField : 'cN',
	store : "statesjk",
	queryMode : 'local',
	listConfig : {
		getInnerTpl : function() {
			return '<div data-qtip="{cN} rgb:{c.R},{c.G},{c.B}" style="background:{cN}">{cN}</div>';
		}
	}
})
// --------------------------------------------------------------------------------------------------
Ext.form.field.ComboBoxColor.override({
			setValue : function(a, b) {
				if (a != undefined) {
					if (a.cN != undefined) {
						arguments[0] = a.cN
						return this.callOverridden(arguments)
					} else {
						return this.callOverridden(arguments)
					}
				} else {
					return this.callOverridden(arguments)
				}
			}
		})
// --------------------------------------------------------------------------------------------------
Ext.define('Ext.form.field.ComboBoxDataSource', {
			extend : "Ext.form.field.ComboBox",
			displayField : 'nameDisp',
			// selectOnFocus : true,
			forceSelection : true,
			valueField : 'extra',
			store : "fieldJk",
			queryMode : 'local',
			listConfig : {
				getInnerTpl : function() {
					return '<div data-qtip="{name}" ">{nameDisp}</div>';
				}
			}
		})
// --------------------------------------------------------------------------------------------------
Ext.define("Ext.form.field.ComboBoxBorder", {
			extend : "Ext.form.field.ComboBox",
			alias : "widget.ComboBoxBorder",
			displayField : 'name',
			valueField : 'name',
			multiSelect : true,
			forceSelection : true,
			store : "statesjkBorder",
			queryMode : 'local'
		});
Ext.form.field.ComboBoxBorder.override({
			setValue : function(a, b) {
				if (a != undefined) {
					if (a.value != undefined) {
						arguments[0] = a.value
						return this.callOverridden(arguments)
					} else {
						return this.callOverridden(arguments)
					}
				} else {
					return this.callOverridden(arguments)
				}
			}
		});
// --------------------------------------------------------------------------------------------------
Ext.define("Ext.form.field.ComboBoxRotacion", {
			extend : "Ext.form.field.ComboBox",
			alias : "widget.ComboBoxRotacion",
			displayField : 'name',
			valueField : 'name',
			multiSelect : false,
			forceSelection : true,
			store : "statesjkRotacion",
			queryMode : 'local'
		});
Ext.form.field.ComboBoxRotacion.override({
			setValue : function(a, b) {
				if (a != undefined) {
					if (a.value != undefined) {
						arguments[0] = a.value
						return this.callOverridden(arguments)
					} else {
						return this.callOverridden(arguments)
					}
				} else {
					return this.callOverridden(arguments)
				}
			}
		});
// --------------------------------------------------------------------------------------------------
Ext.define('Ext.form.field.NumberPostition', {
			extend : 'Ext.form.field.Number',
			xtype : 'NumberPostition',
			decimalPrecision : 1,
			decimalSeparator : '.',
			step : 1 / 10,
			minValue : 0
		});
// --------------------------------------------------------------------------------------------------
Ext.define('Ext.form.field.DisplayTypeO', {
			extend : 'Ext.form.field.Display',
			getValue : function() {
				var me = this
				var val
				switch (me.getRawValue()) {
					case "Label" :
						val = "L"
						break;
				}
				val = me.rawToValue(me.processRawValue(val));
				me.value = val;
				return val;
			},
			setValue : function(value) {
				var values = "Nada"
				switch (value) {
					case "L" :
						values = "Label"
						break;
				}
				var me = this;
				me.setRawValue(me.valueToRaw(values));
				return me.mixins.field.setValue.call(me, values);
			}
		});
// --------------------------------------------------------------------------------------------------
