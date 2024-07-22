import { renderTemplateFile } from "../src/index";
// the above line is just for me to use the implementation to verify the usage
// in your code write
// import { renderTemplateFile } from templated-views;
// after doing 'npm i templated-views'

const result = renderTemplateFile("usageCodeExamples/main.html", { appName: "MyApp" });
console.log(result);