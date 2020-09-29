var p = new Ping();

var pingTest = [
    "https://doh.futa.gg",
    "https://doh.futa.app",
    "https://dot.futa.gg"
]
// -1 dark
// < 100 primary
// > 100 < 200 warning
// > 200 danger
function colored(e){
    let result;
    if (e<=100){
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
    url = new URL(pingTest[i])
    console.log(url.host)
    let pingt;
    p.ping(url.origin, function (err, data) {
        console.log(data);
        var pingt = data;
        if (err) {
            data = -1;
        }
    });

    template = `<article class="tile is-child notification ${colored(pingt)}" id="${url.host}">
                <p class="title">${url.origin} -
                <span id="ping-${url.host}"></span>ms
                </p>
            </article>`
    document.getElementById("pingbox").innerHTML += template;

    
}
