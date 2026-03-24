import config from "@/config"
import http from "@/utils/request"
const api = '/api/v1/sysroles'
const usinApi = '/api/v1/sysroles/usin'
export default {
	userUpdate: {
		url: `${config.API_URL}${api}/update`,
		name: "更新角色",
		put: async function (data = {}) {
			return await http.put(this.url, data);
		}
	},
	userSave: {
		url: `${config.API_URL}${api}/save`,
		name: "保存角色",
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
	userGetById: {
		url: `${config.API_URL}${api}/getById`,
		name: "角色详情",
		get: async function (data = {}) {
			return await http.get(this.url, data);
		}
	},
	userDelete: {
		url: `${config.API_URL}${api}/delete`,
		name: "删除角色",
		delete: async function (data = {}) {
			return await http.delete(this.url, data);
		}
	},
	// 角色下用户分页（查看用户）
	roleUserPage: {
		url: `${config.API_URL}${usinApi}/page`,
		name: "角色下用户分页",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	// 角色绑定用户（批量添加）
	roleUserBatchSave: {
		url: `${config.API_URL}${usinApi}/batchSave`,
		name: "角色绑定用户",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	// 角色解绑用户（批量删除）
	roleUserDelete: {
		url: `${config.API_URL}${usinApi}/delete`,
		name: "角色解绑用户",
		delete: async function (data = {}) {
			return await http.delete(this.url, data);
		}
	},

}
