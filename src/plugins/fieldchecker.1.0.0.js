const CHECKERMixin={
    methods:{
        blank: function (str) {
            return !!str;
        },
        maxlength: function (str, max) {        
            return (str == undefined) || (str.length <= max);
        }
    }
};

export {CHECKERMixin}
