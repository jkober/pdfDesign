Ext.define('AppDesign.view.design.TableEditSourceCodePrintIf', {
	extend : 'Ext.form.Panel',
	alias : "widget.TableEditSourceCodePrintIf",
	bodyPadding : 5,
	width : 620,
	height : 400,
	title: "Editar codigo de Ejecucion para llenar celda",
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
		var me 				= this;
		// ------------------------------------------------------------------------------------------
		widtTab 		= 500;
		// ------------------------------------------------------------------------------------------
		me.items = 
				[{
					width			: widtTab,
					itemId			: 'code',
					name			: 'name',
					xtype			: 'codemirror',
						pathModes : kcPatch.appDir + 'js/design/mzExt/CodeMirror-2.2/mode',
						pathExtensions : kcPatch.appDir + 'js/design/mzExt/CodeMirror-2.2/lib/util',
					
					labelSeparator	: ' ',
					showModes		: false,
					anchor			: '100%',
					editorHeight	: 180,
					value			: "",
					theme			: "rubyblue",
					mode			: 'text/x-php'
				},{
			        xtype: 'label',
			        forId: 'code',
			        //text: 'Parametros que Recibe PDFGen, source.\n Siempre debe retornar un valor la función, Ej.: return $sorce["micampo"]."hola"; "',
			        html:"<b>argumentos que recibe la funcion:</b>$GenPdf,$pdfReg,$reg,$row,$obj <br>" +
			        		"<b>$GenPdf</b> : Hace referencia al generador de pdf se puede tocar todo.<br>" +
			        		"<b>$pdfReg</b> : Hace referencia al registro principal.<br>" +
			        		"<b>$reg</b>    : Hace referencia al registro actual para interactuar con la row<br>" +
			        		"<b>$row</b>	 : Es el objeto row espeficicamente aqui se puede tocar todo comportamiento <br>" +
			        		"<b>$obj</b>	 : Es un objeto que se crea en el init de la tabla. y puede mantener propiedades, tras las lecturas consecutivas<br>" +
			        		"			si lo $obj->a en el init fue puesto en $obj->a=33 aca puedo sumarle uno y retornar ese valor. que es el que se mostrara.",
			        margin: '0 0 0 10'
			    }
				]
		me.callParent(arguments);
		this.getForm().loadRecord({
			data : this.meVal
		})
	}
})
