import dayjs from "dayjs";
import { events } from "../utils/events";
import { getElements } from "../utils/getElements";
import { getQueryParams } from "../utils/getQueryParams";
import { Events, QuickSelect } from "../utils/interfaces";
import { queryParamService } from "../utils/queryParam.service";
import { localStorageService } from "../utils/localStorage.service";

export function handleDateState() {
  /** Get things from query params */
  const { fromDate: fromDateQueryParam, toDate: toDateQueryParam } =
    getQueryParams();

  if (!fromDateQueryParam) {
    queryParamService.set.fromDate(new Date().toISOString().split("T")[0]);
  }

  if (!toDateQueryParam) {
    queryParamService.set.toDate(new Date().toISOString().split("T")[0]);
  }

  const { fromDateInput, toDateInput, fromTodayLink, toTodayLink } =
    getElements();

  if (
    !(fromDateInput instanceof HTMLInputElement) ||
    !(toDateInput instanceof HTMLInputElement) ||
    !(fromTodayLink instanceof HTMLAnchorElement) ||
    !(toTodayLink instanceof HTMLAnchorElement)
  ) {
    console.error(
      "From date, to date input, from today link or to today link not found"
    );
    return;
  }

  fromDateInput.value = fromDateQueryParam
    ? new Date(fromDateQueryParam).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];
  toDateInput.value = toDateQueryParam
    ? new Date(toDateQueryParam).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  fromTodayLink.addEventListener("click", (e) => {
    e.preventDefault();
    fromDateInput.value = dayjs().format("YYYY-MM-DD");
    queryParamService.set.fromDate(fromDateInput.value);
    events.emit(Events.FROM_DATE_CHANGED, { fromDate: fromDateInput.value });
    events.emit(Events.ENABLE_MODE_CONTROLS, { shouldEnable: true });
    queryParamService.remove.quickSelect();
  });

  toTodayLink.addEventListener("click", (e) => {
    e.preventDefault();
    toDateInput.value = dayjs().format("YYYY-MM-DD");
    queryParamService.set.toDate(toDateInput.value);
    events.emit(Events.TO_DATE_CHANGED, { toDate: toDateInput.value });
    events.emit(Events.ENABLE_MODE_CONTROLS, { shouldEnable: true });
    events.emit(Events.QUICK_SELECT_REMOVED_FROM_URL);
    queryParamService.remove.quickSelect();
  });

  fromDateInput.addEventListener("click", () => {
    events.emit(Events.ENABLE_MODE_CONTROLS, { shouldEnable: true });
    events.emit(Events.QUICK_SELECT_REMOVED_FROM_URL);
    queryParamService.remove.quickSelect();
  });

  toDateInput.addEventListener("click", () => {
    events.emit(Events.ENABLE_MODE_CONTROLS, { shouldEnable: true });
    events.emit(Events.QUICK_SELECT_REMOVED_FROM_URL);
    queryParamService.remove.quickSelect();
  });

  fromDateInput.addEventListener("change", (e) => {
    if (!(e.target instanceof HTMLInputElement)) {
      console.error("From date input not found");
      return;
    }

    queryParamService.set.fromDate(e.target.value);
    events.emit(Events.FROM_DATE_CHANGED, { fromDate: e.target.value });
  });

  toDateInput.addEventListener("change", (e) => {
    if (!(e.target instanceof HTMLInputElement)) {
      console.error("To date input not found");
      return;
    }

    queryParamService.set.toDate(e.target.value);
    events.emit(Events.TO_DATE_CHANGED, { toDate: e.target.value });
  });

  events.on(Events.QUICK_SELECT_CLICKED, recalculateDates);
  events.on(Events.MODE_CHANGED, recalculateDates);
}

function recalculateDates() {
  const {
    mode,
    fromDate: fromDateQueryParam,
    quickSelect: quickSelectQueryParam,
  } = getQueryParams();
  const { fromDateInput, toDateInput } = getElements();
  const quickSelect = localStorageService.get
    .quickSelects()
    .find(
      (quickSelect: QuickSelect) => quickSelect.id === quickSelectQueryParam
    );

  if (
    !(fromDateInput instanceof HTMLInputElement) ||
    !(toDateInput instanceof HTMLInputElement)
  ) {
    console.error("From date or to date input not found");
    return;
  }

  if (!quickSelect) {
    console.error(
      "Quick select in localstorage not found to recalculate dates"
    );
    return;
  }

  /** Check if the quick select date is relative (meaning it has no year) */
  const quickSelectDateIsRelative = quickSelect.date.match(/^\d{2}-\d{2}$/);

  if (quickSelectDateIsRelative) {
    if (mode === "since") {
      const fromDate = dayjs(fromDateQueryParam);
      const quickSelectDate = dayjs(
        `${quickSelect.date}-${fromDate.year()}`,
        "DD-MM-YYYY"
      );

      if (quickSelectDate.isBefore(fromDate)) {
        toDateInput.value = quickSelectDate.format("YYYY-MM-DD");
        queryParamService.set.toDate(toDateInput.value);
      } else {
        toDateInput.value = quickSelectDate
          .subtract(1, "year")
          .format("YYYY-MM-DD");
        queryParamService.set.toDate(toDateInput.value);
      }
    }

    if (mode === "until") {
      const fromDate = dayjs(fromDateQueryParam);
      const quickSelectDate = dayjs(
        `${quickSelect.date}-${fromDate.year()}`,
        "DD-MM-YYYY"
      );

      if (quickSelectDate.isAfter(fromDate)) {
        toDateInput.value = quickSelectDate.format("YYYY-MM-DD");
        queryParamService.set.toDate(toDateInput.value);
      } else {
        toDateInput.value = quickSelectDate.add(1, "year").format("YYYY-MM-DD");
        queryParamService.set.toDate(toDateInput.value);
      }
    }
  } else {
    toDateInput.value = quickSelect.date;
    queryParamService.set.toDate(toDateInput.value);
  }
}
