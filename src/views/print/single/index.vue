<template>
	<div class="print-page">
		<el-main>
			<el-card shadow="never">
				<el-form
					ref="form"
					:model="form"
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
				<el-button type="danger" size="large"> 加入购物车 </el-button>
				<el-button type="success" size="large" @click="buyNow"
					>立即购买</el-button
				>
			</el-button-group>
		</div>
	</div>
</template>

<script>
import { UploadFilled } from "@element-plus/icons-vue";
export default {
	name: "single",
	components: {
		UploadFilled,
	},
	data() {
		return {
			form: {
				printColor: 1,
				printSide: 1,
				size: 1,
				material: 1,
				weight: 1,
				styleCount: 1,
				sheetCount: 1,
				deliveryMethod: 1,
				payType: 'ALIPAY'
			},
			formConfig: [
				{
					label: "印色",
					prop: "printColor",
					type: "radio",
					options: [
						{ label: "黑白", value: 1 },
						{ label: "彩色", value: 2 },
					],
				},
				{
					label: "印面",
					prop: "printSide",
					type: "radio",
					options: [
						{ label: "单面", value: 1 },
						{ label: "双面", value: 2 },
					],
				},
				{
					label: "成品尺寸",
					prop: "size",
					type: "radio",
					options: [
						{ label: "148*210", value: 1 },
						{ label: "176*250", value: 2 },
						{ label: "210*297", value: 3 },
						{ label: "297*420", value: 4 },
						{ label: "自定义", value: 0 },
					],
				},
				{
					label: "材料",
					prop: "material",
					type: "radio",
					options: [
						{ label: "铜版纸", value: 1 },
						{ label: "哑粉纸", value: 2 },
						{ label: "双胶纸", value: 3 },
					],
				},
				{
					label: "克重",
					prop: "weight",
					type: "radio",
					options: [
						{ label: "157g", value: 1 },
						{ label: "200g", value: 2 },
						{ label: "250g", value: 3 },
						{ label: "300g", value: 4 },
						{ label: "157g", value: 5 },
						{ label: "80g", value: 6 },
						{ label: "100g", value: 7 },
						{ label: "120g", value: 8 },
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
						{ label: "微信", value: "WXPAY" },
						{ label: "支付宝", value: "ALIPAY" },
						// { label: "自取", value: 1 },
						// { label: "送货上门", value: 2 },
						// { label: "快递到付", value: 3 },
						// { label: "快递寄付", value: 4 },
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
	mounted() {},
	methods: {
		async buyNow() {
			this.$API.print.singleSave.post(this.form);
		},
	},
};
</script>

<style scoped lang="scss"></style>
