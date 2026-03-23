import config from "@/config"
import http from "@/utils/request"
const levelApi = '/api/v1/tmemberlevel'
const userApi = '/api/v1/tmemberuser'
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
 // 更新会员等级
 levelUpdate: {
  url: `${config.API_URL}${levelApi}/update`,
  name: "更新会员等级",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 // 获取会员等级
 levelGetById: {
  url: `${config.API_URL}${levelApi}/getById`,
  name: "获取会员等级",
  get: async function (data = {}) {
   return await http.get(this.url, data);
  }
 },
 // 删除会员等级
 levelDelete: {
  url: `${config.API_URL}${levelApi}/delete`,
  name: "删除会员等级",
  delete: async function (ids) {
   return await http.delete(this.url, ids);
  }
 },
 // 获取会员用户列表
 userPage: {
  url: `${config.API_URL}${userApi}/page`,
  name: "获取会员用户列表",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 // 获取会员用户列表
 unsignPage: {
  url: `${config.API_URL}/api/v1/sysusins/unsignpage`,
  name: "获取会员用户列表",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 // 获取会员用户列表
 tmemberuserPage: {
  url: `${config.API_URL}/api/v1/tmemberuser/page`,
  name: "获取会员用户列表",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 // 保存会员用户
 userSave: {
  url: `${config.API_URL}${userApi}/save`,
  name: "保存会员用户",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 // 批量保存会员用户
 userBatchSave: {
  url: `${config.API_URL}${userApi}/batchSave`,
  name: "批量保存会员用户",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 // 更新会员用户
 userUpdate: {
  url: `${config.API_URL}${userApi}/update`,
  name: "更新会员用户",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
 // 获取会员用户
 userGetById: {
  url: `${config.API_URL}${userApi}/getById`,
  name: "获取会员用户",
  get: async function (data = {}) {
   return await http.get(this.url, data);
  }
 },
 // 删除会员用户
 userDelete: {
  url: `${config.API_URL}${userApi}/delete`,
  name: "删除会员用户",
  delete: async function (ids) {
   return await http.delete(this.url, ids);
  }
 },
 // 获取充值记录列表
 rechargePage: {
  url: `${config.API_URL}/api/v1/trechargeorder/page`,
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
 },
  // 获取红包记录列表
 redPacketPage: {
  url: `${config.API_URL}/api/v1/redpackorder/page`,
  name: "获取红包记录列表",
  post: async function (data = {}) {
   return await http.post(this.url, data);
  }
 },
}
