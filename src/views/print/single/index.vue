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
							<el-upload
								class="upload-demo"
								ref="upload"
								:on-remove="handleRemove"
								:on-change="handleFileChange"
								:file-list="uploadFileList"
								:show-file-list="false"
								:auto-upload="false"
								multiple
							>
								<template #trigger>
									<el-button type="primary" plain>
										选择文件
									</el-button>
									<el-button
										style="margin-left: 5px"
										type="success"
										@click="handler"
										plain
									>
										上传
									</el-button>
									<el-button
										type="danger"
										@click="clearFileHandler"
										plain
									>
										清空
									</el-button>
								</template>
							</el-upload>
						</el-form-item>
					</el-form>
					<!-- 文件列表 -->
					<div
						class="file-list-wrapper"
						v-if="uploadFileList.length > 0"
					>
						<el-collapse accordion>
							<el-collapse-item
								v-for="(item, index) in uploadFileList"
								:key="index"
							>
								<template #title>
									<div class="upload-file-item">
										<div
											class="file-info-item file-name"
											:title="item.name"
										>
											{{ item.name }}
										</div>
										<div class="file-info-item file-size">
											{{ item.size || transformByte }}
										</div>
										<div
											class="file-info-item file-progress"
										>
											<el-progress
												:percentage="
													item.uploadProgress
												"
												class="file-progress-value"
											/>
										</div>
										<div class="file-info-item file-status">
											<el-tag
												v-if="
													item.status === '等待上传'
												"
												size="small"
												type="info"
												>等待上传</el-tag
											>
											<el-tag
												v-else-if="
													item.status === '校验MD5'
												"
												size="small"
												type="warning"
												>校验MD5</el-tag
											>
											<el-tag
												v-else-if="
													item.status ===
													'正在创建序列'
												"
												size="small"
												type="primary"
												>正在创建序列</el-tag
											>
											<el-tag
												v-else-if="
													item.status === '正在上传'
												"
												size="small"
												>正在上传</el-tag
											>
											<el-tag
												v-else-if="
													item.status === '上传完成'
												"
												size="small"
												type="success"
												>上传完成</el-tag
											>
											<el-tag
												v-else-if="
													item.status === '上传错误'
												"
												size="small"
												type="danger"
												>上传错误</el-tag
											>
											<el-tag
												v-else
												size="small"
												type="info"
												>{{ item.status }}</el-tag
											>
										</div>
									</div>
								</template>
								<div class="file-chunk-list-wrapper">
									<!-- 分片列表 -->
									<el-table
										:data="item.chunkList"
										max-height="400"
										style="width: 100%"
									>
										<el-table-column
											prop="chunkNumber"
											label="分片序号"
											width="120"
										>
										</el-table-column>
										<el-table-column
											prop="progress"
											label="上传进度"
											width="200"
										>
											<template #default="{ row }">
												<el-progress
													v-if="
														!row.status ||
														row.progressStatus ===
															'normal'
													"
													:percentage="row.progress"
												/>
												<el-progress
													v-else
													:percentage="row.progress"
													:status="row.progressStatus"
													:text-inside="true"
													:stroke-width="16"
												/>
											</template>
										</el-table-column>
										<el-table-column
											prop="status"
											label="状态"
											width="120"
										>
										</el-table-column>
									</el-table>
								</div>
							</el-collapse-item>
						</el-collapse>
					</div>
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
import SparkMD5 from "spark-md5";
import { fileSuffixTypeUtil } from "@/utils/FileUtil";
// 文件状态枚举
const FileStatus = {
	wait: "等待上传",
	getMd5: "校验MD5",
	chip: "正在创建序列",
	uploading: "正在上传",
	success: "上传完成",
	error: "上传错误",
};
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

		// 处理文件变化
		handleFileChange(file, fileList) {
			// 初始化文件属性
			this.initFileProperties(file);
			console.log(this.uploadFileList, fileList, file);
			this.uploadFileList = fileList;
		},

		// 初始化文件属性
		initFileProperties(file) {
			file.chunkList = [];
			file.status = FileStatus.wait;
			file.progressStatus = "warning";
			file.uploadProgress = 0;
			file.size = file.raw.size;
			file.chunkUploadedList = [];
		},
		// 开始上传所有文件
		startUploadAll() {
			this.currentFileIndex = 0;
			this.handler();
		},

		/**
		 * 开始上传文件
		 */
		handler() {
			const self = this;
			//判断文件列表是否为空
			if (this.uploadFileList.length === 0) {
				this.$message.error("请先选择文件");
				return;
			}
			if (this.currentFileIndex >= this.uploadFileList.length) {
				this.$message.success("文件上传成功");
				return;
			}
			//当前操作文件
			const currentFile = this.uploadFileList[this.currentFileIndex];
			console.log("当前操作文件：", currentFile);
			//更新上传标签
			currentFile.status = FileStatus.getMd5;
			currentFile.chunkUploadedList = [];

			// 1. 计算文件MD5
			this.getFileMd5(currentFile.raw, async (md5, totalChunks) => {
				console.log("md5值", md5);

				// 2. 检查文件是否已存在
				const checkRes = await this.$API.file.check.get({
					fileMD5: md5,
				});
				console.log("检查是否已上传-->", checkRes);

				if (checkRes.code === 0 && checkRes.data.exists) {
					// 文件已存在，直接完成
					console.log("上传成功文件访问地址：" + checkRes.data.url);
					currentFile.status = FileStatus.success;
					currentFile.uploadProgress = 100;
					// 如果此文件上传过，就跳到下一个文件
					this.currentFileIndex++;
					this.handler();
					return;
				} else if (
					checkRes.code === 0 &&
					checkRes.data.uploadedChunks
				) {
					// "上传中" 状态
					// 获取已上传分片列表
					console.log("上传中：", checkRes);
					currentFile.status = FileStatus.uploading;
					let chunkUploadedList = checkRes.data.uploadedChunks;
					console.log("chunkUploadedList", chunkUploadedList);
					currentFile.chunkUploadedList = chunkUploadedList;
					console.log("成功上传的分片信息", chunkUploadedList);
				} else {
					// 未上传
					console.log("未上传");
				}

				// 3. 正在创建分片
				currentFile.status = FileStatus.chip;

				// 创建分片
				let fileChunks = self.createFileChunk(
					currentFile.raw,
					self.chunkSize
				);
				console.log(currentFile);
				let type = fileSuffixTypeUtil(currentFile.name);
				let param = {
					fileName: currentFile.name,
					fileSize: currentFile.size,
					chunkSize: self.chunkSize,
					chunkNum: totalChunks,
					fileMd5: md5,
					contentType: "application/octet-stream",
					fileType: type,
					chunkUploadedList: currentFile.chunkUploadedList, // 已上传的分片索引+1
				};

				// 4. 初始化上传
				const initRes = await this.$API.file.init.post(param);
				if (initRes.code !== 0) {
					throw new Error(initRes.message || "初始化失败");
				}

				self.$set(currentFile, "chunkList", []);

				// 创建分片列表
				fileChunks.forEach((chunkItem, index) => {
					if (currentFile.chunkUploadedList.includes(index + 1)) {
						currentFile.chunkList.push({
							chunkNumber: index + 1,
							chunk: chunkItem,
							progress: 100,
							progressStatus: "success",
							status: "上传成功",
						});
					} else {
						currentFile.chunkList.push({
							chunkNumber: index + 1,
							chunk: chunkItem,
							progress: 0,
							status: "—",
						});
					}
				});
				console.log("所有分片信息：", currentFile.chunkList);

				let tempFileChunks = [...currentFile.chunkList];

				// 更新状态
				currentFile.status = FileStatus.uploading;

				// 处理分片列表，删除已上传的分片
				tempFileChunks = self.processUploadChunkList(tempFileChunks);
				console.log("删除已上传的分片-->", tempFileChunks);

				// 5. 并发上传分片
				await self.uploadChunkConcurrent(tempFileChunks);

				console.log("---上传完成---");

				// 6. 合并文件
				console.log("合并文件-->", currentFile);
				const mergeRes = await this.$API.file.merge.post({
					fileMd5: md5,
					fileName: currentFile.name,
					totalChunks: fileChunks.length,
				});

				// 合并文件状态
				if (mergeRes.code === 0) {
					currentFile.status = FileStatus.success;
					console.log("文件访问地址：" + mergeRes.data.url);

					// 将文件信息保存到表单
					if (!this.formDetail.files) {
						this.formDetail.files = [];
					}
					this.formDetail.files.push({
						name: currentFile.name,
						url: mergeRes.data.url,
						md5: md5,
					});

					// 文件下标偏移
					this.currentFileIndex++;
					// 递归上传下一个文件
					this.handler();
				} else {
					currentFile.status = FileStatus.error;
					self.$message.error(mergeRes.message || "合并失败");
				}
			});
		},

		/**
		 * 分片读取文件 获取文件的MD5
		 * @param file
		 * @param callback
		 */
		getFileMd5(file, callback) {
			const blobSlice =
				File.prototype.slice ||
				File.prototype.mozSlice ||
				File.prototype.webkitSlice;
			const fileReader = new FileReader();
			// 计算分片数
			const totalChunks = Math.ceil(file.size / this.chunkSize);
			console.log("总分片数：" + totalChunks);
			let currentChunk = 0;
			const spark = new SparkMD5.ArrayBuffer();
			const self = this; // 保存this引用

			loadNext();
			fileReader.onload = function (e) {
				try {
					spark.append(e.target.result);
				} catch (error) {
					console.log("获取Md5错误：" + currentChunk);
				}
				if (currentChunk < totalChunks) {
					currentChunk++;
					loadNext();
				} else {
					callback(spark.end(), totalChunks);
				}
			};
			fileReader.onerror = function () {
				console.warn("读取Md5失败，文件读取错误");
			};

			function loadNext() {
				const start = currentChunk * self.chunkSize; // 使用self而不是this
				const end =
					start + self.chunkSize >= file.size
						? file.size
						: start + self.chunkSize;
				fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
			}
		},

		/**
		 * 文件分片
		 */
		createFileChunk(file, size = this.chunkSize) {
			const fileChunkList = [];
			let count = 0;
			while (count < file.size) {
				fileChunkList.push({
					file: file.slice(count, count + size),
				});
				count += size;
			}
			return fileChunkList;
		},

		/**
		 * 处理即将上传的分片列表，判断是否有已上传的分片，有则从列表中删除
		 */
		processUploadChunkList(chunkList) {
			const currentFile = this.uploadFileList[this.currentFileIndex];
			let chunkUploadedList = currentFile.chunkUploadedList;
			if (
				chunkUploadedList === undefined ||
				chunkUploadedList === null ||
				chunkUploadedList.length === 0
			) {
				return chunkList;
			}

			for (let i = chunkList.length - 1; i >= 0; i--) {
				const chunkItem = chunkList[i];
				for (let j = 0; j < chunkUploadedList.length; j++) {
					if (chunkItem.chunkNumber === chunkUploadedList[j]) {
						chunkList.splice(i, 1);
						break;
					}
				}
			}
			return chunkList;
		},

		/**
		 * 并发上传分片
		 * @param chunkList
		 * @returns {Promise<unknown>}
		 */
		uploadChunkConcurrent(chunkList) {
			let successCount = 0;
			let totalChunks = chunkList.length;
			return new Promise((resolve) => {
				const handler = () => {
					if (chunkList.length) {
						const chunkItem = chunkList.shift();
						// 上传分片
						this.uploadSingleChunk(chunkItem)
							.then(() => {
								console.log(
									"分片：" +
										chunkItem.chunkNumber +
										" 上传成功"
								);
								successCount++;
								// 继续上传下一个分片
								handler();
							})
							.catch((error) => {
								// 更新状态
								console.log(
									"分片：" +
										chunkItem.chunkNumber +
										" 上传失败，" +
										error
								);
								// 重新添加到队列中
								chunkList.push(chunkItem);
								handler();
							});
					}
					if (successCount >= totalChunks) {
						resolve();
					}
				};
				// 并发上传
				for (let i = 0; i < this.simultaneousUploads; i++) {
					handler();
				}
			});
		},

		// 上传单个分片
		async uploadSingleChunk(chunkItem) {
			const formData = new FormData();
			formData.append("chunk", chunkItem.chunk.file);
			formData.append("chunkIndex", chunkItem.chunkNumber - 1);
			formData.append(
				"totalChunks",
				this.uploadFileList[this.currentFileIndex].chunkList.length
			);
			formData.append(
				"fileMd5",
				this.uploadFileList[this.currentFileIndex].fileMd5
			);
			formData.append(
				"fileName",
				this.uploadFileList[this.currentFileIndex].name
			);

			const res = await this.$API.file.uploadScreenshot.post(formData);

			if (res.code === 0) {
				chunkItem.progress = 100;
				chunkItem.status = "上传成功";
				chunkItem.progressStatus = "success";
				// 更新分片列表
				const chunkIndex = chunkItem.chunkNumber - 1;
				this.$set(
					this.uploadFileList[this.currentFileIndex].chunkList,
					chunkIndex,
					chunkItem
				);
				// 更新文件上传进度
				this.getCurrentFileProgress();
				return Promise.resolve();
			} else {
				return Promise.reject(new Error(res.message || "分片上传失败"));
			}
		},

		// 检查分片上传进度
		checkChunkUploadProgress(item) {
			return (p) => {
				item.progress = parseInt(String((p.loaded / p.total) * 100));
				this.updateChunkUploadStatus(item);
			};
		},

		updateChunkUploadStatus(item) {
			let status = FileStatus.uploading;
			let progressStatus = "normal";
			if (item.progress >= 100) {
				status = FileStatus.success;
				progressStatus = "success";
			}
			let chunkIndex = item.chunkNumber - 1;
			let currentChunk =
				this.uploadFileList[this.currentFileIndex].chunkList[
					chunkIndex
				];
			// 修改状态
			currentChunk.status = status;
			currentChunk.progressStatus = progressStatus;
			// 更新状态
			this.$set(
				this.uploadFileList[this.currentFileIndex].chunkList,
				chunkIndex,
				currentChunk
			);
			// 获取文件上传进度
			this.getCurrentFileProgress();
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
	filters: {
		transformByte(size) {
			if (!size) {
				return "0B";
			}
			const unitSize = 1024;
			if (size < unitSize) {
				return size + " B";
			}
			// KB
			if (size < Math.pow(unitSize, 2)) {
				return (size / unitSize).toFixed(2) + " K";
			}
			// MB
			if (size < Math.pow(unitSize, 3)) {
				return (size / Math.pow(unitSize, 2)).toFixed(2) + " MB";
			}
			// GB
			if (size < Math.pow(unitSize, 4)) {
				return (size / Math.pow(unitSize, 3)).toFixed(2) + " GB";
			}
			// TB
			return (size / Math.pow(unitSize, 4)).toFixed(2) + " TB";
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

.file-list-wrapper {
	margin-top: 20px;
}

.upload-file-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 0;
}

.file-info-item {
	margin: 0 10px;
}

.file-name {
	width: 250px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.file-size {
	width: 100px;
}

.file-progress {
	width: 150px;
}

.file-status {
	width: 100px;
}
</style>
