# RBCC Redbird Board

这是一个给红鸟挑战营 5 人小组使用的轻量项目协作看板。

## 功能

- 4 个核心数字可新增、编辑、删除
- 未来 10 日日程可新增、编辑、删除
- 任务看板可新增、编辑、删除
- 决策日志可新增、编辑、删除
- 贡献记录可新增、编辑、删除
- 前端可以直接用浏览器本地保存
- 启动 Spring Boot 后可以把数据同步到 MySQL

## 直接打开前端

打开：

`src/main/resources/static/index.html`

这种方式不需要后端，数据保存在当前浏览器的 localStorage。

## 使用 MySQL + Spring Boot

1. 在 Navicat 里执行：

   `database/schema.sql`

2. 修改：

   `src/main/resources/application.properties`

   把 MySQL 用户名和密码改成你自己的。

3. 在 IDEA 里打开整个 `rbcc` 文件夹。

4. 如果 Maven 报安装目录 `localRepository` 没权限，在 IDEA 的 Maven settings 里选择本项目的：

   `maven-settings.xml`

5. 运行：

   `com.redbird.rbcc.RbccApplication`

6. 浏览器打开：

   `http://localhost:8082`

页面会先读 MySQL 数据；保存时会同步到 MySQL。
