import {
    setCalculationListeners,
    setQuickDateCheckListeners,
} from "./modules/calculateDays/calculateDays";
import currentDateToggle from "./modules/currentDateToggle";
import { updateTime } from "./modules/updateTime";

function init() {
    updateTime();
    setInterval(updateTime, 1000);

    currentDateToggle();

    setCalculationListeners();
    setQuickDateCheckListeners();
}

document.addEventListener("DOMContentLoaded", init);
