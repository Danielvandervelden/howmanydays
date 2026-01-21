import { localStorageService } from "../utils/localStorage.service";
import { QuickSelect, Events } from "../utils/interfaces";
import { events } from "../utils/events";

export function handleQuickSelectsDialog() {
  const manageButton = document.querySelector(
    "#quick-select-header button"
  ) as HTMLButtonElement;
  const closeButton = document.getElementById(
    "close-manage-quick-selects-dialog"
  ) as HTMLButtonElement;
  const backdrop = document.getElementById("backdrop") as HTMLDivElement;
  const dialog = document.getElementById(
    "manage-quick-selects-dialog"
  ) as HTMLDialogElement;
  const form = document.getElementById(
    "add-quick-select-form"
  ) as HTMLFormElement;

  if (!manageButton || !closeButton || !backdrop || !dialog || !form) {
    console.error("Required dialog elements not found");
    return;
  }

  manageButton.addEventListener("click", openDialog);
  closeButton.addEventListener("click", closeDialog);
  backdrop.addEventListener("click", closeDialog);
  form.addEventListener("submit", handleAddQuickSelect);

  // Handle date type toggle
  const dateTypeInputs = dialog.querySelectorAll('input[name="date-type"]');
  dateTypeInputs.forEach((input) => {
    input.addEventListener("change", handleDateTypeChange);
  });
}

function openDialog() {
  const backdrop = document.getElementById("backdrop") as HTMLDivElement;
  const dialog = document.getElementById(
    "manage-quick-selects-dialog"
  ) as HTMLDialogElement;

  if (!backdrop || !dialog) return;

  // Show elements
  backdrop.classList.remove("hidden");
  dialog.classList.remove("hidden");
  dialog.classList.add("block");

  // Trigger reflow to ensure transition works
  void backdrop.offsetWidth;
  void dialog.offsetWidth;

  // Fade in
  backdrop.classList.remove("opacity-0");
  dialog.classList.remove("opacity-0");

  // Render quick selects
  renderQuickSelects();
}

function closeDialog() {
  const backdrop = document.getElementById("backdrop") as HTMLDivElement;
  const dialog = document.getElementById(
    "manage-quick-selects-dialog"
  ) as HTMLDialogElement;

  if (!backdrop || !dialog) return;

  // Fade out
  backdrop.classList.add("opacity-0");
  dialog.classList.add("opacity-0");

  // Hide after transition
  setTimeout(() => {
    backdrop.classList.add("hidden");
    dialog.classList.add("hidden");
    dialog.classList.remove("block");
  }, 300);
}

function renderQuickSelects() {
  const container = document.getElementById("quick-selects-to-manage");
  if (!container) {
    console.error("Quick selects container not found");
    return;
  }

  const quickSelects = localStorageService.get.quickSelects();

  container.innerHTML = quickSelects
    .map((qs) => createQuickSelectItem(qs))
    .join("");

  // Attach event listeners to delete buttons
  const deleteButtons = container.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const quickSelectElement = (e.currentTarget as HTMLElement).closest(
        "[data-id]"
      );
      const id = quickSelectElement?.getAttribute("data-id");
      if (id) {
        handleDeleteQuickSelect(id);
      }
    });
  });
}

function handleDateTypeChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const dateInputContainer = document.getElementById("date-input-container");

  if (!dateInputContainer) return;

  if (target.value === "relative") {
    dateInputContainer.innerHTML = `
      <label
        for="quick-select-date"
        class="text-sm font-semibold text-slate-700 dark:text-slate-200"
      >Date (DD/MM)</label>
      <input
        type="text"
        id="quick-select-date"
        placeholder="25/12"
        pattern="\\d{2}/\\d{2}"
        required
        class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-sky-700 dark:focus:border-sky-600"
      />
    `;
  } else {
    dateInputContainer.innerHTML = `
      <label
        for="quick-select-date"
        class="text-sm font-semibold text-slate-700 dark:text-slate-200"
      >Date</label>
      <input
        type="date"
        id="quick-select-date"
        required
        class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-sky-700 dark:focus:border-sky-600"
      />
    `;
  }
}

function generateIdFromLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function showError(message: string) {
  const form = document.getElementById("add-quick-select-form");
  if (!form) return;

  // Remove existing error if any
  const existingError = form.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  // Create error message
  const errorDiv = document.createElement("div");
  errorDiv.className =
    "mt-4 error-message col-span-full bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-sm dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
  errorDiv.textContent = message;

  // Insert at the end of the form
  form.appendChild(errorDiv);
}

function clearError() {
  const existingError = document.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }
}

function handleAddQuickSelect(e: Event) {
  e.preventDefault();
  clearError();

  const form = e.target as HTMLFormElement;
  const nameInput = form.querySelector(
    "#quick-select-name"
  ) as HTMLInputElement;
  const dateInput = form.querySelector(
    "#quick-select-date"
  ) as HTMLInputElement;
  const dateTypeInput = form.querySelector(
    'input[name="date-type"]:checked'
  ) as HTMLInputElement;

  if (!nameInput || !dateInput || !dateTypeInput) {
    console.error("Form inputs not found");
    return;
  }

  const label = nameInput.value.trim();
  const date = dateInput.value.trim();
  const type = dateTypeInput.value as "relative" | "absolute";

  if (!label || !date) {
    showError("Please fill in all fields");
    return;
  }

  // Generate ID from label
  const id = generateIdFromLabel(label);

  if (!id) {
    showError("Please enter a valid name");
    return;
  }

  // Check if ID already exists
  const existingQuickSelects = localStorageService.get.quickSelects();
  if (existingQuickSelects.some((qs) => qs.id === id)) {
    showError("A quick select with this name already exists");
    return;
  }

  // Validate and format date
  let formattedDate = date;
  if (type === "relative") {
    // Convert DD/MM to MM-DD
    const match = date.match(/^(\d{2})\/(\d{2})$/);
    if (!match) {
      showError("Date must be in DD/MM format (e.g., 25/12)");
      return;
    }
    const [, day, month] = match;
    formattedDate = `${month}-${day}`;
  } else {
    // Date input already gives YYYY-MM-DD format
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      showError("Invalid date format");
      return;
    }
    formattedDate = date;
  }

  // Create new quick select
  const newQuickSelect: QuickSelect = {
    id,
    label,
    date: formattedDate,
    type,
  };

  // Add to localStorage
  existingQuickSelects.push(newQuickSelect);
  localStorageService.set.quickSelects(existingQuickSelects);

  // Emit event so the main app can update
  events.emit(Events.QUICK_SELECT_ADDED, { quickSelect: newQuickSelect });

  // Clear form
  form.reset();

  // Re-render the dialog
  renderQuickSelects();
}

function handleDeleteQuickSelect(id: string) {
  if (!confirm("Are you sure you want to delete this quick select?")) {
    return;
  }

  // Remove from localStorage
  localStorageService.remove.quickSelect(id);

  // Emit event so the main app can update
  events.emit(Events.QUICK_SELECT_DELETED, { id });

  // Re-render the dialog
  renderQuickSelects();
}

function createQuickSelectItem(quickSelect: QuickSelect): string {
  const isRelative = quickSelect.type === "relative";
  const badgeClass = isRelative
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
    : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400";

  // Format date for display (convert MM-DD to DD/MM for relative dates)
  let displayDate = quickSelect.date;
  if (isRelative && quickSelect.date.match(/^\d{2}-\d{2}$/)) {
    const [month, day] = quickSelect.date.split("-");
    displayDate = `${day}/${month}`;
  } else if (!isRelative && quickSelect.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // Convert YYYY-MM-DD to DD/MM/YYYY for absolute dates
    const [year, month, day] = quickSelect.date.split("-");
    displayDate = `${day}/${month}/${year}`;
  }

  return `
    <div
      class="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 group hover:border-slate-300 dark:hover:border-slate-600 transition-all"
      data-id="${quickSelect.id}"
    >
      <button
        class="drag-handle cursor-move text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      >
        <svg class="w-5 h-5">
          <use href="/svg-icons.svg#reorder"></use>
        </svg>
      </button>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-slate-900 dark:text-slate-100">
          ${quickSelect.label}
        </div>
        <div
          class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2"
        >
          <span>${displayDate}</span>
          <span
            class="text-xs px-2 py-0.5 rounded-full ${badgeClass}"
          >${isRelative ? "Relative" : "Absolute"}</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="edit-button btn-icon btn-icon-secondary opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg class="w-4 h-4">
            <use href="/svg-icons.svg#edit"></use>
          </svg>
        </button>
        <button
          class="delete-button btn-icon btn-icon-secondary opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg class="w-4 h-4">
            <use href="/svg-icons.svg#trash"></use>
          </svg>
        </button>
      </div>
    </div>
  `;
}
