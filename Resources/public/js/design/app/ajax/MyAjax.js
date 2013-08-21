Ext.define('Ajax.MyAjax', {
			alias: ['myAjax'],
			singleton : true,
			ref : null,
			get:function(obj){
				if (this.ref==null) {
					this.ref = new JQAjax();
					this.ref.setReturnInForm(false)
				}
				return this.ref;
			}
		});