import ora from "ora";
import { resolve } from "path";
function sleep(n) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, n);
  });
}
export const wrapLoading = async (message, fn, ...args) => {
  const spinner = ora(message);
  spinner.start();
  try {
    const res = await fn(...args); //aop 将用户逻辑包裹
    spinner.succeed();
    return res;
  } catch (error) {
    spinner.fail("request fail, refetching");
    await sleep(1000);
    return wrapLoading(message, fn, ...args);
  }
};
