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
			<scTable
				ref="table"
				:apiObj="list.apiObj"
				row-key="id"
				stripe
				@selectionChange="selectionChange"
			>
				<el-table-column type="selection" width="50"></el-table-column>
				<template v-for="item in tableHeader" :key="item.name">
					<el-table-column
						v-if="item.table !== false"
						:label="item.label"
						:prop="item.name"
						:width="item.width"
						:formatter="
							item.format ? (row) => formatter(row, item) : ''
						"
					>
					</el-table-column>
				</template>
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
		<scForm v-model="form" :config="formConfig" @submit="onSubmit"></scForm>
	</el-dialog>
</template>

<script>
import { ElMessage } from "element-plus";
const tableHeader = [
	{
		label: "菜单编码",
		name: "gco",
		component: "input",
		form: true,
		options: { placeholder: "请输入" },
	},
	{
		label: "菜单名称",
		name: "gna",
		component: "input",
		form: true,
		options: { placeholder: "请输入" },
	},
	{
		label: "父级编码",
		name: "pgco",
		component: "input",
		form: true,
		options: { placeholder: "请输入" },
	},
	{
		label: "访问url",
		name: "url",
		component: "input",
		form: true,
		options: { placeholder: "请输入" },
	},
	{
		label: "图标",
		name: "icon",
		component: "input",
		form: true,
		options: { placeholder: "请输入" },
	},
	{ label: "显示排序", name: "sorts", form: true, component: "number" },
	{
		label: "菜单类型",
		name: "menuType",
		format: "dir:文件夹/node:菜单",
		component: "radio",
		form: true,
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
		form: true,
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
	data() {
		return {
			list: {
				apiObj: this.$API.menu.userPage,
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
				formItems: tableHeader.filter((item) => item.form),
			},
		};
	},
	methods: {
		//添加
		add() {
			console.log(this.$refs.table);
			this.dialogVisible = true;
		},
		//编辑
		table_edit(row) {
			this.dialogVisible = true;
			this.$nextTick(() => {
				this.$refs.saveDialog.open("edit").setData(row);
			});
		},
		//查看
		table_show(row) {
			this.dialogVisible = true;
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
				.then(async () => {
					const loading = this.$loading();
					const ids = this.selection.map((item) => item.id);
					const res = await this.$API.menu.userDelete.delete(ids);
					if (res.code === 0) {
						loading.close();
						this.$message.success("删除成功");
					}
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
		formatter(row, item) {
			// 表格字段格式化
			const map = item.format.split("/").reduce((acc, item) => {
				const [key, label] = item.split(":");
				acc[key.trim()] = label.trim();
				return acc;
			}, {});
			return map[String(row[item.name])] || "";
		},
		async onSubmit(form) {
			const res = await this.$API.menu.userSave.post(form);
			if (res.code === 0) {
				this.dialogVisible = false;
				this.$refs.table.getData();
				ElMessage.success("操作成功");
			}
		},
	},
};
</script>

<style></style>
