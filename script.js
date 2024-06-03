// TODO: bug fix, form doesn't resets properly in consequtive inputs or page refreshes.


const date = new Date();
const currMonth = date.getMonth();
let currYear = parseInt(date.getFullYear());
// const pattern = /[a-bA-B]|[!@#$%&*^()]/;
const pattern = /^[0-9]+(\.[0-9]+)?$/;
let original_bill = undefined;
let bill = undefined;
let tax = '0%';
let errors = new Array();
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

if (errors.length != 0) {

}

function error(ele) {
    if ($(ele).val() == "") return false;
    const id = $(ele).prop('id');
    if (!pattern.test($(ele).val())) {
        $(ele).css('border-color', '#CA4E79');
        if (!errors.includes(id)) {
            errors.push(id);
            $('.print').css('opacity', '0.5');
            $('.print').html('Invalid Inputs <i class="fa-solid fa-circle-exclamation"></i>');
        }
        return true;
    } else {
        if (errors.includes(id)) {
            errors.splice(errors.indexOf(id), 1);
            if (errors.length == 0) {
                $('.print').css('opacity', '1');
                $('.print').html('Print Bill <i class="fa-solid fa-print"></i>');
            }
        }
        $(ele).css('border-color', '#A0DEFF');
        return false;
    }
}

$('.input-fields').focus(function () {
    $(this).css('border-color', '#A0DEFF');
    if ($(this).val() != "" && !error(this)) {
        bill = bill - $(this).val();
        $('#bal').text(bill);
    }
});

$('.input-fields').blur(function () {
    if (error(this)) {
        return;
    }
    $(this).css('border-color', '#EEF5FF');
    if ($(this).val() != "") {
        let initial = $('#bal').text();
        bill = parseFloat(initial) + parseFloat($(this).val());
        $('#bal').text(bill);
        original_bill = bill;
    }
});

$('.input-fields').on('keypress', function () {
    $('#printer').html('Print Bill <i class="fa-solid fa-print"></i>');
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

    if (bill == undefined || bill == 0) {
        return;
    }

    if (this.checked) {
        bill = (parseFloat(bill) * 0.18) + parseFloat(bill);
        tax = '18%';
    } else {
        tax = '0%';
        bill = parseFloat(original_bill);
    }
    $('#bal').text(Math.floor(bill));
});

function printer() {

    const printForm = () => {
        const printFrame = $("<iFrame>", {
            src: 'index.html',
            title: 'summary',
            style: 'display: none'
        }).appendTo('body');

        printFrame.on('load', function () {
            const contentWindow = this.contentWindow;
            const contentDocument = contentWindow.document;
            contentDocument.write(`
                <html>
                <head>
                    <title>Summary</title>
                    <link rel="stylesheet" type="text/css" href="style.css">
                </head>
                <body>
                    ${$('body').html()}
                </body>
                </html>
            `);
            contentDocument.close();
            contentWindow.focus();
            contentWindow.print();
        })
    }

    printForm();

}

$('#printer').click(
    function () {

        if (errors.length >= 1) {
            return;
        }

        if ($('#houserent').val() == "" || ($('#unit1').val() == "" && $('#unit2').val() == "")) {
            $(this).html('Enter Required Fields <i class="fa-solid fa-circle-exclamation"></i>');
            return;
        }

        if (bill != undefined && bill != 0) {
            $('#rent').text($('#houserent').val());
            $('#elebill').text(($('#unit2').val() + $('#unit1').val()) || '0');
            $('#oth').text($('#otherbill').val() || '0');
            $('#dt').text($(`option[value="${$('#months').val()}"]`).text() + ' ' + $('#year').text());
            $('#tax').text(tax);
            $('#bill').text(bill);
            printer();
            return;
        }
    }
);

