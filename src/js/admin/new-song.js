{
  let view = {
    el: '.page > main > .newSong',
    template: `
      <button class="creatSong" id="creatSong">新建歌曲</button>
    `,
    render(data){
      $(this.el).html(this.template)
    }
  }
  let model = {}
  let controler = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render()
      this.bindEvents()
    },
    bindEvents(){
      $(this.view.el).on('click',()=>{
        window.eventHub.emit('new')
      })
    }
  }
  controler.init.call(controler,view,model)
}