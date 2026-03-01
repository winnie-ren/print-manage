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
								<el-popconfirm
									title="确定删除吗？"
									@confirm="table_del(scope.row)"
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
							<el-input-number
								v-if="item.type === 'input-number'"
								v-model="formDetail[item.prop]"
								:min="1"
								controls-position="right"
							/>
							<el-radio-group
								v-else
								v-model="formDetail[item.prop]"
							>
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
								:limit="1"
								action="/api/files/upload"
								:on-exceed="handleExceed"
								:on-success="uploadSuccess"
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
					<!-- <el-button
						type="primary"
						size="large"
						plain
						style="margin-right: 10px"
						>计算价格</el-button
					> -->
					<el-button-group>
						<!-- <el-button type="danger" size="large">
							加入购物车
						</el-button> -->
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
import { formConfigOptions } from "@/views/price/config/index.ts";
// 搜索配置
const searchConfig = [
	{
		label: "打印单号",
		name: "printNo",
		component: "input",
		options: { placeholder: "请输入打印单号" },
	},
	{
		label: "规格",
		name: "spec",
		component: "select",
		options: {
			placeholder: "请选择规格",
			items: formConfigOptions["spec"],
		},
	},
	{
		label: "正本份数",
		name: "originalCount",
		component: "number",
		options: { placeholder: "请输入正本份数" },
	},
	{
		label: "副本份数",
		name: "copyCopies",
		component: "number",
		options: { placeholder: "请输入副本份数" },
	},
	{
		label: "是否扫描",
		name: "isScan",
		component: "select",
		options: {
			placeholder: "请选择是否扫描",
			items: formConfigOptions["isScan"],
		},
	},
	{
		label: "正本印色",
		name: "originalColor",
		component: "select",
		options: {
			placeholder: "请选择正本印色",
			items: formConfigOptions["originalColor"],
		},
	},
	{
		label: "副本印色",
		name: "copyColor",
		component: "select",
		options: {
			placeholder: "请选择副本印色",
			items: formConfigOptions["copyColor"],
		},
	},
	{
		label: "交付方式",
		name: "deliveryMethod",
		component: "select",
		options: {
			placeholder: "请选择支付方式",
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
		label: "订单金额(分)",
		name: "totalFee",
		component: "input", // 保留输入框因为有自定义值
		table: true,
		span: 6,
	},
	{
		label: "状态",
		name: "status",
		component: "input", // 保留输入框因为有自定义值
		table: true,
		span: 6,
		format: "INIT:已创建/PAYING:已下单等待支付/SUCCESS:支付成功/FAIL:支付失败/CLOSED:已关闭或超时",
	},
	{
		label: "规格",
		name: "spec",
		component: "select",
		options: formConfigOptions["spec"],
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
		name: "isScan",
		component: "select",
		options: formConfigOptions["isScan"],
		table: true,
		span: 6,
		format: "yes:是/no:否",
	},
	{
		label: "正本印色",
		name: "originalColor",
		component: "select",
		options: formConfigOptions["originalColor"],
		table: true,
		span: 6,
		format: "black:黑白/color:彩色/single:单面/double:双面",
	},
	{
		label: "副本印色",
		name: "copyColor",
		component: "select",
		options: formConfigOptions["copyColor"],
		table: true,
		span: 6,
		format: "black:黑白/color:彩色/single:单面/double:双面",
	},
	{
		label: "交付方式",
		name: "deliveryMethod",
		component: "select",
		options: formConfigOptions["deliveryMethod"],
		table: true,
		span: 6,
		format: "self:自取/delivery:送货上门/cashOnDelivery:快递到付/express:快递寄付/pickupStore:到店取货",
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
				apiObj: this.$API.print.biddingPage,
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
				originalCount: "",
				copyCopies: "",
				isScan: "",
				originalColor: "",
				copyColor: "",
				deliveryMethod: "",
			},
			formDetail: {
				spec: "A4",
				workflow: "先印正本",
				originalCount: 1,
				copyCopies: 1,
				isScan: "yes", // 改为选项值
				scanFile: "send", // 改为选项值
				originalColor: "black", // 改为选项值
				copyColor: "black", // 改为选项值
				coverColor: "white", // 改为选项值
				bindingMethod: "glue", // 改为选项值
				deliveryTime: "1", // 改为选项值
				deliveryMethod: "self", // 改为选项值
				remarks: "",
				fileId: "",
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
					options: formConfigOptions["spec"],
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
					prop: "isScan",
					type: "radio",
					options: formConfigOptions["isScan"],
				},
				// 扫描文件
				{
					label: "扫描文件",
					prop: "scanFile",
					type: "radio",
					options: formConfigOptions["scanFile"],
				},
				// 正本印色
				{
					label: "正本印色",
					prop: "originalColor",
					type: "radio",
					options: formConfigOptions["originalColor"],
				},
				// 副本印色
				{
					label: "副本印色",
					prop: "copyColor",
					type: "radio",
					options: formConfigOptions["copyColor"],
				},
				// 封面颜色
				{
					label: "封面颜色",
					prop: "coverColor",
					type: "radio",
					options: [
						{ label: "白色", value: "white" },
						{ label: "天兰", value: "skyBlue" },
						{ label: "深蓝", value: "deepBlue" },
						{ label: "浅绿", value: "lightGreen" },
						{ label: "浅黄", value: "lightYellow" },
						{ label: "大红", value: "red" },
						{ label: "透明封面", value: "transparent" },
					],
				},
				// 装订方式
				{
					label: "装订方式",
					prop: "bindingMethod",
					type: "radio",
					options: [
						{ label: "胶装", value: "glue" },
						{ label: "夹条装", value: "ribbon" },
						{ label: "铁圈装", value: "iron" },
					],
				},
				// 出货时效
				{
					label: "出货时效",
					prop: "deliveryTime",
					type: "radio",
					options: formConfigOptions["deliveryTime"],
				},
				// 交付方式
				{
					label: "交付方式",
					prop: "deliveryMethod",
					type: "radio",
					options: formConfigOptions["deliveryMethod"],
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
		// 查看
		async table_show(row) {
			this.dialogTitle = "查看";
			this.dialogVisible = true;
			var res = await this.$API.print.biddingGetById.get({ id: row.id });
			if (res.code == 0) {
				this.formDetail = res.data;
			} else {
				this.$nextTick(() => {
					this.formDetail = { ...row };
				});
			}
		},
		// 删除
		async table_del(row) {
			var res = await this.$API.print.biddingDelete.delete([row.id]);
			if (res.code == 0) {
				this.$message.success("删除成功");
				this.$refs.table.getData(); // 刷新表格
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
					const res = await this.$API.print.biddingDelete.delete(ids);
					if (res.code === 0) {
						this.$message.success("删除成功");
						this.$refs.table.getData(); // 刷新表格
					}
					loading.close();
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
				spec: "A4",
				workflow: "先印正本",
				originalCount: 1,
				copyCopies: 1,
				isScan: "yes", // 改为选项值
				scanFile: "send", // 改为选项值
				originalColor: "black", // 改为选项值
				copyColor: "black", // 改为选项值
				coverColor: "white", // 改为选项值
				bindingMethod: "glue", // 改为选项值
				deliveryTime: "1", // 改为选项值
				deliveryMethod: "self", // 改为选项值
				remarks: "",
				fileId: "",
			};
		},
		uploadSuccess(response) {
			console.log("上传成功:", response);
			if (response?.code === 0) {
				this.formDetail.fileId = response.data.fileCode;
			}
		},
		handleExceed() {
			this.$message.warning(`只允许上传一个文件`);
		},
		async buyNow() {
			const res = await this.$API.print.biddingSave.post(this.formDetail);
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
