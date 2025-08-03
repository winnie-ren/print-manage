import http from "@/utils/request"
import config from "@/config"
const singleApi = '/api/v1/print/singlepage'
export default {
	singleSave: {
		url: `${config.API_URL}${singleApi}/save`,
		name: "单张保存",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	}
}
