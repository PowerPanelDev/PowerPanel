### PowerPanel

PowerPanel 将延续翼龙面板的诸多优点，像优秀的设计理念等。当然，翼龙面板有许多不是非常人性化的地方，也有很多历史遗留问题（如 i18n），我们希望可以扬长避短，设计更为合理的功能。

整个项目由多个项目组成：

- PowerPanelDev/Panel 前端 (Vue3)
- PowerPanelDev/Webman 后端 (PHP-Webman)
- PowerPanelDev/Node 节点端 (PHP-Webman+Workerman+Swoole)

相较于翼龙面板，PowerPanel 具有更多优势：

- PowerPanel 处理了乱码问题，支持在面板操作乱码文件，同时，也降低了出现乱码问题的可能性。
- PowerPanel 支持文件切片上传，支持超大文件上传；同时，也解决了翼龙在非 Chromium 内核移动浏览器下无法下载文件的问题。

可拓展性是 PowerPanel 最先考虑的因素。因此，在我们的设计中，这三个组成部分都可以支持插件，包括事件系统和 API 等，以实现更多方便的功能。

**当前项目正处于开发、设计阶段，API 可能会有较大改动，也可能会经历多次迭代重构，非常不建议在生产环境中使用。**

**本仓库非开发仓库，只会由开发者定期从国内开发仓库同步，若您想参与 PowerPanel 的开发，请发送邮件至 letsgo@88.com**