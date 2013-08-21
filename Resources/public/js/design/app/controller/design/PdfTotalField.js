Ext.define('AppDesign.controller.design.PdfTotalField', {
	//----------------------------------------------------------------------------------------------
	extend		: 'Ext.app.Controller',
	views		: ["AppDesign.view.design.PdfTotalField"],
	refs		: [ {    ref: 'win',	selector	: 'pdfTotalField' } ],
	//----------------------------------------------------------------------------------------------
	init : function() {
		this.control({
					'pdfTotalField #guardar' : {
						click : this.guardar
					},
					'pdfTotalField #cancelar' :{
						click : this.cancelar
					}
				});		
	},
	guardar:function(){
		//------------------------------------------------------------------------------------------	
		var win 	= this.getWin();
		var form 	= win.items.getAt(0).getForm();
		var values 	= form.getValues();
		//------------------------------------------------------------------------------------------
		if ( win.action == "edit" ) {		
			if ( win.pdfStruc.TotalFields[values.FieldName] == undefined ) {
				alert("El nombre: " + values.FieldName + "\nNo se ha encontrado para modificar");
				return false;
			}
		}else{
			if ( win.pdfStruc.TotalFields[values.FieldName] != undefined ) {
				alert("El nombre: " + values.FieldName + "\nYa ha sido utilizado");
				return false
			}
		}		
		//------------------------------------------------------------------------------------------	
		values.Type 	= values.TypeRef
		values.TypeObj	= "T"
		//------------------------------------------------------------------------------------------	
		if (values.FieldSummarizeAux ==undefined) {
			values.FieldSummarize 	= ""
			values.FieldSummarizeAux= ""
		}else{
			if ( values.FieldSummarizeAux !="" ) {
				values.FieldSummarize = values.FieldSummarizeAux.substring(0,values.FieldSummarizeAux.length - 4)
				values.FieldSummarize = Ext.String.trim(values.FieldSummarize)
				if ( values.FieldSummarizeAux.substr(values.FieldSummarizeAux.length - 3).indexOf("(t)") > -1 ) {
					values.Type = "T" + values.Type;			
				}				
			}
		}
		if (values.Reset ==undefined) {
			values.Reset ="Nunca"
		}
		//------------------------------------------------------------------------------------------	
		if (win.items.getAt(0).getForm().isValid()) {
			win.pdfStruc.TotalFields[values.FieldName] = values
			var aux = new Array()
			for (var ii in win.pdfStruc.TotalFields) {
				aux.push(win.pdfStruc.TotalFields[ii])
			}
			Ext.getStore("fieldJks").loadData(aux)
		}else{
			alert("Falta completar informacion, revise")
			return false
		}
		//------------------------------------------------------------------------------------------	
		win.close()
		//------------------------------------------------------------------------------------------	
	},
	cancelar:function(){
		this.getWin().close()
		
	}
	//----------------------------------------------------------------------------------------------
})