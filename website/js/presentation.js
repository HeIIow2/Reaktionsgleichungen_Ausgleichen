console.log("presentation.js");

const presentation = document.getElementById("presentation-img");
const foil_indicator = document.getElementById("foil-indicator");
document.body.addEventListener("keyup", on_key_up);
document.body.addEventListener("mouseup", on_mouse_up);

const scroll_threshold = 500;
function on_key_up(e) {
    if (window.scrollY >= scroll_threshold){
        switch (e.key) {
            case "ArrowRight":
                next_foil();
                break
            case "d":
                next_foil();
                break
            case "D":
                next_foil();
                break

            case "ArrowLeft":
                prev_foil();
                break
            case "a":
                prev_foil();
                break
            case "A":
                prev_foil();
                break

        }
    }
}
function on_mouse_up(e) {
    if (window.scrollY >= scroll_threshold){
        switch (e.which) {
            case 1:
                next_foil();
                break
            case 3:
                e.preventDefault();
                prev_foil();
                break
        }
    }
}

const base_path = "assets/presentation/"
const foil_names = [
    "deckblatt.svg",
    "molecule description.svg",
    "molecule container.svg",
    "klassen1.PNG",
    "klassen2.PNG",
    "zeichenkette abspeichern.PNG",
    "ausgleichung.svg",
    "Gaus.webp",
    "animation 1.gif",
    "unendliche Losungen.PNG",
    "ausprobieren der Losungen.PNG",
    "Klassenstruktur zu Zeichenkette.PNG",
    "test code.PNG",
    "fails.PNG",
    "altes design.PNG",
    "Twitter_bird_logo_2012.svg.png",
    "neues Design.PNG",
    "neues Design Handy.PNG"
];

let index = 0;

function update_indicator() {
    foil_indicator.innerText = `${index + 1}/${foil_names.length}`
}

function prev_foil() {
    if (index <= 0) {
        return
    }
    index -= 1;
    presentation.src = base_path + foil_names[index].replace(" ", "%20");
    update_indicator()
}

function next_foil() {
    if (index >= foil_names.length - 1) {
        return
    }
    index += 1;
    presentation.src = base_path + foil_names[index].replace(" ", "%20");
    update_indicator()
}
