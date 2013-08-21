Ext.Loader.setVersion=function(version){
        this.version = version
    }
Ext.Loader.setVersion(Ext.Date.now())

Ext.override(Ext.form.TextField, {
	validator : function(text) {
		if (this.allowBlank == false){
                    if (text.length != 0) {
                        if ( Ext.util.Format.trim(text).length == 0) {
                            return this.blankText;
                        }
                    }
                }
                return true;
        }
	
});

Ext.Ajax.async = false

Ext.data.writer.Json.override({
	/*
	 * This function overrides the default implementation of json writer. Any hasMany relationships will be submitted
	 * as nested objects. When preparing the data, only children which have been newly created, modified or marked for
	 * deletion will be added. To do this, a depth first bottom -> up recursive technique was used.
	 */
	getRecordDataKK : function(record) {
		//Setup variables
		var me = this, i, association, childStore, data = record.data;

		//Iterate over all the hasMany  associations
		if ( record.associations != undefined  ) {		
			for (i = 0; i < record.associations.length; i++) {
				association = record.associations.get(i);
				if (association.type != 'hasMany') {
					continue;
				}
	
				data[association.name] = null;
				childStore = record[association.storeName];
				if (childStore != undefined) {
					// el problema es que la estructura no encuentra childStore,
					// sino que es uno y dentro de la estructura tene los items
					// pero como atributos, por ende se debe buscar el associations
					// para saber que atributo corresponde buscar y asi
					//
					//
					//
					//Iterate over all the children in the current association
					childStore.each(function(childRecord) {
	
						if (!data[association.name]) {
							if (association._hasOne == true) {
								data[association.name] = {};
							} else {
								data[association.name] = [];
							}
						}
	
						//Recursively get the record data for children (depth first)
						var childData = this.getRecordData.call(this, childRecord);
	
						/*
						 * If the child was marked dirty or phantom it must be added. If there was data returned that was neither
						 * dirty or phantom, this means that the depth first recursion has detected that it has a child which is
						 * either dirty or phantom. For this child to be put into the prepared data, it's parents must be in place whether
						 * they were modified or not.
						 */
						if (childRecord.dirty | childRecord.phantom
								| (childData != null)) {
							if (association._hasOne == true) {
								data[association.name] = childData;
							} else {
								data[association.name].push(childData);
							}
							record.setDirty();
						}
					}, me);
	
					/*
					 * Iterate over all the removed records and add them to the preparedData. Set a flag on them to show that
					 * they are to be deleted
					 */
					Ext.each(childStore.removed, function(removedChildRecord) {
						//Set a flag here to identify removed records
						removedChildRecord.set('forDeletion', true);
						var removedChildData = this.getRecordData.call(this,
								removedChildRecord);
						if (association._hasOne == true) {
							data[association.name] = removedChildData;
						} else {
							data[association.name].push(removedChildData);
						}
						record.setDirty();
					}, me);
				}
			}
		}

		//Only return data if it was dirty, new or marked for deletion.
		if (record.dirty | record.phantom | record.get('forDeletion')) {
			return data;
		}
	}
});



//**************************************************************************
//** Model Overrides
// http://www.javaxt.com/Tutorials/Javascript/ExtJS_4
//*************************************************************************/
/** Overrides the native get() and set() methods in the Ext.data.Model class
 *  to handle nested data (i.e. Models within Models).
 */
/*Ext.override('Ext.data.writer.Json', {
    getRecordData: function(record) {
        var data =this.callParent(record);
          Ext.apply(data, record.getAssociatedData());
          return data;
//        return this;
    }
});    
*/
  (function() {
    
    
    var _getRecordData = Ext.data.writer.Json.prototype.getRecordData;
	  Ext.data.writer.Json.override({
	      getRecordData: function(record) {
              var data = _getRecordData.call(this,record)
              Ext.apply(data, record.getAssociatedData());
              return data;
              
	          /*Ext.apply(record.data, record.getAssociatedData());
	          return record.data;*/
	      }
	  });
    
      var _get = Ext.data.Model.prototype.get;
      var _set = Ext.data.Model.prototype.set;
 
      Ext.override(Ext.data.Model, {
 
 
        /** Returns the value for a given field. Note that nested data is 
         *  returned in an array (Ext.data.Model[]).
         */
          get: function(field) {
               
              var val = _get.apply(this, arguments); //this[this.persistenceProperty][field]; //<--org method bails here...
              if (val==null){
                  var associations = this.associations.items;
                  for (var i=0; i<associations.length; i++){
                      var association = associations[i];
                      if (association.name==field){
                          var store = this[association.storeName];
                          if (store!=null) return store.getRange(0, store.count());
                      }
                  }
              }
              return val;
          },
 
 
        /** Sets the value for a given field. Extends the native set() method
         *  by allowing users to save nested data (Ext.data.Model). Note that
         *  in order to send the nested data to the server, you must override
         *  the Json Writer getRecordData() method. References:
         *  http://www.sencha.com/forum/showthread.php?148250-Saving-Model-with-Nested-Data
         *  http://www.sencha.com/forum/showthread.php?124362-Nested-loading-nested-saving-in-new-data-package
         */
          set: function(fieldName, value) {
 
              var associatedStore;
              var storeName;
              var associations = this.associations.items;
              for (var i=0; i<associations.length; i++){
                  var association = associations[i];
                  storeName = association.storeName;
 
                  if (association.name==fieldName){
                      associatedStore = this[storeName];
                      if (associatedStore==null){
                          this[storeName] = associatedStore =
                              Ext.create('Ext.data.Store', {
                              model: association.model
                          })
                      }
                      break;
                  }
              }
 
              if (associatedStore!=null){
                  associatedStore.removeAll();
                  associatedStore.add(value);
                  this[storeName] = associatedStore;
              }
              else{
                //call the original set function
                  _set.apply(this, arguments);
              }
 
 
 
          }
      });
  })();
 
 
 
//**************************************************************************
//** JSON Writer Override
//*************************************************************************/
/** Overrides the native Json Writer getRecordData method to allow nested
 *  data to be send to the server via the Model.save() command. Reference:
 *  http://www.sencha.com/forum/showthread.php?124362-Nested-loading-nested-saving-in-new-data-package&p=627595&viewfull=1#post627595
 */
/*  Ext.data.writer.Json.override({
      getRecordData: function(record) {
          Ext.apply(record.data, record.getAssociatedData());
          return record.data;
      }
  });
*/
