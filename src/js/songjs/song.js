{
    let view = {
        el:'#app',
        init(){
          this.$el = $(this.el)
        },
        template:`
        `,
        render(){

        }
    }
    let model = {
        data:{
            song:{
                song:'',
                singer:'',
                url:'',
                id:''
            }
        },
        getURL(id){
            var query = new AV.Query('Songs');
            return query.get(id).then((song) => {
                // 成功获得实例
                this.data.song = {...song.attributes}
                return song
            }, function (error) {
                // 异常处理
            });
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.bindEvents()
        },
        bindEvents(){
            let id = window.location.search.split('=')[1]
            this.model.getURL(id).then(()=>{
                let audio = this.view.$el.find('audio')[0]
                audio.src = this.model.data.song.url
                setTimeout(()=>{
                    audio.play()
                },3000)
            })
        }
    }
    controller.init(view,model)
}