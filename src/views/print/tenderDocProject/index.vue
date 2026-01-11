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
								<el-input-number
									v-if="item.type === 'input-number'"
									v-model="formDetail[item.prop]"
									:min="1"
									controls-position="right"
								/>
								<el-radio-group v-else v-model="formDetail[item.prop]">
									<el-radio
										v-for="option in item.options"
										:key="option.value"
										:label="option.value"
										border
									>
										{{ option.label }}
									</el-radio>
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
		label: "规格",
		prop: "spec",
		type: "radio",
		options: [{ label: "A4", value: "A4" }],
	},
	{
		label: "支付方式",
		prop: "paymentMethod",
		type: "radio",
		options: [
			{ label: "自取", value: "自取" },
			{ label: "送货上门", value: "送货上门" },
			{ label: "快递到付", value: "快递到付" },
			{ label: "快递寄付", value: "快递寄付" },
		],
	},
];

// 定义表格头部配置
const tableHeader = [
	{
		label: "规格",
		name: "spec",
		component: "select",
		options: formConfigOptions.find(item => item.prop === "spec")?.options || [],
		table: true,
		span: 6,
	},
	{
		label: "正本份数",
		name: "originalCount",
		component: "number",
		table: true,
		span: 6,
	},
	{
		label: "副本份数",
		name: "copyCopies",
		component: "number",
		table: true,
		span: 6,
	},
	{
		label: "是否扫描",
		name: "needScan",
		component: "select",
		table: true,
		span: 6,
	},
	{
		label: "正本印色",
		name: "originalPrintColor",
		component: "select",
		table: true,
		span: 6,
	},
	{
		label: "副本印色",
		name: "copyPrintColor",
		component: "select",
		table: true,
		span: 6,
	},
	{
		label: "支付方式",
		name: "paymentMethod",
		component: "select",
		options: formConfigOptions.find(item => item.prop === "paymentMethod")?.options || [],
		table: true,
		span: 6,
	},
];

export default {
	name: "tenderDocProject",
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
				spec: "A4",
				workflow: "先印正本",
				originalCount: 1,
				copyCopies: 1,
				needScan: 1,
				scanOption: 1,
				originalPrintColor: 1,
				copyPrintColor: 1,
				coverColor: 1,
				bindingMethod: 1,
				deliveryTime: 1,
				paymentMethod: 1,
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
				// 规格
				{
					label: "规格",
					prop: "spec",
					type: "radio",
					options: [{ label: "A4", value: "A4" }],
				},
				// 工作流程
				{
					label: "工作流程",
					prop: "workflow",
					type: "radio",
					options: [
						{ label: "先印正本", value: "先印正本" },
						{ label: "直接打印胶装", value: "直接打印胶装" },
					],
				},
				// 正本份数
				{
					label: "正本份数",
					prop: "originalCount",
					type: "input-number",
				},
				// 副本份数
				{
					label: "副本份数",
					prop: "copyCopies",
					type: "input-number",
				},
				// 是否扫描
				{
					label: "是否扫描",
					prop: "needScan",
					type: "radio",
					options: [
						{ label: "是", value: "是" },
						{ label: "否", value: "否" },
					],
				},
				// 扫描文件
				{
					label: "扫描文件",
					prop: "scanOption",
					type: "radio",
					options: [
						{ label: "发送", value: "发送" },
						{ label: "立即", value: "立即" },
						{ label: "刻录光盘", value: "刻录光盘" },
					],
				},
				// 正本印色
				{
					label: "正本印色",
					prop: "originalPrintColor",
					type: "radio",
					options: [
						{ label: "黑白", value: "黑白" },
						{ label: "彩色", value: "彩色" },
						{ label: "单面", value: "单面" },
						{ label: "双面", value: "双面" },
					],
				},
				// 副本印色
				{
					label: "副本印色",
					prop: "copyPrintColor",
					type: "radio",
					options: [
						{ label: "黑白", value: "黑白" },
						{ label: "彩色", value: "彩色" },
						{ label: "单面", value: "单面" },
						{ label: "双面", value: "双面" },
					],
				},
				// 封面颜色
				{
					label: "封面颜色",
					prop: "coverColor",
					type: "radio",
					options: [
						{ label: "白色", value: "白色" },
						{ label: "大兰", value: "大兰" },
						{ label: "深蓝", value: "深蓝" },
						{ label: "浅绿", value: "浅绿" },
						{ label: "浅黄", value: "浅黄" },
						{ label: "大红", value: "大红" },
						{ label: "透明封面", value: "透明封面" },
					],
				},
				// 装订方式
				{
					label: "装订方式",
					prop: "bindingMethod",
					type: "radio",
					options: [
						{ label: "胶装", value: "胶装" },
						{ label: "夹条装", value: "夹条装" },
						{ label: "铁圈装", value: "铁圈装" },
					],
				},
				// 出货时效
				{
					label: "出货时效",
					prop: "deliveryTime",
					type: "radio",
					options: [
						{ label: "1小时", value: "1小时" },
						{ label: "2小时", value: "2小时" },
						{ label: "4小时", value: "4小时" },
					],
				},
				// 支付方式
				{
					label: "支付方式",
					prop: "paymentMethod",
					type: "radio",
					options: [
						{ label: "自取", value: "自取" },
						{ label: "送货上门", value: "送货上门" },
						{ label: "快递到付", value: "快递到付" },
						{ label: "快递寄付", value: "快递寄付" },
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
				spec: "A4",
				workflow: "先印正本",
				originalCount: 1,
				copyCopies: 1,
				needScan: 1,
				scanOption: 1,
				originalPrintColor: 1,
				copyPrintColor: 1,
				coverColor: 1,
				bindingMethod: 1,
				deliveryTime: 1,
				paymentMethod: 1,
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