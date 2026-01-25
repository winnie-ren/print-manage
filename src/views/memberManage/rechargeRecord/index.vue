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
				label: "序号",
				name: "sort",
				component: "input",
				options: { placeholder: "请输入序号" },
			},
			{
				label: "账号",
				name: "account",
				component: "input",
				options: { placeholder: "请输入账号" },
			},
			{
				label: "支付单号",
				name: "paymentOrderNo",
				component: "input",
				options: { placeholder: "请输入支付单号" },
			},
			{
				label: "状态",
				name: "status",
				component: "select",
				options: {
					placeholder: "请选择状态",
					items: [
						{ value: "1", label: "成功" },
						{ value: "0", label: "失败" },
					],
				},
			},
		];

		// 表格列配置
		const tableColumns = [
			{
				label: "序号",
				name: "sort",
				width: 80,
			},
			{
				label: "账号",
				name: "account",
				width: 150,
			},
			{
				label: "支付单号",
				name: "paymentOrderNo",
				width: 180,
			},
			{
				label: "支付金额",
				name: "paymentAmount",
				width: 120,
				formatter: (row) => {
					return `${row.paymentAmount}元`;
				},
			},
			{
				label: "账户余额",
				name: "balance",
				width: 120,
				formatter: (row) => {
					return `${row.balance}元`;
				},
			},
			{
				label: "状态",
				name: "status",
				width: 100,
				format: "0:失败/1:成功",
			},
			{
				label: "充值时间",
				name: "rechargeTime",
				width: 160,
			},
		];

		// 表单配置
		const formConfig = {
			labelWidth: 100,
			labelPosition: "right",
			formItems: [
				{
					label: "序号",
					name: "sort",
					component: "input",
					options: { placeholder: "请输入序号" },
					rules: [
						{
							required: true,
							message: "请输入序号",
							trigger: "blur",
						},
					],
				},
				{
					label: "账号",
					name: "account",
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
				{
					label: "支付单号",
					name: "paymentOrderNo",
					component: "input",
					options: { placeholder: "请输入支付单号" },
					rules: [
						{
							required: true,
							message: "请输入支付单号",
							trigger: "blur",
						},
					],
				},
				{
					label: "支付金额",
					name: "paymentAmount",
					component: "input-number",
					options: {
						min: 0,
						precision: 2,
						controls: false,
						placeholder: "请输入支付金额",
					},
					rules: [
						{
							required: true,
							message: "请输入支付金额",
							trigger: "blur",
						},
					],
				},
				{
					label: "账户余额",
					name: "balance",
					component: "input-number",
					options: {
						min: 0,
						precision: 2,
						controls: false,
						placeholder: "请输入账户余额",
					},
					rules: [
						{
							required: true,
							message: "请输入账户余额",
							trigger: "blur",
						},
					],
				},
				{
					label: "状态",
					name: "status",
					component: "radio",
					options: {
						items: [
							{ value: "1", label: "成功" },
							{ value: "0", label: "失败" },
						],
					},
					defaultValue: "1",
				},
				{
					label: "充值时间",
					name: "rechargeTime",
					component: "date-picker",
					options: {
						type: "datetime",
						placeholder: "选择充值时间",
						valueFormat: "YYYY-MM-DD HH:mm:ss",
					},
					rules: [
						{
							required: true,
							message: "请选择充值时间",
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