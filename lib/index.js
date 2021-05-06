'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (api) {
    var tempDirPath = api.paths.absTmpPath || '';
    var DecoratorPath = _path2.default.join(TempDirName, 'decorator.tsx');
    api.onGenerateFiles(function () {
        var exists = _fs2.default.existsSync(_path2.default.join(tempDirPath, DecoratorPath));
        if (exists) return;
        api.writeTmpFile({
            path: DecoratorPath,
            content: _fs2.default.readFileSync(_path2.default.join(__dirname, './tpl/decorator.tpl'), 'utf-8')
        });
    });
    api.onPatchRouteBefore(function (_ref) {
        var route = _ref.route;

        if (route.multistage && route.path) {
            if (!route.routes || !route.routes.length) {
                throw new Error('"routes" on ' + route.path + ' can not be empty if multistage is true');
            }
            if (!route.component) {
                throw new Error('"component" on ' + route.path + ' can not be empty if multistage is true');
            }
            var outPath = _path2.default.join(TempDirName, 'wrapper', route.path.replace(/\//g, '.') + '.ts');
            var routePath = _path2.default.join(api.paths.absPagesPath || '', route.component);
            var exists = _fs2.default.existsSync(_path2.default.join(tempDirPath, outPath));
            if (exists) return;
            api.writeTmpFile({
                path: outPath,
                content: api.utils.Mustache.render(_fs2.default.readFileSync(_path2.default.join(__dirname, './tpl/wrapper.tpl'), 'utf-8'), {
                    route: (0, _slash2.default)(routePath),
                    decorator: (0, _slash2.default)(_path2.default.join('@@', DecoratorPath)),
                    opt: _typeof(route.multistage) === 'object' ? JSON.stringify(route.multistage) : undefined
                })
            });
            route.component = (0, _slash2.default)(_path2.default.join(tempDirPath, outPath));
        }
    });
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _slash = require('slash2');

var _slash2 = _interopRequireDefault(_slash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TempDirName = 'plugin-multistage-route';