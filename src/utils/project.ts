import axios from "axios";
import { constants } from "buffer";
export const defaultConfig = {
  organization: "heng-chu",
  accessToken: "933ee0c2e9e11f414c1909861965fb1d",
};
const { organization, accessToken } = defaultConfig;
export async function getOrganizationProjects() {
  const res = await axios.get(
    `https://gitee.com/api/v5/orgs/${organization}/repos`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data.map((item) => item.name);
}
export async function getOrganizationVersions(repo) {
  const res = await axios.get(
    `https://gitee.com/api/v5/repos/${organization}/${repo}/tags`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data.map((item) => item.name);
}
