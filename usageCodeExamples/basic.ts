import { renderTemplateFile } from "../src/index";

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