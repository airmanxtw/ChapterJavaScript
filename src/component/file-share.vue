<template>

    <v-dialog v-model="fileshare" width="500">
        <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-share-variant</v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title class="headline grey lighten-2">
                檔案連結
            </v-card-title>
            <v-card-text>
                <div class="mt-5 text-subtitle-1">{{name}}</div>                                    
                <input class="mt-5" style="width:100%" ref="bar" v-model="url"></input>                        
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" @click="copyurl" text>複製連結</v-btn>                
                <v-btn color="green darken-1" @click='close' text>關閉</v-btn>
            </v-card-actions>
        </v-card>
            <v-snackbar v-model="snake" :timeout="2000">
            <v-icon>mdi-check</v-icon>
            已複製連結
        </v-snackbar>
    </v-dialog>
    
</template>
<script>   
    export default {
        props:['url','name'],
        data:function(){
            return {
                fileshare:false,
                snake:false

            }
        },
        methods:{
            close:function(){
                this.fileshare=false;
            },
            copyurl:function(){                               
                this.$refs.bar.select();
                this.$refs.bar.setSelectionRange(0, 99999);
                document.execCommand("copy");
                this.snake=true;
            }
        }
    }
</script>