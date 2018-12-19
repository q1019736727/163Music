{
    let view = {
        el: '#pageOne',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <ol></ol>
        `,
        render(data) {
            this.$el.append(this.template)
            data.map((song) => {
                let $li = $(`
                <li>
                    <div class="singlesongWrapper">
                        <span class="song">${song.song}</span>
                        <span class="singer">${song.singer}</span>
                        <span>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-play"></use>
                            </svg>
                        </span>
                    </div>
                </li>
            `)
                this.$el.find('ol').append($li)
            })
        }
    }
    let model = {
        data: {
            songs: [],
            song: {
                song: '',
                singer: '',
                url: '',
                id: ''
            }
        },
        fetchData() {
            var query = new AV.Query('Songs');
            return query.find().then((songs) => {
                songs.map((song) => {
                    let item = {...song.attributes}
                    item.id = song.id
                    this.data.songs.push(item)
                })
                return JSON.parse(JSON.stringify(this.data.songs))//防止原始数据被修改
            }, (error) => {
                console.log(error)
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.model.fetchData().then(() => {
                this.view.render(this.model.data.songs)
            })
        }
    }
    controller.init(view, model)
}