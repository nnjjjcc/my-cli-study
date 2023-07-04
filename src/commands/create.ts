import path from "path";
import { existsSync, rmSync } from "fs";
import inquirer from "inquirer";
import downloadGitRepo from "download-git-repo";
import { promisify } from "util";
import { wrapLoading } from "../utils/loading.js";
import chalk from "chalk";
import {
  getOrganizationProjects,
  getOrganizationVersions,
} from "../utils/project.js";
export default async function (name, Option) {
  const cwd = process.cwd(); //获取当前项目的工作目录
  const targetDir = path.join(cwd, name);

  //判断文件是否存在
  if (existsSync(targetDir)) {
    if (Option.force) {
      rmSync(targetDir, { recursive: true }); //递归删除目录
    } else {
      //询问用户,是否要删除
      let { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: "目录存在了是否要覆盖",
          choices: [
            { name: "overwrite", value: "overwrite" },
            { name: "cancel", value: false },
          ],
        },
      ]);
      if (!action) {
        return console.log("用户取消创建");
      }
      if (action === "overwrite") {
        await wrapLoading("remove", () => {
          rmSync(targetDir, { recursive: true });
        });
      }
    }
  }
  let projects = await getOrganizationProjects();
  let { projectName } = await inquirer.prompt([
    {
      name: "projectName",
      type: "list",
      message: "请选择项目列表",
      choices: projects,
    },
  ]);
  let tags = await getOrganizationVersions(projectName);
  let { tag } = await inquirer.prompt({
    name: "tag",
    type: "list",
    message: "请选择对应的版本",
    choices: tags,
  });
  console.log(tag, projectName);
  //获取项目下载到本地

  const newDownloadGitRepo = promisify(downloadGitRepo);
  async function downloadOrganization(projectName, tag) {
    const templateUrl = `zhurong-cli/${projectName}${tag ? "#" + tag : ""}`;
    await wrapLoading(
      "downloading template, please wait",
      newDownloadGitRepo,
      templateUrl,
      path.resolve(cwd, targetDir) // 项目创建位置
    );
  }
  let data = await downloadOrganization(projectName, tag);
  console.log(`\r\nSuccessfully created project ${chalk.cyan(projectName)}`);
  console.log(`\r\n  cd ${chalk.cyan(projectName)}`);
  console.log("  npm install\r\n");
  console.log("  npm run dev\r\n");
}
