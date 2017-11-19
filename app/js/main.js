$(document).ready(function(){
    //Progress bar on slider
    var percent = 0, 
        bar = $('.transition-timer-carousel-progress-bar'), 
        crsl = $('#carousel');
    function progressBarCarousel() {
      bar.css({width:percent+'%'});
     percent = percent +0.5;
      if (percent>100) {
          percent=0;
          crsl.carousel('next');
      }      
    }
    crsl.carousel({
        interval: false,
        pause: true
    }).on('slid.bs.carousel', function () {});
    var barInterval = setInterval(progressBarCarousel, 30);
    crsl.hover(
        function(){
            clearInterval(barInterval);
        },
        function(){
            barInterval = setInterval(progressBarCarousel, 30);
        });
    //Filter pills
    $('.filters a').on('click', function(e){
        e.preventDefault();
        $('.filters li').removeClass('active');
        $(this).parent('li').addClass('active');
    })
});