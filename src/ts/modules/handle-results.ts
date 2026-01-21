import dayjs from "dayjs";
import { getQueryParams } from "../utils/getQueryParams";
import { localStorageService } from "../utils/localStorage.service";
import { Events, QuickSelect } from "../utils/interfaces";
import { events } from "../utils/events";

export function handleResults() {
  events.on(Events.QUICK_SELECT_CLICKED, calculateDaysResult);
  events.on(Events.MODE_CHANGED, calculateDaysResult);
  events.on(Events.FROM_DATE_CHANGED, calculateDaysResult);
  events.on(Events.TO_DATE_CHANGED, calculateDaysResult);

  calculateDaysResult();
}

function calculateDaysResult() {
  const {
    fromDate: fromDateQueryParam,
    toDate: toDateQueryParam,
    mode,
    quickSelect: quickSelectQueryParam,
  } = getQueryParams();

  if (!fromDateQueryParam || !toDateQueryParam || !mode) {
    console.error("From date, to date or mode not found");
    return;
  }

  const fromDate = dayjs(fromDateQueryParam);
  const toDate = dayjs(toDateQueryParam);

  const resultsDiv = document.getElementById("days-result");

  const differenceInDays = fromDate.diff(toDate, "day");

  if (resultsDiv) {
    resultsDiv.textContent = Math.abs(differenceInDays).toString();
  }

  const quickSelectResultDiv = document.getElementById("quick-select-result");
  const quickSelectsObject = localStorageService.get.quickSelects();
  const quickSelect = quickSelectsObject.find(
    (quickSelect: QuickSelect) => quickSelect.id === quickSelectQueryParam
  );

  if (!quickSelect) {
    console.error("Quick select not found");
    return;
  }

  if (quickSelectResultDiv) {
    quickSelectResultDiv.textContent = `${mode} ${quickSelect.label}`;
  }
}
