import { renderTemplateFile } from "../src/index";
const result = renderTemplateFile("usageCodeExamples/main.html", { appName: "MyApp" });
console.log(result);