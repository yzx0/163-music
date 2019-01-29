{
  let view = {
    el: '.page > main',
    template: `
    <form class="form">
      <div class="row">
        <label>歌名
          <input name="name" type="text" value="__name__">
        </label>
      </div>
      <div class="row">
        <label>歌手
          <input name="singer" type="text">
        </label>
      </div>
      <div class="row">
        <label>外链
          <input name="url" type="text" value="__url__">
        </label>
      </div>
      <div class="row">
        <button type="submit">保存</button>
      </div>
    </form>
    `,
    init() {
      this.$el = $(this.el)
    },
    render(data = {}) {
      let placeholders = ['name', 'url']
      let html = this.template
      placeholders.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '')
      })

      $(this.el).html(html)
      /* let html = this.template
      if($.isEmptyObject(data)){
        let html = this.template
        html = html.replace('__songName__','')
        html = html.replace('__sourceLink__','')
        $(this.el).html(html)
      }else{
        console.log(data['songName'])
        html = html.replace('__songName__',data['songName'] || '')
        html = html.replace('__sourceLink__',data['sourceLink'] || '')
        $(this.el).html(html) 
      } */
    },
    reset() {
      this.render({})
    }
  }
  let model = {
    data: {
      name: '', singer: '', url: '', id: ''
    },
    create(data) {
      var song = AV.Object.extend('song')
      var song = new song()

      song.set('name', data.name)
      song.set('singer', data.singer)
      song.set('url', data.url)

      return song.save().then((newSong) => {
        let { id, attributes } = newSong
        Object.assign(this.data, { id, ...attributes })
      }, (error) => {
        console.error(error)
      })
    },
    updata(data) {
      // 第一个参数是 className，第二个参数是 objectId
      var song = AV.Object.createWithoutData('song',this.data.id)
      // 修改属性
      song.set('name',data.name)
      song.set('url',data.url)
      // 保存到云端
      return song.save().then((response)=>{
        Object.assign(this.data,data)
        console.log(this.data)
        return response
      })
    }
  }
  let controler = {
    init(view, model) {
      this.view = view
      this.model = model
      this, view.init()
      this.view.render()
      this.bindEvents()
      window.eventHub.on('upload', (data) => {
        this.view.render(data)
      })
      window.eventHub.on('select', (data) => {
        this.view.render(data)
        this.model.data = data
      })
      window.eventHub.on('new', () => {
        this.view.render({})
      })
    },
    bindEvents() {
      this.view.$el.on('submit', 'form', (e) => {
        e.preventDefault()
        let data = {}
        let needs = 'name singer url'.split(' ')
        needs.map((string) => {
          data[string] = this.view.$el.find(`input[name=${string}]`).val()
        })
        if(this.model.data.id){
          this.model.updata(data).then(()=>{  
            window.eventHub.emit('updata',JSON.parse(JSON.stringify(this.model.data)))
          })
        }else{
          this.model.create(data)
          .then(() => {
            this.view.reset()
            let copyData = JSON.parse(JSON.stringify(this.model.data))
            window.eventHub.emit('create', copyData)
          })
        }
      })
    }
  }
  controler.init.call(controler, view, model)
}