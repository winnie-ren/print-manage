<template>
	<el-container>
		<el-header>
			<el-form
				:inline="true"
				label-position="left"
				label-width="80px"
				:model="form"
				class="demo-form-inline"
			>
				<el-row :gutter="10">
					<template v-for="item in tableHeader" :key="item.name">
						<el-col :span="item.span || 24">
							<el-form-item
								:label="item.label"
								style="width: 100%"
							>
								<el-input
									v-model="form[item.name]"
									placeholder="请输入"
									v-if="item.component === 'input'"
								></el-input>
								<el-select
									v-model="form[item.name]"
									placeholder="请选择"
									v-if="item.component === 'select'"
									style="width: 100%"
								>
									<el-option
										v-for="option in item.options"
										:key="option.value"
										:label="option.label"
										:value="option.value"
									></el-option>
								</el-select>
								<el-input-number
									v-model="form[item.name]"
									:min="1"
									controls-position="right"
									v-if="item.component === 'number'"
									style="width: 100%"
								/>
							</el-form-item>
						</el-col>
					</template>
					<el-col :span="6">
						<el-form-item>
							<el-button type="primary" @click="upsearch">
								查询
							</el-button>
							<el-button type="primary" @click="add">
								新增
							</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
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
											[
												'size',
												'weight',
												'styleCount',
												'sheetCount',
											].includes(item.prop) &&
											formDetail[item.prop] === 0
										"
										v-model="
											formDetail[item.prop + 'Custom']
										"
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
const formConfigOptions = [
	{
		label: "印色",
		prop: "printColor",
		type: "radio",
		options: [
			{ label: "黑白", value: "黑白" },
			{ label: "彩色", value: "彩色" },
		],
	},
	{
		label: "印面",
		prop: "printSide",
		type: "radio",
		options: [
			{ label: "单面", value: "单面" },
			{ label: "双面", value: "双面" },
		],
	},
	{
		label: "材料",
		prop: "material",
		type: "radio",
		options: [
			{ label: "铜版纸", value: "铜版纸" },
			{ label: "哑粉纸", value: "哑粉纸" },
			{ label: "双胶纸", value: "双胶纸" },
		],
	},
];

// 定义表格头部配置
const tableHeader = [
	{
		label: "印色",
		name: "printColor",
		component: "select",
		options: formConfigOptions.find(item => item.prop === "printColor")?.options || [],
		table: true,
		span: 6,
	},
	{
		label: "印面",
		name: "printSide",
		component: "select",
		options: formConfigOptions.find(item => item.prop === "printSide")?.options || [],
		table: true,
		span: 6,
	},
	{
		label: "成品尺寸",
		name: "size",
		component: "input", // 保留输入框因为有自定义值
		table: true,
		span: 6,
	},
	{
		label: "材料",
		name: "material",
		component: "select",
		options: formConfigOptions.find(item => item.prop === "material")?.options || [],
		table: true,
		span: 6,
	},
	{
		label: "克重",
		name: "weight",
		component: "input", // 保留输入框因为有自定义值
		table: true,
		span: 6,
	},
	{
		label: "款数",
		name: "styleCount",
		component: "number", // 保留输入框因为有自定义值
		table: true,
		span: 6,
	},
	{
		label: "张数",
		name: "sheetCount",
		component: "number", // 保留输入框因为有自定义值
		table: true,
		span: 6,
	},
];

export default {
	name: "single",
	components: {
		UploadFilled,
	},
	data() {
		return {
			list: {
				// 暂时使用用户API，实际项目中需要创建相应的打印列表API
				apiObj: this.$API.user.userPage,
			},
			tableHeader,
			page: {
				pageSize: 20,
				pageNum: 1,
				total: 0,
			},
			selection: [],
			dialogVisible: false,
			dialogTitle: "新增",
			form: {},
			formDetail: {
				printColor: "黑白",
				printSide: "单面",
				size: "148*210",
				material: "铜版纸",
				weight: "157g",
				styleCount: 1,
				sheetCount: 1,
				deliveryMethod: "自取",
				payType: "ALIPAY",
				remarks: "",
			},
			formConfig: [
				{
					label: "印色",
					prop: "printColor",
					type: "radio",
					options: [
						{ label: "黑白", value: "黑白" },
						{ label: "彩色", value: "彩色" },
					],
				},
				{
					label: "印面",
					prop: "printSide",
					type: "radio",
					options: [
						{ label: "单面", value: "单面" },
						{ label: "双面", value: "双面" },
					],
				},
				{
					label: "成品尺寸",
					prop: "size",
					type: "radio",
					options: [
						{ label: "148*210", value: "148*210" },
						{ label: "176*250", value: "176*250" },
						{ label: "210*297", value: "210*297" },
						{ label: "297*420", value: "297*420" },
						{ label: "自定义", value: 0 },
					],
				},
				{
					label: "材料",
					prop: "material",
					type: "radio",
					options: [
						{ label: "铜版纸", value: "铜版纸" },
						{ label: "哑粉纸", value: "哑粉纸" },
						{ label: "双胶纸", value: "双胶纸" },
					],
				},
				{
					label: "克重",
					prop: "weight",
					type: "radio",
					options: [
						{ label: "157g", value: "157g" },
						{ label: "200g", value: "200g" },
						{ label: "250g", value: "250g" },
						{ label: "300g", value: "300g" },
						{ label: "157g", value: "157g" },
						{ label: "80g", value: "80g" },
						{ label: "100g", value: "100g" },
						{ label: "120g", value: "120g" },
						{ label: "自定义", value: 0 },
					],
				},
				{
					label: "款数",
					prop: "styleCount",
					type: "radio",
					options: [
						{ label: "1", value: 1 },
						{ label: "2", value: 2 },
						{ label: "3", value: 3 },
						{ label: "5", value: 4 },
						{ label: "自定义", value: 0 },
					],
				},
				{
					label: "张数",
					prop: "sheetCount",
					type: "radio",
					options: [
						{ label: "1", value: 1 },
						{ label: "100", value: 100 },
						{ label: "500", value: 500 },
						{ label: "1000", value: 1000 },
						{ label: "自定义", value: 0 },
					],
				},
				{
					label: "交付方式",
					prop: "deliveryMethod",
					type: "radio",
					options: [
						{ label: "自取", value: "自取" },
						{ label: "送货上门", value: "送货上门" },
						{ label: "快递到付", value: "快递到付" },
						{ label: "快递寄付", value: "快递寄付" },
					],
				},
				{
					label: "支付方式",
					prop: "payType",
					type: "radio",
					options: [
						{ label: "微信", value: "WXPAY" },
						{ label: "支付宝", value: "ALIPAY" },
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
			this.$refs.table.upData(this.form);
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
				printColor: "黑白",
				printSide: "单面",
				size: "148*210",
				material: "铜版纸",
				weight: "157g",
				styleCount: 1,
				sheetCount: 1,
				deliveryMethod: "自取",
				payType: "ALIPAY",
				remarks: "",
			};
		},
		async buyNow() {
			const res = await this.$API.print.singleSave.post(this.formDetail);
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
	.el-dialog__header{
		border-bottom: 1px solid var(--el-border-color-light);
	}
}
</style>
<style lang="scss" scoped>
.el-header {
	height: 125px;
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
