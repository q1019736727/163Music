{
    let view = {
        el: '#app',
        init() {
            this.$el = $(this.el)
            this.audio = this.$el.find('audio')[0]
        },
        template: `
        `,
        render() {

        },
        setBG(data) {
            this.$el.append(`
                 <style>
                 .songPage::before
                 {
                     background:url(${data.cover}) no-repeat center center;
                     background-size: cover;
                 }
                 </style>
`           );
            this.$el.find('.cover').append(`
                <style>
                .cover
                {
                    background:url(${data.cover}) no-repeat center center;
                    background-size: cover;
                }
                </style>
            `)
            this.audio.src = data.url
            this.$el.find('span>img').removeClass('hidden')
            this.$el.find('.cover').addClass('active')
            this.$el.find('h4').text(`${data.song}`)
            //渲染歌词
            let lyricslist = data.lyrics.split('\n')
            let regex = /^\[(.+)\](.*)$/
            lyricslist.map((sting)=>{
                let spil = regex.exec(sting)
                let total = spil[1].split(':')
                let totalSecond = parseFloat(total[0]*60) + parseFloat(total[1])
                let p = document.createElement('p')
                p.textContent = spil[2]
                p.setAttribute('data-song-time',totalSecond)
                this.$el.find('.lyrics-list').append(p)
            })
        },
        play(){
            this.$el.find('.cover').addClass('play').removeClass('pause')
            this.$el.find('span>img').addClass('active')
            this.audio.play()
        },
        pause(){
            this.$el.find('.cover').addClass('pause').removeClass('play')
            this.$el.find('span>img').removeClass('active')
            this.audio.pause()
        }

    }
    let model = {
        data: {
            song: {
                song: '',
                singer: '',
                url: '',
                id: '',
                lyrics: '',
                cover: ''
            },
            status: 'pause',
        },
        getURL(id) {
            var query = new AV.Query('Songs');
            return query.get(id).then((song) => {
                // 成功获得实例
                this.data.song = {...song.attributes}
            }, function (error) {
                // 异常处理
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.bindEvents()
        },
        bindEvents() {
            let id = window.location.search.split('=')[1]
            this.model.getURL(id).then(() => {
                this.view.setBG(this.model.data.song)
                this.watchPlay()
            })
            this.view.$el.on('click',()=>{
                if (this.model.data.status === 'pause'){
                    this.model.data.status = 'play'
                    this.view.play()
                }else {
                    this.model.data.status = 'pause'
                    this.view.pause()
                }
            })
        },
        watchPlay(){
            let listContent = this.view.$el.find('.lyrics-list')
            let allP = this.view.$el.find('p')
            //播放中
            this.view.audio.ontimeupdate = ()=> {
                let time = this.view.audio.currentTime
                let p
                for(let i =0;i<allP.length;i++){
                    if (i>allP.length-1){
                        break
                    }
                    let currentTime = allP.eq(i).attr('data-song-time')
                    let nextTime = allP.eq(i+1).attr('data-song-time')
                    if(currentTime <= time && time < nextTime){
                        p = allP[i]
                        break
                    }
                }
                let pHeight = $(p).offset().top
                let height = pHeight - listContent.offset().top
                this.view.$el.find('.lyrics-list').css({
                    transform: `translateY(${-(height)}px)`
                })
                $(p).addClass('active').siblings().removeClass('active')
            }
            //播放结束
            this.view.audio.onended = ()=>{
                this.view.pause()
                this.view.$el.find('.lyrics-list').css({
                    transform: `translateY(0px)`
                })
            }

        }
    }
    controller.init(view, model)
}