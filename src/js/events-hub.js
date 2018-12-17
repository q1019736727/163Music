{
    //事件通知以及处理中心,解耦
    window.eventsHub = {
        events:{},
        //执行事件
        emit:function (bindname,data) {
            if (this.events[bindname]) {
                this.events[bindname].map((fn)=>{
                    fn.call(undefined,data)
                })
            }
        },
        //绑定事件
        on:function (bindname,fn) {
            if (this.events[bindname] === undefined){
                this.events[bindname] = []
            }
            this.events[bindname].push(fn)
        }

    }
}