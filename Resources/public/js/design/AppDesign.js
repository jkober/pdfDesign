Ext.namespace('AppDesignBase.AppDesign')
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
Ext.require("Extras.extras");
Ext.require("Extensiones.ExtensionesBasic");
Ext.require("Ext.ux.GroupTabPanel");
//--------------------------------------------------------------------------------------------------
Ext.application({
			name : 'AppDesign',
			appFolder : kcPatch.appDir + 'js/design/app',
			controllers : [
					'design.PdfDesign', 
					'design.PdfAbrir', 
					'design.PdfOpciones',
					'design.PdfTotalField', 
					'design.PdfImagen',
					'design.TableEditSource',
					'design.TableEditSourceCode',
					'design.TableEditSourceCodePrintIf'
					],
			autoCreateViewport : false,
			launch : function() {
				Ext.QuickTips.init();
				kc.widthRelacion.setFonts(kcPatch.fonts)
				delete kcPatch.fonts
				Ext.create('Ext.container.Viewport', {
							layout : 'border',
							rendereTo : Ext.getBody(),
							items : [{
										region	: 'center',
										xtype 	: 'pdfDesign'
									}]
						})
			}
		});
//--------------------------------------------------------------------------------------------------