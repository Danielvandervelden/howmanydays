import { events } from "../utils/events";
import { getQueryParams } from "../utils/getQueryParams";
import { Events } from "../utils/interfaces";
import { queryParamService } from "../utils/queryParam.service";

export function handleMode() {
  const { mode: modeQueryParam } = getQueryParams();

  if (!modeQueryParam) {
    queryParamService.set.mode("until");
  }

  const modeToggleContainer = document.getElementById("mode-toggle-container");

  if (!(modeToggleContainer instanceof HTMLDivElement)) {
    console.error("Mode toggle container not found");
    return;
  }

  const modeToggleInputs = modeToggleContainer.querySelectorAll(
    "input[type='radio']"
  ) as NodeListOf<HTMLInputElement>;

  for (const modeToggleInput of modeToggleInputs) {
    if (!(modeToggleInput instanceof HTMLInputElement)) {
      console.error("Mode toggle input not found");
      return;
    }

    modeToggleInput.addEventListener("change", (e) => {
      if (!(e.target instanceof HTMLInputElement)) {
        console.error("Mode toggle input not found");
        return;
      }

      if (e.target.value !== "since" && e.target.value !== "until") {
        console.error("Invalid mode");
        return;
      }

      queryParamService.set.mode(e.target.value);
      events.emit(Events.MODE_CHANGED, { mode: e.target.value });
    });
  }
}
