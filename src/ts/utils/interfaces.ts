export interface QuickSelect {
  id: string;
  label: string;
  date: string;
}

export enum Events {
  QUICK_SELECT_CLICKED = "quick-select-clicked",
  MODE_CHANGED = "mode-changed",
  FROM_DATE_CHANGED = "from-date-changed",
  TO_DATE_CHANGED = "to-date-changed",
}

export interface EventData {
  [Events.QUICK_SELECT_CLICKED]: {
    quickSelect: QuickSelect;
  };
  [Events.MODE_CHANGED]: {
    mode: "since" | "until";
  };
  [Events.FROM_DATE_CHANGED]: {
    fromDate: string;
  };
  [Events.TO_DATE_CHANGED]: {
    toDate: string;
  };
}
