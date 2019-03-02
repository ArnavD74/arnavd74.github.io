jQuery(function($) {

  // Mobile sidebars
  $.fn.expandableSidebar = function(expandedClass) {
    var $me = this;

    $me.on('click', function() {
      if(!$me.hasClass(expandedClass)) {
        $me.addClass(expandedClass);
      } else {
        $me.removeClass(expandedClass);
      }
    });
  }

  // Interval loop
  $.fn.intervalLoop = function(condition, action, duration, limit) {
    var counter = 0;
    var looper = setInterval(function(){
      if (counter >= limit || $.fn.checkIfElementExists(condition)) {
        clearInterval(looper);
      } else {
        action();
        counter++;
      }
    }, duration);
  }

  // Check if element exists
  $.fn.checkIfElementExists = function(selector) {
    return $(selector).length;
  }

  var duskController = {

    init: function(opts) {
      var base = this;

      // Add classes to elements
      base._addClasses();

      base._headerSetup();
      base._searchSetup();
      base._miniCartSetup();
      // base._loginSetup(false);
      base._breadcrumbs();
      base._mobileNav();
      base._quantityInput();

      setTimeout(function() {
        base._checkCartItems();
        base._attachEvents();
        base._loginSetup(true);
      }, 1000);
    },

    _utils: {
      onEscKey: function(callback) {
        $(document).on('keyup', function(event) {
          if (event.keyCode === 27) callback();
        });
      },
    },

    _addClasses: function() {
      var base = this;

      // Add class to nav items with subnav
      $('.wsite-menu-default').find('li.wsite-menu-item-wrap').each(function(){
        var $me = $(this);

        if($me.children('.wsite-menu-wrap').length > 0) {

          $me.addClass('has-submenu');
          $('<span class="icon-caret"></span>').insertAfter($me.children('a.wsite-menu-item'));
        }
      });

      // Add class to subnav items with subnav
      $('.wsite-menu').find('li.wsite-menu-subitem-wrap').each(function(){
        var $me = $(this);

        if($me.children('.wsite-menu-wrap').length > 0) {

          $me.addClass('has-submenu');
          $('<span class="icon-caret"></span>').insertAfter($me.children('a.wsite-menu-subitem'));
        }
      });

        // Keep subnav open if submenu item is active
        $('li.wsite-menu-subitem-wrap.wsite-nav-current').parents('.wsite-menu-wrap').addClass('open');

      // Add placeholder text to inputs
      $.fn.intervalLoop('', function() {
        $('.wsite-form-sublabel').each(function(){
          var sublabel = $(this).text();
          $(this).prev('.wsite-form-input').attr('placeholder', sublabel);
        });
      }, 1000, 5);

      // Add fullwidth class to gallery thumbs if less than 6
      $('.imageGallery').each(function(){
        if ($(this).children('div').length <= 6) {
          $(this).children('div').addClass('fullwidth-mobile');
        }
      });
    },

    _headerSetup: function() {
      var $desktopNav = $('.desktop-nav .wsite-menu-default');
      if (typeof DISABLE_NAV_MORE == 'undefined' || !DISABLE_NAV_MORE) {
        $desktopNav.pxuMenu({
          moreLinkHtml: 'More...',
        });
        $.fn.intervalLoop('', function() {
          if ($desktopNav.data('pxuMenu')) {
            $desktopNav.data('pxuMenu').update();
          }
        }, 500, 10);
      }

      $(document.body).addClass('reveal-elements');

      // Banner
      $('.banner .wsite-section-elements').each(function() {
        if (!$.trim($(this).html()).length) {
          $(this).parent().addClass('banner-empty');
        }
      });

      $(window).scroll(function() {
        if ($('.sticky-nav-off').length) return;
        $('body').toggleClass('header-compressed', $(this).scrollTop() > 300);
      });
    },

    _searchSetup: function() {
      var base = this;
      var searchBox = '.wsite-search';
      var searchToggle = '.search-toggle';
      function toggleSearch(action) {
        $(searchToggle).toggleClass('is-active', (action === 'toggle' ? '' : false));
        $(searchBox).revealer(action);
      };
      function toggleSearchClass() {
        $('body').toggleClass('has-site-search', !!$('.wsite-search').length);
      }

      toggleSearchClass();
      $.fn.intervalLoop('', function() {
        // When search is disabled, the input is in the dom,
        // but th editor attaches an inline display: none;
        // so don't toggle the class
        if ($('.wsite-search').attr('style') === 'display: none;') return;
        toggleSearchClass();
      }, 1000, 5);

      $(searchBox)
        .on('revealer-show', function(event) {
          $(event.currentTarget).find('.wsite-search-input').focus();
        })
        .find('.wsite-search-input')
        // .attr('placeholder', 'Type and press enter to search')
        .on('blur', function() {
          setTimeout(function() {
            toggleSearch('hide');
          }, 300);
        });

      $(document).on('click', searchToggle, function(event) {
        event.preventDefault();
        if ($(searchToggle).hasClass('is-active')) {
          toggleSearch('hide');
        }
        else {
          toggleSearch('toggle');
        }
      });

      base._utils.onEscKey(function() {
        if (!$(searchBox).revealer('isVisible')) return;
        toggleSearch('hide');
      });
    },

    _miniCartSetup: function() {
      var base = this;
      var cartOpenClass = 'minicart-visible';

      var toggleMinicart = function(state) {
        $('body').toggleClass(cartOpenClass, state);
      };

      // Override the header icon / toggle button
      var hijackMinicartToggle = function() {
        var $cartToggle = $('#wsite-nav-cart-a');
        var subtotal = $('#wsite-mini-cart .wsite-subtotal-wrapper')
          .clone()
          .children(':not(.wsite-price)')
          .remove()
          .end()
          .children()
          .unwrap()
          .end()
          .text();
        var count = 0;
        $('#wsite-mini-cart .wsite-product-item').each(function() {
          count += parseInt($(this).find('.wsite-product-price').text(), 10);
        });
        var items = count === 1 ? 'item' : 'items';
        var templateData = {
          subtotal: $.trim(subtotal),
          count: count,
          items: items
        };

        $cartToggle
          .off('click mouseenter mouseover mouseleave mouseout')
          .empty()
          .loadTemplate($('#mini-cart-template'), templateData)
          .addClass('is-visible')
          .find('.price-wrap')
          .toggleClass('no-items', !count);

        $('.mini-cart-toggle').toggleClass('has-mini-cart', !!$('.mini-cart').children().length);

        // Update responsive menu since site-utils dimesions will change
        if (typeof DISABLE_NAV_MORE == 'undefined' || !DISABLE_NAV_MORE) {
          $('.desktop-nav .wsite-menu-default').data('pxuMenu').update();
        }
      };

      // Override the minicart panel
      var hijackMinicart = function() {
        $('#wsite-mini-cart')
          .off('mouseenter mouseover mouseleave mouseout')
          .removeClass('arrow-top')
          .removeAttr('style')
          .prepend($('.mini-cart-header'))
          .appendTo($('.wrapper'));
      };

      // Bind minicart events
      $(document).on('click', '.wsite-nav-cart', function(event) {
        event.preventDefault();
        toggleMinicart('');
      });

      $(document).on('click', '.button-mini-cart-close, .mini-cart-screen', function(event) {
        event.preventDefault();
        toggleMinicart(false);
      });

      base._utils.onEscKey(function() {
        if ($('body').hasClass(cartOpenClass)) {
          toggleMinicart(false);
        }
      });

      // Watch for minicart

      base._observeDom(document, function(docObserver, target, config) {
        // Bail if minicart & toggle not available yet
        if (!$('#wsite-mini-cart').length || !$('#wsite-nav-cart-a').length) return;
        // Watch minicart
        base._observeDom($('#wsite-mini-cart')[0], function(observer, target, config) {
          observer.disconnect();
          hijackMinicart();
          hijackMinicartToggle();
          observer.observe(target, config);
        });
        // Watch toggle (sometimes default toggle updates after cart)
        base._observeDom($('#wsite-nav-cart-a')[0], function(observer, target, config) {
          observer.disconnect();
          hijackMinicartToggle();
          observer.observe(target, config);
        });
        // minicart available, so stop watching the doc
        docObserver.disconnect();
       }, { subtree: true });
    },

    _checkCartItems: function() {
      var base = this;

      if ($('#wsite-mini-cart').find('li.wsite-product-item').length > 0) {
        $('body').addClass('cart-full');
      } else {
        $('body').removeClass('cart-full');
      }
    },

    _loginSetup: function(editorDisplay) {
      var linkText = $('#wsite-nav-login-a').text();
      var mobileLink = $('#member-login').clone(true);
      function toggleLogin() {
        $('.header-login').toggle(!!$('#wsite-nav-login-a').length);
      }

      toggleLogin();
      $.fn.intervalLoop('', toggleLogin, 500, 5);

      $(document).on('click', '.header-login', function() {
        $('#wsite-nav-login-a').trigger('click');
      });

      $('.mobile-login')
        .appendTo('.mobile-nav .wsite-menu-default');

      $(mobileLink)
        .appendTo('.mobile-login').children('a').addClass('wsite-menu-item');

        // .loadTemplate($('#login-template'), { login: linkText });
    },

    _breadcrumbs: function() {
      var $breadcrumbs = $('#wsite-com-breadcrumbs');

      $breadcrumbs.insertBefore($breadcrumbs.closest('.container'));

      $(document.body).toggleClass('page-has-breadcrumbs', !!$breadcrumbs.length);
    },

    _mobileNav: function() {
      $('.hamburger, .mobile-nav-toggle').on('click', function() {
        $('.mobile-nav').revealer('toggle');
        $(document.body).toggleClass('mobile-nav-open');
      });

      $('.icon-caret').on('click', function() {
        $(this)
          .toggleClass('is-active')
          .next('.wsite-menu-wrap')
          .revealer('toggle');
      });
    },

    _attachEvents: function() {
      var base = this;

      // Store category dropdown
      $('.wsite-com-sidebar').expandableSidebar('sidebar-expanded');

      // Search filters dropdown
      $('#wsite-search-sidebar').expandableSidebar('sidebar-expanded');

    	// Init fancybox swipe on mobile
      if ('ontouchstart' in window) {
        $('body').on('click', 'a.w-fancybox', function() {
          base._initSwipeGallery();
        });
      }

      $("body.wsite-editor .wsite-search").append($(".icon-search").clone());
    },

    _initSwipeGallery: function() {
      var base = this;

      setTimeout(function(){
        var touchGallery = document.getElementsByClassName('fancybox-wrap')[0];
        var mc = new Hammer(touchGallery);
        mc.on("panleft panright", function(ev) {
          if (ev.type == "panleft") {
            $("a.fancybox-next").trigger("click");
          } else if (ev.type == "panright") {
            $("a.fancybox-prev").trigger("click");
          }
          base._initSwipeGallery();
        });
      }, 500);
    },

    _quantityInput: function() {
      var $input = $('#wsite-com-product-quantity-input');
      var button = 'button-quantity';

      function setValues($input) {
        return {
          value : parseInt($input.val(), 10),
          min : $input.attr('min') ? parseInt($input.attr('min'), 10) : 0,
          max : $input.attr('max') ? parseInt($input.attr('max'), 10) : Infinity,
        }
      }

      // Set up controls
      $input
        .after('<button class="'+ button +' plus" data-quantity-control="increment" />')
        .after('<button class="'+ button +' minus" data-quantity-control="decrement" />');

      // Bind clicks
      $(document).on('click', '.' + button, function(event) {
        event.preventDefault();

        var $target = $(event.target);
        var action = $target.attr('data-quantity-control');
        var $quantityInput = $target.siblings($input.selector);
        var values = setValues($quantityInput);

        if (action === 'increment' && values.value < values.max) {
          $quantityInput.val(values.value + 1).trigger('change');
        } else if (action === 'decrement' && values.value > 0 && values.value > values.min) {
          $quantityInput.val(values.value - 1).trigger('change');
        }
      });

      // Validate change
      $input.on('change', function(event) {
        var $target = $(event.target);
        var values = setValues($target);

        if (values.value >= values.max) {
          $target.val(values.max).addClass('val-max');
        } else if (values.value <= values.min) {
          $target.val(values.min).addClass('val-min');
        } else {
          $target.removeClass('val-max val-min');
        }
      });
    },
    _observeDom: function(target, callback, config) {
       var config = $.extend({
         attributes: true,
         childList: true,
         characterData: true
       }, config);
       // create an observer instance & callback
       var observer = new MutationObserver(function(mutations) {
         // Using every() instead of forEach() allows us to short-circuit the observer in the callback
         mutations.every(function(mutation) {
           callback(observer, target, config, mutation);
         });
       });
       // pass in the target node, as well as the observer options
       observer.observe(target, config);
     }
  }

  $(document).ready(function(){
    duskController.init();
  });
});
