export declare const render: (params: RenderParams) => string;
export interface RenderParams {
    templatePath?: string;
    templateContent?: string;
    data: Record<string, any>;
}
export declare class TemplateRenderError extends Error {
    templateContent: string;
    templatePath: string;
    message: string;
    cause: Error;
    renderTemplateFailureMessage: (templateFilePath: string, templateContent: string, err: Error) => string;
    constructor({ templateContent, templatePath, cause, }: {
        templateContent: string;
        templatePath?: string;
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
