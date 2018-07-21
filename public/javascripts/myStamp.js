
$('#go_stamp_sj').click(function () {
    $('#stamp_menu_sj').show(200);
    $('#store_detail_sj').hide(200);
    $('#store_review_sj').hide(200);
})
$('#go_store_detail_sj').click(function () {
    $('#stamp_menu_sj').hide(200);
    $('#store_detail_sj').show(200);
    $('#store_review_sj').hide(200);
})
$('#go_store_review_sj').click(function () {
    $('#stamp_menu_sj').hide(200);
    $('#store_detail_sj').hide(200);
    $('#store_review_sj').show(200);
})
$('#store_review_sj').click(function () {
    alert('aa')
    $('.store_review_sj').hide(200);
    $('.review_write_sj').show(200);
})