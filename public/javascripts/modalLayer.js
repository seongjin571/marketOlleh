$(document).ready(function(){
    var modalLayer = $("#modalLayer");
    var modalLink = $(".modalLink");
    var modalCont = $(".modalContent");
    var marginLeft = modalCont.outerWidth()/2;
    var marginTop = modalCont.outerHeight()/2; 
  
    modalLink.click(function(){
      modalLayer.fadeIn("slow");
      modalCont.css({"margin-top" : -marginTop, "margin-left" : -marginLeft});
      $(this).blur();
      $(".modalContent > a").focus(); 
      return false;
    });
  
    $(".modalContent > button").click(function(){
      modalLayer.fadeOut("slow");
      modalLink.focus();
    });		
  });