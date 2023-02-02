
var userLang = navigator.language || navigator.userLanguage; 
const queryString = window.location.search;

function loadPage(href) {
	
	//console.log(href);
	jQuery.ajax({
		url:href,
		type:'GET',
		dataType:'html',
		success: function(data){
			$('#messagecont').html($(data));
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		}
	 });
	 //$("#messagecont").load(openCustomLink("intro"));
}

$(document).ready(
		function(){
			jQuery('.menulink').css("font-weight", "normal");
			if (queryString[0] === '?' && queryString.substring(1).match(/^[a-z.-]+$/)) {
				userLang = queryString.substring(1,3);
				setUserLang(userLang);
				loadPage(openCustomLink(queryString.substring(1)));
				document.getElementById(queryString.substring(3)).style = "font-weight: bold";
				console.log("request page: ", queryString.substring(1));
			} else {
				if (userLang) {
					userLang = userLang.substring(0,2);
				} else {
					userLang = "en";
				}
				switch(userLang) {
					case "nl":
					case "en":
					case "ba":
					case "cn":
					  break;
					default:
					  userLang = "en";
				  }
				setUserLang(userLang);
				loadPage(openCustomLink(userLang+"intro"));
				console.log("load default home page for lang ", userLang);
			}
		}
	);

function setUserLang(requestedLang) {
	userLang = requestedLang;	
	if (userLang.indexOf("cn")>-1) {
		jQuery("#softdev").html("软件 开发");
		jQuery("#infosec").html("信息 安全");
		jQuery("#perftune").html("性能 调优");
		jQuery("#depauto").html("部署 自动化");
		jQuery("#intro").html("关于 Zubcevic.com");
		jQuery("#privacy").html("隐私 声明");
		jQuery("#covid").html("Covid dashboard");
	} else if (userLang.indexOf("nl")>-1) {
		jQuery("#softdev").html("Software ontwikkeling");
		jQuery("#infosec").html("Informatie beveiliging");
		jQuery("#perftune").html("Performance tuning");
		jQuery("#depauto").html("Deployment automation");
		jQuery("#intro").html("Over Zubcevic.com");
		jQuery("#privacy").html("Privacy statement");
		jQuery("#covid").html("Covid dashboard");
	} else if (userLang.indexOf("ba")>-1) {
		jQuery("#softdev").html("Razvoj aplikacija");
		jQuery("#infosec").html("Sigurnost informacija");
		jQuery("#perftune").html("Podešavanje Performansi");
		jQuery("#depauto").html("Automatizacija Primene");
		jQuery("#intro").html("About Zubcevic.com");
		jQuery("#privacy").html("Privacy statement");
		jQuery("#covid").html("Covid dashboard");
	} else {
		jQuery("#softdev").html("Software development");
		jQuery("#infosec").html("Information security");
		jQuery("#perftune").html("Performance tuning");
		jQuery("#depauto").html("Deployment automation");
		jQuery("#intro").html("About Zubcevic.com");
		jQuery("#privacy").html("Privacy statement");
		jQuery("#covid").html("Covid dashboard");
	}
	//jQuery('#intro-link').css("background-color", "yellow");
	return false;
}

function getUserLang() {	
	if (userLang.indexOf("cn")>-1) {
		return "cn";
	} else if (userLang.indexOf("nl")>-1) {
		return "nl";	
	} else if (userLang.indexOf("ba")>-1) {
		return "ba";	
	} else {
		return "en";
	}
}
	
function openCustomLink(categoryName) {
	userLang = categoryName.substring(0,2);
	var realCategory = categoryName.substring(2);
	var customLink = realCategory+"_"+getUserLang()+".html";
	if (realCategory.indexOf(".html")>-1) {
		customLink = realCategory;
	}
	if (realCategory =='privacy' && (getUserLang()!='nl'||getUserLang()!='')) {
		customLink = realCategory + ".html";
	}
	console.log('openCustomeLink: ', customLink);
	return customLink;
}

