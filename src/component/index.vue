<template>
    <div @dragover="dragover" @drop="drop">
        <dir-navigation ref="navi" @changeactiveid="changeactiveid"></dir-navigation>

        <v-main>
            <dir-panel ref="dirpanel" :activeid="activeid" @dirclick="dirclick" @newdir="addItems" @upddir="updItems" @deldir="delItems"></dir-panel>
            <v-footer fixed padless>
                <v-col class="text-center" cols="12">
                    版權所有 © {{$store.state.copyrightYear}} 南臺科技大學
                </v-col>
            </v-footer>            
        </v-main>
    </div>
</template>
<script>
    import {TOOLSMixin} from "../plugins/tools.1.0.1";
    import DirNavigation from "./dir-navigation.vue";
    import DirPanel from "./dir-panel.vue";
    export default {
        mixins:[TOOLSMixin],
        data:function(){
            return {
                activeid:-9
            }
        },
        methods: {
            dirclick: function (id) {                    
                this.$refs.navi.active = [id];
            },
            setHistory: function (val) {
                var value = val;
                var newurl = this.$store.state.actionURL + ((value != -1 && value != undefined) ? "/" + value : "");                
                window.history.pushState(null, null, newurl);
            },
            getalldirectorys: function (_activeid) {
                var THIS = this;                
                THIS._activeid=_activeid;                
                THIS.axios.get(this.$store.state.absURL+'api/Dir/ALLDIRECTORY', { params: {info: THIS.$store.state.loginuser.info } }).then(function (response) {                                                                
                    THIS.$refs.navi.items = response.data;
                    THIS.$refs.navi.openitems = [];
                    THIS.$refs.navi.active = [];
                    if (THIS._activeid != undefined) {                            
                        THIS.$refs.navi.active = [THIS._activeid];
                        THIS.axios.get(THIS.$store.state.absURL+'api/Open', { params: { info: THIS.$store.state.loginuser.info, activeid: THIS._activeid } }).then(function (response) {                                                            
                            THIS.$refs.navi.openitems = response.data;
                        });
                    }
                }).catch(function (error) {
                    
                }).then(function () {
                    // always executed
                });
            },
            addItems: function (item) { 
                debugger;                   
                var target = this.finditems(this.$refs.navi.items, item.parent_id);
                target.children.push(item);
                target.children = this.sortitems(target.children);
            },
            updItems: function (item) {                    
                var target = this.finditems(this.$refs.navi.items, item.id);                    
                var old_parent = this.finditems(this.$refs.navi.items, target.parent_id);                    
                var new_parent = this.finditems(this.$refs.navi.items, item.parent_id);
                if (old_parent.id == new_parent.id) {
                    TOOLS.updateitems(target, item);
                }
                else {
                    var copy_target = Object.assign({}, target);                        
                    this.delitem(this.$refs.navi.items, target.id);
                    this.updateitems(copy_target, item);
                    new_parent.children.push(copy_target);
                    new_parent.children = this.sortitems(new_parent.children);
                }
            },
            delItems: function (dirid) {                    
                this.delitem(this.$refs.navi.items, dirid);
            },
            changeactiveid: function (id) {
                this.activeid = id;
                this.setHistory(id);
            },
            dragover: function (event) {                    
                event.preventDefault();   
            },
            drop: function (event) {
                event.preventDefault();
                var files = event.dataTransfer.files;                    
                this.$refs.dirpanel.openfileupload(files);
            },
            switchdrawer:function(){                
                this.$refs.navi.drawer=!this.$refs.navi.drawer;
            }
        },
        components:{
            DirNavigation,
            DirPanel
        },      
    }
</script>