$(document).ready(function() {
    $('.vote-up').submit(function(e) {
        e.preventDefault();

        const postId = $(this).data('id');
        $.ajax({
        type: 'PUT',
        url: 'posts/' + postId + '/vote-up',
        success: function(data) {
            console.log('voted up!');
            location.reload(true)
        },
        error: function(err) {
            console.log(err.messsage);
        }
        });
    });

    $('.vote-down').submit(function(e) {
        e.preventDefault();

        const postId = $(this).data('id');
        $.ajax({
        type: 'PUT',
        url: 'posts/' + postId + '/vote-down',
        success: function(data) {
            console.log('voted down!');
            location.reload(true)
        },
        error: function(err) {
            console.log(err.messsage);
        }
        });
    });
});