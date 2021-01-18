<template>
    <div>
        <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
                <v-btn class="ma-1" color="primary" depressed
                       v-bind="attrs"
                       v-on="on">
                    <v-icon left dark>
                        mdi-cog-outline
                    </v-icon>
                    設定
                </v-btn>
            </template>
            <v-list>
                <v-list-item @click="setassistant">
                    <v-list-item-icon>
                        <v-icon>mdi-account-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                        <assistant-panel>設定助理</assistant-panel>            
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        
    </div>
</template>

<script>
    export default {
         data: function () {
            return {
                showassdialog:false
            }
        },
        methods: {
            setassistant: function () {
                this.showassdialog = true;
            }
        },
        components:{
            'assistant-panel': function (resolve){require(['./assistant-panel.vue'], resolve)},
        },                
    }
</script>