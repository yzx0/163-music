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
    },
    find() { }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.init()
    }
  }
  controller.init(view, model)
}