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
	name: "memberList",
	components: {
		CommonListPage,
	},
	setup() {
		const instance = getCurrentInstance();
		const $API = instance.proxy.$API;
		// 搜索配置
		const searchConfig = [
			{
				label: "账号",
				name: "gco",
				component: "input",
				options: { placeholder: "请输入编码" },
			},
			{
				label: "名称",
				name: "gna",
				component: "input",
				options: { placeholder: "请输入名称" },
			},
			{
				label: "状态",
				name: "status",
				component: "select",
				options: {
					placeholder: "请选择状态",
					items: [
						{ value: "1", label: "启用" },
						{ value: "0", label: "禁用" },
						{ value: "2", label: "冻结" },
					],
				},
			},
		];

		// 表格列配置
		const tableColumns = [
			{
				label: "账号",
				name: "gco",
				width: 120,
			},
			{
				label: "名称",
				name: "gna",
				width: 150,
			},
			{
				label: "等级名称",
				name: "pgco",
				width: 120,
			},
			{
				label: "消费金额",
				name: "url",
				width: 200,
			},
			{
				label: "备注",
				name: "icon",
				width: 100,
			},
			{
				label: "状态",
				name: "status",
				width: 80,
				format: "0:禁用/1:启用/2:冻结",
			},
			{
				label: "创建时间",
				name: "sorts",
			},
			{
				label: "创建人",
				name: "createUser",
			},
			{
				label: "更新时间",
				name: "sorts",
			},
			{
				label: "更新人",
				name: "createUser",
			},
		];

		// 表单配置
		const formConfig = {
			labelWidth: 80,
			labelPosition: "right",
			formItems: [
				{
					label: "账号",
					name: "gco",
					component: "input",
					options: { placeholder: "请输入" },
					rules: [
						{
							required: true,
							message: "请输入账号",
							trigger: "blur",
						},
					],
				},
				{
					label: "名称",
					name: "gna",
					component: "input",
					options: { placeholder: "请输入" },
					rules: [
						{
							required: true,
							message: "请输入名称",
							trigger: "blur",
						},
					],
				},
				{
					label: "等级名称",
					name: "pgco",
					component: "input",
					options: { placeholder: "请输入" },
				},
				{
					label: "消费金额",
					name: "url",
					component: "input",
					options: { placeholder: "请输入" },
				},
				{
					label: "状态",
					name: "status",
					component: "radio",
					options: {
						placeholder: "请输入",
						items: [
							{ value: "1", label: "启用" },
							{ value: "0", label: "禁用" },
							{ value: "2", label: "冻结" },
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
			console.log("新增会员");
		};

		const handleEdit = (row) => {
			console.log("编辑会员", row);
		};

		const handleView = (row) => {
			console.log("查看会员", row);
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
