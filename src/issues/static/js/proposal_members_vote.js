"use strict";

function vote_response(data) {
    if (data['sum'] != undefined) {
        $('#member_vote_sum').html(data['sum']);
    }
    var failed = data['override_fail'];
    $.each(failed, function(i, value) {
        var user_row = $('fieldset[data-uid="' + value['uid'] + '"]');
        var sel = $('input[value="' + value['val'] + '"]', user_row); 
        sel.prop('checked',  true);
        user_row.prop('disabled', true);
    });
}

function do_members_vote(vote_url, vote_value, user_id) {
    $.post(vote_url, {
        val : vote_value,
        user : user_id,
        board: '1',
    }, function(data) {
        vote_response(data);
            /*
            var existing = data['existing_val'];
            var user_row = r_btn.closest('fieldset')
            var sel = $('input[value="' + existing + '"]', user_row); 
            sel.prop('checked',  true);
            user_row.prop('disabled', true);
            */
        
    });
}

function all_members_vote(vote_url, vote_value, user_ids) {
    /*
    $.each(user_ids, function(i, n) {
        $('input[value=""')
    }*/
    $.post(vote_url, {
        val : vote_value,
        users : JSON.stringify(user_ids)
    }, function(data) {
        vote_response(data);
    });
}


$(function() {
    $(".container").on("change", "input:radio", function(event) {
        var vote_value = $(this).val();
        var target = $(this).attr('data-href');
        var user_id = $(this).attr('name').substr(11);
        do_members_vote(target, vote_value, user_id);
    });


	$(".container").on("click", ".all-pro,.all-con,.all-neutral", function(event) {
		var vote_value = $(this).data('value');
		var target = $(this).data('href') + "multi/";
		var user_ids = $.map($('fieldset:not([disabled]) input[value="' + vote_value + '"]').prop('checked', true), function(obj) {
			return $(obj).attr('name').substr(11);
		});
		all_members_vote(target, vote_value, user_ids);
	}); 

});
