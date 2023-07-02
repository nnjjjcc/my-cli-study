#!/usr/bin/env node
import { program } from "commander";
import path from "path";
import { dirname, join } from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import chalk from "chalk";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const pkg = require(join(__dirname, "../package.json"));
//import.meta.url 返回模块的绝对的 `file:` URL
//解析用户传递参数
program.version(`my-cli@${pkg.version}`).usage("<command> [option]");
//1.通过脚手架创建一个项目 create（拉取仓库的模板，下载方式可以采用github gitlab gitee）
//2.配置拉取的信息，配置系统文件 config
//
program
  .command("create <project-name>")
  .description("create a project")
  .option("-f,--force", "overwrite target directory")
  .action(async (name, Option) => {
    (await import("./commands/create.js")).default(name, Option);
  });
program
  .command("config [value]")
  .description("inspect config")
  .option("-g,--get <path>", "get value")
  .option("-s,--set <path> <value>", "set value")
  .option("-d,--delete <path> <value>", "delete value")
  .action(async (value, Option) => {
    (await import("./commands/config.js")).default(value, Option);
  });
program.addHelpText(
  "after",
  `Ren ${chalk.blueBright(
    "my-cli <command> --help"
  )} for detailed usage of given command`
);
//用户传递的参数
program.parse(process.argv); //直接解析用户参数自动提高--help
