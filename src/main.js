import Vue from "vue";
import vuetify from './plugins/vuetify'; // path to vuetify export
import store from "./plugins/vuex";
import CHECKER from "./plugins/fieldchecker.1.0.0";
import { saveAs } from 'file-saver';
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios,axios);
/* Vue.component('async-webpack-example', function (resolve) {
    // 这个特殊的 `require` 语法将会告诉 webpack
    // 自动将你的构建代码切割成多个包，这些包
    // 会通过 Ajax 请求加载
    require(['./component/card.vue'], resolve)
});
 */
Vue.component('master',function (resolve) {
    require(['./component/master.vue'], resolve)
});
Vue.component('index',function (resolve) {
    require(['./component/index.vue'], resolve)
});
debugger;
var vm = new Vue({    
    vuetify,
    store,
    el:"#main",
    methods:{
        Set_actionURL:function (val) {
           this.$store.state.actionURL=val; 
        },
        Set_filter:function (val) {
            this.$store.state.filter=val;
        },
        Set_sizelimit:function (val) {
            this.$store.state.sizelimit=val;
        },  
        Set_activeid:function(val){
            this.$store.state.activeid=val;
        }
    },
    components:{
        'mainframe' : function (resolve){require(['./component/mainframe.vue'], resolve)},       
    }
});

vm.Set_activeid(_config.activeid);
