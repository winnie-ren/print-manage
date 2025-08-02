<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus">新增</el-button>
				<el-button type="danger" plain icon="el-icon-delete"
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
					:prop="item.prop"
     :key="item.prop"
				></el-table-column>
				<el-table-column
					label="操作"
					fixed="right"
					align="right"
					width="160"
				>
					<template #default>
						<el-button-group>
							<el-button text type="primary" size="small"
								>查看</el-button
							>
							<el-button text type="primary" size="small"
								>编辑</el-button
							>
							<el-button text type="primary" size="small"
								>删除</el-button
							>
						</el-button-group>
					</template>
				</el-table-column>
			</scTable>
		</el-main>
	</el-container>
</template>

<script>
export default {
	name: "roleManage",
	data() {
		return {
			list: {
				apiObj: this.$API.demo.list,
			},
			tableHeader: [
				{ label: "角色编码", prop: "gco" },
				{ label: "角色名称", prop: "gna" },
				{ label: "状态", prop: "status", format: "0:无效/1:正常" },
			],
			page: {
				pageSize: 20,
				pageNum: 1,
				total: 0,
			},
			search: {
				keyword: "",
			},
		};
	},
	mounted() {
		// this.getTableList();
	},
	methods: {
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
