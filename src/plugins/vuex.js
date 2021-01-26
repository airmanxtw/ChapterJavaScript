import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const opts = {  
    state: {
        loginuser: {},
        actionURL: _config.actionURL,
        filter: _config.filter,
        sizelimit: _config.sizelimit,
        userinfo:true,
        activeid: _config.activeid,
        absURL: _config.absURL,
        copyrightYear: _config.copyrightYear,
        filter: _config.filter,        
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