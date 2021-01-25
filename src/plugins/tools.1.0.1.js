const TOOLSMixin = {
    methods:{
        sortitems: function(items) {        
            var newitems = items.sort(function (a, b) {            
                if (a.sortby < b.sortby)
                    return -1;
                else if (a.sortby > b.sortby)
                    return 1;
                else
                    if (a.id < b.id)
                        return 1;
                    else if (a.id > b.id)
                        return -1;
                    else
                        return 0;
            });
            return newitems;
        },
        //搜尋
        finditems: function(items, findid) {
            var rs = undefined;
            for (var index = 0; index < items.length; index++) {
                if (items[index].id == findid) {
                    rs = items[index];
                    break;
                }
                else if (items[index].children != undefined && items[index].children.length > 0) {
                    rs = this.finditems(items[index].children, findid);
                    if (rs != undefined) break;
                }
            }
            return rs;
        },
    
        //新增於子項目
        addByitem: function(item, additem) {
            this.addByitems(item.children,additem);
        },
    
        //新增於平行項目
        addByitems: function(items, additem) {
            items.push(additem);
            items = this.sortitems(items);
        },
    
        //刪除,實驗
        delitem: function(items, removeid) {        
            var isremove = false;
            for (var index = 0; index < items.length; index++) {
                if (items[index].id == removeid) {
                    items.splice(index, 1);
                    isremove = true;
                }
                else if (items[index].children != undefined && items[index].children.length > 0) {                
                    isremove = this.delitem(items[index].children, removeid);                
                }
                if (isremove) break;
            }
            return isremove;
        },
        //修改
        updateitems: function(olditem, newitem) {
            if (olditem.name != newitem.name) olditem.name = newitem.name;
            if (olditem.description != newitem.description) olditem.description = newitem.description;
            if (olditem.sortby != newitem.sortby) olditem.sortby = newitem.sortby;
            if (olditem.parent_id != newitem.parent_id) olditem.parent_id = newitem.parent_id;
            if (olditem.priority != newitem.priority) olditem.priority = newitem.priority;
        },            
        test: function(){
            return "**test**";
        },
    }
};
export {TOOLSMixin}

   //排序
   


