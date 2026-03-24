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
		:operationWidth="260"
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
				@click="openUserDialog(row, 'add')"
			>
				添加人员
			</el-button>
			<el-button
				text
				type="primary"
				size="small"
				@click="openUserDialog(row, 'view')"
			>
				查看人员
			</el-button>
		</template>
	</common-list-page>
	<el-dialog
		v-model="userDialogVisible"
		:title="dialogType === 'add' ? '添加人员' : '查看人员'"
		width="50%"
		@close="handleUserDialogClose"
		class="user-dialog"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
	>
		<scTable
			ref="userTableRef"
			v-if="userDialogVisible"
			:apiObj="
				dialogType === 'add'
					? $API.member.unsignPage
					: $API.member.tmemberuserPage
			"
			:params="{ levelId: currentLevel.levelId }"
			row-key="id"
			stripe
			:height="400"
			@selection-change="handleUserSelectionChange"
		>
			<el-table-column type="selection" width="50" />
			<el-table-column
				label="用户编码"
				:prop="dialogType === 'add' ? 'usid' : 'userId'"
			/>
			<el-table-column label="用户名称" prop="usna" />
		</scTable>

		<template #footer>
			<el-button
				v-if="dialogType === 'add'"
				@click="userDialogVisible = false"
			>
				取消
			</el-button>
			<el-button
				v-if="dialogType === 'add'"
				type="primary"
				:loading="saveUserLoading"
				:disabled="userSelection.length === 0"
				@click="handleBatchAddUsers"
			>
				保存
			</el-button>
			<el-button
				v-if="dialogType === 'view'"
				type="danger"
				:loading="deleteUserLoading"
				:disabled="userSelection.length === 0"
				@click="handleBatchDeleteUsers"
			>
				删除
			</el-button>
		</template>
	</el-dialog>
</template>

<script>
import CommonListPage from "@/components/commonTable/index.vue";
import { getCurrentInstance, ref, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

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
		const dialogType = ref("add");
		// 搜索配置
		const searchConfig = [
			{
				label: "会员等级名称",
				name: "levelName",
				component: "select",
				options: {
					placeholder: "请输入会员等级名称",
					items: [
						{ value: "青铜", label: "青铜" },
						{ value: "黄金", label: "黄金" },
						{ value: "铂金", label: "铂金" },
						{ value: "钻石", label: "钻石" },
					],
				},
			},
		];

		// 表格列配置
		const tableColumns = [
			{
				label: "会员等级名称",
				name: "levelName",
			},
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
				label: "最低充值金额(元)",
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
					options: { placeholder: "自动生成", disabled: true },
				},
				{
					label: "会员等级名称",
					name: "levelName",
					component: "select",
					options: {
						placeholder: "请输入会员等级名称",
						items: [
							{ value: "青铜", label: "青铜" },
							{ value: "黄金", label: "黄金" },
							{ value: "铂金", label: "铂金" },
							{ value: "钻石", label: "钻石" },
						],
					},
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
						placeholder: "折扣率，例如 90=9折，100=不打折",
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
						placeholder: "充值赠送比例，例如 20=充100送20",
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
						placeholder: "消费返红包比例，例如 5=返5%",
					},
				},
				{
					label: "最低充值金额(元)",
					name: "minRechargeAmount",
					component: "number",
					options: {
						min: 0,
						precision: 0,
						controls: false,
						placeholder: "低充值金额(元)，达到才享受赠送",
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
			return await $API.member.levelUpdate.put(data);
		};

		// 添加用户弹窗相关
		const openUserDialog = (row, type) => {
			dialogType.value = type;
			currentLevel.value = row;
			userDialogVisible.value = true;
		};

		const handleUserSelectionChange = (selection) => {
			userSelection.value = selection || [];
		};
		const resolveUserId = (row) => row.usid ?? row.userId ?? row.id;

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
			const res = await $API.member.levelGetById.get({
				levelId: row.levelId,
			});
			if (res.code === 0 && res.data) {
				nextTick(() => {
					commonListPageRef.value.formData = res.data;
				});
			}
		};
		const deleteUserLoading = ref(false);
		const handleBatchDeleteUsers = async () => {
			if (!currentLevel.value?.levelId) {
				ElMessage.warning("请先选择会员等级");
				return;
			}
			if (userSelection.value.length === 0) {
				ElMessage.warning("请先勾选人员");
				return;
			}

			const ids = userSelection.value
				.map(resolveUserId)
				.filter((id) => id !== undefined && id !== null && id !== "");

			if (ids.length === 0) {
				ElMessage.warning("未找到可删除的人员ID字段");
				return;
			}

			try {
				await ElMessageBox.confirm(
					`确定删除已选中的 ${ids.length} 人吗？`,
					"删除确认",
					{
						type: "warning",
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						closeOnClickModal: false,
						closeOnPressEscape: false,
					}
				);
			} catch {
				return;
			}

			deleteUserLoading.value = true;
			try {
				const res = await $API.member.userDelete.delete(ids);
				if (res.code === 0) {
					ElMessage.success("删除成功");
					userSelection.value = [];
					userTableRef.value?.refresh?.();
				} else {
					ElMessage.error(res.message || "删除失败");
				}
			} finally {
				deleteUserLoading.value = false;
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
			dialogType,
			currentLevel,
			deleteUserLoading,
			handleBatchDeleteUsers,
		};
	},
};
</script>

<style lang="scss">
.user-dialog {
	.el-dialog__body {
		padding: 0 10px;
	}
}
</style>
