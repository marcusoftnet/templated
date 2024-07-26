import { render } from "../src/index";
// the above line is just for me to use the implementation to verify the usage
// in your code write
// import { render } from "templated-views";
// after installing the package with 'npm i templated-views'

const result = render({
  templatePath: "usage/main.html",
  data: { appName: "MyApp" },
});
console.log(result);
