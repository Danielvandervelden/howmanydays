import { QuickSelect } from "./interfaces";

export const QUERY_PARAMS = {
  FROM_DATE: "fromDate",
  TO_DATE: "toDate",
  MODE: "mode",
  QUICK_SELECT: "quickSelect",
};

export const LOCAL_STORAGE_KEYS = {
  QUICK_SELECTS: "quickSelects",
};

export const DEFAULT_QUICK_SELECTS: QuickSelect[] = [
  {
    id: "christmas",
    label: "Christmas",
    date: "12-25",
  },
  {
    id: "halloween",
    label: "Halloween",
    date: "10-31",
  },
  {
    id: "thanksgiving",
    label: "Thanksgiving",
    date: "11-28",
  },
  {
    id: "new-year",
    label: "New Year",
    date: "01-01",
  },
  {
    id: "easter",
    label: "Easter",
    date: "04-04",
  },
  {
    id: "valentines",
    label: "Valentine's Day",
    date: "02-14",
  },
  {
    id: "spring",
    label: "Spring",
    date: "03-20",
  },
  {
    id: "summer",
    label: "Summer",
    date: "06-21",
  },
  {
    id: "autumn",
    label: "Fall",
    date: "09-23",
  },
  {
    id: "winter",
    label: "Winter",
    date: "12-21",
  },
];

export const QUICK_SELECT_ACTIVE_CLASS = "btn-primary";
export const QUICK_SELECT_INACTIVE_CLASS = "btn-secondary";
