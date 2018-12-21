{
    let model = {
        data:{
            song:{
                song:'',
                singer:'',
                url:'',
                id:'',
                cover:'',
                lyrics:''
            }
        },
        upLoad:function(data) {
            var Songs = AV.Object.extend('Songs');
            var song = new Songs();
            for(let key in data){
                song.set(key, data[key]);
            }
            return song.save().then(()=>{
                Object.assign(this.data.song,data)
                return this.data.song
            });
        },
        update:function(data) {
            var song = AV.Object.createWithoutData('Songs', data.id);
            for(let key in data){
                song.set(key ,data[key]);
            }
            return song.save().then(()=>{
                Object.assign(this.data.song,data)
                return this.data.song
            });
        }
    }
    let view = {
        el:'#addmusicWrapper',
        init:function(){
            this.$el = $(this.el)
        },
        template:`
            <h2>添加歌曲</h2>
            <form id="addsongForm" class="addSongForm">
                <div>
                    <label>曲名</label><input type="text" value="__song__">
                </div>
                <div>
                    <label>歌手</label><input type="text" value="__singer__">
                </div>
                <div>
                    <label>外链</label><input type="text" value="__url__">
                </div>
                <div>
                    <label>封面</label><input type="text" value="__cover__">
                </div>
                <div>
                    <label style="vertical-align: top">歌词</label>
                    <textarea style="font-size: 15px" cols="50" rows="10">__lyrics__</textarea>
                </div>
                <button class="save">保存</button>
            </form>
        `,
        render(data = {}){//ES6语法,如果data为undefined,就初始化一个空的对象
            let titlarr = ['song','singer','url','cover','lyrics']
            let html = this.template
            titlarr.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            })
            if (data.id){
                this.$el.find('h2').text('编辑歌曲')
            }else{
                this.$el.find('h2').text('添加歌曲')
            }
            $(this.el).html(html)
        },
        clearValue:function () {
            $(this.el).find('input[type=text]').val('')
        },
        editValue({song,singer,url,id,cover,lyrics}){
            if (id){
                this.$el.find('h2').text('编辑歌曲')
            }else{
                this.$el.find('h2').text('添加歌曲')
            }
            let texts =  $(this.el).find('input[type=text]')
            let $textarea = $(this.el).find('textarea')
            let titleArr = [song,singer,url,cover,lyrics]
            titleArr.forEach((value,index)=>{
                texts.eq(index).val(titleArr[index])
            })
            $textarea.val(titleArr[4])
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.view.render()
            this.bindEvents()
        },
        bindEvents:function () {
            window.eventsHub.on('upload',(data)=>{
                this.view.render(data)
            })
            window.eventsHub.on('clearValue',()=>{
                this.view.clearValue()
            })
            this.upLoadmp3()
            this.editSong()
        },
        //上传mp3到leancloud
        upLoadmp3:function () {
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                let $texts = this.view.$el.find('input[type=text]')
                let textarea = this.view.$el.find('textarea')
                let songData = {
                    song:$texts.eq(0).val(),
                    singer:$texts.eq(1).val(),
                    url:$texts.eq(2).val(),
                    id:this.model.data.song.id,
                    cover: $texts.eq(3).val(),
                    lyrics: textarea.val()
                }
                window.eventsHub.emit('loadIng')
                if (this.model.data.song.id){
                    this.model.update(songData).then(()=>{
                        window.eventsHub.emit('loadSuccess')
                        window.eventsHub.emit('upDataSong',JSON.parse(JSON.stringify(this.model.data.song)))
                    })
                } else{
                    this.model.upLoad(songData).then(()=>{
                        window.eventsHub.emit('loadSuccess')
                        window.eventsHub.emit('creatSong',JSON.parse(JSON.stringify(this.model.data.song)))
                    })
                }
            })

        },
        editSong(){
            window.eventsHub.on('songlistClick',(data)=>{
                this.model.data.song = {}
                Object.assign(this.model.data.song,data)
                this.view.editValue(this.model.data.song)
            })
        }
    }
    controller.init(view,model)
}