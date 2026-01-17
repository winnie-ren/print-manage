<template>
	<common-list-page
		ref="commonListPage"
		:api-obj="$API.role.userPage"
		:search-config="searchConfig"
		:table-columns="tableColumns"
		:form-config="formConfig"
		:delete-api="deleteRole"
		:save-api="saveRole"
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
	name: "roleManage",
	components: {
		CommonListPage,
	},
	setup() {
		const instance = getCurrentInstance();
		const $API = instance.proxy.$API;

		// 搜索配置
		const searchConfig = [
			{
				label: "角色编码",
				name: "gco",
				component: "input",
				options: { placeholder: "请输入角色编码" },
			},
			{
				label: "角色名称",
				name: "gna",
				component: "input",
				options: { placeholder: "请输入角色名称" },
			},
			{
				label: "状态",
				name: "status",
				component: "select",
				options: {
					placeholder: "请选择状态",
					items: [
						{ value: "1", label: "有效" },
						{ value: "0", label: "无效" },
					],
				},
			},
		];

		// 表格列配置
		const tableColumns = [
			{
				label: "角色编码",
				name: "gco",
			},
			{
				label: "角色名称",
				name: "gna",
			},
			{
				label: "状态",
				name: "status",
				format: "0:无效/1:有效",
			},
		];

		// 表单配置
		const formConfig = {
			labelWidth: 80,
			labelPosition: "right",
			formItems: [
				{
					label: "角色编码",
					name: "gco",
					component: "input",
					options: { placeholder: "请输入" },
				},
				{
					label: "角色名称",
					name: "gna",
					component: "input",
					options: { placeholder: "请输入" },
				},
				{
					label: "状态",
					name: "status",
					component: "radio",
					options: {
						placeholder: "请选择",
						items: [
							{ label: "无效", value: 0 },
							{ label: "有效", value: 1 },
						],
					},
				},
			],
		};

		// API 方法
		const deleteRole = async (ids) => {
			return await $API.role.userDelete.delete(ids);
		};

		const saveRole = async (data) => {
			return await $API.role.userSave.post(data);
		};

		// 事件处理
		const handleAdd = () => {
			console.log("新增角色");
		};

		const handleEdit = (row) => {
			console.log("编辑角色", row);
		};

		const handleView = (row) => {
			console.log("查看角色", row);
		};

		const handleSubmit = () => {
			console.log("提交成功");
		};

		return {
			searchConfig,
			tableColumns,
			formConfig,
			deleteRole,
			saveRole,
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
