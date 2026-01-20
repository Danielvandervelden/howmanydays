export function getElements() {
  const fromDateInput = document.getElementById("from-date");
  const toDateInput = document.getElementById("to-date");
  const quickSelectsContainer = document.getElementById("quick-select-content");

  return {
    fromDateInput,
    toDateInput,
    quickSelectsContainer,
  };
}
