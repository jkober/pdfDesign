Ext.define('kc.pdfStruc.element', {
    singleton : true,
    _style : 'width: {0}mm;height:{1}mm;background-color:{2};position:absolute;',
    creoRow:function(item,row,Height,title,isRow,widthRow){
        var cells = jQuery("<div>",{
            style:"float:left"
        })
        .text(title)
        .data("col", item.name)
        .appendTo(row);
        var cell=cells[0];
            
        if (isRow==true) {
            cell.style.setProperty("width",widthRow + "mm",null);
        }else{
            cell.style.setProperty("width",item.PositionWidth + "mm",null);
        }
        cell.style.setProperty("height",Height + "mm",null);
        if (isRow==true) {
            var a = jQuery(cell);
            var title = item.FormatMask + "<>" + item.FormatType;
            a.attr({
                'title'	: title
            })
        }
        cell.style.setProperty("border-left-width"	, item.BorderSize, 	null);
        cell.style.setProperty("border-right-width"	, item.BorderSize, 	null);
        cell.style.setProperty("border-top-width"	, item.BorderSize, 	null);
        cell.style.setProperty("border-bottom-width", item.BorderSize,	null);
        //--------------------------------------------------------------------------------------
        cell.style.setProperty("BackGround"			, item.FillColorRow.cN	, null);
        //--------------------------------------------------------------------------------------
        cell.style.setProperty("border-left-style"	, item.BorderType.value.indexOf("Left")>=0?"solid":""	, null);
        cell.style.setProperty("border-right-style"	, item.BorderType.value.indexOf("Right")>=0?"solid":""	, null);
        cell.style.setProperty("border-top-style"	, item.BorderType.value.indexOf("Top")>=0?"solid":""	, null);
        cell.style.setProperty("border-bottom-style", item.BorderType.value.indexOf("Bottom")>=0?"solid":""	, null);
        //--------------------------------------------------------------------------------------
        cell.style.setProperty("border-left-color"	, item.BorderColor.cN, 	null);
        cell.style.setProperty("border-right-color"	, item.BorderColor.cN, 	null);
        cell.style.setProperty("border-top-color"	, item.BorderColor.cN, 	null);
        cell.style.setProperty("border-bottom-color", item.BorderColor.cN, 	null);
        //--------------------------------------------------------------------------------------
        //--------------------------------------------------------------------------------------
        cell.style.setProperty("font-size"		, 	item.FontSize+"pt"							, null);
        cell.style.setProperty("font-family"            , 	item.FontFamily								, null);
        cell.style.setProperty("color"			, 	item.FontColor.cN							, null);
        cell.style.setProperty("font-style"		, 	item.FontItalic==true?"italic":"normal"                                 , null);
        cell.style.setProperty("text-decoration"        , 	item.FontUnderLine==true?"underline":"none"                             , null);
        cell.style.setProperty("font-weight"            , 	item.FontBold==true?"bold":"normal"                                     , null);
        cell.style.setProperty("text-align"		, 	item.FontAlign								, null);				
        //--------------------------------------------------------------------------------------
        cell.style.setProperty("white-space"	, "nowrap"                                                                              , null);
        cell.style.setProperty("overflow"		, "hidden"                                                                      , null);
    //--------------------------------------------------------------------------------------
    },
    tableDraw:function(table){
        //----------------------------------------------------------------------
        var elemento = table.refView[0];
        var item;
        var width=0;
        //----------------------------------------------------------------------
        try{
            elemento.removeChild(elemento.firstChild);
        }catch(e){}
        //----------------------------------------------------------------------
        elemento = jQuery(table.refView[0]);
        //----------------------------------------------------------------------
        for (var i in table.TableHead.items) {
            width +=table.TableHead.items[i].PositionWidth;
        }
        //----------------------------------------------------------------------
        var tab = jQuery("<div/>",{
            style:"width="+width+"mm"
        }).appendTo(table.refView[0]);
        //----------------------------------------------------------------------
        var row = jQuery("<div>",{
            width:width+"mm",
            style:"display: inline;height:"+table.TableHeightH
        });
        //----------------------------------------------------------------------
        for (var i in table.TableHead.items) {
            item = table.TableHead.items[i];
            this.creoRow(item,row,table.TableHeightH,item.Title,false);
        }		
        //----------------------------------------------------------------------
        row.appendTo(tab);
        var row = jQuery("<div>",{
            width:width+"mm",
            style:"height:"+table.TableHeightR
        });
        for (var i in table.TableRow.items) {
            item = table.TableRow.items[i];
            this.creoRow(item,row,table.TableHeightR,item.name,true,table.TableHead.items[i].PositionWidth)
        }
        //----------------------------------------------------------------------
        row.appendTo(tab)
        //----------------------------------------------------------------------
    },	
    add : function(value) {
        // ---------------------------------------------------------------------
        var ref         	= value.ref;
        var contex      	= value.contex;
        var _Position   	= value.position;
        var add                 = false;
        var textos;
        var sstyle,httml;
        // ---------------------------------------------------------------------
        if (value.idItem != undefined){
            var oldCount	= value.idItem;
        }
        // ---------------------------------------------------------------------
        if (oldCount == undefined) {
            add = true
            var oldCount = contex.my.ItemsCount
        }
        // ---------------------------------------------------------------------
        switch (ref) {
            case "addTablet" :
                contex.my.Items[oldCount] 			= Ext.clone(kc.pdfStruc.Table);
                contex.my.Items[oldCount].TableHead.refParent	= contex.my.Items[oldCount];
                contex.my.Items[oldCount].TableRow.refParent	= contex.my.Items[oldCount];
                contex.my.Items[oldCount].TableFoot.refParent	= contex.my.Items[oldCount];
                contex.my.Items[oldCount].Sources.refParent	= contex.my.Items[oldCount];
                for ( var iii in contex.my.Items[oldCount].TableRow.items ) {
                    var ob = contex.my.Items[oldCount].TableRow.items[iii];
                    ob.SourceName.refParent = contex.my.Items[oldCount];
                    ob.SourceCode.refParent = contex.my.Items[oldCount];
                }
                textos = "Empy"
                break;
            case "addGrfT":
                contex.my.Items[oldCount] 			= Ext.clone(kc.pdfStruc.GrfT);
                textos = contex.my.Items[oldCount].GrafTitle;
                break;
            case "Gt":
                textos = contex.my.Items[oldCount].GrafTitle;
                break;
				
            case "S":
                contex.my.Items[oldCount].TableHead.refParent	= contex.my.Items[oldCount];
                contex.my.Items[oldCount].TableRow.refParent	= contex.my.Items[oldCount];
                contex.my.Items[oldCount].TableFoot.refParent	= contex.my.Items[oldCount];
                contex.my.Items[oldCount].Sources.refParent	= contex.my.Items[oldCount];
                break;
            case "addLabel" :
                contex.my.Items[oldCount] 			= Ext.clone(kc.pdfStruc.Label);
                textos = contex.my.Items[oldCount].Text;
                break;
            case "L" :
                textos = contex.my.Items[oldCount].Text;
                break;               
            case "addFieldTotal":
                contex.my.Items[oldCount] = Ext.clone(kc.pdfStruc.FieldTotal);
                contex.my.Items[oldCount].TotalFieldName = value.extraTota.FieldName;
                textos = value.extraTota.Type.substring(0,1) + "::" + value.extraTota.FieldName;				
                break;
            case "addImagen":
                contex.my.Items[oldCount] 			= Ext.clone(kc.pdfStruc.Imagen);
                contex.my.Items[oldCount].fileName 		= value.fileName;
                contex.my.Items[oldCount].TypeImagen		= value.TypeImagen;
                contex.my.Items[oldCount].PositionWidth 	= value.PositionWidth;
                contex.my.Items[oldCount].PositionHeight	= value.PositionHeight;
                break;
            case "P":
                break;
            case "T" :
                var tt = kc.pdfStrucRefActiva.TotalFields[contex.my.Items[oldCount].TotalFieldName];
                textos = tt.Type.substring(0,1) + "::" + contex.my.Items[oldCount].TotalFieldName;
                break;
            case "addNroPage":
                contex.my.Items[oldCount] = Ext.clone(kc.pdfStruc.NroPage);
                textos = contex.my.Items[oldCount].Text;
                break;
            case "addField" :
                contex.my.Items[oldCount] = Ext.clone(kc.pdfStruc.Field);
                if ( value.dataSource == undefined ) {
                    textos = "Falta Data Source";
                }else{
                    contex.my.Items[oldCount].DataSource = value.dataSource;
                    textos = ":" + value.dataSource.name;
                    if (value.format != undefined) {
                        var size = -1;
                        var type="char";
                        if (value.dataSource.numeric == true ) {
                            //isnum=true
                            type="num";
                            contex.my.Items[oldCount].FontAlign		= "Right";
                            size = value.dataSource.max_length;
                            if (value.dataSource.decimal > 0 ) {
                                size++;
                                contex.my.Items[oldCount].FormatMask	= value.dataSource.decimal;
                                contex.my.Items[oldCount].FormatType	= "Numero";
                            }
                        }else{
                            //ojo aca abria que ver el peso de la fuente para el width
                            //en otra etapa porque si es calculable jajaj
                            if (value.dataSource.type == "date") {
                                type="date";
                                //contex.my.Items[oldCount].PositionWidth	= tam
                                contex.my.Items[oldCount].FontAlign		= "Right";
                                contex.my.Items[oldCount].FormatMask            = "d/m/Y";
                                contex.my.Items[oldCount].FormatType            = "Fecha";
                                size = 11
                            }else{
                                if (value.dataSource.type == "datetime") {
                                    type="datetime";
                                    contex.my.Items[oldCount].FontAlign		= "Right";
                                    contex.my.Items[oldCount].FormatMask	= "d/m/Y H:i:s";
                                    contex.my.Items[oldCount].FormatType	= "Fecha";
                                    size = 19
                                }else{
                                    if (value.dataSource.type=="varchar") {
                                        //contex.my.Items[oldCount].PositionWidth	= tam 
                                        contex.my.Items[oldCount].FormatMask	= "";
                                        contex.my.Items[oldCount].FormatType	= "";
                                        size = value.dataSource.max_length;
                                    }
                                }
                            }
                        }
                        if ( size != -1) { 
                            var tam = kc.widthRelacion.getWidthString	(
                                size, 
                                contex.my.Items[oldCount].FontFamily, 
                                contex.my.Items[oldCount].FontSize,
                                contex.my.Items[oldCount].FontBold,
                                contex.my.Items[oldCount].FontItalic,
                                contex.my.Items[oldCount].FontUnderLine,
                                type
                                );
                            contex.my.Items[oldCount].PositionWidth = tam;																	
                        }
						
                    }
                }
                break;
            case "F" :
                if (contex.my.Items[oldCount].DataSource == "") {
                    textos = "Falta Data Source";
                } else {
                    textos = ":" + contex.my.Items[oldCount].DataSource.name;
                }
                break;
        }
        // -----------------------------------------------------------------------------------------
        var item = contex.my.Items[oldCount];
        // -----------------------------------------------------------------------------------------
        item.refParent = contex.my;
        // -----------------------------------------------------------------------------------------
        switch (ref) {
            case "addImagen":
            case "P":
                //----------------------------------------------------------------------------------
                httml = "<img style='overflow:hidden;width: 100%;height:100%' src='" + kcPatch.appWeb + item.fileName + "'></img>";					
                sstyle= Ext.String.format(this._style, item.PositionWidth,item.PositionHeight, "transparent")				
                //----------------------------------------------------------------------------------
                break;			
            case "addGrfT":
            case "Gt":
                httml = "<div><img style='overflow:hidden;width: 100%;height:100%' src='" + item.ImagenEx + "'></img></div>";					
                sstyle= Ext.String.format(this._style, item.PositionWidth,item.PositionHeight, "transparent")				
                break;			
            case "addTablet" :
            case "S":
                //----------------------------------------------------------------------------------
                httml 	= ""
                var ss	= 'position:absolute;';
                sstyle	= ss
                //----------------------------------------------------------------------------------
                break;
            default:
                //----------------------------------------------------------------------------------
                httml = "<div style='overflow:hidden;width: 100%;height:100%' ><span>" + textos + "</span></div>";
                sstyle= Ext.String.format(this._style, item.PositionWidth,item.PositionHeight, item.BackGround.cN)
                //----------------------------------------------------------------------------------
                break;
        }
        //class='rotateText90'
        contex.my.Items[oldCount].refView = jQuery("<div></div>", {
            html : httml,
            style : sstyle,
            class:"MyElement",
            //click : function(event,a,b,c,d) {
            click : function(event) {
               if (event.ctrlKey){
                    if ( event.currentTarget.classList.contains("ui-selected")) {
                        jQuery(event.currentTarget).find("ui-draggable").draggable("destroy");
                        event.currentTarget.classList.remove("ui-selected");
                        event.currentTarget.classList.remove("ui-draggable");
                        
                        var aux =jQuery(event.currentTarget).find(".ui-selected");
                        var div2
                        for (var ii = 0;ii<aux.length;ii++){
                            div2=aux[ii];
                            div2.classList.remove("ui-selected");
                            div2.classList.remove("ui-draggable");
                        }
                    }else{
                        event.stopPropagation();
                        kc.pdfStruc.element.selection(contex,this);
                        
                    }
                }else{
                    event.stopPropagation();
                    kc.pdfStruc.element.selection(contex,this);
                }
            },
            contextmenu : function(e) {
                e.stopImmediatePropagation();
                e.stopPropagation();
                kc.pdfStruc.contextuales.Element.setContex(
                    e.currentTarget.pdfRef, {
                        Y : e.pageY - jQuery(e.target).offset().top,
                        X : e.pageX - jQuery(e.target).offset().left
                    }, e.currentTarget);
                kc.pdfStruc.contextuales.Element.show();
                kc.pdfStruc.contextuales.Element.setPosition(e.pageX, e.pageY);
                return false;
            }
        }).appendTo(contex.my.refView);
        //----------------------------------------------------------------------
        contex.my.refView.selectable({
            selected:function( event, ui ) {
                if (ui.selected.firstChild != undefined)
                    if (ui.selected.firstChild.classList !=undefined)
                        ui.selected.firstChild.classList.add("ui-selected");
            },            
            unselecting:function( event, ui ) {
                if (ui.unselecting.firstChild != undefined)
                    if (ui.unselecting.firstChild.classList !=undefined)
                        ui.unselecting.firstChild.classList.remove("ui-selected");
            },
            stop: function(ev, ui) {
                var div;
                var div2;
                var todeselect;
                var ii,i;
                var toDeselect =jQuery(kc.pdfStrucRefActiva.refView).find("div.ui-selected.MyElement");
                for (i = 0;i<toDeselect.length;i++){
                    div = toDeselect[i];
                    if ( div.pdfRef.my.refParent.idSections != contex.my.idSections ) {
                        todeselect= jQuery(div).find(".ui-selected");
                        for (ii = 0;ii<todeselect.length;ii++){
                            div2=todeselect[ii];
                            div2.classList.remove("ui-selected");
                        }
                    }
                }
                kc.pdfStruc.element.selection(contex,this);
                jQuery(this).find("div.ui-draggable").draggable("destroy");
                jQuery(this).find("div.ui-selected.MyElement").draggable({
                    //start: function(event, ui) {
                    start: function() {
                        if (this.resiz!=undefined) {
                            if (this.resiz==true) {
                                return false;
                            }
                        }
                    },        
                    stop : function(event, ui) {
                        if (this.resiz!=undefined) {
                            if (this.resiz==true) {
                                return true;
                            }
                        }
                        //event.stopPropagation();
                        var toMove = jQuery(contex.my.refView).find("div.ui-selected.MyElement")
                        var div;
                        if ( ! ui.helper[0].classList.contains("ui-selected") ) {
                            div = ui.helper[0];
                            div.pdfRef.my.PositionTop =  kc.pdfStruc.toMm(ui.position.top )
                            div.style.setProperty("top",div.pdfRef.my.PositionTop + "mm", null)
                            //--------------------------------------------------
                            div.pdfRef.my.PositionLeft = kc.pdfStruc.toMm(ui.position.left)
                            div.style.setProperty("left", div.pdfRef.my.PositionLeft	+ "mm", null)
                            //--------------------------------------------------
                        }else{
                            /*
                            var topOri  = kc.pdfStruc.toMm(ui.originalPosition.top)
                            var top     = kc.pdfStruc.toMm(ui.position.top)
                            var leftOri = kc.pdfStruc.toMm(ui.originalPosition.left)
                             */
                            //--------------------------------------------------
                            var topOri  = kc.pdfStruc.toMm(ui.originalPosition.top);
                            var top     = kc.pdfStruc.toMm(ui.position.top);
                            //--------------------------------------------------
                            var leftOri = kc.pdfStruc.toMm(ui.originalPosition.left);
                            var left    = kc.pdfStruc.toMm(ui.position.left);
                            //--------------------------------------------------
                            var topX    = top -topOri;
                            var leftX   =  left - leftOri;
                            //--------------------------------------------------
                            for (var i = 0;i<toMove.length;i++){
                                div = toMove[i];
                                //----------------------------------------------
                                div.pdfRef.my.PositionTop =  kc.pdfStruc.toMm(div.pdfRef.my.PositionTop + topX + "mm");
                                //----------------------------------------------
                                if (div.pdfRef.my.PositionTop < 0 ) {
                                    div.pdfRef.my.PositionTop=0;
                                }
                                //----------------------------------------------
                                if ( div.pdfRef.my.PositionTop > ( div.pdfRef.my.refParent.Height - div.pdfRef.my.PositionHeight ) ) {
                                    if ( ( div.pdfRef.my.refParent.Height - div.pdfRef.my.PositionHeight) >= 0 ) {
                                        div.pdfRef.my.PositionTop = div.pdfRef.my.refParent.Height - div.pdfRef.my.PositionHeight;
                                    }
                                }
                                div.style.setProperty("top",div.pdfRef.my.PositionTop + "mm", null)
                                //----------------------------------------------
                                div.pdfRef.my.PositionLeft = kc.pdfStruc.toMm(div.pdfRef.my.PositionLeft + leftX + "mm")
                                div.style.setProperty("left", div.pdfRef.my.PositionLeft	+ "mm", null)
                                console.debug(div.pdfRef.my.PositionTop)
                            }
                        }
                    },
                    containment : contex.my.refView  
                });
            }
        });
        if (item.LabelRotacion == undefined) {
            item.LabelRotacion = kc.pdfStruc.PdfPage.reportExtras.configDefault.LabelRotacion;
        }
        //----------------------------------------------------------------------
        kc.pdfStruc.GetRotacion(jQuery(contex.my.Items[oldCount].refView),item.PositionWidth,item.PositionHeight,item.LabelRotacion);
        //----------------------------------------------------------------------
        switch (ref) {
            case "addTablet" :
            case "S":
                break;
            default:
                this.extResize(contex.my.Items[oldCount].refView[0],contex.my.refView[0],item.fileName == undefined?false:true);				
                break;
        }
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
        contex.my.Items[oldCount].refView[0].pdfRef = {
            my : contex.my.Items[oldCount],
            idRef : oldCount,
            grd : contex.grd
        }
        //----------------------------------------------------------------------
        contex.my.Items[oldCount].refIndiceInterno = oldCount;
        //----------------------------------------------------------------------
        var objToStyle = contex.my.Items[oldCount].refView[0].firstElementChild;
        //----------------------------------------------------------------------
        switch (ref) {
            case "addTablet" :
            case "S":
                this.tableDraw(item);
                break;
            default:		
                //--------------------------------------------------------------
                objToStyle.style.setProperty("border-left-width",	item.BorderSize, 	null);
                objToStyle.style.setProperty("border-right-width",	item.BorderSize, 	null);
                objToStyle.style.setProperty("border-top-width", 	item.BorderSize, 	null);
                objToStyle.style.setProperty("border-bottom-width"      , item.BorderSize,	null);
                //--------------------------------------------------------------
                objToStyle.style.setProperty("border-left-style",	item.BorderType.value.indexOf("Left")>=0?"solid":"" , 	null);
                objToStyle.style.setProperty("border-right-style",	item.BorderType.value.indexOf("Right")>=0?"solid":"", 	null);
                objToStyle.style.setProperty("border-top-style",	item.BorderType.value.indexOf("Top")>=0?"solid":"", 	null);
                objToStyle.style.setProperty("border-bottom-style",	item.BorderType.value.indexOf("Bottom")>=0?"solid":"", 	null);
                //--------------------------------------------------------------
                objToStyle.style.setProperty("border-left-color",	item.BorderColor.cN, 	null);
                objToStyle.style.setProperty("border-right-color",	item.BorderColor.cN, 	null);
                objToStyle.style.setProperty("border-top-color",	item.BorderColor.cN, 	null);
                objToStyle.style.setProperty("border-bottom-color",	item.BorderColor.cN, 	null);				
                //--------------------------------------------------------------
				
                if (item.fileName == undefined && ( ref !="addGrfT" && ref != "Gt" ) ) {
                    //----------------------------------------------------------
                    objToStyle.firstElementChild.style.setProperty("font-size"		, item.FontSize+"pt",                           null);
                    objToStyle.firstElementChild.style.setProperty("font-family"	, item.FontFamily,                              null);
                    objToStyle.firstElementChild.style.setProperty("color"		, item.FontColor.cN,                            null);
                    objToStyle.firstElementChild.style.setProperty("font-style"		, item.FontItalic==true?"italic":"normal",	null);
                    objToStyle.firstElementChild.style.setProperty("text-decoration"    , item.FontUnderLine==true?"underline":"none",	null);
                    objToStyle.firstElementChild.style.setProperty("font-weight"	, item.FontBold==true?"bold":"normal",          null);
                    objToStyle.firstElementChild.style.setProperty("text-align"		, item.FontAlign,                               null);
                    //----------------------------------------------------------
                    objToStyle.firstElementChild.style.setProperty("white-space",	"nowrap",	null);
                    objToStyle.firstElementChild.style.setProperty("overflow",		"hidden", 	null);
                    //----------------------------------------------------------
                    objToStyle.style.setProperty("font-size"		, item.FontSize+"pt",                           null);
                    objToStyle.style.setProperty("font-family"          , item.FontFamily,                              null);
                    objToStyle.style.setProperty("color"		, item.FontColor.cN,                            null);
                    objToStyle.style.setProperty("font-style"		, item.FontItalic==true?"italic":"normal",	null);
                    objToStyle.style.setProperty("text-decoration"      , item.FontUnderLine==true?"underline":"none",	null);
                    objToStyle.style.setProperty("font-weight"          , item.FontBold==true?"bold":"normal",          null);
                    objToStyle.style.setProperty("text-align"		, item.FontAlign,                               null);
                    //----------------------------------------------------------
                    objToStyle.style.setProperty("white-space"          , "nowrap",                                     null);
                    objToStyle.style.setProperty("overflow"             , "hidden",                                     null);
                    //----------------------------------------------------------
                }				
                break;
        }
        //----------------------------------------------------------------------
        contex.my.Items[oldCount].PositionTop	= kc.pdfStruc.toMm(_Position.Y);
        contex.my.Items[oldCount].PositionLeft	= kc.pdfStruc.toMm(_Position.X);
        //----------------------------------------------------------------------
        contex.my.Items[oldCount].refView[0].style.setProperty("top",	contex.my.Items[oldCount].PositionTop + "mm", null);
        contex.my.Items[oldCount].refView[0].style.setProperty("left",	contex.my.Items[oldCount].PositionLeft+ "mm", null);
        //----------------------------------------------------------------------
        contex.grd.setObjectRef(contex.my.Items[oldCount].refView[0]);
        //----------------------------------------------------------------------
        if (add==true)
            contex.my.ItemsCount++
        //----------------------------------------------------------------------
    },
    extResize:function(element,constrainTo,preserveRatio) {
        //var c= Ext.create('Ext.resizer.Resizer', {
        Ext.create('Ext.resizer.Resizer', {
            el: Ext.get(element),
            preserveRatio:preserveRatio,
            transparent:true,
            minHeight:0,
            minWidth:0,
            dynamic:true,
            handles: 's e se',
            constrainTo:constrainTo,
            pinned: false,
            listeners:{
                beforeresize:function(){
                    var cc      = this.getTarget().dom;
                    cc.resiz    = true;
                },
                //resize:function(a,b,c,d,e,f,g,h){
                resize:function(){
                    //----------------------------------------------------------
                    var ccR = this.getTarget().dom;
                    var toResize = jQuery(ccR.pdfRef.my.refParent.refView).find("div.ui-selected.MyElement");
                    var cc;
                    //----------------------------------------------------------
                    if ( toResize.length > 1 ) {
                        if ( !confirm("Desea Cambiar los Tamaños") ) {
                            return false;
                        }
                    }
                    //----------------------------------------------------------
                    var height = kc.pdfStruc.toMm(ccR.pdfRef.my.refView.height()) - ccR.pdfRef.my.PositionHeight;
                    var width =  kc.pdfStruc.toMm(ccR.pdfRef.my.refView.width())  - ccR.pdfRef.my.PositionWidth;
                    for (var i = 0;i<toResize.length;i++){
                        cc =toResize[i];
                        /*cc.pdfRef.my.PositionHeight = kc.pdfStruc.toMm(cc.pdfRef.my.refView.height())
                        cc.pdfRef.my.PositionWidth 	= kc.pdfStruc.toMm(cc.pdfRef.my.refView.width())*/
                        cc.pdfRef.my.PositionHeight = cc.pdfRef.my.PositionHeight + height;
                        cc.pdfRef.my.PositionWidth 	= cc.pdfRef.my.PositionWidth + width;
                        
                        
                        cc.style.setProperty("height"	, cc.pdfRef.my.PositionHeight	+ "mm",         null);
                        cc.style.setProperty("width"	, cc.pdfRef.my.PositionWidth 	+ "mm",         null);
                        cc.style.setProperty("top"	, cc.pdfRef.my.PositionTop      + "mm",         null);
                        cc.style.setProperty("left"	, cc.pdfRef.my.PositionLeft 	+ "mm",         null);
                    }
                    ccR.pdfRef.grd.setObjectRef(ccR);
                    ccR.resiz=false;
                }
            }    		
        });
    },
    selection:function(contex,objRef){
        var toSelect = jQuery(contex.my.refView).find("div.ui-selected.MyElement");
        if (toSelect.length <=1){
        	if (objRef.pdfRef.my.refParent != null )
            	objRef.pdfRef.my.refParent.selectionGroup=null
            objRef.pdfRef.grd.setObjectRef(objRef)
        }else{
            var aux=Ext.clone(kc.pdfStruc.ObjectGroup);
            //var div = {};
            var div={ 
                pdfRef : {
                            my : aux,
                            idRef : 0,
                            grd : contex.grd,
                            refAtodos:toSelect[0].pdfRef.my.refParent
                        }
                };
            //------------------------------------------------------------------
            toSelect[0].pdfRef.my.refParent.selectionGroup=div;
            //------------------------------------------------------------------
            div.setToGroupPosition=function(name,value){
                if (confirm("Confirma el cambio")){
                    var prope = name.substr(5,name.length)
                    for (var i = 0;i<toSelect.length;i++){
                        div = toSelect[i];
                        div.pdfRef.my["Position" + prope ] =  kc.pdfStruc.toMm(div.pdfRef.my["Position" + prope ] + value + "mm");// kc.pdfStruc.toMm(ui.position.top)
                        div.style.setProperty(prope.toLowerCase(),div.pdfRef.my["Position" + prope ] + "mm", null);
                    }
                }
            };
            //------------------------------------------------------------------
            div.setToGroupPositionIgualar=function(name,value){
                if (confirm("Confirma el cambio")){
                    var prope = name.substring(5,name.length - 7 );
                    for (var i = 0;i<toSelect.length;i++){
                        div = toSelect[i];
                        div.pdfRef.my["Position" + prope ] =  kc.pdfStruc.toMm(value + "mm");// kc.pdfStruc.toMm(ui.position.top)
                        div.style.setProperty(prope.toLowerCase(),div.pdfRef.my["Position" + prope ] + "mm", null);
                    }
                }
            };
            //------------------------------------------------------------------
            div.setGroupBorderType=function(name,value){
                if (confirm("Confirma el cambio")){
                    // ---------------------------------------------------------
                    var s           = "";
                    var a           = new Object();
                    // ---------------------------------------------------------
                    a["left"]       = "";
                    a["right"]      = "";
                    a["top"]        = "";
                    a["bottom"]     = "";
                    // ---------------------------------------------------------
                    for (i = 0; i < value.length; i++) {
                            a[value[i].toLowerCase()] = "solid";
                            s = s + value[i].substr(0, 1);
                    }
                    // ---------------------------------------------------------
                    for (var i = 0;i<toSelect.length;i++){
                        div = toSelect[i];
                        div.firstElementChild.style.setProperty(
                                         "border-left-style", a["left"],    null);
                        div.firstElementChild.style.setProperty(
                                        "border-right-style", a["right"],   null);
                        div.firstElementChild.style.setProperty(
                                        "border-top-style", a["top"],       null);
                        div.firstElementChild.style.setProperty(
                                        "border-bottom-style", a["bottom"], null);
                                        
                        div.pdfRef.my["BorderType"].type     =  s;
                        div.pdfRef.my["BorderType"].value    = value;
                    }
                    // ---------------------------------------------------------
                }
            };
            div.setGroupBorderSize=function(name,value){
                if (confirm("Confirma el cambio")){
                    // ---------------------------------------------------------
                    for (var i = 0;i<toSelect.length;i++){
                        div = toSelect[i];
			div.firstElementChild.style.setProperty(
					"border-left-width", value,         null);
			div.firstElementChild.style.setProperty(
					"border-right-width", value,        null);
			div.firstElementChild.style.setProperty(
					"border-top-width", value,          null);
			div.firstElementChild.style.setProperty(
					"border-bottom-width", value,       null);
                        div.pdfRef.my["BorderSize"]     =  value;
                    }
                    // ---------------------------------------------------------
                }
            };
            div.setGroupFontBold=function(name,value){
                if (confirm("Confirma el cambio")){
                    for (var i = 0;i<toSelect.length;i++){
                        div = toSelect[i];
                        if (value) {
                            div.firstElementChild.firstElementChild.style.setProperty("font-weight", "bold", null);
                        } else {
                            div.firstElementChild.firstElementChild.style.setProperty("font-weight", "normal", null);
                        }
                        div.pdfRef.my["FontBold"]     =  value;
                    }
                }
            };
            div.setGroupFontFamily=function(name,value){
                if (confirm("Confirma el cambio")){
                    for (var i = 0;i<toSelect.length;i++){
                        div = toSelect[i];
			div.firstElementChild.firstElementChild.style.setProperty("font-family", value, null);
                        div.pdfRef.my["FontFamily"]     =  value;
                    }
                }
            };
            div.setGroupFontColor=function(name,value){
                if (confirm("Confirma el cambio")){
                    for (var i = 0;i<toSelect.length;i++){
                        div = toSelect[i];
			div.firstElementChild.firstElementChild.style.setProperty("color", value, null);
                        div.pdfRef.my["FontColor"]     =  kc.pdfStruc.colorNamesSk[value];
                    }
                }
            };
            div.setGroupFontItalic=function(name,value){
                if (confirm("Confirma el cambio")){
                    for (var i = 0;i<toSelect.length;i++){
                        div = toSelect[i];
                        if (value) {
                                div.firstElementChild.firstElementChild.style.setProperty("font-style", "italic", null);
                        } else {
                                div.firstElementChild.firstElementChild.style.setProperty("font-style", "normal", null);
                        }
                        div.pdfRef.my["FontItalic"]     =  value;
                    }
                }
            };
            div.setGroupFontUnderLine=function(name,value){
                if (confirm("Confirma el cambio")){
                    for (var i = 0;i<toSelect.length;i++){
                        div = toSelect[i];
                        if (value) {
                                div.firstElementChild.firstElementChild.style
                                                .setProperty("text-decoration", "underline",    null);
                        } else {
                                div.firstElementChild.firstElementChild.style
                                                .setProperty("text-decoration", "none",         null);
                        }
                        div.pdfRef.my["FontUnderLine"]     =  value;
                    }
                }
            };
            div.setGroupFontSize=function(name,value){
                if (confirm("Confirma el cambio")){
                    for (var i = 0;i<toSelect.length;i++){
                        div = toSelect[i];
                        div.firstElementChild.firstElementChild.style.setProperty("font-size", value + "pt", null);
                        div.pdfRef.my["FontSize"]     =  value;
                    }
                }
            };
            div.setGroupFontAlign=function(name,value){
                if (confirm("Confirma el cambio")){
                    for (var i = 0;i<toSelect.length;i++){
                        div = toSelect[i];
                        div.firstElementChild.style.setProperty("text-align",value, null);
                        div.pdfRef.my["FontAlign"]     =  value;
                    }
                }
            };
            // -----------------------------------------------------------------
            objRef.pdfRef.grd.setObjectRef(div);
            // -----------------------------------------------------------------
        }
    }
});