export function isCustomDateSelected() {
    const { currentDateInputWrapper, currentDateInput } = getElements();

    if (
        !currentDateInputWrapper ||
        !currentDateInput ||
        !(currentDateInput instanceof HTMLInputElement)
    ) {
        console.error("Couldn't find the current date inputs");
        return;
    }

    return (
        currentDateInputWrapper && !currentDateInputWrapper.classList.contains("hidden")
    );
}

export function getElements() {
    const currentDateInputWrapper = document.getElementById("current-date-wrapper");
    const currentDateInput = document.getElementById("current-date");
    const targetDateInput = document.getElementById("target-date");
    const dateRadios = Array.from(document.querySelectorAll(".date-radio"));
    const verbRadios = Array.from(document.querySelectorAll(".verb-radio"));
    const resultDiv = document.getElementById("result");
    const errorDiv = document.getElementById("error");
    const quickActionButtons = Array.from(
        document.querySelectorAll(".quick-action-button")
    );
    const quickActionVerbs = Array.from(document.querySelectorAll(".qc-verb-text"));
    const quickActionToggles = Array.from(
        document.querySelectorAll(".quick-action-toggle")
    );

    return {
        currentDateInputWrapper,
        currentDateInput,
        targetDateInput,
        dateRadios,
        verbRadios,
        resultDiv,
        errorDiv,
        quickActionButtons,
        quickActionToggles,
        quickActionVerbs,
    };
}

export function setErrorMessage(message: string | false) {
    const { errorDiv } = getElements();

    if (!errorDiv) {
        console.error("Couldn't find the error div");
        return;
    }

    if (!message) {
        errorDiv.innerText = "";
        return;
    }

    errorDiv.innerText = message;
}

export function setResultMessage(message: string | false) {
    const { resultDiv } = getElements();

    if (!resultDiv) {
        console.error("Couldn't find the result div");
        return;
    }

    if (!message) {
        resultDiv.innerText = "";
        return;
    }

    resultDiv.innerText = message;
}

export function resetState() {
    const { resultDiv, errorDiv } = getElements();

    if (!resultDiv || !errorDiv) {
        console.error("Couldn't find the result or error div");
        return;
    }

    setResultMessage(false);
    setErrorMessage(false);
}

export function handleVerbRadioChecking(days: number) {
    const { verbRadios } = getElements();

    if (days > 0) {
        verbRadios.find((radio) => {
            if (!(radio instanceof HTMLInputElement)) {
                console.error("Radio is not an instance of HTMLInputElement");
                return;
            }

            if (radio.value === "until") {
                radio.checked = true;
            }
        });
    } else {
        verbRadios.find((radio) => {
            if (!(radio instanceof HTMLInputElement)) {
                console.error("Radio is not an instance of HTMLInputElement");
                return;
            }

            if (radio.value === "since") {
                radio.checked = true;
            }
        });
    }
}

export const setQuickActionVerbText = () => {
    const { quickActionVerbs, quickActionToggles } = getElements();
    const quickActionVerbText = getCheckedQuickActionVerbText();

    if (!quickActionToggles.length) {
        console.error("Couldn't find the quick action toggles");
        return;
    }

    quickActionVerbs.forEach((verb, index) => {
        if (!(verb instanceof HTMLSpanElement)) {
            console.error("Verb is not an instance of HTMLSpanElement");
            return;
        }

        verb.textContent = quickActionVerbText ?? "";
    });
};

function getCheckedQuickActionVerbText() {
    const { quickActionToggles } = getElements();

    if (!quickActionToggles.length) {
        console.error("Couldn't find the quick action toggles");
        return;
    }

    const checkedToggle = Array.from(quickActionToggles).find((toggle) => {
        if (!(toggle instanceof HTMLInputElement)) {
            console.error("Toggle is not an instance of HTMLInputElement");
            return;
        }

        return toggle.checked;
    });

    if (!checkedToggle) {
        console.error("No toggle is checked");
        return;
    }

    const labelElement = checkedToggle?.nextElementSibling;

    if (!(labelElement instanceof HTMLLabelElement)) {
        console.error("Label element is not an instance of HTMLLabelElement");
        return;
    }

    return labelElement.textContent;
}
