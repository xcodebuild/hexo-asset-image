# hexo-asset-image-fixed

本仓库修复了原包在`文章标题出现[http]/[https]等关键词时会无法转换src`的问题

This repository fix a bug that `Cannot transfer the property 'scr' when the title contains a keyword like[http]/[https]`

由于提交[PR](https://github.com/dangxuandev/hexo-asset-image/pull/42)后原作者一直没有更新，暂时将此仓库作为新的npm包发布。

Because of my [PR](https://github.com/dangxuandev/hexo-asset-image/pull/42) being ignored by the author, who seems will not maintain this repository anymore, I published this repository as the new npm package temporarily.

自动将hexo中的图片资源替换为绝对路径

Give asset image in hexo a absolutely path automatically

# Usege

```shell
npm install hexo-asset-image-fixed --save
```

# Example

```shell
MacGesture2-Publish
├── apppicker.jpg
├── logo.jpg
└── rules.jpg
MacGesture2-Publish.md
```

确保网站配置`_config.yml`中选项设置为：`post_asset_folder: true`。

Make sure `post_asset_folder: true` in your `_config.yml`.

就可以直接使用`![logo](logo.jpg)`来插入图片`logo.jpg`啦。

Just use `![logo](logo.jpg)` to insert `logo.jpg`.
