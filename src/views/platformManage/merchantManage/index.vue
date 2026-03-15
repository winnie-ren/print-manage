<template>
	<common-list-page
		ref="commonListPage"
		:api-obj="$API.merchant.merChantPage"
		:search-config="searchConfig"
		:table-columns="tableColumns"
		:form-config="formConfig"
		:delete-api="deleteMerchant"
		:save-api="saveMerchant"
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
	name: "merchantManage",
	components: {
		CommonListPage,
	},
	setup() {
		const instance = getCurrentInstance();
		const $API = instance.proxy.$API;

		// 搜索配置
		const searchConfig = [
			{
				label: "商家编码",
				name: "merchantCode",
				component: "input",
				options: { placeholder: "请输入商家编码" },
			},
			{
				label: "商家名称",
				name: "merchantName",
				component: "input",
				options: { placeholder: "请输入商家名称" },
			},
			{
				label: "联系电话",
				name: "contactPhone",
				component: "input",
				options: { placeholder: "请输入联系电话" },
			},
			{
				label: "商家等级",
				name: "merchantLevel",
				component: "input",
				options: { placeholder: "请输入商家等级" },
			},
		];

		// 表格列配置
		const tableColumns = [
			{ label: "商家编码", name: "merchantCode", width: 140 },
			{ label: "商家名称", name: "merchantName", width: 140 },
			{ label: "状态", name: "status",		format: "0:启用/1:冻结/2:禁用", width: 100 },
			{ label: "商家等级", name: "merchantLevel", width: 100 },
			{ label: "商家年费", name: "annualFee", width: 100 },
			{ label: "联系人", name: "contactPerson", width: 100 },
			{ label: "联系电话", name: "contactPhone", width: 120 },
			{ label: "商家地址", name: "address", width: 200 },
			{ label: "商家logo", name: "logoUrl", width: 200 },
			{ label: "营业范围", name: "businessScope", width: 160 },
			{ label: "微信openid", name: "wechatOpenid", width: 180 },
			{ label: "开始时间", name: "startDate", width: 140 },
			{ label: "结束时间", name: "endDate", width: 140 },
		];

		// 表单配置
		const formConfig = {
			labelWidth: 120,
			labelPosition: "right",
			formItems: [
				{
					label: "商家编码",
					name: "merchantCode",
					component: "input",
					options: { placeholder: "自动生成", disabled: true },
				},
				{
					label: "商家名称",
					name: "merchantName",
					component: "input",
					options: { placeholder: "请输入商家名称" },
					rules: [
						{
							required: true,
							message: "请输入商家名称",
							trigger: "blur",
						},
					],
				},
				{
					label: "商家等级",
					name: "merchantLevel",
					component: "input",
					options: { placeholder: "请输入商家等级" },
					rules: [
						{
							required: true,
							message: "请输入商家等级",
							trigger: "blur",
						},
					],
				},
				{
					label: "商家年费",
					name: "annualFee",
					component: "number",
					rules: [
						{
							required: true,
							message: "请输入商家年费",
							trigger: "blur",
						},
					],
					options: {
						min: 0,
						precision: 2,
						controls: false,
						placeholder: "请输入商家年费",
					},
				},
				{
					label: "商家地址",
					name: "address",
					component: "textarea",
					options: { placeholder: "请输入商家地址", rows: 3 },
				},
				{
					label: "商家logo图片地址",
					name: "logoUrl",
					component: "input",
					options: { placeholder: "请输入logo图片地址" },
				},
				{
					label: "营业范围",
					name: "businessScope",
					component: "textarea",
					options: { placeholder: "请输入营业范围", rows: 3 },
				},
				{
					label: "联系人",
					name: "contactPerson",
					component: "input",
					options: { placeholder: "请输入联系人" },
				},
				{
					label: "联系电话",
					name: "contactPhone",
					component: "input",
					options: { placeholder: "请输入联系电话" },
				},
				{
					label: "微信openid",
					name: "wechatOpenid",
					component: "input",
					options: { placeholder: "请输入微信openid" },
				},
			],
		};

		// API 方法
		const deleteMerchant = async (ids) => {
			return await $API.merchant.merChantDelete.delete(ids);
		};

		const saveMerchant = async (data) => {
			return await $API.merchant.merChantSave.post(data);
		};

		// 事件处理
		const handleAdd = () => {
			console.log("新增商户");
		};

		const handleEdit = (row) => {
			console.log("编辑商户", row);
		};

		const handleView = (row) => {
			console.log("查看商户", row);
		};

		const handleSubmit = () => {
			console.log("提交成功");
		};

		return {
			searchConfig,
			tableColumns,
			formConfig,
			deleteMerchant,
			saveMerchant,
			handleAdd,
			handleEdit,
			handleView,
			handleSubmit,
		};
	},
};
</script>

<style lang="scss" scoped>
/* 如需样式调整，可在此处添加 */
</style>
