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
	singlePage: {
		url: `${config.API_URL}${singleApi}/page`,
		name: "单张分页查询",
		post: async function (data = {}) {
			return await http.post(this.url, data);
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
	payOrder: {
		url: `${config.API_URL}/pay/payOrder`,
		name: "预支付订单",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
}
