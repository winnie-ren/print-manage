<template>
	<common-list-page
		ref="commonListPageRef"
		:api-obj="$API.role.userPage"
		:search-config="searchConfig"
		:table-columns="tableColumns"
		:form-config="formConfig"
		:delete-api="deleteRole"
		:save-api="saveRole"
		:update-api="updateRole"
		:edit-disabled-fields="['gco']"
		delete-field="gco"
		:operationWidth="260"
		:showViewButton="false"
		@add="handleAdd"
		@edit="handleEdit"
		@view="handleView"
		@submit="handleSubmit"
	>
		<template #operation-buttons="{ row }">
			<el-button
				text
				type="primary"
				size="small"
				@click="openUserDialog(row, 'add')"
			>
				添加用户
			</el-button>
			<el-button
				text
				type="primary"
				size="small"
				@click="openUserDialog(row, 'view')"
			>
				查看用户
			</el-button>
		</template>
	</common-list-page>

	<el-dialog
		v-model="userDialogVisible"
		:title="dialogType === 'add' ? '添加用户' : '查看用户'"
		width="60%"
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
					? $API.user.userPage
					: $API.role.roleUserPage
			"
			:params="{
				roleId: currentRoleId,
				roleCode: currentRole?.gco,
			}"
			row-key="usid"
			stripe
			:height="420"
			@selection-change="handleUserSelectionChange"
		>
			<el-table-column type="selection" width="50" />
			<el-table-column label="用户编码" prop="usid" />
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
				plain
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
import { getCurrentInstance, ref, nextTick, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
	name: "roleManage",
	components: {
		CommonListPage,
	},
	setup() {
		const instance = getCurrentInstance();
		const $API = instance.proxy.$API;

		const commonListPageRef = ref(null);
		const userTableRef = ref(null);
		const userDialogVisible = ref(false);
		const userSelection = ref([]);
		const saveUserLoading = ref(false);
		const deleteUserLoading = ref(false);
		const currentRole = ref(null);
		const dialogType = ref("add");

		const resolveRoleId = (row) => row?.id ?? row?.roleId ?? row?.gco;
		const currentRoleId = computed(() => resolveRoleId(currentRole.value));

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
			{ label: "角色编码", name: "gco" },
			{ label: "角色名称", name: "gna" },
			{ label: "状态", name: "status", format: "0:无效/1:有效" },
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
					rules: [
						{
							required: true,
							message: "请输入角色编码",
							trigger: "blur",
						},
					],
				},
				{
					label: "角色名称",
					name: "gna",
					component: "input",
					options: { placeholder: "请输入" },
					rules: [
						{
							required: true,
							message: "请输入角色名称",
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

		const updateRole = async (data) => {
			return await $API.role.userUpdate.put(data);
		};

		// 角色用户相关
		const openUserDialog = (row, type) => {
			dialogType.value = type;
			currentRole.value = row;
			userDialogVisible.value = true;
		};

		const handleUserSelectionChange = (selection) => {
			userSelection.value = selection || [];
		};

		const resolveUserId = (row) => row.usid ?? row.userId ?? row.id;

		const handleBatchAddUsers = async () => {
			if (!currentRoleId.value) {
				ElMessage.warning("请先选择角色");
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
				ElMessage.warning("未找到可添加的用户ID字段");
				return;
			}

			const payload = {
				roleId: currentRoleId.value,
				roleCode: currentRole.value?.gco,
				userList,
			};

			saveUserLoading.value = true;
			try {
				const res = await $API.role.roleUserBatchSave.post(payload);
				if (res.code === 0) {
					ElMessage.success("保存成功");
					userSelection.value = [];
					userTableRef.value?.refresh?.();
				} else {
					ElMessage.error(res.message || "保存失败");
				}
			} finally {
				saveUserLoading.value = false;
			}
		};

		const handleBatchDeleteUsers = async () => {
			if (!currentRoleId.value) {
				ElMessage.warning("请先选择角色");
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
				ElMessage.warning("未找到可删除的用户ID字段");
				return;
			}

			try {
				await ElMessageBox.confirm(
					`确定删除已选中的 ${userList.length} 人吗？`,
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
				const res = await $API.role.roleUserDelete.delete({
					roleId: currentRoleId.value,
					roleCode: currentRole.value?.gco,
					userList,
				});
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

		const handleUserDialogClose = () => {
			userSelection.value = [];
		};

		// 事件处理
		const handleAdd = () => {};

		const handleEdit = async (row) => {
			const roleId = resolveRoleId(row);
			const res = await $API.role.userGetById.get({
				id: roleId,
				gco: row.gco,
			});
			if (res.code === 0 && res.data) {
				nextTick(() => {
					commonListPageRef.value.formData = res.data;
				});
			}
		};

		const handleView = async (row) => {
			const roleId = resolveRoleId(row);
			const res = await $API.role.userGetById.get({
				id: roleId,
				gco: row.gco,
			});
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
			deleteRole,
			saveRole,
			updateRole,
			handleAdd,
			handleEdit,
			handleView,
			handleSubmit,
			commonListPageRef,
			userTableRef,
			userDialogVisible,
			userSelection,
			saveUserLoading,
			deleteUserLoading,
			openUserDialog,
			handleUserSelectionChange,
			handleBatchAddUsers,
			handleBatchDeleteUsers,
			handleUserDialogClose,
			dialogType,
			currentRole,
			currentRoleId,
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
