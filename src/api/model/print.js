import http from "@/utils/request"
import config from "@/config"
const singleApi = '/api/v1/print/singlepage'
const blackApi = '/api/v1/print/blackbook'
const colorApi = '/api/v1/print/colorbook'
const biddingApi = '/api/v1/print/bidding'
export default {
	singleSave: {
		url: `${config.API_URL}${singleApi}/save`,
		name: "单张保存",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	singleDelete: {
		url: `${config.API_URL}${singleApi}/delete`,
		name: "单张删除",
		delete: async function (data = {}) {
			return await http.delete(this.url, data);
		}
	},
	singlePage: {
		url: `${config.API_URL}${singleApi}/page`,
		name: "单张分页查询",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	singleGetById: {
		url: `${config.API_URL}${singleApi}/getById`,
		name: "单张获取",
		get: async function (data = {}) {
			return await http.get(this.url, data);
		}
	},
	blackPage: {
		url: `${config.API_URL}${blackApi}/page`,
		name: "黑白分页查询",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	blackSave: {
		url: `${config.API_URL}${blackApi}/save`,
		name: "黑白保存",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	blackDelete: {
		url: `${config.API_URL}${blackApi}/delete`,
		name: "黑白删除",
		delete: async function (data = {}) {
			return await http.delete(this.url, data);
		}
	},
	blackGetById: {
		url: `${config.API_URL}${blackApi}/getById`,
		name: "黑白获取",
		get: async function (data = {}) {
			return await http.get(this.url, data);
		}
	},
	colorPage: {
		url: `${config.API_URL}${colorApi}/page`,
		name: "彩色分页查询",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	colorSave: {
		url: `${config.API_URL}${colorApi}/save`,
		name: "彩色保存",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	colorDelete: {
		url: `${config.API_URL}${colorApi}/delete`,
		name: "彩色删除",
		delete: async function (data = {}) {
			return await http.delete(this.url, data);
		}
	},
	colorGetById: {
		url: `${config.API_URL}${colorApi}/getById`,
		name: "彩色获取",
		get: async function (data = {}) {
			return await http.get(this.url, data);
		}
	},
	biddingPage: {
		url: `${config.API_URL}${biddingApi}/page`,
		name: "标书分页查询",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	biddingSave: {
		url: `${config.API_URL}${biddingApi}/save`,
		name: "标书保存",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	biddingDelete: {
		url: `${config.API_URL}${biddingApi}/delete`,
		name: "标书删除",
		delete: async function (data = {}) {
			return await http.delete(this.url, data);
		}
	},
	biddingGetById: {
		url: `${config.API_URL}${biddingApi}/getById`,
		name: "标书获取",
		get: async function (data = {}) {
			return await http.get(this.url, data);
		}
	},
	payOrder: {
		url: `${config.API_URL}/pay/payOrder`,
		name: "预支付订单",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
}
