var p = new Ping();


p.ping("https://doh.futa.gg", function(err, data) {
  // Also display error if err is returned.
  if (err) {
    console.log(err);
    console.log("error loading resource")
    data = data + " " + err;

  }
  document.getElementById("ping-futa.gg").innerHTML = data;
});

p.ping("https://doh.futa.app", function(err, data) {
  // Also display error if err is returned.
  if (err) {
    console.log(err);
    console.log("error loading resource")
    data = data + " " + err;

  }
  document.getElementById("ping-futa.app").innerHTML = data;
});