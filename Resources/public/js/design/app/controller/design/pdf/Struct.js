// --------------------------------------------------------------------------------------------------
Ext.define("kc.pdfStruc.Struct", {});
Ext.require("kc.pdfStruc.section")
Ext.require("kc.pdfStruc.element")
// --------------------------------------------------------------------------------------------------
kc.pdfStruc.GetRotacion = function(div, width, rotacion) {
	var vP = "";
	if (jQuery.browser.webkit) {
		vP = "-webkit-";
	} else if (jQuery.browser.mozilla) {
		vP = "-moz-";
	} else if (jQuery.browser.opera) {
		vP = "-o-";
	}
	// var div =jQuery(this.objectRef)
	// div.css(vP+"transform","translateX(-"+this.objectPdf.my.PositionWidth+"mm)
	// translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg)
	// rotateZ(-90deg)");
	var rota = parseInt(rotacion.substr(rotacion.length - 2));
	if (isNaN(rota)) {
		div
				.css(
						vP + "transform",
						"translateX(0mm) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)");
		div.css(vP + "transform-origin-x", "0%");
		div.css(vP + "transform-origin-y", "0%");
	} else {
		div
				.css(
						vP + "transform",
						"translateX(-"
								+ width
								+ "mm) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(-"
								+ rota + "deg)");
		div.css(vP + "transform-origin-x", "100%");
		div.css(vP + "transform-origin-y", "0%");
	}
}
kc.pdfStrucRefActiva = null
kc.pdfStruc.getWidhtCodeBarra = function(cantidadCaracteres, x, c) {
	c = c / 10;
	x = x / 10
	if (x > 1.0) {
		x = x * .001;
	}
	var i = ((cantidadCaracteres + 2) * (3 * c + 7) - 1) * x;
	if (i <= 0) {
		i = "";
	}
	return parseInt(i * 2.54 * 10)
}
kc.pdfStruc.factorRelacionPx = {
	fr : null,
	get : function() {
		return this.fr;
	},
	set : function(px, factor) {
		if (this.fr == null) {
			this.fr = factor / px
		}
		return this.fr;
	}
}
// ------------------------------------------------------------------------------
kc.pdfStruc.toMm = function(px) {
	if (this.StrRight(px, 2) == "mm") {
		return parseInt(px.substr(0, px.length - 2));
	}
	return parseInt(this.factorRelacionPx.get() * px)
}
kc.pdfStruc.StrRight = function(str, n) {
	if (n <= 0)
		return "";
	else if (n > String(str).length)
		return str;
	else {
		var iLen = String(str).length;
		return String(str).substring(iLen, iLen - n);
	}
}
// ------------------------------------------------------------------------------
kc.pdfStruc.PdfSectionList = {
	refParent : null,
	refView : null,
	selectionGroup : null,
	ItemsCount : 1,
	Items : []
}
kc.pdfStruc.PdfHead = {
	typeSection : "head",
	PageBrakBefore : {
		name : ""
	},
	PageBrakAfter : {
		name : ""
	},
	PrintIf : {
		name : ""
	},
	idSections : null,
	refParent : null,
	refView : null,
	Height : 20,
	BackGround : {
		R : "255",
		G : "255",
		B : "255",
		cN : 'white'
	},
	ItemsCount : 0,
	Items : [],
	ItemsArrange : {}
}
// ------------------------------------------------------------------------------
kc.pdfStruc.PdfHeadDoc = {};
// ------------------------------------------------------------------------------
jQuery.extend(kc.pdfStruc.PdfHeadDoc, kc.pdfStruc.PdfHead);
// ------------------------------------------------------------------------------
kc.pdfStruc.PdfHeadDoc.typeSection = "headDoc";
kc.pdfStruc.PdfHeadDoc.PrintIf = {
	name : "return true;"
};
kc.pdfStruc.PdfHeadDoc.Height = 5;
// ------------------------------------------------------------------------------
kc.pdfStruc.PdfBody = {
	typeSection : "body",
	PageBrakBefore : {
		name : ""
	},
	PageBrakAfter : {
		name : ""
	},
	PrintIf : {
		name : ""
	},
	idSections : null,
	refParent : null,
	refView : null,
	Height : 20,
	BackGround : {
		R : "255",
		G : "255",
		B : "255",
		cN : 'white'
	},
	ItemsCount : 0,
	Items : [],
	ItemsArrange : {}
}
// ------------------------------------------------------------------------------

kc.pdfStruc.PdfFooter = {
	typeSection : "footer",
	PrintIf : {
		name : ""
	},
	PageBrakBefore : {
		name : ""
	},
	PageBrakAfter : {
		name : ""
	},
	idSections : null,
	refParent : null,
	refView : null,
	Height : 20,
	BackGround : {
		R : "255",
		G : "255",
		B : "255",
		cN : 'white'
	},
	ItemsCount : 0,
	Items : [],
	ItemsArrange : {}
}
// ------------------------------------------------------------------------------
kc.pdfStruc.PdfFooterDoc = {}
// ------------------------------------------------------------------------------
jQuery.extend(kc.pdfStruc.PdfFooterDoc, kc.pdfStruc.PdfFooter);
kc.pdfStruc.PdfFooterDoc.typeSection = "footerDoc"
kc.pdfStruc.PdfFooterDoc.PrintIf = {
	name : "return true;"
}
kc.pdfStruc.PdfFooterDoc.Height = 5
// ------------------------------------------------------------------------------
kc.pdfStruc.PdfGroup = {
	refParent : null,
	/**
	 * @type kc.pdfStruc.PdfHead
	 */
	Header : Ext.clone(kc.pdfStruc.PdfSectionList),
	/**
	 * @type kc.pdfStruc.PdfBody
	 */
	Body : Ext.clone(kc.pdfStruc.PdfSectionList),
	/**
	 * @type kc.pdfStruc.PdfFooter
	 */
	Footer : Ext.clone(kc.pdfStruc.PdfSectionList),
	GroupBy : new Array(),
	groupId : null
}

// ------------------------------------------------------------------------------
kc.pdfStruc.PdfGroup.Header.typeSection = "head"
kc.pdfStruc.PdfGroup.Body.typeSection = "body"
kc.pdfStruc.PdfGroup.Footer.typeSection = "footer"
// ------------------------------------------------------------------------------
kc.pdfStruc.PdfPage = {
	reportExtras : {
		name : null,
		idGroups : -1,
		idSections : -1,
		idId : -1,
		idReporte : null,
		version : 3,
		bdName : '',
		sql : 'select *, "abc" as h from ',
		field : [],
		param : {}
	},
    wherecondicional:"y aca sera",
	refView : null,
	MarginTop : 10,
	MarginLeft : 10,
	MarginRight : 10,
	MarginBottom : 10,
	PageOrienta : 'P',
	PageType : {
		width : 210,
		height : 297,
		name : 'A4'
	},
	ExpressionDef : [],
	GroupBy : {},
	TotalFields : {},
	Document : {
		refParent : null,
		/**
		 * @type kc.pdfStruc.PdfHead
		 */
		Header : Ext.clone(kc.pdfStruc.PdfSectionList),
		/**
		 * @type kc.pdfStruc.PdfFooter
		 */
		Footer : Ext.clone(kc.pdfStruc.PdfSectionList)
	},

	/**
	 * @type kc.pdfStruc.PdfGroup
	 */
	Group : Ext.clone(kc.pdfStruc.PdfGroup),
	BackGround : {
		R : "999",
		G : "999",
		B : "999",
		cN : 'Transparent'
	}
};
// ------------------------------------------------------------------------------
kc.pdfStruc.loadStruc = function(defaults) {
	var configDefault;
	if (defaults != undefined) {
		configDefault = defaults
	} else {
		configDefault = {
			FontFamily : 'Arial',
			FontBold : false,
			FontItalic : false,
			FontAlign : 'Left',
			FontUnderLine : false,
			FontSize : 10,
			FontColor : {
				R : "0",
				G : "0",
				B : "0",
				cN : 'black'
			},
			BorderType : {
				type : 'lrtb',
				value : ["Left", "Right", "Top", "Bottom"]
			},
			LabelRotacion : 'Rotacion_0'
		}
		kc.pdfStruc.PdfPage.reportExtras.configDefault = configDefault
	}

	kc.pdfStruc._baseBorder = {
		BorderSize : 1,
		BorderType : Ext.clone(configDefault.BorderType),
		BorderColor : {
			R : "0",
			G : "0",
			B : "0",
			cN : 'black'
		}
	}
	kc.pdfStruc._baseStruc = {
		refParent : null,
		PositionTop : 0,
		PositionLeft : 0,
		PositionWidth : 30,
		PositionHeight : 5,
		LabelRotacion : configDefault.LabelRotacion,
		BackGround : {
			R : "999",
			G : "999",
			B : "999",
			cN : 'Transparent'
		}
	}
	// --------------------------------------------------------------------------------------------------
	jQuery.extend(kc.pdfStruc._baseStruc, kc.pdfStruc._baseBorder);
	// --------------------------------------------------------------------------------------------------
	kc.pdfStruc_baseFontDef = {
		// FontFamily : 'Courier',
		FontFamily : Ext.clone(configDefault.FontFamily),
		FontBold : Ext.clone(configDefault.FontBold),
		FontItalic : Ext.clone(configDefault.FontItalic),
		FontAlign : Ext.clone(configDefault.FontAlign),
		FontUnderLine : Ext.clone(configDefault.FontUnderLine),
		FontSize : Ext.clone(configDefault.FontSize),
		FontColor : Ext.clone(configDefault.FontColor)
	}
	kc.pdfStruc.TableRow = {
		name : "",
		PrintIf : {
			name : ""
		},
		SourceName : "",
		SourceCode : {
			refParent : null,
			name : ''
		},
		FormatMask : '',
		FillColorRow : {
			R : "999",
			G : "999",
			B : "999",
			cN : 'Transparent'
		},
		FormatType : ''
	}
	// --------------------------------------------------------------------------------------------------
	jQuery.extend(kc.pdfStruc.TableRow, kc.pdfStruc_baseFontDef);
	jQuery.extend(kc.pdfStruc.TableRow, kc.pdfStruc._baseBorder);
	// --------------------------------------------------------------------------------------------------
	kc.pdfStruc.TableRowH = {
		name : "",
		PrintIf : {
			name : ""
		},
		Title : "",
		FormatMask : '',
		FormatType : '',
		FillColorRow : {
			R : "999",
			G : "999",
			B : "999",
			cN : 'Transparent'
		},
		PositionWidth : 30,
		SourceCode : {
			refParent : null,
			name : ''
		}
	}
	// --------------------------------------------------------------------------------------------------
	jQuery.extend(kc.pdfStruc.TableRowH, kc.pdfStruc_baseFontDef);
	jQuery.extend(kc.pdfStruc.TableRowH, kc.pdfStruc._baseBorder);
	// --------------------------------------------------------------------------------------------------
	kc.pdfStruc.TableRowH.FontAlign = "center";
	kc.pdfStruc.TableRowH.FontBold = true;
	// --------------------------------------------------------------------------------------------------
	delete kc.pdfStruc.TableRowH.FormatMask
	delete kc.pdfStruc.TableRowH.FormatType
	// --------------------------------------------------------------------------------------------------
	kc.pdfStruc.TableRowF = {
		name : "",
		PrintIf : {
			name : "return true;"
		},
		FillColorRow : {
			R : "999",
			G : "999",
			B : "999",
			cN : 'Transparent'
		},
		PositionWidth : 30,
		SourceCode : {
			refParent : null,
			name : ''
		}
	}
	// --------------------------------------------------------------------------------------------------
	jQuery.extend(kc.pdfStruc.TableRowF, kc.pdfStruc_baseFontDef);
	jQuery.extend(kc.pdfStruc.TableRowF, kc.pdfStruc._baseBorder);
	// --------------------------------------------------------------------------------------------------
	kc.pdfStruc.TableRowF.FontAlign = "center";
	kc.pdfStruc.TableRowF.FontBold = true;
	// --------------------------------------------------------------------------------------------------
	kc.pdfStruc.Table = {
		TypeObj : "S",
		TabletCount : 2,
		TabletFCount : 2,
		TableWidth : 0,
		TableHeight : 0,
		TableHeightH : 10,
		TableHeightR : 5,
		TableHeightF : 5,
		// ----------------------------------------------------------------------------------------------
		ProcesaFoot : {
			name : "return false;"
		},
		PrintHead : {
			name : ""
		},
		PrintIf : {
			name : ""
		},
		PrintIfEmpyReg : true,
		// ----------------------------------------------------------------------------------------------
		TableInit : {
			name : ""
		},
		TableBeforeRead : {
			name : ""
		},
		TableAfterRead : {
			name : ""
		},
		TableFinishRead : {
			name : ""
		},
		// ----------------------------------------------------------------------------------------------
		TableHead : {
			items : {
				1 : Ext.clone(kc.pdfStruc.TableRowH),
				2 : Ext.clone(kc.pdfStruc.TableRowH)
			},
			refParent : null
		},
		TableRow : {
			items : {
				1 : Ext.clone(kc.pdfStruc.TableRow),
				2 : Ext.clone(kc.pdfStruc.TableRow)
			},
			refParent : null
		},
		TableFoot : {
			items : {
				1 : Ext.clone(kc.pdfStruc.TableRowF),
				2 : Ext.clone(kc.pdfStruc.TableRowF)
			},
			refParent : null
		},
		Sources : {
			refParent : null,
			sourceName : "2",// 1-From Array 2-Sql 3-Function
			fields : [],
			params : [],
			fieldsArray : [],
			sql : "",
			code : "$a= array();$a[] = array('a1'=>'a1 value');$a[] = array('a1'=>'a2 value');return $a;"
		}
	}
	// ------------------------------------------------------------------------------
	kc.pdfStruc.Table.TableHead.items[1].name = "col1"
	kc.pdfStruc.Table.TableHead.items[2].name = "col2"
	kc.pdfStruc.Table.TableHead.items[1].Title = "col1a"
	kc.pdfStruc.Table.TableHead.items[2].Title = "col2a"
	kc.pdfStruc.Table.TableRow.items[1].name = "rowDef1"
	kc.pdfStruc.Table.TableRow.items[2].name = "rowDef2"
	kc.pdfStruc.Table.TableFoot.items[1].name = "footer 1"
	kc.pdfStruc.Table.TableFoot.items[2].name = "footer 2"
	// ------------------------------------------------------------------------------
	jQuery.extend(kc.pdfStruc.Table, kc.pdfStruc._baseStruc);
	// ------------------------------------------------------------------------------
	kc.pdfStruc.Table.PositionWidth = 60,
	// ------------------------------------------------------------------------------
	delete kc.pdfStruc.Table.PositionWidth
	delete kc.pdfStruc.Table.PositionHeight
	delete kc.pdfStruc.Table.BorderSize
	delete kc.pdfStruc.Table.BorderType
	delete kc.pdfStruc.Table.BorderColor
	delete kc.pdfStruc.Table.BackGround

	// ------------------------------------------------------------------------------
	kc.pdfStruc._baseLabel = {
		MultiLine : false
	}
	jQuery.extend(kc.pdfStruc._baseLabel, kc.pdfStruc_baseFontDef);

	// ------------------------------------------------------------------------------
	kc.pdfStruc.Label = {
		TypeObj : "L",
		Text : 'Empy Label',
		MultiLine : false,
		CodigoBarra : 0,
		CodigoBarraWid : 0.6,
		CodigoBarraCalc : false

	}
	// ------------------------------------------------------------------------------
	jQuery.extend(kc.pdfStruc.Label, kc.pdfStruc._baseStruc,
			kc.pdfStruc._baseLabel)
	// ------------------------------------------------------------------------------
	kc.pdfStruc.ObjectGroup = {
		TypeObj : "GS",
		GroupTop : 0,
		GroupLeft : 0,
		GroupWidth : 0,
		GroupHeight : 0,
		GroupTopIgualar : 0,
		GroupLeftIgualar : 0,
		GroupWidthIgualar : 0,
		GroupHeightIgualar : 0,
		GroupBorderSize : 1,
		GroupBorderType : Ext.clone(configDefault.BorderType),
		GroupBorderColor : {
			R : "0",
			G : "0",
			B : "0",
			cN : 'black'
		},
		GroupFontFamily : Ext.clone(configDefault.FontFamily),
		GroupFontBold : Ext.clone(configDefault.FontBold),
		GroupFontItalic : Ext.clone(configDefault.FontItalic),
		GroupFontAlign : Ext.clone(configDefault.FontAlign),
		GroupFontUnderLine : Ext.clone(configDefault.FontUnderLine),
		GroupFontSize : Ext.clone(configDefault.FontSize),
		GroupFontColor : Ext.clone(configDefault.FontColor)
		
		
	}

	kc.pdfStruc.Imagen = {
		TypeObj : "P",
		fileName : null,
		TypeImagen : null
	}
	// ------------------------------------------------------------------------------
	jQuery.extend(kc.pdfStruc.Imagen, kc.pdfStruc._baseStruc)
	// ------------------------------------------------------------------------------
	delete kc.pdfStruc.Imagen.BackGround
	// ------------------------------------------------------------------------------
	kc.pdfStruc.Imagen.BorderType = {
		type : '',
		value : []
	}
	// ------------------------------------------------------------------------------
	kc.pdfStruc.Field = {

		TypeObj : "F",
		DataSource : '',
		FormatMask : '',
		FormatType : '',
		MultiLine : false,
		CodigoBarra : 0

	}
	// ------------------------------------------------------------------------------
	jQuery.extend(kc.pdfStruc.Field, kc.pdfStruc._baseStruc,
			kc.pdfStruc._baseLabel)
	// ------------------------------------------------------------------------------
	kc.pdfStruc.NroPage = {
		TypeObj : "A",
		Text : 'Pagina ## de #'
	}
	// ------------------------------------------------------------------------------
	jQuery.extend(kc.pdfStruc.NroPage, kc.pdfStruc._baseStruc,
			kc.pdfStruc._baseLabel)
	// ------------------------------------------------------------------------------

	kc.pdfStruc.NroPage.BorderType = {
		type : '',
		value : []
	},
	// ------------------------------------------------------------------------------
	kc.pdfStruc.FieldTotal = {
		TypeObj : 'T',
		FormatMask : '',
		FormatType : '',
		TotalFieldName : '',
		CodigoBarra : 0

	}
	// ------------------------------------------------------------------------------
	jQuery.extend(kc.pdfStruc.FieldTotal, kc.pdfStruc._baseStruc,
			kc.pdfStruc._baseLabel)
	// ------------------------------------------------------------------------------
	kc.pdfStruc.GrfT = {
		TypeObj : 'Gt',
		GrafTitle : "grafico",
		GraficPrevious : false,
		PrintIfEmpyReg : true,
		ImagenEx : 'data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',

		Sources : {
			refParent : null,
			sourceName : "1",// 1-From Array 2-Sql 3-Function
			fields : [],
			params : [],
			fieldsArray : [{
						name : 'val',
						value : "array(1,3,8)",
						comentario : 'Valores'
					}, {
						name : 'ley',
						value : "array('L1','L 2','L3')",
						comentario : 'Leyenda'
					}],
			sql : "",
			code : "$dt= array();\n\
$dt[1]['val'] = 1;\n\
$dt[1]['ley'] = 'L 1';\n\
$dt[2]['val'] = 3;\n\
$dt[2]['ley'] = 'L 2';\n\
$dt[3]['val'] = 8;\n\
$dt[3]['ley'] = 'L 3';\n\
return $dt;"
		}

	}
	jQuery.extend(kc.pdfStruc.GrfT, kc.pdfStruc._baseStruc,
			kc.pdfStruc._baseBorder)
	kc.pdfStruc.GrfT.PositionWidth = 40
	kc.pdfStruc.GrfT.PositionHeight = 30

}
kc.pdfStruc.loadStruc()