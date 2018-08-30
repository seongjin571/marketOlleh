var spinner;
jQuery(function(){
    spinner = new Spinner({ color: '#6acbe8' }).spin().el;
    jQuery(document.body).append(spinner);
    jQuery(spinner).css('display','none');
});
 
window.onbeforeunload = function(e){
    if(e != null && e != undefined){
        jQuery(spinner).css('display','');
        jQuery(spinner).css('position','fixed');
    }
};

