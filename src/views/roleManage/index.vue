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
	/>

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
					? $API.user.unsignRolePage
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
	<!-- 角色权限弹窗 -->
	<el-dialog
		v-model="permDialogVisible"
		title="角色权限配置"
		width="680px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		class="perm-dialog"
	>
		<div class="perm-body">
			<el-input
				v-model="permFilter"
				clearable
				placeholder="输入菜单名称过滤"
			/>
			<el-tree
				ref="permTreeRef"
				:data="permTreeData"
				node-key="id"
				:props="permTreeProps"
				show-checkbox
				default-expand-all
				highlight-current
				:filter-node-method="filterPermNode"
			/>
		</div>

		<template #footer>
			<el-button @click="permDialogVisible = false">取消</el-button>
			<el-button
				type="primary"
				:loading="permSaving"
				:disabled="!currentRoleId"
				@click="handleSavePerms"
			>
				保存
			</el-button>
		</template>
	</el-dialog>
</template>

<script>
import CommonListPage from "@/components/commonTable/index.vue";
import {
	getCurrentInstance,
	ref,
	nextTick,
	computed,
	watch,
	defineComponent,
	h,
} from "vue";
import { ElMessage, ElMessageBox, ElButton } from "element-plus";
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
		const RolePermCell = defineComponent({
			name: "RolePermCell",
			props: { row: { type: Object, required: true } },
			setup(props) {
				return () =>
					h(
						ElButton,
						{
							text: true,
							type: "primary",
							size: "small",
							class: "table-button",
							onClick: () => openPermDialog(props.row),
						},
						() => "角色权限"
					);
			},
		});

		const AddUserCell = defineComponent({
			name: "AddUserCell",
			props: { row: { type: Object, required: true } },
			setup(props) {
				return () =>
					h(
						ElButton,
						{
							text: true,
							type: "primary",
							size: "small",
							class: "table-button",
							onClick: () => openUserDialog(props.row, "add"),
						},
						() => "添加用户"
					);
			},
		});

		const ViewUserCell = defineComponent({
			name: "ViewUserCell",
			props: { row: { type: Object, required: true } },
			setup(props) {
				return () =>
					h(
						ElButton,
						{
							text: true,
							type: "primary",
							size: "small",
							class: "table-button",
							onClick: () => openUserDialog(props.row, "view"),
						},
						() => "查看用户"
					);
			},
		});
		// 表格列配置
		const tableColumns = [
			{ label: "角色编码", name: "gco" },
			{ label: "角色名称", name: "gna" },
			{ label: "状态", name: "status", format: "0:无效/1:有效" },
			{
				label: "角色用户",
				name: "addUserAction",
				width: 110,
				showOverflowTooltip: false,
				renderCell: AddUserCell,
			},
			{
				label: "查看用户",
				name: "viewUserAction",
				width: 110,
				showOverflowTooltip: false,
				renderCell: ViewUserCell,
			},
			{
				label: "角色权限",
				name: "rolePermAction",
				width: 110,
				showOverflowTooltip: false,
				renderCell: RolePermCell,
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

		// 权限树相关状态
		const permDialogVisible = ref(false);
		const permTreeRef = ref(null);
		const permTreeData = ref([]);
		const permFilter = ref("");
		const permSaving = ref(false);
		const permTreeProps = {
			label: "name",
			children: "children",
		};
		// 过滤
		const filterPermNode = (value, data) => {
			if (!value) return true;
			return (data.name || "").includes(value);
		};

		watch(permFilter, (val) => {
			permTreeRef.value?.filter(val);
		});

		// 打开权限弹窗
		const openPermDialog = async (row) => {
			currentRole.value = row;
			permDialogVisible.value = true;
			const res = await $API.role.roleGetTree.get({ gco: row.gco });
			if (res.code === 0) {
				const tree = res.data || [];
				permTreeData.value = tree;
				await nextTick();
				const checkedKeys = collectCheckedKeys(tree);
				permTreeRef.value?.setCheckedKeys(checkedKeys, false);
			}
		};

		// 提取默认勾选
		const collectCheckedKeys = (list = []) => {
			const keys = [];
			const walk = (arr = []) => {
				arr.forEach((item) => {
					if (item.checked) keys.push(item.id);
					if (item.children?.length) walk(item.children);
				});
			};
			walk(list);
			return keys;
		};
		// 扁平化保存参数
		const buildSaveParams = (list = [], checkedSet = new Set()) => {
			const result = [];

			const walk = (arr = []) => {
				arr.forEach((item) => {
					result.push({
						id: item.id,
						parentId: item.parentId,
						checked: checkedSet.has(item.id) ? "true" : "false",
					});

					if (item.children?.length) {
						walk(item.children);
					}
				});
			};

			walk(list);
			return result;
		};
		// 保存权限
		const handleSavePerms = async () => {
			if (!currentRoleId.value) {
				ElMessage.warning("请先选择角色");
				return;
			}

			const treeRef = permTreeRef.value;
			const checkedSet = new Set([
				...(treeRef?.getCheckedKeys?.() || []),
				...(treeRef?.getHalfCheckedKeys?.() || []),
			]);

			const payload = {
				gco: currentRole.value?.gco,
				params: buildSaveParams(permTreeData.value, checkedSet),
			};

			permSaving.value = true;
			try {
				const res = await $API.role.roleSaveTree.post(payload);
				if (res.code === 0) {
					ElMessage.success("保存成功");
					permDialogVisible.value = false;
				}
			} finally {
				permSaving.value = false;
			}
		};

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
			permDialogVisible,
			permTreeRef,
			permTreeData,
			permTreeProps,
			permFilter,
			permSaving,
			filterPermNode,
			openPermDialog,
			handleSavePerms,
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
.perm-dialog {
	.el-dialog__body {
		padding: 12px 16px 4px;
	}
	.perm-body {
		display: grid;
		gap: 12px;
	}
	.el-tree {
		border: 1px solid #eee;
		border-radius: 6px;
		padding: 8px 12px;
		max-height: 420px;
		overflow: auto;
	}
}
.scTable-table .table-button.is-text {
	border: none !important;
	box-shadow: none !important;
	padding: 0 !important;
	min-height: auto !important;
}
</style>
