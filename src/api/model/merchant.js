import config from "@/config"
import http from "@/utils/request"
const api = '/api/v1/sysmerchantinfo'
export default {
 merChantUpdate: {
  url: `${config.API_URL}${api}/update`,
  name: "更新用户",
  put: async function (data = {}) {
   return await http.put(this.url, data);
  }
 },
 merChantSave: {
  url: `${config.API_URL}${api}/save`,
  name: "保存用户",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 merChantPage: {
  url: `${config.API_URL}${api}/page`,
  name: "分页查询",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 merChantGetById: {
  url: `${config.API_URL}${api}/getById`,
  name: "用户详情",
  get: async function (data = {}) {
   return await http.get(this.url, data);
  }
 },
 merChantDelete: {
  url: `${config.API_URL}${api}/delete`,
  name: "删除用户",
  delete: async function (data = {}) {
   return await http.delete(this.url, data);
  }
 },
}
