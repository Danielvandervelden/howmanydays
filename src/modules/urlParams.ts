import { calculateDays } from "./calculateDays/calculateDays";
import { getElements, isCustomDateSelected } from "./calculateDays/utils";
import {
    COUNTING_URL_PARAM,
    STARTING_DATE_URL_PARAM,
    TARGET_DATE_URL_PARAM,
} from "./constants";
import { toggleOtherDateInput } from "./currentDateToggle";

export function setTargetDateBasedOnUrlParams() {
    const { targetDateInput } = getElements();

    if (!targetDateInput || !(targetDateInput instanceof HTMLInputElement)) {
        console.error("Couldn't find the target date input");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);

    const targetDate = urlParams.get(TARGET_DATE_URL_PARAM);

    if (!targetDate) {
        return;
    }

    targetDateInput.value = targetDate;
}

export function setCountingBasedOnUrlParams() {
    const { quickActionToggles } = getElements();

    if (!quickActionToggles) {
        console.error("Couldn't find the quick action toggles");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);

    const counting = urlParams.get(COUNTING_URL_PARAM);

    if (!counting) {
        return;
    }

    const activeQuickActionToggle = Array.from(quickActionToggles).find((toggle) => {
        if (!(toggle instanceof HTMLInputElement)) {
            console.error("Toggle is not an instance of HTMLInputElement");
            return;
        }

        return toggle.value === counting;
    });

    if (
        !activeQuickActionToggle ||
        !(activeQuickActionToggle instanceof HTMLInputElement)
    ) {
        return;
    }

    activeQuickActionToggle.checked = true;
}

export function setStartDateBasedOnUrlParams() {
    const { currentDateInput, dateRadios } = getElements();

    if (!currentDateInput || !(currentDateInput instanceof HTMLInputElement)) {
        console.error("Couldn't find the current date input");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);

    const startDate = urlParams.get(STARTING_DATE_URL_PARAM);

    if (!startDate) {
        return;
    }

    // Select the "other" radio button
    dateRadios.find((radio) => {
        if (!(radio instanceof HTMLInputElement)) {
            console.error("Radio is not an instance of HTMLInputElement");
            return;
        }

        if (radio.value === "other") {
            radio.checked = true;
        }
    });

    toggleOtherDateInput(true);
    calculateDays();

    currentDateInput.value = startDate;
}

export function setCountingUrlParam() {
    const { quickActionToggles } = getElements();

    if (!quickActionToggles) {
        console.error("Couldn't find the quick action toggles");
        return;
    }

    const activeQuickActionToggle = Array.from(quickActionToggles).find((toggle) => {
        if (!(toggle instanceof HTMLInputElement)) {
            console.error("Toggle is not an instance of HTMLInputElement");
            return;
        }

        return toggle.checked;
    });

    if (
        !activeQuickActionToggle ||
        !(activeQuickActionToggle instanceof HTMLInputElement)
    ) {
        return;
    }

    const counting = activeQuickActionToggle.value;

    updateUrlParams({
        paramName: COUNTING_URL_PARAM,
        paramValue: counting,
    });
}

export function setStartDateUrlParam() {
    const { currentDateInput } = getElements();

    if (!currentDateInput || !(currentDateInput instanceof HTMLInputElement)) {
        console.error("Couldn't find the current date input");
        return;
    }

    const currentDate = currentDateInput.value;

    updateUrlParams({
        paramName: STARTING_DATE_URL_PARAM,
        paramValue: currentDate,
    });
}

export function setTargetDateUrlParam() {
    const { targetDateInput } = getElements();

    if (!targetDateInput || !(targetDateInput instanceof HTMLInputElement)) {
        console.error("Couldn't find the target date input");
        return;
    }

    const targetDate = targetDateInput.value;

    updateUrlParams({
        paramName: TARGET_DATE_URL_PARAM,
        paramValue: targetDate,
    });
}

export function updateUrlParams({
    paramName,
    paramValue,
}: {
    paramName: string;
    paramValue: string;
}) {
    const url = new URL(window.location.href);
    url.searchParams.set(paramName, paramValue);
    window.history.pushState({}, "", url.toString());
}

export function removeUrlParam(paramName: string) {
    const url = new URL(window.location.href);
    url.searchParams.delete(paramName);
    window.history.pushState({}, "", url.toString());
}

setCountingUrlParam();
