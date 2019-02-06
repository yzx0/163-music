{
  let view = {
    el:'#playAudio',
    template:`
      <audio autoplay src="{{url}}"></audio>
      <button id="play">播放</button>
      <button id="pause">暂停</button>
    `,
    render(data){
      console.log('render')
      console.log(data.url)
      $(this.el).html(this.template.replace('{{url}}',data.url))
    },
    play(){
      $(this.el).find('audio')[0].play()
    },
    pause(){
      $(this.el).find('audio')[0].pause()
    }
  } 
  let model = {
    data:{
      id:'',
      name:'',
      singer:'',
      url:''
    },
    setId(id){
      this.data.id = id
    },
    find(){
      var query = new AV.Query('song');
      return query.get(this.data.id).then((song)=>{
        Object.assign(this.data,{...song.attributes})
        return song 
      }, function (error) {
        console.log(error)
      })
    }
  }
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.bindEvents()
      this.model.setId(this.getId())
      this.model.find().then((song)=>{
        this.view.render(this.model.data)
      },(error)=>{
        console.log(error)
      })
    },
    bindEvents(){
      $(this.view.el).on('click','#play',()=>{
        this.view.play()
      })
      $(this.view.el).on('click','#pause',()=>{
        this.view.pause()
        console.log(111)
      })
    },
    getId(){
      let search = window.location.search
      if(search.indexOf('?') === 0){
        search = search.substring(1)
      }

      let array = search.split('&').filter(value=>value)
      let id = ''

      for(let i=0;i<array.length;i++){
        let x = array[i]
        let newArray = x.split('=')
        let key = newArray[0]
        let value = newArray[1]
        if(key === 'id'){
          id = value
          break
        }
      }
      return id
    }
  }
  controller.init.call(controller,view,model)
}