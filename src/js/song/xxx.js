{
  let view = {
    el:'#playAudio',
    template:`
      <audio autoplay src="{{url}}"></audio>
      <button id="play">播放</button>
      <button id="pause">暂停</button>
    `,
    render(data){
      $(this.el).html(this.template.replace('{{url}}'),data.url)
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
      var song = new AV.Query('song');
      return song.get(this.data.id).then((song)=>{
        return song
      }, function (error) {
        console.log(error)
      });
    }
  }
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.model.setId(this.getId())
      this.model.find().then((song)=>{
        console.log(song)
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
  controller.init(view,model)
}