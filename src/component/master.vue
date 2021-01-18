<template>
    <v-app-bar color="brown lighten-5" app>
        <v-app-bar-nav-icon v-if="$store.state.userinfo">
            <v-btn fab depressed small @click="clicknavi">
                <v-icon dark>
                    mdi-menu
                </v-icon>
            </v-btn>
        </v-app-bar-nav-icon>

        <v-toolbar-title>校務章則系統</v-toolbar-title>
        <v-spacer></v-spacer>
        <template v-if="$store.state.userinfo">
            <v-chip class="ma-1" label>
                <v-icon left>
                    mdi-account-circle-outline
                </v-icon>
                <template v-if="$store.state.loginuser.user_id == 'anonymous'">
                    {{$store.state.loginuser.user_name}}
                </template>
                <template v-else>
                    {{$store.state.loginuser.user_name}}({{$store.state.loginuser.user_id}})
                </template>
            </v-chip>
            <config-menu v-if="$store.getters.ischief"></config-menu>
            <login-button ref="loginb" @login="login" v-if="$store.getters.isguest"></login-button>
            <logout-button @logout="logout" v-if="!$store.getters.isguest"></logout-button>
        </template>
        <!-- <v-btn @@click="openlogindialog">test</v-btn> -->
    </v-app-bar>  
  
</template>
<script>    
    export default {
        methods:{
            login: function () {
                var THIS = this;
                this.loaduser(function () {
                    if (THIS.$store.state.loginuser.isadmin)
                        THIS.$emit('getalldirectorys',0);                        
                    else
                        THIS.$emit('getalldirectorys',-1);                        
                });
            },
            logout: function () {
                var THIS = this;
                this.loaduser(function () {                    
                    THIS.$emit('getalldirectorys',-1);   
                });
            },
            clicknavi:function(){
                this.$emit("clicknavi");
            }            
        },
        components:{
            'login-button': function (resolve){require(['./login-button.vue'], resolve)},
            'logout-button':function (resolve){require(['./logout-button.vue'], resolve)},
            'config-menu':function (resolve){require(['./config-menu.vue'], resolve)},
        },        
    }
</script>