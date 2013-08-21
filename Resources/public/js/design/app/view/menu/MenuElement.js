Ext.define("AppDesign.view.menu.MenuElement", {
    extend : "Ext.menu.Menu",
    requires : ["AppDesign.view.menu.copyBuffer"],
    alias : "widget.menuElement",
    pdfRef : null,
    _Position : null,
    _currentTarget : null,
    contex : null,
    addGroup : function() {
        var contex;
        this.newGroup = this._getpdfGroup();
        this.newGroup.groupId = ++kc.pdfStrucRefActiva.reportExtras.idGroups
        var auxParent = this.contex.my.refParent.refParent
        this.newGroup.Body = this.contex.my.refParent
        this.contex.my.refParent.refParent.Body = this.newGroup
        this.newGroup.Header.refParent = this.newGroup
        this.newGroup.Body.refParent = this.newGroup
        this.newGroup.Footer.refParent = this.newGroup
        this.newGroup.refParent = auxParent

        kc.pdfStruc.section.addGroup({
            contex : this.newGroup,
            refBody : this.contex.my.refParent,
            grid : this.contex.grd
        });
    },
    setContex : function(contex, position, currentTarget) {
        this.contex = contex
        this._Position = position
        this._currentTarget = currentTarget
    },
    show : function() {
        // ---------------------------------------------------------------------
        this.items.get("setGroupBy").hide()
        this.items.get("addGroup").hide()
        // ---------------------------------------------------------------------
        if (this.contex.my.refParent.typeSection == "body") {
            this.items.get("addGroup").show()
        } else {
            if (this.contex.my.refParent.typeSection == "head") {
                if (this.contex.my.refParent.refParent.Body != undefined) {
                    if (this.contex.my.refParent.refParent.refParent.PageOrienta == undefined) {
                        this.items.get("setGroupBy").show()
                    }
                }
            }
        }
        this.callParent(arguments)
    },
    initComponent : function() {
        var me = this
        me.items = [{
            text : 'Borrarme',
            nameU : 'dropLabel',
            itemId : 'dropLabel',
            handler : me.dropElement.bind(me)
        }, {
            text : 'Agregar Nuevo Grupo',
            nameU : 'addGroup',
            itemId : 'addGroup',
            handler : me.addGroup.bind(me)
        }, {
            text : 'Setear Agrupado por',
            nameU : 'setGroupBy',
            itemId : 'setGroupBy',
            handler : me.setGroupBy.bind(me)
        }, {
            text : '_Copiarme',
            itemId : 'copyField',
            nameU : 'copyField',
            handler : me.copyObject.bind(me)
        }

        ]
        me.callParent(arguments);
    },
    copyObject : function() {
        var toCopy = jQuery(this._currentTarget.pdfRef.my.refParent.refView).find("div.ui-selected.MyElement")
        if ( toCopy.length == 0 ) {
            copyBuffer.set(Ext._myClone(this._currentTarget.pdfRef.my))
            return true;
        }else{
            var lista={}
            lista.selec = [];
            lista.posMin={}
            lista.posMin.Top    = 999999999
            lista.posMin.Left   = 999999999
            for (var i = 0;i<toCopy.length;i++){
                if (toCopy[i].pdfRef.my.PositionLeft<lista.posMin.Left) {
                    lista.posMin.Left=toCopy[i].pdfRef.my.PositionLeft
                }
                if (toCopy[i].pdfRef.my.PositionLeft<lista.posMin.Top) {
                    lista.posMin.Top=toCopy[i].pdfRef.my.PositionTop
                }
                lista.selec.push(Ext._myClone(toCopy[i].pdfRef.my))
            }
            copyBuffer.set(lista)
            return true;

        }
    },
    setGroupBy : function() {
        var a = Ext.createByAlias("widget.SetGroupBy", {
            group : this.contex.my.refParent.refParent
        })
        a.show()
    },
    /**
	 * @return kc.pdfStruc.PdfGroup
	 */
    _getpdfGroup : function() {
        return Ext.clone(kc.pdfStruc.PdfGroup);
    },
    dropElement : function(a, b, c, d, e) {
            
        var toCopy = jQuery(this._currentTarget.pdfRef.my.refParent.refView).find("div.ui-selected.MyElement")
        if ( toCopy.length == 0 ) {
            this._currentTarget.parentNode.removeChild(this._currentTarget)
            delete this.contex.my.refParent.Items[this.contex.idRef]
            return true;
        }else{
            if (!confirm("Desea Borrar todos los elementos selecionados")){
                return true;
            }
            var aux = this._currentTarget.pdfRef.my.refParent
            var ind;
            for (var i = 0;i<toCopy.length;i++){
                ind =toCopy[i].pdfRef.idRef
                toCopy[i].parentElement.removeChild(toCopy[i])                    
                delete aux.Items[ind]
            }
            return true;
        }
    }
});