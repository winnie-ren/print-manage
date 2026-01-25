<template>
	<common-list-page
		ref="commonListPage"
		:api-obj="$API.member.levelPage"
		:search-config="searchConfig"
		:table-columns="tableColumns"
		:form-config="formConfig"
		:edit-disabled-fields="['levelCode']"
		:delete-api="deleteLevel"
		:save-api="saveLevel"
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
				label: "等级编码",
				name: "levelCode",
				component: "input",
				options: { placeholder: "请输入等级编码" },
			},
			{
				label: "等级名称",
				name: "levelName",
				component: "input",
				options: { placeholder: "请输入等级名称" },
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
				label: "等级图标",
				name: "icon",
				width: 120,
				formatter: (row) => {
					return row.icon
						? `<img src="${row.icon}" style="width: 30px; height: 30px;" />`
						: "无";
				},
			},
			{
				label: "等级编码",
				name: "levelCode",
				width: 150,
			},
			{
				label: "等级名称",
				name: "levelName",
				width: 150,
			},
			{
				label: "最小消费金额",
				name: "minConsumeAmount",
				width: 150,
			},
			{
				label: "最大消费金额",
				name: "maxConsumeAmount",
				width: 150,
			},
			{
				label: "充值满",
				name: "rechargeFull",
				width: 120,
			},
			{
				label: "满值满送",
				name: "fullSend",
				width: 120,
			},
			{
				label: "下单折扣",
				name: "discount",
				width: 120,
			},
			{
				label: "下单红包",
				name: "redPacket",
				width: 120,
			},
			{
				label: "状态",
				name: "status",
				width: 80,
				format: "0:禁用/1:启用",
			},
			{
				label: "备注",
				name: "remark",
				width: 150,
			},
			{
				label: "创建时间",
				name: "createTime",
				width: 160,
			},
			{
				label: "创建人",
				name: "createUser",
				width: 100,
			},
			{
				label: "更新时间",
				name: "updateTime",
				width: 160,
			},
			{
				label: "更新人",
				name: "updateUser",
				width: 100,
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
					label: "等级图标",
					name: "icon",
					component: "input",
				},
				{
					label: "等级编码",
					name: "levelCode",
					component: "input",
					options: { placeholder: "请输入等级编码" },
					rules: [
						{
							required: true,
							message: "请输入等级编码",
							trigger: "blur",
						},
					],
				},
				{
					label: "等级名称",
					name: "levelName",
					component: "input",
					options: { placeholder: "请输入等级名称" },
					rules: [
						{
							required: true,
							message: "请输入等级名称",
							trigger: "blur",
						},
					],
				},
				{
					label: "最小消费金额",
					name: "minConsumeAmount",
					component: "input-number",
					options: {
						min: 0,
						precision: 2,
						controls: false,
						placeholder: "请输入最小消费金额",
					},
				},
				{
					label: "最大消费金额",
					name: "maxConsumeAmount",
					component: "input-number",
					options: {
						min: 0,
						precision: 2,
						controls: false,
						placeholder: "请输入最大消费金额",
					},
				},
				{
					label: "充值满",
					name: "rechargeFull",
					component: "input-number",
					options: {
						min: 0,
						precision: 2,
						controls: false,
						placeholder: "请输入充值满金额",
					},
				},
				{
					label: "满值满送",
					name: "fullSend",
					component: "input-number",
					options: {
						min: 0,
						precision: 2,
						controls: false,
						placeholder: "请输入满值满送金额",
					},
				},
				{
					label: "下单折扣",
					name: "discount",
					component: "input-number",
					options: {
						min: 0,
						max: 100,
						precision: 2,
						controls: false,
						placeholder: "请输入下单折扣（%）",
					},
				},
				{
					label: "下单红包",
					name: "redPacket",
					component: "input-number",
					options: {
						min: 0,
						precision: 2,
						controls: false,
						placeholder: "请输入下单红包金额",
					},
				},
				{
					label: "状态",
					name: "status",
					component: "radio",
					options: {
						items: [
							{ value: "1", label: "启用" },
							{ value: "0", label: "禁用" },
						],
					},
					defaultValue: "1",
				},
				{
					label: "备注",
					name: "remark",
					component: "textarea",
					options: {
						placeholder: "请输入备注",
						rows: 3,
					},
				},
			],
		};

		// API 方法
		const deleteLevel = async (ids) => {
			return await $API.member.levelDelete.delete(ids);
		};

		const saveLevel = async (data) => {
			return await $API.member.levelSave.post(data);
		};

		// 事件处理
		const handleAdd = () => {
			console.log("新增会员等级");
		};

		const handleEdit = (row) => {
			console.log("编辑会员等级", row);
		};

		const handleView = (row) => {
			console.log("查看会员等级", row);
		};

		const handleSubmit = () => {
			console.log("提交成功");
		};

		return {
			searchConfig,
			tableColumns,
			formConfig,
			deleteLevel,
			saveLevel,
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
