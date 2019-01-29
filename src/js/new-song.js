{
  let view = {
    el: '.page > aside > .newSong',
    template: `
      新建歌曲
    `,
    render(data){
      $(this.el).html(this.template)
    },
    find(selector){
      return $(this.view.el).find(selector)[0]
    },
    active(){
      $(this.el).addClass('active')
    },
    deactive(){
      $(this.el).removeClass('active')
    }
  }
  let model = {}
  let controler = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render()
      this.bindEvents()
      window.eventHub.on('upload',(data)=>{
        this.view.active()
      })
      window.eventHub.on('select',()=>{
        this.view.deactive()
      })
    },
    bindEvents(){
      $(this.view.el).on('click',()=>{
        window.eventHub.emit('new')
        this.view.active()
      })
    }
  }
  controler.init.call(controler,view,model)
}