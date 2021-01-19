<template>
    <v-dialog v-model="logindialog" width="500">
            <template v-slot:activator="{ on, attrs }">
                <v-btn class="ma-1" color="primary" depressed v-bind="attrs" v-on="on">
                    <v-icon left dark>
                        mdi-login
                    </v-icon>
                    登入
                </v-btn>
            </template>
            <login-panel @login="login"></login-panel>
        </v-dialog>
</template>
<script>
    export default {
        data: function () {            
            return {                
                logindialog:false,
            }
        },
        methods: {
            login: function () {
                this.$emit('login');
            }
        }, 
        components:{
            'login-panel': function (resolve){require(['./login-panel.vue'], resolve)},
        },         
    }
</script>