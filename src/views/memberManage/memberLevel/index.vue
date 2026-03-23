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
		<template #operation-buttons="{ row }">
			<el-button
				text
				type="primary"
				size="small"
				@click="openUserDialog(row)"
			>
				添加用户
			</el-button>
		</template>
	</common-list-page>

	<el-dialog
		v-model="userDialogVisible"
		title="选择用户"
		width="50%"
		@close="handleUserDialogClose"
		class="user-dialog"
	>
		<scTable
			ref="userTableRef"
			:apiObj="$API.user.userPage"
			row-key="id"
			stripe
			:height="400"
			@selection-change="handleUserSelectionChange"
		>
			<el-table-column type="selection" width="50" />
			<el-table-column label="用户编码" prop="usid" />
			<el-table-column label="用户名称" prop="usna" />
		</scTable>

		<template #footer>
			<el-button @click="userDialogVisible = false">取消</el-button>
			<el-button
				type="primary"
				:loading="saveUserLoading"
				:disabled="userSelection.length === 0"
				@click="handleBatchAddUsers"
			>
				保存
			</el-button>
		</template>
	</el-dialog>
</template>

<script>
import CommonListPage from "@/components/commonTable/index.vue";
import { getCurrentInstance, ref, nextTick } from "vue";
import { ElMessage } from "element-plus";

export default {
	name: "memberLevel",
	components: {
		CommonListPage,
	},
	setup() {
		const commonListPageRef = ref();
		const userTableRef = ref();
		const userDialogVisible = ref(false);
		const userSelection = ref([]);
		const saveUserLoading = ref(false);
		const currentLevel = ref(null);

		const instance = getCurrentInstance();
		const $API = instance.proxy.$API;

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

		// 添加用户弹窗相关
		const openUserDialog = (row) => {
			currentLevel.value = row;
			userDialogVisible.value = true;
			nextTick(() => {
				userTableRef.value?.getData?.();
			});
		};

		const handleUserSelectionChange = (selection) => {
			userSelection.value = selection || [];
		};

		const resolveUserId = (row) =>
			row.usid ?? row.id;

		const handleBatchAddUsers = async () => {
			if (!currentLevel.value?.levelId) {
				ElMessage.warning("请先选择会员等级");
				return;
			}
			if (userSelection.value.length === 0) {
				ElMessage.warning("请先勾选用户");
				return;
			}

			const userList = userSelection.value
				.map(resolveUserId)
				.filter((id) => id !== undefined && id !== null && id !== "");

			if (userList.length === 0) {
				ElMessage.warning("未找到用户ID字段，请检查列表字段");
				return;
			}

			const payload = {
				levelId: currentLevel.value.levelId,
				userList,
			};

			saveUserLoading.value = true;
			try {
				const res = await $API.member.userBatchSave.post(payload);
				if (res.code === 0) {
					ElMessage.success("保存成功");
					userDialogVisible.value = false;
					userSelection.value = [];
					commonListPageRef.value?.refresh?.();
				} else {
					ElMessage.error(res.message || "保存失败");
				}
			} finally {
				saveUserLoading.value = false;
			}
		};

		const handleUserDialogClose = () => {
			userSelection.value = [];
		};

		// 事件处理
		const handleAdd = () => {};
		const handleEdit = async (row) => {
			const res = await $API.member.levelGetById.get({ id: row.id });
			if (res.code === 0 && res.data) {
				nextTick(() => {
					commonListPageRef.value.formData = res.data;
				});
			}
		};

		const handleSubmit = () => {};

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
			userTableRef,
			userDialogVisible,
			userSelection,
			saveUserLoading,
			openUserDialog,
			handleUserSelectionChange,
			handleBatchAddUsers,
			handleUserDialogClose,
		};
	},
};
</script>

<style lang="scss">
.user-dialog{
	.el-dialog__body{
		padding: 0 10px;
	}
}
</style>
