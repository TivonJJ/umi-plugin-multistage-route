import { Mustache, winPath } from '@umijs/utils';
import fs from 'fs';
import path from 'path';
const PluginKey = 'multistage-route';
export default function (api) {
  const tempDirPath = api.paths.absTmpPath;
  const decoratorPath = path.join(PluginKey, 'decorator.tsx');
  const wrappedRoutes = [];
  api.describe({
    key: PluginKey
  });
  api.onGenerateFiles(async () => {
    const exists = fs.existsSync(path.join(tempDirPath, decoratorPath));
    if (exists) return;
    api.writeTmpFile({
      path: 'decorator.tsx',
      content: fs.readFileSync(path.join(__dirname, './tpl/decorator.tsx'), 'utf-8')
    });
    wrappedRoutes.forEach(item => {
      api.writeTmpFile({
        path: item.path,
        content: item.content
      });
    });
  });
  api.onPatchRoute(async ({
    route
  }) => {
    if (route.multistage && route.path) {
      const outFileName = route.absPath.replace(/\//g, '-').replace(/:/, '_').replace(/^-/, '') + '.ts';
      const outPath = path.join('wrapper', outFileName);
      const routePath = route.file;
      if (!routePath) throw new Error('route.file is invalid');
      wrappedRoutes.push({
        path: outPath,
        content: Mustache.render(fs.readFileSync(path.join(__dirname, './tpl/wrapper.tpl'), 'utf-8'), {
          route: winPath(routePath),
          decorator: winPath(path.join(tempDirPath, 'plugin-' + decoratorPath)),
          opt: typeof route.multistage === 'object' ? JSON.stringify(route.multistage) : undefined
        })
      });
      route.file = winPath(path.join(tempDirPath, 'plugin-' + PluginKey, outPath));
    }
    return route;
  });
}