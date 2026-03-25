import config from "@/config"
import http from "@/utils/request"
const api = '/api/v1/sysusins'
export default {
	userUpdate: {
		url: `${config.API_URL}${api}/update`,
		name: "更新用户",
		put: async function (data = {}) {
			return await http.put(this.url, data);
		}
	},
	userSave: {
		url: `${config.API_URL}${api}/save`,
		name: "保存用户",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	userPage: {
		url: `${config.API_URL}${api}/page`,
		name: "分页查询",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	unsignRolePage: {
		url: `${config.API_URL}${api}/unsignRolePage`,
		name: "分页角色人员查询",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	userGetById: {
		url: `${config.API_URL}${api}/getById`,
		name: "用户详情",
		get: async function (data = {}) {
			return await http.get(this.url, data);
		}
	},
	userDelete: {
		url: `${config.API_URL}${api}/delete`,
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
	rechargeSave: {
		url: `${config.API_URL}/api/v1/trechargeorder/save`,
		name: "充值订单保存",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	rechargeGetByStatus: {
		url: `${config.API_URL}/api/v1/trechargeorder/getByStatus`,
		name: "充值状态查询",
		get: async function (data = {}) {
			return await http.get(this.url, data);
		}
	},
	info: {
		url: `${config.API_URL}${api}/info`,
		name: "用户信息",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
}
