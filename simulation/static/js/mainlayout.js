$(document).ready(function(){
//drag&drop사용을 위한 snb,contant,rnb의 내용 파싱
	$("div #snb").attr("class","widget-place");
	$("div #snb div").each(function(){
		$(this).attr("class","widget-header");
		$(this).wrap("<div id=\"widget\" class=\"widget movable\"></div>");
		plugin($(this),$(this).attr("id"));
	});

	$("div #content").attr("class","widget-place");
	$("div #content div").each(function(){
		$(this).attr("class","widget-header");
		$(this).wrap("<div id=\"widget\" class=\"widget movable\"></div>");
		plugin($(this),$(this).attr("id"));
	});
	
	$("div #rnb").attr("class","widget-place");
	$("div #rnb div").each(function(){
		$(this).attr("class","widget-header");
		$(this).wrap("<div id=\"widget\" class=\"widget movable\"></div>");
		plugin($(this),$(this).attr("id"));
	});

	// 관리자화면의 틀의 배경색 변경
	$("div #logo").css({ "background-color":"#D0D0D0" });
	$("div #lnb").css({	"background-color":"#D0D0D0"	});
	$("div #mnb").css({ "background-color":"#D0D0D0" });
	$("div #hib").css({	"background-color":"#D0D0D0"	});
	$("div #snb").css({	"background-color":"#D0D0D0"	});
	$("div #content").css({ "background-color":"#D0D0D0" });
	$("div #rnb").css({	"background-color":"#D0D0D0"	});
	$("div #footer").css({	"background-color":"#D0D0D0"	});

});

/**
 * ajax를 통해 넘어온 값의 빈공간을 없애 리턴한다.
 * 
 * @param str
 * @return str
 */
function trim(str) {
    str = str.replace(/(^\s*)|(\s*$)/g,"");
    return str;
}

/**
 * plugin의 크기를 조정 ajax
 * 
 * @param object
 * @param id
 */
function plugin(object,id){
		$.ajax({
		url : $("div #clone_layout").attr("url"),
		type : "post",
		datatype : "text",
		data : {
			ajax : "plugin",
			plugin : id
		},
		success : function(data,status){	
			plugin = trim(data).split('|');
			wd = Math.round(parseInt(plugin[0])*0.5);
			hi = Math.round(parseInt(plugin[1])*0.5);
			object.text("");
			object.css({ "width" : wd,"height" : hi, "margin" : "0 0 1px 0", "cuosr" : "move" });
			object.append("<b class='plugin_r1'></b><b class='plugin_r2'></b><b class='plugin_r3'></b><b class='plugin_r4'></b><ul id="+id+" class='plugin_rmiddle'>"+plugin[2]+"</ul><b class='plugin_r4'></b><b class='plugin_r3'></b><b class='plugin_r2'></b><b class='plugin_r1'></b>");
			object.append("<div id=\"abtn_option\" onclick=\"option_modify(this);\"><img src=\"/images/btn_option.gif\" style=\"cursor:pointer;\"></div><div id=\"abtn_pgdel\" onclick=\"RemoveWidget(this);\"><img src=\"/images/btn_del.gif\"></div>");
			
			// 추가한 플러그인 썸네일의 크기를 줄이기 위하여 선택
			pluginUl = object.children(":[class=plugin_rmiddle]");
			/* 중간 내용이 들어갈곳 크기 계산하여 적용 */
			ulHi = Math.round(parseInt(plugin[1])*0.5)-10;
			pluginUl.css({ "height":ulHi });
		},
		error:function(request,status){
			alert(status);
		}
	});
}

// 윈도우 로드시(ready 다음)
$(window).load(function(){
	// width 와 height 값의 초기화
	var wd = 0;
	var hi = 0;

	// 모든 div 객체들을 60%크기로 변환한다.
	$("div #wrap div").each(function(){
		if($(this).attr("class") != "widget movable"){
			wd = Math.round($(this).width()*0.5); //원래의 width값 * 0.5
			hi = Math.round($(this).height()*0.5); //원래의 height값 * 0.5
			if(($(this).attr("id") =="container" || $(this).attr("id") == "snb" || $(this).attr("id") =="colgroup" || $(this).attr("id") == "content" || $(this).attr("id") == "rnb")){
				$(this).css({	width:wd });
				if(jQuery.browser.msie == true){ //브라우저가 ie라면 플러그인이 들어가는 기본 구간을 300px로 준다. 나중에 없앨꺼니깐
					$(this).css({ height:"300px"});
				}
			}else{
				$(this).css({	width:wd, height:hi	});
			}
		}
	});

	// 플러그인들의 썸네일 이미지 크기를 60%로 변환한다.
	$("div #wrap img").each(function(){
		wd = Math.round($(this).width()*0.5); //원래의 width값 * 0.5
		hi = Math.round($(this).height()*0.5); //원래의 height값 * 0.5
		$(this).css({
			width:wd,
			height:hi 
		});
	});

	// 삭제버튼 추가
	$("div .widget-header").each(function(){
		$(this).append("<div id=\"abtn_pgdel\" onclick=\"RemoveWidget(this);\"><img src=\"/images/btn_del.gif\"></div>");
	});
	
	$("div#wrap").css({"width":"506px"}); //사용자 스킨의 wrap의 크기를 500으로 줄인다.
	$("body").css({"text-align":"left"}); //사용자 스킨의 css파일에서 body가 center정렬일때 left로 설정한다.
	$("div#acontent_box").css({"text-align":"left"}); //사용자 스킨의 내용이 나오기 전까지 left를 유지한다.
});


function action(){
	var msg = confirm("작성된 레이아웃을 적용합니다. \n\n기존에 작성된 레이아웃은 복구할수 없습니다.");
	
	if(msg){
		//데이터를 담을 저장소 생성
		var xml_data = "";
		var i = 0;
		// 복사본을 따로 만들다(저장시 깜빡거림 방지)
		// 임의 div공간(clone_layout)부분에 화면에 뿌려진내용을 그대로 복사하여 치환후 저장
		$("div #wrap").clone().prependTo("div #clone_layout");
	
		$(function(){
			// 본문내용중 widget movable 부분을 치환한다.
			$("div #container div").each(function(){
				if($(this).attr("class") == "widget movable"){
					$(this).replaceWith($(this).html());
				}			
			});
			
			// 본문내용중 easywidgets 관련부를 뺀다.					
			$("div #clone_layout div").each(function(){
			
				$(this).removeAttr("style");
				$(this).removeAttr("sizcache");
				$(this).removeAttr("sizset");
				$(this).removeAttr("unselectable");
				$(this).removeAttr("aria-disabled");
				$(this).removeAttr("class");
			});
			
			$("div #container div").children().each(function(){
				// 하위 엘리먼트중 id가 abtn_pgdel(삭제버튼)을 지운다.
				if($(this).attr("id") == "abtn_pgdel") $(this).remove();
				if($(this).attr("id") == "abtn_option") $(this).remove();
				
				// 하위 엘리먼트중 ul 하위요소
				$(this).children("ul").each(function(){
					if($(this).attr('class') == "plugin_rmiddle")
					{
						// ul 중 class가 plugin_rmiddle의 id값을 가져온다.
						id = $(this).filter(".plugin_rmiddle").attr("id");
					
						// ul의 값을 템플릿 코드로 변경한다. 
						$(this).replaceWith("{"+id+"}");
					}
				});
			});
	
			// 플러그인에 붙어있는 삭제버튼을 없앤다.
			//$("#abtn_pgdel").remove();
			
			// 플러그인의 둥근 태두리를 없앤다.
			$("b").remove();
			
			/*
			// 플러그인 썸네일의 style을 없앤다.
			$("div #clone_layout img").each(function(){
				$(this).removeAttr("style");
			});
			 */
	
			/**
			 * 각 부분의 div의 값의 설정값을 데이터화 한다.
			 */
	/*		
				$("div #clone_layout *").each(function(){
					if($(this).attr("type") == "text/css"){
						xml_data[i] = "link";
						xml_data[i] = new Array(3);
						xml_data[i]['href'] = $(this).attr("href");
						xml_data[i]['rel'] = $(this).attr("rel");
						xml_data[i]['type'] = $(this).attr("type");
					}else{
						xml_data[i] = "div";
						xml_data[i] = new Array(1);
						xml_data[i]['id'] = $(this).attr("id");	
					}
				});
	*/
			$("div #clone_layout *").each(function(){
				if($(this).attr("type")){
					// XML에 LINK부분을 뺀다.
					//if(xml_data != "") xml_data = xml_data + ",";
					//xml_data = xml_data + "link" + ":" +$(this).parent().attr("id")+"|href="+$(this).attr('href')+"|rel="+$(this).attr('rel')+"|type="+$(this).attr('type');
		 
					//clone_layout 의 link도 지운다. 새로 복사하는 곳의 주소를 집어넣기 위함
					$("div #clone_layout link").remove();
				}else if($(this).attr("module_no")){
					if(xml_data != "") xml_data = xml_data + ",";
					xml_data = xml_data + $(this).attr("id") + ":" + $(this).parent().attr("id") + "|module_no" + "=" +$(this).attr('module_no')+ "|skin_no" + "=" +$(this).attr('skin_no');
				}else {
					if(xml_data != "") xml_data = xml_data + ",";
					xml_data = xml_data + $(this).attr("id") + ":" + $(this).parent().attr("id");
				}
			});
			
			/**
			 * xml_data를 만든후 index.php(레이아웃 div파일)에서는 지워준다.
			 * 모듈번호와 스킨번호를 계속 가지고 있어야 해서 주석처리됨(화면상의 플러그인을 다시 저장시에 번호가 필요함)
			*
			* $("div #clone_layout div").each(function(){
			* $(this).removeAttr("module_no");
			* $(this).removeAttr("skin_no");
			* }); 
			*/
			
			var contents = $("div #clone_layout").html();
			var form = document.submit;
			
			$("div #clone_layout *").remove();
	
			form.contents.value = contents;
			form.ajax.value = "layout_save";
			form.xml_data.value = xml_data;
	
	/*
			$.ajax({
				url : "/admin/design/main",
				type : "post",
				datatype : "text",
				data : {
					ajax : "layout_save",
					contents : contents, 
					xml_data : xml_data
				}
			});
	*/
			form.submit();	
	/*
			// ajax모드로 이동시 바로바로 저장되도록 한다.						
			$.post("http://hbuilder.com/admin/design/ajax",
			{
				"ajax" : "update",
				"contents" : contents
			},
				function(data,textStatus){
					if(textStatus =="success")
					{
						alert("적용되었습니다.    ");
						location.reload();
					}else{
						alert("에러!");
					}
				//alert(textStatus);
				}
			);
	*/
		});
	}
}


function AddWidget(url, placeId, module_no, skin_no, dir, name, width, height) {
	pluginWd = Math.round(parseInt(width)*0.5);
	pluginHi = Math.round(parseInt(height)*0.5);
	
	placeWd = $('#'+placeId).width();

	//플러그인 적용시 기존에 같은게 있는지 판별하여 적용
//	if($("div").children().is("#"+dir)){
		//alert("선택한 플러그인이 화면상에 존재합니다.");
//	}else if(pluginWd > placeWd){ 	//플러그인 적용시 가로크기를 비교하여 클경우 에러처리
	if(pluginWd > placeWd){
//	if(pluginWd > placeWd){ //중복사용 불가처리
		alert("적용할 플러그인의 가로 크기가 너무 큽니다.\n\n- 적용할 플러그인의 가로 크기 : "+pluginWd+"px\n- 적용할 공간의 가로 크기 : "+placeWd+"px");
	}else{
		// 크기가 괜찮다면 플러그인을 추가한다. 삭제버튼도 함께 추가
		$('#'+placeId).append("<div style=\"cursor:move;\" class=\"widget-header\" id="+dir+" module_no=\""+module_no+"\" skin_no=\""+skin_no+"\" location=\""+placeId+"\"><b class='plugin_r1'></b><b class='plugin_r2'></b><b class='plugin_r3'></b><b class='plugin_r4'></b><ul id="+dir+" class='plugin_rmiddle'>"+name+"</ul><b class='plugin_r4'></b><b class='plugin_r3'></b><b class='plugin_r2'></b><b class='plugin_r1'></b><div id=\"abtn_option\" onclick=\"option_modify(this);\"><img src=\"/images/btn_option.gif\" style=\"cursor:pointer;\"></div><div id=\"abtn_pgdel\" onclick=\"RemoveWidget(this);\"><img src=\"/images/btn_del.gif\" style=\"cursor:pointer;\"></div></div>");
	
		// 추가한 플러그인 썸네일의 크기를 줄이기 위하여 선택
		addPlugin = $('#'+placeId).children(":[id="+dir+"]");
		addPlugin_middle = addPlugin.children(":[class=plugin_rmiddle]");
		
		// 가로,세로를 계산 하여 스타일을 적용
	//	wd = Math.round(addPlugin.width()*0.5);
	//	hi = Math.round(addPlugin.height()*0.5);
		
		addPlugin.css({
			width:pluginWd,
			height:pluginHi,
			margin:"0 0 1px 0"
		});
		
		/* 중간 내용이 들어갈곳 크기 계산하여 적용 */
		middleHi = Math.round(parseInt(height)*0.5)-10;
		
		addPlugin_middle.css({
			height:middleHi
		});
		
		// 마우스 드레그&드롭을 위해 div로 감싸준다.
		addPlugin.wrap("<div id=\"widget\" class=\"widget movable\"></div>");
		
		// 썸네일 선택을 위해 name속성을 주었던것을 삭제한다.
		addPlugin.removeAttr("name");
	
		// EasyWidgets 실행 스크립트 다시 실행(플러그인썸네일 이동)
		$( function() {
			$.fn.EasyWidgets();
		});
	}//end if
}

// 플러그인 삭제
function RemoveWidget(obj){
	var index = $("*").index(obj);
	var parentDiv = $($($("*").get(index)).parent()).parent();
	parentDiv.remove();
}

function option_modify(obj){
	var index = $("*").index(obj);
	var parentDiv = $($("*").get(index)).parent();
	var module_no = parentDiv.attr("module_no");
	var skin_no = parentDiv.attr("skin_no");
	var url = "/admin/design/option_modify"+"/"+module_no+"/"+skin_no;
	window.open(url, 'option_modify', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=600,height=350');
}

// 플러그인 옵션 수정 dialog방식
function option_modify2(obj){
	var index = $("*").index(obj);
	var parentDiv = $($("*").get(index)).parent();
	parentDiv.click(function() {
	jQuery.FrameDialog
    .create({
     url: 'http://hbuilder.com/admin/members/master_add',
     title: '플러그인 수정',
     width : 580,
     height : 400,
     draggable : false,
     resizable : false,
     buttons: { "닫기": function() { $(this).dialog("close"); } }
    })
  });	
}

// EasyWidgets 실행
$( function() {
	$.fn.EasyWidgets();
});


