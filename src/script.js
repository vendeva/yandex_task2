import dataJson from "./data/input.json";
import { prepareData } from "./prepareData/index.js";

document.addEventListener("DOMContentLoaded", function () {
    const result = prepareData(dataJson, { sprintId: 977 });
    document.body.innerHTML = `<pre>${JSON.stringify(result, null, 4)}</pre>`;
});
