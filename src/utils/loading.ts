import ora from "ora";
export const wrapLoading = async (message, fn) => {
  const spinner = ora(message);
  spinner.start();
  const res = await fn(); //aop 将用户逻辑包裹
  spinner.succeed();
  return res;
};
