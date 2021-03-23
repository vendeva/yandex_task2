import dataJson from "./data/input.json";
import { prepareData } from "./prepareData/index.js";

const searchParams = new URLSearchParams(window.location.search);
const currentSprint = Number(searchParams.get("sprint")) || 977;
document.addEventListener("DOMContentLoaded", function () {
    const result = prepareData(dataJson, { sprintId: currentSprint });
    document.body.innerHTML = `<pre>${JSON.stringify(result, null, 4)}</pre>`;
});
