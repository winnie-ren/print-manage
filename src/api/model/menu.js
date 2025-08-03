import config from "@/config"
import http from "@/utils/request"
const api = '/api/v1/sys/menus'
export default {
	userUpdate: {
		url: `${config.API_URL}${api}/update`,
		name: "更新菜单",
		put: async function(data={}){
			return await http.put(this.url, data);
		}
 },
 userSave: {
		url: `${config.API_URL}${api}/save`,
		name: "保存菜单",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
 },
 userPage: {
		url: `${config.API_URL}${api}/page`,
		name: "分页查询",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
 },
 userGetById: {
		url: `${config.API_URL}${api}/getById`,
		name: "菜单详情",
		get: async function(data={}){
			return await http.get(this.url, data);
		}
 },
 userDelete: {
		url: `${config.API_URL}${api}/delete`,
		name: "删除菜单",
		delete: async function(data={}){
			return await http.delete(this.url, data);
		}
 },
}
