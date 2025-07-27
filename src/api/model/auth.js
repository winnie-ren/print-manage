import config from "@/config"
import http from "@/utils/request"

export default {
	token: {
		url: `${config.API_URL}/token`,
		name: "登录获取TOKEN",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	dologin: {
		url: `${config.API_URL}/dologin`,
		name: "登录",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	info: {
		url: `${config.API_URL}/info`,
		name: "用户信息",
		get: async function (data = {}) {
			return await http.get(this.url, data);
		}
	},
	loginout: {
		url: `${config.API_URL}/loginout`,
		name: "退出登录",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	}
}
