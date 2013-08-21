jQuery.noConflict();
jQuery.ajaxSetup({ async:false });
var Class = jQuery.Class
var JQAjax = Class.create({
    init: function (){
        this.file       = "design";
        this.sis_id     = 1;
        this.controller = ""
        this.action     = "iniciar"
        this.json       = ""
        this.formResult = "frmResult";
        this.returnInForm = true;
        this.showError = true;
    },
    setAction:function(action) {
      this.action=action;
    },
    getAction:function(){
        return this.action;
    },
    setController:function(controller){
        this.controller=controller
    },
    setSis_id:function(sis_id){
        this.sis_id = sis_id
    },
    setJson:function(json){
        this.json=json
    },
    setFormResult:function(formName){
        this.formResult = formName;
    },
    setReturnInForm: function(value){
        this.returnInForm = value;
    },
    setShowError:function(show){
        this.showError = show;
    },
    getInfo:function(data) {
        var result= jQuery.post(this.file+"/"+this.controller+"/"+this.action, {
            json : this.json},
            function (data) {
                return data;
            }).responseText
        
        
        
        /*var result= jQuery.post(this.file, {
            sis_id :this.sis_id,controller: this.controller, action: this.action, json : this.json},
            function (data) {
                return data;
            }).responseText*/
        //console.debug(result) 
        if (result=="\n") {
        	//alert("Error en servidor..")
        	return false;
        }
        if (result=="") {
        	//alert("Error en servidor..")
        	return false;
        }
        try{
        	result = jQuery.parseJSON(result);
        }catch(e) {
        	//alert("Error en servidor..")
        	return false;        	
        }
        if (result.success){
            if (this.returnInForm){
                jQuery("#" + this.formResult).html(result.data);
            }else{
                return result;
            }
        }else{
            if (this.showError){
                for(var _id in result.errors){
                    alert( result.errors[_id]);
                }
            }else{
                    return result;
            }
        }
        return false;
    }
})