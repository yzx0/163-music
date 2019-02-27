{
  let view = {
    el: '#playAudio',
    render(data) {
      let { song, status } = data
      $(this.el).find('audio').attr('src', song.url)
      $(this.el).find('#cover').attr('src', song.cover)
      $(this.el).find('#background').css('background', `url(${song.cover})no-repeat center center;background-size: cover;`)
      $(this.el).find('#song-description h3').text(song.name)
      
      let { lyric } = song

      let array = lyric.split('\n')
      
      //时间和歌词分开
      let newArray = array.map((string) => {
        return string.split(']')
      })
      //去掉时间的中括号
      let time = newArray.map((sentence)=>{
        return sentence[0].substring(1)
      })
      //转换成秒
      let newTime = time.map((string)=>{
        let temp = string.split(':')
        let minutes = temp[0]
        let seconds = temp[1]
        let newTime = parseInt(minutes,10)*60 + parseFloat(seconds,10)
        return newTime
      })
      //创建P标签
      newArray.map((item,index)=>{
        let p = document.createElement('p')
        text = item[1].substring(1)
        p.textContent = text
        let time = newTime[index]
        p.setAttribute('data-time',time)
        $(this.el).find('#song-description .lyric').append(p)
      })
    },
    play() {
      let playPromise = $(this.el).find('audio')[0].play()
      if (playPromise !== undefined) {
        playPromise.then(() => {
          $(this.el).find('audio')[0].play()
          $(this.el).find('#icon-pause').addClass('active')
          $(this.el).find('#icon-play').removeClass('active')
          $(this.el).find('#cover').addClass('playing')
        }, (error) => {
          console.log(error)
        })
      }
    },
    pause() {
      $(this.el).find('audio')[0].pause()
      $(this.el).find('#icon-play').addClass('active')
      $(this.el).find('#icon-pause').removeClass('active')
      $(this.el).find('#cover').removeClass('playing')
    },
    showLyric(time){
      let allP = this.$el.find('#song-description p')
      let p 
      for(let i =0;i<allP.length;i++){
        if(i===allP.length-1){
          p = allP[i]
          break
        }else{
          let currentTime = allP.eq(i).attr('data-time')
          let nextTime = allP.eq(i+1).attr('data-time')
          if(currentTime <= time && time < nextTime){
            p = allP[i]
            break
          }
        }
      }
      let pHeight = p.getBoundingClientRect().top
      let linesHeight = this.$el.find('.lyric>.lines')[0].getBoundingClientRect().top
      let height = pHeight - linesHeight
      this.$el.find('.lyric>.lines').css({
        transform: `translateY(${- (height - 25)}px)`
      })
      $(p).addClass('active').siblings('.active').removeClass('active')
    },

  }
  let model = {
    data: {
      song: {
        id: '',
        name: '',
        singer: '',
        url: '',
        cover: '',
        lyric: ''
      },
      status: 'pause'
    },
    setId(id) {
      this.data.song.id = id
    },
    find() {
      var query = new AV.Query('song');
      return query.get(this.data.song.id).then((song) => {
        Object.assign(this.data.song, { ...song.attributes })
        return song
      }, function (error) {
        console.log(error)
      })
    },
    setStatus(status) {
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
      $(this.view.el).find('#icon-play').on('click', (e) => {
        console.log(11111111)
        this.model.setStatus('playing')
        this.view.play()
      })
      $(this.view.el).find('#icon-pause').on('click', () => {
        console.log(222222222)
        this.model.setStatus('pause')
        this.view.pause()
      })

      let audio = $(this.view.el).find('audio').get(0)
      audio.onended = () => {
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