<template>
    <div>
        <v-btn class="ma-1" color="primary" depressed @click.stop="logout">

            <v-icon left dark>
                mdi-logout
            </v-icon>
            登出
        </v-btn>

        <v-dialog v-model="dialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline grey lighten-2">
                    登出系統
                </v-card-title>

                <v-card-text>
                    系統已經登出
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary"
                           text
                           @click="confirm">
                        確定
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                dialog: false
            }
        },
        methods:{
            logout: function () {
                var THIS = this;                
                axios.get('api/Ldap/logout').then(function (response) {
                    THIS.dialog = true;
                }).catch(function (error) {
                        
                }).finally(function () {
                    // always executed
                });      
            },
            confirm: function () {
                this.dialog = false;
                this.$emit('logout');
            }
        },
    }
</script>