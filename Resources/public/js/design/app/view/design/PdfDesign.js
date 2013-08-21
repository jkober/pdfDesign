Ext.define("AppDesign.view.design.PdfDesign", {
    extend: 'Ext.container.Container',
    alias: "widget.pdfDesign",
    requires: [ "AppDesign.view.design.GridPropety",
                "AppDesign.model.GridPropetyList"
              ],
    layout: 'border',
    initComponent: function() {
        var me = this;
        me.items = [{
                region: 'north',
                xtype: 'toolbar',
                items: [
                    {
                        text: 'Guardar',
                        iconCls: 'saveBtn',
                        itemId: 'guardarReporte'
                    },
                    {
                        text: 'Guardar Como',
                        iconCls: 'saveAsBtn',
                        itemId: 'guardarReporteAs'
                    },
                    {
                        xtype: 'tbseparator'
                    },
                    {
                        text: 'Abrir',
                        iconCls: 'openBtn',
                        itemId: 'abrirReporte'
                    },
                    {
                        text: 'Abrir Backup',
                        tooltip:"Lista de todos los reportes guardados, el backup, puede demorar",
                        iconCls: 'openBtn',
                        itemId: 'abrirReporteBkp'
                    },
                    {
                        text: "verPdf",
                        tooltip:"Visualizar el pdf - tener en cuenta que funcione la sql",
                        iconCls: 'previewBtn',
                        itemId: "verPdf"
                    },
                    {
                        xtype: 'tbseparator'
                    },
                    {
                        xtype: 'tbseparator'
                    },
                    {
                        text: 'Configurar Reporte',
                        tooltip:"Configurar Pagina, Parametros Sql para probrar, valores por defecto. Etc.",
                        iconCls: 'settingBtn',
                        itemId: 'configurarReporte'
                    },
                    {
                        xtype: 'tbseparator'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'DB',
                        width: 100,
                        //labelWidth: 35,
                        labelWidth: 15,
                        allowBlank: false,
                        itemId: 'dbBase',
                        emptyText: 'Ingrese Base de datos',
                        blankText:'Necesita ingresar el nombre de la base de datos, donde realiza la consulta'
                    },
                    {
                        xtype: 'tbseparator'
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Zoom',
                        iconCls: 'zoomBtn',
                        minValue: 0,
                        maxValue: 1000,
                        hideTrigger: true,
                        width: 80,
                        labelWidth: 35,
                        value: 100,
                        allowBlank: false,
                        itemId: 'zoom'
                    },
                    {
                        xtype: 'tbseparator'
                    },
                    {
                        text: 'Field',
                        tooltip:"Actualizar Field de Sql",
                        iconCls: 'refreshBtn',
                        itemId: 'procesarSql'
                    },
                    {
                        xtype: 'label',
                        text: "->Reporte:Sin Agignar",
                        width: 200,
                        allowBlank: false,
                        itemId: 'reporName'
           },
                    '->', "--------- Jose Kober ---------"
                ]
            }, {
                region: 'west',
                collapsible: true,
                viewConfig: {
                    plugins: {
                        ptype: 'gridviewdragdrop',
                        dragGroup: 'sectionGroup'
                    }
                },
                width: 190,
                xtype: 'tabpanel',
                activeTab: 0,
                split: true,
                tabPosition: 'top',
                title: "Componentes",
                items: [{
                        title: 'Extras',
                        xtype: 'grid',
                        store: 'fieldJkExtras',
                        viewConfig: {
                            plugins: {
                                ptype: 'gridviewdragdrop',
                                dragGroup: 'sectionGroupExtra'
                            }
                        },
                        hideHeaders: true,
                        columns: [{
                                text: "Component",
                                flex: 1,
                                dataIndex: 'name'
                            }]
                    }, {
                        title: 'Field',
                        xtype: 'grid',
                        store: 'fieldJk',
                        viewConfig: {
                            plugins: {
                                ptype: 'gridviewdragdrop',
                                dragGroup: 'sectionGroup'
                            }
                        },
                        hideHeaders: true,
                        columns: [{
                                text: "Record Name",
                                flex: 1,
                                dataIndex: 'name'
                            }]
                    }, {
                        title: 'Totals',
                        xtype: 'grid',
                        itemId: 'grdTotalFiel',
                        store: 'fieldJks',
                        dockedItems: [{
                                xtype: 'toolbar',
                                dock: 'top',
                                items: [{
                                        xtype: 'button',
                                        iconCls: 'addBtn',
                                        itemId: 'add'
                                    }, {
                                        xtype: 'button',
                                        iconCls: 'dropBtn',
                                        itemId: 'drop'
                                    }, {
                                        xtype: 'button',
                                        iconCls: 'editBtn',
                                        itemId: 'edit'
                                    }]
                            }],
                        viewConfig: {
                            plugins: {
                                ptype: 'gridviewdragdrop',
                                dragGroup: 'sectionGroupTotal'
                            }
                        },
                        hideHeaders: true,
                        columns: [{
                                text: "Total Fields",
                                flex: 1,
                                dataIndex: 'FieldName'
                            }]
                    }]
            }, {
                region: 'south',
                itemId: 'editarSql',
                title: 'Editar Sql para retornar información',
                xtype: 'form',
                height: 250,
                layout:'anchor',
                items: [{
                        region: 'center',
                        anchor: '100% 100%',
                        value: "",
                        flex:1,
                        itemId: 'sql',
                        xtype: 'codemirror',
                        pathModes: kcPatch.appDir + 'js/design/mzExt/CodeMirror-2.2/mode',
                        pathExtensions: kcPatch.appDir + 'js/design/mzExt/CodeMirror-2.2/lib/util',
                        showModes: false,
                        editorHeight: 160,
                        //height: 200,
                        mode: 'text/x-mysql'
                    }],
                collapsible: true,
                split: true
            }, {
                region: 'east',
                xtype: 'form',
                layout: 'border',
                title: 'Propiedades...',
                collapsible: true,
                split: true,
                width: 300,
                items: [{
                        xtype: 'gridPro',
                        id: 'gridPro'
                    }]
            }, {
                region: 'center',
                xtype: 'tabpanel',
                activeTab: 0,
                items: [{
                        itemId: 'page',
                        title: 'Pagina',
                        anchor: "100% 100%",
                        autoScroll: true,
                        html: ''
                    }]
            }];
        me.callParent(arguments);
    }
});