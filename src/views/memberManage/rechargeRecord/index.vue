<template>
	<common-list-page
		ref="commonListPage"
		:api-obj="$API.member.rechargePage"
		:search-config="searchConfig"
		:table-columns="tableColumns"
		:form-config="formConfig"
		:edit-disabled-fields="['serialNumber']"
		:delete-api="deleteRecharge"
		:save-api="saveRecharge"
		:hiddenHeader="true"
		:showOperationColumn="false"
		@add="handleAdd"
		@edit="handleEdit"
		@view="handleView"
		@submit="handleSubmit"
	/>
</template>

<script>
import CommonListPage from "@/components/commonTable/index.vue";
import { getCurrentInstance } from "vue";

export default {
	name: "memberLevel",
	components: {
		CommonListPage,
	},
	setup() {
		const instance = getCurrentInstance();
		const $API = instance.proxy.$API;

		// 搜索配置
		const searchConfig = [
			{
				label: "充值单号",
				name: "rechargeNo",
				component: "input",
				options: { placeholder: "请输入充值单号" },
			},
			{
				label: "账号",
				name: "accountNo",
				component: "input",
				options: { placeholder: "请输入账号" },
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
		];

		// 表格列配置
		const tableColumns = [
			{
				label: "充值单号",
				name: "rechargeNo",
				width: 180,
			},
			{
				label: "用户编码",
				name: "userId",
				width: 150,
			},
			{
				label: "账号",
				name: "accountNo",
				width: 150,
			},
			{
				label: "实际支付金额",
				name: "payAmount",
				formatter: (row) => {
					return `${row.payAmount}元`;
				},
			},
			{
				label: "赠送金额",
				name: "giftAmount",
				formatter: (row) => {
					return `${row.giftAmount}元`;
				},
			},
			{
				label: "到账总额",
				name: "totalAmount",
				formatter: (row) => {
					return `${row.totalAmount}元`;
				},
			},
			{
				label: "状态",
				name: "status",
				format: "NO_PAY:未支付/PAYING:已下单等待支付/SUCCESS:支付成功/FAIL:支付失败/CLOSED:已关闭或超时",
			},
			{
				label: "充值时间",
				name: "createTime",
				width: 160,
			},
		];

		// 表单配置
		const formConfig = {
			labelWidth: 100,
			labelPosition: "right",
			formItems: [
				{
					label: "充值单号",
					name: "rechargeNo",
					component: "input",
					options: { placeholder: "请输入充值单号" },
					rules: [
						{
							required: true,
							message: "请输入充值单号",
							trigger: "blur",
						},
					],
				},
				{
					label: "用户编码",
					name: "userId",
					component: "input",
					options: { placeholder: "请输入用户编码" },
					rules: [
						{
							required: true,
							message: "请输入用户编码",
							trigger: "blur",
						},
					],
				},
				{
					label: "账号",
					name: "accountNo",
					component: "input",
					options: { placeholder: "请输入账号" },
					rules: [
						{
							required: true,
							message: "请输入账号",
							trigger: "blur",
						},
					],
				},
			],
		};

		// API 方法
		const deleteRecharge = async (ids) => {
			return await $API.member.rechargeDelete.delete(ids);
		};

		const saveRecharge = async (data) => {
			return await $API.member.rechargeSave.post(data);
		};

		// 事件处理
		const handleAdd = () => {
			console.log("新增充值记录");
		};

		const handleEdit = (row) => {
			console.log("编辑充值记录", row);
		};

		const handleView = (row) => {
			console.log("查看充值记录", row);
		};

		const handleSubmit = () => {
			console.log("提交成功");
		};

		return {
			searchConfig,
			tableColumns,
			formConfig,
			deleteRecharge,
			saveRecharge,
			handleAdd,
			handleEdit,
			handleView,
			handleSubmit,
		};
	},
};
</script>

<style scoped>
/* 可以添加特定样式 */
</style>
