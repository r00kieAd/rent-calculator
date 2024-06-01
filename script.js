// if(typeof window.scriptExecuted === 'undefined') {
//     window.scriptExecuted = true;
//     console.log('script executed');
// }
const date = new Date();
const currMonth = date.getMonth();
let currYear = parseInt(date.getFullYear());
let original_bill = undefined;
let bill = undefined;
// console.log(original_bill)
$(document).ready(
    function () {
        const months = {
            0: 'January',
            1: 'February',
            2: 'March',
            3: 'April',
            4: 'May',
            5: 'June',
            6: 'July',
            7: 'August',
            8: 'September',
            9: 'October',
            10: 'November',
            11: 'December'
        }
        $('#year').text(currYear);
        let month_index = -1;
        $('#months option').each(function () {
            let index = currMonth + month_index == -1 ? 11 : currMonth + month_index == 12 ? 0 : currMonth + month_index;
            $(this).text(months[index]);
            month_index += 1;
        });
    }
);

function error(ele) {
    if (/[a-bA-B]/.test($(ele).val())) {
        $(ele).css('border-color', '#CA4E79');
        $('#calculate').removeClass('print');
        return true;
    } else {
        $('#calculate').addClass('print');
        $(ele).css('border-color', '#A0DEFF');
    }
}

$('.input-fields').click(function () {
    $(this).css('border-color', '#A0DEFF');
    if ($(this).val() != "") {
        bill = bill - $(this).val();
        $('#bal').text(bill);
    }
});

$('.input-fields').blur(function () {
    if (!error(this) && $(this).val() != "") {
        $(this).css('border-color', '#EEF5FF');
        let initial = $('#bal').text();
        bill = parseFloat(initial) + parseFloat($(this).val());
        $('#bal').text(bill);
        original_bill = bill;
    }
});

$('.input-fields').on('keypress', function () {
    !error(this);
})

$('.month').click(function () {
    $('.month').removeAttr('selected');
    if ($(this).text() == 'January' && $(this).val() == 'future') {
        $('#year').text(currYear + 1);
    } else if ($(this).text() == 'December' && $(this).val() == 'past') {
        $('#year').text(currYear - 1);
    } else {
        $('#year').text(currYear);
    }
});

$('.toggle__input').on('change', function () {
    if (this.checked) {
        bill = (parseFloat(bill) * 0.18) + parseFloat(bill);
    } else {
        console.log(original_bill);
        bill = parseFloat(original_bill);
    }
    $('#bal').text(Math.floor(bill));
});

$('.print').click(
    function() {
        if (bill === undefined || bill == 0) {
            $('.input-fields').css('border-color', '#CA4E79');
            return;
        }
        alert(bill);
    }
)

