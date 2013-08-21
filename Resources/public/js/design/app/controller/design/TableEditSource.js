Ext.define('AppDesign.controller.design.TableEditSource', {
	//----------------------------------------------------------------------------------------------
	extend		: 'Ext.app.Controller',
	views		: [ "AppDesign.view.design.TableEditSource" ],
	refs		: [
			    	{ref: 'form',	selector: 'TableEditSource' 				},  
			    	{ref: 'tab',	selector: 'TableEditSource #tabCont' 		},  
			    	
			    	{ref: 'tabSql',	selector: 'TableEditSource #tabSql'		},    	
			    	{ref: 'tabCode',selector: 'TableEditSource #tabCode'		},    	
			    	{ref: 'code',	selector: 'TableEditSource #code'		},
			    	{ref: 'codeF',	selector: 'TableEditSource #grdCodeField'	},
			    	{ref: 'sql',	selector: 'TableEditSource #sql'		},
			    	{ref: 'sqlP',	selector: 'TableEditSource #sqlParam'		}
			  ],
	//----------------------------------------------------------------------------------------------
	init : function() {
		this.control(
		{
			'TableEditSource #guardar'	: {
				click : this.guardar
			},
			'TableEditSource #cancelar' 	: {
				click : this.cancelar
			},
			'TableEditSource #sourceNameS'	: {
				change : this._changTipo
			},
			'TableEditSource #updateSql' : {
				click : this.sqlUpdate
			},
			'TableEditSource '		: {
				afterrender:function() {
					this.getForm().grd = this.getSqlP();
					this.getForm().grdArray = this.getCodeF();
				}
			}
		});
	},
	_changTipo : function(ref, newValueS, oldValue) {
		//--------------------------------------------------------------
		var tab			= this.getTab();
		var code 		= this.getTabCode();
		var sql 		= this.getTabSql();
                var newValue            = newValueS.sourceName;
		//--------------------------------------------------------------
		code.disable(true);
		sql.disable(true);
		//--------------------------------------------------------------
		if (newValue == "1") {
			code.enable(true);
			tab.setActiveTab(0);
		} else {
			sql.enable(true);
			tab.setActiveTab(1);
		}
		//--------------------------------------------------------------
	},
	cancelar:function(){
		//--------------------------------------------------------------
		var form = this.getForm();
		//--------------------------------------------------------------
		form.ownerCt.close();
		kc.pdfStruc.element.tableDraw(form.meVal.refParent);
		//--------------------------------------------------------------
	},
	guardar:function(){
		//--------------------------------------------------------------
		var form		= this.getForm();
		var formVal             = this.getForm().getValues();
		var meV 		= form.meVal;
		//--------------------------------------------------------------
		meV.sql			= formVal.sql;
		meV.code		= formVal.code;
		meV.sourceName          = formVal.sourceName;	
		//--------------------------------------------------------------
		meV.fieldsArray.length	= 0;
		for (var i =0 ;i<form.stParamArray.getCount();i++ ) {
			meV.fieldsArray.push(form.stParamArray.proxy.writer.getRecordData(form.stParamArray.data.getAt(i)));
		}
		//--------------------------------------------------------------
		meV.params.length	= 0;
		for (var i =0 ;i<form.stParam.getCount();i++ ) {
			meV.params.push(form.stParam.proxy.writer.getRecordData(form.stParam.data.getAt(i)));
		}
		//--------------------------------------------------------------
		this.cancelar();//----------------------------------------------
		//--------------------------------------------------------------
	},
	sqlUpdate : function() {
		// -------------------------------------------------------------
		var form	= this.getForm();
		// -------------------------------------------------------------
		var sql		= this.getSql().getValue();
		// -------------------------------------------------------------
		if (Ext.util.Format.trim(sql) == "") {
			alert("Debe insertar una sql antes de Actualizar");
			return true;
		}
		// -------------------------------------------------------------
		//var param	= this.getSqlP();
		// -------------------------------------------------------------
		var arr	= new Array();		
		for (var i =0 ;i<form.stParam.getCount();i++ ) {
			arr.push(form.stParam.proxy.writer.getRecordData(form.stParam.data.getAt(i)));
		}
		// -------------------------------------------------------------
		Ajax.MyAjax.get().setController("sql");
		Ajax.MyAjax.get().setAction("ProcesarSql");
		// -------------------------------------------------------------
		Ajax.MyAjax.get().setJson(Ext.encode({
			ssql : sql,
			extras: arr,
                        bdName: kc.pdfStrucRefActiva.reportExtras.bdName
		}));
		// -------------------------------------------------------------
		var result 	= Ajax.MyAjax.get().getInfo();
		// -------------------------------------------------------------
		form.meVal.fields.length = 0;
		// -------------------------------------------------------------
		for (var i in result.def) {
			form.meVal.fields.push(result.def[i]);
		}
		form.fieldTable.loadData(form.meVal.fields);
		// -------------------------------------------------------------
	}
})