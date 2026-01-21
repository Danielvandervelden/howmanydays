export interface QuickSelect {
  id: string;
  label: string;
  date: string;
  type: "relative" | "absolute";
}

export enum Events {
  QUICK_SELECT_CLICKED = "quick-select-clicked",
  MODE_CHANGED = "mode-changed",
  ENABLE_MODE_CONTROLS = "enable-mode-controls",
  FROM_DATE_CHANGED = "from-date-changed",
  TO_DATE_CHANGED = "to-date-changed",
  QUICK_SELECT_DELETED = "quick-select-deleted",
  QUICK_SELECT_ADDED = "quick-select-added",
  QUICK_SELECT_REMOVED_FROM_URL = "quick-select-removed-from-url",
}

export interface EventData {
  [Events.ENABLE_MODE_CONTROLS]: {
    shouldEnable: boolean;
  };
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
  [Events.QUICK_SELECT_DELETED]: {
    id: string;
  };
  [Events.QUICK_SELECT_ADDED]: {
    quickSelect: QuickSelect;
  };
  [Events.QUICK_SELECT_REMOVED_FROM_URL]: void;
}
