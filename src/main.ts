import {
    calculateDays,
    setCalculationListeners,
    setQuickDateCheckListeners,
} from "./modules/calculateDays/calculateDays";
import currentDateToggle from "./modules/currentDateToggle";
import {
    setCountingBasedOnUrlParams,
    setStartDateBasedOnUrlParams,
    setTargetDateBasedOnUrlParams,
} from "./modules/urlParams";
import { updateTime } from "./modules/updateTime";

function init() {
    updateTime();
    setInterval(updateTime, 1000);

    currentDateToggle();

    setCalculationListeners();
    setQuickDateCheckListeners();
    setTargetDateBasedOnUrlParams();
    setCountingBasedOnUrlParams();
    setStartDateBasedOnUrlParams();
    calculateDays();
}

document.addEventListener("DOMContentLoaded", init);
