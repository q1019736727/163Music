{
    let view = {
        el:'#siteLoading',
        show(){
            $(this.el).addClass('active')
        },
        hidden(){
            $(this.el).removeClass('active')
        }
    }
    let controller = {
        init(view){
            this.view = view
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventsHub.on('loadSuccess',()=>{
                this.view.hidden()
            })
            window.eventsHub.on('loadIng',()=>{
                this.view.show()
            })
        }
    }
    controller.init(view)
}