/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs";
import { basename, resolve }from "path";
import * as vm from "vm";

const templateCache: Record<string, string> = {};

const createSandbox = (data: Record<string, any>) => ({
  ...data,
  include: (templatePath: string) => renderTemplateFile(templatePath, data),
});

const loadTemplateFromFile = (templatePath: string): string => {
  const absolutePath = resolve(templatePath);
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
  try {
    return renderTemplateContent(templateContent, data, templatePath);
  } catch (error) {
    if (error instanceof TemplateRenderError)
      return (error as TemplateRenderError).message;

    throw error;
  }
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


export class TemplateRenderError extends Error {
  templateContent: string;
  templatePath: string;
  message: string;
  cause: Error;

  renderTemplateFailureMessage = (
    templateFilePath: string,
    templateContent: string,
    err: Error
  ) => `The "${templateFilePath}" was found but could not be executed.
      Error message:  ${err.message}
      Error code:     ${err.name}

      ${basename(templateFilePath)}:
      =======
      ${templateContent}
      =======
  `;

  constructor({
    templateContent,
    templatePath,
    cause,
  }: {
    templateContent: string;
    templatePath: string;
    cause: Error;
  }) {
    super();
    this.templateContent = templateContent;
    this.templatePath = templateContent;
    this.message = this.renderTemplateFailureMessage(
      templatePath,
      templateContent,
      cause as Error
    );
    this.cause = cause;
  }
}

export class TemplateNotFoundError extends Error {
  templatePath: string;
  message: string;
  cause: Error;

  templateFileNotFoundMessage = (absolutePath: string, err: Error) =>
    `The "${basename(absolutePath)}" file could not be found.
      Resolved path:  ${absolutePath}

      Error message:  ${err.message}
      Error code:     ${err.name}
  `;

  constructor({ templatePath, cause }: { templatePath: string; cause: Error }) {
    super();
    this.templatePath = templatePath;
    this.message = this.templateFileNotFoundMessage(
      templatePath,
      cause as Error
    );
    this.cause = cause;
  }
}
