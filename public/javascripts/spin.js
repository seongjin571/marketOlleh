var spinner;
jQuery(function(){
    spinner = new Spinner({ color: '#FF69B4' }).spin().el;
    jQuery(document.body).append(spinner);
    jQuery(spinner).css('display','none');
});
 
window.onbeforeunload = function(e){
    if(e != null && e != undefined){
        jQuery(spinner).css('display','');
    }
};

