import { render } from "../src/index";
// the above line is just for me to use the implementation to verify the usage
// in your code write
// import { render } from "templated-views";
// after installing the package with 'npm i templated-views'

const people = [
  { name: "Marcus" },
  { name: "Elin" },
  { name: "Albert" },
  { name: "Arvid" },
  { name: "Gustav" },
];

const result = render({
  templatePath: "usage/people.html",
  data: { people },
});
console.log(result);
