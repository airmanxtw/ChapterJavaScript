import 'core-js/stable'
import 'regenerator-runtime/runtime'

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

// import master from "./component/master.vue";
// import index from "./component/index.vue";
// Vue.components("master",master);
// Vue.components("index",index);

// 如果兩個組件之間互有關連,不建議一開始就載入異步組件
// Vue.component('master',function (resolve) {
//     require(['./component/master.vue'], resolve)
// });
// Vue.component('index',function (resolve) {
//     require(['./component/index.vue'], resolve)
// });


var vm = new Vue({    
    vuetify,
    store,
    el:"#main",
    methods:{                
    },
    components:{
        'mainframe' : function (resolve){require(['./component/mainframe.vue'], resolve)}, 
        'mainframeforfile':function (resolve){require(['./component/mainframeforfile.vue'], resolve)}      
    }
});
vm.SetConfig(_config);

