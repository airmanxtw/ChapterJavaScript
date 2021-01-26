<template>
    <v-app>
        <v-app-bar color="brown lighten-5" app>
            <v-toolbar-title>南臺科技大學校務章則系統</v-toolbar-title>
        </v-app-bar>
        <v-main>
             <v-container>
                <v-row>
                    <v-col class="text-center" col="12">
                        <v-alert border="top"
                                colored-border
                                type="warning" icon="mdi-alert-outline"
                                elevation="2" max-width="500" class="mx-auto text-left">
                            {{message}}
                        </v-alert>
                        <login-panel @login="login" v-if="showloginpanel"></login-panel>
                    </v-col>
                </v-row>
            </v-container>            
        </v-main>
    </v-app>
</template>
<script>    
    export default {
        data:function(){
            return {                
                showloginpanel:true,
                message:''
            }
        },
        methods:{
            loaduser: function (dosomething) {
            var THIS = this;
            THIS._dosomething = dosomething;      
            this.axios.get(this.$store.state.absURL + "api/Ldap/info")
                .then(function (response) {                    
                    THIS.$store.state.loginuser = response.data;
                    THIS._dosomething();
                })
                .catch(function (error) {})
                .then(function () {});
            },
            login:function(){
                this.showloginpanel = false;
                location.reload();
            },
            start:function(){
                var THIS = this;                               
                if (this.$store.state.loginuser.isguest) {
                    this.axios.get(this.$store.state.absURL + "api/FileInfo", { params: { id: this.activeid } }
                    ).then(function (response) {
                        THIS.message = `檔案 ${response.data.name} ${response.data.priorityDesc}下載使用,請登入帳號確認身分進行下載.`;
                    }).catch(function (error) {
                    }).then(function () {

                    });
                }
                else {
                    this.message = "您無權限下載此檔案";
                    this.showloginpanel = false;
                }
            }
        },
        watch:{
          
        },
        computed:{
            activeid:function(){
                return this.$store.state.activeid;                    
            }            
        },
        components:{
            'login-panel': function (resolve){require(['./login-panel.vue'], resolve)}
        },
        created:function() {
            var THIS=this;
            this.loaduser(function(){
                THIS.start();                    
            });                
        }
    }
</script>