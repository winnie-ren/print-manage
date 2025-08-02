<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus" @click="add"
					>新增</el-button
				>
				<el-button
					type="danger"
					plain
					icon="el-icon-delete"
					:disabled="selection.length == 0"
					@click="batch_del"
					>删除</el-button
				>
			</div>
			<div class="right-panel">
				<div class="right-panel-search">
					<el-input
						v-model="search.keyword"
						placeholder="关键词"
						clearable
					></el-input>
					<el-button
						type="primary"
						icon="el-icon-search"
						@click="upsearch"
					></el-button>
				</div>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :apiObj="list.apiObj" row-key="id" stripe>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column
					v-for="item in tableHeader"
					:label="item.label"
					:prop="item.name"
					:key="item.name"
				></el-table-column>
				<el-table-column
					label="操作"
					fixed="right"
					align="right"
					width="160"
				>
					<template #default="scope">
						<el-button-group>
							<el-button
								text
								type="primary"
								size="small"
								@click="table_show(scope.row, scope.$index)"
								>查看</el-button
							>
							<el-button
								text
								type="primary"
								size="small"
								@click="table_edit(scope.row, scope.$index)"
								>编辑</el-button
							>
							<el-popconfirm
								title="确定删除吗？"
								@confirm="table_del(scope.row, scope.$index)"
							>
								<template #reference>
									<el-button text type="primary" size="small"
										>删除</el-button
									>
								</template>
							</el-popconfirm>
						</el-button-group>
					</template>
				</el-table-column>
			</scTable>
		</el-main>
	</el-container>
	<el-dialog v-model="dialogVisible" title="添加" width="500">
		<scForm v-model="form" :config="formConfig"></scForm>
	</el-dialog>
</template>

<script>
import saveDialog from "./save";
const tableHeader = [
	{
		label: "菜单编码",
		name: "gco",
		component: "input",
		options: { placeholder: "请输入" },
	},
	{
		label: "菜单名称",
		name: "gna",
		component: "input",
		options: { placeholder: "请输入" },
	},
	{
		label: "父级编码",
		name: "pgco",
		component: "input",
		options: { placeholder: "请输入" },
	},
	{
		label: "访问url",
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
	{ label: "显示排序", name: "sorts", component: "number" },
	{
		label: "菜单类型",
		name: "menuType",
		format: "dir:文件夹/node:菜单",
		component: "radio",
		options: {
			items: [
				{ value: "dir", label: "文件夹" },
				{ value: "node", label: "菜单" },
			],
		},
	},
	{
		label: "打开方式",
		name: "target",
		format: "0:本系统窗口/1:浏览器新标签页",
		component: "radio",
		options: {
			items: [
				{ value: 0, label: "本系统窗口" },
				{ value: 1, label: "浏览器新标签页" },
			],
		},
	},
	{
		label: "状态",
		name: "status",
		format: "0:无效/1:有效",
		component: "radio",
		options: {
			items: [
				{ value: 0, label: "无效" },
				{ value: 1, label: "有效" },
			],
		},
	},
];
export default {
	name: "menuManage",
	components: {
		saveDialog,
	},
	data() {
		return {
			list: {
				apiObj: this.$API.demo.list,
			},
			tableHeader,
			page: {
				pageSize: 20,
				pageNum: 1,
				total: 0,
			},
			search: {
				keyword: "",
			},
			selection: [],
			dialogVisible: false,
			form: {},
			formConfig: {
				labelWidth: 80,
				labelPosition: "left",
				formItems: tableHeader,
			},
		};
	},
	mounted() {
		// this.getTableList();
	},
	methods: {
		//添加
		add() {
			this.dialogVisible = true;
		},
		//编辑
		table_edit(row) {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog.open("edit").setData(row);
			});
		},
		//查看
		table_show(row) {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog.open("show").setData(row);
			});
		},
		//删除
		async table_del(row, index) {
			var reqData = { id: row.id };
			var res = await this.$API.demo.post.post(reqData);
			if (res.code == 200) {
				//这里选择刷新整个表格 OR 插入/编辑现有表格数据
				this.$refs.table.tableData.splice(index, 1);
				this.$message.success("删除成功");
			} else {
				this.$alert(res.message, "提示", { type: "error" });
			}
		},
		//批量删除
		async batch_del() {
			this.$confirm(
				`确定删除选中的 ${this.selection.length} 项吗？`,
				"提示",
				{
					type: "warning",
				}
			)
				.then(() => {
					const loading = this.$loading();
					this.selection.forEach((item) => {
						this.$refs.table.tableData.forEach((itemI, indexI) => {
							if (item.id === itemI.id) {
								this.$refs.table.tableData.splice(indexI, 1);
							}
						});
					});
					loading.close();
					this.$message.success("操作成功");
				})
				.catch(() => {});
		},
		//表格选择后回调事件
		selectionChange(selection) {
			this.selection = selection;
		},
		//搜索
		upsearch() {
			this.$refs.table.upData(this.search);
		},
		getTableList() {
			this.$API.user.userPage.post();
		},
	},
};
</script>

<style></style>
