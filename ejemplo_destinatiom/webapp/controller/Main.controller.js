sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",    
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,Fragment) {
        "use strict";

        return Controller.extend("ejemplodestinatiom.controller.Main", {
            onInit: function () {
                const url = sap.ui.require.toUrl("ejemplodestinatiom") + '/northwind/northwind.svc';
                this._model = new sap.ui.model.odata.v2.ODataModel(url,{
                    json:true,
                    headers: {
                        "DataServiceVersion": "2.0",
                        "Cache-Control":"no-cache, no-store",
                        "Pragma": "no-cache"
                    },
                    useBatch: false
                });
                this._model.read("/Products", {
                    async:true,
                    success: jQuery.proxy(this.success, this),
                    error: jQuery.proxy(this.error, this)
                })
            },

            success: function(oData){
                const oModel = new JSONModel(oData.results);
                this.getView().setModel(oModel, "productModel");
            },

            error: function() {
                alert("error")
            },
            
            onItemPress: function(oEvent){
                const oItem = oEvent.getSource().getBindingContext("productModel");
                const sPath = oItem.getPath();

                
                const oItemSeleccionado = this.getView().getModel("productModel").getProperty(sPath);                
                const oModelItem = new JSONModel(oItemSeleccionado);
                this.getView().setModel(oModelItem, "itemModel");

                let oView = this.getView();
                if(!this.oFragment){
                    Fragment.load({
                        id: oView.getId(),
                        name: "ejemplodestinatiom.fragments.item",
                        controller: this
                    }).then(function(oDialog){
                        this.oFragment = oDialog;
                        this.getView().addDependent(this.oFragment);
                        this.oFragment.open();
                    }.bind(this));
                    return;
                }else{
                    this.oFragment.open()
                }
            },

            onCloseDialog: function(){
                this.oFragment.close()
            }
        });
    });
