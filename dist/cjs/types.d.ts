export type Route<P extends Record<string, any> = {}> = {
    [key in keyof P]: P[key];
} & {
    name?: string | undefined;
    component?: string | undefined;
    layout?: false | undefined;
    path?: string | undefined;
    redirect?: string | undefined;
    wrappers?: Array<string> | undefined;
    multistage?: boolean | { forceRender: boolean; };
    routes?: Route<P>[];
};