import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const opts = {  
    state: {
        loginuser: {},
        actionURL:'',
        filter:'',
        sizelimit:0,
        userinfo:true,
        activeid:-9
    },
    getters: {
        isguest: function (state) {
            return state.loginuser.isguest;
        },
        ischief: function (state) {
            return state.loginuser.ischief;
        }
    },
    mutations: {
        //add: function (state) {
        //    state.counter += 2;
        //}
    }  
};

export default new Vuex.Store(opts);