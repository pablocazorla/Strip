// APP

var stripHorizontal = Strip({
  target: '#str-horizontal',
  arrowPrev: '<div class="arrow arrow-left">&lt;</div>',
  arrowNext: '<div class="arrow arrow-right">&gt;</div>',
  pagination: '.pagination',
  setup: function(self) {
    // Set initial CSS properties for target and frames
    var h = self.config.height;
    h = (h !== 'none') ? h : self.$frames.outerHeight();
    self.$target.css({
      position: 'relative',
      height: h,
      overflow: 'hidden'
    });
    self.$frames.css({
        position: 'absolute',
        width: '100%',
        left: '100%'
      })
      .eq(self.config.initial)
      .css({
        left: '0'
      });
  }
});

var stripVertical = Strip({
	preset:'vertical',
  target: '#str-vertical',
  arrowPrev: '<div class="arrow arrow-top">up</div>',
  arrowNext: '<div class="arrow arrow-bottom">down</div>',
  pagination: '<div class="pagination"></div>',
  setup: function(self) {
    // Set initial CSS properties for target and frames
    var h = self.config.height;
    h = (h !== 'none') ? h : self.$frames.outerHeight();
    self.$target.css({
      position: 'relative',
      height: h,
      overflow: 'hidden'
    });
    self.$frames.css({
        position: 'absolute',
        width: '100%',
        top: '100%'
      })
      .eq(self.config.initial)
      .css({
        top: '0'
      });
  }
});