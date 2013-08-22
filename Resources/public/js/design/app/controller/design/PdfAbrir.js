Ext.define('AppDesign.controller.design.PdfAbrir', {
    // ---------------------------------------------------------------------------------------------
    extend: 'Ext.app.Controller',
    views: ["AppDesign.view.design.PdfAbrir"],
    refs: [{ref: 'win', selector: 'pdfAbrir'},
        {ref: 'grd', selector: 'pdfAbrir > gridpanel'}],
    // ---------------------------------------------------------------------------------------------
    init: function() {
        this.control({
            'pdfAbrir #seleccionar': {
                click: this.seleccionar
            },
            'pdfAbrir #cancelar': {
                click: this.cancelar
            }/*,
             'pdfImagen grid' : {
             dbclick : this.seleccionar
             }*/
        });
    },
    seleccionar: function() {
        var model;
        try {
            model = this.getGrd().getSelectionModel()
        } catch (e) {
            return false;
        }
        var records = model.getSelection()
        if (records.length == 0) {
            return false;
        }
        records = records[0];
        var win = this.getWin();
        win._extras.nameFile = records.get("fileName");
/*        win._extras.id          = records.get("id");
        win._extras.bkp         = records.get("bkp");*/
        this.cancelar();
        win._extras.func(records.get("fileName"),records.get("id"),records.get("bkp"));
        ;
    },
    cancelar: function() {
        // -----------------------------------------------------------------------------------------
        this.getWin().close()
        // -----------------------------------------------------------------------------------------
    }
})