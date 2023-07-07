import Configstore from "configstore";
import inquirer from "inquirer";
import { exec, fork } from "child_process";
const conf = new Configstore("XU-cli");
let animation = null;
async function startCreateByPreSetRules(initProjectName, isPreSetRules) {
  // 进入预设流程
  let preSetRule = isPreSetRules.selectRule
    .split("(")[1]
    .split(")")[0]
    .split(",");
  let installCommand = `npm i ${preSetRule.join(" ")}`;
  // npm i package1 package2 package3
  let isTs = isPreSetRules.selectRule.includes("TypeScript");
  //判断是否有ts
  // 开始使用vite create命令创建项目
  let initCommand = `npm create vite@latest ${initProjectName} --template vue`;
  let loadingInterval: any = loadingAnimation();
  //过场动画
  if (isTs) {
    await execCreateTs(initCommand);
  } else {
    await execCreateJs(initCommand);
  }
  clearInterval(loadingInterval);
  setTimeout(async () => {
    process.chdir(`${initProjectName}`);
    console.log("\n\x1b[32m√\x1b[0m 项目创建完成");
    // 安装依赖
    let loadingInterval: any = loadingAnimation();
    await execNpmInstall("npm i");
    await execNpmInstall(installCommand);
    clearInterval(loadingInterval);
    console.log("\n\x1b[32m√\x1b[0m 依赖安装完成");
    process.exit();
  }, 1000);
}
async function waitUserPresskey() {
  return await new Promise((resolve, reject) => {
    process.stdin.setRawMode(true);
    //设置标准输入流为原始模式，这将允许监听单个按键的输入。
    process.stdin.resume();
    //恢复标准输入流的读取，这样可以开始监听用户的输入。
    process.stdin.on("data", (key: any) => {
      key = key.toString("ascii");
      resolve(key);
    });
  });
}
async function selectFramework(child) {
  let input = await waitUserPresskey();
  // 如果按下ctrl+c，退出进程
  if (input === "\u0003") {
    process.exit();
  }
  child.stdin.write(input);
}
//安装
function execNpmInstall(command) {
  console.log("exec：", command);
  // 使用 exec() 函数执行传入的 command 命令，通过回调函数获取执行结果
  return new Promise((resolve, reject) => {
    const child = exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }
    });
    child.stdout.on("data", async (data) => {
      // 当npm i 完成时
      if (data.includes("packages in")) {
        console.log("\n", data);
        resolve(child.stdout);
      }
      if (data.includes("is not empty")) {
        // 退出进程
        console.log("\n\x1b[31m×\x1b[0m 目录已存在");
        process.exit();
      }
    });
  });
}
// 清除加载动画并还原命令行界面
function clearAnimation() {
  process.stdout.write("\r\x1b[K\x1b[0G");
  clearInterval(animation);
}
//js下载
function execCreateJs(command) {
  console.log("exec：", command);
  return new Promise((resolve, reject) => {
    const child = exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }
    });
    child.stdout.on("data", async (data) => {
      if (data.includes("is not empty")) {
        // 退出进程
        console.log("\n\x1b[31m×\x1b[0m 目录已存在");
        process.exit();
      }
      child.stdin.write("\x1b[B\n");
      resolve(child.stdout);
    });
  });
}
//TS下载
function execCreateTs(command) {
  //进程
  console.log("exec：", command);
  return new Promise((resolve, reject) => {
    const child = exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log("err::: ", err);
        reject(err);
      }
    });
    child.stdout.on("data", async (data) => {
      if (data.includes("Package name")) {
        process.stdout.write("\x1b[32m" + data + "\x1b[0m");
        child.stdin.write("\n");
      }
      if (data.includes("Vue")) {
        process.stdout.write("\x1b[2J\x1b[0f");
        process.stdout.write("\x1b[32m" + data + "\x1b[0m");
        clearAnimation();
        selectFramework(child);
      }
      if (data.includes("TypeScript")) {
        process.stdout.write("\x1b[32m" + data + "\x1b[0m");
        process.stdout.write("\x1b[2J\x1b[0f");
        child.stdin.write("\n");
        resolve(child.stdout);
      }
      if (data.includes("is not empty")) {
        // 退出进程
        console.log("\n\x1b[31m×\x1b[0m 目录已存在");
        process.exit();
      }
    });
  });
}
function loadingAnimation() {
  let frames = ["-", "\\", "|", "/"];
  let i = 0;
  animation = setInterval(() => {
    process.stdout.write(
      "\r\x1b[K\x1b[0G\x1b[32m" + frames[i++] + "  正在执行...\x1b[0m"
    );
    i %= frames.length;
  }, 100);
}
async function startCreate(initProjectName, answer) {
  let { cssPreprocessor, vuexorpinia, vueRouter, otherPackages, jsorts } =
    answer;
  let installs = [];
  cssPreprocessor !== "no" && installs.push(cssPreprocessor);
  vueRouter !== "no" && installs.push("vue-router");
  vuexorpinia !== "no" && installs.push(vuexorpinia);
  if (otherPackages !== "") {
    let otherPackages = answer.otherPackages.split(" ");
    installs = installs.concat(otherPackages);
  }
  //下载
  let installCommand = `npm i ${installs.join(" ")}`;
  // 开始使用vite create命令创建项目
  let initCommand = `npm create vite@latest ${initProjectName} --template vue`;
  loadingAnimation();
  if (jsorts === "TypeScript") {
    await execCreateTs(initCommand);
  } else {
    await execCreateJs(initCommand);
  }
  clearAnimation();
  setTimeout(async () => {
    process.chdir(`${initProjectName}`);
    console.log("\n\x1b[32m√\x1b[0m 项目创建完成");
    // 安装依赖
    loadingAnimation();
    await execNpmInstall("npm i");
    await execNpmInstall(installCommand);
    clearAnimation();
    console.log("\n\x1b[32m√\x1b[0m 依赖安装完成");
    process.exit();
  }, 1000);
}

//设置自定义规则，保存到配置文件中
async function setCustomRules(answer) {
  let { cssPreprocessor, vuexorpinia, vueRouter } = answer;
  let installs = [];
  let ruleName = await inquirer.prompt({
    name: "saveName",
    type: "input",
    message: "请输入保存的方案名称",
  });
  cssPreprocessor !== "no" && installs.push(cssPreprocessor);
  vueRouter !== "no" && installs.push("vue-router");
  vuexorpinia !== "no" && installs.push(vuexorpinia);
  if (answer.otherPackages !== "") {
    let otherPackages = answer.otherPackages.split(" ");
    installs = installs.concat(otherPackages);
  }
  let saveObj = {
    isTs: answer.jsorts === "TypeScript",
    installs,
    saveName: ruleName.saveName,
  };
  let customRulesList = conf.get("customRulesList");
  if (customRulesList !== undefined) {
    customRulesList[saveObj.saveName] = saveObj;
  } else {
    customRulesList = {};
    conf.set("customRulesList", customRulesList);
    customRulesList[saveObj.saveName] = saveObj;
  }
  conf.set("customRulesList", customRulesList);
}
//清除
function clearCustomRules() {
  conf.delete("customRulesList");
  console.log("\n\x1b[32m√\x1b[0m 自定义方案已清除");
}
function getCustomRulesList() {
  const customRulesList = conf.get("customRulesList");
  if (customRulesList) {
    let result = [];
    for (let key in customRulesList) {
      let item = customRulesList[key];
      result.push(
        `${item.saveName}(${item.installs}),${
          item.isTs ? "TypeScript" : "JavaScript"
        }`
      );
    }
    return result;
  } else {
    return [];
  }
}
//init 主函数
export default async function askForOptions(initProjectName) {
  const customRulesList = getCustomRulesList();
  let preSetRulesList = [
    "default(vue-router,vuex,less),JavaScript",
    "进入自定义流程",
  ];
  if (customRulesList.length > 0) {
    preSetRulesList.push("清除自定义方案");
  }
  customRulesList.forEach((item) => {
    preSetRulesList.unshift(item);
  });
  let preSetRules = [
    {
      name: "selectRule",
      type: "list",
      message: "选择一个预设规则，或者进入自定义流程",
      choices: preSetRulesList,
    },
  ];
  let isPreSetRules = await inquirer.prompt(preSetRules);
  if (isPreSetRules.selectRule === "清除自定义方案") {
    clearCustomRules();
    askForOptions(initProjectName);
    return;
  }
  if (isPreSetRules.selectRule !== "进入自定义流程") {
    startCreateByPreSetRules(initProjectName, isPreSetRules);
    let customRulesList = conf.get("customRulesList");
    console.log("conf", customRulesList);
  } else {
    // 进入自定义流程
    let preInstall = [
      {
        name: "cssPreprocessor",
        type: "list",
        message: "你想安装一个css预处理器吗?",
        choices: ["less", "sass", "Stylus", "no"],
      },
      {
        name: "jsorts",
        type: "list",
        message: "你使用 JavaScript 还是 TypeScript?",
        choices: ["JavaScript", "TypeScript"],
      },
      {
        name: "vueRouter",
        type: "list",
        message: "你需要vue-router吗?",
        choices: ["yes", "no"],
      },
      {
        name: "vuexorpinia",
        type: "list",
        message: "你需要vuex🍕 或者pinia🍍 吗?",
        choices: ["vuex", "pinia", "no"],
      },
      {
        name: "otherPackages",
        type: "input",
        message: `你需要任何其他包吗(以空格隔开):`,
      },
      {
        name: "save",
        type: "list",
        message: "将此方案保存吗?",
        choices: ["yes", "no"],
      },
    ];
    let answer = await inquirer.prompt(preInstall);
    let { save } = answer;
    if (save === "yes") {
      await setCustomRules(answer);
    }
    await startCreate(initProjectName, answer);
  }
}
