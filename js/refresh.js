console.log(window.location.pathname);
if (window.location.pathname.indexOf("index.html")<0) {
    window.location.href = "index.html?en"+window.location.pathname.substring(1);
}
