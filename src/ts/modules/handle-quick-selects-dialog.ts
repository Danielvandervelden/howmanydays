import { localStorageService } from "../utils/localStorage.service";
import { QuickSelect, Events } from "../utils/interfaces";
import { events } from "../utils/events";
import { getQueryParams } from "../utils/getQueryParams";
import { queryParamService } from "../utils/queryParam.service";

export function handleQuickSelectsDialog() {
    const manageButton = document.querySelector(
        "#quick-select-header a",
    ) as HTMLAnchorElement;
    const closeButton = document.getElementById(
        "close-manage-quick-selects-dialog",
    ) as HTMLButtonElement;
    const backdrop = document.getElementById("backdrop") as HTMLDivElement;
    const dialog = document.getElementById(
        "manage-quick-selects-dialog",
    ) as HTMLDialogElement;
    const form = document.getElementById("add-quick-select-form") as HTMLFormElement;

    if (!manageButton || !closeButton || !backdrop || !dialog || !form) {
        console.table({
            manageButton: !!manageButton,
            closeButton: !!closeButton,
            backdrop: !!backdrop,
            dialog: !!dialog,
            form: !!form,
        });
        return;
    }

    manageButton.addEventListener("click", openDialog);
    closeButton.addEventListener("click", closeDialog);
    backdrop.addEventListener("click", closeDialog);
    form.addEventListener("submit", handleFormSubmit);

    // Handle date type toggle
    const dateTypeInputs = dialog.querySelectorAll('input[name="date-type"]');
    dateTypeInputs.forEach((input) => {
        input.addEventListener("change", handleDateTypeChange);
    });

    renderQuickSelects();
}

function openDialog() {
    const backdrop = document.getElementById("backdrop") as HTMLDivElement;
    const dialog = document.getElementById(
        "manage-quick-selects-dialog",
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

    // Check if we're in edit mode
    const { edit } = getQueryParams();
    if (edit) {
        populateFormForEdit(edit);
    }

    // Render quick selects
    renderQuickSelects();
}

function closeDialog() {
    const backdrop = document.getElementById("backdrop") as HTMLDivElement;
    const dialog = document.getElementById(
        "manage-quick-selects-dialog",
    ) as HTMLDialogElement;

    if (!backdrop || !dialog) return;

    // Fade out
    backdrop.classList.add("opacity-0");
    dialog.classList.add("opacity-0");

    // Clear form and edit state
    const form = document.getElementById("add-quick-select-form") as HTMLFormElement;
    if (form) {
        form.reset();
    }
    clearError();
    queryParamService.remove.edit();
    updateFormButtonText();

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

    container.innerHTML = quickSelects.map((qs) => createQuickSelectItem(qs)).join("");

    // Attach event listeners to edit and delete buttons
    const editButtons = container.querySelectorAll(".edit-button");
    editButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const quickSelectElement = (e.currentTarget as HTMLElement).closest(
                "[data-id]",
            );
            const id = quickSelectElement?.getAttribute("data-id");
            if (id) {
                handleEditQuickSelect(id);
            }
        });
    });

    const deleteButtons = container.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const quickSelectElement = (e.currentTarget as HTMLElement).closest(
                "[data-id]",
            );
            const id = quickSelectElement?.getAttribute("data-id");
            if (id) {
                handleDeleteQuickSelect(id);
            }
        });
    });

    // Setup drag and drop for reordering
    setupDragAndDrop(container);
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

function populateFormForEdit(id: string) {
    const quickSelects = localStorageService.get.quickSelects();
    const quickSelect = quickSelects.find((qs) => qs.id === id);

    if (!quickSelect) {
        console.error("Quick select not found for editing");
        return;
    }

    const nameInput = document.getElementById("quick-select-name") as HTMLInputElement;
    const dateInput = document.getElementById("quick-select-date") as HTMLInputElement;
    const dateTypeRelative = document.getElementById(
        "date-type-relative",
    ) as HTMLInputElement;
    const dateTypeAbsolute = document.getElementById(
        "date-type-absolute",
    ) as HTMLInputElement;

    if (!nameInput || !dateInput || !dateTypeRelative || !dateTypeAbsolute) {
        console.error("Form inputs not found");
        return;
    }

    // Set name
    nameInput.value = quickSelect.label;

    // Set date type
    if (quickSelect.type === "relative") {
        dateTypeRelative.checked = true;
        // Trigger change to update the date input
        handleDateTypeChange({ target: dateTypeRelative } as any);
        // Convert MM-DD to DD/MM for display
        const [month, day] = quickSelect.date.split("-");
        setTimeout(() => {
            const dateInputUpdated = document.getElementById(
                "quick-select-date",
            ) as HTMLInputElement;
            if (dateInputUpdated) {
                dateInputUpdated.value = `${day}/${month}`;
            }
        }, 0);
    } else {
        dateTypeAbsolute.checked = true;
        handleDateTypeChange({ target: dateTypeAbsolute } as any);
        // Date is already in YYYY-MM-DD format
        setTimeout(() => {
            const dateInputUpdated = document.getElementById(
                "quick-select-date",
            ) as HTMLInputElement;
            if (dateInputUpdated) {
                dateInputUpdated.value = quickSelect.date;
            }
        }, 0);
    }

    updateFormButtonText();
}

function updateFormButtonText() {
    const { edit } = getQueryParams();
    const submitButton = document.querySelector(
        "#add-quick-select-form button[type='submit']",
    );

    if (submitButton) {
        const svgIcon = submitButton.querySelector("svg");
        if (edit) {
            submitButton.innerHTML = "";
            if (svgIcon) {
                svgIcon.querySelector("use")?.setAttribute("href", "/svg-icons.svg#save");
                submitButton.appendChild(svgIcon);
            }
            submitButton.appendChild(document.createTextNode("Update Quick Select"));
        } else {
            submitButton.innerHTML = "";
            if (svgIcon) {
                svgIcon.querySelector("use")?.setAttribute("href", "/svg-icons.svg#plus");
                submitButton.appendChild(svgIcon);
            }
            submitButton.appendChild(document.createTextNode("Add Quick Select"));
        }
    }
}

function handleEditQuickSelect(id: string) {
    queryParamService.set.edit(id);
    populateFormForEdit(id);
}

function handleFormSubmit(e: Event) {
    e.preventDefault();
    clearError();

    const { edit } = getQueryParams();

    if (edit) {
        handleUpdateQuickSelect(e, edit);
    } else {
        handleAddQuickSelect(e);
    }
}

function handleAddQuickSelect(e: Event) {
    const form = e.target as HTMLFormElement;
    const nameInput = form.querySelector("#quick-select-name") as HTMLInputElement;
    const dateInput = form.querySelector("#quick-select-date") as HTMLInputElement;
    const dateTypeInput = form.querySelector(
        'input[name="date-type"]:checked',
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

function handleUpdateQuickSelect(e: Event, oldId: string) {
    const form = e.target as HTMLFormElement;
    const nameInput = form.querySelector("#quick-select-name") as HTMLInputElement;
    const dateInput = form.querySelector("#quick-select-date") as HTMLInputElement;
    const dateTypeInput = form.querySelector(
        'input[name="date-type"]:checked',
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

    // Generate new ID from label
    const newId = generateIdFromLabel(label);

    if (!newId) {
        showError("Please enter a valid name");
        return;
    }

    // Check if new ID already exists (and is different from the old one)
    const existingQuickSelects = localStorageService.get.quickSelects();
    if (newId !== oldId && existingQuickSelects.some((qs) => qs.id === newId)) {
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

    // Create updated quick select
    const updatedQuickSelect: QuickSelect = {
        id: newId,
        label,
        date: formattedDate,
        type,
    };

    // Update in localStorage
    const updatedQuickSelects = existingQuickSelects.map((qs) =>
        qs.id === oldId ? updatedQuickSelect : qs,
    );
    localStorageService.set.quickSelects(updatedQuickSelects);

    // Emit event so the main app can update
    events.emit(Events.QUICK_SELECT_UPDATED, {
        oldId,
        quickSelect: updatedQuickSelect,
    });

    // Clear form and edit state
    form.reset();
    queryParamService.remove.edit();
    updateFormButtonText();

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

function setupDragAndDrop(container: HTMLElement) {
    const items = container.querySelectorAll("[data-id]");
    let draggedElement: HTMLElement | null = null;
    let touchStartY = 0;
    let isDragging = false;
    let touchMoveHandler: EventListener | null = null;
    let touchEndHandler: EventListener | null = null;
    let touchCancelHandler: EventListener | null = null;

    const cleanupTouchHandlers = () => {
        if (touchMoveHandler) {
            document.removeEventListener("touchmove", touchMoveHandler);
            touchMoveHandler = null;
        }
        if (touchEndHandler) {
            document.removeEventListener("touchend", touchEndHandler);
            touchEndHandler = null;
        }
        if (touchCancelHandler) {
            document.removeEventListener("touchcancel", touchCancelHandler);
            touchCancelHandler = null;
        }
    };

    const handleTouchMove = (e: Event) => {
        const touchEvent = e as TouchEvent;
        if (!isDragging || !draggedElement) {
            cleanupTouchHandlers();
            return;
        }

        const touch = touchEvent.touches[0];
        if (!touch) return;

        const currentY = touch.clientY;

        // Prevent scrolling while dragging
        touchEvent.preventDefault();

        // Find which item we're over based on the touch position
        const allItems = Array.from(container.querySelectorAll("[data-id]"));
        let targetItem: HTMLElement | null = null;

        // Find the item that contains the touch point
        for (const otherItem of allItems) {
            if (otherItem === draggedElement) continue;

            const rect = (otherItem as HTMLElement).getBoundingClientRect();
            // Check if touch is within the item's bounds
            if (currentY >= rect.top && currentY <= rect.bottom) {
                targetItem = otherItem as HTMLElement;
                break;
            }
        }

        // If no direct hit, find the closest item
        if (!targetItem) {
            let minDistance = Infinity;
            for (const otherItem of allItems) {
                if (otherItem === draggedElement) continue;

                const rect = (otherItem as HTMLElement).getBoundingClientRect();
                const itemCenterY = rect.top + rect.height / 2;
                const distance = Math.abs(currentY - itemCenterY);

                if (distance < minDistance) {
                    minDistance = distance;
                    targetItem = otherItem as HTMLElement;
                }
            }
        }

        // Move the dragged element to the correct position
        if (targetItem && targetItem !== draggedElement) {
            const rect = targetItem.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;

            // Only move if we're actually crossing a boundary
            const draggedRect = draggedElement.getBoundingClientRect();
            const draggedIndex = Array.from(allItems).indexOf(draggedElement);
            const targetIndex = Array.from(allItems).indexOf(targetItem);

            if (currentY < midpoint) {
                // Insert before target
                if (targetIndex > draggedIndex) {
                    // Moving down, need to account for the element being removed
                    const nextSibling = targetItem.previousElementSibling;
                    if (nextSibling && nextSibling !== draggedElement) {
                        nextSibling.insertAdjacentElement("afterend", draggedElement);
                    } else {
                        targetItem.parentNode?.insertBefore(draggedElement, targetItem);
                    }
                } else {
                    targetItem.parentNode?.insertBefore(draggedElement, targetItem);
                }
            } else {
                // Insert after target
                if (targetIndex < draggedIndex) {
                    // Moving up
                    targetItem.insertAdjacentElement("afterend", draggedElement);
                } else {
                    const nextSibling = targetItem.nextElementSibling;
                    if (nextSibling && nextSibling !== draggedElement) {
                        nextSibling.insertAdjacentElement("beforebegin", draggedElement);
                    } else {
                        targetItem.parentNode?.insertBefore(
                            draggedElement,
                            targetItem.nextSibling,
                        );
                    }
                }
            }
        }
    };

    const handleTouchEnd = (e: Event) => {
        if (draggedElement) {
            draggedElement.classList.remove("opacity-50");
            draggedElement = null;
            isDragging = false;
            saveNewOrder();
        }
        cleanupTouchHandlers();
    };

    const handleTouchCancel = (e: Event) => {
        if (draggedElement) {
            draggedElement.classList.remove("opacity-50");
            draggedElement = null;
            isDragging = false;
        }
        cleanupTouchHandlers();
    };

    items.forEach((item) => {
        const dragHandle = item.querySelector(".drag-handle");

        if (!dragHandle) return;

        // Mouse events
        dragHandle.addEventListener("mousedown", () => {
            (item as HTMLElement).setAttribute("draggable", "true");
        });

        item.addEventListener("dragstart", (e) => {
            draggedElement = item as HTMLElement;
            draggedElement.classList.add("opacity-50");
        });

        item.addEventListener("dragend", () => {
            if (draggedElement) {
                draggedElement.classList.remove("opacity-50");
                draggedElement.removeAttribute("draggable");
                draggedElement = null;
            }
            saveNewOrder();
        });

        item.addEventListener("dragover", (e) => {
            e.preventDefault();
            if (draggedElement && draggedElement !== item) {
                const rect = (item as HTMLElement).getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                if ((e as DragEvent).clientY < midpoint) {
                    item.parentNode?.insertBefore(draggedElement, item);
                } else {
                    item.parentNode?.insertBefore(draggedElement, item.nextSibling);
                }
            }
        });

        // Touch events for mobile
        dragHandle.addEventListener("touchstart", (e: Event) => {
            const touchEvent = e as TouchEvent;
            const touch = touchEvent.touches[0];
            if (!touch) return;

            touchStartY = touch.clientY;
            draggedElement = item as HTMLElement;
            isDragging = true;
            draggedElement.classList.add("opacity-50");

            // Prevent default to avoid scrolling
            touchEvent.preventDefault();

            // Attach handlers to document to track movement even outside the element
            touchMoveHandler = handleTouchMove;
            touchEndHandler = handleTouchEnd;
            touchCancelHandler = handleTouchCancel;

            document.addEventListener("touchmove", touchMoveHandler);
            document.addEventListener("touchend", touchEndHandler);
            document.addEventListener("touchcancel", touchCancelHandler);
        });
    });
}

function saveNewOrder() {
    const container = document.getElementById("quick-selects-to-manage");
    if (!container) return;

    const items = container.querySelectorAll("[data-id]");
    const newOrder = Array.from(items).map((item) => item.getAttribute("data-id"));

    const quickSelects = localStorageService.get.quickSelects();
    const reorderedQuickSelects = newOrder
        .map((id) => quickSelects.find((qs) => qs.id === id))
        .filter((qs): qs is QuickSelect => qs !== undefined);

    localStorageService.set.quickSelects(reorderedQuickSelects);
    events.emit(Events.QUICK_SELECT_REORDERED);
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
      class="flex items-center gap-2 md:gap-4 bg-slate-50 dark:bg-slate-900 rounded-xl p-2 md:p-4 border border-slate-200 dark:border-slate-700 group hover:border-slate-300 dark:hover:border-slate-600 transition-all"
      data-id="${quickSelect.id}"
    >
      <button
        class="drag-handle cursor-move text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors touch-none"
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
          class="edit-button btn-icon btn-icon-secondary opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        >
          <svg class="w-4 h-4">
            <use href="/svg-icons.svg#edit"></use>
          </svg>
        </button>
        <button
          class="delete-button btn-icon btn-icon-secondary opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        >
          <svg class="w-4 h-4">
            <use href="/svg-icons.svg#trash"></use>
          </svg>
        </button>
      </div>
    </div>
  `;
}
