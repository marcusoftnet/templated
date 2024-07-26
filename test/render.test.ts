import { describe } from "node:test";
import { render } from "../src";
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

describe("using template files", () => {
  test("renders template without data", () => {
    const templatePath = fixturePath("simpleWithoutData.html");
    const result = render({ templatePath, data: {} });
    expect(result).toBe("<div>No data here</div>");
  });

  test("renders template with data", () => {
    const templatePath = fixturePath("simpleWithData.html");
    const result = render({ templatePath, data: { name: "Marcus" } });
    expect(result).toBe("<div>MARCUS</div>");
  });

  test("renders other than html", () => {
    const templatePath = fixturePath("simpleWithData.txt");
    const result = render({ templatePath, data: { name: "Marcus" } });
    expect(result).toBe("MARCUS wrote this");
  });

  test("renders simple loops", () => {
    const templatePath = fixturePath("loopSimple.html");
    const numbers = [1, 2, 3, 4, 5];
    const result = render({ templatePath, data: { numbers } });
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
    const result = render({ templatePath, data: { people } });
    expect(result).toBe(expectedLiPeopleString);
  });

  test("renders conditionals true branch", () => {
    const templatePath = fixturePath("conditional.html");
    const data = { name: "Marcus", age: 52 };
    const result = render({ templatePath, data });
    expect(result).toBe("<div>Marcus is <strong>OLD</strong></div>");
  });

  test("renders conditionals false branch", () => {
    const templatePath = fixturePath("conditional.html");
    const data = { name: "Majken", age: 12 };
    const result = render({ templatePath, data });
    expect(result).toBe("<div>Majken is <strong>younger</strong></div>");
  });

  test("renders includes to include other templates", () => {
    const templatePath = path.resolve(
      __dirname,
      "fixtures",
      "includeHead.html"
    );
    const result = render({ templatePath, data: { people } });
    expect(result).toContain(expectedLiPeopleString);
    expect(result).toContain("<!DOCTYPE html>");
    expect(result).toContain("<h1>The layout</h1>");
    expect(result).toContain("<h2>Main content</h2>");
  });

  test("renders multiple included files", () => {
    const templatePath = path.resolve(
      __dirname,
      "fixtures",
      "includeMain.html"
    );
    const data = { appName: "MyApp" };
    const result = render({ templatePath, data });
    expect(result).toContain("<h1>Main content for MyApp</h1>");
    expect(result).toContain("<h2>Header for MyApp</h2>");
    expect(result).toContain("<h2>Footer for MyApp</h2>");
  });

  test("calls user defined functions passed to the template", () => {
    const templatePath = path.resolve(
      __dirname,
      "fixtures",
      "callingUserDefinedFunctions.html"
    );

    const result = render({
      templatePath,
      data: {
        people,
        myFunction: (length: number, greeting: string) =>
          `Length was ${length} - ${greeting}`,
      },
    });
    expect(result).toContain(
      `The result of the function call is "<code>Length was ${people.length} - Yee-Haw</code>"`
    );
  });
});

describe("rendering template content", () => {
  test("renders template content when content is set", () => {
    const result = render({
      templateContent: "<div>No data here</div>",
      data: {},
    });
    expect(result).toBe("<div>No data here</div>");
  });
  test("renders template with no data", () => {
    const result = render({
      templateContent: "<div>No data here</div>",
      data: {},
    });
    expect(result).toBe("<div>No data here</div>");
  });

  test("renders template with data", () => {
    const data = { name: "Marcus" };
    const result = render({
      templateContent: "<div>${name.toUpperCase()} wrote this</div>",
      data,
    });
    expect(result).toBe("<div>MARCUS wrote this</div>");
  });

  test("renders template with loop", () => {
    const templateContent = `<ul>
  ${people.map((p) => `<li>${p.name}</li>`).join("\n  ")}
</ul>`;
    const data = { people };
    const result = render({ templateContent, data });
    expect(result).toBe(expectedLiPeopleString);
  });

  test("renders template with included file", () => {
    const templateContent =
      '<h1>The layout</h1>\n\t${include("test/fixtures/includeBody.html")}';
    const data = { people };
    const result = render({ templateContent, data });
    expect(result).toBe(`<h1>The layout</h1>\n\t<h2>Main content</h2>
${expectedLiPeopleString}`);
  });
});

describe("error handling", () => {
  test("writes a nice error message when template file is not found", () => {
    const templatePath = fixturePath("notFound.html");
    const result = render({ templatePath, data: {} });
    expect(result).toContain(`could not be found.`);
    expect(result).toContain("notFound.html");
    expect(result).toContain(templatePath);
    expect(result).toContain(`Error code:`);
    expect(result).toContain(`Error message:`);
  });

  test("writes a nice error message when template file fails to render", () => {
    const templatePath = fixturePath("failingRendering.html");
    const result = render({ templatePath, data: {} }); // Not passing people that the template is using
    expect(result).toContain(`"${templatePath}"`);
    expect(result).toContain("Error message:  people is not defined");
    expect(result).toContain("${people.map(p => p.id)}");
    expect(result).toContain("Error code:");
  });

  test("writes a nice error message when template fails to render", () => {
    const result = render({
      templateContent: "${people.map(p => p.id)}",
      templatePath: "No file",
      data: {},
    }); // Not passing people that the template is using
    expect(result).toContain("No file");
    expect(result).toContain("Error message:  people is not defined");
    expect(result).toContain("${people.map(p => p.id)}");
    expect(result).toContain("Error code:");
  });
});
