{
  let view = {
    el: '#page>aside>#songList-container',
    template: `
    <ul class="songList" id="songList">
    </ul>
    `,
    render(data) {
      $(this.el).html(this.template)
      let { songs } = data
      songs.map((song) => {
        let li = $('<li></li>').text(song.name).attr('data-song-id',song.id)
        $(this.el).find('#songList').append(li)
      })
    },
    active(liId){
      $(this.el).find(`data-song-id="${liId}"`).addClass('active')
    }
  }
  let model = {
    data: {
      songs: []
    },
    find() {
      var query = new AV.Query('song');
      return query.find().then((songs)=> {
        this.data.songs = songs.map((song) => {
          return { id: song.id, ...song.attributes }
        })
        return songs
      },(error)=>{
        console.log(error)
      })
    }
  }
  let controler = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      window.eventHub.on('create', (data) => {
        this.model.data.songs.push(data)
        debugger
        this.view.render(this.model.data)
      })
      this.model.find().then(() => {
        this.view.render(this.model.data)
      },(error)=>{
        console.log(error)
      })
    },
    bindEvents(){
      $(this.view.el).on('click','li',(e)=>{
        let liId = e.currentTarget.getAttribute('data-song-id')
        let data
        let {songs} = this.model.data
        songs.map((song)=>{
          if(song.id === liId){
            data = song
          }
        })
        window.eventHub.emit('select',JSON.parse(JSON.stringify(data)))
      })
    }
  }
  controler.init.call(controler, view, model)
}