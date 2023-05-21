/**
 *  Site object that controls all dynamic functionality
 */
function Site(config) {
  'use strict';

  var config  = config || {},
    $window = $(window),
    modal   = new Modal({
      selector: '#modal'
    });

  //-- Boot up the site
  init();

  //-- Attach all event handlers to the page
  function _attachEventHandlers() {

    $('#intro').on('click', '#arrow-pulser', function() {
      $("html, body").animate({ scrollTop: $('#projects').offset().top + 50 }, 1000);
    });

    $('#projects').on('click', '.device', function() {
      var dataURL = $(this).data('href');
      window.open(dataURL);
    });

    $('#web-tech-options').on('click', 'button', function() {
      // Reset buttons
      var parent = $(this).closest('ul');
      $('button', parent).removeClass('active');
      $(this).addClass('active');

      // Show appropriate tab
      var tab = $(this).data('tab');
      $('.tab').hide();
      $('#' + tab + '-tab').fadeIn(350);
    })

    // Navigate to the left of the carousel for projects
    $('#projects').on('click', '#portfolio-btn-left', function() {
      var $currentActivatedProject = $('.project.active');
      var $prevProject= $currentActivatedProject.prev('.project');

      // Account for titles
      if($prevProject.hasClass('project')) {
        $prevProject.addClass('active');
      } else {
        $('.project:last').addClass('active');
      }

      _addPrevProjectClass($currentActivatedProject);

      $currentActivatedProject.removeClass('active');
    });

    // Navigate to the right of the carousel for projects
    $('#projects').on('click', '#portfolio-btn-right', function() {
      var $currentActivatedProject = $('.project.active');
      var $nextProject = $currentActivatedProject.next('.project');

      // Account for titles
      if($nextProject.hasClass('project')) {
        $nextProject.addClass('active');
      } else {
        $('.project').first().addClass('active');
      }

      // Add the project class to account for background and text color changes
      _addNextProjectClass($currentActivatedProject);

      $currentActivatedProject.removeClass('active');
    });

    // Slick
    $('#bandly-device').slick({
      autoplay: true,
      pauseOnHover: true,
      autoplaySpeed: 3000,
      arrows: false
    });

    $('#simple990-laptop').slick({
      autoplay: true,
      pauseOnHover: true,
      autoplaySpeed: 3000,
      arrows: false
    });

    $('#uunicorns-laptop').slick({
      autoplay: true,
      pauseOnHover: true,
      autoplaySpeed: 3000,
      arrows: false
    });

    $('#project-mountain-laptop').slick({
      autoplay: true,
      pauseOnHover: true,
      autoplaySpeed: 3000,
      arrows: false
    });


    /*var myScroll = new IScroll('#bandly-device-container', {
      mouseWheel: true,
      scrollbars: false
    });*/
  }


  /* ===============================================================
    WAYPOINTS
     =============================================================== */
  function _addWaypoints() {

    _animateIntroPage();

    _animateProjectsPage();

    _animateSkillsetPage();

    _animatePhilosophyPage();

    _animatePersonalPage();

  }

  /* ===============================================================
    ANIMATION
     =============================================================== */
  function _animateIntroPage() {

    new Waypoint({
      element: document.getElementById('intro'),
      handler: function(direction) {
        if(direction === 'down') {
          // Set the height of the h1

          $('h1 > span', '#intro').each(function(i) {
            setTimeout(function() {
              $(this).addClass('active');
            }.bind(this), 200*i);
          });

          setTimeout(function() {
            $('h2', '#intro').addClass('active');
          }, 600);
          $('#intro').addClass('active');

          setTimeout(function() {
            $('#arrow-pulser').addClass('active');
          }, 1250);
        }
      }
    });
  }


  /**
   *  Animate the project page
   */
  function _animateProjectsPage() {

    // Animate Devices
    new Waypoint({
      element: document.getElementById('projects'),
      handler: function(direction) {
        if(direction === 'down') {
          if($('.project.active').length === 0) {
            $('.project:first').addClass('active');
          }
        }
      },
      offset: '30%'
    });
  }


  /**
   *  Animate skillset page
   */
  function _animateSkillsetPage() {

    // Animate Title
    new Waypoint({
      element: document.getElementById('skillset'),
      handler: function(direction) {
        if(direction === 'down') {
          _animateTitle('skillset');
        }
      },
      offset: '70%'
    });


    // Animate Body
    new Waypoint({
      element: document.getElementById('skillset'),
      handler: function(direction) {
        if(direction === 'down') {
        _animateBody('skillset');
        $('#web-tech-options').addClass('active');
        }
      },
      offset: '50%'
    });

    // Animate Devices
    new Waypoint({
      element: document.getElementById('skillset'),
      handler: function(direction) {
        if(direction === 'down') {
          var skillIcons = document.querySelectorAll('.skillset-block .split-circle');

          // Add all the skillIcons in
          Array.prototype.forEach.call(skillIcons, function(el, index) {
            setTimeout(function() {
              $(el).addClass('active');
            }, (50*index));
          });
        }
      },
      offset: '10px'
    });
  }

  /**
   *  Animate the Philosophy page
   */
  function _animatePhilosophyPage() {

    // Animate Title
    new Waypoint({
      element: document.getElementById('philosophy'),
      handler: function(direction) {
        if(direction === 'down') {
          _animateTitle('philosophy');
        }
      },
      offset: '70%'
    });


    // Animate Body
    new Waypoint({
      element: document.getElementById('philosophy'),
      handler: function(direction) {
        if(direction === 'down') {
        _animateBody('philosophy');

        }
      },
      offset: '50%'
    });

    // Animate Devices
    new Waypoint({
      element: document.getElementById('philosophy'),
      handler: function(direction) {
        if(direction === 'down') {
          var developerBubbles = document.querySelectorAll('.developer .split-circle'),
            designerBubbles  = document.querySelectorAll('.designer .split-circle'),
            pmBubbles      = document.querySelectorAll('.project-manager .split-circle'),
            dogBubbles     = document.querySelectorAll('.dog .split-circle'),
            bubbles      = [developerBubbles, designerBubbles, pmBubbles, dogBubbles];

            // Animate all the thought bubbles in
          for(var i = 0, length = bubbles.length; i < length; i += 1) {
            (function(i) {
            setTimeout(function() {
              Array.prototype.forEach.call(bubbles[i], function(el, index) {
                  $(el).addClass('active');
              });
            }, 400*i);
            })(i);
          }
        }
      },
      offset: '25%'
    });
  }

  /**
   *  Animate the Personal page
   */
  function _animatePersonalPage() {

    // Animate Title
    new Waypoint({
      element: document.getElementById('personal'),
      handler: function(direction) {
        if(direction === 'down') {
          _animateTitle('personal');
        }
      },
      offset: '70%'
    });


    // Animate Body
    new Waypoint({
      element: document.getElementById('personal'),
      handler: function(direction) {
        if(direction === 'down') {
        _animateBody('personal');

        }
      },
      offset: '50%'
    });

    // Animate Devices
    new Waypoint({
      element: document.getElementById('personal'),
      handler: function(direction) {
        if(direction === 'down') {
          // Order the table items how they should animate in
          var tableItems = ['passport',
          'tea',
          'wallet',
          'notebook',
          'sunglasses',
          'smartphone',
          'bananas',
          'wallet',
          'piano'
          ];

          tableItems.forEach(function(el, index) {
            setTimeout(function() {
              $('#' + el + '-svg').attr('class', el + ' active');
            }, (250*index));
          });
        }
      },
      offset: '25%'
    });

  }


  /**
   *  Animate the title and body in for each section
   */
  function _animateTitle(pageID) {
    $('h3', '#' + pageID).addClass('active');
  }

  function _animateBody(pageID) {
    $('p', '#' + pageID).addClass('active');
  }

  /**
   *  Render the page styles after the window has loaded
   */
  function _renderPage() {
    $(window).load(function() {
      _animateIntroPage();
      _getSVGSprites();
    });
  }


  /**
   *  Add the appropriate class, depending on the project
   */
  function _addNextProjectClass($currentProject) {

    // Rosebud -> Project Mountain
    // To-Do: Once Bandly is live, uncomment this and remove other section
    /*if($currentProject.hasClass('bandly')) {
      $('#projects').removeClass('bandly').addClass('rosebud');
    } else if($currentProject.hasClass('rosebud')) {
      $('#projects').removeClass('rosebud').addClass('project-mountain');
    } else if($currentProject.hasClass('project-mountain')) {
      $('#projects').removeClass('project-mountain').addClass('bandly');
    }*/
    if($currentProject.hasClass('uunicorns')) {
      $('#projects').removeClass('uunicorns').addClass('simple990');
    } else if($currentProject.hasClass('simple990')) {
      $('#projects').removeClass('simple990').addClass('project-mountain');
    } else if($currentProject.hasClass('project-mountain')) {
      $('#projects').removeClass('project-mountain').addClass('bandly');
    } else if($currentProject.hasClass('bandly')) {
      $('#projects').removeClass('bandly').addClass('vest');
    } else if($currentProject.hasClass('vest')) {
      $('#projects').removeClass('vest').addClass('uunicorns');
    }
  }

  function _addPrevProjectClass($currentProject) {

    // Rosebud -> Project Mountain
    if($currentProject.hasClass('uunicorns')) {
      $('#projects').removeClass('uunicorns').addClass('vest');
    } else if($currentProject.hasClass('vest')) {
      $('#projects').removeClass('vest').addClass('bandly');
    } else if($currentProject.hasClass('bandly')) {
      $('#projects').removeClass('bandly').addClass('project-mountain');
    } else if($currentProject.hasClass('project-mountain')) {
      $('#projects').removeClass('project-mountain').addClass('simple990');
    } else if($currentProject.hasClass('simple990')) {
      $('#projects').removeClass('simple990').addClass('uunicorns');
    }
  }


  /**
   *  Get the svg sprites to cache
   */
  function _getSVGSprites() {
    var url = 'static/portafolio/images/sprites.svg';
    $.get(url, function(data) {
      var svgHTML = new XMLSerializer().serializeToString(data.documentElement);
      $('#inline-svg-sprites').html(svgHTML);
      $('.skillset-block .split-circle').show();
    });
  }


  /**
   *  Boot up the site
   */
  function init() {
    _attachEventHandlers();
    _renderPage();
    _addWaypoints();
  }
}

/**
 *  Letter Modal
 */
function Modal(config) {

  var config = config || {},
    $selector = $(config.selector),
    animateLetterIntro = new svgAnimator({
      selector: '#dear-stevie'
    });

  init();

  function _attachEventHandlers() {

    /**
     *  Handle form submit
     */
    $('#talk-to-me-form').submit(function(e) {

      // Let's ensure there's a message there
      if($('#message').val() != '') {
        $('.letter-submit', this).prop('disabled', true);

        var message = $('#message').val();

        $.ajax({
          url: "https://formspree.io/snstarosciak@gmail.com",
          method: "POST",
          data: {message: message},
          dataType: "json",
          success: function(msg) {
            // Success
            if (msg.hasOwnProperty('success')) {
              // Reset the form
              $('.letter-submit').prop('disabled', false);
              $('#message').val('');
              $('#message-sent').addClass('active');
              setTimeout(function() {
                $('#message-sent').removeClass('active');
              }, 3000);
            }
          }
        });
      }
      return false;
    });


    /**
     *  Open the modal
     */
    $('#send-message-envelope').click(function() {
      $(this).addClass('active');
      $('#message').focus();
      $selector.toggleClass('active');
      $selector.removeClass('leave');
      animateLetterIntro.init();
      setTimeout(function() {
        animateLetterIntro.animate();
      }, 100);
    })

    /**
     *  Handle Keyevents
     */
    $(document).keyup(function(e) {
      if(e.which === 27) {
        closeModal();
      }
    })

    /**
     *  Click on the overlay will close the modal
     */
    $('.modal-overlay, .modal-body .close').click(function() {
      closeModal();
    });
  }

  function closeModal() {
    $('#send-message-envelope').removeClass('active');
    $selector.removeClass('active');
    $selector.addClass('leave');
  }

  function init() {
    _attachEventHandlers();
    autosize($('#message'));
  }
}

/**
 *  Function to animate SVG paths
 */
function svgAnimator(config) {
  init();

  function init() {
     $(config.selector).each(function() {
      var delay,
        length,
        path,
        paths,
        previousStrokeLength,
        speed,
        _i,
        _len,
        _results;

      paths = $('path, circle, rect', this);
      delay = 0;
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        length = path.getTotalLength();
        previousStrokeLength = speed || 0;
        speed = 120;
        delay += previousStrokeLength + 20;
        _results.push($(path)
                .css('transition', 'none')
                .attr('data-length', length)
                .attr('data-speed', speed)
                .attr('data-delay', delay)
                .attr('stroke-dashoffset', length)
                .attr('stroke-dasharray', length + ',' + length)
              );
      }
      return _results;

    });
  }

  function animate() {
    $(config.selector).each(function() {
      var delay,
        length,
        path,
        paths,
        speed,
        _i,
        _len,
        _results;

      paths = $('path, circle, rect', this);
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        length = $(path).attr('data-length');
        speed = $(path).attr('data-speed');
        delay = $(path).attr('data-delay');
        _results.push($(path)
                .css('transition', 'stroke-dashoffset ' + speed + 'ms ' + delay + 'ms linear')
                .attr('stroke-dashoffset', '0')
        );
      }
      return _results;
    });
  }

  return {
    animate: animate,
    init: init
  }
}
