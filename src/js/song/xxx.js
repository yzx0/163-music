{
  let view = {
    el: '#playAudio',
    render(data) {
      let {song,status} = data
      $(this.el).find('audio').attr('src',song.url)
      $(this.el).find('#cover').attr('src',song.cover)
      $(this.el).find('#background').css('background',`url(${song.cover})no-repeat center center;background-size: cover;`)
    },
    play() {
      let playPromise = $(this.el).find('audio')[0].play()
      if(playPromise !== undefined){
        playPromise.then(()=>{
          $(this.el).find('audio')[0].play()
          $(this.el).find('#icon-pause').addClass('active')
          $(this.el).find('#icon-play').removeClass('active')
          $(this.el).find('#cover').addClass('playing')
        },(error)=>{
          console.log(error)
        })
      }
    },
    pause() {
      $(this.el).find('audio')[0].pause()
      $(this.el).find('#icon-play').addClass('active')
      $(this.el).find('#icon-pause').removeClass('active')
      $(this.el).find('#cover').removeClass('playing')
    }
  }
  let model = {
    data: { 
      song: {
        id: '',
        name: '',
        singer: '',
        url: '',
        cover:''
      },
      status:'pause'
    },
    setId(id) {
      this.data.id = id
    },
    find() {
      var query = new AV.Query('song');
      return query.get(this.data.id).then((song) => {
        Object.assign(this.data.song, { ...song.attributes })
        return song
      }, function (error) {
        console.log(error)
      })
    },
    setStatus(status){
      this.data.status = status
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.model.setId(this.getId())
      this.model.find().then((song) => {
        this.view.render(this.model.data)
      }, (error) => {
        console.log(error)
      })
      this.bindEvents()
    },
    bindEvents() {
      $(this.view.el).find('#icon-play').on('click',(e) => {
        this.model.setStatus('playing')
        this.view.play()
      })
      $(this.view.el).find('#icon-pause').on('click', () => {
        this.model.setStatus('pause')
        this.view.pause() 
      })

      let audio = $(this.view.el).find('audio').get(0)
      audio.onended = ()=>{
        this.view.pause()
      }
    },
    getId() {
      let search = window.location.search
      if (search.indexOf('?') === 0) {
        search = search.substring(1)
      }

      let array = search.split('&').filter(value => value)
      let id = ''

      for (let i = 0; i < array.length; i++) {
        let x = array[i]
        let newArray = x.split('=')
        let key = newArray[0]
        let value = newArray[1]
        if (key === 'id') {
          id = value
          break
        }
      }
      return id
    }
  }
  controller.init.call(controller, view, model)
}