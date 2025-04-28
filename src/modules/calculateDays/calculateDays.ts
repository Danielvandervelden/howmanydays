import dayjs from "dayjs";
import {
    getElements,
    handleVerbRadioChecking,
    isCustomDateSelected,
    resetState,
    setErrorMessage,
    setQuickActionVerbText,
    setResultMessage,
} from "./utils";
import {
    removeUrlParam,
    setCountingUrlParam,
    setStartDateUrlParam,
    setTargetDateUrlParam,
} from "../urlParams";
import {
    COUNTING_URL_PARAM,
    STARTING_DATE_URL_PARAM,
    TARGET_DATE_URL_PARAM,
} from "../constants";

export const setCalculationListeners = () => {
    const { currentDateInput, targetDateInput, dateRadios, verbRadios } = getElements();

    if (!targetDateInput || !currentDateInput) {
        console.error("Couldn't find the date inputs");
        return;
    }

    if (!dateRadios.length) {
        console.error(
            "Couldn't find the date radio's for whatever reason. Did we change the HTML?"
        );
        return;
    }

    if (!verbRadios.length) {
        console.error(
            "Couldn't find the verb radio's for whatever reason. Did we change the HTML?"
        );
        return;
    }

    targetDateInput.addEventListener("change", () => {
        calculateDays();
        setTargetDateUrlParam();
    });
    currentDateInput.addEventListener("change", () => {
        calculateDays();
    });
    dateRadios.forEach((radio) => {
        radio.addEventListener("change", calculateDays);
    });
    verbRadios.forEach((radio) => {
        radio.addEventListener("change", calculateDays);
    });
};

export const setQuickDateCheckListeners = () => {
    const { quickActionButtons, quickActionToggles, quickActionVerbs } = getElements();

    if (!quickActionButtons.length) {
        console.error("Couldn't find the quick action buttons");
        return;
    }

    if (!quickActionToggles.length) {
        console.error("Couldn't find the quick action toggles");
        return;
    }

    if (!quickActionVerbs.length) {
        console.error("Couldn't find the quick action verbs");
        return;
    }

    setQuickActionVerbText();

    quickActionToggles.forEach((toggle) => {
        toggle.addEventListener("change", () => {
            setCountingUrlParam();
            setQuickActionVerbText();
            removeUrlParam(STARTING_DATE_URL_PARAM);
            removeUrlParam(TARGET_DATE_URL_PARAM);
            calculateDays();
        });
    });

    quickActionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button instanceof HTMLButtonElement) {
                handleQuickActionClick(button);
            }
        });
    });
};

export const calculateDays = () => {
    resetState();
    const isCustomDateEnabled = isCustomDateSelected();
    const { resultDiv, verbRadios } = getElements();

    if (!resultDiv) {
        console.error("Couldn't find the result div");
        return;
    }

    if (!verbRadios.length) {
        console.error("Couldn't find the verb radios");
        return;
    }

    /**
     * Calculate the days between target date and custom selected date
     */
    if (isCustomDateEnabled) {
        calculateDaysBetweenSelectedDateAndTargetDate();
        return;
    }

    /**
     * Calculate the days between target date and now
     */
    calculateDaysBetweenNowAndTargetDate();
};

function calculateDaysBetweenNowAndTargetDate() {
    const { targetDateInput } = getElements();

    if (!targetDateInput || !(targetDateInput instanceof HTMLInputElement)) {
        console.error("Couldn't find the target date input or it's not an input element");
        return;
    }

    const targetDate = dayjs(targetDateInput.value);
    const currentDate = dayjs();
    const days = Math.ceil(targetDate.diff(currentDate, "day", true));
    const additionalText = days > 0 ? "to go" : "ago";
    setResultMessage(`${Math.abs(days)} days ${additionalText}`);

    handleVerbRadioChecking(days);
}

function calculateDaysBetweenSelectedDateAndTargetDate() {
    const { currentDateInput, targetDateInput } = getElements();

    if (!(currentDateInput instanceof HTMLInputElement)) {
        console.error("currentDateInput is not an instance of HTMLInputElement");
        return;
    }

    if (!currentDateInput.value.length) {
        setErrorMessage('Please enter a valid date in the "other" date field');
    }

    if (!targetDateInput || !(targetDateInput instanceof HTMLInputElement)) {
        console.error("Couldn't find the target date input or it's not an input element");
        return;
    }

    setStartDateUrlParam();

    const targetDate = dayjs(targetDateInput.value);
    const currentDate = dayjs(currentDateInput.value);

    if (!currentDate.isValid()) {
        setErrorMessage('Please enter a valid date in the "other" date field');
        return;
    }

    const days = Math.ceil(targetDate.diff(currentDate, "day", true));
    const additionalText = days > 0 ? "to go" : "ago";
    setResultMessage(`${Math.abs(days)} days ${additionalText}`);

    handleVerbRadioChecking(days);
}

const handleQuickActionClick = (button: HTMLButtonElement) => {
    const { targetDateInput, quickActionToggles, resultDiv } = getElements();

    if (!targetDateInput || !(targetDateInput instanceof HTMLInputElement)) {
        console.error("Couldn't find the target date input");
        return;
    }

    const activeQcVerb = quickActionToggles.find((toggle) => {
        if (!(toggle instanceof HTMLInputElement)) {
            return false;
        }

        return toggle.checked;
    });

    if (!(activeQcVerb instanceof HTMLInputElement)) {
        console.error("Couldn't find the active quick action verb");
        return;
    }

    if (activeQcVerb.value === "until-qc") {
        const targetInputDate = button.getAttribute("data-date");
        const currentDate = dayjs();
        const formattedTargetInputDateForThisYear = dayjs(
            `${currentDate.year()}-${targetInputDate}`
        );
        const hasPassed = currentDate.isAfter(formattedTargetInputDateForThisYear);

        if (hasPassed) {
            targetDateInput.value = `${currentDate.year() + 1}-${targetInputDate}`;
        } else {
            targetDateInput.value = `${currentDate.year()}-${targetInputDate}`;
        }
    } else {
        const targetInputDate = button.getAttribute("data-date");
        const currentDate = dayjs();
        const formattedTargetInputDateForThisYear = dayjs(
            `${currentDate.year()}-${targetInputDate}`
        );

        const isLastYear = currentDate.isBefore(formattedTargetInputDateForThisYear);

        if (isLastYear) {
            targetDateInput.value = `${currentDate.year() - 1}-${targetInputDate}`;
        } else {
            targetDateInput.value = `${currentDate.year()}-${targetInputDate}`;
        }
    }

    calculateDays();
    setTargetDateUrlParam();
    resultDiv?.scrollIntoView({ behavior: "smooth" });
};

calculateDays();
