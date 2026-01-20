import "../css/style.css";
import { handleQuickSelects } from "./modules/handle-quick-selects";
import { initCurrentDateTime } from "./modules/current-date-time";
import { handleDateState } from "./modules/handle-date-state";
import { handleMode } from "./modules/handle-mode";

function init() {
  initCurrentDateTime();
  handleDateState();
  handleQuickSelects();
  handleMode();
}

document.addEventListener("DOMContentLoaded", init);
