<template>
	<common-list-page
		ref="commonListPage"
		:api-obj="$API.user.userPage"
		:search-config="searchConfig"
		:table-columns="tableColumns"
		:form-config="formConfig"
		:delete-api="deleteOrder"
		:save-api="saveOrder"
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
	name: "orderList",
	components: {
		CommonListPage,
	},
	setup() {
		const instance = getCurrentInstance();
		const $API = instance.proxy.$API;

		// 搜索配置
		const searchConfig = [
			{
				label: "文件类型",
				name: "usid",
				component: "input",
				options: { placeholder: "请输入文件类型" },
			},
			{
				label: "纸张尺寸",
				name: "usna",
				component: "input",
				options: { placeholder: "请输入纸张尺寸" },
			},
			{
				label: "颜色",
				name: "pwd",
				component: "input",
				options: { placeholder: "请输入颜色" },
			},
			{
				label: "面数",
				name: "pwddt",
				component: "input",
				options: { placeholder: "请输入面数" },
			},
			{
				label: "起步张数",
				name: "tel",
				component: "input",
				options: { placeholder: "请输入起步张数" },
			},
			{
				label: "价格",
				name: "email",
				component: "input",
				options: { placeholder: "请输入价格" },
			},
		];

		// 表格列配置
		const tableColumns = [
			{
				label: "文件类型",
				name: "usid",
				width: 120,
			},
			{
				label: "纸张尺寸",
				name: "usna",
				width: 120,
			},
			{
				label: "颜色",
				name: "pwd",
				width: 120,
			},
			{
				label: "面数",
				name: "pwddt",
				width: 120,
			},
			{
				label: "起步张数",
				name: "tel",
				width: 120,
			},
			{
				label: "价格",
				name: "email",
				width: 120,
			},
		];

		// 表单配置
		const formConfig = {
			labelWidth: 80,
			labelPosition: "right",
			formItems: [
				{
					label: "文件类型",
					name: "usid",
					component: "input",
					options: { placeholder: "请输入" },
				},
				{
					label: "纸张尺寸",
					name: "usna",
					component: "input",
					options: { placeholder: "请输入" },
				},
				{
					label: "颜色",
					name: "pwd",
					component: "input",
					options: { placeholder: "请输入" },
				},
				{
					label: "面数",
					name: "pwddt",
					component: "input",
					options: { placeholder: "请输入" },
				},
				{
					label: "起步张数",
					name: "tel",
					component: "input",
					options: { placeholder: "请输入" },
				},
				{
					label: "价格",
					name: "email",
					component: "input",
					options: { placeholder: "请输入" },
				},
			],
		};

		// API 方法
		const deleteOrder = async (ids) => {
			return await $API.order.userDelete.delete(ids);
		};

		const saveOrder = async (data) => {
			return await $API.order.userSave.post(data);
		};

		// 事件处理
		const handleAdd = () => {
			console.log("新增订单");
		};

		const handleEdit = (row) => {
			console.log("编辑订单", row);
		};

		const handleView = (row) => {
			console.log("查看订单", row);
		};

		const handleSubmit = () => {
			console.log("提交成功");
		};

		return {
			searchConfig,
			tableColumns,
			formConfig,
			deleteOrder,
			saveOrder,
			handleAdd,
			handleEdit,
			handleView,
			handleSubmit,
		};
	},
};
</script>

<style lang="scss" scoped>
/* 如果需要样式调整，可在此处添加 */
</style>
