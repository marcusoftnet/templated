import * as fs from "fs";
import * as path from "path";
import * as vm from "vm";

const templateCache: Record<string, string> = {};

const createFileNotFoundMessage = (absolutePath: string, err: Error) => {
  return `The "${path.basename(absolutePath)}" file could not be found.
      Resolved path:  ${absolutePath}

      Error message:  ${err.message}
      Error code:     ${err.name}
  `;
};

const renderTemplateFailureMessage = (
  templatePath: string,
  templateContent: string,
  err: Error
) => {
  return `The "${templatePath}" was found but could not be parsed.
      Error message:  ${err.message}
      Error code:     ${err.name}

      ${path.basename(templatePath)}:
      =======
      ${templateContent}
      =======
  `;
};

export function render(
  templatePath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
): string | undefined {
  const absolutePath = path.resolve(templatePath);

  let template: string = "";

  if (templateCache[absolutePath]) {
    template = templateCache[absolutePath];
  } else {
    try {
      template = fs.readFileSync(absolutePath, "utf-8");
      templateCache[absolutePath] = template;
    } catch (err) {
      return createFileNotFoundMessage(absolutePath, err as Error);
    }
  }
  const include = (includeTemplatePath: string) => render(includeTemplatePath, data);
  const sandbox = {
    ...data,
    include,
  };
  const context = vm.createContext(sandbox);

  const scriptContent = `\`${template}\``;
  const script = new vm.Script(scriptContent);

  try {
    return script.runInContext(context);
  } catch (err) {
    return renderTemplateFailureMessage(templatePath, template, err as Error);
  }
}
