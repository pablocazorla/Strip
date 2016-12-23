// STRIP
(function($) {
  "use strict";
  var _strip = function(options) {
      return this.init(options);
    },
    Strip = function(options) {
      return new _strip(options);
    };
  Strip.touchHandler = function(self, direction) {
    var direction = 'horizontal' || dir;
    var mc = {
      on: function() {}
    };
    // HAMMER JS
    if (typeof Hammer !== 'undefined') {
      mc = new Hammer(self.$target[0]);
      // mc.get('pan').set({
      //   direction: Hammer['DIRECTION_' + direction.toUpperCase()]
      // });
    }
    var o = {
      on: function(event, handler) {
        mc.on(event, handler);
        return o;
      }
    };
    return o;
  };

  // Strip presets
  var defaultPreset = 'horizontal';
  Strip.presets = {
  	'none':{},
    'horizontal': {
      init: function(self) {
        var map = {
            left: null,
            center: null,
            right: null
          },
          mapPositions = function(num) {
            map.left = self.$frames.eq(self._toCircular(num - 1));
            map.center = self.$frames.eq(num);
            map.right = self.$frames.eq(self._toCircular(num + 1));

            map.left.css({
              left: '-100%'
            });
            map.center.css({
              left: '0%'
            });
            map.right.css({
              left: '100%'
            });
          };
        mapPositions(self.config.initial);

        self
          .on('start', function(self) {
            if (!touchPositioner.event) {
              self.$frames.eq(self.future).css({
                left: (100 * self.direction) + '%'
              });
            }
          })
          .on('move', function(self) {
            self.$frames.eq(self.current).animate({
              left: (-100 * self.direction) + '%'
            }, self.config.duration);
            self.$frames.eq(self.future).animate({
              left: '0%'
            }, self.config.duration);
          })
          .on('end', function(self) {
            mapPositions(self.future);
            touchPositioner.event = false;
          });

        // Touch Handler
        var touchPositioner = {
          event: false,
          left: 0,
          center: 0,
          right: 0,
          set: function(dx) {
            map.left.css('left', touchPositioner.left + dx);
            map.center.css('left', touchPositioner.center + dx);
            map.right.css('left', touchPositioner.right + dx);
          }
        };
        Strip.touchHandler(self)
          .on("panstart", function(ev) {
            if (!self.move) {
              touchPositioner.left = parseInt(map.left.css('left'));
              touchPositioner.center = parseInt(map.center.css('left'));
              touchPositioner.right = parseInt(map.right.css('left'));
            }
          })
          .on("panleft panright", function(ev) {
            if (!self.move) {
              touchPositioner.set(ev.deltaX);
            }
          })
          .on("panend", function(ev) {
            if (!self.move && ev.deltaX !== 0) {
              touchPositioner.event = true;
              var dir = Math.abs(ev.deltaX) / ev.deltaX;

              if (dir > 0) {
                self.prev();
              } else {
                self.next();
              }
            }
          });
      }
    },
    'vertical': {
      init: function(self) {
        var map = {
            top: null,
            center: null,
            bottom: null
          },
          mapPositions = function(num) {
            map.top = self.$frames.eq(self._toCircular(num - 1));
            map.center = self.$frames.eq(num);
            map.bottom = self.$frames.eq(self._toCircular(num + 1));

            map.top.css({
              top: '-100%'
            });
            map.center.css({
              top: '0%'
            });
            map.bottom.css({
              top: '100%'
            });
          };
        mapPositions(self.config.initial);

        self
          .on('start', function(self) {
            if (!touchPositioner.event) {
              self.$frames.eq(self.future).css({
                top: (100 * self.direction) + '%'
              });
            }
          })
          .on('move', function(self) {
            self.$frames.eq(self.current).animate({
              top: (-100 * self.direction) + '%'
            }, self.config.duration);
            self.$frames.eq(self.future).animate({
              top: '0%'
            }, self.config.duration);
          })
          .on('end', function(self) {
            mapPositions(self.future);
            touchPositioner.event = false;
          });

        // Touch Handler
        var touchPositioner = {
          event: false,
          top: 0,
          center: 0,
          bottom: 0,
          set: function(dy) {
            map.top.css('top', touchPositioner.top + dy);
            map.center.css('top', touchPositioner.center + dy);
            map.bottom.css('top', touchPositioner.bottom + dy);
          }
        };
        Strip.touchHandler(self, 'vertical')
          .on("panstart", function(ev) {
            if (!self.move) {
              touchPositioner.top = parseInt(map.top.css('top'));
              touchPositioner.center = parseInt(map.center.css('top'));
              touchPositioner.bottom = parseInt(map.bottom.css('top'));
            }
          })
          .on("panup pandown", function(ev) {
            if (!self.move) {
              touchPositioner.set(ev.deltaY);
            }
          })
          .on("panend", function(ev) {
            if (!self.move && ev.deltaY !== 0) {
              touchPositioner.event = true;
              var dir = Math.abs(ev.deltaY) / ev.deltaY;

              if (dir > 0) {
                self.prev();
              } else {
                self.next();
              }
            }
          });
      }
    }
  }

  _strip.prototype = {
    init: function(options) {

      // Preset
      var preset = (typeof options.preset === 'string' && typeof Strip.presets[options.preset] !== 'undefined') ? $.extend({}, Strip.presets[options.preset]) : $.extend({}, Strip.presets[defaultPreset]);

      // Initial configuration
      this.config = $.extend({
        target: '#strip',
        frames: '.frame',
        initial: 0,
        width: 'none',
        height: 'none',
        arrowPrev: '',
        arrowNext: '',
        pagination: '',
        paginationElement: '<span/>',
        paginationElementActiveClass: 'active',
        paginationNumbers: false,
        duration: 800,
        setup: function() {},
        init: function() {}
      }, preset, options);

      // Listeners
      this.listeners = {
        'start': [],
        'move': [],
        'end': []
      };
      // Store $
      this.$target = $(this.config.target).eq(0);
      this.$frames = this.$target.find(this.config.frames);
      this.frames = this.$frames.toArray();
      this.current = this.config.initial;
      this.future = -1;
      this.move = false;
      // UI
      this.$arrowPrev = null;
      this.$arrowNext = null;
      this.$pagination = null;
      this.$paginators = $();
      var $temp,
        ui = ['arrowPrev', 'arrowNext', 'pagination'],
        self = this;
      for (var i = 0; i < ui.length; i++) {
        if (this.config[ui[i]] !== '') {
          if (this.config[ui[i]].indexOf('<') !== -1) {
            this['$' + ui[i]] = $(this.config[ui[i]]);
            this.$target.append(this['$' + ui[i]]);
          } else {
            $temp = this.$target.find(this.config[ui[i]]);
            if ($temp.length === 0) {
              $temp = $(this.config[ui[i]]);
              if ($temp.length === 0) {
                if (this.config[ui[i]].indexOf('.') === 0) {
                  this['$' + ui[i]] = $('<div/>').addClass(this.config[ui[i]].substr(1));
                  this.$target.append(this['$' + ui[i]]);
                } else if (this.config[ui[i]].indexOf('#') === 0) {
                  this['$' + ui[i]] = $('<div/>').attr('id', this.config[ui[i]].substr(1));
                  this.$target.append(this['$' + ui[i]]);
                }
              } else {
                this['$' + ui[i]] = $temp;
              }
            } else {
              this['$' + ui[i]] = $temp;
            }
          }
        }
      }
      // Set Pagination
      if (this.$pagination !== null) {
        var addPaginator = function(num) {
          var $p = $(self.config.paginationElement).appendTo(self.$pagination);
          if (self.config.paginationNumbers) {
            $p.text(num + 1);
          }
          self.$paginators = self.$paginators.add($p);
          $p.click(function(e) {
            e.preventDefault();
            self.change(num);
          });
        };
        for (var i = 0; i < this.frames.length; i++) {
          addPaginator(i);
        }
        this.$paginators.eq(this.config.initial).addClass(this.config.paginationElementActiveClass);
      }
      if (this.$arrowPrev !== null) {
        this.$arrowPrev.click(function(e) {
          e.preventDefault();
          self.prev();
        });
      }
      if (this.$arrowNext !== null) {
        this.$arrowNext.click(function(e) {
          e.preventDefault();
          self.next();
        });
      }
      this.config.setup(this);
      this.config.init(this);
      return this;
    },
    change: function(num) {
      if (!this.move && num !== this.current) {
        this.move = true;
        this.direction = (num > this.current) ? 1 : -1;
        this.future = this._toCircular(num);
        this._listen('start');
        this._listen('move');
        this.$paginators
          .removeClass(this.config.paginationElementActiveClass)
          .eq(this.future).addClass(this.config.paginationElementActiveClass);
        var self = this;
        setTimeout(function() {
          self._listen('end');
          self.current = self.future;

          self.move = false;
        }, this.config.duration);
      }
      return this;
    },
    prev: function() {
      this.change(this.current - 1);
      return this;
    },
    next: function() {
      this.change(this.current + 1);
      return this;
    },
    _listen: function(listener) {
      var l = this.listeners[listener].length;
      for (var i = 0; i < l; i++) {
        this.listeners[listener][i](this);
      }
      return this;
    },
    on: function(listener, handler) {
      this.listeners[listener].push(handler);
      return this;
    },
    _toCircular: function(num) {
      var l = this.$frames.length,
        n = (num < 0) ? l + num : num;
      n = (n >= l) ? n - l : n;

      return n;
    }
  }
  window.Strip = Strip;
})(jQuery);
