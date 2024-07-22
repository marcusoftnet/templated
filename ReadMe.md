# Templated-views - JavaScript template strings as a view engine

Templated-views is a lightweight and flexible view engine for JavaScript, leveraging template strings for dynamic content generation. Designed with TypeScript, it supports rendering templates, of any type, with embedded JavaScript.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Example](#basic-example)
  - [Include templates in templates](#include-templates-in-templates)
- [Performance](#performance)
- [Development](#development)
  - [Testing](#testing)
  - [Building](#building)
- [Contributing](#contributing)
- [License](#license)

## Features

- Simple template rendering with JavaScript template strings
- Supports including templates within templates for layouts and partials
- Lightweight and easy to integrate
- TypeScript support for type safety
- Supports any text-based file types for templates (.html, .md, .txt or what have you). Even no file, by passing a string to the template engine

## Installation

You can install Templated-views via npm:

```bash
npm install templated-views
```

## Usage

Templated-views is just [JavaScript template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), that you can mix with any other text.

Anything that you can do in a template string literal can be put in a file and be used as a template.

You can find many examples in [our tests](./test/render.test.ts)

### Basic Example

Let's say that you want to render you a list of peoples name in an HTML block.

Create a HTML-file `people.html` that holds the HTML and map over the people like this:

```html
<ul>
  ${people.map(p => `<li>${p.name}</li>`).join("\n  ") }
</ul>
```

Then call the `renderTemplateFile` function like this:

```typescript
import { renderTemplateFile } from templated-views;

const people = [
  { name: "Marcus" },
  { name: "Elin" },
  { name: "Albert" },
  { name: "Arvid" },
  { name: "Gustav" },
];

// renderTemplateFile(templatePath, data)
const result = renderTemplateFile("usage/people.html", { people });
console.log(result)
/*
<ul>
  <li>Marcus</li>
  <li>Elin</li>
  <li>Albert</li>
  <li>Arvid</li>
  <li>Gustav</li>
</ul>
*/
```

This code example is found in [basic.ts](/usage/basic.ts) and can be run with `npx ts-node usage/basic.ts`

### Include templates in templates

You can include and render other templates as part of the rendering of a template. This can be useful to have reusable layout elements, such as footers and headers.

Call the `include` function and pass it the path to the template to render. Note that the `data` object is passed on to the templates rendered with the `include`-calls.

For example, here's a HTML file (`main.html`) with a footer and header:

```html
${include("header.html")}
<h1>Main content for ${appName}</h1>
${include("footer.html")}
```

`header.html`

```html
<h2>Header for ${appName}</h2>
```

`footer.html`

```html
<h2>Footer for ${appName}</h2>
```

You can now render the `main.html` like this:

```javascript
import { renderTemplateFile } from templated-views;

const result = renderTemplateFile("usage/main.html", { appName: "MyApp" });
console.log(result);
/*
<h2>Header for MyApp</h2>
<h1>Main content for MyApp</h1>
<h2>Footer for MyApp</h2>
*/
```

This code example is found in [include.ts](/usage/include.ts) and can be run with `npx ts-node usage/include.ts`

## Performance

I have not yet considered performance but have put some [rudimentary performance tests](/test/performance.test.ts) in place, just to see that it doesn't go awry performance-wise.

## Development

Development has been done using TDD (test driven development) and TypeScript. Hence there are easy and fast ways to run tests and build the code into JavaScript.

### Testing

Run the tests using one of the following commands:

```bash
npm run test
npm test
npm t
```

If you want to run the tests under watch the easiest is to pass the `--watchAll` flag to the `jest` command. This can be done directly from `npm` like this:

```bash
npm t -- --watchAll
```

### Building

The build command is found in the [`package.json`-file](package.json) and can be run using:

```bash
npm run build
```

### Contributing

I welcome contributions to Templated-views! Whether it's fixing bugs, adding new features, or improving documentation, your help is appreciated. Follow these simple steps to contribute:

1. **Fork the Repository**

   - Click the "Fork" button at the top right of this repository's GitHub page.

2. **Clone Your Fork**

   - Clone your forked repository to your local machine:

     ```bash
     git clone https://github.com/marcusoftnet/templated.git
     cd templated
     ```

3. **Create a New Branch**

   - Create a new branch for your work:

     ```bash
     git checkout -b feature/your-feature-name
     ```

4. **Make Your Changes**

   - Make your changes to the codebase.

5. **Commit Your Changes**

   - Commit your changes with a clear and descriptive message:

     ```bash
     git add .
     git commit -m "Add feature: Your feature description"
     ```

6. **Push to Your Fork**

   - Push your changes to your forked repository:

     ```bash
     git push origin feature/your-feature-name
     ```

7. **Create a Pull Request**
   - Go to the original repository on GitHub and click the "New Pull Request" button.
   - Select your branch from the "compare" dropdown.
   - Click "Create Pull Request" and fill out the form with a clear description of your changes.

### Code Style and Guidelines

- Use TypeScript
- Use EsLint as found in the [eslint config file](eslint.config.mjs)
- Write a test before you write the code.
- Write the code so that it is easy for the next developer to understand.
- Write clear, concise commit messages.
- Add comments and documentation where necessary.
- Ensure your code passes existing tests and add new tests for your changes.

### Running Tests

Make sure all tests pass before submitting your pull request:

```bash
npm test
```

### Need Help?

If you have any questions or need assistance, feel free to open an issue or contact me.

---

By following these steps, you can easily contribute to the development of Templated-views. Thank you for your help!

## License

This project is written by Marcus Hammarberg and is licensed under the [ISC Open source license](https://en.wikipedia.org/wiki/ISC_license)
