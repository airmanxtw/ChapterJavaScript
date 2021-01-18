import Vue from 'vue'
import Vuetify from 'vuetify';
//import Vuetify,{VBtn,VIcon,VAlert,VApp,VCard,VCardText} from 'vuetify/lib';
import 'Vuetify/dist/vuetify.min.css'; 

/* Vue.use(Vuetify,{
    components:{
        VBtn,VIcon,VAlert,VApp,VCard,VCardText
    }
});
 */

Vue.use(Vuetify);

const opts = {    
};

export default new Vuetify(opts);