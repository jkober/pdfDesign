Ext.define("AppDesign.view.design.GridPropety", {
    extend : "Ext.grid.property.Grid",
    alias : 'widget.gridPro',
    id : 'prope',
    anchor : '100% 100%',
    region : 'center',
    useArrows : true,
    rootVisible : false,
    conboSelect : true,
    helpPanelOculto:false,
    propertyNames : {
        BackGround : 'Color de Fondo',
        BorderColor : 'Color del Borde',
        BorderSize : 'Tamaño del Borde',
        FontFamily : 'Nombre Fuente',
        FontColor : 'Color de la Fuente',
        TypeObj : 'Tipo de Objeto',
        GroupTop : 'Sumar a Top',
        GroupLeft : 'Sumar a Left',
        GroupWidth : 'Sumar a Width',
        GroupHeight : 'Sumar a Height',
        GroupTopIgualar : 'Igualar Top',
        GroupLeftIgualar : 'Igualar  Left',
        GroupWidthIgualar : 'Igualar  Width',
        GroupHeightIgualar : 'Igualar  Height',
        GrafTitle : 'Titulo',
        CodigoBarra : "Codigo de Barras",
        GroupBorderSize:"Border Size",
        GroupBorderType:"Tipo de Borde",
        GroupBorderColor:"Color de Borde",

        GroupFontFamily:"Nombre Fuente",
        GroupFontColor : 'Color de la Fuente',
        GroupFontBold:"Negrita",
        GroupFontItalic:"Cursiva",
        GroupFontAlign:"Alinezacion",
        GroupFontUnderLine:"Subrrazado",
        GroupFontSize:"Tamaño"
		
		
		
		
    },
    _loadDa : function(items, selected) {
        var arr = [];
        var ob;
        var ob2;
        if (selected != undefined) {
            ob = selected;
            ob2 = {};
            ob2.TypeObj = ob.TypeObj
            ob2.Text = ob.Text
            ob2.TotalFieldName = null
            ob2.fileName = "Selection"
            ob2.DataSource = null
            ob2.refIndiceInterno = null
            arr.push(ob2)

        }
        for (var i in items) {
            ob = items[i];
            ob2 = {};
            ob2.TypeObj = ob.TypeObj
            ob2.Text = ob.Text
            ob2.TotalFieldName = ob.TotalFieldName
            ob2.fileName = ob.fileName
            ob2.DataSource = ob.DataSource
            ob2.refIndiceInterno = ob.refIndiceInterno
            arr.push(ob2)
        }
        this.dockingStore.loadData(arr);
    },
    listeners : {
        'beforeedit' : function(b, e, b, c) {
            if (this.customReadOnly[e.record.get("name")] == undefined) {
                return true;
            }
            return false;
        },
        'select' : function(n, e) {
            try {
                var nam = e.get("name")
                if (this.helpMe[nam] != undefined) {
                    this.help.setValue(this.helpMe[nam])
                } else {
                    this.help.setValue("")
                }
            } catch (e) {
                this.help.setValue("")
            }
        }
    },
    // ----------------------------------------------------------------------------------------------
    objectRef : null,
    objectPdf : null,
    docking : null,
    dockingStore : null,
    refSection : null,
    recargo : false,
    resetValue : true,
    setInObjectHtml : true,
    // ----------------------------------------------------------------------------------------------
    setObjectRef : function(objectRef) {
        this.selecions = null
        if (this.docking == null) {
            this.docking = this.getDockedItems()[0].items.get(0)
            this.dockingStore = Ext.getStore("listaItemsActivos");
        }
        // if (objectRef.pdfRef.my.refParent.selectionGroup!=null){
        if (objectRef.pdfRef.my.refParent != undefined
            && objectRef.pdfRef.my.refParent.selectionGroup != null) {
            var aux = objectRef.pdfRef.my.refParent.selectionGroup
            this.docking.idSections = 0;
            this._loadDa(aux.pdfRef.refAtodos.Items, aux.pdfRef.my)
            this.refSection = aux.pdfRef.refAtodos;
            this.selecions = aux.pdfRef.my

        } else {
            if (objectRef.pdfRef.my.idSections != undefined) {
                this.docking.idSections = objectRef.pdfRef.my.idSections;
                this.refSection = objectRef.pdfRef.my;
                this._loadDa(objectRef.pdfRef.my.Items)
            } else {
                if (objectRef.pdfRef.my.TypeObj == "GS") {
                    this.docking.idSections = 0;
                    this._loadDa(objectRef.pdfRef.refAtodos.Items,
                        objectRef.pdfRef.my)
                    this.refSection = objectRef.pdfRef.refAtodos;
                    this.selecions = objectRef.pdfRef.my
                } else {
                    if (objectRef.pdfRef.my.refParent != undefined) {
                        this.docking.idSections = objectRef.pdfRef.my.refParent.idSections;
                        this._loadDa(objectRef.pdfRef.my.refParent.Items)
                        this.refSection = objectRef.pdfRef.my.refParent;
                    }
                }
            }
        }
        // ------------------------------------------------------------------------------------------
        this.recargo = true;
        if (this.resetValue) {
            this.docking.clearValue()
        }
        this.resetValue = true;
        this.recargo = false;
        // ------------------------------------------------------------------------------------------
        this.last = {};
        // ------------------------------------------------------------------------------------------
        this.store.proxy.reader.customExclude = this.customExclude
        // ------------------------------------------------------------------------------------------
        this.setSource(objectRef.pdfRef.my);
        // ------------------------------------------------------------------------------------------
        this.objectPdf = objectRef.pdfRef;
        this.objectRef = objectRef;
    // ------------------------------------------------------------------------------------------
    },
    initComponent : function() {
        var me = this
        me.customEditors = {
            GroupFontUnderLine:Ext.create('Ext.form.field.boolean',  {vTrue:'Sacar subrayado',            vFalse:'Subrayar'                   }),
            GroupFontBold     : Ext.create('Ext.form.field.boolean', {vTrue:'Cambiar a Normal',           vFalse:'Cambiar a Bold'             }),
            GroupFontItalic   : Ext.create('Ext.form.field.boolean', {vTrue:'Sacar Cursiva',              vFalse:'Poner Cursiva'              }),
            FontBold          : Ext.create('Ext.form.field.boolean', {vTrue:'Cambiar a Normal',           vFalse:'Cambiar a Bold'             }),
            FontUnderLine     : Ext.create('Ext.form.field.boolean', {vTrue:'Sacar subrayado',            vFalse:'Subrayar'                   }),
            FontItalic        : Ext.create('Ext.form.field.boolean', {vTrue:'Sacar Cursiva',              vFalse:'Poner Cursiva'              }),
            MultiLine         : Ext.create('Ext.form.field.boolean', {vTrue:'Sacar Multi Line',           vFalse:'Poner Multi Line'           }),
            CodigoBarraCalc   : Ext.create('Ext.form.field.boolean', {vTrue:'Calcular Ancho Codigo Barra',vFalse:'Calcular Ancho Codigo Barra'}),
            GraficPrevious    : Ext.create('Ext.form.field.boolean', {vTrue:'Previsualizar',              vFalse:'Previsualizar'              }),
            PrintIfEmpyReg    : Ext.create('Ext.form.field.boolean', {vTrue:'Poner No print',             vFalse:'Sacar No print'             }),
            PrintIf        : Ext.create('Ext.form.field.openWin',{vTrue:'Evalua si imprime',          vFalse:'imprime por defecto', mePrope : me, propName : 'PrintIf'       }),
            ProcesaFoot    : Ext.create('Ext.form.field.openWin',{vTrue:'Evalua si procesa',          vFalse:'procesa por defecto', mePrope : me, propName : 'ProcesaFoot'   }),
            PrintHead      : Ext.create('Ext.form.field.openWin',{vTrue:'Evalua si imprime',          vFalse:'imprime por defecto', mePrope : me, propName : 'PrintHead'     }),
            PageBrakBefore : Ext.create('Ext.form.field.openWin',{vTrue:'Evalua si salta de Pagina',  vFalse:'no salto de pagina',  mePrope : me, propName : 'PageBrakBefore'}),
            PageBrakAfter  : Ext.create('Ext.form.field.openWin',{vTrue:'Evalua si salta de Pagina',  vFalse:'no salto de pagina',  mePrope : me, propName : 'PageBrakAfter' }),
            TableInit      : Ext.create('Ext.form.field.openWin',{vTrue:'Procesa informacion en init',vFalse:'no procesa',          mePrope : me                             }),
            TableAfterRead : Ext.create('Ext.form.field.openWin',{vTrue:'evento despues de leer',     vFalse:'no realiza nada',     mePrope : me                             }),
            TableBeforeRead: Ext.create('Ext.form.field.openWin',{vTrue:'evento antes leer',          vFalse:'no realiza nada',     mePrope : me                             }),
            TableFinishRead: Ext.create('Ext.form.field.openWin',{vTrue:'termina de leer',            vFalse:'no realiza nada',     mePrope : me                             }),
            BackGround       : Ext.create('Ext.form.field.ComboBoxColor',       {                editable : false            }),
            BorderColor      : Ext.create('Ext.form.field.ComboBoxColor',       {                editable : false            }),
            GroupBorderColor : Ext.create('Ext.form.field.ComboBoxColor',       {                editable : false            }),
            FillColorRow     : Ext.create('Ext.form.field.ComboBoxColor',       {                editable : false            }),
            FontFamily       : Ext.create('Ext.form.field.ComboBoxFont',        {                editable : false            }),
            FontAlign        : Ext.create('Ext.form.field.ComboBoxFontAlign',   {                editable : false            }),
            FontColor        : Ext.create('Ext.form.field.ComboBoxColor',       {                editable : false            }),
            FormatType       : Ext.create('Ext.form.field.ComboBoxMask',        {                editable : false            }),
            FontSize         : Ext.create('Ext.form.field.NumberPostition',     {                minValue : 1                }),
            PositionTop      : Ext.create('Ext.form.field.NumberPostition'),
            PositionLeft     : Ext.create('Ext.form.field.NumberPostition'),
            PositionWidth    : Ext.create('Ext.form.field.NumberPostition'),
            PositionHeight   : Ext.create('Ext.form.field.NumberPostition'),
            MarginLeft       : Ext.create('Ext.form.field.NumberPostition'),
            MarginTop        : Ext.create('Ext.form.field.NumberPostition'),
            MarginRight      : Ext.create('Ext.form.field.NumberPostition'),
            MarginBottom     : Ext.create('Ext.form.field.NumberPostition'),
            Height           : Ext.create('Ext.form.field.NumberPostition'),
            DataSource       : Ext.create('Ext.form.field.ComboBoxDataSource',  {                editable : false            }),
            BorderType       : Ext.create('Ext.form.field.ComboBoxBorder',      {                editable : false            }),
            GroupBorderType  : Ext.create('Ext.form.field.ComboBoxBorder',      {                editable : false            }),
            LTypeObj         : Ext.create('Ext.form.field.DisplayTypeO'),
            GroupFontFamily  : Ext.create('Ext.form.field.ComboBoxFont',        {                editable : false            }),
            GroupFontAlign   : Ext.create('Ext.form.field.ComboBoxFontAlign',   {                editable : false            }),
            GroupFontColor   : Ext.create('Ext.form.field.ComboBoxColor',       {                editable : false            }),
            GroupFontSize    : Ext.create('Ext.form.field.NumberPostition',     {                minValue : 1                }),
            PageOrienta      : Ext.create('Ext.form.field.comboPageOrienta',    {                editable : false            }),
            TableHeightH     : Ext.create('Ext.form.field.NumberPostition',     {                minValue : 1                }),
            TableHeightF     : Ext.create('Ext.form.field.NumberPostition',     {                minValue : 1                }),
            TableHeightR     : Ext.create('Ext.form.field.NumberPostition',     {                minValue : 1                }),
            TableHead         : Ext.create('kc.HeadRow',     {  footTable : false,  headTable : true,     values : "Modificar Columns"         }),
            TableRow          : Ext.create('kc.HeadRow',     {  footTable : false,  headTable : false,    values : "Modificar Filas"           }),
            TableFoot         : Ext.create('kc.HeadRow',     {  footTable : true,   headTable : false,    values : "Modificar Footer"          }),
            Sources           : Ext.create('kc.TableSource', {  headTable : true,   values : "Modificar Origen De Datos"                       }),
            SourceCode        : Ext.create('kc.SourceCode',                   {                mePrope : me            }),
            LabelRotacion     : Ext.create('Ext.form.field.ComboBoxRotacion', {                editable : false        }),
            GroupTopIgualar   : Ext.create('Ext.form.field.NumberPostition',  {                minValue : 1            }),
            GroupLeftIgualar  : Ext.create('Ext.form.field.NumberPostition',  {                minValue : 1            }),
            GroupWidthIgualar : Ext.create('Ext.form.field.NumberPostition',  {                minValue : 1            }),
            GroupHeightIgualar: Ext.create('Ext.form.field.NumberPostition',  {                minValue : 1            }),
            GroupHeightIgualar: Ext.create('Ext.form.field.NumberPostition',  {                minValue : 1            }),
            CodigoBarraWid    : Ext.create('Ext.form.field.NumberPostition',  {  minValue : 0.006 ,  maxValue:2 }),
            SourceName        : Ext.create('kc.SourceName'),
            PageType          : Ext.create('Ext.form.field.comboPageType')
        }
        me.helpMe = {
            FormatMask        : "Si es Numero es la cantidad de digitos ej.: 0,1,2.Y si es Fecha d/m/Y",
            TableInit         : "Ocurre antes de leer. aqui se pueden crear array para usar Sum Count Avg. que seran procesador en el after read y mostrados en el finish table. ",
            TableAfterRead    : "Ocurre inmediatamente despues de leer el registro",
            TableBeforeRead   : "Ocurre inmediatamente antes de leer el registro",
            TableFinishRead   : "Ocurre al finalizar la tabla. aqui se puede agregar una nueva row de totales o demas cosas, puede ser muy util",
            PageBrakBefore    : "leer Salto de pagina Antes de imprimir la Seccion, si no se especifica nada no salta, ojo en el Head y Footer. podria traer problemas inesperados",
            PageBrakAfter     : "leer Salto de pagina Despues de imprimir la Seccion, si no se especifica nada no salta, ojo en el Head y Footer. podria traer problemas inesperados",
            GroupTop          : "Si es +(Positivo) Suma a todos los objetos Seleccionas y si es -(Negativo) se lo resta.",
            GroupLeft         : "Si es +(Positivo) Suma a todos los objetos Seleccionas y si es -(Negativo) se lo resta.",
            GroupWidth        : "Si es +(Positivo) Suma a todos los objetos Seleccionas y si es -(Negativo) se lo resta.",
            GroupHeight       : "Si es +(Positivo) Suma a todos los objetos Seleccionas y si es -(Negativo) se lo resta.",
            GroupTopIgualar   : "Iguala Top de todos los objetos",
            GroupLeftIgualar  : "Iguala Left de todos los objetos",
            GroupWidthIgualar : "Iguala Width de todos los objetos",
            GroupHeightIgualar: "Iguala Height de todos los objetos",
            PrintIf           : "Si no se especifica nada se imprime por defecto. Si se especifica codigo debe retornar true o false. True ->NO Imprime ; False ->Imprime",
            CodigoBarra       : "0-Normal 1-Code 39 2-Codigo i25 3-i25 + label 4-Qr",
            CodigoBarraWid    : "Cod.39 (0.6) en i25 -> es la altura de la barra"
        }
        me.customExclude = {
            refView         : true,
            refParent       : true,
            TabletCount     : true,
            Items           : true,
            ItemsArrange    : true,
            ItemsCount      : true,
            TotalFields     : true,
            GroupBy         : true,
            Child           : true,
            Group           : true,
            reportExtras    : true,
            refIndiceInterno: true,
            ExpressionDef   : true,
            ImagenEx        : true,
            selectionGroup  : true,
            Document        : true
        }
        me.customReadOnly = {
            typeSection    : true,
            TypeObj        : true,
            fileName       : true,
            TypeImagen     : true,
            idSections     : true,
            TableWidth     : true,
            TableHeight    : true,
            TotalFieldName : true
        }
        // ------------------------------------------------------------------------------------------
        me.last = {}
        // ------------------------------------------------------------------------------------------
        me.getColorFormat = function(value, name) {
            if (value != null) {
                if (Ext.isString(value)) {
                    this.last[name] = "<div style='background:" + value + "'>"
                    + value + "</div>";
                } else {
                    this.last[name] = "<div style='background:" + value.cN
                    + "'>" + value.cN + "</div>";
                }
            }
            return this.last[name]
        }
        // ------------------------------------------------------------------------------------------
        me.customRenderers = {
            BackGround : function(value) {
                return this.ownerCt.getColorFormat(value, "BackGround")
            },
            Sources : function() {
                return "Modificar Origen De Datos";
            },
            PageBrakBefore : function(value) {
                if (value != null) {
                    if (value["name"] != undefined) {
                        this.ownerCt.last["PageBrakBefore"] = Ext.String
                        .trim(value.name) == ""
                        ? ""
                        : "Evalua Salto de Pagina";
                    } else {
                        this.ownerCt.last["PageBrakBefore"] = Ext.String
                        .trim(value) == ""
                        ? ""
                        : "Evalua Salto de Pagina";
                    }
                }
                return this.ownerCt.last["PageBrakBefore"]
            },
            PageBrakAfter : function(value) {
                if (value != null) {
                    if (value["name"] != undefined) {
                        this.ownerCt.last["PageBrakAfter"] = Ext.String
                        .trim(value.name) == ""
                        ? ""
                        : "Evalua Salto de Pagina";
                    } else {
                        this.ownerCt.last["PageBrakAfter"] = Ext.String
                        .trim(value) == ""
                        ? ""
                        : "Evalua Salto de Pagina";
                    }
                }
                return this.ownerCt.last["PageBrakAfter"]
            },
            ProcesaFoot : function(value) {
                if (value != null) {
                    if (value["name"] != undefined) {
                        this.ownerCt.last["ProcesaFoot"] = Ext.String
                        .trim(value.name) == ""
                        ? ""
                        : "Evalua si Procesa el Footer";
                    } else {
                        this.ownerCt.last["ProcesaFoot"] = Ext.String
                        .trim(value) == ""
                        ? ""
                        : "Evalua si Procesa el Footer";
                    }
                }
                return this.ownerCt.last["ProcesaFoot"]
            },
            PrintHead : function(value) {
                if (value != null) {
                    if (value["name"] != undefined) {
                        this.ownerCt.last["PrintHead"] = Ext.String
                        .trim(value.name) == ""
                        ? ""
                        : "Evalua si Imprime el Head";
                    } else {
                        this.ownerCt.last["PrintHead"] = Ext.String.trim(value) == ""
                        ? ""
                        : "Evalua si Imprime el Head";
                    }
                }
                return this.ownerCt.last["PrintHead"]
            },

            PrintIf : function(value) {
                if (value != null) {
                    if (value["name"] != undefined) {
                        this.ownerCt.last["PrintIf"] = Ext.String
                        .trim(value.name) == ""
                        ? ""
                        : "Evalua si Imprime";
                    } else {
                        this.ownerCt.last["PrintIf"] = Ext.String.trim(value) == ""
                        ? ""
                        : "Evalua si Imprime";
                    }
                }
                return this.ownerCt.last["PrintIf"]
            },
            TableAfterRead : function(value) {
                if (value != null) {
                    if (value["name"] != undefined) {
                        this.ownerCt.last["TableAfterRead"] = Ext.String
                        .trim(value.name) == ""
                        ? ""
                        : "Ejecuta luego de Leer";
                    } else {
                        this.ownerCt.last["TableAfterRead"] = Ext.String
                        .trim(value) == ""
                        ? ""
                        : "Ejecuta luego de Leer";
                    }
                }
                return this.ownerCt.last["TableAfterRead"]
            },

            TableInit : function(value) {
                if (value != null) {
                    if (value["name"] != undefined) {
                        this.ownerCt.last["TableInit"] = Ext.String
                        .trim(value.name) == ""
                        ? ""
                        : "Ejecuta al iniciar";
                    } else {
                        this.ownerCt.last["TableInit"] = Ext.String.trim(value) == ""
                        ? ""
                        : "Ejecuta al iniciar";
                    }
                }
                return this.ownerCt.last["TableInit"]
            },
            TableBeforeRead : function(value) {
                if (value != null) {
                    if (value["name"] != undefined) {
                        this.ownerCt.last["TableBeforeRead"] = Ext.String
                        .trim(value.name) == ""
                        ? ""
                        : "Ejecuta antes de Leer";
                    } else {
                        this.ownerCt.last["TableBeforeRead"] = Ext.String
                        .trim(value) == ""
                        ? ""
                        : "Ejecuta antes de Leer";
                    }
                }
                return this.ownerCt.last["TableBeforeRead"]
            },
            TableFinishRead : function(value) {
                if (value != null) {
                    if (value["name"] != undefined) {
                        this.ownerCt.last["TableFinishRead"] = Ext.String
                        .trim(value.name) == ""
                        ? ""
                        : "Ejecuta al Finalizar la tabla";
                    } else {
                        this.ownerCt.last["TableFinishRead"] = Ext.String
                        .trim(value) == ""
                        ? ""
                        : "Ejecuta al Finalizar la tabla";
                    }
                }
                return this.ownerCt.last["TableFinishRead"]
            },

            SourceCode : function(value) {
                if (value != null) {
                    if (value["name"] != undefined) {
                        this.ownerCt.last["SourceCode"] = Ext.String
                        .trim(value.name) == ""
                        ? ""
                        : "Ejecuta Codigo interno";
                    } else {
                        this.ownerCt.last["SourceCode"] = Ext.String
                        .trim(value) == ""
                        ? ""
                        : "Ejecuta Codigo interno";
                    }
                }
                return this.ownerCt.last["SourceCode"]
            },
            TableHead : function() {
                return 'Modificar Titulos';
            },
            TableRow : function() {
                return 'Modificar Row';
            },
            TableFoot : function() {
                return 'Modificar Footer';
            },
            FillColorRow : function(value) {
                return this.ownerCt.getColorFormat(value, "FillColorRow")
            },
            BorderColor : function(value) {
                return this.ownerCt.getColorFormat(value, "BorderColor")
            },
            FontColor : function(value) {
                return this.ownerCt.getColorFormat(value, "FontColor")
            },
            SourceName : function(value) {
                if (value != null) {
                    if (value["name"] != undefined) {
                        this.ownerCt.last["SourceName"] = "<div style='background:cyan'>"
                        + value.nameDisp + "</div>"
                    } else {
                        this.ownerCt.last["SourceName"] = "<div style='background:cyan'>Seleccione</div>";// value
                    }
                }
                return this.ownerCt.last["SourceName"]

            },
            DataSource : function(value) {
                if (value != null) {
                    if (value["name"] != undefined) {
                        this.ownerCt.last["DataSource"] = "<div style='background:cyan'>"
                        + value.nameDisp + "</div>"
                    } else {
                        this.ownerCt.last["DataSource"] = "<div style='background:cyan'>Seleccione</div>"
                    }
                }
                return this.ownerCt.last["DataSource"]
            },
            FormatType : function(value) {
                if (value != null) {
                    if (value == "") {
                        return 'Sin Mascara'
                    }
                    return value
                } else {
                    return 'Sin Mascara'
                }

            },
            BorderType : function(value) {
                if (value != null) {
                    if (value["value"] != undefined) {
                        var i = 0, s = ""
                        for (i = 0; i < value["value"].length; i++) {
                            if (i == 0) {
                                s = value["value"][i]
                            } else {
                                s = s + "," + value["value"][i]
                            }
                        }
                        this.ownerCt.last["BorderType"] = "<div style='background:cyan'>"
                        + s + "</div>"
                    } else {
                        var i = 0, s = ""
                        for (i = 0; i < value.length; i++) {
                            if (i == 0) {
                                s = value[i]
                            } else {
                                s = s + "," + value[i]
                            }
                        }
                        this.ownerCt.last["BorderType"] = "<div style='background:cyan'>"
                        + s + "</div>"
                    }
                }
                return this.ownerCt.last["BorderType"]
            },
            PageOrienta : function(value) {
                if (value != null) {
                    if (value == "L")
                        this.ownerCt.last["PageOrienta"] = "Horizontal"
                    else
                        this.ownerCt.last["PageOrienta"] = "Vertical"
                }
                return this.ownerCt.last["PageOrienta"]
            },
            PageType : function(value) {
                if (value != null) {
                    if (value["name"] != undefined) {
                        this.ownerCt.last["PageType"] = value["name"]
                    } else {
                        this.ownerCt.last["PageType"] = value
                    }
                }
                return this.ownerCt.last["PageType"]
            },
            TypeObj : function(value) {
                switch (value) {
                    case "L" :
                        return "Label"
                        break;
                    case "A" :
                        return "Nro Pagina"
                        break;
                    case "F" :
                        return "Field"
                        break;
                    case "T" :
                        return "Total Field"
                        break;
                    case "S" :
                        return "Tabla"
                        break;
                    case "P" :
                        return "Imagen"
                        break;
                    case "Gt" :
                        return "Grafico de Torta"
                        break;
                    case "GS" :
                        return "Grupo de Seleccion"
                        break;
                    case "CB" :
                        return "Codigo de Barras"
                        break;
                }
            }
        }
        // ------------------------------------------------------------------------------------------
        me.dockedItems = [{
            xtype : "panel",
            hidden : me.conboSelect == true ? false : true,
            height : 30,
            layout : 'border',
            dock : 'top',
            items : [{
                region : 'center',
                xtype : "combo",
                idSections : -1,
                displayField : 'name',
                valueField : 'refIndiceInterno',
                editable : false,
                // selectOnFocus : true,
                forceSelection : true,
                store : "listaItemsActivos",
                queryMode : 'local',
                listeners : {
                    change : me.onSelectCombo.bind(me)
                }
            }]
        }, {
            xtype : "panel",
            style: { background: 'white !important' },
            hidden : me.helpPanelOculto == false ? false : true,
            height : 70,
            layout : 'border',
            dock : 'bottom',
            items : [{
                region : 'center',
                xtype : "displayfield",
                itemId : 'displayHelp',
                autoScroll : true,
                value : ""
            }]
        }]
        // ------------------------------------------------------------------------------------------
        me.source = {}
        me.callParent(arguments);
        me.onAfterInit()
        // ------------------------------------------------------------------------------------------
        var cc = this.getDockedItems()
        var ccc = this.getDockedItems()[2]
        this.help = this.getDockedItems()[2].items.getAt(0)
        // ------------------------------------------------------------------------------------------
        this.store.addListener("update", this.onUpdate.bind(this));
    // ------------------------------------------------------------------------------------------
    },
    onAfterInit : function() {
    },
    onSelectCombo : function(reg, value) {
        if (this.recargo == false) {
            if (value == null) {
                // var reff = this.refSection.Items[reg.getValue()].refView[0]
                this.resetValue = false
                this.setObjectRef(this.refSection.selectionGroup)
            } else {
                var reff = this.refSection.Items[reg.getValue()].refView[0]
                this.resetValue = false
                this.setObjectRef(reff)
            }
        }
    },
    setValProp : function(name, value) {
        if (value != undefined)
            this.objectPdf.my[name] = value
    },
    getValProp : function(name) {
        return this.objectPdf.my[name]
    },
    setFillColorRow : function(store, record, operacion, opts) {
        this.setValProp(record.data.name,
            kc.pdfStruc.colorNamesSk[record.data.value])
    },
    setCodigoBarraWid: function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
    },
    pase2:false,
    setCodigoBarraCalc: function(store, record, operacion, opts) {
        if (this.pase2 == false) {
            this.pase2 = true
            return
        }
        this.pase2 = false
		
		
		
        var cant=0		
        if ( this.objectPdf.my.Text != undefined ) {
            cant = this.objectPdf.my.Text.length
        }
        if (cant<=0) {
            cant = prompt("Cantidad de caracteres",cant);
			
        }
        if (cant!=null ) {
            aux=kc.pdfStruc.getWidhtCodeBarra(cant,this.objectPdf.my.CodigoBarraWid,this.objectPdf.my.CodigoBarraWid,this.objectPdf.my.CodigoBarra,this.objectPdf.my.Text)
            if ( confirm("Actualiza el Ancho a :" + aux + " mm") ) {
                this.objectPdf.my.PositionWidth=aux
                this.setPositionWidthDiv(this.objectPdf.my.PositionWidth)
            }
        }
		
		
		
        //if ( confirm()
        this.setValProp(record.data.name, record.data.value)
    },
    setLabelRotacion : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        if (this.setInObjectHtml == true) {
            kc.pdfStruc.GetRotacion(jQuery(this.objectRef),
                this.objectPdf.my.PositionWidth,this.objectPdf.my.PositionHeight, record.data.value)
        }

    },
    setCodigoBarra : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
    /*
		 * if (this.setInObjectHtml == true){
		 * kc.pdfStruc.GetRotacion(jQuery(this.objectRef),this.objectPdf.my.PositionWidth,record.data.value) }
		 */

    },
    pase : false,
    setGroupWidthIgualar : function(store, record, operacion, opts) {
        this.groupPositionIgual(store, record, operacion, opts);
    },
    setGroupHeightIgualar : function(store, record, operacion, opts) {
        this.groupPositionIgual(store, record, operacion, opts);
    },
    setGroupLeftIgualar : function(store, record, operacion, opts) {
        this.groupPositionIgual(store, record, operacion, opts);
    },
    setGroupTopIgualar : function(store, record, operacion, opts) {
        this.groupPositionIgual(store, record, operacion, opts);
    },

    setGroupWidth : function(store, record, operacion, opts) {
        this.groupPosition(store, record, operacion, opts);
    },
    setGroupHeight : function(store, record, operacion, opts) {
        this.groupPosition(store, record, operacion, opts);
    },
    setGroupLeft : function(store, record, operacion, opts) {
        this.groupPosition(store, record, operacion, opts);
    },
    setGroupTop : function(store, record, operacion, opts) {
        this.groupPosition(store, record, operacion, opts);
    },
    groupPositionIgual : function(store, record, operacion, opts) {
        if (this.pase == false) {
            this.pase = true
            return
        }
        this.pase = false
        this.objectRef.setToGroupPositionIgualar(record.data.name,
            record.data.value)

    },
    groupPosition : function(store, record, operacion, opts) {
        if (this.pase == false) {
            this.pase = true
            return
        }
        this.pase = false
        this.objectRef.setToGroupPosition(record.data.name, record.data.value)

    },
    paseGroupTye:false,
    setGroupBorderType: function(store, record, operacion, opts) {
        if (this.paseGroupTye == false) {
            this.paseGroupTye = true
            return
        }
        this.paseGroupTye = false
        this.objectRef.setGroupBorderType(record.data.name, record.data.value)
		
    },
    paseGroupSize:false,
    setGroupBorderSize : function(store, record, operacion, opts) {
        if (this.paseGroupSize == false) {
            this.paseGroupSize = true
            return
        }
        this.paseGroupSize = false
        this.objectRef.setGroupBorderSize(record.data.name, record.data.value)
    // -----------------------------------------------------------------------------------------
    },
    //**************************************************************
    paseGroupFontBold:false,
	
    setGroupFontBold : function(store, record, operacion, opts) {
        if (this.paseGroupFontBold == false) {
            this.paseGroupFontBold = true
            return
        }
        this.paseGroupFontBold = false
        this.objectRef.setGroupFontBold(record.data.name, record.data.value)
    },
    paseGroupFontFamily:false,
    setGroupFontFamily : function(store, record, operacion, opts) {
        if (this.paseGroupFontFamily == false) {
            this.paseGroupFontFamily = true
            return
        }
        this.paseGroupFontFamily = false
        this.objectRef.setGroupFontFamily(record.data.name, record.data.value)
    },
    paseGroupFontColor:false,
    setGroupFontColor : function(store, record, operacion, opts) {
        if (this.paseGroupFontColor == false) {
            this.paseGroupFontColor = true
            return
        }
        this.paseGroupFontColor = false
        this.objectRef.setGroupFontColor(record.data.name, record.data.value)
    },
    paseGroupFontItalic:false,
    setGroupFontItalic : function(store, record, operacion, opts) {
        if (this.paseGroupFontItalic == false) {
            this.paseGroupFontItalic = true
            return
        }
        this.paseGroupFontItalic = false
        this.objectRef.setGroupFontItalic(record.data.name, record.data.value)
    },
    paseGroupFontUnderLine:false,

    setGroupFontUnderLine : function(store, record, operacion, opts) {
        if (this.paseGroupFontUnderLine == false) {
            this.paseGroupFontUnderLine = true
            return
        }
        this.paseGroupFontUnderLine = false
        this.objectRef.setGroupFontUnderLine(record.data.name, record.data.value)
    },
    paseGroupFontSize:false,
    setGroupFontSize : function(store, record, operacion, opts) {
        if (this.paseGroupFontSize == false) {
            this.paseGroupFontSize = true
            return
        }
        this.paseGroupFontSize = false
        this.objectRef.setGroupFontSize(record.data.name, record.data.value)
    },
	
    paseGroupFontAlign:false,
    setGroupFontAlign : function(store, record, operacion, opts) {
        if (this.paseGroupFontAlign == false) {
            this.paseGroupFontAlign = true
            return
        }
        this.paseGroupFontAlign = false
        this.objectRef.setGroupFontAlign(record.data.name, record.data.value)
    },
	
	
	
	
    //**************************************************************
	
	
    setBorderColor : function(store, record, operacion, opts) {
        this.setValProp(record.data.name,
            kc.pdfStruc.colorNamesSk[record.data.value])
        if (this.setInObjectHtml == true)
            this.objectRef.style.setProperty("border-color",
                record.data.value.cN, null)
    },
    setBackGround : function(store, record, operacion, opts) {
        this.setValProp(record.data.name,
            kc.pdfStruc.colorNamesSk[record.data.value])
        if (this.setInObjectHtml == true)
            this.objectRef.style.setProperty(record.data.name,
                record.data.value, null)
    },
    setHeight : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        if (this.setInObjectHtml == true)
            this.objectRef.style.setProperty(record.data.name,
                record.data.value + "mm", null)
    },
    setMultiLine : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
    },
    setGrafTitle : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        if (this.setInObjectHtml == true)
            this.objectPdf.my.refView[0].firstElementChild.firstElementChild.innerHTML = record.data.value
    },
    setText : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        if (this.setInObjectHtml == true)
            this.objectPdf.my.refView[0].firstElementChild.firstElementChild.innerHTML = record.data.value
    },
    setFontAlign : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        if (this.setInObjectHtml == true)
            this.objectRef.firstChild.style.setProperty("text-align",
                record.data.value, null)
    },
    setPrintIfEmpyReg : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
    },
    setTitle : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
    },

    setTableHeightR : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        kc.pdfStruc.element.tableDraw(this.objectPdf.my)
    },
    setTableHeightH : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        kc.pdfStruc.element.tableDraw(this.objectPdf.my)
    },
    setTableHeightF : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        kc.pdfStruc.element.tableDraw(this.objectPdf.my)
    },
    setFontBold : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        if (this.setInObjectHtml == true) {
            if (record.data.value) {
                this.objectRef.firstElementChild.firstElementChild.style
                .setProperty("font-weight", "bold", null)
            } else {
                this.objectRef.firstElementChild.firstElementChild.style
                .setProperty("font-weight", "normal", null)
            }
        }
    },
    setFontFamily : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        if (this.setInObjectHtml == true)
            this.objectRef.firstElementChild.firstElementChild.style
            .setProperty("font-family", record.data.value, null)
    },
    setFontColor : function(store, record, operacion, opts) {
        this.setValProp(record.data.name,
            kc.pdfStruc.colorNamesSk[record.data.value])

        if (this.setInObjectHtml == true)
            this.objectPdf.my.refView[0].firstElementChild.firstElementChild.style
            .setProperty("color", record.data.value, null)
    },
    setFontItalic : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        if (this.setInObjectHtml == true) {
            if (record.data.value) {
                this.objectPdf.my.refView[0].firstElementChild.firstElementChild.style
                .setProperty("font-style", "italic", null)
            } else {
                this.objectPdf.my.refView[0].firstElementChild.firstElementChild.style
                .setProperty("font-style", "normal", null)
            }
        }
    },
    setFontUnderLine : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        if (this.setInObjectHtml == true) {
            if (record.data.value) {
                this.objectPdf.my.refView[0].firstElementChild.firstElementChild.style
                .setProperty("text-decoration", "underline", null)
            } else {
                this.objectPdf.my.refView[0].firstElementChild.firstElementChild.style
                .setProperty("text-decoration", "none", null)
            }
        }
    },
    setFontSize : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        if (this.setInObjectHtml == true)
            this.objectPdf.my.refView[0].firstElementChild.firstElementChild.style
            .setProperty("font-size", record.data.value + "pt", null)
    },
    setFormatType : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
    },
    setFormatMask : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
    },
    setSourceName : function(store, record, operacion, opts) {
        if (record.data.value != undefined) {
            this.setValProp(record.data.name, record.data.value)
        }
    },
    setDataSource : function(store, record, operacion, opts) {
        if (record.data.value != undefined) {
            this.setValProp(record.data.name, record.data.value)
            if (this.setInObjectHtml == true) {
                this.objectPdf.my.refView[0].firstElementChild.innerHTML = ":"
                + record.data.value.name
            }
        }
    },
    setPositionWidthDiv:function(ancho){
        this.objectRef.style.setProperty("width", ancho + "mm",
            null);
        kc.pdfStruc.GetRotacion(jQuery(this.objectRef),
            this.objectPdf.my.PositionWidth,
            this.objectPdf.my.PositionHeight,
            this.objectPdf.my.LabelRotacion)
		
    },
    setPositionWidth : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        if (this.setInObjectHtml == true) {
            this.setPositionWidthDiv(record.data.value)
        }
    },
    setPositionHeight : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        if (this.setInObjectHtml == true)
            this.objectRef.style.setProperty("height",
                record.data.value + "mm", null)
    },
    setPositionLeft : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        if (this.setInObjectHtml == true)
            this.objectRef.style.setProperty("left", record.data.value + "mm",
                null)
    },
    setPositionTop : function(store, record, operacion, opts) {
        this.setValProp(record.data.name, record.data.value)
        if (this.setInObjectHtml == true)
            this.objectRef.style.setProperty("top", record.data.value + "mm",
                null)
    },
    setBorderType : function(store, record, operacion, opts) {
        // -----------------------------------------------------------------------------------------
        var s = ""
        // -----------------------------------------------------------------------------------------
        var a = new Object();
        a["left"] = "";
        a["right"] = "";
        a["top"] = "";
        a["bottom"] = "";
        // -----------------------------------------------------------------------------------------
        for (i = 0; i < record.data.value.length; i++) {
            a[record.data.value[i].toLowerCase()] = "solid";
            s = s + record.data.value[i].substr(0, 1);
        }
        // -----------------------------------------------------------------------------------------
        var aux = this.getValProp(record.data.name)
        // -----------------------------------------------------------------------------------------
        aux.type = s;
        aux.value = record.data.value
        // -----------------------------------------------------------------------------------------
        if (this.setInObjectHtml == true) {
            this.objectRef.firstElementChild.style.setProperty(
                "border-left-style", a["left"], null)
            this.objectRef.firstElementChild.style.setProperty(
                "border-right-style", a["right"], null)
            this.objectRef.firstElementChild.style.setProperty(
                "border-top-style", a["top"], null)
            this.objectRef.firstElementChild.style.setProperty(
                "border-bottom-style", a["bottom"], null)
        }
    // -----------------------------------------------------------------------------------------
    },
    setBorderSize : function(store, record, operacion, opts) {
        // -----------------------------------------------------------------------------------------
        this.setValProp(record.data.name, record.data.value)
        // -----------------------------------------------------------------------------------------
        if (this.setInObjectHtml == true) {
            this.objectRef.firstElementChild.style.setProperty(
                "border-left-width", record.data.value, null)
            this.objectRef.firstElementChild.style.setProperty(
                "border-right-width", record.data.value, null)
            this.objectRef.firstElementChild.style.setProperty(
                "border-top-width", record.data.value, null)
            this.objectRef.firstElementChild.style.setProperty(
                "border-bottom-width", record.data.value, null)
        }
    // -----------------------------------------------------------------------------------------
    },
    setPageType : function(store, record, operacion, opts) {
        this.objectRef.pdfRef.my.PageType = kc.pdfStruc.pageType[record.data.value].type
        this._setMargins(this.objectRef.pdfRef.my,
            this.objectRef.pdfRef.my.refView[0])
    },
    _setMargins : function(ref, div) {
        var width
        if (ref.PageOrienta == "P") {
            width = ref.PageType.width - ref.MarginLeft - ref.MarginRight
        } else {
            width = ref.PageType.height - ref.MarginLeft - ref.MarginRight
        }
        div.style.setProperty("width", width + "mm", null)
    },
    setMarginLeft : function(store, record, operacion, opts) {
        this.objectRef.pdfRef.my.MarginLeft = record.data.value
        this._setMargins(this.objectRef.pdfRef.my,
            this.objectRef.pdfRef.my.refView[0])
    },
    setMarginRight : function(store, record, operacion, opts) {
        this.objectRef.pdfRef.my.MarginRight = record.data.value
        this._setMargins(this.objectRef.pdfRef.my,
            this.objectRef.pdfRef.my.refView[0])
    },
    setMarginTop : function(store, record, operacion, opts) {
        this.objectRef.pdfRef.my.MarginTop = record.data.value
        this._setMargins(this.objectRef.pdfRef.my,
            this.objectRef.pdfRef.my.refView[0])
    },
    setMarginBottom : function(store, record, operacion, opts) {
        this.objectRef.pdfRef.my.MarginBottom = record.data.value
        this._setMargins(this.objectRef.pdfRef.my,
            this.objectRef.pdfRef.my.refView[0])
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

    setGraficPrevious : function(store, record, operacion, opts) {
        Ajax.MyAjax.get().setController("reporte");
        Ajax.MyAjax.get().setAction("getGrafic");
        var cc = this.toSave(this.objectPdf.my)
        // -----------------------------------------------------------------------------------------
        Ajax.MyAjax.get().setJson(Ext.encode({
            json : cc
        }));
        // -----------------------------------------------------------------------------------------
        var result = Ajax.MyAjax.get().getInfo();
        if (result.success) {
            // var elemento = this.objectPdf.my.refView[0].firstElementChild
            var elemento = this.objectPdf.my.refView[0].firstElementChild.firstElementChild
            elemento.parentNode.removeChild(elemento);
            jQuery("<img  />", {
                src : "data:image/png;base64," + result.def
            }).appendTo(this.objectPdf.my.refView[0].firstElementChild)
            this.setValProp("ImagenEx", "data:image/png;base64," + result.def)
            rec = store.data.getByKey("PositionHeight")
            this.setValProp("PositionHeight", result.heigh)
            rec.set("value", result.heigh)
        // rec.set("PositionHeight",result.heigh)
        // this.setPositionHeight(store,rec)
        }
    // -----------------------------------------------------------------------------------------
    },
    setPageOrienta : function(store, record, operacion, opts) {
        this.objectRef.pdfRef.my.PageOrienta = record.data.value
        this._setMargins(this.objectRef.pdfRef.my,
            this.objectRef.pdfRef.my.refView[0])
    },
    onUpdate : function(store, record, operacion, opts) {
        var propety = record.data.name
        if (this["set" + propety] != undefined) {
            this["set" + propety](store, record, operacion, opts)
        }
    }
})