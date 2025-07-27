import http from "@/utils/request"

export default {
	singleSave: {
		url: `/wenyin/api/v1/printsinglepage/save`,
		name: "单张保存",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	}
}
