import Vue from 'vue'
//import Vuetify from 'vuetify';
import Vuetify,{
    VDialog,VCard,VCardTitle,VCardText,VCardActions,VSpacer,VBtn,VIcon,VRow,VCol,VDataTable,VChip,VForm,VSelect,VAutocomplete,VMenu,
    VTextField,VDatePicker,VAlert,VList,VListItem,VNavigationDrawer,VTreeview,VTextarea,VCheckbox,VSubheader,VBreadcrumbs,VDivider,
    VSlideYTransition,VFileInput,VProgressLinear,VFooter,VApp,VAppBar,VAppBarNavIcon,VToolbarTitle,VMain,VListItemIcon,VListItemContent,
    VListItemSubtitle,VListItemAction,VListItemTitle,VSlider,VSwitch,VSpeedDial
} from 'vuetify/lib';
import { Scroll } from 'vuetify/lib/directives'

//如果css不會更動,建議不要載入至js檔
//import 'Vuetify/dist/vuetify.min.css'; 

Vue.use(Vuetify,{
    components:{
        VDialog,VCard,VCardTitle,VCardText,VCardActions,VSpacer,VBtn,VIcon,VRow,VCol,VDataTable,VChip,VForm,VSelect,VAutocomplete,VMenu,
        VTextField,VDatePicker,VAlert,VList,VListItem,VNavigationDrawer,VTreeview,VTextarea,VCheckbox,VSubheader,VBreadcrumbs,VDivider,
        VSlideYTransition,VFileInput,VProgressLinear,VFooter,VApp,VAppBar,VAppBarNavIcon,VToolbarTitle,VMain,VListItemIcon,VListItemContent,
        VListItemSubtitle,VListItemAction,VListItemTitle,VSlider,VSwitch,VSpeedDial
    },
    directives:{
        Scroll
    }
});

Vue.use(Vuetify);

const opts = {    
};

export default new Vuetify(opts);