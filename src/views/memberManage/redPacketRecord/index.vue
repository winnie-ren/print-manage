<template>
	<common-list-page
		ref="commonListPage"
		:api-obj="$API.member.redPacketPage"
		:search-config="searchConfig"
		:table-columns="tableColumns"
		:delete-api="noop"
		:save-api="noop"
		:hiddenHeader="true"
		:showOperationColumn="false"
		:useScForm="false"
	/>
</template>

<script>
import CommonListPage from "@/components/commonTable/index.vue";
export default {
	name: "redPacketRecord",
	components: {
		CommonListPage,
	},
	setup() {
		// 搜索配置
		const searchConfig = [
			{
				label: "流水号",
				name: "bizNo",
				component: "input",
				options: { placeholder: "请输入流水号" },
			},
			{
				label: "业务订单号",
				name: "orderNo",
				component: "input",
				options: { placeholder: "请输入业务订单号" },
			},
			{
				label: "领取人openid",
				name: "openId",
				component: "input",
				options: { placeholder: "请输入领取人openid" },
			},
			{
				label: "邀请关系",
				name: "redType",
				component: "select",
				options: {
					placeholder: "请选择邀请关系",
					items: [
						{ value: "INVITER", label: "邀请人" },
						{ value: "INVITEE", label: "被邀请" },
					],
				},
			},
			{
				label: "状态",
				name: "status",
				component: "select",
				options: {
					placeholder: "请选择状态",
					items: [
						{ value: "NO_PAY", label: "未支付" },
						{ value: "PAYING", label: "已下单等待支付" },
						{ value: "SUCCESS", label: "支付成功" },
						{ value: "FAIL", label: "支付失败" },
						{ value: "CLOSED", label: "已关闭或超时" },
					],
				},
			},
			{
				label: "支付渠道",
				name: "paymentType",
				component: "select",
				options: {
					placeholder: "请选择支付渠道",
					items: [
						{ value: "WECHAT", label: "微信" },
						{ value: "ALIPAY", label: "支付宝" },
					],
				},
			},
		];

		// 表格列配置
		const tableColumns = [
			{ label: "流水号", name: "bizNo", width: 200 },
			{ label: "业务订单号", name: "orderNo", width: 180 },
			{ label: "领取人openid", name: "openId", width: 180 },
			{
				label: "邀请关系",
				name: "redType",
				format: "INVITER:邀请人/INVITEE:被邀请",
			},
			{
				label: "金额",
				name: "amount",
				formatter: (row) => `${((row.amount ?? 0) / 100).toFixed(2)}元`,
			},
			{
				label: "状态",
				name: "status",
				format: "NO_PAY:未支付/PAYING:已下单等待支付/SUCCESS:支付成功/FAIL:支付失败/CLOSED:已关闭或超时",
			},
			{
				label: "支付渠道",
				name: "paymentType",
				format: "WECHAT:微信/ALIPAY:支付宝",
			},
			{ label: "客户端IP", name: "clientIp", width: 140 },
			// { label: "请求参数", name: "sendParams", width: 220 },
			// { label: "错误码", name: "errCode", width: 120 },
			// { label: "错误信息", name: "errMsg", width: 200 },
			{ label: "发送时间", name: "sendTime", width: 160 },
			{ label: "完成时间", name: "finishTime", width: 160 },
			{ label: "创建时间", name: "createTime", width: 160 },
			{ label: "修改时间", name: "updateTime", width: 160 },
		];
		// 仅查询用的空实现（CommonListPage 必传）
		const noop = async () => Promise.resolve({ code: 0 });
		return {
			searchConfig,
			tableColumns,
			noop,
		};
	},
};
</script>
<style scoped>
/* 可添加特定样式 */
</style>
