Ext.define('AppDesign.controller.design.PdfOpciones', {
	requires	: ["kc.pdfStruc.Struct"],
	//----------------------------------------------------------------------------------------------
	extend		: 'Ext.app.Controller',
	views		:   ["AppDesign.view.design.PdfOpciones"],
	refs: [
    	{    ref: 'win',	selector	: 'pdfOpciones' },
    	{	 ref: 'grid',	selector	:'#gridExtras'	}
	],
	//----------------------------------------------------------------------------------------------
	init : function() {
		this.control({
					'pdfOpciones ' : {
						afterrender : this.extra
					},
					'pdfOpciones #guardar' : {
						click : this.guardar
					},
					'pdfOpciones #cancelar' : {
						click : this.cancelar
					}
		            					
				});		
	},
	extra:function(){
		//------------------------------------------------------------------------------------------
		var win		= this.getWin()
		var form	= win.items.getAt(0).getForm()
		//------------------------------------------------------------------------------------------
		form.isValid()
		//------------------------------------------------------------------------------------------
		win.storeRef= Ext.getStore("storeParamExtras");
		win.storeRef.loadData(win.pdfStruc.reportExtras.param);
		//------------------------------------------------------------------------------------------
		form.loadRecord({
					data : win.pdfStruc
				})		
		form.loadRecord({
					data : win.pdfStruc.reportExtras.configDefault
				})		
		form.loadRecord({
					data : {
						bdName: win.pdfStruc.reportExtras.bdName
					}
				})		
		//------------------------------------------------------------------------------------------
	},
	_setMargins:function(ref,div){
		//------------------------------------------------------------------------------------------
		var width;
		//------------------------------------------------------------------------------------------
		if (ref.PageOrienta == "P") {
			width = ref.PageType.width - ref.MarginLeft - ref.MarginRight	
		}else{
			width = ref.PageType.height - ref.MarginLeft - ref.MarginRight
		}
		div.style.setProperty("width"	, width+"mm", null)
	},	
	guardar:function(){
		var win 	= this.getWin();
		var form 	= win.items.getAt(0).getForm();
		var values 	= form.getValues();
		var grid 	= this.getGrid();
		win.pdfStruc.reportExtras.param = new Array();
		for (var i = 0 ;i<grid.store.data.getCount();i++ ) {
			win.pdfStruc.reportExtras.param.push(grid.store.proxy.writer.getRecordData(grid.store.data.getAt(i)))
		}
		if ( values.wherecondicional == undefined ){
            win.pdfStruc.wherecondicional 		= win.items.getAt(0).items.getAt(0).items.getAt(3).items.getAt(1).value;
		}else {
            win.pdfStruc.wherecondicional 		= values.wherecondicional;
        }
		if ( values.post_read == undefined ){
			win.pdfStruc.post_read 		= win.items.getAt(0).items.getAt(0).items.getAt(4).items.getAt(1).value;
		}else {
			win.pdfStruc.post_read 		= values.post_read;
		}
		if ( values.field_json == undefined ){
			win.pdfStruc.field_json 		= win.items.getAt(0).items.getAt(0).items.getAt(5).items.getAt(1).value;
		}else {
			win.pdfStruc.field_json 		= values.field_json;
		}

		win.pdfStruc.reportExtras.bdName= values.bdName;
		win.pdfStruc.MarginBottom 		= values.MarginBottom;
		win.pdfStruc.MarginTop 			= values.MarginTop;
		win.pdfStruc.MarginLeft 		= values.MarginLeft;
		win.pdfStruc.MarginRight 		= values.MarginRight;
		win.pdfStruc.PageOrienta		= values.PageOrienta;
		win.pdfStruc.PageType			= kc.pdfStruc.pageType[values.PageType].type;
		//------------------------------------------------------------------------------------------		
		if ( kc.pdfStrucRefActiva.reportExtras.configDefault == undefined ) {
			kc.pdfStrucRefActiva.reportExtras.configDefault = Ext.clone( kc.pdfStruc.PdfPage.reportExtras.configDefault );
		}
		var ite;
		for (var i in kc.pdfStrucRefActiva.reportExtras.configDefault) {
			if (values[i] != undefined) {
				switch(i)
				{
					case "BorderType":
						var aux 			= kc.pdfStrucRefActiva.reportExtras.configDefault[i];
						aux.type 			= ""
						aux.value.length	= 0;
						for (var ii in values[i]) {
							aux.type  = aux.type + values[i][ii].substring(0,1)
							aux.value.push(values[i][ii])
						}
						break;
					case "FontColor":
						kc.pdfStrucRefActiva.reportExtras.configDefault[i] = kc.pdfStruc.colorNamesSk[values[i]];
						break;
					default:
						kc.pdfStrucRefActiva.reportExtras.configDefault[i] = values[i];
						break;
				}
			}
		}
		let field=[];
		if ( win.pdfStruc.reportExtras.field != "") {
			if (typeof win.pdfStruc.reportExtras.field == "object") {
				field = JSON.parse(JSON.stringify( win.pdfStruc.reportExtras.field));
			}
		}
		if (typeof win.pdfStruc.field_json == "string") {
			try {
				if ( win.pdfStruc.field_json.trim()!="") {
					let xx_f = JSON.parse("[" + win.pdfStruc.field_json + "]");
					let o,a;
					for (let i=0 ;i<xx_f.length ;i++){
						o=xx_f[i];
						try {
							a 			= {};
							a.name 		= o[0];
							a.nameDisp 	= o[1];
							a.extra = {"nameDisp": o[1], "name": o[0],"ff": o[3],"maxLength":o[2]};
							field.push(a);
						}catch (e) {
							alert("errores al procesar el campo :" + i )
						}
					}
				}
			}catch (e) {
				alert("errores al procesar los field extras")
			}
		}
		let st=Ext.getStore("fieldJk");
		st.loadData(field);
		kc.pdfStruc.loadStruc(kc.pdfStrucRefActiva.reportExtras.configDefault);
		//------------------------------------------------------------------------------------------		
		this._setMargins(win.pdfStruc,win.pdfStruc.refView[0]);
		//------------------------------------------------------------------------------------------

		win.close()
		//------------------------------------------------------------------------------------------		
	},
	cancelar:function(){
		this.getWin().close()		
	}
	//----------------------------------------------------------------------------------------------
})