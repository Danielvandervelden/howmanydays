import { setCalculationListeners } from "./modules/calculateDays/calculateDays";
import currentDateToggle from "./modules/currentDateToggle";
import { updateTime } from "./modules/updateTime";

function init() {
    updateTime();
    setInterval(updateTime, 1000);

    currentDateToggle();

    setCalculationListeners();
}

document.addEventListener("DOMContentLoaded", init);
