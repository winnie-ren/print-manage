<template>
	<el-container>
		<el-aside width="250px">
			<el-form label-position="top" size="small">
				<template v-for="item in searchConfig" :key="item.name">
					<el-form-item :label="item.label">
						<el-input
							v-if="item.component === 'input'"
							v-model="search[item.name]"
							:placeholder="item.options?.placeholder || '请输入'"
							clearable
						></el-input>
						<el-select
							v-else-if="item.component === 'select'"
							v-model="search[item.name]"
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
							v-model="search[item.name]"
							:min="1"
							controls-position="right"
							style="width: 100%"
						/>
					</el-form-item>
				</template>
				<div class="search-btn">
					<el-button
						type="primary"
						icon="el-icon-search"
						@click="upsearch"
					>
						查询
					</el-button>
					<el-button icon="el-icon-refresh" @click="resetSearch">
						重置
					</el-button>
				</div>
			</el-form>
		</el-aside>
		<el-container>
			<el-header>
				<div class="left-panel">
					<el-button
						type="primary"
						icon="el-icon-plus"
						size="small"
						@click="add"
					>
						新增
					</el-button>
					<el-button
						type="danger"
						plain
						icon="el-icon-delete"
						size="small"
						:disabled="selection.length == 0"
						@click="batch_del"
					>
						删除
					</el-button>
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
					<el-table-column
						type="selection"
						width="50"
					></el-table-column>
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
									@confirm="
										table_del(scope.row, scope.$index)
									"
								>
									<template #reference>
										<el-button
											text
											type="primary"
											size="small"
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
		<el-dialog
			class="print-dialog"
			v-model="dialogVisible"
			:title="dialogTitle"
			width="80%"
			top="20px"
		>
			<div class="print-page">
				<el-main>
					<el-form
						ref="formRef"
						:model="formDetail"
						label-width="100px"
						status-icon
					>
						<el-form-item
							v-for="item in formConfig"
							:key="item.prop"
							:label="item.label"
							:prop="item.prop"
						>
							<el-radio-group v-model="formDetail[item.prop]">
								<el-radio
									v-for="option in item.options"
									:key="option.value"
									:label="option.value"
									border
								>
									{{ option.label }}
								</el-radio>
								<el-input
									v-if="
										item.prop === 'spec' &&
										formDetail[item.prop] === 0
									"
									v-model="formDetail[item.prop + 'Custom']"
									clearable
									style="width: 120px"
									placeholder="请输入"
								></el-input>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="补充说明" prop="remarks">
							<el-input
								v-model="formDetail.remarks"
								type="textarea"
								placeholder="其他对商品要求的描述或补充说明"
							></el-input>
						</el-form-item>
						<el-form-item label="文件上传" prop="files">
							<el-upload
								class="upload-demo"
								drag
								action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
								multiple
								style="flex: 1"
							>
								<el-icon size="80" color="#ffaf58"
									><upload-filled
								/></el-icon>
								<div class="el-upload__text">
									请将文件拖到此处或 <em>点击上传</em>
								</div>
							</el-upload>
						</el-form-item>
					</el-form>
				</el-main>
				<div class="bottom-shop">
					<div class="order-content">
						<span class="price"> 官网下单￥ </span>
						<span>预计生产时间， 预计净重</span>
					</div>
					<el-button
						type="primary"
						size="large"
						plain
						style="margin-right: 10px"
						>计算价格</el-button
					>
					<el-button-group>
						<el-button type="danger" size="large">
							加入购物车
						</el-button>
						<el-button type="success" size="large" @click="buyNow"
							>立即购买</el-button
						>
					</el-button-group>
				</div>
			</div>
		</el-dialog>
	</el-container>
</template>

<script>
import { UploadFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

// 从表单配置中提取选项数据
const formConfigOptions = {
	spec: [
		{ label: "A4", value: 1 },
		{ label: "A3", value: 2 },
		{ label: "A5", value: 3 },
		{ label: "B4", value: 4 },
		{ label: "16K", value: 5 },
		{ label: "A2", value: 6 },
		{ label: "A1", value: 7 },
		{ label: "A0", value: 8 },
		{ label: "8K", value: 9 },
		{ label: "自定义尺寸", value: 0 },
	],
	deliveryMethod: [
		{ label: "自取", value: 1 },
		{ label: "送货上门", value: 2 },
		{ label: "快递到付", value: 3 },
		{ label: "快递寄付", value: 4 },
	],
	paperType: [
		{ label: "80克双胶纸", value: 1 },
		{ label: "100克双胶纸", value: 2 },
		{ label: "128克铜板纸", value: 3 },
		{ label: "157克铜板纸", value: 4 },
	],
	coverColor: [
		{ label: "黑白", value: 1 },
		{ label: "彩色", value: 2 },
		{ label: "单面", value: 3 },
		{ label: "双面", value: 4 },
	],
	innerColor: [
		{ label: "黑白", value: 1 },
		{ label: "彩色", value: 2 },
		{ label: "单面", value: 3 },
		{ label: "双面", value: 4 },
	],
};

// 搜索配置
const searchConfig = [
	{
		label: "打印单号",
		name: "printNo",
		component: "input",
		options: { placeholder: "请输入打印单号" },
	},
	{
		label: "成品规格",
		name: "spec",
		component: "select",
		options: {
			placeholder: "请选择成品规格",
			items: formConfigOptions["spec"],
		},
	},
	{
		label: "文件页数",
		name: "pageCount",
		component: "number",
		options: { placeholder: "请输入文件页数" },
	},
	{
		label: "纸张",
		name: "paperType",
		component: "select",
		options: {
			placeholder: "请选择纸张",
			items: formConfigOptions["paperType"],
		},
	},
	{
		label: "封面印色",
		name: "coverColor",
		component: "select",
		options: {
			placeholder: "请选择封面印色",
			items: formConfigOptions["coverColor"],
		},
	},
	{
		label: "内页印色",
		name: "innerColor",
		component: "select",
		options: {
			placeholder: "请选择内页印色",
			items: formConfigOptions["innerColor"],
		},
	},
	{
		label: "交付方式",
		name: "deliveryMethod",
		component: "select",
		options: {
			placeholder: "请选择交付方式",
			items: formConfigOptions["deliveryMethod"],
		},
	},
];

// 定义表格头部配置
const tableHeader = [
	{
		label: "打印单号",
		name: "printNo",
		component: "input", // 保留输入框因为有自定义值
		table: true,
		span: 6,
	},
	{
		label: "成品规格",
		name: "spec",
		component: "select",
		options: formConfigOptions["spec"],
		table: true,
		span: 6,
	},
	{
		label: "文件页数",
		name: "pageCount",
		component: "number",
		table: true,
		span: 6,
	},
	{
		label: "纸张",
		name: "paperType",
		component: "select",
		options: formConfigOptions["paperType"],
		table: true,
		span: 6,
	},
	{
		label: "封面印色",
		name: "coverColor",
		component: "select",
		options: formConfigOptions["coverColor"],
		table: true,
		span: 6,
	},
	{
		label: "内页印色",
		name: "innerColor",
		component: "select",
		options: formConfigOptions["innerColor"],
		table: true,
		span: 6,
	},
	{
		label: "交付方式",
		name: "deliveryMethod",
		component: "select",
		options: formConfigOptions["deliveryMethod"],
		table: true,
		span: 6,
	},
];

export default {
	name: "colorfulBooklets",
	components: {
		UploadFilled,
	},
	data() {
		return {
			list: {
				apiObj: this.$API.print.colorPage,
			},
			tableHeader,
			searchConfig,
			page: {
				pageSize: 20,
				pageNum: 1,
				total: 0,
			},
			selection: [],
			dialogVisible: false,
			dialogTitle: "新增",
			search: {
				printNo: "",
				spec: "",
				pageCount: "",
				paperType: "",
				coverColor: "",
				innerColor: "",
				deliveryMethod: "",
			},
			formDetail: {
				spec: 1,
				pageCount: 1,
				quantity: 1,
				paperType: 1,
				coverColor: 1,
				innerColor: 1,
				coverMaterial: 1,
				coverProcess: 1,
				bindingMethod: 1,
				deliveryMethod: 1,
				remarks: "",
				customSize: "",
			},
			rules: {
				required: [{ required: true, message: "请填写" }],
				length: [{ required: true, len: 3, message: "长度需为3位" }],
				type: [
					{ required: true, type: "email", message: "类型需为email" },
				],
				range: [
					{ required: true, min: 3, max: 5, message: "范围在3至5位" },
				],
				enum: [
					{
						required: true,
						type: "enum",
						enum: ["admin", "user", "guest"],
						message: "请填写admin，user，guest其一",
					},
				],
				custom: [
					{
						required: true,
						validator: (rule, value) => {
							return value === "1";
						},
						message: "请填写数字1",
						trigger: "blur",
					},
				],
				async: [
					{
						required: true,
						validator: (rule, value, callback) => {
							this.$API.demo.ver
								.get({ value: value })
								.then((res) => {
									if (res.data != value) {
										return callback(
											new Error(
												"请输入SCUI最新版本号：" +
													res.data
											)
										);
									}
									callback();
								});
						},
						trigger: "blur",
					},
				],
			},
			formConfig: [
				{
					label: "成品规格",
					prop: "spec",
					type: "radio",
					options: [
						{ label: "A4", value: 1 },
						{ label: "A3", value: 2 },
						{ label: "A5", value: 3 },
						{ label: "B4", value: 4 },
						{ label: "16K", value: 5 },
						{ label: "A2", value: 6 },
						{ label: "A1", value: 7 },
						{ label: "A0", value: 8 },
						{ label: "8K", value: 9 },
						{ label: "自定义尺寸", value: 0 },
					],
				},
				{
					label: "文件页数",
					prop: "pageCount",
					type: "radio",
					options: [{ label: "100", value: 1 }],
				},
				{
					label: "份数",
					prop: "quantity",
					type: "radio",
					options: [
						{ label: "1", value: 1 },
						{ label: "10", value: 2 },
						{ label: "50", value: 3 },
						{ label: "100", value: 4 },
					],
				},
				{
					label: "纸张",
					prop: "paperType",
					type: "radio",
					options: [
						{ label: "80克双胶纸", value: 1 },
						{ label: "100克双胶纸", value: 2 },
						{ label: "128克铜板纸", value: 3 },
						{ label: "157克铜板纸", value: 4 },
					],
				},
				{
					label: "封面印色",
					prop: "coverColor",
					type: "radio",
					options: [
						{ label: "黑白", value: 1 },
						{ label: "彩色", value: 2 },
						{ label: "单面", value: 3 },
						{ label: "双面", value: 4 },
					],
				},
				{
					label: "内页印色",
					prop: "innerColor",
					type: "radio",
					options: [
						{ label: "黑白", value: 1 },
						{ label: "彩色", value: 2 },
						{ label: "单面", value: 3 },
						{ label: "双面", value: 4 },
					],
				},
				{
					label: "封面材质",
					prop: "coverMaterial",
					type: "radio",
					options: [
						{ label: "铜板纸", value: 1 },
						{ label: "特种纸", value: 2 },
						{ label: "皮革纸", value: 3 },
					],
				},
				{
					label: "封面工艺",
					prop: "coverProcess",
					type: "radio",
					options: [
						{ label: "不加膜", value: 1 },
						{ label: "单面哑膜", value: 2 },
						{ label: "单面光膜", value: 3 },
					],
				},
				{
					label: "装订方式",
					prop: "bindingMethod",
					type: "radio",
					options: [
						{ label: "骑马钉", value: 1 },
						{ label: "胶装", value: 2 },
					],
				},
				{
					label: "交付方式",
					prop: "deliveryMethod",
					type: "radio",
					options: [
						{ label: "自取", value: 1 },
						{ label: "送货上门", value: 2 },
						{ label: "快递到付", value: 3 },
						{ label: "快递寄付", value: 4 },
					],
				},
			],
		};
	},
	methods: {
		// 新增
		add() {
			this.dialogTitle = "新增";
			this.resetForm();
			this.dialogVisible = true;
		},
		// 编辑
		table_edit(row) {
			this.dialogTitle = "编辑";
			this.dialogVisible = true;
			this.$nextTick(() => {
				this.formDetail = { ...row };
			});
		},
		// 查看
		table_show(row) {
			this.dialogTitle = "查看";
			this.dialogVisible = true;
			this.$nextTick(() => {
				this.formDetail = { ...row };
			});
		},
		// 删除
		async table_del(row, index) {
			var reqData = { id: row.id };
			var res = await this.$API.demo.post.post(reqData);
			if (res.code == 200) {
				// 这里选择刷新整个表格 OR 插入/编辑现有表格数据
				this.$refs.table.tableData.splice(index, 1);
				this.$message.success("删除成功");
			} else {
				this.$alert(res.message, "提示", { type: "error" });
			}
		},
		// 批量删除
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
					const res = await this.$API.user.userDelete.delete(ids);
					if (res.code === 0) {
						loading.close();
						this.$message.success("删除成功");
					}
				})
				.catch(() => {});
		},
		// 表格选择后回调事件
		selectionChange(selection) {
			this.selection = selection;
		},
		// 搜索
		upsearch() {
			// 过滤掉空字符串，只传递有值的参数
			const filteredSearch = {};
			for (const key in this.search) {
				const value = this.search[key];
				if (value !== "" && value !== null && value !== undefined) {
					filteredSearch[key] = value;
				}
			}
			this.$refs.table.upData(filteredSearch);
		},
		// 重置查询条件
		resetSearch() {
			// 根据配置重置搜索条件
			const resetSearch = {};
			this.searchConfig.forEach((item) => {
				resetSearch[item.name] = "";
			});
			this.search = resetSearch;
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
		async onSubmit() {
			// 提交表单数据
			const res = await this.$API.print.singleSave.post(this.formDetail);
			if (res.code === 0) {
				this.dialogVisible = false;
				this.$refs.table.getData(); // 刷新表格
				ElMessage.success("操作成功");
			} else {
				ElMessage.error(res.message || "操作失败");
			}
		},
		resetForm() {
			this.formDetail = {
				spec: 1,
				pageCount: 1,
				quantity: 1,
				paperType: 1,
				coverColor: 1,
				innerColor: 1,
				coverMaterial: 1,
				coverProcess: 1,
				bindingMethod: 1,
				deliveryMethod: 1,
				remarks: "",
				customSize: "",
			};
		},
		async buyNow() {
			const res = await this.$API.print.colorSave.post(this.formDetail);
			if (res.code === 0 && res.data) {
				if (this.formDetail.payType === "ALIPAY") {
					// 调用支付宝统一收单下单并支付页面接口
					// 将支付宝返回的表单字符串写在浏览器中，表单会自动触发submit提交
					document.write(res.data);
				}
			}
		},
	},
};
</script>
<style lang="scss">
.print-dialog {
	.el-dialog__body {
		padding: 0 !important;
	}
	.el-dialog__header {
		border-bottom: 1px solid var(--el-border-color-light);
	}
}
</style>
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

.print-dialog {
	.print-page {
		height: calc(100vh - 100px);
	}
	.el-main {
		padding-top: 10px;
		padding-left: 0;
		padding-right: 0;
	}
}

.bottom-shop {
	background-color: white;
	padding: 15px 30px;
	box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 15px;
}

.order-content {
	flex: 1;
	font-size: 16px;
	font-weight: bold;
}
</style>
