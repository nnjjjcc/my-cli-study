import axios from "axios";
import { constants } from "buffer";
import { exec } from "child_process";
import { wrapLoading } from "../utils/loading.js";
export const defaultConfig = {
  organization: "heng-chu",
  accessToken: "933ee0c2e9e11f414c1909861965fb1d",
};
const { organization, accessToken } = defaultConfig;
export async function getOrganizationProjects() {
  const res = await axios.get("https://api.github.com/orgs/zhurong-cli/repos");
  return res.data.map((item) => item.name);
}
export async function getOrganizationVersions(repo) {
  const res = await axios.get(
    `https://api.github.com/repos/zhurong-cli/${repo}/tags`
  );
  return res.data.map((item) => item.name);
}
