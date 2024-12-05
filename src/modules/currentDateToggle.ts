export default function currentDateToggle() {
    const dateRadios = Array.from(document.querySelectorAll(".date-radio"));

    if (!dateRadios.length) {
        console.error(
            "Couldn't find the date radio's for whatever reason. Did we change the HTML?"
        );
        return;
    }

    dateRadios.forEach((radio) => {
        radio.addEventListener("change", (e) => {
            const target = e.target;

            if (!(target instanceof HTMLInputElement)) {
                console.error("Event target is not an input element");
                return;
            }

            toggleOtherDateInput(target.value === "other");
        });
    });
}

function toggleOtherDateInput(show: boolean) {
    const otherDateInputWrapper = document.getElementById("current-date-wrapper");

    if (!otherDateInputWrapper) {
        console.error("Couldn't find the current date wrapper");
        return;
    }

    if (show) {
        otherDateInputWrapper.classList.remove("hidden");
    } else {
        otherDateInputWrapper.classList.add("hidden");
    }
}
