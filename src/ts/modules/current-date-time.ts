export function initCurrentDateTime() {
  const currentTimeDiv = document.getElementById("current-time");
  const currentDateDiv = document.getElementById("current-date");

  if (!currentTimeDiv || !currentDateDiv) {
    console.error("Current time or date div not found");
    return;
  }

  updateCurrentDateTime(currentTimeDiv, currentDateDiv);

  setInterval(() => {
    updateCurrentDateTime(currentTimeDiv, currentDateDiv);
  }, 1000);
}

function updateCurrentDateTime(timeDiv: HTMLElement, dateDiv: HTMLElement) {
  const preferredLanguage = navigator.language;
  const now = new Date();
  const time = now.toLocaleTimeString();
  const date = now.toLocaleDateString(preferredLanguage, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  timeDiv.textContent = time;
  dateDiv.textContent = date;
}
