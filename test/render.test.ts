import { describe } from "node:test";
import { renderTemplateFile, render } from "../src/render";
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
    const result = renderTemplateFile(templatePath, {});
    expect(result).toBe("<div>No data here</div>");
  });

  test("renders template with data", () => {
    const templatePath = fixturePath("simpleWithData.html");
    const result = renderTemplateFile(templatePath, { name: "Marcus" });
    expect(result).toBe("<div>MARCUS</div>");
  });

  test("renders other than html", () => {
    const templatePath = fixturePath("simpleWithData.txt");
    const result = renderTemplateFile(templatePath, { name: "Marcus" });
    expect(result).toBe("MARCUS wrote this");
  });

  test("renders simple loops", () => {
    const templatePath = fixturePath("loopSimple.html");
    const result = renderTemplateFile(templatePath, {
      numbers: [1, 2, 3, 4, 5],
    });
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
    const result = renderTemplateFile(templatePath, { people });
    expect(result).toBe(expectedLiPeopleString);
  });

  test("renders conditionals true branch", () => {
    const templatePath = fixturePath("conditional.html");
    const result = renderTemplateFile(templatePath, {
      name: "Marcus",
      age: 52,
    });
    expect(result).toBe("<div>Marcus is <strong>OLD</strong></div>");
  });

  test("renders conditionals false branch", () => {
    const templatePath = fixturePath("conditional.html");
    const result = renderTemplateFile(templatePath, {
      name: "Majken",
      age: 12,
    });
    expect(result).toBe("<div>Majken is <strong>younger</strong></div>");
  });

  test("renders includes to include other templates", () => {
    const templatePath = path.resolve(
      __dirname,
      "fixtures",
      "includeHead.html"
    );
    const result = renderTemplateFile(templatePath, { people });
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
    const result = renderTemplateFile(templatePath, { people });
    expect(result).toContain("<h1>Main content</h1>");
    expect(result).toContain("<h2>Header</h2>");
    expect(result).toContain("<h2>Footer</h2>");
  })

  test("calls user defined functions passed to the template", () => {
    const templatePath = path.resolve(
      __dirname,
      "fixtures",
      "callingUserDefinedFunctions.html"
    );
    const result = renderTemplateFile(templatePath, {
      people,
      myFunction: (length: number, greeting: string) =>
        `Length was ${length} - ${greeting}`,
    });
    expect(result).toContain(
      `The result of the function call is "<code>Length was ${people.length} - Yee-Haw</code>"`
    );
  });
});

describe("rendering templates", () => {
  test("renders template with no data", () => {
    const result = render("<div>No data here</div>", {});
    expect(result).toBe("<div>No data here</div>");
  });

  test("renders template with data", () => {
    const result = render("<div>${name.toUpperCase()} wrote this</div>", {
      name: "Marcus",
    });
    expect(result).toBe("<div>MARCUS wrote this</div>");
  });

  test("renders template with loop", () => {
    const result = render(
      `<ul>
  ${people.map((p) => `<li>${p.name}</li>`).join("\n")}
</ul>`,
      { people }
    );
    expect(result).toBe(expectedLiPeopleString);
  });

  test("renders template with included file", () => {
    const result = render('<h1>The layout</h1>\n\t${include("test/fixtures/includeBody.html")}', { people });
    expect(result).toBe(`<h1>The layout</h1>\n\t<h2>Main content</h2>
${expectedLiPeopleString}`);
  });
});

describe("error handling", () => {
  test("writes a nice error message when template is not found", () => {
    const templatePath = fixturePath("notFound.html");
    const result = renderTemplateFile(templatePath, {});
    expect(result).toContain(`could not be found.`);
    expect(result).toContain("notFound.html");
    expect(result).toContain(templatePath);
    expect(result).toContain(`Error code:`);
    expect(result).toContain(`Error message:`);
  });

  test("writes a nice error message when template fails to render", () => {
    const templatePath = fixturePath("failingRendering.html");
    const result = renderTemplateFile(templatePath, {}); // Not passing people that the template is using
    expect(result).toContain(`"${templatePath}"`);
    expect(result).toContain("Error message:  people is not defined");
    expect(result).toContain("${people.map(p => p.id)}");
    expect(result).toContain("Error code:");
  });
});
