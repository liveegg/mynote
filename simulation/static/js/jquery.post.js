/*
 * jQuery Post Form for posting full form including file uploads
 *
 * $("#form_id").post_form("/edit/", function(data){
 * alert('result='+data);
 * });
 */

function append_form(element, action, fn) {
	var body = $("#jquery_post_form").contents().find("body");
    body.append('<form action="'+action+'" method="post" enctype="multipart/form-data"></form>');
    var form = $("#jquery_post_form").contents().find("form");

    $("#"+$(element).attr('id')+" input, #"+$(element).attr('id')+" textarea, #"+$(element).attr('id')+" select").each(function(){
    	var new_element = $(this).clone();
    	new_element.text($(this).val());
    	new_element.appendTo(form);
    });

    form.append('<input type="submit" name="submit" value="1" id="submit" />');
    $("#jquery_post_form").contents().find("#submit").trigger('click');

    $("#jquery_post_form").load(function() {
    	fn($("#jquery_post_form").contents().text());
    	$("#jquery_post_form").remove();
    });
}

$.fn.extend({
    post_form: function(action, fn) {
    	$(document.body).append('<iframe id="jquery_post_form" name="jquery_post_form" style="position:absolute; top:-1000px; left:-100px;"></iframe>');
    	var element = $(this);
    	setTimeout(function(){
    		append_form(element, action, fn);
    	}, 1);


    }
});
