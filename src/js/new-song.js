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
    }
  }
  let model = {}
  let controler = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render()
      window.eventHub.on('upload',(data)=>{
        this.active()
      })
    },
    active(){
      $(this.view.el).addClass('active')
    }
  }
  controler.init.call(controler,view,model)
}