Ext.namespace('AppDesign.view.menu.copyBuffer')
Ext.define('copyBuffer', {
			singleton : true,
			/**
			 * @type kc.pdfStruc._baseStruc
			 */
			ref : null,
			exists : function() {
				if (this.ref != null) {
					return true;
				}
				return false;
			},
			set : function(obj) {
				this.ref = obj
			},
			getDesc : function() {
                            if (this.ref.selec != undefined)
                                if (Ext.isArray(this.ref.selec))
                                    return "Conjunto de Objetos"
                            return this.ref.TypeObj
			},
			get : function() {
				return this.ref
			}
		});