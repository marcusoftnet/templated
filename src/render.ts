/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs";
import * as path from "path";
import * as vm from "vm";
import { TemplateNotFoundError, TemplateRenderError } from "./errors";

const templateCache: Record<string, string> = {};

const createSandbox = (data: Record<string, any>) => ({
  ...data,
  include: (templatePath: string) => renderTemplateFile(templatePath, data),
});

const loadTemplateFromFile = (templatePath: string): string => {
  const absolutePath = path.resolve(templatePath);
  let template: string = "";

  if (templateCache[absolutePath]) {
    template = templateCache[absolutePath];
  } else {
    try {
      template = fs.readFileSync(absolutePath, "utf-8");
      templateCache[absolutePath] = template;
    } catch (err) {
      throw new TemplateNotFoundError({
        templatePath: absolutePath,
        cause: err as Error,
      });
    }
  }
  return template;
};

const renderTemplateContent = (
  templateContent: string,
  data: Record<string, any>,
  templatePath: string = ""
): string => {
  const scriptContent = `\`${templateContent}\``;
  const script = new vm.Script(scriptContent);

  try {
    const context = vm.createContext(createSandbox(data));
    return script.runInContext(context);
  } catch (err) {
    throw new TemplateRenderError({
      templateContent: templateContent,
      templatePath: templatePath,
      cause: err as Error,
    });
  }
};

export const render = (
  templateContent: string,
  data: Record<string, any>,
  templatePath: string = ""
): string => {
  return renderTemplateContent(templateContent, data, templatePath);
};

export const renderTemplateFile = (
  templatePath: string,
  data: Record<string, any>
): string => {
  try {
    const templateContent = loadTemplateFromFile(templatePath);
    return renderTemplateContent(templateContent, data, templatePath);
  } catch (error) {
    if (error instanceof TemplateNotFoundError)
      return (error as TemplateNotFoundError).message;

    if (error instanceof TemplateRenderError)
      return (error as TemplateRenderError).message;

    throw error;
  }
};
// export const renderTemplateFile = (
//   templatePath: string,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   data: Record<string, any>
// ): string => {
//   const absolutePath = path.resolve(templatePath);

//   let template: string = "";

//   if (templateCache[absolutePath]) {
//     template = templateCache[absolutePath];
//   } else {
//     try {
//       template = fs.readFileSync(absolutePath, "utf-8");
//       templateCache[absolutePath] = template;
//     } catch (err) {
//       return createFileNotFoundMessage(absolutePath, err as Error);
//     }
//   }
//   const include = (includePath: string) =>
//     renderTemplateFile(includePath, data);
//   const sandbox = { ...data, include };
//   const context = vm.createContext(sandbox);

//   const scriptContent = `\`${template}\``;
//   const script = new vm.Script(scriptContent);

//   try {
//     return script.runInContext(context);
//   } catch (err) {
//     return renderTemplateFileFailureMessage(
//       templatePath,
//       template,
//       err as Error
//     );
//   }
// };
