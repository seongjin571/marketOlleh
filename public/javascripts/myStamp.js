
// $('#go_stamp_sj').click(function () {
//     $('#stamp_menu_sj').show(200);
//     $('#store_detail_sj').hide(200);
//     $('#store_review_sj').hide(200);
//     $('#review_write_sj').hide(200);
//     $('#password_number_div_sj').hide(200);
// })
// $('#go_store_detail_sj').click(function () {
//     $('#stamp_menu_sj').hide(200);
//     $('#store_detail_sj').show(200);
//     $('#store_review_sj').hide(200);
//     $('#review_write_sj').hide(200);
//     $('#password_number_div_sj').hide(200);
// })
// $('#go_store_review_sj').click(function () {
//     $('#stamp_menu_sj').hide(200);
//     $('#store_detail_sj').hide(200);
//     $('#store_review_sj').show(200);
//     $('#review_write_sj').hide(200);
//     $('#password_number_div_sj').hide(200);
// })
$('.review_button_sj').click(function () {
    document.getElementsByClassName('swiper-slide').style.height = "800px";
    $('#store_review_sj').hide(200);
    $('#review_write_sj').show(200);
    $('#password_number_div_sj').hide(200);
})
$('.write_cancel_sj').click(function () {
    $('.swiper-slide').css({height:'height'})
    $('#store_review_sj').show(200);
    $('#review_write_sj').hide(200);
    $('#password_number_div_sj').hide(200);
    var height=$('.store_review_sj').height();

})