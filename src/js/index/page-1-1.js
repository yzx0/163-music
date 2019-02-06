{
  let view = {
    el: '#page>#recommendSongList',
    init() {
      this.$el = $(this.el)
    }
  }
  let model = {
    data: {
      songs: []
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.init()
      console.log('over')
    }
  }
  controller.init(view, model)
}