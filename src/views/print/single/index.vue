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
										[
											'size',
											'weight',
											'styleCount',
											'sheetCount',
										].includes(item.prop) &&
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
							<MultipartFile />
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
import MultipartFile from "@/components/multipartFile/index";
// 从表单配置中提取选项数据
const formConfigOptions = [
	{
		label: "印色",
		prop: "printColor",
		type: "radio",
		options: [
			{ label: "黑白", value: "blackWhite" },
			{ label: "彩色", value: "color" },
		],
	},
	{
		label: "印面",
		prop: "printSide",
		type: "radio",
		options: [
			{ label: "单面", value: "single" },
			{ label: "双面", value: "double" },
		],
	},
	{
		label: "材料",
		prop: "material",
		type: "radio",
		options: [
			{ label: "铜版纸", value: "coatedPaper" },
			{ label: "哑粉纸", value: "mattePaper" },
			{ label: "双胶纸", value: "twoSidePaper" },
		],
	},
];

// 搜索配置
const searchConfig = [
	{
		label: "打印单号",
		name: "printNo",
		component: "input",
		options: { placeholder: "请输入打印单号" },
	},
	{
		label: "张数",
		name: "sheetCount",
		component: "number",
		options: { placeholder: "请输入张数" },
	},
	{
		label: "印面",
		name: "printSide",
		component: "select",
		options: {
			placeholder: "请选择印面",
			items: [
				{ value: "single", label: "单面" },
				{ value: "double", label: "双面" },
			],
		},
	},
	{
		label: "成品尺寸",
		name: "size",
		component: "input",
		options: { placeholder: "请输入成品尺寸" },
	},
	{
		label: "材料",
		name: "material",
		component: "select",
		options: {
			placeholder: "请选择材料",
			items: [
				{ label: "铜版纸", value: "coatedPaper" },
				{ label: "哑粉纸", value: "mattePaper" },
				{ label: "双胶纸", value: "twoSidePaper" },
			],
		},
	},
	{
		label: "克重",
		name: "weight",
		component: "input",
		options: { placeholder: "请输入克重" },
	},
	{
		label: "款数",
		name: "styleCount",
		component: "number",
		options: { placeholder: "请输入款数" },
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
		label: "张数",
		name: "sheetCount",
		component: "number", // 保留输入框因为有自定义值
		table: true,
		span: 6,
	},
	{
		label: "印面",
		name: "printSide",
		component: "select",
		options:
			formConfigOptions.find((item) => item.prop === "printSide")
				?.options || [],
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
		options:
			formConfigOptions.find((item) => item.prop === "material")
				?.options || [],
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
];

export default {
	name: "single",
	components: {
		UploadFilled,
		MultipartFile,
	},
	data() {
		return {
			uploadFileList: [], // 文件列表
			chunkSize: 2 * 1024 * 1024, // 2MB 分片大小
			// 上传并发数
			simultaneousUploads: 3,
			currentFileIndex: 0,

			list: {
				apiObj: this.$API.print.singlePage,
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
				sheetCount: "",
				printSide: "",
				size: "",
				material: "",
				weight: "",
				styleCount: "",
			},
			formDetail: {
				printColor: "blackWhite",
				printSide: "single",
				size: "A5",
				material: "coatedPaper",
				weight: 157,
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
						{ label: "黑白", value: "blackWhite" },
						{ label: "彩色", value: "color" },
					],
				},
				{
					label: "印面",
					prop: "printSide",
					type: "radio",
					options: [
						{ label: "单面", value: "single" },
						{ label: "双面", value: "double" },
					],
				},
				{
					label: "成品尺寸",
					prop: "size",
					type: "radio",
					options: [
						{ label: "A5 (148*210)", value: "A5" },
						{ label: "B5 (176*250)", value: "B5" },
						{ label: "A3 (297*420)", value: "A3" },
						{ label: "自定义", value: 0 },
					],
				},
				{
					label: "材料",
					prop: "material",
					type: "radio",
					options: [
						{ label: "铜版纸", value: "coatedPaper" },
						{ label: "哑粉纸", value: "mattePaper" },
						{ label: "双胶纸", value: "twoSidePaper" },
					],
				},
				{
					label: "克重",
					prop: "weight",
					type: "radio",
					options: [
						{ label: "157g", value: 157 },
						{ label: "200g", value: 200 },
						{ label: "250g", value: 250 },
						{ label: "300g", value: 300 },
						{ label: "80g", value: 80 },
						{ label: "100g", value: 100 },
						{ label: "120g", value: 120 },
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
		getCurrentFileProgress() {
			const currentFile = this.uploadFileList[this.currentFileIndex];
			if (!currentFile || !currentFile.chunkList) {
				return;
			}
			const chunkList = currentFile.chunkList;
			const uploadedSize = chunkList
				.filter((item) => item.progress >= 100) // 只统计已完成的分片
				.reduce((acc, cur) => acc + cur.chunk.file.size, 0);
			// 计算方式：已上传大小 / 文件总大小
			let progress = parseInt((uploadedSize / currentFile.size) * 100);
			currentFile.uploadProgress = progress;
			this.$set(this.uploadFileList, this.currentFileIndex, currentFile);
		},
		// 重置表单时清空文件列表
		resetForm() {
			this.formDetail = {
				printColor: "blackWhite",
				printSide: "single",
				size: "A5",
				material: "coatedPaper",
				weight: 157,
				styleCount: 1,
				sheetCount: 1,
				deliveryMethod: "自取",
				payType: "ALIPAY",
				remarks: "",
				files: [], // 添加文件数组
			};
			this.uploadFileList = []; // 清空文件列表
			this.currentFileIndex = 0; // 重置文件索引
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
