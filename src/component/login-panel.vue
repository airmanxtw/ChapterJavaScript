<template>
    <v-card max-width="500" class="mx-auto">
        <v-card-title class="headline grey lighten-2">
            登入系統
        </v-card-title>
        <v-card-text>
            <v-form ref="loginform" v-model="loginvalid" lazy-validation>
                <v-text-field v-model="userid"
                              :counter="20"
                              :rules="useridRules"
                              label="帳號(學號)"
                              required>
                </v-text-field>
                <v-text-field v-model="password"
                              :counter="30"
                              type="password"
                              :rules="passwordRule"
                              label="密碼"
                              required
                              @keydown="keydownlogin">
                </v-text-field>
            </v-form>
            <v-alert dense border="left" type="warning" :value="alert">
                {{alertMessage}}
            </v-alert>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="loginvalidate" :loading="loading">
                登入
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        data: function () {            
            return {                                
                loginvalid: false,
                alert: false,
                alertMessage: '',
                loading: false,
                userid: '',
                password: '',
                useridRules: [
                    v => CHECKER.blank(v) || '請填寫',
                    v => CHECKER.maxlength(v , 20) || '已超過20個字元'
                ],
                passwordRule: [
                    v => CHECKER.blank(v) || '請填寫',
                    v => CHECKER.maxlength(v, 30) || '已超過30個字元'
                ]
            }
        },
        methods: {
            loginvalidate: function () {                
                var isval = this.$refs.loginform.validate();
                if (isval) {
                    var userid = this.userid;
                    var password = this.password;  
                    var THIS = this;
                    this.loading = true;
                    axios.get('api/Ldap', {
                        params: {
                            userid: userid,
                            password: password
                        }
                        }).then(function (response) {
                            THIS.alert = !response.data;                    
                            if (THIS.alert == true) {
                                THIS.alertMessage = "您的登入嘗試失敗。請再試一次。";
                            }                            
                            else {
                                THIS.logindialog = false;
                                THIS.$emit('login');
                            }
                        }).catch(function (error) {
                            THIS.alert = true;
                            THIS.alertMessage = error.response.data;
                        }).finally(function () {
                            THIS.loading = false;
                        });                  
                }
            },
            keydownlogin: function (keyboard) {
                if (keyboard.key == "Enter") {
                    this.loginvalidate();
                }
            }
        },            
    }
</script>