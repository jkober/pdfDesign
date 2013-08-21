Ext.namespace("Extras.extras")
jQuery.noConflict(); 

if ( kc.FixExtJs42 ) {
	Ext.form.Basic.override({
		loadRecord: function(record) {
				this._record = record;
				if ( record.getData== undefined) {
					return this.setValues(record.data);
				}else{
					return this.setValues(record.getData());
				}
		}
	})
}
Ext.grid.property.Store.override({
	getReader : function() {
		if (!this.reader) {
			Ext.grid.property.Store.prototype.reader = Ext.create(
					'Ext.data.reader.Reader', {
						model : Ext.grid.property.Property,
						customExclude : this.grid.customExclude,

						buildExtractors : Ext.emptyFn,

						read : function(dataObject) {
							return this.readRecords(dataObject);
						},

						readRecords : function(dataObject) {
							var val, propName, result = {
								records : [],
								success : true
							};

							for (propName in dataObject) {
								if (dataObject.hasOwnProperty(propName)) {
									val = dataObject[propName];
									if ( this.customExclude[propName] == undefined ) { 
										if (  this.isEditableValue(val)) {
											result.records
													.push(new Ext.grid.property.Property(
															{
																name : propName,
																value : val
															}, propName));
										}
									}
								}
							}
							result.total = result.count = result.records.length;
							return Ext.create('Ext.data.ResultSet', result);
						},

						isEditableValue : function(val) {
							return true
							// return Ext.isPrimitive(val) || Ext.isDate(val);
						}
					});
		}
		return this.reader;
	}
})
// --------------------------------------------------------------------------------------------------