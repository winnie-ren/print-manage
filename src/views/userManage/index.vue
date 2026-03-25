<template>
	<common-list-page
		ref="commonListPageRef"
		:api-obj="$API.user.userPage"
		:search-config="searchConfig"
		:table-columns="tableColumns"
		:form-config="formConfig"
		:delete-api="deleteUser"
		:save-api="saveUser"
		delete-field="usid"
		:update-api="updateUser"
		:showViewButton="false"
		@add="handleAdd"
		@edit="handleEdit"
		@view="handleView"
		@submit="handleSubmit"
	/>
</template>

<script>
import CommonListPage from "@/components/commonTable/index.vue";
import { getCurrentInstance, ref } from "vue";

export default {
	name: "userManage",
	components: {
		CommonListPage,
	},
	setup() {
		const instance = getCurrentInstance();
		const $API = instance.proxy.$API;
		const commonListPageRef = ref(null);
		// 搜索配置
		const searchConfig = [
			{
				label: "用户编码",
				name: "usid",
				component: "input",
				options: { placeholder: "请输入用户编码" },
			},
			{
				label: "用户名称",
				name: "usna",
				component: "input",
				options: { placeholder: "请输入用户名称" },
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
				label: "用户编码",
				name: "usid",
			},
			{
				label: "用户名称",
				name: "usna",
			},
			{
				label: "联系电话",
				name: "tel",
			},
			{
				label: "邮件",
				name: "email",
			},
			{
				label: "状态",
				name: "status",
				format: "0:无效/1:有效",
			},
			// {
			// 	label: "最新登录时间",
			// 	name: "lidt",
			// 	width: 140,
			// },
			{
				label: "账号到期时间",
				name: "exdt",
			},
			// {
			// 	label: "登录失败次数",
			// 	name: "loginFailCount",
			// 	width: 120,
			// },
		];

		// 表单配置
		const formConfig = {
			labelWidth: 120,
			labelPosition: "right",
			formItems: [
				{
					label: "用户编码",
					name: "usid",
					component: "input",
					options: { placeholder: "请输入" },
					// span: 8,
					rules: [
						{
							required: true,
							message: "请输入用户编码",
							trigger: "blur",
						},
					],
				},
				{
					label: "用户名称",
					name: "usna",
					component: "input",
					options: { placeholder: "请输入" },
					// span: 8,
					rules: [
						{
							required: true,
							message: "请输入用户名称",
							trigger: "blur",
						},
					],
				},
				{
					label: "密码",
					name: "pwd",
					component: "input",
					options: { placeholder: "请输入", password: true },
					// span: 8,
					rules: [
						{
							required: true,
							message: "请输入密码",
							trigger: "blur",
						},
					],
				},
				{
					label: "联系电话",
					name: "tel",
					component: "input",
					options: { placeholder: "请输入" },
					// span: 8,
					rules: [
						{
							required: true,
							message: "请输入联系电话",
							trigger: "blur",
						},
					],
				},
				{
					label: "邮件",
					name: "email",
					component: "input",
					options: { placeholder: "请输入" },
					// span: 8,
					rules: [
						{
							required: true,
							message: "请输入邮件",
							trigger: "blur",
						},
					],
				},
				{
					label: "状态",
					name: "status",
					component: "radio",
					options: {
						placeholder: "请选择",
						items: [
							{ label: "无效", value: "0" },
							{ label: "有效", value: "1" },
						],
					},
					rules: [
						{
							required: true,
							message: "请选择状态",
							trigger: "change",
						},
					],
					// span: 8,
				},
				// {
				// 	label: "最新登录时间",
				// 	name: "lidt",
				// 	component: "input",
				// 	options: { placeholder: "请输入" },
				// 	span: 8,
				// },
				// {
				// 	label: "账号到期时间",
				// 	name: "exdt",
				// 	component: "input",
				// 	options: { placeholder: "请输入" },
				// 	span: 8,
				// },
				// {
				// 	label: "登录失败次数",
				// 	name: "loginFailCount",
				// 	component: "input",
				// 	options: { placeholder: "请输入" },
				// 	span: 8,
				// },
				// {
				// 	label: "google密钥",
				// 	name: "googleSecret",
				// 	component: "input",
				// 	options: { placeholder: "请输入" },
				// 	span: 8,
				// },
				// {
				// 	label: "账号指纹",
				// 	name: "accountFingerprint",
				// 	component: "input",
				// 	options: { placeholder: "请输入" },
				// 	span: 8,
				// },
				// {
				// 	label: "用户环境",
				// 	name: "userEnv",
				// 	component: "input",
				// 	options: { placeholder: "请输入" },
				// 	span: 8,
				// },
				// {
				// 	label: "自定义类型",
				// 	name: "gwfType",
				// 	component: "input",
				// 	options: { placeholder: "请输入" },
				// 	span: 8,
				// },
				// {
				// 	label: "微信用户",
				// 	name: "wxUserid",
				// 	component: "input",
				// 	options: { placeholder: "请输入" },
				// 	span: 8,
				// },
				// {
				// 	label: "微信openid",
				// 	name: "openid",
				// 	component: "input",
				// 	options: { placeholder: "请输入" },
				// 	span: 8,
				// },
			],
		};

		// API 方法
		const deleteUser = async (ids) => {
			return await $API.user.userDelete.delete(ids);
		};

		const saveUser = async (data) => {
			return await $API.user.userSave.post(data);
		};
		const updateUser = async (data) => {
			return await $API.user.userUpdate.put(data);
		};

		// 事件处理
		const handleAdd = () => {
			commonListPageRef.value.formData = { status: "1" };
		};

		const handleEdit = async (row) => {
			const user = await $API.user.userGetById.get({ usid: row.usid });
			commonListPageRef.value.formData = user.data;
		};

		const handleView = (row) => {
			console.log("查看用户", row);
		};

		const handleSubmit = () => {
			console.log("提交成功");
		};

		return {
			searchConfig,
			tableColumns,
			formConfig,
			deleteUser,
			saveUser,
			updateUser,
			handleAdd,
			handleEdit,
			handleView,
			handleSubmit,
			commonListPageRef,
		};
	},
};
</script>

<style lang="scss" scoped>
/* 如果需要样式调整，可在此处添加 */
</style>
