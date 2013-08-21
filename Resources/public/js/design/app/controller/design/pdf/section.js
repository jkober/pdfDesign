//var idDev = 0;
Ext.define('kc.pdfStruc.section', {
	singleton : true,
	style : 'width: 100%;height: {0}mm;background-color:{1} ;position:relative;'
			+ 'border-bottom-color: blue;border-bottom-width:1px;border-bottom-style: inset;',
	recalculaGroup : false,
	afterResize : function(a, b, c) {
		this.pdfRef.my.Height = kc.pdfStruc.toMm(this.pdfRef.my.refView.height())
	},
	addGroup : function(value) {
		var lastItem;
		if (value.refExtraBody != undefined) {
			// -------------------------------------------------------------------------------------
			this._addBeforeAux(value.contex.Header, value.refExtraBody);
			// -------------------------------------------------------------------------------------
		} else {
			this._addBeforeAux(value.contex.Header,
					value.contex.Body.refView[0]);
		}
		for (var i in value.contex.Header.Items) {
			lastItem = i;
			// -------------------------------------------------------------------------------------
			this._addAppend(value.contex.Header.Items[i],value.contex.Header.refView[0])
			// -------------------------------------------------------------------------------------
			this._addExtrasFunctions(value.contex.Header.Items[i], "head",value.grid)
			// -------------------------------------------------------------------------------------
			value.contex.Header.Items[i].refView[0].style.setProperty("border-bottom-color", this.colorBorder.itemSection, null);
			// -------------------------------------------------------------------------------------
		}
		value.contex.Header.Items[lastItem].refView[0].style.setProperty("border-bottom-color", this.colorBorder.section, null);
		// -----------------------------------------------------------------------------------------
		// -----------------------------------------------------------------------------------------
		if (value.refExtraBody != undefined) {
			this._addAfterAux(value.contex.Footer, value.refExtraBody);
		} else {
			this._addAfterAux(value.contex.Footer,value.contex.Body.refView[0]);
		}
		for (var i in value.contex.Footer.Items) {
			lastItem = i
			// -------------------------------------------------------------------------------------
			this._addAppend(value.contex.Footer.Items[i],
					value.contex.Footer.refView[0])
			// -------------------------------------------------------------------------------------
			this._addExtrasFunctions(value.contex.Footer.Items[i], "footer",
					value.grid)
			// -------------------------------------------------------------------------------------
			value.contex.Footer.Items[i].refView[0].style.setProperty(
					"border-bottom-color", this.colorBorder.itemSection, null);
			// -------------------------------------------------------------------------------------
		}
		value.contex.Footer.Items[lastItem].refView[0].style.setProperty("border-bottom-color", this.colorBorder.section, null);
		// -----------------------------------------------------------------------------------------
		kc.pdfStrucRefActiva.GroupBy["gp" + value.contex.groupId] = value.contex.GroupBy
		// -----------------------------------------------------------------------------------------
		return;
	},
	_addBeforeAux : function(ref, divContainer) {
		ref.refView = jQuery("<div />").insertBefore(divContainer)
		ref.refView[0].id = "s_" + (++kc.pdfStrucRefActiva.reportExtras.idId)
	},

	_addBefore : function(ref, divContainer) {
		ref.refView = jQuery("<div />", this._getActions(ref))
				.insertBefore(divContainer)
		this.extResize(Ext.get(ref.refView[0]))
		ref.refView[0].id = "s_" + (++kc.pdfStrucRefActiva.reportExtras.idId)
	},
	_addAfterAux : function(ref, divContainer) {
		ref.refView = jQuery("<div />").insertAfter(divContainer)
		ref.refView[0].id = "s_" + (++kc.pdfStrucRefActiva.reportExtras.idId)
	},

	_addAfter : function(ref, divContainer) {
		ref.refView = jQuery("<div />", this._getActions(ref))
				.insertAfter(divContainer)
		this.extResize(Ext.get(ref.refView[0]))
		ref.refView[0].id = "s_" + (++kc.pdfStrucRefActiva.reportExtras.idId)
	},
	_addAppendAux : function(ref, divContainer) {
		// -----------------------------------------------------------------------------------------
		ref.refView = jQuery("<div />").appendTo(divContainer)
		// -----------------------------------------------------------------------------------------
		ref.refView[0].id = "s_" + (++kc.pdfStrucRefActiva.reportExtras.idId)
	},
	_addAppend : function(ref, divContainer) {
		// -----------------------------------------------------------------------------------------
		ref.refView = jQuery("<div />", this._getActions(ref))
				.appendTo(divContainer)
		// -----------------------------------------------------------------------------------------
		this.extResize(Ext.get(ref.refView[0]))
		// -----------------------------------------------------------------------------------------
		ref.refView[0].id = "s_" + (++kc.pdfStrucRefActiva.reportExtras.idId)
		/*
		 * ref.refView.selectable({ filter : 'div:first-child', stop :
		 * function() { var result = new Array()
		 * jQuery(".ui-selected:first-child", this).each( function() {
		 * result.push(this.parentNode) }) if (result.length > 0) {
		 * console.debug(result) alert("aca el menu para multiples seleccion") } } })
		 */
		// -----------------------------------------------------------------------------------------
	},
	extResize : function(element) {
		Ext.create('Ext.resizer.Resizer', {
					el : Ext.get(element),
					transparent : true,
					handles : 's',
					pinned : false,
					listeners : {
						resize : function(a, b, c, d, e) {
							cc = this.getTarget().dom
							cc.pdfRef.my.Height = kc.pdfStruc
									.toMm(cc.pdfRef.my.refView.height())
						}
					}
				});

	},
	_getActions : function(ref) {
		return {
			style : Ext.String.format(this.style, "0mm", ref.BackGround.cN),
			click : function(event) {
				event.stopPropagation()
				this.pdfRef.grd.setObjectRef(this)
			},
			resize : function() {
				this.pdfRef.my.Height = kc.pdfStruc.toMm(this.pdfRef.my.refView
						.height())
			},
			contextmenu : function(e) {
				e.stopPropagation()
				kc.pdfStruc.contextuales.Section.setContex(
						e.currentTarget.pdfRef, {
							X : e.pageX - jQuery(e.target).offset().left,
							Y : e.pageY - jQuery(e.target).offset().top
						})
				kc.pdfStruc.contextuales.Section.show();
				kc.pdfStruc.contextuales.Section.setPosition(e.pageX, e.pageY)
				return false
			}
		}
	},
	_addExtrasFunctions : function(ref, type, gridProRef) {
		ref.refView[0].pdfRef = {
			my : ref,
			grd : gridProRef
		}
		ref.refView.height(ref.Height + "mm")
		kc.pdfStruc.factorRelacionPx.set(ref.refView.height(), ref.Height)
		ref.refView.height(ref.Height + "mm")
		// ---------------------------------------------------------------------
		var contex = {
			my : ref,
			grd : gridProRef
		}
		var aux= jQuery(ref.refView[0])[0]
/*		if (ref.typeSection == "headDoc") {
			aux.style.setProperty("BackGround"			, "Silver"	, null)
		}		
		if (ref.typeSection == "head") {
			aux.style.setProperty("BackGround"			, "Gainsboro"	, null)
		}
		if (ref.typeSection == "body") {
			aux.style.setProperty("BackGround"			, "FloralWhite"	, null)
		}
		if (ref.typeSection == "footer") {
			aux.style.setProperty("BackGround"			, "Gainsboro"	, null)
		}
		if (ref.typeSection == "footerDoc") {
			aux.style.setProperty("BackGround"			, "Silver"	, null)
		}		
                if ( ref.BackGround.cN != undefined) {*/
                aux.style.setProperty("BackGround"			, ref.BackGround.cN	, null)
                    
                //}
		
		//ref.refView[0].id = "dev" + idDev++
		var auxNN = new Ext.dd.DropTarget(ref.refView[0], {
					ddGroup : 'sectionGroup',
					copy : false,
					overClass : 'over',
					notifyDrop : function(dragSource, event, data) {
						var _positions
						if (dragSource.ddGroup == "sectionGroupTotal") {
							_positions = {
								Y : event.browserEvent.pageY
										- jQuery(event.target).offset().top,
								X : event.browserEvent.pageX
										- jQuery(event.target).offset().left
							}
							var extra = data.records[0].data
							kc.pdfStruc.element.add({
										position : _positions,
										ref : "addFieldTotal",
										contex : event.target.pdfRef,
										extraTota : extra
									})
						} else {
							if (dragSource.ddGroup == "sectionGroupExtra") {
								_positions = {
									Y : event.browserEvent.pageY
											- jQuery(event.target).offset().top,
									X : event.browserEvent.pageX
											- jQuery(event.target).offset().left
								}
								if (data.records[0].get("name") == "label") {
									kc.pdfStruc.element.add({
												position : _positions,
												ref : "addLabel",
												contex : event.target.pdfRef
											})
									return true
								}
								if (data.records[0].get("name") == "NroPagina") {
									kc.pdfStruc.element.add({
												position : _positions,
												ref : "addNroPage",
												contex : event.target.pdfRef
											})
									return true
								}
								if (data.records[0].get("name") == "imagen") {
									var c = Ext.createByAlias(
											"widget.pdfImagen", {
												_extras : {
													position : _positions,
													ref : "addImagen",
													contex : event.target.pdfRef
												}
											})
									c.show()
									return true
								}
								if (data.records[0].get("name") == "Tabla") {
									if ( event.target.pdfRef.my.typeSection=="footer" ) {
										if ( confirm ("Recuerde Que si es el pie de pagina, la tabla no funciona..., desea continuar") != true ) {
											return false;											
										}
									}
									kc.pdfStruc.element.add({
												position : _positions,
												ref : "addTablet",
												contex : event.target.pdfRef
											})
									return true
								}
								if (data.records[0].get("name") == "Grafico Torta") {
									kc.pdfStruc.element.add({
												position : _positions,
												ref : "addGrfT",
												contex : event.target.pdfRef
											})
									return true
								}
								if (data.records[0].get("name") == "Codigo de Barras") {
									kc.pdfStruc.element.add({
												position : _positions,
												ref : "addCodigoB",
												contex : event.target.pdfRef
											})
									return true
								}
                                                                
								alert("componente no implementado")
								return false
							} else {
								_positions = {
									Y : event.browserEvent.pageY
											- jQuery(event.target).offset().top,
									X : event.browserEvent.pageX
											- jQuery(event.target).offset().left
								}
								var dataSource = data.records[0].get("extra")
								kc.pdfStruc.element.add({
											position : _positions,
											ref : "addField",
											contex : event.target.pdfRef,
											format:true,
											dataSource : dataSource
										})
								return true
							}
						}
					}
				});
		auxNN.addToGroup("sectionGroupTotal")
		auxNN.addToGroup("sectionGroupExtra")

		var _position
		for (var item in ref.Items) {
			_position = {
				Y : ref.Items[item].PositionTop + "mm",
				X : ref.Items[item].PositionLeft + "mm"
			};
			kc.pdfStruc.element.add({
						ref : ref.Items[item].TypeObj,
						contex : contex,
						position : _position,
						idItem : item
					})
		}
	},
	colorBorder : {
		itemSection : "black",
		section : "red"
	},
	addSectionColorear : function(forColorear) {
		for (var i in forColorear.Items) {
			item = forColorear.Items[i];
			item.refView[0].style.setProperty("border-bottom-color",this.colorBorder.itemSection, null);
		}
		item.refView[0].style.setProperty("border-bottom-color",this.colorBorder.section, null);

	},
	addSection : function(section, type, refView, grid, forColorear) {
		var item;
		// --------------------------------------------------------------------------------------
		this._addAppend(section, refView)
		// --------------------------------------------------------------------------------------
		this._addExtrasFunctions(section, type, grid)
		// --------------------------------------------------------------------------------------
		this.addSectionColorear(forColorear)
	},
	add : function(ref, type, pdfStruc, gridProRef) {
		// -----------------------------------------------------------------------------------------
		var lastItem;
		this._addAppendAux(ref, pdfStruc.refView);
		for (var i in ref.Items) {
			lastItem = i
			// -------------------------------------------------------------------------------------
			this._addAppend(ref.Items[i], ref.refView[0])
			// -------------------------------------------------------------------------------------
			this._addExtrasFunctions(ref.Items[i], type, gridProRef)
			// -------------------------------------------------------------------------------------
			ref.Items[i].refView[0].style.setProperty("border-bottom-color",this.colorBorder.itemSection, null);
			// -------------------------------------------------------------------------------------
		}
		if (ref.Items[lastItem] != undefined)
			ref.Items[lastItem].refView[0].style.setProperty("border-bottom-color", this.colorBorder.section, null);
		// -----------------------------------------------------------------------------------------
	},
	addGroupFromOpen : function(bodyAux, ref, pdfStruc, gridProRef) {
		if (ref["Body"] == undefined) {
			this.add(ref, type, pdfStruc, gridProRef)
		} else {
			// -------------------------------------------------------------------------------------
			var val = {};
			val.contex = ref;
			val.refBody = pdfStruc
			val.refExtraBody = bodyAux.refView
			val.grid = gridProRef
			// -------------------------------------------------------------------------------------
			this.addGroup(val)
			// -------------------------------------------------------------------------------------
			ref.Header.refParent = ref
			ref.Body.refParent = ref
			ref.Footer.refParent = ref
			for (var iiA in ref.Header.Items) {
				ref.Header.Items[iiA].refParent = ref
			}
			for (var iiA in ref.Body.Items) {
				ref.Body.Items[iiA].refParent = ref
			}
			for (var iiA in ref.Footer.Items) {
				ref.Footer.Items[iiA].refParent = ref
			}
			// -------------------------------------------------------------------------------------
			if (ref.Body["Body"] == undefined) {
				ref.Body.refView = bodyAux.refView;
				for (var i in ref.Body.Items) {
					lastItem = i
					// -----------------------------------------------------------------------------
					this._addAppend(ref.Body.Items[i], ref.Body.refView[0])
					ref.Body.Items[i].refParent = ref
					// -----------------------------------------------------------------------------
					this._addExtrasFunctions(ref.Body.Items[i], "body", gridProRef)
					//------------------------------------------------------------------------------
					ref.Body.Items[i].refView[0].style.setProperty("border-bottom-color", this.colorBorder.itemSection, null);
					//------------------------------------------------------------------------------
				}
				ref.Body.Items[lastItem].refView[0].style.setProperty("border-bottom-color", this.colorBorder.section, null);
			} else {
				this.addGroupFromOpen(bodyAux, ref.Body, pdfStruc, gridProRef);
			}

		}
	}
});