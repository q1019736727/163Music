{
    let model = {}
    let view = {
        el:'#songList',
        template:`
            <ol>
            </ol>
        `,
        songsData:[],
        render(data = {}){
            $(this.el).html(this.template)
            let{song,singer,url} = data
            if (song){
                let $li = $('<li></li>').text(song)
                this.songsData.push($li)
                this.songsData.reverse().map(($ele)=>{
                    $(this.el).find('ol').append($ele)
                })
            }
        }
    }
    let control = {
        init:function (view,model) {
            this.view = view
            this.mode = model
            this.view.render()
            this.bindEvents()
        },
        bindEvents:function(){
            window.eventsHub.on('creatSong',(data)=>{
                this.view.render(data)
            })
        }
    }
    control.init(view,model)

}