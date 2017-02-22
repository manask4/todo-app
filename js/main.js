var notesStorage = localStorage.getItem("notes");
if (notesStorage) {
    var data = JSON.parse(notesStorage);
    var allNotes = '';
    for (var day in data) {
        var string = '<div class="day">' + day + '</div>';
        var note = '';
        for (var time in data[day]) {
            var noteString = '<span class="note-text">' + data[day][time] + '</span><span class="time">' + time + '</span>';
            var wellWrapper = wrap_notes(noteString);
            note += wellWrapper;
        }
        var dayNotes = string + note; 
        allNotes += dayNotes;
    }
    $('.panel-body').show();
    $('.user-notes').append(allNotes);
}

$('#input-note').keypress(function(e) {
    if(e.which == 13) {
        $('#add-note-btn').trigger('click');
    }
});

$('#add-note-btn').click(function(e) {
    var inputVal = $('#input-note').val();
    if (inputVal) {
        if (typeof(localStorage) !== "undefined") {
            var notesStorage = localStorage.getItem("notes");
            if (notesStorage) {
                var data = JSON.parse(notesStorage);
                update_localstorage_data(inputVal, data);
            }
            else {
                set_localstorage_data(inputVal);
            }
            append_notes(inputVal);
            $('.panel-body').show();
        }
        else {
            // throw error
            $(".panel").effect("shake");
        }
        $('#input-note').val('');
    }
    else {
        $(".panel").effect("shake");   
    }
});

$('.user-notes').on('click', '.trash-icon', function() {
    var id = Math.random().toString();
    console.log(id);

    var element = $(this).closest('.notes-list');
    $(this).closest('.notes-list').fadeOut(200);
});

$('.user-notes').on('click', '.check-icon', function() {
    if ($(this).hasClass('fa-check-circle-o')) {
        $(this).closest('.well').css({'background-color':'#ccc'});
        $(this).addClass('fa-check-circle').removeClass('fa-check-circle-o');
    }
    else {
        $(this).closest('.well').css({'background-color':'white'});
        $(this).addClass('fa-check-circle-o').removeClass('fa-check-circle');
    }
});

function append_notes(note) {
    var datetime = get_current_datetime();
    note = '<span class="note-text">' + note + '</span><span class="time">' + datetime.time + '</span>';
    var wellWrapper = wrap_notes(note);
    $('.user-notes').append(wellWrapper);
}

function wrap_notes(note) {
    return '<div class="notes-list well well-sm">' + note + '<span class="util-icons"><i class="trash-icon fa fa-trash-o" aria-hidden="true"></i><i class="check-icon fa fa-check-circle-o" aria-hidden="true"></i></span></div>';
}


function set_localstorage_data(note) {
    datetime = get_current_datetime();
    var notes_storage_data = {};
    notes_storage_data[datetime.day] = {};
    notes_storage_data[datetime.day][datetime.time] = note;
    localStorage.setItem("notes", JSON.stringify(notes_storage_data));
}

function update_localstorage_data(note, data) {
    datetime = get_current_datetime();
    if (data[datetime.day]) {
        data[datetime.day][datetime.time] = note;
        localStorage.setItem("notes", JSON.stringify(data));
    }
    else {
        data[datetime.day] = {};
        data[datetime.day][datetime.time] = note;
        localStorage.setItem("notes", JSON.stringify(data));
    }
}

function get_current_datetime() {
    var dt = new Date();
    var day = dt.toDateString();
    var hours = dt.getHours();
    var minutes = (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 ? hours % 12 : 12;
    var time =  hours + ":" + minutes + ' ' + ampm;
    return {day: day, time: time};
}
