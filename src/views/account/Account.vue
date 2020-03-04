<template>
    <section>
        <el-tabs v-model="tabActiveName" @tab-click="handletTabClick">
            <el-tab-pane label="账号" name="tabAccountList">

                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-if="isAdmin===1">
                    <el-form :inline="true" :model="filters">
                        <el-form-item>
                            <el-input v-model="filters.name"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getAccountPage">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleAdd">新增账号</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <!--列表-->
                <el-table :data="accounts" highlight-current-row
                          v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
                    <el-table-column type="selection" :selectable='checkboxT' width="35" align="center">
                    </el-table-column>
                    <el-table-column type="index" width="60" align="center">
                    </el-table-column>
                    <el-table-column prop="name" label="账号" width="200" sortable align="center">
                    </el-table-column>
                    <el-table-column prop="nickName" label="昵称" width="200" sortable align="center">
                    </el-table-column>
                    <!--
                    <el-table-column prop="appKey" label="appkey" width="300" sortable align="center"
                                     show-overflow-tooltip>
                    </el-table-column>
                    -->
                    <!--
                    <el-table-column prop="aesSecret" label="AES秘钥" width="180" sortable align="center"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="privateKeyPkcs8" label="签名私钥(Pkcs8)" width="180" sortable align="center"
                                     show-overflow-tooltip>
                    </el-table-column>
                    -->
                    <el-table-column label="操作"  align="center">
                        <template scope="scope">
                            <el-button size="small"
                                       @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" :disabled=scope.row.isAdmin
                                       @click="handleDel(scope.$index, scope.row)" v-if="isAdmin===1">删除</el-button>
                            <el-button size="small"
                                       @click="handleModifyPasswd(scope.$index, scope.row)">修改密码</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" v-if="isAdmin===1">批量删除</el-button>
                    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10"
                                   :total="total" style="float:right;">
                    </el-pagination>
                </el-col>

                <!--修改密码界面-->
                <el-dialog title="修改密码" v-model="passwdFormVisible" :close-on-click-modal="false">
                    <el-form :model="passwdForm" label-width="180px" :rules="passwdFormRules" ref="passwdForm">
                        <el-form-item label="新密码" prop="passwd">
                            <el-input type="password" v-model="passwdForm.passwd" auto-complete="off" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="passwdAgain">
                            <el-input type="password" v-model="passwdForm.passwdAgain" auto-complete="off" show-password></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="passwdFormVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="passwdSubmit" :loading="passwdLoading">提交</el-button>
                    </div>
                </el-dialog>

                <!--编辑界面-->
                <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
                    <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                        <el-form-item label="账号" prop="name">
                            <el-input v-model="editForm.name" auto-complete="off" :disabled="isAdmin===0"></el-input>
                        </el-form-item>
                        <el-form-item label="昵称" prop="nickName">
                            <el-input v-model="editForm.nickName" auto-complete="off"></el-input>
                        </el-form-item>
                        <!--
                        <el-form-item label="appkey" prop="appKey">
                            <el-input v-model="editForm.appKey" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="AES秘钥" prop="aesSecret">
                            <el-input v-model="editForm.aesSecret" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="签名私钥(Pkcs8)" prop="privateKeyPkcs8">
                            <el-input v-model="editForm.privateKeyPkcs8" auto-complete="off"
                                      type="textarea" autosize ></el-input>
                        </el-form-item>
                        -->
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="editFormVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
                    </div>
                </el-dialog>

                <!--新增界面-->
                <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
                    <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                        <el-form-item label="账号" prop="name">
                            <el-input v-model="addForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="passwd">
                            <el-input type="password" v-model="addForm.passwd" show-password auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="昵称" prop="nickName">
                            <el-input v-model="addForm.nickName" auto-complete="off"></el-input>
                        </el-form-item>
                        <!--
                        <el-form-item label="appkey" prop="appKey">
                            <el-input v-model="addForm.appKey" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="AES秘钥" prop="aesSecret">
                            <el-input v-model="addForm.aesSecret" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="签名私钥(Pkcs8)" prop="privateKeyPkcs8">
                            <el-input v-model="addForm.privateKeyPkcs8" auto-complete="off"
                                      type="textarea" autosize ></el-input>
                        </el-form-item>
                        -->
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="addFormVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="设备归属" name="tabDeviceAssign" v-if="isAdmin===1">

                <!--设备归属界面-->

                <el-form :model="devAssignForm" label-width="80px"  ref="devAssignForm">
                    <el-form-item label="子账号"  >
                        <el-select v-model="curr_subaccountId" filterable placeholder="请选择" style="width:100%"
                                   v-loading="listLoading"
                                   @change="onSubAccountSelChange">
                            <el-option
                                    v-for="item in this.sub_accounts"
                                    :key="item.id"
                                    :label="item.fullName"
                                    :value="item.id"
                                    style="width:100%">
                                <span >账号：{{ item.name }}</span>
                                <span > ｜ 昵称：{{ item.nickName }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-transfer v-model="this.subKeyDevices"
                                     @change="handleTransferChange"
                                     :data="this.mainKeyDevices"
                                     :titles="['主账号设备', '子账号设备']"
                                     :button-texts="['移除', '选择']"
                                     filterable>
                        </el-transfer>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {apiGetAccountList, apiGetAccountPage, apiRemoveAccount, apiBatchRemoveAccount} from '../../api/api';
    import {apiUpdateAccount, apiAddAccount, apiAccountUpdatePasswd, apiGetPtuidList} from '../../api/api';
    import {getDeviceList, apiDeviceAssignBatchAdd, apiDeviceAssignBatchDel} from '../../api/api';
    import md5 from 'js-md5'

    export default {
        data() {
            return {
                tabActiveName: 'tabAccountList',
                isAdmin: 0,
                filters: {
                    name: ''
                },
                added_ptuids: {},
                accounts: [],
                main_account:{},
                sub_accounts: [],
                curr_subaccountId: 0,
                sub_account_map:{},

                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                passwdFormVisible: false,
                passwdLoading: false,
                passwdFormRules: {
                    passwd: [
                        {required: true, validator: this.validatePass, trigger: 'blur'}
                    ],
                    passwdAgain: [
                        {required: true, validator: this.validatePass2, trigger: 'blur'}
                    ]
                },
                passwdForm: {
                    id: 0,
                    passwd: '',
                    passwdAgain: '',
                },

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入账号', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: '',
                    passwd: '',
                    estateId: 0,
                    isAdmin: 0,
                    appKey: '',
                    aesSecret: '',
                    privateKeyPkcs8: '',
                    nickName: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入账号', trigger: 'blur'}
                    ],
                    passwd: [
                        {required: true, validator: this.addAccountValidatePass, trigger: 'blur'}
                    ],
                },
                //新增界面数据
                addForm: {
                    id: 0,
                    name: '',
                    passwd: '',
                    estateId: 0,
                    isAdmin: 0,
                    appKey: '',
                    aesSecret: '',
                    privateKeyPkcs8: '',
                    nickName: ''
                },

                devAssignFormVisible: false,
                devAssignFormLoading: false,
                devAssignForm: {

                },
                mainKeyDevices: [],
                subKeyDevices: [],
                mainKeyDeviceList: [],
                subKeyDeviceList: {},
            }
        },
        methods: {
            handletTabClick(tab, event) {

                if(event.type === 'click') {
                    if(tab.name === 'tabAccountList') {
                        console.log(tab.name, event.type)
                        this.getAccountPage()
                    } else if(tab.name === 'tabDeviceAssign') {
                        console.log(tab.name, event.type)
                        this.fillAccountDevices()
                        this.curr_subaccountId = this.sub_accounts[0].id
                    }
                }
            },
            //复选框
            checkboxT(row, rowIndex){
                if(row.isAdmin==1){
                    return false;//禁用
                }else{
                    return true;//不禁用
                }
            },

            handleCurrentChange(val) {
                this.page = val;
            },

            getAccountPage() {
                let para = {
                    page: this.page,
                    count: 10,
                    filter: this.filters.name,
                    accountId: ''
                };
                this.listLoading = true;

                apiGetAccountPage(para).then((res) => {
                    this.total = res.data.myModel.total;
                    this.accounts = res.data.myModel.data;
                    this.accounts.forEach( acc => {
                        if(acc.isAdmin == 1) {
                            acc.isAdmin = true
                        } else {
                            acc.isAdmin = false
                        }
                    })
                    this.listLoading = false;
                });
            },
            onSubAccountSelChange: function (curSel) {
                console.log("curSel:" + curSel)
                this.curr_subaccountId = curSel
                this.fillAccountDevices()
            },
            fillAccountDevices() {
                this.devAssignFormVisible = true
                this.devAssignFormLoading = false
                this.mainKeyDevices = []
                this.subKeyDevices = []

                this.fillMainAccoutDevices()
                this.fillSubAccountDevices(this.curr_subaccountId)
            },
            //删除
            handleDel: function (index, row) {
                if(this.subKeyDeviceList[row.id] != null && this.subKeyDeviceList[row.id].length > 0) {
                    console.log("this.subKeyDeviceList[row.id]:" + JSON.stringify(this.subKeyDeviceList[row.id]))
                    let txt = "请先把账号[" +　this.sub_account_map[row.id].nickName + "]的设备归属到主账号"
                    this.$confirm(txt, "提示", {
                        confirmButtonText: "确定",
                        type: "warning"
                    }).then(() => {
                    }).catch(() => {
                    })
                    return
                }

                this.$confirm('确认删除该账号吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    apiRemoveAccount(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getAccountPage()
                        this.prepareDeviceAssign()
                    });
                }).catch(() => {

                });
            },
            //　修改密码
            handleModifyPasswd: function (index, row) {
                this.passwdFormVisible = true;
                this.passwdForm = Object.assign({}, row);
                this.passwdForm.passwd = ''
                this.passwdForm.passwdAgain = ''
            },

            addAccountValidatePass: function (rule, value, callback) {
                if (!value) {
                    callback(new Error('请输入密码'));
                } else if (value.toString().length < 6 || value.toString().length > 18) {
                    callback(new Error('密码长度为6 - 18个字符'))
                } else {
                    callback();
                }
            },

            validatePass: function (rule, value, callback) {
                if (!value) {
                    callback(new Error('请输入新密码'));
                } else if (value.toString().length < 6 || value.toString().length > 18) {
                    callback(new Error('密码长度为6 - 18个字符'))
                } else {
                    callback();
                }
            },

            validatePass2: function (rule, value, callback) {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.passwdForm.passwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback()
                }
            },

            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    id: 0,
                    name: '',
                    passwd: '',
                    estateId: 0,
                    isAdmin: 0,
                    appKey: '',
                    aesSecret: '',
                    privateKeyPkcs8: '',
                    nickName: ''
                };
            },
            passwdSubmit: function () {
                this.$refs.passwdForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.passwdLoading = true
                            //NProgress.start();
                            let para = Object.assign({}, this.passwdForm)
                            para.estateId = 0
                            para.passwd = md5(para.passwd)
                            apiAccountUpdatePasswd(para).then((res) => {
                                this.passwdLoading = false
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                })
                                this.$refs['passwdForm'].resetFields()
                                this.passwdFormVisible = false
                                this.getAccountPage()
                            });
                        }).catch(() => {
                            this.passwdLoading = false
                            this.$refs['passwdForm'].resetFields()
                        });
                    }
                });
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm)
                            para.estateId = 0
                            apiUpdateAccount(para).then((res) => {
                                this.editLoading = false
                                //NProgress.done();
                                if(res.data.myModel === 'success') {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    })
                                } else {
                                    this.$message({
                                        message: res.data.myModel,
                                        type: 'error'
                                    });
                                }

                                this.$refs['editForm'].resetFields()
                                this.editFormVisible = false
                                this.getAccountPage()
                                this.prepareDeviceAssign()
                            });
                        }).catch(() => {
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
                            para.passwd = md5(para.passwd)
                            apiAddAccount(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                if(res.data.myModel === 'success') {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                } else {
                                    this.$message({
                                        message: res.data.myModel,
                                        type: 'error'
                                    });
                                }

                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getAccountPage()
                                this.prepareDeviceAssign()
                            });
                        }).catch(() => {
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
                let accounts = []
                this.sels.forEach(item => {
                    if(this.subKeyDeviceList[item.id] != null && this.subKeyDeviceList[item.id].length > 0) {
                        accounts.push(item.nickName)
                    }
                })
                if(accounts.length > 0) {
                    let txt = "请先把账号" +　JSON.stringify(accounts) + "的设备归属到主账号"
                    this.$confirm(txt, "提示", {
                        confirmButtonText: "确定",
                        type: "warning"
                    }).then(() => {
                    }).catch(() => {
                    })
                    return
                }
                console.log("ids:" + JSON.stringify(ids) + "this.sels:" + JSON.stringify(this.sels))

                this.$confirm('确认删除选中账号吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: ids};
                    apiBatchRemoveAccount(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getAccountPage()
                        this.prepareDeviceAssign()
                    });
                }).catch(() => {

                });
            },

            fillMainAccoutDevices: function () {
                this.mainKeyDevices = []
                if (this.mainKeyDeviceList != null) {
                    this.mainKeyDeviceList.forEach((ptuid, index) => {
                        this.mainKeyDevices.push({key:ptuid, label:ptuid})
                    })

                    console.log("ptuids:" + JSON.stringify(this.mainKeyDevices))
                }
                if(this.curr_subaccountId === -1) {
                    this.curr_subaccountId = this.sub_accounts[0].id
                }

            },

            getAddedPtuidList: function () {
                let para = {accountId: this.main_account.id}
                getDeviceList(para).then((res) => {
                    if(res.data.myModel != null) {
                        res.data.myModel.forEach( dev => {
                            if(this.added_ptuids[dev.accountId] == null) {
                                this.added_ptuids[dev.accountId] = []
                            }
                            if(this.added_ptuids[dev.accountId].indexOf(dev.aliaId) === -1) {
                                this.added_ptuids[dev.accountId].push(dev.aliaId)
                            }
                        })
                    } else {
                        this.added_ptuids[this.main_account.id] = []
                        if(this.sub_accounts != null) {
                            this.sub_accounts.forEach(acc => {
                                this.added_ptuids[acc.id] = []
                            })
                        }
                    }
                    console.log("added_ptuids:" + JSON.stringify(this.added_ptuids))
                    this.fillAccountDevices()
                })
            },

            getMainKeyDeviceList: function () {
                this.listLoading = true;
                let para = {accountId: this.main_account.id}
                apiGetPtuidList(para).then((res) => {
                    if (res.data.myModel.state === 0 && res.data.myModel.listPtuid != null) {
                        this.mainKeyDeviceList = res.data.myModel.listPtuid
                        console.log("mainKeyDeviceList:" + JSON.stringify(this.mainKeyDeviceList))
                    }
                    this.fillAccountDevices()
                });
            },

            getSubKeyDeviceList: function (accountId) {
                let para = {accountId: accountId}
                this.listLoading = true;
                apiGetPtuidList(para).then((res) => {
                    if (res.data.myModel.state === 0 && res.data.myModel.listPtuid != null) {
                        this.subKeyDeviceList[accountId] = res.data.myModel.listPtuid
                        console.log("subKeyDeviceList:" + JSON.stringify(this.subKeyDeviceList))
                        this.listLoading = false
                        this.fillAccountDevices()
                    }
                });
            },

            getAccountList() {
                this.listLoading = true;
                apiGetAccountList().then((res) => {
                    res.data.myModel.forEach( acc => {
                        if(acc.isAdmin === 0) {
                            acc.fullName = '账号:'+acc.name+' | 昵称:'+acc.nickName
                            this.sub_accounts.push(acc)
                            this.sub_account_map[acc.id] = acc

                            this.getSubKeyDeviceList(acc.id)
                        } else {
                            this.main_account = acc
                            this.getMainKeyDeviceList()
                            this.getAddedPtuidList()
                        }
                    })

                });
            },

            fillSubAccountDevices: function (accountId) {
                this.subKeyDevices = []
                if (this.subKeyDeviceList[accountId] != null) {
                    this.subKeyDeviceList[accountId].forEach((ptuid, index) => {
                        this.subKeyDevices.push(ptuid)
                        this.mainKeyDevices.push({key:ptuid, label:ptuid})
                    })

                    console.log("subkey ptuids:" + JSON.stringify(this.subKeyDevices))
                }
            },
            handleTransferChange(value, direction, movedKeys) {
                //可以通过direction回调right/left 来进行操作，right：把数字移到右边，left把数据移到左边

                let addedPtuid = []
                let para = {appKey: '', ptuids: ''}
                if(direction === "right") {

                    movedKeys.forEach( ptuid => {
                        if(this.added_ptuids[this.main_account.id] != null &&
                            this.added_ptuids[this.main_account.id].indexOf(ptuid) !== -1) {
                            addedPtuid.push(ptuid)
                        }
                    })

                    if(addedPtuid.length > 0) {
                        console.log("addedPtuid:" + JSON.stringify(addedPtuid))
                        let txt = "请在\"设备管理\"中先删除设备:" + JSON.stringify(addedPtuid)
                        this.$msgbox({
                            message: txt,
                            type: "warning"
                        }).then(() => {
                            this.fillAccountDevices()
                        })
                        this.prepareDeviceAssign()
                        return
                    }
                    para = {
                        accountId: this.sub_account_map[this.curr_subaccountId].id,
                        ptuids: movedKeys.join(',')
                    }
                    console.log("para:" + JSON.stringify(para))
                    apiDeviceAssignBatchAdd(para).then((res) => {
                        if(res.data.myModel === 'success') {
                            this.$msgbox({
                                message: '提交成功',
                                type: 'success'
                            }).then((t, n) => {
                                this.fillAccountDevices()
                            })
                        } else {
                            this.$msgbox({
                                message: '提交失败',
                                type: 'error'
                            }).then((t, n) => {
                                this.fillAccountDevices()
                            })
                        }

                        //this.onSubAccountAssignFormClose()
                        this.prepareDeviceAssign()
                    })
                }
                if(direction === "left") {
                    console.log("assign to main_account:" + JSON.stringify(this.main_account))
                    console.log("assign to sub_account_map:" + JSON.stringify(this.sub_account_map))
                    movedKeys.forEach( ptuid => {

                        if(this.added_ptuids[this.sub_account_map[this.curr_subaccountId].id] != null &&
                            this.added_ptuids[this.sub_account_map[this.curr_subaccountId].id].indexOf(ptuid) !== -1) {
                            addedPtuid.push(ptuid)
                        }
                    })
                    if(addedPtuid.length > 0) {
                        console.log("addedPtuid:" + JSON.stringify(addedPtuid))
                        let txt = "请在\"设备管理\"中先删除设备:" + JSON.stringify(addedPtuid)
                        this.$msgbox({
                            message: txt,
                            type: "warning"
                        }).then(() => {
                            this.fillAccountDevices()
                        })
                        this.prepareDeviceAssign()
                        return
                    }
                    para = {
                        accountId: this.sub_account_map[this.curr_subaccountId].id,
                        ptuids: movedKeys.join(',')
                    }

                    console.log("para:" + JSON.stringify(para))
                    apiDeviceAssignBatchDel(para).then((res) => {
                        if(res.data.myModel === 'success') {
                            this.$msgbox({
                                message: '提交成功',
                                type: 'success'
                            }).then((t, n) => {
                                this.fillAccountDevices()
                            })
                        } else {
                            this.$msgbox({
                                message: '提交失败',
                                type: 'error'
                            }).then((t, n) => {
                                this.fillAccountDevices()
                            })
                        }

                        this.prepareDeviceAssign()
                    })
                }

                console.log("this.subKeyDevices." + JSON.stringify(this.subKeyDevices))
            },
            prepareDeviceAssign: function () {
                this.mainKeyDevices = []
                this.subKeyDevices = []
                this.mainKeyDevices = []
                this.subKeyDevices = []
                this.mainKeyDeviceList = []
                this.subKeyDeviceList = {}
                this.added_ptuids = {}
                this.accounts = []
                this.main_account = {}
                this.sub_accounts = []
                this.sub_account_map = {}
                this.getAccountList()
            }
        },
        mounted() {
            this.getAccountPage()
            this.prepareDeviceAssign()
            this.isAdmin = parseInt(sessionStorage.getItem('isAdmin'))
        }
    }

</script>

<style>
    .el-table .cell {
        white-space: pre-line;
    }
    .el-transfer-panel{
        width: 280px;
        height: 500px;
    }
    .el-transfer-panel__list.is-filterable{
        height: 400px;
    }
</style>
