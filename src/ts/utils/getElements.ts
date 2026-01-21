export function getElements() {
  const fromDateInput = document.getElementById("from-date");
  const toDateInput = document.getElementById("to-date");
  const quickSelectsContainer = document.getElementById("quick-select-content");
  const fromTodayLink = document.getElementById("from-today-link");
  const toTodayLink = document.getElementById("to-today-link");

  return {
    fromDateInput,
    toDateInput,
    quickSelectsContainer,
    fromTodayLink,
    toTodayLink,
  };
}
