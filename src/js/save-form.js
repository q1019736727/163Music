{
    let model = {}
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
                <button class="save">保存</button>
            </form>
        `,
        render(data = {}){//ES6语法,如果data为undefined,就初始化一个空的对象
            let titlarr = ['song','singer','url']
            let html = this.template
            titlarr.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        },
        clearValue:function () {
            $(this.el).find('input[type=text]').val('')
        },
        editValue({song,singer,url,id}){
            let texts =  $(this.el).find('input[type=text]')
            let titleArr = [song,singer,url]
            titleArr.forEach((value,index)=>{
                texts.eq(index).val(titleArr[index])
            })
        }
    }
    let control = {
        init(view,model){
            this.view = view
            this.view.init()
            this.mode = model
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
                let songData = {
                    song:$texts.eq(0).val(),
                    singer:$texts.eq(1).val(),
                    url:$texts.eq(2).val()
                }
                var Songs = AV.Object.extend('Songs');
                var song = new Songs();
                for(let key in songData){
                    song.set(key, songData[key]);
                }
                song.save().then(function (data) {
                    window.eventsHub.emit('creatSong',songData)
                }, function (error) {
                    console.error('Failed to create new object, with error message: ' + error.message);
                });
            })

        },
        editSong(){
            window.eventsHub.on('songlistClick',(data)=>{
                this.view.editValue(data)
            })
        }
    }
    control.init(view,model)

}