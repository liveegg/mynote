var timerId = null;

function resizeIframe() {
	if(window.name!="") {
		iframeName = parent.document.getElementById(window.name);
		iframeHeight = document.body.scrollHeight;
		iframeName.style.height = iframeHeight + 0 + "px";

		if(iframeName.style.height!="0px") {
			if(parent.document.getElementById(window.name+"_loading"))
				parent.document.getElementById(window.name+"_loading").style.display = "none";

			if(timerId!=null) clearTimeout(timerId);
		}
		else {
			timerId = setTimeout("resizeIframe()", 0);
		}
		//if(iframeName.style.height!="0px") alert(iframeName.style.height);
	}	
}

var expdate = new Date();
expdate.setMonth(expdate.getMonth()+6);

function getCookie (sCookieName)
{
 var sName=sCookieName+"=", ichSt, ichEnd;
 var sCookie=document.cookie;

 if ( sCookie.length && ( -1 != (ichSt = sCookie.indexOf(sName)) ) )
 {
		if (-1 == ( ichEnd = sCookie.indexOf(";",ichSt+sName.length) ) )
		ichEnd = sCookie.length;
		return unescape(sCookie.substring(ichSt+sName.length,ichEnd));
 }

 return null;
}

function setCookie (sName, vValue, expdate, path)
{
 var argv = setCookie.arguments, argc = setCookie.arguments.length;
 //var sExpDate = (argc > 2) ? "; expires="+argv[2].toGMTString() : "";
 var sExpDate = (argc > 2) ? "; expires=0" : "";
 var sPath = (argc > 3) ? "; path="+argv[3] : "";
 var sDomain = (argc > 4) ? "; domain="+argv[4] : "";
 var sSecure = (argc > 5) && argv[5] ? "; secure" : "";
 document.cookie = sName + "=" + escape(vValue,0) + sExpDate + sPath + sDomain + sSecure + ";";
}

function deleteCookie (sName)
{
 document.cookie = sName + "=" + getCookie(sName) + "; expires=" + (new Date()).toGMTString() + "; path=/";
}

function paramEscape(paramValue)
{
	return encodeURIComponent(paramValue);
}

function formData2QueryString(docForm)
{	
	var submitString = '';
	var formElement = '';
	var lastElementName = '';
	var currentElementName = '';
	
	for(i = 0 ; i < docForm.elements.length ; i++)
	{
		formElement = docForm.elements[i];
		
		switch(formElement.type)
		{
			case 'text' :
			case 'select-one' :
			case 'hidden' :
			case 'password' :
			case 'textarea' :
				submitString += formElement.name + '=' + paramEscape(formElement.value) + '&';
				break;
			case 'radio' :	
				if(formElement.checked)
				{
					submitString += formElement.name + '=' + paramEscape(formElement.value) + '&';
				}
				break;
			case 'checkbox' :	
				if(formElement.checked) 
				{
					currentElementName = formElement.name;

					if(currentElementName == lastElementName)
					{
						if(submitString.lastIndexOf('&') == submitString.length - 1)
						{
							submitString = submitString.substring(0, submitString.length - 1);
						}
						submitString += ',' + paramEscape(formElement.value);
					}
					else
					{
						submitString += currentElementName + '=' + paramEscape(formElement.value); 
					}

					submitString += '&';
					lastElementName = formElement.name;
				}
				break; 
		}																										
	}
	submitString = submitString.substring(0, submitString.length - 1);
	//document.all("result").value = submitString;
	return submitString;											
}

function xmlHttpPost(actionUrl, submitParameter, resultFunction)
{
	var xmlHttpRequest = false;
	
	//IE인경우
	if(window.ActiveXObject)
	{
		xmlHttpRequest = new ActiveXObject('Microsoft.XMLHTTP');
	}
	else
	{
		xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.overrideMimeType('text/xml');
	}	
			
	xmlHttpRequest.open('POST', actionUrl, true);
	xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlHttpRequest.onreadystatechange = function() {
		if(xmlHttpRequest.readyState == 4)
		{
			switch (xmlHttpRequest.status) 
			{
				case 404:
					alert('오류: ' + actionUrl + '이 존재하지 않음');
					break;
				case 500:
					alert('오류: ' + xmlHttpRequest.responseText);
					break;
				default:
					eval(resultFunction + '(xmlHttpRequest.responseText);');
					break;		
			}			
		}
	}
	
	xmlHttpRequest.send(submitParameter);					
}								

function loginCheck(resultFunction)
{
	var phpsessid = getCookie("PHPSESSID");

	if(phpsessid!="") {
		var url = "/js/login_check.kon";
		var queryString = "phpsessid=" + phpsessid;
		xmlHttpPost(url, queryString, resultFunction);
	}
	else {
		eval(resultFunction + "('no');");
	}
}

function flash(movie_src, movie_width, movie_height, flag) {

	var tag = "";
	if(movie_height!="") movie_height = ' height="' + movie_height + '"';

	tag = '<object ' + flag + ' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="' + movie_width + '" ' + movie_height + '>';
	tag += '<param name="movie" value="' + movie_src + '">';
	tag += '<param name="menu" value="false">';
	tag += '<param name="wmode" value="transparent">';
	tag += '<embed src="' + movie_src + '" wmode="transparent" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="' + movie_width + '" ' + movie_height + '></embed>';
	tag += '</object>';

	document.write(tag);
}

function mediaplayer(movie_src, movie_width, movie_height, flag) {

//	var tag = "";
//
//	tag =	'<embed width="' + movie_width + '" height="' + movie_height + '" type="application/x-mplayer2" pluginspage="http://www.microsoft.com/windows/windowsmedia/download/" filename="' + movie_src + '" src="' + movie_src + '" Name=MediaPlayer Autostart=0 AnimationAtStart=1 Showcontrols=1 Loop=0 Showstatusbar=1 ShowDisplay=0 ShowGotoBar=0 TransparentAtStart=0 ShowPositionControls=0 ShowTracker=1 ShowCaptioning=0></embed>';
//
//	document.write(tag);

	var WMP7;

	if(window.ActiveXObject)
	{
			WMP7 = new ActiveXObject("WMPlayer.OCX.7");
	}
	else if (window.GeckoActiveXObject)
	{
			WMP7 = new GeckoActiveXObject("WMPlayer.OCX.7");
	}

	// Windows Media Player 7 Code
	if ( WMP7 )
	{
			document.write ('<OBJECT ID=MediaPlayer ');
			document.write (' CLASSID=CLSID:6BF52A52-394A-11D3-B153-00C04F79FAA6');
			document.write (' standby="Loading Microsoft Windows Media Player components..."');
			document.write (' TYPE="application/x-oleobject" width="' + movie_width + '" height="' + movie_height + '">');
			document.write ('<PARAM NAME="url" VALUE="' + movie_src + '">');
			document.write ('<PARAM NAME="AutoStart" VALUE="false">');
			document.write ('<PARAM NAME="Showcontrols" VALUE="1">');
			document.write ('<PARAM NAME="uiMode" VALUE="mini">');
			document.write ('</OBJECT>');
	}

	// Windows Media Player 6.4 Code
	else
	{
			//IE Code
			document.write ('<OBJECT ID=MediaPlayer ');
			document.write ('CLASSID=CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95 ');
			document.write ('CODEBASE=http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=6,4,5,715 ');
			document.write ('standby="Loading Microsoft Windows Media Player components..." ');
			document.write ('TYPE="application/x-oleobject" width="' + movie_width + '" height="' + movie_height + '">');
			document.write ('<PARAM NAME="FileName" VALUE="' + movie_src + '">');
			document.write ('<PARAM NAME="AutoStart" VALUE="false">');
			document.write ('<PARAM NAME="Showcontrols" VALUE="true">');

			//Netscape code
			document.write ('		<Embed type="application/x-mplayer2"');
			document.write ('			pluginspage="http://www.microsoft.com/windows/windowsmedia/"');
			document.write ('			filename="' + movie_src + '"');
			document.write ('			src="' + movie_src + '"');
			document.write ('			Name=MediaPlayer');
			document.write ('			ShowControls=1');
			document.write ('			ShowDisplay=1');
			document.write ('			ShowStatusBar=1');
			document.write ('			width=' + movie_width);
			document.write ('			height=' + movie_height + '>');
			document.write ('		</embed>');

			document.write ('</OBJECT>');
	}
}

function OpenPopup(url,width,height,left,top)
{
	if(url)
	{
		var winName = "Popup";
		newWindow = window.open(url,winName,'width='+width+', height='+height+',left='+left+',top='+top+', toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=yes, scrollbars=yes, copyhistory=no');
	}
}

function calculateBytes(szValue)
{
	var tcount = 0;
	var tmpStr = new String(szValue);
	var temp = tmpStr.length;
	var onechar;

	for (i=0;i<temp;i++) {
		onechar = tmpStr.charAt(i);

		if (escape(onechar).length > 4)
			tcount += 2;
		else
			tcount += 1;
	}

	return tcount;
}

function worldMapToggle_ext(Obj, ele)
{
	var tmp = 'http://world.koderi.net/images/open_map.gif';
	var openImg = tmp+'open_map.gif';
	var closeImg = tmp+'open_map.gif';
	Obj.src = (document.getElementById(ele).style.display=='none')?closeImg:openImg;
	displayToggle(ele, null);
}

function toggleMenu(sublink) {
	 if(document.getElementById(sublink).style.visibility == 'hidden') {
		  document.getElementById(sublink).style.visibility = 'visible';
		  document.getElementById(sublink).style.zIndex= '100000';
	 } else  {
		  document.getElementById(sublink).style.visibility = 'hidden';
		  document.getElementById(sublink).style.zIndex= '1';
	 }
}