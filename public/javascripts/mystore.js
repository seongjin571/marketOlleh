
$('#go_store_detail_sj').click(function () {
    $('#store_detail_sj').show(200);
    $('#store_review_sj').hide(200);
    $('#review_write_sj').hide(200);
})
$('#go_store_review_sj').click(function () {
    $('#store_detail_sj').hide(200);
    $('#store_review_sj').show(200);
    $('#review_write_sj').hide(200);
})
$('#review_button_sj').click(function () {
    $('#store_review_sj').hide(200);
    $('#review_write_sj').show(200);
})
$('#write_cancel_sj').click(function () {
    $('#store_review_sj').show(200);
    $('#review_write_sj').hide(200);
})