{
    let model = {
        init:function () {
            var uploader = Qiniu.uploader({
                runtimes: 'html5',      // 上传模式，依次退化
                browse_button: 'uploadButton',         // 上传选择的点选按钮，必需
                uptoken_url: 'http://127.0.0.1:8888/uptoken',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
                get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                domain: 'pjv07e7aa.bkt.clouddn.com',     // bucket域名，下载资源时用到，必需
                container: 'upArea',             // 上传区域DOM ID，默认是browser_button的父元素
                max_file_size: '20mb',             // 最大文件体积限制
                max_retries: 3,                     // 上传失败最大重试次数
                dragdrop: true,                     // 开启可拖曳上传
                drop_element: 'upArea',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb',                  // 分块上传时，每块的体积
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function(up, files) {
                        plupload.each(files, function(file) {
                            // 文件添加进队列后，处理相关的事情
                        });
                    },
                    'BeforeUpload': function(up, file) {
                        window.eventsHub.emit('loadIng')
                        // 每个文件上传前，处理相关的事情
                    },
                    'UploadProgress': function(up, file) {
                        // 每个文件上传时，处理相关的事情
                    },
                    'FileUploaded': function(up, file, info) {
                        // 每个文件上传成功后，处理相关的事情
                        // 其中info.response是文件上传成功后，服务端返回的json，形式如：
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 查看简单反馈
                        window.eventsHub.emit('loadSuccess')
                        var domain = up.getOption('domain');
                        var res = JSON.parse(info.response);
                        var sourceLink = 'http://' + domain +"/"+ encodeURIComponent(res.key); //获取上传成功后的文件的Url
                        window.eventsHub.emit('upload',{song:file.name,singer:'',id:'',url:sourceLink})
                    },
                    'Error': function(up, err, errTip) {
                        //上传出错时，处理相关的事情
                    },
                    'UploadComplete': function() {
                        //队列文件处理完毕后，处理相关的事情
                    },
                    'Key': function(up, file) {
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在unique_names: false，save_key: false时才生效
                        var key = file.name;
                        return key
                    }
                }
            });

        }
    }
    let view = {
        el:'#upArea',
        template:`
            <button class="upLoadButton" id="uploadButton">点击或拖曳文件<div>最多不超过20M</div><div>因七牛云测试域名过期，已不能上传</div></button>
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render()
            this.model.init()
        }
    }
    controller.init(view,model)
}
