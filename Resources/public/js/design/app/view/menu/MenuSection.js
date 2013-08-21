//------------------------------------------------------------------------------
Ext.define("AppDesign.view.menu.MenuSection", {
	extend		: "Ext.menu.Menu",
	alias		: "widget.menuSection",
	pdfRef		: null,
	_Position 	: null,
	dropSecion:function(){
		var ref 	= this.contex.my.refParent
		var forDrop
		var item;
		switch (this.contex.my.typeSection) {
			case "head":
			case "headDoc":
				forDrop = ref.Header
				break;
			case "body":
				forDrop = ref.Body
				break;
			case "footer":
				forDrop = ref.Footer
				break;
		}
		var cant=0;
		for(var i in forDrop.Items) {
			cant++;
		}
		if (cant == 1 ) {
			alert("No se puede eliminar la unica secion que existe")
			return true;
		}

		for(var i in forDrop.Items) {
			item = forDrop.Items[i]
			if (this.contex.my.idSections == item.idSections ) {
				item.refView[0].parentNode.removeChild(item.refView[0])				
				delete forDrop.Items[i]
			}
		}
		kc.pdfStruc.section.addSectionColorear(forDrop)
	},
	dropGroup:function(){
		var ref 	= this.contex.my.refParent
		var BodyAux = ref.Body; 
		ref.Header.refView[0].parentNode.removeChild(ref.Header.refView[0])
		ref.Footer.refView[0].parentNode.removeChild(ref.Footer.refView[0])
		ref.refParent.Body = BodyAux
		grd= this.contex.grd;
		ref.refParent.Body.refParent = ref.refParent

			for (var iiA in ref.refParent.Body.Items) {
				ref.refParent.Body.Items[iiA].refParent = ref.refParent
			}
		
		
		ref.refParent.Body.refView[0].pdfRef = {
			my : BodyAux,
			grd : grd
		}		
	},
	setContex: function(contex, position){
		this.contex		= contex
		this._Position	= position
	},
	_addElement : function(element){
		var ref 	= element.nameU
		kc.pdfStruc.element.add({ref:ref,contex:this.contex,position:this._Position});
	},
	show:function(){
		//----------------------------------------------------------------------
		this.items.get("setGroupBy").hide()
		this.items.get("addGroup").hide()
		this.items.get("dropGroup").hide()
		this.items.get("paseField").hide()
		if ( copyBuffer.exists() == true ) {
			this.items.get("paseField").show()
			this.items.get("paseField").setText("Pegar un:" + copyBuffer.getDesc())
		}		
		//----------------------------------------------------------------------
		if (this.contex.my.typeSection == "body") {
			this.items.get("addGroup").show()
		}else{
			if (this.contex.my.typeSection == "head") {
				if ( this.contex.my.refParent.Body != undefined ) {
					if ( this.contex.my.refParent.refParent.PageOrienta == undefined ) {
						this.items.get("setGroupBy").show()
						this.items.get("dropGroup").show()
					}
				}
			}
		}
		this.callParent(arguments)
	},
	/**
	 * @return kc.pdfStruc.PdfGroup
	 */
	_getpdfGroup:function(){
		return Ext.clone(kc.pdfStruc.PdfGroup);
	},
	toSave : function(item) {
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
				clone[i] = this.toSave(item[i]);
			}
		} else if (type === '[object Object]' && item.constructor === Object) {
			clone = {};
			for (key in item) {
				if (key != "refView" && key != "refParent")
					clone[key] = this.toSave(item[key]);
				else
					clone[key] = null;
			}
		}
		return clone || item;
	},	
	addSection:function(){
		var section, clone, strucRef,type;
		switch(this.contex.my.typeSection) {
			case "body":
				strucRef            = this.contex.my.refParent.Body
				clone               = Ext.clone(kc.pdfStruc.PdfBody)
                                clone.BackGround    = Ext.clone(kc.pdfStruc.colorSection.body)
				break;
			case "head":
				strucRef 	= this.contex.my.refParent.Header
				clone 		= Ext.clone(kc.pdfStruc.PdfHead)
                                clone.BackGround    = Ext.clone(kc.pdfStruc.colorSection.head)
				break;
			case "headDoc":
				strucRef 	= this.contex.my.refParent.Header
				clone 		= Ext.clone(kc.pdfStruc.PdfHeadDoc)
                                clone.BackGround    = Ext.clone(kc.pdfStruc.colorSection.headDoc)
				break;
				
			case "footer":
				strucRef 	= this.contex.my.refParent.Footer
				clone 		= Ext.clone(kc.pdfStruc.PdfFooter)
                                clone.BackGround    = Ext.clone(kc.pdfStruc.colorSection.footer)
				break;
			case "footerDoc":
				strucRef 	= this.contex.my.refParent.Footer
				clone 		= Ext.clone(kc.pdfStruc.PdfFooterDoc)
                                clone.BackGround    = Ext.clone(kc.pdfStruc.colorSection.footerDoc)
				break;
		}
		type = this.contex.my.typeSection.substring(0,1).toUpperCase() + this.contex.my.typeSection.substring(1)
		strucRef.Items[strucRef.ItemsCount] = clone
		section 							= strucRef.Items[strucRef.ItemsCount];
		strucRef.ItemsCount++
		section.idSections					= ++kc.pdfStrucRefActiva.reportExtras.idSections
		section.refParent = this.contex.my.refParent
		kc.pdfStruc.section.addSection(section,type,strucRef.refView[0],this.contex.grd,strucRef)
	},
	addGroup:function(){
		//------------------------------------------------------------------------------------------
		var contex;
		this.newGroup 								= this._getpdfGroup();
		this.newGroup.groupId 						= ++kc.pdfStrucRefActiva.reportExtras.idGroups
		var auxParent								= this.contex.my.refParent
		this.newGroup.Body 			 				= this.contex.my.refParent.Body
		//------------------------------------------------------------------------------------------
		this.contex.my.refParent.Body 				= this.newGroup
		this.newGroup.Header.refParent 				= this.newGroup
		this.newGroup.Body.refParent 				= this.newGroup
		this.newGroup.Footer.refParent 				= this.newGroup
		//------------------------------------------------------------------------------------------
		for ( var i in this.newGroup.Body.Items ) {
			this.newGroup.Body.Items[i].refParent 	= this.newGroup
		}
		//------------------------------------------------------------------------------------------
		this.newGroup.Header.Items[0] 				= Ext.clone(kc.pdfStruc.PdfHead)
		this.newGroup.Header.Items[0].refParent 	= this.newGroup
		this.newGroup.Header.Items[0].idSections	= ++kc.pdfStrucRefActiva.reportExtras.idSections
		//------------------------------------------------------------------------------------------
		this.newGroup.Footer.Items[0] 				= Ext.clone(kc.pdfStruc.PdfFooter)
		this.newGroup.Footer.Items[0].refParent 	= this.newGroup
		this.newGroup.Footer.Items[0].idSections	= ++kc.pdfStrucRefActiva.reportExtras.idSections
		//------------------------------------------------------------------------------------------
		this.newGroup.refParent						= auxParent
		//------------------------------------------------------------------------------------------
		kc.pdfStruc.section.addGroup({contex:this.newGroup,refBody:this.contex.my,grid:this.contex.grd});
		//------------------------------------------------------------------------------------------
	},	
	initComponent : function() {
		var me 	 = this
		me.items = [{
					text 	: 'Agregar una Etiqueta',
					nameU 	: 'addLabel',
					handler : me._addElement.bind(me)
				}, {
					text 	: 'Agregar un Field',
					nameU 	: 'addField',
					handler : me._addElement.bind(me)
				},{
					text 	: 'Eliminar Grupo (Con Cuidado)',
					nameU 	: 'dropGroup',
					itemId 	: 'dropGroup',
					handler : me.dropGroup.bind(me)
				},{
					text 	: 'Eliminar Una Secion (Con Cuidado)',
					nameU 	: 'dropSecion',
					itemId 	: 'dropSecion',
					handler : me.dropSecion.bind(me)
				},{
					text 	: 'Agregar Nuevo Grupo',
					nameU 	: 'addGroup',
					itemId 	: 'addGroup',
					handler : me.addGroup.bind(me)
				},{
					text 	: 'Agregar Nueva Secion',
					nameU 	: 'addSection',
					itemId 	: 'addSection',
					handler : me.addSection.bind(me)
				},{
					text 	: 'Setear Agrupado por',
					nameU 	: 'setGroupBy',
					itemId 	: 'setGroupBy',
					handler : me.setGroupBy.bind(me)
				},{
					text 	: '_Pegarme',
					itemId 	: 'paseField',
					nameU 	: 'paseField',
					handler : me.paste.bind(me)
				}
				]
		me.callParent(arguments);
	},
	paste:function(element){
		var ref 	= copyBuffer.get();
                this._Position.X = kc.pdfStruc.toMm(this._Position.X)
                this._Position.Y = kc.pdfStruc.toMm(this._Position.Y)
                if (ref.selec != undefined) {
                    if (Ext.isArray(ref.selec)) {
                        this.posiResta = ref.posMin
                        for (var i = 0;i<ref.selec.length;i++){
                            this.addMe(ref.selec[i],ref.posMin)
                        }
                        return true
                    }
                }
                this.addMe(ref,{Left:ref.PositionLeft,Top:ref.PositionTop})
            
	},
        addMe:function(ref,posMin) {
                    this.contex.my.Items[this.contex.my.ItemsCount] = Ext.clone(ref)
                    //var posi = this._Position
                    var posi={}
                    posi.Y = ref.PositionTop - posMin.Top + this._Position.Y + "mm"
                    posi.X = ref.PositionLeft - posMin.Left + this._Position.X + "mm"
                    kc.pdfStruc.element.add({ref:ref.TypeObj,contex:this.contex,position:posi,idItem:this.contex.my.ItemsCount});
                    this.contex.my.ItemsCount++
            
        },
	setGroupBy:function(){
		var a = Ext.createByAlias("widget.SetGroupBy",{group:this.contex.my.refParent})
		a.show()
	}	
});