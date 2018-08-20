
$('#review_button_sj').click(function () {
    console.log("1");
    $('#store_review_sj').hide(200);
    $('#review_write_sj').show(200);
})
$('#write_cancel_sj').click(function () {
    $('#store_review_sj').show(200);
    $('#review_write_sj').hide(200);
})
