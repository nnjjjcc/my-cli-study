import path from "path";
import { existsSync, rmSync } from "fs";
import inquirer from "inquirer";
import { wrapLoading } from "../utils/loading.js";
import { getOrganizationProjects } from "../utils/project.js";
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
  let { action } = await inquirer.prompt([
    {
      name: "action",
      type: "list",
      message: "请选择项目列表",
      choices: projects,
    },
  ]);
}
