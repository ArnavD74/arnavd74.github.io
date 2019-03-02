/*===================================================
=            Weebly Horizontal Site Menu            =
===================================================*/

(function($) {

  /**
   *
   * Generate a flexible responsive menu from the default navigation templates
   *
   * Groups overflowing nav items into a "more" menu item
   *
   */

  var Menu = function(menu, settings) {
    this.$menu = $(menu);
    this.settings = settings;
    this.$more =  $('\
      <li class="menu-more ' + settings.parentClass + '"> \
        <a href="#" class="more-link ' + settings.parentLinkClass + '">' + settings.moreLinkHtml + '</a> \
        <div class="' + settings.containerClass + '"> \
          <ul class="' + settings.listClass + '" data-menu-more /> \
        </div> \
      </li>');

    this.init();
  };

  /**
   *
   * Initialize the menu on load and on resize
   *
   */

  Menu.prototype.init = function() {
    var self = this;

    $('body').addClass("more-nav-on");
    self.generateMore();

    $(window).on('resize', function() {
      self.generateMore();
    });
  };

  /**
   *
   * Update the menu state after init
   *
   */

  Menu.prototype.update = function() {
    this.generateMore();
    return this.$menu;
  };

  /**
   *
   * Build out the extra menu item with the appended children
   *
   */

  Menu.prototype.generateMore = function() {
    var self = this;

    // Reset to unmodified layout
    this.destroyMore();

    var $items = this.$menu.children();

    if (!$items.length) return;


    // Working in reverse (right to left) loop through menu items to see if they are wrapping to a new line.
    // If they are, add them to the more menu, otherwise bail out of the loop.
    $.each($items.get().reverse(), function() {
      var firstOffsetTop = $($items.get()[0]).offset().top;
      var $currentItem = $(this);

      if ($currentItem.offset().top > firstOffsetTop || self.$more.offset().top > firstOffsetTop) {
        self.$menu.append(self.$more);

        self.toggleClasses($currentItem);

        $('[data-menu-more]').prepend($currentItem);
      } else {
        return false;
      }
    });
  };

  /**
   *
   * Reset the items into the main menu and remove more item
   *
   */

  Menu.prototype.destroyMore = function() {
    var $moreChildren = $('[data-menu-more]').children();

    this.toggleClasses($moreChildren);

    // Move the children back into the main menu
    $moreChildren.appendTo(this.$menu);

    // Remove the injected wrapper item
    this.$more.remove();
  };

  /**
   *
   * Set / reset the classes of the menu list items
   *
   */

  Menu.prototype.toggleClasses = function($el) {
    $el
      .toggleClass(this.settings.parentClass)
      .toggleClass(this.settings.childClass)
      .children('a')
      .toggleClass(this.settings.parentLinkClass)
      .toggleClass(this.settings.childLinkClass)
  };

  /**
   *
   * Plugin-ify our menu(s)
   *
   */

  var pluginName = 'pxuMenu';

  $.fn[pluginName] = function(options) {
    // Defaults
    settings = $.extend({
      parentClass: 'wsite-menu-item-wrap',
      parentLinkClass: 'wsite-menu-item',
      containerClass: 'wsite-menu-wrap',
      listClass: 'wsite-menu',
      childClass: 'wsite-menu-subitem-wrap',
      childLinkClass: 'wsite-menu-subitem',
      moreLinkHtml: 'More',
    }, options );

    return this.each(function() {
      if (!$.data(this, pluginName)) {
        // Store plugin instace with element (this),
        // so public methods can be called later:
        // $('menu').data('pxuMenu').update();
        $.data(this, pluginName, new Menu(this, settings));
      }
    });
  };

}(jQuery));
