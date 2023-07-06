import Configstore from "configstore";
import inquirer from "inquirer";
const conf = new Configstore("XU-cli");
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
async function askForOptions(initProjectName) {
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
  }
}
