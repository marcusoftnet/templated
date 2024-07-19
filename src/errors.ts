import * as path from "path";

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

      ${path.basename(templateFilePath)}:
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
    `The "${path.basename(absolutePath)}" file could not be found.
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
