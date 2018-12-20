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
        },
        play(data){
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
            status: 'pause'
        },
        getURL(id) {
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
        }
    }
    controller.init(view, model)
}