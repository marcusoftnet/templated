import { render } from "../src/render";
import * as path from "path";

const fixturePath = (filePath: string) =>
  path.resolve(__dirname, "fixtures", filePath);

const people = [
  { name: "Marcus" },
  { name: "Elin" },
  { name: "Albert" },
  { name: "Arvid" },
  { name: "Gustav" },
];

const expectedLiPeopleString = `<ul>
  <li>Marcus</li>
<li>Elin</li>
<li>Albert</li>
<li>Arvid</li>
<li>Gustav</li>
</ul>`;

test("renders template without data", () => {
  const templatePath = fixturePath("simpleWithoutData.html");
  const result = render(templatePath, {});
  expect(result).toBe("<div>No data here</div>");
});

test("renders template with data", () => {
  const templatePath = fixturePath("simpleWithData.html");
  const result = render(templatePath, { name: "Marcus" });
  expect(result).toBe("<div>MARCUS</div>");
});

test("renders other than html", () => {
  const templatePath = fixturePath("simpleWithData.txt");
  const result = render(templatePath, { name: "Marcus" });
  expect(result).toBe("MARCUS wrote this");
});

test("renders simple loops", () => {
  const templatePath = fixturePath("loopSimple.html");
  const result = render(templatePath, { numbers: [1, 2, 3, 4, 5] });
  expect(result).toBe(`<ol>
  <li>1</li>
<li>2</li>
<li>3</li>
<li>4</li>
<li>5</li>
</ol>`);
});

test("renders loops with objects", () => {
  const templatePath = fixturePath("loopObjects.html");
  const result = render(templatePath, { people });
  expect(result).toBe(expectedLiPeopleString);
});

test("renders conditionals true branch", () => {
  const templatePath = fixturePath("conditional.html");
  const result = render(templatePath, { name: "Marcus", age: 52 });
  expect(result).toBe("<div>Marcus is <strong>OLD</strong></div>");
});

test("renders conditionals false branch", () => {
  const templatePath = fixturePath("conditional.html");
  const result = render(templatePath, { name: "Majken", age: 12 });
  expect(result).toBe("<div>Majken is <strong>younger</strong></div>");
});

test("writes a nice error message when template is not found", () => {
  const templatePath = fixturePath("notFound.html");
  const result = render(templatePath, {});
  expect(result).toContain(`could not be found.`);
  expect(result).toContain("notFound.html");
  expect(result).toContain(templatePath);
  expect(result).toContain(`Error code:`);
  expect(result).toContain(`Error message:`);
});

test("writes a nice error message when template fails to render", () => {
  const templatePath = fixturePath("failingRendering.html");
  const result = render(templatePath, {}); // Not passing people that the template is using
  expect(result).toContain(`"${templatePath}"`);
  expect(result).toContain("Error message:  people is not defined");
  expect(result).toContain("${people.map(p => p.id)}");
  expect(result).toContain("Error code:");
});

test("renders includes to include other templates", () => {
  const templatePath = path.resolve(__dirname, "fixtures", "includeHead.html");
  const result = render(templatePath, { people });
  expect(result).toContain(expectedLiPeopleString);
  expect(result).toContain("<!DOCTYPE html>");
  expect(result).toContain("<h1>The layout</h1>");
  expect(result).toContain("<h2>Main content</h2>");
});
