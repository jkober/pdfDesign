Ext.define("AppDesign.controller.design.event.PageEvent", {
	requires : ["AppDesign.view.design.SetGroupBy",
			"AppDesign.view.menu.MenuSection",
			"AppDesign.view.menu.MenuElement"],
	/**
	 * @type kc.pdfStruc.PdfPage
	 */
	// ----------------------------------------------------------------------------------------------
	pdfStruc : null,
	gridProRef : null,
	pageRef : null,
	// ----------------------------------------------------------------------------------------------
	afterResize : function(a, b, c) {
		this.pdfRef.my.Height = kc.pdfStruc.toMm(this.pdfRef.my.refView
				.height())
	},
	reporteUpdateBase : function(obj, newValue) {
		kc.pdfStrucRefActiva.reportExtras.bdName = newValue
	},
        zoomRef:100,
        setZoomValue:function(obj,newValue){
            var aux = jQuery(this.pdfStruc.refView)
            this.zoomRef = newValue
            aux.css("zoom",this.zoomRef + "%")
//            this.getZoom().setText("Zoom " + this.zoomRef + "%" )
            
        },
        
	pageSqlUpdate : function(e) {
		// -------------------------------------------------------------
		var sql     = this.getSql().getValue();
        var wherecondicional = "";
		if (this.pdfStruc.wherecondicional != undefined ) {
            wherecondicional = this.pdfStruc.wherecondicional;
		}
		var field_json = "";
		if (this.pdfStruc.field_json != undefined ) {
			field_json = this.pdfStruc.field_json;
		}
		var extras  = this.pdfStruc.reportExtras.param;
		// -------------------------------------------------------------
		if (Ext.util.Format.trim(sql) == "") {
			alert("Debe insertar una sql antes de enviarla");
			return true;
		}
		// -------------------------------------------------------------
		Ajax.MyAjax.get().setController("sql");
		Ajax.MyAjax.get().setAction("ProcesarSql");
		// -------------------------------------------------------------
		Ajax.MyAjax.get().setJson(Ext.encode({
					ssql : sql,
					where: wherecondicional,
					extras : extras,
					field_json: field_json,
					bdName : this.pdfStruc.reportExtras.bdName
				}));
		// -------------------------------------------------------------
		var result = Ajax.MyAjax.get().getInfo();
		// -------------------------------------------------------------
                if (result.success == undefined){
                    alert("error al procesar la Informacion")
                    return false;
                }
                if (result.success ==false){
                    alert("error al procesar la Informacion")
                    return false;
                }
                if (result.data==undefined){
                    alert("error al procesar la Informacion")
                    return false;
                }
                if (result.data.success==false){
                    alert("Error:\n" + result.data.error)
                    return false;
                }
		// -------------------------------------------------------------
		this.pdfStruc.reportExtras.sql      = sql;
		this.pdfStruc.reportExtras.field    = result.data.def;
		//let field = result.data.def;
		let field=kc.estructuro_field_json(result.data.def,this.pdfStruc.field_json);
/*		let field = JSON.parse(JSON.stringify( result.data.def ));

		if (typeof this.pdfStruc.field_json == "string") {
			try {
				if ( this.pdfStruc.field_json.trim()!="") {
					let xx_f = JSON.parse("[" + this.pdfStruc.field_json + "]");
					let o,a;
					for (let i=0 ;i<xx_f.length ;i++){
						o=xx_f[i];
						try {
							a={};
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
*/
		this.storeField.loadData(field);
		// -------------------------------------------------------------
	},
	pageAfterRender : function(me) {
		// -------------------------------------------------------------
		/** @type kc.pdfStruc.PdfPage */
		// -------------------------------------------------------------
		this.gridProRef                                 = Ext.getCmp("gridPro");
                var codemirror = this.getSql().getToolbar();
                codemirror.add({xtype:"button",text:"Validar Sql", tooltip:"Validar Sql, y generar lista de field",visible:true,itemId:'procesarSql'})
                codemirror.setWidth(400);
		//--------------------------------------------------------------
		this.pdfStruc                                   = Ext.clone(kc.pdfStruc.PdfPage);
		kc.pdfStrucRefActiva                            = this.pdfStruc;
		// -------------------------------------------------------------
		this.pdfStruc.Group.refParent                   = this.pdfStruc;
		this.pdfStruc.Group.Header.refParent            = this.pdfStruc.Group;
		this.pdfStruc.Group.Body.refParent              = this.pdfStruc.Group;
		this.pdfStruc.Group.Footer.refParent            = this.pdfStruc.Group;
		this.pdfStruc.Group.groupId                     = ++this.pdfStruc.reportExtras.idGroups;
		this.pdfStruc.Group.Header.Items[0]             = Ext.clone(kc.pdfStruc.PdfHead);
		this.pdfStruc.Group.Header.Items[0].BackGround  = Ext
				.clone(kc.pdfStruc.colorSection.head);
		this.pdfStruc.Group.Header.Items[0].refParent   = this.pdfStruc.Group;
		this.pdfStruc.Group.Header.Items[0].idSections  = ++this.pdfStruc.reportExtras.idSections;
		// -------------------------------------------------------------
		this.pdfStruc.Group.Body.Items[0]               = Ext.clone(kc.pdfStruc.PdfBody);
		this.pdfStruc.Group.Body.Items[0].BackGround    = Ext
				.clone(kc.pdfStruc.colorSection.body);
		this.pdfStruc.Group.Body.Items[0].refParent     = this.pdfStruc.Group;
		this.pdfStruc.Group.Body.Items[0].idSections    = ++this.pdfStruc.reportExtras.idSections;
		// -------------------------------------------------------------
		this.pdfStruc.Group.Footer.Items[0]             = Ext.clone(kc.pdfStruc.PdfFooter);
		this.pdfStruc.Group.Footer.Items[0].BackGround  = Ext
				.clone(kc.pdfStruc.colorSection.footer);
		this.pdfStruc.Group.Footer.Items[0].refParent   = this.pdfStruc.Group;
		this.pdfStruc.Group.Footer.Items[0].idSections  = ++this.pdfStruc.reportExtras.idSections;
		// -------------------------------------------------------------
		this.addRefDocument();
		// -------------------------------------------------------------
		if (kc.pdfStruc.contextuales == undefined) {
			kc.pdfStruc.contextuales = new Object()
		}
		// -------------------------------------------------------------
		kc.pdfStruc.contextuales.Section = Ext
				.createByAlias("widget.menuSection");
		kc.pdfStruc.contextuales.Element = Ext
				.createByAlias("widget.menuElement");
		// -------------------------------------------------------------
		var dom = me.el.dom
		if ( kc.FixExtJs42 ) { 
			dom = me.el.dom.firstChild;
			try{
				 var cc = dom.firstChild.firstChild;
				cc.style="hidden=hidden";
			}catch (e){}
			
		}
		// -------------------------------------------------------------
		this.pageRef = dom;
		// -------------------------------------------------------------
                this.getDbBase().isValid()
		this.creoStruc();
		// -------------------------------------------------------------
	},
	addRefDocument : function() {
		if (this.pdfStruc.Document == undefined) {
			this.pdfStruc.Document = Ext.clone(kc.pdfStruc.PdfPage.Document)
			// this.pdfStruc.Document = new Object()
		}
		this.pdfStruc.Document.refParent 					= this.pdfStruc.Document
		this.pdfStruc.Document.Header.Items[0] 				= Ext.clone(kc.pdfStruc.PdfHeadDoc)
		this.pdfStruc.Document.Header.Items[0].BackGround 	= Ext.clone(kc.pdfStruc.colorSection.headDoc)

		this.pdfStruc.Document.Header.Items[0].refParent 	= this.pdfStruc.Document
		this.pdfStruc.Document.Header.Items[0].idSections 	= ++this.pdfStruc.reportExtras.idSections
		// -----------------------------------------------------------------------------------------
		this.pdfStruc.Document.refParent 					= this.pdfStruc.Document
		this.pdfStruc.Document.Footer.Items[0] 				= Ext.clone(kc.pdfStruc.PdfFooterDoc)
		this.pdfStruc.Document.Footer.Items[0].BackGround 	= Ext.clone(kc.pdfStruc.colorSection.footerDoc)
		this.pdfStruc.Document.Footer.Items[0].refParent 	= this.pdfStruc.Document
		this.pdfStruc.Document.Footer.Items[0].idSections 	= ++this.pdfStruc.reportExtras.idSections

	},
	creoStruc : function() {
		// -----------------------------------------------------------------------------------------
		var style = 'width: {0}mm;height: 100%;background-color:{1} ;position:absolute;'
				+ 'border-right-color: beige;' + 'border-right-style: inset;'
		// -----------------------------------------------------------------------------------------
		var dom;
		var widthPage;
		if (this.pdfStruc.PageOrienta == "P") {
			widthPage = this.pdfStruc.PageType.width
		} else {
			widthPage = this.pdfStruc.PageType.height
		}
		this.pdfStruc.refView = jQuery("<div />", {
			style : Ext.String.format(style, widthPage
							- this.pdfStruc.MarginLeft
							- this.pdfStruc.MarginRight,
					this.pdfStruc.BackGround.cN),
			click : function(event) {
				event.stopPropagation()
				this.pdfRef.grd.setObjectRef(this)
			}
		}).appendTo(this.pageRef.firstChild)
		this.pageRef.firstChild.onclick = function(event) {
			event.stopPropagation()
			this.pdfRef.grd.setObjectRef(this.pdfRef.my.refView[0])
		}

		this.pageRef.firstChild.pdfRef = {
			my : this.pdfStruc,
			grd : this.gridProRef
		}
		this.pdfStruc.refView[0].pdfRef = {
			my : this.pdfStruc,
			grd : this.gridProRef
		}
		this.pdfStruc.refView[0].style.setProperty("margin-left", 4, null)

		// -----------------------------------------------------------------------------------------
		// aca agregar fix para cuando no existe esto. en versiones anteriores.
		kc.pdfStruc.section.add(this.pdfStruc.Document.Header,
				"DocumentHeader", this.pdfStruc, this.gridProRef)
		kc.pdfStruc.section.add(this.pdfStruc.Group.Header, "Header",
				this.pdfStruc, this.gridProRef)
		if (this.pdfStruc.Group.Body.Body == undefined) {
			for (auI in this.pdfStruc.Group.Body.Items) {
				this.pdfStruc.Group.Body.Items[auI].refParent = this.pdfStruc.Group
			}
			kc.pdfStruc.section.add(this.pdfStruc.Group.Body, "Body",
					this.pdfStruc, this.gridProRef)
		} else {
			// aca arma un body estandar para luego poder asignarlo
			var aux = Ext.clone(kc.pdfStruc.PdfSectionList)
			aux.refParent = this.pdfStruc.Group
			kc.pdfStruc.section
					.add(aux, "Body", this.pdfStruc, this.gridProRef)
			// --------------------------------------------------------------------------------------
			kc.pdfStruc.section.addGroupFromOpen(aux, this.pdfStruc.Group.Body,
					this.pdfStruc, this.gridProRef);
		}
		// ------------------------------------------------------------------------------------------
		kc.pdfStruc.section.add(this.pdfStruc.Group.Footer, "Footer",
				this.pdfStruc, this.gridProRef)
		// aca agregar fix para cuando no existe esto. en versiones anteriores.
		kc.pdfStruc.section.add(this.pdfStruc.Document.Footer,
				"DocumentFooter", this.pdfStruc, this.gridProRef)

		// ------------------------------------------------------------------------------------------
		Ext.ComponentQuery.query("#sql")[0]
				.setValue(this.pdfStruc.reportExtras.sql)
		// ------------------------------------------------------------------------------------------
		let field=kc.estructuro_field_json(this.pdfStruc.reportExtras.field,this.pdfStruc.field_json);
/*		let field=[];
		if ( this.pdfStruc.reportExtras.field != "") {
			if (typeof this.pdfStruc.reportExtras.field == "object") {
				field = JSON.parse(JSON.stringify( this.pdfStruc.reportExtras.field ));
			}
		}
		if (typeof this.pdfStruc.field_json == "string") {
			try {
				if ( this.pdfStruc.field_json.trim()!="") {
					let xx_f = JSON.parse("[" + this.pdfStruc.field_json + "]");
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
		}*/
//		this.storeField.loadData(this.pdfStruc.reportExtras.field);
		this.storeField.loadData(field);
		// ------------------------------------------------------------------------------------------
		var aux = new Array()
		for (var ii in this.pdfStruc.TotalFields) {
			aux.push(this.pdfStruc.TotalFields[ii])
		}
		// ------------------------------------------------------------------------------------------
		this.storeFieldTotal.loadData(aux)
		this.getDbBase().setValue(kc.pdfStrucRefActiva.reportExtras.bdName)

		// ------------------------------------------------------------------------------------------

	},
	_addDiv : function(ref, type) {
		kc.pdfStruc.section.add(ref, type, this.pdfStruc, this.gridProRef)
	}
})
// --------------------------------------------------------------------------------------------------
