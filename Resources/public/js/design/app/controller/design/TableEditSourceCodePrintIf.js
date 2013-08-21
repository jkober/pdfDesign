Ext.define('AppDesign.controller.design.TableEditSourceCodePrintIf', {
	//----------------------------------------------------------------------------------------------
	extend		: 'Ext.app.Controller',
	views		: ["AppDesign.view.design.TableEditSourceCodePrintIf"],
	refs		: [{ref: 'form',	selector: 'TableEditSourceCodePrintIf'}],
	//----------------------------------------------------------------------------------------------
	init : function() {
		this.control(
		{
			'TableEditSourceCodePrintIf #guardar'		: {
				click : this.guardar
			},
			'TableEditSourceCodePrintIf #cancelar' 	: {
				click : this.cancelar
			}
		});
	},
	cancelar:function(){
		//------------------------------------------------------------------------------------------
		var form = this.getForm()
		//------------------------------------------------------------------------------------------
		form.ownerCt.close()
		//------------------------------------------------------------------------------------------
	},
	guardar:function(){
		//------------------------------------------------------------------------------------------
		var form		= this.getForm();
		var formVal 	= this.getForm().getValues();
		var meV 		= form.meVal
		//------------------------------------------------------------------------------------------
		meV.name			= formVal.name
		// ojo esto puede romper referencias no usar. 		
		form.mePrope.store.setValue(form.propName,meV) 
		//------------------------------------------------------------------------------------------
		this.cancelar()//---------------------------------------------------------------------------
		//------------------------------------------------------------------------------------------
	}
})
