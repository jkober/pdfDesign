Ext.define('AppDesign.controller.design.TableEditSourceCode', {
	//----------------------------------------------------------------------------------------------
	extend		: 'Ext.app.Controller',
	views		: ["AppDesign.view.design.TableEditSourceCode"],
	refs		: [ {ref: 'form',	selector: 'TableEditSourceCode' } ],
	//----------------------------------------------------------------------------------------------
	init : function() {
		this.control(
		{
			'TableEditSourceCode #guardar'		: {
				click : this.guardar
			},
			'TableEditSourceCode #cancelar' 	: {
				click : this.cancelar
			}
		});
	},
	cancelar:function(){
		//------------------------------------------------------------------------------------------
		var form = this.getForm()
		//------------------------------------------------------------------------------------------
		form.ownerCt.close()
		kc.pdfStruc.element.tableDraw(form.meVal.refParent)
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
		form.mePrope.store.setValue("SourceCode",meV) 
		//------------------------------------------------------------------------------------------
		this.cancelar()//---------------------------------------------------------------------------
		//------------------------------------------------------------------------------------------
	}
})