import {
  DEFAULT_QUICK_SELECTS,
  QUICK_SELECT_ACTIVE_CLASS,
  QUICK_SELECT_INACTIVE_CLASS,
} from "../utils/constants";
import { createQuickSelectButton } from "../utils/createQuickSelectButton";
import { events } from "../utils/events";
import { getQueryParams } from "../utils/getQueryParams";
import { Events, QuickSelect } from "../utils/interfaces";
import { localStorageService } from "../utils/localStorage.service";
import { queryParamService } from "../utils/queryParam.service";

export function handleQuickSelects() {
  const { quickSelect: quickSelectQueryParam } = getQueryParams();
  let quickSelects = localStorageService.get.quickSelects();

  if (quickSelects.length === 0) {
    /** User has never visited the website before, we're going to set the localStorage to the default quick selects    */
    localStorageService.set.quickSelects(DEFAULT_QUICK_SELECTS);
    quickSelects = DEFAULT_QUICK_SELECTS;
  }

  const quickSelectsContainer = document.getElementById("quick-select-content");
  if (!(quickSelectsContainer instanceof HTMLDivElement)) {
    console.error("Quick select container not found");
    return;
  }

  quickSelects.forEach((quickSelect) => {
    const button = createQuickSelectButton({
      quickSelect,
      isActive: quickSelect.id === quickSelectQueryParam,
    }) as HTMLButtonElement;

    button.addEventListener("click", () => {
      quickSelectButtonClickHandler(quickSelect.id);
    });

    quickSelectsContainer.appendChild(button);
  });
}

function quickSelectButtonClickHandler(id: string) {
  queryParamService.set.quickSelect(id);
  const quickSelect = localStorageService.get
    .quickSelects()
    .find((quickSelect: QuickSelect) => quickSelect.id === id);

  if (!quickSelect) {
    console.error("Quick select not found");
    return;
  }
  events.emit(Events.QUICK_SELECT_CLICKED, { quickSelect });

  const allQuickSelectButtons = document.querySelectorAll(
    ".quick-select-button"
  );

  for (const button of allQuickSelectButtons) {
    if (!(button instanceof HTMLButtonElement)) {
      continue;
    }

    if (button.getAttribute("data-id") === id) {
      button.classList.remove(QUICK_SELECT_INACTIVE_CLASS);
      button.classList.add(QUICK_SELECT_ACTIVE_CLASS);
      button.disabled = true;
    } else {
      button.classList.remove(QUICK_SELECT_ACTIVE_CLASS);
      button.classList.add(QUICK_SELECT_INACTIVE_CLASS);
      button.disabled = false;
    }
  }
}
