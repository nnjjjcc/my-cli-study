#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { program } from "commander";
import Configstore from "configstore";
import { dirname, join } from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import figlet from "figlet";
import chalk from "chalk";
const conf = new Configstore("XU-cli");
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const pkg = require(join(__dirname, "../package.json"));
//import.meta.url 返回模块的绝对的 `file:` URL
//解析用户传递参数
program
    .version(`my-cli@${pkg.version}`)
    .usage("<command> [option]")
    .description(`xs-cli是一款用于快速创建vite项目的脚手架工具`);
//1.通过脚手架创建一个项目 create（拉取仓库的模板，下载方式可以采用github gitlab gitee）
//2.配置拉取的信息，配置系统文件 config
//
program
    .command("create <project-name>")
    .description("create a project")
    .option("-f,--force", "overwrite target directory")
    .action((name, Option) => __awaiter(void 0, void 0, void 0, function* () {
    (yield import("./commands/create.js")).default(name, Option);
}));
program
    .command("init <projectName>")
    .description("使用xu-cli创建项目")
    .option("-p, --projectName <string>", "project name")
    .action((initProjectName) => __awaiter(void 0, void 0, void 0, function* () {
    yield askForOptions(initProjectName); //这里调用我们的自定义问询函数
}));
program
    .command("config [value]")
    .description("inspect config")
    .option("-g,--get <path>", "get value") //  获取某个配置项
    .option("-s,--set <path> <value>", "set value") //设置一个配置项
    .option("-d,--delete <path> <value>", "delete value") //删除一个配置项
    .option("-a,--all [value]", "get all config") //获取所有配置项
    .action((value, Option) => __awaiter(void 0, void 0, void 0, function* () {
    (yield import("./commands/config.js")).default(value, Option);
}));
program.on("--help", function () {
    console.log("\r\n" +
        figlet.textSync("XS-cli", {
            font: "3D-ASCII",
            horizontalLayout: "default",
            verticalLayout: "default",
            width: 80,
            whitespaceBreak: true,
        }));
    // 前后两个空行调整格式，更舒适
    console.log(`Run ${chalk.cyan("my-cli <command> --help")} for detailed usage of given command.`);
    console.log();
});
// program.addHelpText(
//   "after",
//   `Ren ${chalk.blueBright(
//     "my-cli <command> --help"
//   )} for detailed usage of given command`
// );
//用户传递的参数
program.parse(process.argv); //直接解析用户参数自动提高--help
