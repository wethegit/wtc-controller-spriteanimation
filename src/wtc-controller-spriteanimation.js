/*
  Sprite animation controller
  =======================================
  - *Author*          liamegan
  - *email*           liam@wethecollective.com
  - *Created*         2014-11-12 11:31:25
  - *namespace*       .
  - *Requirements*    jQuery, wtc.responsive.Breakpoints
  - *Description*     .
  - *Edited by*       Liam Egan
  - *Edited*          2016-06-17 16:05:50
  - *Version*         0.1
*/
(function()
{
  var _base;
  var __hasProp = Object.prototype.hasOwnProperty;
  var __extends = function(child, parent)
  {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.wtc || (window.wtc = {});
  (_base = window.wtc).controller || (_base.controller = {});
  (function($, NS)
  {
    NS.SpriteAnimation = (function() {
      __extends(SpriteAnimation, NS.ElementController);

      SpriteAnimation.prototype.transforms = false;
      SpriteAnimation.prototype.setHeight = true;
      SpriteAnimation.prototype.frameTime = 100;
      SpriteAnimation.prototype.ratio = 1.5;
      SpriteAnimation.prototype.frame = 0;
      SpriteAnimation.prototype.frames = 0;
      SpriteAnimation.prototype.playing = false;
      SpriteAnimation.prototype.interval = null;

      function SpriteAnimation(element, imageURL, width, height)
      {
        var op, testForSmall;
        SpriteAnimation.__super__.constructor.apply(this, arguments);

        if (Modernizr.csstransforms)
        {
          this.transforms = true;
        }
        if (this.$element.data('imageurl'))
        {
          this.imageURL = this.$element.data('imageurl');
        }
        if (this.$element.data('width'))
        {
          this.width = this.$element.data('width');
        }
        if (this.$element.data('height'))
        {
          this.height = this.$element.data('height');
        }
        if (this.$element.data('selector'))
        {
          this.selector = this.$element.data('selector');
        }
        if (this.$element.data('frames'))
        {
          this.frames = parseInt(this.$element.data('frames'));
        }
        op = this;
        $('[data-playto]', this.$element).each(function()
        {
          var button;
          button = $(this);
          return button.click(function() {
            return op.playto(button.data('playto'));
          });
        });
        this.ratio = this.height / this.width;
        if (this.transforms === true)
        {
          this.sprite_container = $(this.selector, this.$element);
          this.$element_sprite = $('<div class="spriter"></div>').appendTo(this.sprite_container);
          this.$element_sprite.height();
        } else
        {
          this.$element_sprite = $(this.selector, this.$element);
        }
        this.$element_sprite.css("background-image", "URL(" + this.imageURL + ")");
        this.updateHeight();
        window.spriteAnimation = this;
        testForSmall = (function()
        {
          if (window.wtc.utilities.Breakpoints.getBreakpoint() === window.wtc.utilities.Breakpoints.BREAKPOINT_S)
          {
            this.playInfinite = true;
            this.playto(null, 400);
          } else
          {
            this.playInfinite = false;
          }
        }).bind(this);
        $(window).resize((function()
        {
          this.render();
          return testForSmall();
        }).bind(this));
        this.render();
        testForSmall();
      }
      SpriteAnimation.prototype.updateHeight = function()
      {
        if (this.setHeight === true)
        {
          if (this.transforms === true)
          {
            this.sprite_container.css('height', 0);
            this.sprite_container.css('padding-bottom', "" + (this.ratio * 100) + "%");
          } else
          {
            this.$element_sprite.css('height', 0);
            this.$element_sprite.css('padding-bottom', "" + (this.ratio * 100) + "%");
          }
        }
      };
      SpriteAnimation.prototype.playto = function(to, frameTime)
      {
        if (to == null)
        {
          to = null;
        }
        if (frameTime == null)
        {
          frameTime = this.frameTime;
        }
        if (this.playing === true)
        {
          return;
        }
        this.playing = true;
        this.interval = setInterval((function()
        {
          this.nextFrame();
          if (this.playInfinite !== true)
          {
            if (this.frame === to || this.frame === 0)
            {
              this.playing = false;
              clearInterval(this.interval);
            }
          }
        }).bind(this), frameTime);
      };
      SpriteAnimation.prototype.nextFrame = function()
      {
        this.frame += 1;
        if (this.frame >= this.frames)
        {
          this.frame = 0;
        }
        this.render();
      };
      SpriteAnimation.prototype.render = function()
      {
        var height, position;
        if (this.setHeight === true)
        {
          height = this.$element_sprite.width() * this.ratio;
        } else
        {
          height = this.height;
        }
        position = height * this.frame;
        if (this.transforms === true)
        {
          this.$element_sprite.css({
            "-webkit-transform": "translateY(-" + position + "px)",
            "-moz-transform": "translateY(-" + position + "px)",
            "transform": "translateY(-" + position + "px)"
          });
        } else
        {
          this.$element_sprite.css('background-position', "left -" + (Math.floor(position)) + "px");
        }
        $('.frame_detail', this.$element).addClass('hidden');
        $(".frame_" + this.frame, this.$element).removeClass('hidden');
      };
      return SpriteAnimation;
    })();
  })(jQuery, window.wtc.controller);
})();