{
    let model = {
        songlist:[],
        init:function () {
            this.songlist = []
            var query = new AV.Query('Songs');
            return query.find().then((songs)=>{
                songs.map((song)=>{
                    let item = {...song.attributes}
                    item.id = song.id
                    this.songlist.push(item)
                })
                return JSON.parse(JSON.stringify(this.songlist))//防止原始数据被修改
            },(error)=>{
                console.log(error)
            })
        }
    }
    let view = {
        el:'#songList',
        template:`
            <ol>
            </ol>
        `,
        init(){
           this.$el = $(this.el)
        },
        //渲染所有数据
        render(data = []){
            $(this.el).html(this.template)
            data.map((song)=>{
                let $li = $('<li></li>').text(song.song).attr('data-song-id',song.id)
                $(this.el).find('ol').append($li)
            })
        },
        //渲染单个数据
        // renderSingle(data={}){
        //     let {song,singer,url} = data
        //     let $li = $('<li></li>').text(song)
        //     $(this.el).find('ol').prepend($li)
        // }
    }
    let control = {
        init:function (view,model) {
            this.view = view
            this.model = model
            this.view.render()
            this.view.init()

            this.bindEvents()
        },
        bindEvents:function(){
            window.eventsHub.on('creatSong',(data)=>{
                // this.view.renderSingle(data)
                this.getSonglist()
                window.eventsHub.emit('clearValue')//清空输入框
            })
            this.clickSong()
            this.getSonglist()
        },
        getSonglist:function(){
            this.model.init().then((songs)=>{
                this.view.render(songs)
            })
        },
        clickSong:function () {
            this.view.$el.on('click','li',(e)=>{
                $(e.currentTarget).addClass('active').siblings().removeClass('active')
                $('.songtitle').removeClass('active')
                window.eventsHub.emit('songlistClick',{
                    song:$(e.currentTarget).text(),
                    singer:'',
                    url:'',
                    id:$(e.currentTarget).attr('data-song-id')
                })
            })
        }
    }
    control.init(view,model)

}