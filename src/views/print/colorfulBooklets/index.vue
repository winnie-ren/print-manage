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
						<el-radio-group v-model="form[item.prop]">
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
	name: "colorfulBooklets",
	components: {
		UploadFilled,
	},
	data() {
		return {
			form: {
				productSize: 1,
				pageCount: 1,
				copies: 1,
				paper: 1,
				coverColor: 1,
				innerColor: 1,
				coverMaterial: 1,
				coverProcess: 1,
				bindingMethod: 1,
				deliveryMethod: 1,
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
					prop: "productSize",
					type: "radio",
					options: [
						{ label: "A4", value: 1 },
						{ label: "B5", value: 2 },
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
					prop: "copies",
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
					prop: "paper",
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
