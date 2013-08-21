Ext.define("AppDesign.controller.design.event.MenuEvent", {
	abro : null,
	menuEventConfigurarReporte : function() {
		var c = Ext.createByAlias("widget.pdfOpciones", {
					pdfStruc : this.pdfStruc,
					pdfGrid : this.gridProRef
				})
		c.show()

	},
	menuEventAbrirRepSinBkp : function() {
		this.menuEventAbrirRep("false")
	},
	menuEventAbrirRepConBkp : function() {
		this.menuEventAbrirRep("true")
	},
	menuEventAbrirRep : function(bkp) {
		var me = this
		var aux = new Object();
		aux.nameFile = ""
		aux.func = Ext.Function.bind(me.menuEventAbr, me)
		var c = Ext.createByAlias("widget.pdfAbrir", {
					_extras : aux,
					_OpenBkp : bkp
				})/*
					 * , { _extras : { position : _positions, ref : "addImagen",
					 * contex : event.target.pdfRef } })
					 */
		c.show()
		return true
	},
	menuEventAbr : function(txt) {
		// ------------------------------------------------------------------------------------------
		var elemento = this.pdfStruc.refView[0]
		elemento.parentNode.removeChild(elemento);
		// ------------------------------------------------------------------------------------------
		Ajax.MyAjax.get().setController("reporte");
		Ajax.MyAjax.get().setAction("ReporteAbrir");
		// ------------------------------------------------------------------------------------------
		Ajax.MyAjax.get().setJson(Ext.encode({
					name : txt
				}));
		// ------------------------------------------------------------------------------------------
		var result = Ajax.MyAjax.get().getInfo();
		var datas = Ext.decode(result.data.result)
		var dom = this.pageRef
		// ------------------------------------------------------------------------------------------
		this.pdfStruc = datas;
		kc.pdfStrucRefActiva = this.pdfStruc
		// -----------------------------------------------------------------------------------------
		this.pdfStruc.refView = null;
		// ------------------------------------------------------------------------------------------
		this.pdfStruc.Group.refParent = this.pdfStruc
		// ------------------------------------------------------------------------------------------
		this.pdfStruc.Group.Header.refParent = this.pdfStruc.Group
		// -----------------------------------------------------------------------------------------
		for (var auI in this.pdfStruc.Group.Header.Items) {
			this.pdfStruc.Group.Header.Items[auI].refParent = this.pdfStruc.Group
		}
		// ------------------------------------------------------------------------------------------
		this.pdfStruc.Group.Body.refParent = this.pdfStruc.Group
		// ------------------------------------------------------------------------------------------
		this.pdfStruc.Group.Footer.refParent = this.pdfStruc.Group
		// -----------------------------------------------------------------------------------------
		for (auI in this.pdfStruc.Group.Footer.Items) {
			this.pdfStruc.Group.Footer.Items[auI].refParent = this.pdfStruc.Group
		}
		// -----------------------------------------------------------------------------------------
		this.pageRef = dom;

		if (this.pdfStruc.Document == undefined) {
			this.addRefDocument()
		}

		this.creoStruc();
		if (result.data.success) {
			alert("El reporte ha sido abierto correctamente")
		} else {
			alert("No se ha podido encontrar el Reporte")
		}
		kc.pdfStruc.loadStruc(kc.pdfStrucRefActiva.reportExtras.configDefault)
                this.setNameReport()
		return true;
	},
	menuEventGuardarRepAs : function() {
		var txt = ""
		if (this.pdfStruc.reportExtras.name == null) {
			txt = prompt("Ingrese el Nombre del report")
		} else {
			txt = prompt("Ingrese el Nombre del report",
					this.pdfStruc.reportExtras.name)

		}
		if (txt == null) {
			return false
		} else {
			this.pdfStruc.reportExtras.name = txt
		}
		this._save();
                this.setNameReport()
	},
	menuEventGuardarRep : function() {
		var txt = ""
		if (this.pdfStruc.reportExtras.name == null) {
			txt = prompt("Ingrese el Nombre del report")
			if (txt == null) {
				return false
			} else {
				this.pdfStruc.reportExtras.name = txt
			}
		}
		this._save();
                this.setNameReport()
                
	},
        setNameReport:function(){
          var aux = this.getReportName()
          aux.setText("->Reporte:"+this.pdfStruc.reportExtras.name)
        },
	_save : function() {
		// -------------------------------------------------------------
		var aux = this.getToSave();
		var json = Ext.encode(aux);
                var mensaje=""
		// -------------------------------------------------------------
		Ajax.MyAjax.get().setController("reporte");
		Ajax.MyAjax.get().setAction("ReporteGuardar");
		// -------------------------------------------------------------
		Ajax.MyAjax.get().setJson(json);
		var result = Ajax.MyAjax.get().getInfo();
                if (result==false ) {
                    alert("Errores al guardar el Reporte");
                }else{
                    // ---------------------------------------------------------
                    if (result.data.success) {
                            alert("El reporte ha sido grabado correctamente con el Nombre\n"
                                            + this.pdfStruc.reportExtras.name)
                    } else {
                        if (result.data.mensaje != undefined){
                            mensaje =result.data.mensaje;
                        }
                        alert("No se ha podido guardar el Reporte " + mensaje);
                    }
                    // ---------------------------------------------------------
                }
	},
	/** @type Array */
	myGroup : null,
	_reIndexItemCount : function(containers) {
		var ite, ii, container;
		var cantSection = 0;
		var arraOrden = new Array();
		for (it in containers.Items) {
			// -----------------------------------------------------
			cantSection++
			// -----------------------------------------------------
			container = containers.Items[it];
			arraOrden.push(container)
			ite = new Array()
			ii = 0;
			// -----------------------------------------------------
			container.ItemsArrange = new Array()
			for (var i in container.Items) {
				if (container.Items[i] != null) {
					ite.push(container.Items[i])
					container.ItemsArrange.push({
								Top : container.Items[i].PositionTop,
								Height : container.Items[i].PositionHeight,
								Index : ii
							});
					ii++;
				}
			}
			container.Items = ite;
			container.ItemsCount = ii;
			container.ItemsArrange.sort(function(a, b) {
						return a.Top - b.Top;
					});

			/*
			 * if (container.typeSection.indexOf("head") == 0 ) { var groupId =
			 * "gp" + container.refParent.groupId; for ( var i = 0 ; i<container.TotalFields.length ;
			 * i++) { delete container.TotalFields[i]; }
			 * container.TotalFields.length = 0; var total for (i in
			 * this.pdfStruc.TotalFields ) { total =
			 * this.pdfStruc.TotalFields[i] if (total.Reset == groupId ) {
			 * container.TotalFields.push(total.FieldName) } } }
			 */
		}
		containers.ItemsCount = cantSection
		containers.Items.length = 0;
		for (var ii = 0; ii < arraOrden.length; ii++) {
			containers.Items.push(arraOrden[ii])
		}
	},
	_getGroup : function(group) {
		// ------------------------------------------------------------------------------------------
		if (group.Body != undefined) {
			this.myGroup["gp" + group.groupId] = group.GroupBy
			this._getGroup(group.Body)
			this._reIndexItemCount(group.Header)

			// if (group.typeSection.indexOf("head") == 0 ) {
			var groupId = "gp" + group.groupId;
			if (group.refParent.Body.Header.TotalFields == undefined) {
				group.refParent.Body.Header.TotalFields = new Array();
			}
			for (var i = 0; i < group.Header.TotalFields.length; i++) {
				delete group.Header.TotalFields[i];
			}
			group.Header.TotalFields.length = 0;
			var total
			for (i in this.pdfStruc.TotalFields) {
				total = this.pdfStruc.TotalFields[i]
				if (total.Reset == groupId) {
					group.Header.TotalFields.push(total.FieldName)
				}
			}
			// }

			this._reIndexItemCount(group.Footer)
		} else {
			this._reIndexItemCount(group)
		}
		// ------------------------------------------------------------------------------------------
	},
	getToSave : function() {
		this.myGroup = new Object();
		if (this.pdfStruc.Group.Body.Body != undefined) {
			this._reIndexItemCount(this.pdfStruc.Group.Header)
			this._getGroup(this.pdfStruc.Group.Body)
			this._reIndexItemCount(this.pdfStruc.Group.Footer)
		} else {
			this._reIndexItemCount(this.pdfStruc.Group.Header)
			this._reIndexItemCount(this.pdfStruc.Group.Body)
			this._reIndexItemCount(this.pdfStruc.Group.Footer)
		}
		this._reIndexItemCount(this.pdfStruc.Document.Header)
		this._reIndexItemCount(this.pdfStruc.Document.Footer)
		
		this.pdfStruc.GroupBy = this.myGroup;
		var json = this.toSave(this.pdfStruc)
		return json
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
				if (key != "refView" && key != "refParent"
						&& key != "refAtodos" && key != "selectionGroup")
					clone[key] = this.toSave(item[key]);
				else
					clone[key] = null;
			}
		}
		return clone || item;
	}
})