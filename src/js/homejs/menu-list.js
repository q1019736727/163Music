{
    let view ={
        el:'#topNav .menu-list',
        init(){
            this.$el = $(this.el)
        },
        template:`
            <ol>
                <li class="active" data-select-name="songRecommend">推荐音乐</li>
                <li data-select-name="songHot">热歌榜</li>
                <li data-select-name="songSearch">搜索</li>
            </ol>
        `,
        render(){
            this.$el.html(this.template)
        }
    }
    let model = {}
    let  controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.view.render()
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('click','li',(e)=>{
                $(e.currentTarget).addClass('active').siblings().removeClass('active')
                window.eventsHub.emit('changePage',$(e.currentTarget).attr('data-select-name'))
            })
        }
    }
    controller.init(view,model)
}