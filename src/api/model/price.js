import http from "@/utils/request"
import config from "@/config"
const priceApi = '/api/v1/print/price/setting'
export default {
 priceUpdate: {
		url: `${config.API_URL}${priceApi}/update`,
		name: "更新价格",
		put: async function(data={}){
			return await http.put(this.url, data);
		}
 },
 priceSave: {
		url: `${config.API_URL}${priceApi}/save`,
		name: "保存价格",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
 },
 pricePage: {
		url: `${config.API_URL}${priceApi}/page`,
		name: "分页查询",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
 },
 priceGetById: {
		url: `${config.API_URL}${priceApi}/getById`,
		name: "价格详情",
		get: async function(data={}){
			return await http.get(this.url, data);
		}
 },
 priceDelete: {
		url: `${config.API_URL}${priceApi}/delete`,
		name: "删除价格",
		delete: async function(data={}){
			return await http.delete(this.url, data);
		}
 },
}
