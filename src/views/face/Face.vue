<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getFaces">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="facelist" highlight-current-row
                  v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" :span="1" align="center">
            </el-table-column>
            <el-table-column type="index" :span="4" align="center">
            </el-table-column>
            <el-table-column prop="userName" label="姓名" :span="4" sortable align="center">
            </el-table-column>
            <el-table-column property="homeName" label="住家" width="300" sortable align="center">
            </el-table-column>
            <el-table-column property="validDevice" label="登记设备" width="300" sortable align="center">
            </el-table-column>
            <el-table-column prop="url" label="图像" :span="4" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.url" min-width="70" height="70" />
                </template>
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
                <el-form-item label="姓名" prop="userName">
                    <el-input v-model="editForm.userName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="identityCardNum">
                    <el-input v-model="editForm.identityCardNum" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="图像" prop="fnOnServer">
                    <el-input v-model="editForm.fnOnServer" v-show="false"></el-input>
                    <el-upload
                            list-type="picture-card"
                            class="avatar-uploader"
                            :class="{disabled:uploadDisabled}"
                            ref="faceUpload"
                            :action="uploadAction"
                            accept="image/jpeg,image/png"
                            :data="faceUploadruleForm"
                            :before-upload="handleFaceBeforeUpload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-exceed="onExceed"
                            :on-change="fileChange"
                            :limit="1"
                            :multiple="false"
                            :auto-upload="false"
                            :on-success="handleSuccess">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过4MB</div>
                    </el-upload>
                </el-form-item>

                <el-form-item label="登记设备">
                    <el-transfer v-model="selDevices"
                                 :props="{ key: 'id', label: 'fullName' }"
                                 :data="this.devices"
                                 :titles="['待选', '已选']"
                                 :button-texts="['移除', '选择']">
                    </el-transfer>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editCancel">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
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

                <el-form-item label="图像" prop="fnOnServer">
                    <el-input v-model="addForm.fnOnServer" v-show="false"></el-input>
                    <el-upload
                            list-type="picture-card"
                            class="avatar-uploader"
                            :class="{disabled:uploadDisabled}"
                            ref="faceUpload"
                            :action="uploadAction"
                            accept="image/jpeg,image/png"
                            :data="faceUploadruleForm"
                            :before-upload="handleFaceBeforeUpload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-exceed="onExceed"
                            :on-change="fileChange"
                            :limit="1"
                            :multiple="false"
                            :auto-upload="false"
                            :on-success="handleSuccess">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过4MB</div>
                    </el-upload>
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
                <el-button @click.native=addCancel>取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    import { apiGetFacePage, apiRemoveFace, apiBatchRemoveFace, apiUpdateFace, apiAddFace } from '../../api/api';
    import { apiGetUserList, getDeviceList } from '../../api/api'
    import { API_NEW_VERSION, API_HOST } from '../../api/api'


    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                facelist: [],
                userList: [],
                devices: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    userId: [
                        { required: true, message: '请选择人员', trigger: 'blur', type: "number" }
                    ],
                    fnOnServer: [
                        { required: true, message: '请上传图片到服务器', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    identityCardNum: '',
                    userName: '',
                    fnOnServer: '',
                    selDevices: [],
                },
                selDevices: [],
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    userId: [
                        { required: true, message: '请选择人员', trigger: 'blur', type: "number" }
                    ],
                    fnOnServer: [
                        { required: true, message: '请上传图片到服务器', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    id: 0,
                    identityCardNum: '',
                    userName: '',
                    fnOnServer: '',
                    selDevices: [],
                },

                faceFileList: [],
                faceUploadruleForm: {
                    usage: 'faceul'
                },
                uploadDisabled: false,
                uploadAction: API_NEW_VERSION + "/busi/file_upload"
            }
        },
        methods: {

            handleCurrentChange(val) {
                this.page = val;
                this.getFaces();
            },
            //获取用户列表
            getUserList: function() {
                apiGetUserList().then((res) => {
                    this.userList = res.data.myModel
                })
            },
            getFaces() {
                let para = {
                    page: this.page,
                    count: 10,
                    filter: this.filters.name
                };
                this.listLoading = true;
                apiGetFacePage(para).then((res) => {
                    this.total = res.data.myModel.total;
                    this.facelist = res.data.myModel.data;
                    this.listLoading = false;
                    this.facelist.forEach( face => {
                        face.homeName = face.buildingNum + '栋'
                        if(face.unitNum !== '') {
                            face.homeName = face.homeName + face.unitNum + '单元'
                        }
                        face.homeName = face.homeName + face.roomNum + '室'
                        face.validDevice = ''
                        face.deviceIds.split(',').forEach( id => {
                            if(face.validDevice.length != 0) {
                                face.validDevice += '｜'
                            }
                            face.validDevice += this.getDeviceName(id) + "    "
                        })
                        face.url = API_HOST + face.webAccessName
                    })

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
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { id: row.id };
                    apiRemoveFace(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getFaces();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
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
                    id: '',
                    userName: '',
                    identityCardNum: '',
                    fnOnServer: '',
                    selDevices: [],
                };
            },
            //编辑
            editSubmit: function () {
                console.log("this.editForm.fnOnServer:"+this.editForm.fnOnServer)
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm)
                            para.estateId = 1
                            if (this.selDevices.length > 0) {
                                console.log("len:"+ this.selDevices.length + " " + JSON.stringify(this.selDevices))
                                para.deviceIds = this.selDevices.join(",")
                                console.log("para.deviceIds:"+ para.deviceIds)
                            } else {
                                para.deviceIds = ''
                            }
                            apiUpdateFace(para).then((res) => {
                                this.editLoading = false
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                })
                                this.$refs['editForm'].resetFields()
                                this.editFormVisible = false
                                this.getFaces()
                                this.$refs.faceUpload.clearFiles()
                            });
                        }).catch( () => {
                            this.editLoading = false
                            this.$refs['editForm'].resetFields()
                        });
                    }
                });
            },
            editCancel: function () {
                this.editFormVisible = false
                this.uploadDisabled = false
                this.$refs.faceUpload.clearFiles()
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            if (this.addForm.selDevices.length > 0) {
                                console.log("len:"+ this.addForm.selDevices.length + " " + this.addForm.selDevices)
                                para.deviceIds = this.addForm.selDevices.join(",")
                            } else {
                                para.deviceIds = ''
                            }
                            apiAddFace(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.uploadDisabled = false
                                this.getFaces();
                                this.$refs.faceUpload.clearFiles()
                            });
                        }).catch( () => {
                            this.addLoading = false
                            this.uploadDisabled = false
                            this.$refs['addForm'].resetFields()
                        });
                    }
                });
            },
            addCancel: function () {
                this.addFormVisible = false
                this.uploadDisabled = false
                this.$refs.faceUpload.clearFiles()
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
                    apiBatchRemoveFace(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getFaces();
                    });
                }).catch(() => {

                });
            },
            submitUpload() {
                console.log("submitUpload")
                this.$refs.faceUpload.submit();
            },
            handleFaceBeforeUpload ( file ) {
                const isIMAGE = file.type === 'image/jpeg'||'image/png';
                const isLt4M = file.size / 1024 / 1024 < 4;
                console.log("faceFileList:" + this.faceFileList + " len:" + this.faceFileList.length)
                if (!isIMAGE) {
                    this.$message.error('上传文件只能是图片格式!');
                }
                if (!isLt4M) {
                    this.$message.error('上传文件大小不能超过 4MB!');
                }
                return isIMAGE && isLt4M;
            },
            handleRemove(file, fileList) {
                this.uploadDisabled = (fileList.length > 0) ? 1 : 0
            },
            handlePreview(file) {
                console.log("preview" + file.url);
            },
            handleSuccess(res,file,fileList){
                if(res.state===0){
                    this.editForm.fnOnServer = res.fn
                    this.editForm.faceImgB64 = ''
                    this.addForm.fnOnServer = res.fn
                    console.log("this.editForm.fnOnServer:"+this.editForm.fnOnServer)
                    this.$message({
                        message: '上传成功！',
                        type: 'success'
                    });
                }else {
                    this.$refs.faceUpload.clearFiles()
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }
            },
            onExceed(files, fileList) {
                this.$message({
                    type: 'info',
                    message: '最多只能上传一个图片',
                    duration: 6000
                });
            },
            // 文件状态改变时的钩子
            fileChange(file, fileList) {
                this.uploadDisabled = (fileList.length > 0) ? 1 : 0
            },
        },
        computed: {

        },
        mounted() {
            this.getDevices()
            this.getFaces()
            this.getUserList()
        }
    }

</script>

<style scoped>

</style>

<style >
    .disabled .el-upload--picture-card {
        display: none;
    }
</style>
