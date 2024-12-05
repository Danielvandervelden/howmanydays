import dayjs from "dayjs";

export function updateTime() {
    const dateDiv = document.getElementById("date");
    if (dateDiv) {
        dateDiv.innerHTML = dayjs().format("DD MMM YYYY HH:mm:ss");
    }
}
