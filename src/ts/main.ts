import "../css/style.css";
import { handleQuickSelects } from "./modules/handle-quick-selects";
import { initCurrentDateTime } from "./modules/current-date-time";
import { handleDateState } from "./modules/handle-date-state";
import { handleMode } from "./modules/handle-mode";
import { handleResults } from "./modules/handle-results";
import { handleQuickSelectsDialog } from "./modules/handle-quick-selects-dialog";

function init() {
  initCurrentDateTime();
  handleDateState();
  handleQuickSelects();
  handleMode();
  handleResults();
  handleQuickSelectsDialog();
}

document.addEventListener("DOMContentLoaded", init);
