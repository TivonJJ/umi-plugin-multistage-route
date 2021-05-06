import path from 'path';
import winPath from 'slash2';
import fs from 'fs';

const TempDirName = 'plugin-multistage-route';

export default function(api) {
    const tempDirPath = api.paths.absTmpPath || '';
    const DecoratorPath = path.join(TempDirName, 'decorator.tsx');
    api.onGenerateFiles(() => {
        const exists = fs.existsSync(path.join(tempDirPath,DecoratorPath));
        if(exists)return;
        api.writeTmpFile({
            path: DecoratorPath,
            content: fs.readFileSync(path.join(__dirname, './tpl/decorator.tpl'), 'utf-8'),
        });
    });
    api.onPatchRouteBefore(({ route }) => {
        if (route.multistage && route.path) {
            if (!route.routes || !route.routes.length) {
                throw new Error(`"routes" on ${route.path} can not be empty if multistage is true`);
            }
            if (!route.component) {
                throw new Error(`"component" on ${route.path} can not be empty if multistage is true`);
            }
            const outPath = path.join(TempDirName, 'wrapper', route.path.replace(/\//g, '.') + '.ts');
            const routePath = path.join(api.paths.absPagesPath || '', route.component);
            const exists = fs.existsSync(path.join(tempDirPath,outPath));
            if(exists)return;
            api.writeTmpFile({
                path: outPath,
                content: api.utils.Mustache.render(
                    fs.readFileSync(path.join(__dirname, './tpl/wrapper.tpl'), 'utf-8')
                    , {
                        route: winPath(routePath),
                        decorator: winPath(path.join('@@', DecoratorPath)),
                        opt: typeof route.multistage === 'object' ? JSON.stringify(route.multistage) : undefined,
                    }),
            });
            route.component = winPath(path.join(tempDirPath, outPath));
        }
    });
}
