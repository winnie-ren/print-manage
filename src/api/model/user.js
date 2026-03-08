import config from "@/config"
import http from "@/utils/request"

export default {
	userUpdate: {
		url: `${config.API_URL}/api/v1/sysusins/update`,
		name: "更新用户",
		put: async function (data = {}) {
			return await http.put(this.url, data);
		}
	},
	userSave: {
		url: `${config.API_URL}/api/v1/sysusins/save`,
		name: "保存用户",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	userPage: {
		url: `${config.API_URL}/api/v1/sysusins/page`,
		name: "分页查询",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	userGetById: {
		url: `${config.API_URL}/api/v1/sysusins/getById`,
		name: "用户详情",
		get: async function (data = {}) {
			return await http.get(this.url, data);
		}
	},
	userDelete: {
		url: `${config.API_URL}/api/v1/sysusins/delete`,
		name: "删除用户",
		delete: async function (data = {}) {
			return await http.delete(this.url, data);
		}
	},
	recharge: {
		url: `${config.API_URL}/api/v1/trechargeorder/money`,
		name: "充值",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	info: {
		url: `${config.API_URL}/api/v1/sysusins/info`,
		name: "用户信息",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
}
