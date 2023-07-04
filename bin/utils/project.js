var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
export const defaultConfig = {
    organization: "heng-chu",
    accessToken: "933ee0c2e9e11f414c1909861965fb1d",
};
const { organization, accessToken } = defaultConfig;
export function getOrganizationProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield axios.get("https://api.github.com/orgs/zhurong-cli/repos");
        return res.data.map((item) => item.name);
    });
}
export function getOrganizationVersions(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield axios.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`);
        return res.data.map((item) => item.name);
    });
}
