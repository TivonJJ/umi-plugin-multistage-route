<!-- @format -->

# umi-plugin-multistage-route
多级路由装饰器，利用show和hide来保存父路由状态

## Usage

在routes配置中,多极路由的父路由上增加属性multistage

multistage: boolean | {forceRender:boolean}

``` json
{
  path: 'multistage-routes',
  component: './demo/components/multistage-routes/index',
  multistage: true,
  routes: [
    {
      path: 'second',
      component: './demo/components/multistage-routes/second/index',
    }
  ]
}
```

## LICENSE

MIT
