$(function() {
    $('main').slideDown(300).animate({'opacity': 1}, {'queue': false, 'duration': 300});
    $('footer').fadeIn(1200);

    // get data stored in localStorage and display it on page load.
    var storageData = JSON.parse(localStorage.getItem("notes"));
    if (!$.isEmptyObject(storageData)) {
        var allNotes = '';
        for (var day in storageData) {
            var string = '<div class="note-section"><span class="day">' + day + '</span>';
            var note = '';
            for (var uid in storageData[day]) {
                var text = storageData[day][uid].note;
                var time = storageData[day][uid].time;
                var noteString = '<span class="note-text">' + text + '</span><span class="time">' + time + '</span>';
                var wellWrapper = wrapNotes(noteString, uid);
                note += wellWrapper;
            }
            var dayNotes = string + note + '</div>'; 
            allNotes += dayNotes;
        }
        $('.panel-body').show();
        $('.user-notes').append(allNotes);
    }

    // enter button is 'add'
    $('#input-note').keypress(function(e) {
        if(e.which == 13) {
            $('#add-note-btn').trigger('click');
        }
    });

    // get the input and store it in localStorage
    $('#add-note-btn').click(function(e) {
        var inputVal = $('#input-note').val();
        if (inputVal) {
            if (typeof(localStorage) !== "undefined") {
                var notesStorage = localStorage.getItem("notes");
                var uniqueId = getRandomId();
                if (notesStorage) {
                    var data = JSON.parse(notesStorage);
                    updateLocalstorageData(inputVal, data, uniqueId);
                }
                else {
                    setLocalstorageData(inputVal, uniqueId);
                }
                appendNotes(inputVal, uniqueId);
                $('.panel-body').show();
            }
            else {
                $(".panel").effect("shake");
            }
            $('#input-note').val('').focus();
        }
        else {
            $('#input-note').effect("highlight", {color: '#ef9a9a'}, 500).focus();
        }
    });

    // delete functionality
    $('.user-notes').on('click', '.trash-icon', function() {
        var noteElement = $(this).closest('.notes-list');
        var thisElement = $(this);
        deleteNote(thisElement, noteElement);
    });

    // checked functionality
    $('.user-notes').on('click', '.check-icon', function() {
        var id = $(this).attr('id').substring(4);
        var day = $(this).closest('.notes-list').siblings('.day').text();
        var notesStorage = JSON.parse(localStorage.getItem("notes"));
        if ($(this).hasClass('fa-check-circle-o')) {
            $(this).closest('.well').animate({'background-color':'#f7f2c5'}, 300);
            $(this).addClass('fa-check-circle').removeClass('fa-check-circle-o');
            var timeStamp = $.now();
            notesStorage[day][id].checked = timeStamp;
            localStorage.setItem("notes", JSON.stringify(notesStorage));
        }
        else {
            $(this).closest('.well').animate({'background-color':'white'}, 300);
            $(this).addClass('fa-check-circle-o').removeClass('fa-check-circle');
            delete notesStorage[day][id].checked;
            localStorage.setItem("notes", JSON.stringify(notesStorage));
        }
    });

    // delete items which are checked for 5 minutes.
    setInterval(function() {
        var currentTime = $.now();
        var notesStorage = JSON.parse(localStorage.getItem("notes"));
        if (!$.isEmptyObject(notesStorage)) {
            for (var day in notesStorage) {
                for (var id in notesStorage[day]) {
                    if (notesStorage[day][id].hasOwnProperty('checked')) {
                        var checkedTime = notesStorage[day][id].checked;
                        if (((currentTime - checkedTime)/1000/60) >= 5) {
                            notesStorage = animateDelete(notesStorage, id, day, 'pulsate');
                        }
                    }
                }
            }
            localStorage.setItem("notes", JSON.stringify(notesStorage));
        }
    }, 5000);
});

function appendNotes(note, uniqueId) {
    var datetime = getCurrentDatetime();
    note = '<span class="note-text">' + note + '</span><span class="time">' + datetime.time + '</span>';
    var wellWrapper = wrapNotes(note, uniqueId);
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

function wrapNotes(note, uniqueId) {
    if (isCheckedNote(uniqueId)) {
        return '<div style="background-color:#f7f2c5" class="notes-list well well-sm">' + note + '<span class="util-icons"><i id="del-'+uniqueId+'" class="trash-icon fa fa-trash-o" aria-hidden="true"></i><i id="che-'+uniqueId+'" class="check-icon fa fa-check-circle" aria-hidden="true"></i></span></div>';
    }
    else {
        return '<div class="notes-list well well-sm">' + note + '<span class="util-icons"><i id="del-'+uniqueId+'" class="trash-icon fa fa-trash-o" aria-hidden="true"></i><i id="che-'+uniqueId+'" class="check-icon fa fa-check-circle-o" aria-hidden="true"></i></span></div>';
    }
}

function setLocalstorageData(note, uniqueId) {
    datetime = getCurrentDatetime();
    var notesStorageData = {};
    notesStorageData[datetime.day] = {};
    notesStorageData[datetime.day][uniqueId] = {'note': note, 'time': datetime.time};
    localStorage.setItem("notes", JSON.stringify(notesStorageData));
}

function updateLocalstorageData(note, data, uniqueId) {
    datetime = getCurrentDatetime();
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

function getCurrentDatetime() {
    var dt = new Date();
    var day = dt.toDateString();
    var hours = dt.getHours();
    var minutes = (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 ? hours % 12 : 12;
    var time =  hours + ":" + minutes + ' ' + ampm;
    return {day: day, time: time};
}

function deleteNote(element, noteElement) {
    var id = $(element).attr('id').substring(4);
    var day = $(noteElement).siblings('.day').text();
    var notesStorage = JSON.parse(localStorage.getItem("notes"));
    notesStorage = animateDelete(notesStorage, id, day, 'drop');
    localStorage.setItem("notes", JSON.stringify(notesStorage));
}

function getRandomId() {
    return (Math.random() + 1).toString(16).substring(2,7);
}

function isCheckedNote(uid) {
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

function animateDelete(notesStorage, id, day, effectType) {
    delete notesStorage[day][id];
    if ($.isEmptyObject(notesStorage[day])) {
        delete notesStorage[day];
        var noteSection = $('span:contains('+day+')');
        $(noteSection).parent().effect(effectType, function() {
            $(this).remove();
        });
        if ($.isEmptyObject(notesStorage)) {
            $('.panel-body').hide(300);
        }
    }
    else {
        $('#del-'+id).closest('.notes-list').effect(effectType, function() {
            $(this).remove();
        });
    }
    return notesStorage;
}
