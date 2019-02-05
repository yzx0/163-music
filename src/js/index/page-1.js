{
  let view = {
    el: '#page',
    init(){
      this.$el = $(this.el)
    },
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
      this.view.init()
      this.loadModule1()
      this.loadModule2()
      this.bindEventHub()
    },
    bindEventHub(){
      window.eventHub.on('selectTab',(tabName)=>{
        if(tabName === 'page-1'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
    },
    loadModule1(){
      let script1 = document.createElement('script')
      script1.src = './js/index/page-1-1.js'
      window.onload = function (){console.log('模块一加载完毕')}
      document.body.appendChild(script1)
    },
    loadModule2(){
      let script2 = document.createElement('script')
      script2.src = './js/index/page-1-2.js'
      window.onload = function (){console.log('模块二加载完毕')}
      document.body.appendChild(script2)
    }
  }
  controller.init.call(controller,view,model)
}