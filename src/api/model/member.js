import config from "@/config"
import http from "@/utils/request"
const levelApi = '/api/v1/member/level'
export default {
 // 获取会员等级列表
 levelPage: {
  url: `${config.API_URL}${levelApi}/page`,
  name: "获取会员等级列表",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 // 保存会员等级
 levelSave: {
  url: `${config.API_URL}${levelApi}/save`,
  name: "保存会员等级",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 // 删除会员等级
 levelDelete: {
  url: `${config.API_URL}${levelApi}/delete`,
  name: "删除会员等级",
  delete: async function (ids) {
   return await http.delete(`${this.url}?ids=${ids.join(',')}`);
  }
 },
 // 获取充值记录列表
 rechargePage: {
  url: `${config.API_URL}/member/recharge/page`,
  name: "获取充值记录列表",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 // 保存充值记录
 rechargeSave: {
  url: `${config.API_URL}/member/recharge/save`,
  name: "保存充值记录",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 // 删除充值记录
 rechargeDelete: {
  url: `${config.API_URL}/member/recharge/delete`,
  name: "删除充值记录",
  delete: async function (ids) {
   return await http.delete(`${this.url}?ids=${ids.join(',')}`);
  }
 }
}
