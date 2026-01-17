<template>
	<common-list-page
		ref="commonListPage"
		:api-obj="$API.menu.userPage"
		:search-config="searchConfig"
		:table-columns="tableColumns"
		:form-config="formConfig"
		:edit-disabled-fields="['gco']"
		:delete-api="deleteMenu"
		:save-api="saveMenu"
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
	name: "MenuManage",
	components: {
		CommonListPage,
	},
	setup() {
		const instance = getCurrentInstance();
		const $API = instance.proxy.$API;
		// 搜索配置
		const searchConfig = [
			{
				label: "菜单编码",
				name: "gco",
				component: "input",
				options: { placeholder: "请输入菜单编码" },
			},
			{
				label: "菜单名称",
				name: "gna",
				component: "input",
				options: { placeholder: "请输入菜单名称" },
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
				label: "菜单编码",
				name: "gco",
				width: 120,
			},
			{
				label: "菜单名称",
				name: "gna",
				width: 150,
			},
			{
				label: "父级编码",
				name: "pgco",
				width: 120,
			},
			{
				label: "访问URL",
				name: "url",
				width: 200,
			},
			{
				label: "图标",
				name: "icon",
				width: 100,
			},
			{
				label: "显示排序",
				name: "sorts",
				width: 80,
			},
			{
				label: "菜单类型",
				name: "menuType",
				width: 100,
				format: "dir:文件夹/node:菜单",
			},
			{
				label: "打开方式",
				name: "target",
				width: 120,
				format: "0:本系统窗口/1:浏览器新标签页",
			},
			{
				label: "状态",
				name: "status",
				width: 80,
				format: "0:无效/1:有效",
			},
		];

		// 表单配置
		const formConfig = {
			labelWidth: 80,
			labelPosition: "right",
			formItems: [
				{
					label: "菜单编码",
					name: "gco",
					component: "input",
					options: { placeholder: "请输入" },
					rules: [
						{
							required: true,
							message: "请输入菜单编码",
							trigger: "blur",
						},
					],
				},
				{
					label: "菜单名称",
					name: "gna",
					component: "input",
					options: { placeholder: "请输入" },
					rules: [
						{
							required: true,
							message: "请输入菜单名称",
							trigger: "blur",
						},
					],
				},
				{
					label: "父级编码",
					name: "pgco",
					component: "input",
					options: { placeholder: "请输入" },
				},
				{
					label: "访问URL",
					name: "url",
					component: "input",
					options: { placeholder: "请输入" },
				},
				{
					label: "图标",
					name: "icon",
					component: "input",
					options: { placeholder: "请输入" },
				},
				{
					label: "显示排序",
					name: "sorts",
					component: "number",
					props: { min: 0 },
					options: { placeholder: "请输入" },
				},
				{
					label: "菜单类型",
					name: "menuType",
					component: "radio",
					options: {
						placeholder: "请输入",
						items: [
							{ label: "文件夹", value: "dir" },
							{ label: "菜单", value: "node" },
						],
					},
				},
				{
					label: "打开方式",
					name: "target",
					component: "radio",
					options: {
						placeholder: "请输入",
						items: [
							{ label: "本系统窗口", value: 0 },
							{ label: "浏览器新标签页", value: 1 },
						],
					},
				},
				{
					label: "状态",
					name: "status",
					component: "radio",
					options: {
						placeholder: "请输入",
						items: [
							{ label: "无效", value: "0" },
							{ label: "有效", value: "1" },
						],
					},
				},
			],
		};

		// API 方法
		const deleteMenu = async (ids) => {
			return await $API.menu.userDelete.delete(ids);
		};

		const saveMenu = async (data) => {
			return await $API.menu.userSave.post(data);
		};

		// 事件处理
		const handleAdd = () => {
			console.log("新增菜单");
		};

		const handleEdit = (row) => {
			console.log("编辑菜单", row);
		};

		const handleView = (row) => {
			console.log("查看菜单", row);
		};

		const handleSubmit = () => {
			console.log("提交成功");
		};

		return {
			searchConfig,
			tableColumns,
			formConfig,
			deleteMenu,
			saveMenu,
			handleAdd,
			handleEdit,
			handleView,
			handleSubmit,
		};
	},
};
</script>
