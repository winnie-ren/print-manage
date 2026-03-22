<template>
	<div v-if="!menuIsCollapse" class="adminui-side-search">
		<el-select
			v-model="menuSelectValue"
			filterable
			remote
			clearable
			reserve-keyword
			placeholder="搜索菜单"
			:remote-method="queryMenuSelect"
			:loading="menuSelectLoading"
			@change="handleMenuSelect"
		>
			<el-option
				v-for="item in menuSearchOptions"
				:key="item.path"
				:label="item.value"
				:value="item.path"
			>
				<div class="menu-search-item">
					<div class="menu-search-title">{{ item.value }}</div>
					<div class="menu-search-path">{{ item.breadcrumb }}</div>
				</div>
			</el-option>
		</el-select>
	</div>
</template>

<script>
export default {
	name: "menuSelect",
	props: {
		menu: {
			type: Array,
			default: () => [],
		},
		menuIsCollapse: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			menuSelectValue: "",
			menuSearchOptions: [],
			menuSelectLoading: false,
		};
	},
	computed: {
		menuSearchPool() {
			return this.flattenMenuForSearch(this.menu);
		},
	},
	methods: {
		// 生成搜索池
		flattenMenuForSearch(list, parents = []) {
			const res = [];
			list &&
				list.forEach((item) => {
					const title =
						item.meta && item.meta.title ? item.meta.title : "";
					const nextParents = title ? [...parents, title] : parents;
					if (item.path && title) {
						res.push({
							value: title,
							path: item.path,
							breadcrumb: nextParents.join(" / "),
						});
					}
					if (item.children && item.children.length) {
						res.push(
							...this.flattenMenuForSearch(
								item.children,
								nextParents
							)
						);
					}
				});
			return res;
		},
		// el-select 远程搜索
		queryMenuSelect(query) {
			const key = (query || "").trim().toLowerCase();
			if (!key) {
				this.menuSearchOptions = [];
				return;
			}
			this.menuSelectLoading = true;
			const result = this.menuSearchPool.filter((item) => {
				return (
					item.value.toLowerCase().includes(key) ||
					item.breadcrumb.toLowerCase().includes(key)
				);
			});
			this.menuSearchOptions = result.slice(0, 50);
			this.menuSelectLoading = false;
		},
		// 选中跳转
		handleMenuSelect(path) {
			if (path) {
				this.$router.push({ path });
				this.menuSelectValue = "";
				this.menuSearchOptions = [];
			}
		},
	},
};
</script>

<style scoped>
.adminui-side-search {
	padding: 10px 12px 0px 12px;
}
.menu-search-item {
	display: flex;
	flex-direction: column;
	line-height: 1.2;
	padding: 2px 0;
}
.menu-search-title {
	font-size: 13px;
}
.menu-search-path {
	font-size: 12px;
	color: #999;
}
</style>
