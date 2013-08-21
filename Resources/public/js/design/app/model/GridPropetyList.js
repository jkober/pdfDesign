// ------------------------------------------------------------------------------
Ext.define("AppDesign.model.GridPropetyList", {});
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
Ext.create('Ext.data.Store', {
    storeId : 'listaItemsActivos',
    fields : ["TypeObj", "Text", "TotalFieldName", "DataSource",
    "refIndiceInterno", "fileName", {

        name : 'name',
        convert : function(value, record) {
            var ref = record.get('refIndiceInterno');
            var type = record.get('TypeObj');
            if (type == "L") {
                return "Label (" + ref + ") "
                + record.get('Text')
            }
            if (type == "F") {
                var data = record.get('DataSource');
                if (data.name != undefined) {
                    return "Field (" + ref + ") " + data.name
                } else {
                    return "Field (" + ref
                    + ") Falta Selccionar"
                }
            } else {
                if (type == "P") {
                    var data = record.get('fileName');
                    return "Imagen (" + ref + ") " + data
                } else {
                    if (type == "A") {
                        return "N° Pagina (" + ref + ") "
                        + record.get('Text')
                    } else {
                        if (type == "S") {
                            return "Table (" + ref + ") "
                            + record.get('Text')
                        } else {
                            if (type == "Gt") {
                                return "Grafico Torta (" + ref
                                + ") "
                                + record.get('Text')
                            }else{
                                if (type == "GS") {
                                    return "Grupo de Seleccion";
                                }else{
                                    if (type == "CB") {
                                        return "Codigo de Barras";
                                                                                                    
                                    }
                                }
                            }
                        }
                    }

                }
            }
        }
    }],
    data : []
});
// ------------------------------------------------------------------------------
Ext.create('Ext.data.Store', {
    storeId : 'statesjkPageOrienta',
    fields : ['name', "value"],
    data : [{
        name : 'Vertical',
        value : 'P'
    }, {
        name : 'Horizontal',
        value : 'L'
    }]
});
Ext.create('Ext.data.Store', {
    storeId : 'fieldJkExtras',
    fields : ['name'],
    data : [{
        name : 'label'
    }, {
        name : 'imagen'
    }, {
        name : 'NroPagina'
    }, {
        name : 'Tabla'
    }, {
        name : 'Grafico Torta'
    }]
});


Ext.create('Ext.data.Store', {
    storeId : 'statesjkBorder',
    fields : ['name'],
    data : [{
        name : 'Left'
    }, {
        name : 'Right'
    }, {
        name : 'Top'
    }, {
        name : 'Bottom'
    }]
});
// ------------------------------------------------------------------------------
Ext.create('Ext.data.Store', {
    storeId : 'statesjkRotacion',
    fields : ['name'],
    data : [{
        name : 'Rotacion_0'
    }, {
        name : 'Rotacion_90'
    }]
});
// ------------------------------------------------------------------------------
Ext.create('Ext.data.Store', {
    storeId : 'fieldJk',
    fields : ['name', "extra", "nameDisp"],
    data : []
});
Ext.create('Ext.data.Store', {
    storeId : 'fieldJks',
    fields : ['FieldName', "Expression", "FieldSummarize",
    "FieldSummarizeAux", "Reset", "Type", "TypeObj"],
    data : []
});

kc.pdfStruc.pageType = new Object();
kc.pdfStruc.pageType["A3"] = {
    name : 'A3',
    type : {
        width : 297,
        height : 420,
        name : 'A3'
    }
}
kc.pdfStruc.pageType["A4"] = {
    name : 'A4',
    type : {
        width : 210,
        height : 297,
        name : 'A4'
    }
}
kc.pdfStruc.pageType["A5"] = {
    name : 'A5',
    type : {
        width : 148,
        height : 210,
        name : 'A5'
    }
}
kc.pdfStruc.pageType["letter"] = {
    name : 'letter',
    type : {
        width : 215,
        height : 279,
        name : 'letter'
    }
}
kc.pdfStruc.pageType["legal"] = {
    name : 'legal',
    type : {
        width : 215,
        height : 355,
        name : 'legal'
    }
}

kc.pdfStruc.dataStorePageType = new Array()
for (col in kc.pdfStruc.pageType) {
    kc.pdfStruc.dataStorePageType.push(kc.pdfStruc.pageType[col])
}

Ext.create('Ext.data.Store', {
    storeId : 'statesjkPageType',
    fields : ['name', "type"],
    data : kc.pdfStruc.dataStorePageType
/*
	 * data : [{ name : 'A4', type : { width : 210, height : 210, name :
	 * 'A4' } }]
	 */
});
// ------------------------------------------------------------------------------

Ext.create('Ext.data.Store', {
    storeId : 'statesjkMask',
    fields : ['fN', "fNd"],
    data : [{
        fN : '',
        fNd : 'Sin Mascara'
    }, {
        fN : 'Fecha',
        fNd : 'Fecha'
    }, {
        fN : 'Numero',
        fNd : 'Numero'
    }]
});

Ext.create('Ext.data.Store', {
    storeId : 'statesjkFontAlign',
    fields : ['fN'],
    data : [{
        fN : 'Left'
    }, {
        fN : 'Right'
    }, {
        fN : 'Center'
    }, {
        fN : 'justify'
    }]
});

Ext.create('Ext.data.Store', {
    storeId : 'statesjkFont',
    fields : ['fN'],
    data : [{
        fN : 'Arial'
    }, {
        fN : 'Courier'
    }, {
        fN : 'serif'
    }, {
        fN : 'symbolic'
    }]
});
// ------------------------------------------------------------------------------

kc.pdfStruc.colorNamesSk = new Object();
kc.pdfStruc.colorNamesSk['Transparent'] = {
    R : 999,
    G : 999,
    B : 999
}, kc.pdfStruc.colorNamesSk['black'] = {
    R : 0,
    G : 0,
    B : 0
}, kc.pdfStruc.colorNamesSk['navy'] = {
    R : 0,
    G : 0,
    B : 128
}, kc.pdfStruc.colorNamesSk['red'] = {
    R : 255,
    G : 0,
    B : 0
}, kc.pdfStruc.colorNamesSk['blue'] = {
    R : 0,
    G : 0,
    B : 255
}, kc.pdfStruc.colorNamesSk['teal'] = {
    R : 0,
    G : 128,
    B : 128
}, kc.pdfStruc.colorNamesSk['cyan'] = {
    R : 0,
    G : 255,
    B : 255
}, kc.pdfStruc.colorNamesSk['silver'] = {
    R : 192,
    G : 192,
    B : 192
}, kc.pdfStruc.colorNamesSk['gray'] = {
    R : 128,
    G : 128,
    B : 128
}, kc.pdfStruc.colorNamesSk['yellow'] = {
    R : 255,
    G : 255,
    B : 0
}, kc.pdfStruc.colorNamesSk['green'] = {
    R : 0,
    G : 128,
    B : 0
}, kc.pdfStruc.colorNamesSk['olive'] = {
    R : 128,
    G : 128,
    B : 0
}, kc.pdfStruc.colorNamesSk['lime'] = {
    R : 0,
    G : 255,
    B : 0
}, kc.pdfStruc.colorNamesSk['maroon'] = {
    R : 128,
    G : 0,
    B : 0
}, kc.pdfStruc.colorNamesSk['white'] = {
    R : 255,
    G : 255,
    B : 255
}, kc.pdfStruc.colorNamesSk['gainsboro'] = {
    R : 220,
    G : 220,
    B : 220
}, kc.pdfStruc.colorNamesSk['floralwhite'] = {
    R : 255,
    G : 250,
    B : 240
}, kc.pdfStruc.colorNamesSk['fuchsia'] = {
    R : 255,
    G : 0,
    B : 255
}, kc.pdfStruc.colorNamesSk['purple'] = {
    R : 128,
    G : 0,
    B : 128
}
kc.pdfStruc.colorSection = new Object()
kc.pdfStruc.colorSection.headDoc = Ext.clone(kc.pdfStruc.colorNamesSk['floralwhite'])
kc.pdfStruc.colorSection.headDoc.cN = 'floralwhite'
//------------------------------------------------------------------------------
kc.pdfStruc.colorSection.head = Ext.clone(kc.pdfStruc.colorNamesSk['gainsboro'])
kc.pdfStruc.colorSection.head.cN = 'gainsboro'
//------------------------------------------------------------------------------
kc.pdfStruc.colorSection.body = Ext.clone(kc.pdfStruc.colorNamesSk['silver'])
kc.pdfStruc.colorSection.body.cN = 'silver'
//------------------------------------------------------------------------------
kc.pdfStruc.colorSection.footer = Ext.clone(kc.pdfStruc.colorNamesSk['gainsboro'])
kc.pdfStruc.colorSection.footer.cN = 'gainsboro'
//------------------------------------------------------------------------------
kc.pdfStruc.colorSection.footerDoc = Ext.clone(kc.pdfStruc.colorNamesSk['floralwhite'])
kc.pdfStruc.colorSection.footerDoc.cN = 'floralwhite'
//------------------------------------------------------------------------------


// ------------------------------------------------------------------------------
kc.pdfStruc.dataStore = new Array()
for (col in kc.pdfStruc.colorNamesSk) {
    kc.pdfStruc.dataStore.push({
        c : {
            cN : col,
            c : kc.pdfStruc.colorNamesSk[col]
        }
    })
    kc.pdfStruc.colorNamesSk[col].cN = col
}
// ------------------------------------------------------------------------------
Ext.create('Ext.data.Store', {
    storeId : 'statesjk',
    fields : ['c', {
        name : 'cN',
        mapping : 'c.cN'
    }],
    data : kc.pdfStruc.dataStore
});
// ------------------------------------------------------------------------------
