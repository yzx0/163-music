{
  let view = {
    el: '#page>#newestSong',
    init() {
      this.$el = $(this.el)
    },
    template: `
    <li>
      <div class="songInformation">
        <p class="songName">{{歌名1}}</p>
        <div class="singer">
          <div class="toneQualityIcon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-sq"></use>
            </svg>
          </div>
          <p>{{歌手1}}</p>
        </div>
      </div>
      <a class="playIcon" href="./song.html?id={{id}}">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-iconplay"></use>
        </svg>
      </a>
    </li>
   `,
    render(data) {
      let { songs } = data
      let li
      songs.map((song) => {
        li = this.template
          .replace('{{歌名1}}', song.name)
          .replace('{{歌手1}}', song.singer)
          .replace('{{id}}',song.id)
        this.$el.find('ul').append(li)
      })
    }
  }
  let model = {
    data: {
      songs: []
    },
    find() {
      var query = new AV.Query('song');
      return query.find().then((songs) => {
        this.data.songs = songs.map((song) => {
          return Object.assign({id: song.id},song.attributes)
        })
        return songs
      }, (error) => {
        console.log(error)
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.init()
      this.model.find().then(()=>{
        this.view.render(this.model.data)
      },(error)=>{
        console.log(error)
      })
    }
  }
  controller.init(view, model)
}