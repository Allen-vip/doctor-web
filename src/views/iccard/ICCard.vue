<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getICCards">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="iccards" highlight-current-row
                  v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="40" align="center">
            </el-table-column>
            <el-table-column type="index" width="40" align="center">
            </el-table-column>
            <el-table-column property="serial" label="卡号" width="120" sortable align="center">
            </el-table-column>
            <el-table-column property="userName" label="姓名" width="120" sortable align="center">
            </el-table-column>
            <el-table-column property="homeName" label="住家" width="300" sortable align="center">
            </el-table-column>
            <el-table-column property="validDevice" label="登记设备" width="300" sortable align="center">
            </el-table-column>
            <el-table-column label="操作" :span="3">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="卡号" prop="serial">
                    <el-input v-model="editForm.serial" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户" prop="userId">
                    <el-select v-model="editForm.userId" filterable placeholder="请选择">
                        <el-option
                                v-for="item in this.userList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.identityCardNum }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="登记设备">
                    <el-transfer v-model="selDevices"
                        :props="{
                          key: 'id',
                          label: 'fullName'
                        }"
                        :data="this.devices"
                        :titles="['待选', '已选']"
                        :button-texts="['移除', '选择']">
                    </el-transfer>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="卡号" prop="serial">
                    <el-input v-model="addForm.serial" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户" prop="userId">
                    <el-select v-model="addForm.userId" filterable placeholder="请选择">
                        <el-option
                                v-for="item in this.userList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.identityCardNum }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="登记设备">
                    <el-transfer v-model="addForm.selDevices"
                                 :props="{ key: 'id', label: 'fullName' }"
                                 :data="this.devices"
                                 :titles="['待选', '已选']"
                                 :button-texts="['移除', '选择']">
                    </el-transfer>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    import { apiGetICCardPage, apiRemoveICCard, apiBatchRemoveICCard, apiUpdateICCard, apiAddICCard } from '../../api/api';
    import { getDeviceList, apiGetUserList } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                iccards: [],
                devices: [],
                userList: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    userName: [
                        { required: true, message: '请选择用户', trigger: 'blur' }
                    ],
                    serial: [
                        { required: true, message: '请输入ID', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    serial: '',
                    userId: '',
                    testDevices: [],
                    selDevices: [],
                },
                selDevices: [],
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    userName: [
                        { required: true, message: '请选择用户', trigger: 'blur' }
                    ],
                    serial: [
                        { required: true, message: '请输入卡号', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    id: 0,
                    serial: '',
                    userId: '',
                    testDevices: [],
                    selDevices: [],
                }

            }
        },
        methods: {

            handleCurrentChange: function(val) {
                this.page = val;
                this.getICCards();
            },
            //获取用户列表
            getUserList: function() {
                apiGetUserList().then((res) => {
                    this.userList = res.data.myModel
                })
            },
            getICCards: function() {
                let para = {
                    page: this.page,
                    count: 10,
                    filter: this.filters.name
                };
                this.listLoading = true;
                apiGetICCardPage(para).then((res) => {
                    this.total = res.data.myModel.total;
                    this.iccards = res.data.myModel.data;
                    this.listLoading = false;

                    this.iccards.forEach( card => {
                        card.homeName = card.buildingNum + '栋'
                        if(card.unitNum !== '') {
                            card.homeName = card.homeName + card.unitNum + '单元'
                        }
                        card.homeName = card.homeName + card.roomNum + '室'
                        card.validDevice = ''
                        card.deviceIds.split(',').forEach( id => {
                            if(card.validDevice.length != 0) {
                                card.validDevice += '｜'
                            }
                            card.validDevice += this.getDeviceName(id)
                        })
                    })
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { id: row.id };
                    apiRemoveICCard(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getICCards();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {

                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
                console.log("row.deviceIds:" + row.deviceIds)
                if( row.deviceIds.length > 0) {
                    this.selDevices = row.deviceIds.split(",").map(item => {
                        return +item
                    })
                } else {
                    this.selDevices = []
                }
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    id: 0,
                    serial: '',
                    userId: '',
                    testDevices: [],
                    selDevices: [],
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm)
                            para.estateId = 1
                            if (this.selDevices.length > 0) {
                                console.log("len:"+ this.selDevices.length + " " + this.selDevices)
                                para.deviceIds = this.selDevices.join(",")
                                console.log("para.deviceIds:"+ para.deviceIds)
                            } else {
                                para.deviceIds = ''
                            }

                            apiUpdateICCard(para).then((res) => {
                                this.editLoading = false
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                })
                                this.$refs['editForm'].resetFields()
                                this.editFormVisible = false
                                this.getICCards()
                            });
                        }).catch( () => {
                            this.editLoading = false
                            this.$refs['editForm'].resetFields()
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            para.estateId = 1
                            if (this.addForm.selDevices.length > 0) {
                                console.log("len:"+ this.addForm.selDevices.length + " " + this.addForm.selDevices)
                                para.deviceIds = this.addForm.selDevices.join(",")
                            } else {
                                para.deviceIds = ''
                            }
                            apiAddICCard(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getICCards();
                            });
                        }).catch( () => {
                            this.addLoading = false
                            this.$refs['addForm'].resetFields()
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { ids: ids };
                    apiBatchRemoveICCard(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getICCards();
                    });
                }).catch(() => {

                });
            },

            getDevices: function () {
                let para = {accountId: this.$store.state.account.id};
                getDeviceList(para).then((res) => {
                    this.devices = res.data.myModel
                    this.devices.forEach( device => {
                        device.fullName = device.buildingNum + '栋' + device.unitNum + '单元'
                    })
                });
            },

            getDeviceName: function ( id ) {
                let name = '未登记设备'
                this.devices.forEach( device => {
                    if (device.id == id) {
                        name = '' + device.buildingNum + '栋'
                        if(device.unitNum !== '') {
                            name = name + device.unitNum + '单元'
                        }
                        return name
                    }
                })
                return name
            }
        },
        mounted() {
            this.getDevices()
            this.getICCards()
            this.getUserList()
        }
    }

</script>

<style scoped>

</style>
