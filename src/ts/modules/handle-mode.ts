import dayjs from "dayjs";
import { events } from "../utils/events";
import { getQueryParams } from "../utils/getQueryParams";
import { Events, QuickSelect } from "../utils/interfaces";
import { queryParamService } from "../utils/queryParam.service";
import { getElements } from "../utils/getElements";
import { localStorageService } from "../utils/localStorage.service";

export function handleMode() {
  const { mode: modeQueryParam } = getQueryParams();

  if (!modeQueryParam) {
    queryParamService.set.mode("until");
  }

  const { modeToggleContainer } = getElements();

  if (!(modeToggleContainer instanceof HTMLDivElement)) {
    console.error("Mode toggle container not found");
    return;
  }

  events.on(
    Events.QUICK_SELECT_CLICKED,
    checkActiveQuickSelectToDetermineModeState
  );

  events.on(Events.ENABLE_MODE_CONTROLS, ({ shouldEnable }) => {
    enableModeControls(shouldEnable);
  });

  const { modeToggleInputs } = getElements();

  for (const modeToggleInput of modeToggleInputs) {
    if (!(modeToggleInput instanceof HTMLInputElement)) {
      console.error("Mode toggle input not found");
      return;
    }

    modeToggleInput.addEventListener("change", (e) => {
      if (!(e.target instanceof HTMLInputElement)) {
        console.error("Mode toggle input not found");
        return;
      }

      if (e.target.value !== "since" && e.target.value !== "until") {
        console.error("Invalid mode");
        return;
      }

      queryParamService.set.mode(e.target.value);
      events.emit(Events.MODE_CHANGED, { mode: e.target.value });
    });
  }

  checkActiveQuickSelectToDetermineModeState();
}

function checkActiveQuickSelectToDetermineModeState() {
  const { fromDate: fromDateQueryParam, quickSelect: quickSelectQueryParam } =
    getQueryParams();
  const quickSelect = localStorageService.get
    .quickSelects()
    .find((qs: QuickSelect) => qs.id === quickSelectQueryParam);

  if (!quickSelect) {
    console.error("Quick select not found");
    return;
  }

  if (quickSelect.type === "absolute") {
    enableModeControls(false);
    const fromInputDate = dayjs(fromDateQueryParam);
    const quickSelectDate = dayjs(quickSelect.date);

    if (quickSelectDate.isAfter(fromInputDate)) {
      (document.getElementById("until-radio") as HTMLInputElement).checked =
        true;
      (document.getElementById("since-radio") as HTMLInputElement).checked =
        false;
      events.emit(Events.MODE_CHANGED, { mode: "until" });
      queryParamService.set.mode("until");
    } else {
      (document.getElementById("since-radio") as HTMLInputElement).checked =
        true;
      (document.getElementById("until-radio") as HTMLInputElement).checked =
        false;
      events.emit(Events.MODE_CHANGED, { mode: "since" });
      queryParamService.set.mode("since");
    }
  } else {
    enableModeControls(true);
  }
}

function enableModeControls(shouldEnable: boolean) {
  const { modeToggleInputs, modeToggleContainer } = getElements();

  if (!(modeToggleInputs instanceof NodeList)) {
    console.error("Mode toggle inputs not found");
    return;
  }

  if (!(modeToggleContainer instanceof HTMLDivElement)) {
    console.error("Mode toggle container not found");
    return;
  }

  if (!shouldEnable) {
    modeToggleContainer.classList.add("opacity-50");
    modeToggleContainer.classList.add("pointer-events-none");
  } else {
    modeToggleContainer.classList.remove("opacity-50");
    modeToggleContainer.classList.remove("pointer-events-none");
  }

  for (const modeToggleInput of modeToggleInputs) {
    modeToggleInput.disabled = !shouldEnable;
  }
}
