{
    let model = {
        songlist:[],
        selectID: undefined,//选中li的id
        init:function () {
            var query = new AV.Query('Songs');
            this.songlist = []
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
        update:function(updata,alldata,selectid){
            for (let i=0;i<alldata.length;i++){
                let temp = alldata[i]
                if (temp.id === updata.id){
                    alldata[i] = updata
                    break;
                }
            }
            $(this.el).html(this.template)
            alldata.map((song)=>{
                let $li = $('<li></li>').text(song.song).attr('data-song-id',song.id)
                if ($li.attr('data-song-id') === selectid ){
                    $li.addClass('active')
                }
                $(this.el).find('ol').append($li)
            })
        },
        deActive:function() {
            this.$el.find('li').removeClass('active')
        }
    }
    let controller = {
        init:function (view,model) {
            this.view = view
            this.model = model
            this.view.render()
            this.view.init()
            this.bindEvents()
        },
        bindEvents:function(){
            window.eventsHub.on('creatSong',(data)=>{
                this.getSonglist()
                window.eventsHub.emit('clearValue')//清空输入框
            })
            window.eventsHub.on('upDataSong',(data)=>{
                this.view.update(data,this.model.songlist,this.model.selectID)
            })
            this.clickSong()
            this.getSonglist()
            this.titleEvents()
        },
        getSonglist:function(){
            window.eventsHub.emit('loadIng')
            this.model.init().then(()=>{
                window.eventsHub.emit('loadSuccess')
                this.view.render(this.model.songlist)
            })
        },
        clickSong:function () {
            this.view.$el.on('click','li',(e)=>{
                $(e.currentTarget).addClass('active').siblings().removeClass('active')
                $('.songtitle').removeClass('active')
                let songs = this.model.songlist
                for (let i=0;i<songs.length;i++){
                    let song = songs[i]
                    if (song.id === $(e.currentTarget).attr('data-song-id')) {
                        this.model.selectID = song.id
                        window.eventsHub.emit('songlistClick',JSON.parse(JSON.stringify(song)))
                        break
                    }
                }
            })
        },
        titleEvents:function() {
            $('.songtitle').on('click',(e)=>{
                $(e.currentTarget).addClass('active')
                this.view.deActive()
                window.eventsHub.emit('songlistClick',{
                    song:'',
                    singer:'',
                    url:'',
                    id:''
                })
            })
        }
    }
    controller.init(view,model)
}