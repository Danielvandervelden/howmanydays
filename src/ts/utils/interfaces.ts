export interface QuickSelect {
  id: string;
  label: string;
  date: string;
}

export enum Events {
  QUICK_SELECT_CLICKED = "quick-select-clicked",
  MODE_CHANGED = "mode-changed",
}

export interface EventData {
  [Events.QUICK_SELECT_CLICKED]: {
    quickSelect: QuickSelect;
  };
  [Events.MODE_CHANGED]: {
    mode: "since" | "until";
  };
}
