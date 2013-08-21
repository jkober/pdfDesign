Ext.define('AppDesign.controller.design.PdfImagen', {
	// ---------------------------------------------------------------------------------------------
	extend	: 'Ext.app.Controller',
	views	: ["AppDesign.view.design.PdfImagen"],
	refs 	: [{ ref : 'win',		selector : 'pdfImagen'	}],
	// ---------------------------------------------------------------------------------------------
	init : function() {
		this.control({
					'pdfImagen #seleccionar' : {
						click : this.seleccionar
					},
					'pdfImagen #cancelar' : {
						click : this.cancelar
					},
					'pdfImagen grid' : {
						dbclick : this.seleccionar
					}
				});
	},
	seleccionar : function() {
		// -----------------------------------------------------------------------------------------
		var win = this.getWin();
		var aux = win._extras
		// -----------------------------------------------------------------------------------------
		if (win.lastData != null) {
			aux.fileName 		= win.lastData.fileName
			aux.TypeImagen 		= win.lastData.TypeImagen
			aux.PositionWidth 	= win.lastData.width
			aux.PositionHeight	=  win.lastData.height
			kc.pdfStruc.element.add(aux)
		}
		// -----------------------------------------------------------------------------------------
		win.close()
		// -----------------------------------------------------------------------------------------
	},
	cancelar : function() {
		// -----------------------------------------------------------------------------------------
		this.getWin().close()
		// -----------------------------------------------------------------------------------------
	}
})