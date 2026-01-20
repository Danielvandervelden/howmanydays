import {
  QUICK_SELECT_ACTIVE_CLASS,
  QUICK_SELECT_INACTIVE_CLASS,
} from "./constants";
import { QuickSelect } from "./interfaces";

export function createQuickSelectButton({
  quickSelect,
  isActive,
}: {
  quickSelect: QuickSelect;
  isActive: boolean;
}): HTMLButtonElement {
  const button = document.createElement("button");
  button.setAttribute("data-id", quickSelect.id);
  button.classList.add("quick-select-button");
  button.classList.add(
    isActive ? QUICK_SELECT_ACTIVE_CLASS : QUICK_SELECT_INACTIVE_CLASS
  );
  button.disabled = isActive;
  button.setAttribute("data-date", quickSelect.date);
  button.textContent = quickSelect.label;
  return button;
}
