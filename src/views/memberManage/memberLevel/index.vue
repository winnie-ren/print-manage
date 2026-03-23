<template>
	<common-list-page
		ref="commonListPageRef"
		:api-obj="$API.member.levelPage"
		:search-config="searchConfig"
		:table-columns="tableColumns"
		:form-config="formConfig"
		:showViewButton="false"
		:edit-disabled-fields="['levelId']"
		delete-field="levelId"
		:delete-api="deleteLevel"
		:save-api="saveLevel"
		:update-api="updateLevel"
		:operationWidth="200"
		@add="handleAdd"
		@edit="handleEdit"
		@view="handleEdit"
		@submit="handleSubmit"
	>
		<template #operation-buttons>
			<el-button text type="primary" size="small"> 添加用户 </el-button>
		</template>
	</common-list-page>
</template>

<script>
import CommonListPage from "@/components/commonTable/index.vue";
import { getCurrentInstance, ref, nextTick } from "vue";

export default {
	name: "memberLevel",
	components: {
		CommonListPage,
	},
	setup() {
		const commonListPageRef = ref();
		const instance = getCurrentInstance();
		const $API = instance.proxy.$API;
		const isEdit = ref(false);
		// 搜索配置
		const searchConfig = [
			{
				label: "会员等级ID",
				name: "levelId",
				component: "input",
				options: { placeholder: "请输入会员等级ID" },
			},
			{
				label: "会员等级名称",
				name: "levelName",
				component: "input",
				options: { placeholder: "请输入会员等级名称" },
			},
		];

		// 表格列配置
		const tableColumns = [
			{ label: "会员等级ID", name: "levelId" },
			{ label: "会员等级名称", name: "levelName" },
			{
				label: "折扣率",
				name: "discountRate",
				formatter: (row) =>
					row.discountRate !== undefined && row.discountRate !== null
						? `${row.discountRate}`
						: "",
			},
			{
				label: "充值赠送比例",
				name: "rechargeGiftRatio",
				formatter: (row) =>
					row.rechargeGiftRatio !== undefined &&
					row.rechargeGiftRatio !== null
						? `${row.rechargeGiftRatio}`
						: "",
			},
			{
				label: "消费返红包比例",
				name: "consumeRedRatio",
				formatter: (row) =>
					row.consumeRedRatio !== undefined &&
					row.consumeRedRatio !== null
						? `${row.consumeRedRatio}`
						: "",
			},
			{
				label: "最低充值金额(分)",
				name: "minRechargeAmount",
			},
		];

		// 表单配置
		const formConfig = {
			labelWidth: 120,
			labelPosition: "right",
			formItems: [
				{
					label: "会员等级ID",
					name: "levelId",
					component: "input",
					options: { placeholder: "请输入会员等级ID" },
				},
				{
					label: "会员等级名称",
					name: "levelName",
					component: "input",
					options: { placeholder: "请输入会员等级名称" },
					rules: [
						{
							required: true,
							message: "请输入会员等级名称",
							trigger: "blur",
						},
					],
				},
				{
					label: "折扣率",
					name: "discountRate",
					component: "number",
					options: {
						min: 0,
						precision: 2,
						controls: false,
						placeholder: "例如 90=9折，100=不打折",
					},
				},
				{
					label: "充值赠送比例",
					name: "rechargeGiftRatio",
					component: "number",
					options: {
						min: 0,
						precision: 2,
						controls: false,
						placeholder: "例如 20=充100送20",
					},
				},
				{
					label: "消费返红包比例",
					name: "consumeRedRatio",
					component: "number",
					options: {
						min: 0,
						precision: 2,
						controls: false,
						placeholder: "例如 5=返5%",
					},
				},
				{
					label: "最低充值金额(分)",
					name: "minRechargeAmount",
					component: "number",
					options: {
						min: 0,
						precision: 0,
						controls: false,
						placeholder: "达到才享受赠送",
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
		const updateLevel = async (data) => {
			return await $API.member.levelUpdate.post(data);
		};

		// 事件处理
		const handleAdd = () => {
			isEdit.value = false;
		};

		const handleEdit = async (row) => {
			isEdit.value = true;
			const res = await $API.member.levelGetById.get({ id: row.id });
			if (res.code === 0 && res.data) {
				nextTick(() => {
					commonListPageRef.value.formData = res.data;
				});
			}
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
			updateLevel,
			handleAdd,
			handleEdit,
			handleSubmit,
			commonListPageRef,
			isEdit,
		};
	},
};
</script>

<style scoped>
/* 可添加特定样式 */
</style>
