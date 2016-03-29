$(document).ready(function(){
	$( "#menu" ).menu({
		select: function( event, ui ) {
			var code = ui.item.attr('catecode');										
			var depth = ui.item.attr('depth');
			if(depth < 3) {
				alert("소분류 이하부터 선택 가능합니다.");
				return;
			}

			var cnt = get_check_status();					
			var act = $("#current_url").val()+'?code='+code+'&depth='+depth+'&group_cnt='+cnt;
			$("#bd_search").attr('action', act);				
			document.getElementById('bd_search').submit();	
		}
	});

	$("#search_btn, #chk_group").click(function(){
		var cnt = get_check_status();
		if($("#q").val() == ''){
			var act = $("#current_url").val()+'?code='+$("#sel_category_code").val()+'&depth=1&group_cnt='+cnt;
			$("#bd_search").attr('action', act);
			document.getElementById('bd_search').submit();
		} else {
			var cond = $("#cond").val();					
			var act = $("#current_url").val()+'?code='+$("#sel_category_code").val()+'&depth=1&q='+$("#q").val()+'&group_cnt='+cnt;
			$("#bd_search").attr('action', act);
			document.getElementById('bd_search').submit();
		}				
	});

	$("#group_cnt").keyup(function (event) {
		regexp = /[^0-9]/gi;
		v = $(this).val();
		if (regexp.test(v)) {
			alert("숫자만 입력가능 합니다.");
			$(this).val(v.replace(regexp, ''));
		}
	});
	
});

function board_search_enter(form) {
	var keycode = window.event.keyCode;
	if(keycode == 13) $("#search_btn").click();
}

function detail_pop(prod_c) {
	if(prod_c != ''){
		var q_string = '?prod_c='+prod_c;
	} else {
		var q_string = '';
	}
	
	window.open('/board/detail'+q_string, 'detailPop', 'width=760,height=740,resizable=yes', '_blank');
}

function get_check_status() {
	
	var cnt = 2;

	if($("#chk_group").is(":checked")) {
		cnt = 2;
	} else {
		cnt = 1;
	}
	
	return cnt;
}