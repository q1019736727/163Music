{
    let model = {}
    let view = {
        el:'#addmusicWrapper',
        template:`
            <h2>添加歌曲</h2>
            <form id="addsongForm" class="addSongForm">
                <div>
                    <label>曲名</label><input type="text">
                </div>
                <div>
                    <label>歌手</label><input type="text">
                </div>
                <div>
                    <label>外链</label><input type="text">
                </div>
                <button class="save">保存</button>
            </form>
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let control = {
        init(view,model){
            this.view = view
            this.mode = model
            this.view.render()
        }
    }
    control.init(view,model)
    window.eventsHub.on('upload',(data)=>{
        console.log('addmusicWrapper接收成功'+data)
    })
}