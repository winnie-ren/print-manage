// 文件上传
import config from "@/config"
import http from "@/utils/request"
const api = '/upload/multipart'
export default {
 // 多文件完整上传
 uploadScreenshot: {
  url: `${config.API_URL}${api}/uploadScreenshot`,
  name: "多文件完整上传",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 // 合并文件上传
 merge: {
  url: `${config.API_URL}${api}/merge`,
  name: "合并文件上传",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 // 分片初始化
 init: {
  url: `${config.API_URL}${api}/init`,
  name: "分片初始化",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 // 校验文件是否存在
 check: {
  url: `${config.API_URL}${api}/check`,
  name: "校验文件是否存在",
  get: async function (params = {}) {
   return await http.get(this.url, params);
  }
 },
 // 获取上传文件进度
 getUploadingFile: {
  url: `${config.API_URL}/upload/getUploadingFile/`,
  name: "获取上传文件进度",
  get: async function (fileMD5) {
   return await http.get(`${this.url}${fileMD5}`);
  }
 }
}