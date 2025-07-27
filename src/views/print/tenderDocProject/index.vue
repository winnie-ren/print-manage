<template>
	<div class="print-page">
		<el-main>
			<el-card shadow="never">
				<el-form
					ref="form"
					:model="form"
					:rules="rules"
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
							v-model="form[item.prop]"
							:min="1"
							controls-position="right"
						/>
						<el-radio-group v-else v-model="form[item.prop]">
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
							v-model="form.remarks"
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
						<!-- <el-table
						:data="[]"
						style="flex: 2; height: 100%; padding-left: 10px"
						border
					>
						<el-table-column type="index" label="#" width="50" />
						<el-table-column prop="fileName" label="文件名称" />
						<el-table-column
							prop="size"
							label="大小M"
							width="100"
						/>
						<el-table-column prop="size" label="尺寸" width="100" />
						<el-table-column prop="size" label="DPI" width="100" />
						<el-table-column prop="size" label="页数" width="100" />
						<el-table-column
							prop="status"
							label="状态"
							width="100"
						/>
						<el-table-column
							prop="operate"
							label="操作"
							width="100"
						>
							<template #default>
								<el-button link type="danger" size="small">
									删除
								</el-button>
							</template>
						</el-table-column>
					</el-table> -->
					</el-form-item>
				</el-form>
			</el-card>
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
				<el-button type="danger" size="large" @click="submit">
					加入购物车
				</el-button>
				<el-button
					type="success"
					size="large"
					@click="resetForm('form')"
					>立即购买</el-button
				>
			</el-button-group>
		</div>
	</div>
</template>

<script>
import { UploadFilled } from "@element-plus/icons-vue";
export default {
	name: "tenderDocProject",
	components: {
		UploadFilled,
	},
	data() {
		return {
			form: {
				spec: 1,
				workflow: 1,
				originalCopies: 1,
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
					options: [{ label: "A4", value: 1 }],
				},
				// 工作流程
				{
					label: "工作流程",
					prop: "workflow",
					type: "radio",
					options: [
						{ label: "先印正本", value: 1 },
						{ label: "直接打印胶装", value: 2 },
					],
				},
				// 正本份数
				{
					label: "正本份数",
					prop: "originalCopies",
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
						{ label: "是", value: 1 },
						{ label: "否", value: 2 },
					],
				},
				// 扫描文件
				{
					label: "扫描文件",
					prop: "scanOption",
					type: "radio",
					options: [
						{ label: "发送", value: 1 },
						{ label: "立即", value: 2 },
						{ label: "刻录光盘", value: 3 },
					],
				},
				// 正本印色
				{
					label: "正本印色",
					prop: "originalPrintColor",
					type: "radio",
					options: [
						{ label: "黑白", value: 1 },
						{ label: "彩色", value: 2 },
						{ label: "单面", value: 3 },
						{ label: "双面", value: 4 },
					],
				},
				// 副本印色
				{
					label: "副本印色",
					prop: "copyPrintColor",
					type: "radio",
					options: [
						{ label: "黑白", value: 1 },
						{ label: "彩色", value: 2 },
						{ label: "单面", value: 3 },
						{ label: "双面", value: 4 },
					],
				},
				// 封面颜色
				{
					label: "封面颜色",
					prop: "coverColor",
					type: "radio",
					options: [
						{ label: "白色", value: 1 },
						{ label: "大兰", value: 2 },
						{ label: "深蓝", value: 3 },
						{ label: "浅绿", value: 4 },
						{ label: "浅黄", value: 5 },
						{ label: "大红", value: 6 },
						{ label: "透明封面", value: 7 },
					],
				},
				// 装订方式
				{
					label: "装订方式",
					prop: "bindingMethod",
					type: "radio",
					options: [
						{ label: "胶装", value: 1 },
						{ label: "夹条装", value: 2 },
						{ label: "铁圈装", value: 3 },
					],
				},
				// 出货时效
				{
					label: "出货时效",
					prop: "deliveryTime",
					type: "radio",
					options: [
						{ label: "1小时", value: 1 },
						{ label: "2小时", value: 2 },
						{ label: "4小时", value: 3 },
					],
				},
				// 支付方式
				{
					label: "支付方式",
					prop: "paymentMethod",
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
	mounted() {},
	methods: {
		submit() {
			this.$refs.form.validate(async (valid) => {
				if (valid) {
					this.$message.success("全部验证通过");
				} else {
					return false;
				}
			});
		},
		resetForm(ref) {
			this.$refs[ref].resetFields();
		},
	},
};
</script>

<style scoped lang="scss"></style>
