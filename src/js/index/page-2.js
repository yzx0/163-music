{
  let view = {
    el: '#hotSongsList',
    show(){
      $(this.el).addClass('active')
    },
    hide(){
      $(this.el).removeClass('active')
    }
  }
  let model = {}
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.bindEventHub()
    },
    bindEventHub(){
      window.eventHub.on('selectTab',(tabName)=>{
        if(tabName === 'page-2'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
    }
  }
  controller.init.call(controller,view,model)
}