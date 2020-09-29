p = new Ping();

var pingTest = [
    "https://doh.futa.gg",
    "https://doh.futa.app",
    "https://dot.futa.gg",
]

// -1 dark
// < 100 primary
// > 100 < 200 warning
// > 200 danger
function colored(e){
    let result;
    if (e>0 & e<=100){
        result = "is-primary";
    } 
    else if (e>100 & e<=200){
        result = "is-warning";
    }
    else if (e>=300){
        result = "is-danger";
    }
    else if (e<0){
        result = "is-dark";
    }
    return result;
}

for (i = 0; i < pingTest.length; i++) {
    let url = new URL(pingTest[i])
    p.ping(url.origin, function (err, data) {
        if (err) {
            data = -1;
        }
        let template = `<article class="tile is-child notification ${colored(data)}" id="${url.host}">
                <p class="title">${url.host} -
                <span id="ping-${url.host}">${data}</span>ms
                </p>
            </article>`
        document.getElementById("pingbox").innerHTML += template;
    });
}
