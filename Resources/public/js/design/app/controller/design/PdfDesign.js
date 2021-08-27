Ext.define('AppDesign.controller.design.PdfDesign', {
    requires: ["kc.pdfStruc.Struct","Ajax.MyAjax"],
    mixins:{
        page:'AppDesign.controller.design.event.PageEvent',
        menu:'AppDesign.controller.design.event.MenuEvent'
    },
    //----------------------------------------------------------------------------------------------
    extend		: 'Ext.app.Controller',
    views		: ["AppDesign.view.design.PdfDesign"],
    //----------------------------------------------------------------------------------------------
    pdfStruc	: null,
    storeField	: null,
    refs: [
    {
        ref: 'sql',		
        selector	: '#sql'
    },
    {
        ref: 'PanelSql',		
        selector	: 'pdfDesign #editarSql'
    },
    	
    {
        ref: 'gridTotal', 	
        selector	: '#grdTotalFiel'
    },{
        ref:'dbBase',    	
        selector:'toolbar >#dbBase'
    },
    {
        ref:'reportName',    	
        selector:'toolbar >#reporName'
    },
{
        ref:'zoom',    	
        selector:'toolbar >#zoomValue'
    }     
    ],
    //--------------------------------------------------------------------------
    init : function() {
        //------- fix para evitar boton atas------------------------------------
        /*document.onkeydown=function(a){
            if (a.keyCode==8 ) {
                if ( a.target.nodeName == "BODY" ) {
                    a.preventDefault()
                }
            }
        }*/
        //----------------------------------------------------------------------
        this.storeField		= Ext.getStore("fieldJk");
        this.storeFieldTotal	= Ext.getStore("fieldJks");
        //----------------------------------------------------------------------
        this.control({
            '#editarSql':{
                afterlayout:this.pageCodeMirror
            },
            'tabpanel >#page' : {
                afterrender : this.pageAfterRender
            },
            'panel >#procesarSql' : {
                click: this.pageSqlUpdate
            },
            'menu >#guardarReporte' : {
                click:this.menuEventGuardarRep
            },
            'toolbar >#zoom' : {
                change:this.setZoomValue
            },
            'toolbar >#dbBase':{
                change:this.reporteUpdateBase
            },
            'toolbar >#guardarReporte' : {
                click:this.menuEventGuardarRep
            },            
            'toolbar >#abrirReporte' : {
                click:this.menuEventAbrirRepSinBkp
            },
            'toolbar >#abrirReporteBkp' : {
                click:this.menuEventAbrirRepConBkp
            },
            'toolbar >#verPdf' : {
                click:this.verPdf
            },
            
            'toolbar >#guardarReporteAs' : {
                click:this.menuEventGuardarRepAs
            },
            'toolbar >#configurarReporte' : {
                click:this.menuEventConfigurarReporte
            },
            '#grdTotalFiel #drop':{
                click:this.dropGrdTotalField
            },
            '#grdTotalFiel #add':{
                click:this.addGrdTotalField
            },
            
            'pdfOpciones' : {
                close : function(){
                    this.getDbBase().setValue(kc.pdfStrucRefActiva.reportExtras.bdName)
                }
            },
            'toolbar >#procesarSql' : {
                click: this.pageSqlUpdate
            },
            
            
            '#grdTotalFiel #edit':{
                click:this.editGrdTotalField
            }
        });
    },
    meMostreCodeMirror:false,
    pageCodeMirror:function(){
      if (this.meMostreCodeMirror == false ) {
          this.meMostreCodeMirror=true
          this.getPanelSql().collapse()
          //alert("ddddhhh")
      }
    },
    verPdf:function(){
        //------------------------------------------------------------------------------------------
        var aux		= this.getToSave()
        var json	= Ext.encode(aux)
        //------------------------------------------------------------------------------------------
        Ajax.MyAjax.get().setController("reporte");
        Ajax.MyAjax.get().setAction("ReporteVer");
        //------------------------------------------------------------------------------------------
        Ajax.MyAjax.get().setJson(json);
        //------------------------------------------------------------------------------------------
        var result	= Ajax.MyAjax.get().getInfo();
        //------------------------------------------------------------------------------------------
        if ( result 				== null 		) {
            alert("hay Errores para generar, desconocidos")
            return false;
        }
        if ( result.data 			== undefined 	) {
            alert("hay Errores para generar, desconocidos")
            return false;
        }
        if ( result.data 			== null 		) {
            alert("hay Errores para generar, desconocidos")
            return false;
        }
        if ( result.data.success 	== undefined	) {
            alert("hay Errores para generar, desconocidos")
            return false;
        }
        if ( result.data.success 	== false	) {
            if (result.data.result == undefined) {
                alert("Hay errores en la generacion")
                return false;
            }
            alert("Error:\n" +result.data.result)
            return false;
        }
        if ( result.data.result 	== null 		) {
            alert("hay Errores para generar, desconocidos")
            return false;
        }
        //------------------------------------------------------------------------------------------
        window.showModalDialog ( "" + result.data.result )
    //------------------------------------------------------------------------------------------
    },
    addGrdTotalField:function(){
        var c = Ext.createByAlias("widget.pdfTotalField",{
            pdfStruc:this.pdfStruc,
            pdfGrid:this.gridProRef,
            action:"new"
        })
        c.show();
    },		
    editGrdTotalField:function(){
        //----------------------------------------------------------------------
        var model;
        var grd = this.getGridTotal();
        //----------------------------------------------------------------------
        try {
            model = grd.getSelectionModel()
        } catch (e) {
            return true;
        }
        //----------------------------------------------------------------------
        /** @type Array() */
        var records = model.getSelection();
        //----------------------------------------------------------------------
        if ( records.length==0 ) {
            return true;
        }
        //----------------------------------------------------------------------
        var c = Ext.createByAlias("widget.pdfTotalField",{
            pdfStruc:this.pdfStruc,
            pdfGrid:this.gridProRef,
            action:"edit",
            recordRef:records[0]
        });
        //----------------------------------------------------------------------
        c.show();
        //----------------------------------------------------------------------
    //------------------------------------------------------------------------------------------
    },
    dropGrdTotalField:function(){

        //----------------------------------------------------------------------
        var model;
        var selection;
        var grd = this.getGridTotal();
        //----------------------------------------------------------------------
        try {
            model = grd.getSelectionModel()
            selection = model.getSelection();
        } catch (e) {
            return true;
        }
        //----------------------------------------------------------------------
        /** @type Array() */
        //----------------------------------------------------------------------
        if ( selection.length==0 ) {
            return true;
        }
        //----------------------------------------------------------------------
        if ( selection.length==0 ) {
            alert("Debe seleccionar un item para borrar")
            return true;
        }
        if (selection.length > 0) {
            for (var i = 0; i < selection.length; i++) {
                if (confirm("Desea borrar este campo:"+ selection[i].get("FieldName") + "\n Tenga en cuenta que si el total field esta referenciado en algun lado, va a generar problemas.")) {
                    let aa = selection[i].get("FieldName");
                    this.storeFieldTotal.remove(selection[i]);
                    this.storeFieldTotal.sync();
                    delete this.pdfStruc.TotalFields[aa];
                }
            }
        }



    }
});