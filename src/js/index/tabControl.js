{
  let view = {
    el: '#tabControl'
  }
  let model = {}
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.bindEvents()
    },
    bindEvents(){
        $(this.view.el).on('click','li',(e)=>{
        $(e.currentTarget).addClass('active').siblings().removeClass('active')
        window.eventHub.emit('selectTab',$(e.currentTarget).attr('data-tab-name'))
      })
    }
  }
  controller.init.call(controller,view,model)
}