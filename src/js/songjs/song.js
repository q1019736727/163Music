{
    let view = {
        el: '#app',
        init() {
            this.$el = $(this.el)
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
        },
        play(data){
            this.$el.find('span>img').removeClass('active')
            let audio = this.$el.find('audio')[0]
            audio.src = data.url
            audio.play()
        },
        pause(){
            this.$el.find('span>img').addClass('active')
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
            }
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
                this.view.play(this.model.data.song)
            })
        }
    }
    controller.init(view, model)
}