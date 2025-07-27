import http from "@/utils/request"

export default {
	userUpdate: {
		url: `/wenyin/api/v1/sysusins/update`,
		name: "更新用户",
		put: async function(data={}){
			return await http.put(this.url, data);
		}
 },
 userSave: {
		url: `/wenyin/api/v1/sysusins/save`,
		name: "保存用户",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
 },
 userPage: {
		url: `/wenyin/api/v1/sysusins/page`,
		name: "分页查询",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
 },
 userGetById: {
		url: `/wenyin/api/v1/sysusins/getById`,
		name: "用户详情",
		get: async function(data={}){
			return await http.get(this.url, data);
		}
 },
 userDelete: {
		url: `/wenyin/api/v1/sysusins/delete`,
		name: "删除用户",
		delete: async function(data={}){
			return await http.delete(this.url, data);
		}
 },
}
