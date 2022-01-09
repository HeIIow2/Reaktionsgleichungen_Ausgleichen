let next_id = 0;

function spawn_alert(msg, time_till_collapse, kind) {
    const kind_of_alerts = [
        "primary", "secondary", "success", "danger", "warning", "info", "light", "dark"
    ];

    const alert_str =
        `<div class="-alert hide" id="${next_id}">
            <div class="container alert alert-${kind_of_alerts[kind]}" role="alert">
                ${msg}
            </div>
        </div>`

    document.body.innerHTML += alert_str;
    const alert = document.getElementById(next_id);
    next_id += 1;
    next_id = next_id % 1000;

    setTimeout(function () {
        alert.className = "-alert";

        setTimeout(function () {
            alert.className = "-alert hide-height";

            setTimeout(function () {
                alert.remove();
            }, 500);
        }, time_till_collapse + 500);
    }, 50);
}