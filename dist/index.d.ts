export declare const render: (templateContent: string, data: Record<string, any>, templatePath?: string) => string;
export declare const renderTemplateFile: (templatePath: string, data: Record<string, any>) => string;
export declare class TemplateRenderError extends Error {
    templateContent: string;
    templatePath: string;
    message: string;
    cause: Error;
    renderTemplateFailureMessage: (templateFilePath: string, templateContent: string, err: Error) => string;
    constructor({ templateContent, templatePath, cause, }: {
        templateContent: string;
        templatePath: string;
        cause: Error;
    });
}
export declare class TemplateNotFoundError extends Error {
    templatePath: string;
    message: string;
    cause: Error;
    templateFileNotFoundMessage: (absolutePath: string, err: Error) => string;
    constructor({ templatePath, cause }: {
        templatePath: string;
        cause: Error;
    });
}
