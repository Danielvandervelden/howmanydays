import dayjs from "dayjs";
import {
    getElements,
    handleVerbRadioChecking,
    isCustomDateSelected,
    resetState,
    setErrorMessage,
    setResultMessage,
} from "./utils";

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

    targetDateInput.addEventListener("change", calculateDays);
    currentDateInput.addEventListener("change", calculateDays);
    dateRadios.forEach((radio) => {
        radio.addEventListener("change", calculateDays);
    });
    verbRadios.forEach((radio) => {
        radio.addEventListener("change", calculateDays);
    });
};

const calculateDays = () => {
    resetState();
    const isCustomDateEnabled = isCustomDateSelected();
    const { resultDiv, currentDateInput, verbRadios } = getElements();

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
    const { currentDateInput, targetDateInput, verbRadios } = getElements();

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

calculateDays();
