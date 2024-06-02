

/* TODO,
bug fix 1: when double clicking on input, it keeps subtracting forever
bug fix 2: input values not getting transfered to print-form elements
*/



const date = new Date();
const currMonth = date.getMonth();
let currYear = parseInt(date.getFullYear());
let original_bill = undefined;
let bill = undefined;
let tax = '0';
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
    const id = $(ele).prop('id');
    if (/[a-bA-B]/.test($(ele).val())) {
        $(ele).css('border-color', '#CA4E79');
        if (!errors.includes(id)) {
            errors.push(id);
            $('.print').css('opacity', '0.5');
        }
        return true;
    } else {
        if (errors.includes(id)) {
            errors.splice(errors.indexOf(id), 1);
            if (errors.length == 0) {
                $('.print').css('opacity', '1');
            }
        }
        $(ele).css('border-color', '#EEF5FF');
        return false;
    }
}

$('.input-fields').click(function () {
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
    if ($(this).val() != "") {
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

    if (bill == undefined || bill == 0) {
        return;
    }

    if (this.checked) {
        bill = (parseFloat(bill) * 0.18) + parseFloat(bill);
        tax = '18%';
    } else {
        tax = '0';
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
        
        printFrame.on('load', function() {
            const contentWindow = this.contentWindow;
            contentWindow.focus();
            contentWindow.print();
            // contentWindow.remove();
        })
    }

    printForm();

}

$('#printer').click(
    function() {
        if (errors.length == 0 && bill != undefined && bill != 0) {

            $('#rent').text('none');
            $('#elebill').text('none');
            $('#oth').text('none');
            $('#dt').text('none');
            $('#tax').text(tax);
            $('#bill').text(bill);
            printer();

        }
    }
);

