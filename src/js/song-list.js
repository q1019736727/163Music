{
    let model = {}
    let view = {
        el:'#songList',
        template:`
            <ol>
                <li class="active">歌曲1</li>
                <li>歌曲2</li>
                <li>歌曲3</li>
                <li>歌曲4</li>
                <li>歌曲5</li>
                <li>歌曲6</li>
                <li>歌曲7</li>
                <li>歌曲8</li>
                <li>歌曲9</li>
            </ol>
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let control = {
        init:function (view,model) {
            this.view = view
            this.mode = model
            this.view.render()
        }
    }
    control.init(view,model)
}