<template>
	<common-list-page
		ref="commonListPage"
		:api-obj="$API.menu.userPage"
		:search-config="searchConfig"
		:table-columns="tableColumns"
		:form-config="{}"
		:edit-disabled-fields="['gco']"
		:delete-api="deleteMenu"
		:dialogWidth="'80%'"
		:save-api="saveMenu"
		:useScForm="false"
		@add="handleAdd"
		@edit="handleEdit"
		@view="handleView"
		@submit="handleSubmit"
	>
		<div>
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="单张" name="first">
					<div class="config-container">
						<el-form
							:model="singleForm"
							label-width="100px"
							style="margin: 10px 0"
						>
							<el-form-item
								v-for="item in singleFormConfig"
								:key="item.prop"
								:label="item.label"
							>
								<el-row :gutter="20">
									<el-col
										v-for="sItem in item.children"
										:key="sItem.prop"
										:span="6"
									>
										<el-form-item :label="sItem.label">
											<el-input-number
												v-model.number="
													singleForm[
														`${item.prop}_${sItem.prop}`
													]
												"
												:min="0"
												step="0.01"
												precision="2"
												controls-position="right"
												placeholder="请输入"
												style="width: 100%"
											/>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>
						</el-form>
						<div class="form-columns">
							<el-form
								v-for="group in materialData"
								:key="`${group.material}_${group.weight}_${group.color}`"
								:model="group"
								label-width="45px"
							>
								<el-form-item label="材料">
									<span>{{
										materialConfig[group.material]
									}}</span>
								</el-form-item>

								<el-form-item label="克重">
									<span>{{
										weightConfig[group.weight]
									}}</span>
								</el-form-item>

								<el-form-item label="黑白">
									<el-input-number
										v-model.number="
											singleForm[
												`${group.material}_${group.weight}_black`
											]
										"
										:min="0"
										step="0.01"
										precision="2"
										controls-position="right"
										placeholder="请输入"
										style="width: 100%"
									/>
								</el-form-item>

								<el-form-item label="彩色">
									<el-input-number
										v-model.number="
											singleForm[
												`${group.material}_${group.weight}_color`
											]
										"
										:min="0"
										step="0.01"
										precision="2"
										controls-position="right"
										placeholder="请输入"
										style="width: 100%"
									/>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="黑白书册" name="second">
					<div class="config-container">
						<el-form
							:model="blackForm"
							label-width="100px"
							style="margin: 10px 0"
						>
							<el-form-item
								v-for="item in blackBookFormConfig"
								:key="item.prop"
								:label="item.label"
							>
								<el-row :gutter="20">
									<el-col
										v-for="sItem in item.children"
										:key="sItem.prop"
										:span="6"
									>
										<el-form-item
											:label="sItem.label"
											style="margin-bottom: 0"
										>
											<el-input-number
												v-model.number="
													blackForm[
														`${item.prop}_${sItem.prop}`
													]
												"
												:min="0"
												step="0.01"
												precision="2"
												controls-position="right"
												placeholder="请输入"
												style="width: 100%"
											/>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>
						</el-form>
					</div>
				</el-tab-pane>
				<el-tab-pane label="彩色书册" name="third">
					<div class="config-container">
						<el-form
							:model="colorForm"
							label-width="100px"
							style="margin: 10px 0"
						>
							<el-form-item
								v-for="item in blackBookFormConfig"
								:key="item.prop"
								:label="item.label"
							>
								<el-row :gutter="20">
									<el-col
										v-for="sItem in item.children"
										:key="sItem.prop"
										:span="6"
									>
										<el-form-item
											:label="sItem.label"
											style="margin-bottom: 0"
										>
											<el-input-number
												v-model.number="
													colorForm[
														`${item.prop}_${sItem.prop}`
													]
												"
												:min="0"
												step="0.01"
												precision="2"
												controls-position="right"
												placeholder="请输入"
												style="width: 100%"
											/>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>
						</el-form>
					</div>
				</el-tab-pane>
				<el-tab-pane label="标书专项" name="fourth">
					<div class="config-container">
						<el-form
							:model="specialForm"
							label-width="100px"
							style="margin: 10px 0"
						>
							<el-form-item
								v-for="item in specialFormConfig"
								:key="item.prop"
								:label="item.label"
							>
								<el-row :gutter="20">
									<el-col
										v-for="sItem in item.children"
										:key="sItem.prop"
										:span="6"
									>
										<el-form-item
											:label="sItem.label"
											style="margin-bottom: 0"
										>
											<el-input-number
												v-model.number="
													specialForm[
														`${item.prop}_${sItem.prop}`
													]
												"
												:min="0"
												step="0.01"
												precision="2"
												controls-position="right"
												placeholder="请输入"
												style="width: 100%"
											/>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>
						</el-form>
					</div>
				</el-tab-pane>
			</el-tabs>
			<div class="footer-btn">
				<el-button type="primary" @click="handleSubmit()"
					>提交</el-button
				>
			</div>
		</div>
	</common-list-page>
</template>

<script>
import CommonListPage from "@/components/commonTable/index.vue";
import {
	materialData,
	singleFormConfig,
	blackBookFormConfig,
	specialFormConfig,
	materialConfig,
	weightConfig,
} from "./config/index.ts";
import { getCurrentInstance, ref } from "vue";

export default {
	name: "priceSetting",
	components: {
		CommonListPage,
	},
	setup() {
		const instance = getCurrentInstance();
		const $API = instance.proxy.$API;
		const activeName = ref("first");
		// 搜索配置
		const searchConfig = [
			{
				label: "项",
				name: "gco",
				component: "input",
				options: { placeholder: "请输入项" },
			},
			{
				label: "值",
				name: "gna",
				component: "input",
				options: { placeholder: "请输入值" },
			},
			{
				label: "状态",
				name: "status",
				component: "select",
				options: {
					placeholder: "请选择状态",
					items: [
						{ value: "1", label: "有效" },
						{ value: "0", label: "无效" },
					],
				},
			},
		];
		// 表格列配置
		const tableColumns = [
			{
				label: "项",
				name: "gco",
			},
			{
				label: "值",
				name: "gna",
			},
			{
				label: "价格",
				name: "pgco",
			},
			{
				label: "状态",
				name: "status",
				format: "0:无效/1:有效",
			},
		];
		// API 方法
		const deleteMenu = async (ids) => {
			return await $API.menu.userDelete.delete(ids);
		};
		const saveMenu = async (data) => {
			return await $API.menu.userSave.post(data);
		};
		// 事件处理
		const handleAdd = () => {
			console.log("新增菜单");
		};
		const handleEdit = (row) => {
			console.log("编辑菜单", row);
		};
		const handleView = (row) => {
			console.log("查看菜单", row);
		};
		// 单张表单数据
		const singleForm = ref({
			printColor_blackWhite: 1,
			printColor_color: 1,
			printSide_single: 1,
			printSide_double: 1.5,
			size_A5: 0.5,
			size_B5: 0.8,
			size_A4: 1,
			size_A3: 2,
			coatedPaper_157_black: 0.25,
			coatedPaper_157_color: 0.3,
			coatedPaper_200_black: 0.35,
			coatedPaper_200_color: 0.5,
			coatedPaper_250_black: 0.4,
			coatedPaper_250_color: 0.7,
			coatedPaper_300_black: 0.5,
			coatedPaper_300_color: 1,
			mattePaper_157_black: 0.25,
			mattePaper_157_color: 0.3,
			mattePaper_200_black: 0.35,
			mattePaper_200_color: 0.5,
			mattePaper_250_black: 0.4,
			mattePaper_250_color: 0.7,
			mattePaper_300_black: 0.5,
			mattePaper_300_color: 1,
			twoSidePaper_80_black: 0.1,
			twoSidePaper_80_color: 0.3,
			twoSidePaper_100_black: 0.2,
			twoSidePaper_100_color: 0.35,
			twoSidePaper_120_black: 0.25,
			twoSidePaper_120_color: 0.4,
			twoSidePaper_160_black: 0.3,
			twoSidePaper_160_color: 0.5,
			twoSidePaper_200_black: 0.35,
			twoSidePaper_200_color: 0.6,
			twoSidePaper_250_black: 0.4,
			twoSidePaper_250_color: 0.7,
			twoSidePaper_300_black: 0.5,
			twoSidePaper_300_color: 0.8,
		});
		// 黑白书册表单数据
		const blackForm = ref({
			sizes_A4: 1,
			sizes_B5: 0.85,
			papers_80: 0.1,
			papers_100: 0.2,
			papers_128: 0.5,
			papers_157: 0.6,
			coverColor_black: 2,
			coverColor_color: 3,
			innerColor_black: 1,
			innerColor_color: 2,
			coverMaterial_coatedPaper: 1,
			coverMaterial_specialPaper: 2,
			coverMaterial_stripedPaper: 1,
			coverProcess_no: 0,
			coverProcess_singleDummy: 1,
			coverProcess_singleLight: 1,
			binding_mount: 2,
			binding_glue: 3,
			delivery_self: 0,
			delivery_delivery: 10,
			delivery_express: 0,
		});
		// 彩色书册表单数据
		const colorForm = ref({
			sizes_A4: 1,
			sizes_B5: 0.85,
			papers_80: 0.1,
			papers_100: 0.2,
			papers_128: 0.5,
			papers_157: 0.6,
			coverColor_black: 2,
			coverColor_color: 3,
			innerColor_black: 1,
			innerColor_color: 2,
			coverMaterial_coatedPaper: 1,
			coverMaterial_specialPaper: 2,
			coverMaterial_stripedPaper: 1,
			coverProcess_no: 0,
			coverProcess_singleDummy: 1,
			coverProcess_singleLight: 1,
			binding_mount: 2,
			binding_glue: 3,
			delivery_self: 0,
			delivery_delivery: 10,
			delivery_express: 0,
		});
		//	标书专项表单数据
		const specialForm = ref({
			scan_yes: 1,
			scan_no: 0,
			scanFile_send: 0,
			scanFile_uDisk: 25,
			scanFile_cd: 7,
			originalColor_black: 0.1,
			originalColor_color: 0.3,
			originalSide_single: 1,
			originalSide_double: 0.9,
			copyColor_black: 0.1,
			copyColor_color: 0.3,
			copySide_single: 1,
			copySide_double: 0.9,
			coverColor_white: 6,
			coverColor_skyBlue: 6,
			coverColor_deepBlue: 6,
			coverColor_lightGreen: 6,
			coverColor_lightYellow: 6,
			coverColor_red: 6,
			coverColor_transparent: 8,
			binding_glue: 2,
			binding_ribbon: 4,
			binding_iron: 4,
			deliveryTime_1: 1,
			deliveryTime_2: 2,
			deliveryTime_4: 4,
			delivery_self: 0,
			delivery_delivery: 10,
			delivery_cashOnDelivery: 0,
			delivery_express: 0,
		});
		function handleClick(tab, event) {
			console.log(tab, event);
		}
		const handleSubmit = () => {
			const params = {
				single: singleForm.value,
				blackWhite: blackForm.value,
				color: colorForm.value,
				special: specialForm.value,
			};
			console.log("保存配置:", params);
			// 这里可以调用 API 保存
			saveMenu(params);
		};
		return {
			searchConfig,
			tableColumns,
			activeName,
			materialData,
			singleForm,
			singleFormConfig,
			blackBookFormConfig,
			blackForm,
			colorForm,
			specialFormConfig,
			specialForm,
			materialConfig,
			weightConfig,
			handleClick,
			deleteMenu,
			saveMenu,
			handleAdd,
			handleEdit,
			handleView,
			handleSubmit,
		};
	},
};
</script>

<style scoped lang="scss">
.form-columns {
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
	padding: 5px 0;
	.el-form {
		border: 1px solid #e4e7ed;
		padding: 3px;
		border-radius: 4px;
		min-width: 160px;
		display: inline-block;
		width: 150px;
		vertical-align: top;
		.el-form-item--default {
			margin-bottom: 5px;
		}
	}
}
.config-container {
	border-radius: 4px;
	.el-row {
		width: 100%;
	}
}
</style>
