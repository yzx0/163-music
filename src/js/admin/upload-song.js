{
  let view = {
    el: '#page>aside>#uploadBtnArea',
    template: `
      <div id="uploadBtnContainer" class="uploadBtnContainer">
        <button id="uploadBtn" class="uploadBtn">点击或拖曳上传</button>
        <p>单个文件最大40MB</p>
      </div>
    `,
    render(data) {
      $(this.el).html(this.template)
    },
    find(selector){
      return $(this.el).find(selector)[0]
    }
  }
  let model = {}
  let controler = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render()
      this.initQiniu()
    },
    initQiniu() {
      var uploader = Qiniu.uploader({
        runtimes: 'html5',    //上传模式,依次退化
        browse_button: this.view.find('#uploadBtn'),       //上传选择的点选按钮，**必需**
        uptoken_url: 'http://localhost:8888/uptoken',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        //uptoken : '/uptoken', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        //unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
        // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
        domain: 'http://plrx88tks.bkt.clouddn.com/',   //bucket 域名，下载资源时用到，**必需**
        get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
        container: this.view.find('#uploadBtnContainer'),           //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '40mb',           //最大文件体积限制
        flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
        dragdrop: true,                   //开启可拖曳上传
        drop_element: this.view.find('#uploadBtnContainer'),        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                //分块上传时，每片的体积
        auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
          'FilesAdded': function (up, files) {
            plupload.each(files, function (file) {
              // 文件添加进队列后,处理相关的事情
            });
          },
          'BeforeUpload': function (up, file) {
            // 每个文件上传前,处理相关的事情
          },
          'UploadProgress': function (up, file) {
            // 每个文件上传时,处理相关的事情
          },
          'FileUploaded': function (up, file, info) {
            // 每个文件上传成功后,处理相关的事情
            // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
            // {
            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
            //    "key": "gogopher.jpg"
            //  }
            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
            var domain = up.getOption('domain');
            var response = JSON.parse(info.response);
            var url = domain + encodeURIComponent(response.key);
            var name = response.key
            window.eventHub.emit('upload',{'url':url,'name':name})
          },
          'Error': function (up, err, errTip) {
            //上传出错时,处理相关的事情
          },
          'UploadComplete': function () {
            //队列文件处理完毕后,处理相关的事情
          }
        }
      });
    }
  }
  controler.init.call(controler, view, model)
}