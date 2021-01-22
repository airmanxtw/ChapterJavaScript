<template>
    <div>
        <v-list-item :class="{blue:itemlight(file.id),'lighten-5':itemlight(file.id)}" 
            v-for="file in files" :key="file.id" @click.stop="fileitemclick(file.id)" two-line>
            <v-list-item-icon>
                <v-icon v-text="file.icon" large></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title class="text-md-body-1" v-text="file.name"></v-list-item-title>               
                <v-list-item-subtitle>{{file.Desc}}</v-list-item-subtitle>               
            </v-list-item-content>
            <v-btn icon v-if="canmodify" @click.stop="openmodify(file.id)">
                <v-icon>mdi-cog-outline</v-icon>
            </v-btn>
            <v-list-item-action v-if="canmodify" @click.stop="">
                <v-checkbox v-model="localCheckitem" :value="file.id"></v-checkbox>
            </v-list-item-action>
        </v-list-item>
    </div>
</template>
<script>
    export default {
        props:["files","canmodify"],
        data:function()
        {
            return {
                localCheckitem:[]
            }
        },
        methods:{           
            openmodify: function(id){
                this.$emit("openmodify",id);
            },
            fileitemclick:function(obj){
                this.$emit("fileitemclick",obj.id);
            },
            itemlight:function(id){
                return this.localCheckitem.indexOf(id) > -1 ? true : false;
            },
            checkall:function(ck){
                this.localCheckitem=[];
                var THIS=this;
                if(ck){
                    this.files.forEach(function(file){
                        THIS.localCheckitem.push(file.id);
                    })
                }
            }
        },
        watch:{
            localCheckitem:function(newval,oldval)
            {
                debugger;
                this.$emit("fileselct",newval);                
            }
        }
    }
</script>