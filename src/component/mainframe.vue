<template>
    <v-app>
        <master @getalldirectorys="getalldirectorys" @clicknavi="clicknavi"></master>
        <index ref="index"></index>  
    </v-app>
</template>
<script>
    import {TOOLSMixin} from "../plugins/tools.1.0.1";
    export default {
        mixins:[TOOLSMixin],
        data: function() {
                return {
                    userinfo:true                    
                }
            },
            computed: {
                isguest: function () {
                    return this.$store.getters.isguest;
                },
                ischief: function () {
                    return this.$store.getters.ischief;
                },
                loginuser: function () {
                    return this.$store.state.loginuser;
                },
                activeid:function(){                    
                    return this.$store.state.activeid;
                }
            },
            methods: {    
                loaduser: function (dosomething) {
                    //const axios = require('axios');
                    debugger;
                    var THIS = this;                                      
                    this.axios.get('../api/Ldap/info').then(function (response) {                        
                        THIS.$store.state.loginuser = response.data;
                        dosomething();
                        }).catch(function (error) {

                        }).then(function () {
                    });
                },            
                openlogindialog: function () {
                    this.$refs.loginb.logindialog = true;
                },
                getalldirectorys(val){
                    this.$refs.index.getalldirectorys(val);
                },
                clicknavi(){                    
                    this.$refs.navi.drawer = !this.$refs.navi.drawer;
                }
            },
            watch:{
            },
            created: function () {                
                this.loaduser(function () { this.getalldirectorys(this.activeid) });                
            }    
    }
</script>


