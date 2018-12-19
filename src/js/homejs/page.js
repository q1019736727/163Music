{
    let view ={
        el:'#pageWrapper',
        init(){
            this.$el = $(this.el)
        },
        switchPageOne(){
            this.changePagection(0)
        },
        switchPageTwo(){
            this.changePagection(1)
        },
        switchPageThree(){
            this.changePagection(2)
        },
        changePagection(index){
            this.$el.find('.page').eq(index).addClass('active').siblings().removeClass('active')
        }
    }
    let model = {}
    let  controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('click','li',(e)=>{
                $(e.currentTarget).addClass('active').siblings().removeClass('active')
            })
            window.eventsHub.on('changePage',(selectName)=>{
                switch (selectName) {
                    case 'songRecommend':
                        this.view.switchPageOne()
                        break
                    case 'songHot':
                        this.view.switchPageTwo()
                        break
                    case 'songSearch':
                        this.view.switchPageThree()
                        break
                }
            })
        }
    }
    controller.init(view,model)
}