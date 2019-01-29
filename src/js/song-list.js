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
        let li = $('<li></li>').text(song.name)
        $(this.el).find('#songList').append(li)
      })
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
      window.eventHub.on('create', (data) => {
        this.model.data.songs.push(data)
        this.view.render(this.model.data)
      })
      this.model.find().then((x) => {
        console.log('x')
        console.log(x)
        this.view.render(this.model.data)
      },(error)=>{
        console.log(error)
      })
    }
  }
  controler.init.call(controler, view, model)
}