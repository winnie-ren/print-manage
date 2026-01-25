<template>
	<el-container>
		<!-- 搜索侧边栏 -->
		<el-aside width="250px">
			<el-form label-position="top" size="small">
				<template v-for="item in searchConfig" :key="item.name">
					<el-form-item :label="item.label">
						<el-input
							v-if="item.component === 'input'"
							v-model="searchParams[item.name]"
							:placeholder="item.options?.placeholder || '请输入'"
							clearable
						></el-input>
						<el-select
							v-else-if="item.component === 'select'"
							v-model="searchParams[item.name]"
							:placeholder="item.options?.placeholder || '请选择'"
							clearable
							style="width: 100%"
						>
							<el-option
								v-for="option in item.options?.items || []"
								:key="option.value"
								:label="option.label"
								:value="option.value"
							></el-option>
						</el-select>
						<el-input-number
							v-else-if="item.component === 'number'"
							v-model="searchParams[item.name]"
							:min="item.options?.min || 1"
							:controls-position="
								item.options?.controlsPosition || 'right'
							"
							style="width: 100%"
						/>
						<el-date-picker
							v-else-if="item.component === 'datePicker'"
							v-model="searchParams[item.name]"
							:type="item.options?.type || 'date'"
							:placeholder="
								item.options?.placeholder || '请选择日期'
							"
							style="width: 100%"
						></el-date-picker>
					</el-form-item>
				</template>
				<div class="search-btn">
					<el-button
						type="primary"
						icon="el-icon-search"
						@click="handleSearch"
					>
						查询
					</el-button>
					<el-button icon="el-icon-refresh" @click="handleReset">
						重置
					</el-button>
				</div>
			</el-form>
		</el-aside>

		<!-- 主体内容 -->
		<el-container>
			<el-header>
				<div class="left-panel">
					<slot name="header-buttons" :selected-rows="selectedRows">
						<el-button
							type="primary"
							icon="el-icon-plus"
							size="small"
							@click="handleAdd"
						>
							{{ addButtonText }}
						</el-button>
						<el-button
							type="danger"
							plain
							icon="el-icon-delete"
							size="small"
							:disabled="selectedRows.length === 0"
							@click="handleBatchDelete"
						>
							删除
						</el-button>
					</slot>
				</div>
			</el-header>

			<el-main class="nopadding">
				<scTable
					ref="tableRef"
					:apiObj="apiObj"
					row-key="id"
					stripe
					:columns="tableColumns"
					@selectionChange="handleSelectionChange"
				>
					<el-table-column
						type="selection"
						width="50"
					></el-table-column>

					<!-- 动态渲染表格列 -->
					<template v-for="column in tableColumns" :key="column.name">
						<el-table-column
							v-if="column.visible !== false"
							:label="column.label"
							:prop="column.name"
							:width="column.width"
							:formatter="
								column.format
									? (row) => formatter(row, column)
									: null
							"
							:show-overflow-tooltip="
								column.showOverflowTooltip ?? true
							"
						>
							<template v-if="column.renderCell" #default="scope">
								<component
									:is="column.renderCell"
									:row="scope.row"
									:column="column"
									:index="scope.$index"
								/>
							</template>
						</el-table-column>
					</template>

					<!-- 操作列 -->
					<el-table-column
						v-if="showOperationColumn"
						label="操作"
						fixed="right"
						:align="operationAlign"
						:width="operationWidth"
					>
						<template #default="scope">
							<el-button-group>
								<el-button
									v-if="showViewButton"
									text
									type="primary"
									size="small"
									@click="handleView(scope.row, scope.$index)"
								>
									查看
								</el-button>
								<el-button
									v-if="showEditButton"
									text
									type="primary"
									size="small"
									@click="handleEdit(scope.row, scope.$index)"
								>
									编辑
								</el-button>
								<el-popconfirm
									title="确定删除吗？"
									@confirm="
										handleDelete(scope.row, scope.$index)
									"
								>
									<template #reference>
										<el-button
											v-if="showDeleteButton"
											text
											type="primary"
											size="small"
										>
											删除
										</el-button>
									</template>
								</el-popconfirm>

								<!-- 自定义操作按钮 -->
								<slot
									name="operation-buttons"
									:row="scope.row"
									:index="scope.$index"
								></slot>
							</el-button-group>
						</template>
					</el-table-column>
				</scTable>
			</el-main>
		</el-container>

		<!-- 表单弹窗 -->
		<el-drawer
			v-model="dialogVisible"
			:title="dialogTitle"
			:size="dialogWidth"
			:top="dialogTop"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			@close="handleDialogClose"
		>
			<template v-if="useScForm">
				<scForm
					ref="formRef"
					v-model="formData"
					:config="computedFormConfig"
					:disabled="dialogMode === 'view'"
					@submit="handleSubmit"
				></scForm>
			</template>
			<!-- 自定义表单内容 -->
			<slot></slot>
		</el-drawer>
	</el-container>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
	name: "CommonListPage",
	props: {
		// API 对象，用于获取表格数据
		apiObj: {
			type: Object,
			required: true,
		},
		// 搜索配置
		searchConfig: {
			type: Array,
			default: () => [],
		},
		// 表格列配置
		tableColumns: {
			type: Array,
			default: () => [],
		},
		// 是否显示操作列
		showOperationColumn: {
			type: Boolean,
			default: true,
		},
		// 操作列对齐方式
		operationAlign: {
			type: String,
			default: "right",
		},
		// 操作列宽度
		operationWidth: {
			type: Number,
			default: 160,
		},
		// 是否显示查看按钮
		showViewButton: {
			type: Boolean,
			default: true,
		},
		// 是否显示编辑按钮
		showEditButton: {
			type: Boolean,
			default: true,
		},
		// 是否显示删除按钮
		showDeleteButton: {
			type: Boolean,
			default: true,
		},
		// 新增按钮文本
		addButtonText: {
			type: String,
			default: "新增",
		},
		// 使用 scForm 组件
		useScForm: {
			type: Boolean,
			default: true,
		},
		// scForm 配置
		formConfig: {
			type: Object,
			default: () => ({}),
		},
		// 普通表单配置
		formFields: {
			type: Array,
			default: () => [],
		},
		// 普通表单验证规则
		formRules: {
			type: Object,
			default: () => ({}),
		},
		// 普通表单标签宽度
		formLabelWidth: {
			type: String,
			default: "80px",
		},
		// 普通表单标签位置
		formLabelPosition: {
			type: String,
			default: "right",
		},
		// 弹窗宽度
		dialogWidth: {
			type: String,
			default: "500px",
		},
		// 弹窗距离顶部
		dialogTop: {
			type: String,
			default: "15vh",
		},
		// 删除API
		deleteApi: {
			type: Function,
			required: true,
		},
		// 保存API
		saveApi: {
			type: Function,
			required: true,
		},
		// 编辑模式下禁用的字段配置
		editDisabledFields: {
			type: Array,
			default: () => [],
		},
	},
	emits: [
		"add",
		"edit",
		"view",
		"delete",
		"batch-delete",
		"submit",
		"cancel",
		"selection-change",
	],
	setup(props, { emit }) {
		// 响应式数据
		const tableRef = ref(null);
		const formRef = ref(null);
		const dialogVisible = ref(false);
		const dialogTitle = ref("");
		const formData = ref({});
		const selectedRows = ref([]);
		const searchParams = reactive({});

		// 初始化搜索参数
		props.searchConfig.forEach((item) => {
			searchParams[item.name] = item.defaultValue || "";
		});

		// 计算属性
		const dialogMode = computed(() => {
			return dialogTitle.value.includes("新增")
				? "add"
				: dialogTitle.value.includes("编辑")
				? "edit"
				: "view";
		});
		// 计算表单配置（根据当前模式调整字段状态）
		const computedFormConfig = computed(() => {
			if (!props.useScForm) return props.formConfig;
			const config = { ...props.formConfig };
			if (!config.formItems) return config;
			// 根据当前模式调整字段状态
			const updatedFormItems = config.formItems.map((item) => {
				const newItem = { ...item };
				// 编辑模式
				if (dialogMode.value === "edit") {
					// 如果字段在编辑禁用列表中，设置为禁用
					if (props.editDisabledFields.includes(item.name)) {
						newItem.options.disabled = true;
					}
				}
				return newItem;
			});
			return {
				...config,
				formItems: updatedFormItems,
			};
		});

		// 获取组件属性（用于普通表单）
		const getComponentProps = (field) => {
			const props = { ...(field.props || {}) };
			// 根据当前模式设置组件状态
			if (dialogMode.value === "edit") {
				// 编辑模式
				if (props.disabled !== true && props.readonly !== true) {
					props.disabled = props.disabled || props.editDisabled;
					props.readonly = props.readonly || props.editReadOnly;
				}
				// 如果字段在编辑禁用列表中
				if (props.editDisabled || props.disabled) {
					props.disabled = true;
				}
				// 如果字段在编辑只读列表中
				if (props.editReadOnly || props.readonly) {
					props.readonly = true;
				}
			}

			return props;
		};

		// 方法
		const handleSearch = () => {
			const params = {};
			for (const key in searchParams) {
				const value = searchParams[key];
				if (value !== "" && value !== null && value !== undefined) {
					params[key] = value;
				}
			}
			tableRef.value.upData(params);
		};

		const handleReset = () => {
			props.searchConfig.forEach((item) => {
				searchParams[item.name] = item.defaultValue || "";
			});
			tableRef.value.upData(searchParams);
		};

		const handleAdd = () => {
			dialogTitle.value = "新增";
			formData.value = {};
			dialogVisible.value = true;
			emit("add");
		};

		const handleEdit = (row, index) => {
			dialogTitle.value = "编辑";
			formData.value = { ...row };
			dialogVisible.value = true;
			emit("edit", row, index);
		};

		const handleView = (row, index) => {
			dialogTitle.value = "查看";
			formData.value = { ...row };
			dialogVisible.value = true;
			emit("view", row, index);
		};
		function formatter(row, item) {
			// 表格字段格式化
			const map = item.format.split("/").reduce((acc, item) => {
				const [key, label] = item.split(":");
				acc[key.trim()] = label.trim();
				return acc;
			}, {});
			return map[String(row[item.name])] || "";
		}
		const handleDelete = async (row, index) => {
			try {
				const res = await props.deleteApi([row.id]);
				if (res.code === 0) {
					ElMessage.success("删除成功");
					tableRef.value.getData(); // 刷新表格
					emit("delete", row, index);
				} else {
					ElMessage.error(res.message || "删除失败");
				}
			} catch (error) {
				console.error("删除失败:", error);
				ElMessage.error("删除失败");
			}
		};

		const handleBatchDelete = async () => {
			if (selectedRows.value.length === 0) {
				ElMessage.warning("请至少选择一项");
				return;
			}

			try {
				await ElMessageBox.confirm(
					`确定删除选中的 ${selectedRows.value.length} 项吗？`,
					"提示",
					{ type: "warning" }
				);

				const ids = selectedRows.value.map((item) => item.id);
				const res = await props.deleteApi(ids);

				if (res.code === 0) {
					ElMessage.success("批量删除成功");
					tableRef.value.getData(); // 刷新表格
					emit("batch-delete", selectedRows.value);
				} else {
					ElMessage.error(res.message || "批量删除失败");
				}
			} catch (error) {
				console.error("批量删除失败:", error);
			}
		};

		const handleSelectionChange = (selection) => {
			selectedRows.value = selection;
			emit("selection-change", selection);
		};

		const handleSubmit = async (form) => {
			try {
				// 如果是普通表单，需要手动验证
				if (!props.useScForm && formRef.value) {
					await formRef.value.validate();
				}
				const submitData = props.useScForm ? form : formData.value;
				const res = await props.saveApi(submitData);
				if (res.code === 0) {
					ElMessage.success("操作成功");
					dialogVisible.value = false;
					tableRef.value.getData(); // 刷新表格
					emit("submit", submitData);
				} else {
					ElMessage.error(res.message || "操作失败");
				}
			} catch (error) {
				console.error("提交失败:", error);
				ElMessage.error("操作失败");
			}
		};

		const handleCancel = () => {
			dialogVisible.value = false;
			emit("cancel");
		};

		const handleDialogClose = () => {
			formData.value = {};
		};

		// 暴露方法给父组件
		const refresh = () => {
			tableRef.value.getData();
		};

		const getSelectedRows = () => {
			return selectedRows.value;
		};

		return {
			tableRef,
			formRef,
			dialogVisible,
			dialogTitle,
			formData,
			selectedRows,
			searchParams,
			dialogMode,
			computedFormConfig,
			handleSearch,
			handleReset,
			handleAdd,
			handleEdit,
			handleView,
			handleDelete,
			handleBatchDelete,
			handleSelectionChange,
			handleSubmit,
			handleCancel,
			handleDialogClose,
			getComponentProps,
			refresh,
			getSelectedRows,
			formatter,
		};
	},
};
</script>

<style lang="scss" scoped>
.el-header {
	--el-header-height: 40px;
}

.el-aside {
	padding: 10px;

	.search-btn {
		padding-top: 10px;
		display: flex;
		gap: 8px;

		.el-button {
			flex: 1;
		}
	}
}

.nopadding {
	padding: 0;
}

.left-panel {
	display: flex;
	gap: 8px;
}
</style>
