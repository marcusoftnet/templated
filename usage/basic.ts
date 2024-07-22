import { renderTemplateFile } from "../src/index";
// the above line is just for me to use the implementation to verify the usage
// in your code write
// import { renderTemplateFile } from templated-views;
// after doing 'npm i templated-views'

const people = [
  { name: "Marcus" },
  { name: "Elin" },
  { name: "Albert" },
  { name: "Arvid" },
  { name: "Gustav" },
];

// renderTemplateFile(templatePath, data)
const result = renderTemplateFile("usageCodeExamples/people.html", { people });
console.log(result);