var notesStorage = localStorage.getItem("notes");
if (notesStorage != '{}') {
    var data = JSON.parse(notesStorage);
    var allNotes = '';
    for (var day in data) {
        var string = '<div class="note-section"><span class="day">' + day + '</span>';
        var note = '';
        for (var uid in data[day]) {
            var text = data[day][uid]['note'];
            var time = data[day][uid]['time'];
            var noteString = '<span class="note-text">' + text + '</span><span class="time">' + time + '</span>';
            var wellWrapper = wrap_notes(noteString, uid);
            note += wellWrapper;
        }
        var dayNotes = string + note + '</div>'; 
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
            var uniqueId = get_random_id();
            if (notesStorage) {
                var data = JSON.parse(notesStorage);
                update_localstorage_data(inputVal, data, uniqueId);
            }
            else {
                set_localstorage_data(inputVal, uniqueId);
            }
            append_notes(inputVal, uniqueId);
            $('.panel-body').show();
        }
        else {
            $(".panel").effect("shake");
        }
        $('#input-note').val('');
    }
    else {
        $(".panel").effect("shake");   
    }
});

$('.user-notes').on('click', '.trash-icon', function() {
    var noteElement = $(this).closest('.notes-list');
    var thisElement = $(this);
    delete_note(thisElement, noteElement);
});

$('.user-notes').on('click', '.check-icon', function() {
    var id = $(this).attr('id').substring(4);
    var day = $(this).closest('.notes-list').siblings('.day').text();
    var notesStorage = JSON.parse(localStorage.getItem("notes"));
    if ($(this).hasClass('fa-check-circle-o')) {
        $(this).closest('.well').animate({'background-color':'#f7f2c5'}, 300);
        $(this).addClass('fa-check-circle').removeClass('fa-check-circle-o');
        notesStorage[day][id]['checked'] = 1;
        localStorage.setItem("notes", JSON.stringify(notesStorage));
    }
    else {
        $(this).closest('.well').animate({'background-color':'white'}, 300);
        $(this).addClass('fa-check-circle-o').removeClass('fa-check-circle');
        delete notesStorage[day][id]['checked'];
        localStorage.setItem("notes", JSON.stringify(notesStorage));
    }
});

function append_notes(note, uniqueId) {
    var datetime = get_current_datetime();
    note = '<span class="note-text">' + note + '</span><span class="time">' + datetime.time + '</span>';
    var wellWrapper = wrap_notes(note, uniqueId);
    var day = datetime.day;
    var dayPresent = $('span:contains('+day+')');
    if (dayPresent.length == 1) {
        $(dayPresent).after(wellWrapper);
    }
    else {
        var noteBlock = '<div class="note-section"><span class="day">' + day + '</span>' + wellWrapper + '</div>';
        $('.user-notes').append(noteBlock);
    }
}

function wrap_notes(note, uniqueId) {
    if (is_checked_note(uniqueId)) {
        return '<div style="background-color:#f7f2c5" class="notes-list well well-sm">' + note + '<span class="util-icons"><i id="del-'+uniqueId+'" class="trash-icon fa fa-trash-o" aria-hidden="true"></i><i id="che-'+uniqueId+'" class="check-icon fa fa-check-circle" aria-hidden="true"></i></span></div>';
    }
    else {
        return '<div class="notes-list well well-sm">' + note + '<span class="util-icons"><i id="del-'+uniqueId+'" class="trash-icon fa fa-trash-o" aria-hidden="true"></i><i id="che-'+uniqueId+'" class="check-icon fa fa-check-circle-o" aria-hidden="true"></i></span></div>';
    }

}

function set_localstorage_data(note, uniqueId) {
    datetime = get_current_datetime();
    var notes_storage_data = {};
    notes_storage_data[datetime.day] = {};
    notes_storage_data[datetime.day][uniqueId] = {'note': note, 'time': datetime.time};
    localStorage.setItem("notes", JSON.stringify(notes_storage_data));
}

function update_localstorage_data(note, data, uniqueId) {
    datetime = get_current_datetime();
    if (data[datetime.day]) {
        data[datetime.day][uniqueId] = {'note': note, 'time': datetime.time};
        localStorage.setItem("notes", JSON.stringify(data));
    }
    else {
        data[datetime.day] = {};
        data[datetime.day][uniqueId] = {'note': note, 'time': datetime.time};
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

function delete_note(element, noteElement) {
    var id = $(element).attr('id').substring(4);
    var day = $(noteElement).siblings('.day').text();
    var notesStorage = JSON.parse(localStorage.getItem("notes"));
    delete notesStorage[day][id];
    if ($.isEmptyObject(notesStorage[day])) {
        delete notesStorage[day];
        $(noteElement).parent().effect('drop', function() {
            $(this).remove();
        });
        if ($.isEmptyObject(notesStorage)) {
            $('.panel-body').hide(300);
        }
    }
    else {
        $(element).closest('.notes-list').effect('drop', function() {
            $(this).remove();
        });
    }
    localStorage.setItem("notes", JSON.stringify(notesStorage));
}

function get_random_id() {
    return (Math.random() + 1).toString(16).substring(2,7);
}

function is_checked_note(uid) {
    var notesStorage = JSON.parse(localStorage.getItem("notes"));
    for (var day in notesStorage) {
        for (var id in notesStorage[day]) {
            if (id == uid) {
                if (notesStorage[day][id].hasOwnProperty('checked')) {
                    return true;
                }
            }
        }
    }
    return false;
}
