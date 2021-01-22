<template>
    <v-data-table v-if="files.length>0"
        :headers="filesGrid.headers"
        :items="files"
        item-key="id"
        disable-pagination
        :show-select="canmodify"
        hide-default-footer             
        @input="filetableselct"           
        class="elevation-1 mb-3"
        @click:row="fileitemclick"
        :value="localCheckitem"
        >
        <template v-slot:item.createDate="{item}">
            {{item.createDate}}
            <v-icon class="mr-2" v-if="canmodify" @click.stop="openmodify(item.id)">
                mdi-cog-outline
            </v-icon>
        </template>
    </v-data-table>    
</template>
<script>
    export default {
        props:["files","canmodify"],
        data:function(){
            return {
               filesGrid:{
                    headers:[
                        {text:'檔名',value:'name',class:"text-subtitle-1"},
                        {text:'說明',value:'description',class:"text-subtitle-1"},
                        {text:'開放權限',value:'priorityDesc',width:120,class:"text-subtitle-1"},  
                        {text:'傳檔日期',value:'createDate',width:150,class:"text-subtitle-1"}                      
                    ]                        
                },
                localCheckitem:[] 
            }
        },
        methods:{
            filetableselct:function(obj){                
                var _checkitem=[];
                obj.forEach(function(item){
                    _checkitem.push(item.id);
                })
                this.$emit("fileselct",_checkitem);
            },
            openmodify: function(id){
                this.$emit("openmodify",id);
            },
            fileitemclick:function(obj){
                this.$emit("fileitemclick",obj.id);
            }
        }
    }
</script>
