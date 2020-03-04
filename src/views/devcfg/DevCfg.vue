<template>
    <el-form ref="cfgEditForm" :model="cfgEditForm" label-width="120px" v-loading="cfgEditFormLoading">
        <el-form-item label="选择设备" >
            <el-select v-model="curr_select" filterable placeholder="请选择" style="width:50%"
                        @change="onDevSelChange">
                <el-option
                        v-for="item in this.devices"
                        :key="item.id"
                        :label="item.fullName"
                        :value="item.id">
                    <span >楼栋：{{ item.buildingNum }}</span>
                    <span v-if="item.unitNum !== 0">｜单元：{{ item.unitNum }}</span>
                    <span >｜设备ID：{{ item.aliaId }}</span>
                    <span v-if="isAdmin===1">｜账号：{{ item.accountNickName }}</span>
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="活体检测" prop="liveDetectOn">
            <el-switch
                    v-model="cfgEditForm.liveDetectOn">
            </el-switch>
        </el-form-item>
        <el-form-item label="识别数据本地保存" prop="regzSaveLocalOn">
            <el-switch
                    v-model="cfgEditForm.regzSaveLocalOn"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="开"
                    inactive-text="关">
            </el-switch>
        </el-form-item>
        <el-form-item label="识别数据本地保存时间（天）" prop="regzSaveLocalTime" >
            <el-input-number v-model="cfgEditForm.regzSaveLocalTime"
                             :min="30" :max="365"></el-input-number>
        </el-form-item>
        <el-form-item label="本地注册保存" prop="registerSaveLocalOn" >
            <el-switch
                    v-model="cfgEditForm.registerSaveLocalOn"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="开"
                    inactive-text="关">
            </el-switch>
        </el-form-item>
        <el-form-item label="识别录像开关" prop="regzVideoOn">
            <el-switch
                    v-model="cfgEditForm.regzVideoOn"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="开"
                    inactive-text="关">
            </el-switch>
        </el-form-item>
        <el-form-item label="识别常开开关" prop="regzAlwaysOn">
            <el-switch
                    v-model="cfgEditForm.regzAlwaysOn"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="开"
                    inactive-text="关">
            </el-switch>
        </el-form-item>
        <el-form-item label="关屏关识别时间（秒）" prop="regzOffTime" >
            <el-input-number v-model="cfgEditForm.regzOffTime"
                             :min="1" :max="86400"></el-input-number>
        </el-form-item>
        <el-form-item label="识别陌生人" prop="regzStranger">
            <el-switch
                    v-model="cfgEditForm.regzStranger"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="开"
                    inactive-text="关">
            </el-switch>
        </el-form-item>
        <el-form-item label="停机状态" prop="funcStop">
            <el-switch
                    v-model="cfgEditForm.funcStop"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="开"
                    inactive-text="关"
                    @change="onStopFuncSwitchChange">
            </el-switch>
        </el-form-item>
        <el-form-item label="闸机口常开（停机状态可用）" prop="gateOpen">
            <el-switch
                    v-bind:disabled="cfgEditForm.gateOpenDisabled"
                    v-model="cfgEditForm.gateOpen"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="开"
                    inactive-text="关">
            </el-switch>
        </el-form-item>
        <el-form-item label="关门超时报警时间（秒）" prop="doorCloseAlarmTime" >
            <el-input-number v-model="cfgEditForm.doorCloseAlarmTime"
                             :min="10" :max="60"></el-input-number>
        </el-form-item>
        <el-form-item label="门关闭时间（秒）" prop="closeTimeAfterOpen" >
            <el-input-number v-model="cfgEditForm.closeTimeAfterOpen"
                             :min="5" :max="9"></el-input-number>
        </el-form-item>
        <el-form-item>
            <el-button @click="onSubmit">提交</el-button>
            <el-button @click="onCancel">取消</el-button>
        </el-form-item>
    </el-form>

</template>

<script>
    import { getDeviceListPage, apiGetDevcfgByDevId, apiUpdateDevcfg } from '../../api/api';

    export default {
        data() {
            return {
                cfgEditFormLoading: false,
                devcfg: {},
                page: 1,
                filters: {
                    name: ''
                },
                isAdmin: 0,
                devices: [],
                curr_select: 0,

                //新增界面数据
                cfgEditForm: {
                    regzSaveLocalTime: 30,
                    liveDetectOn: true,
                    regzOffTime: 120,
                    regzSaveLocalOn: false,
                    registerSaveLocalOn: true,
                    regzVideoOn: true,
                    regzAlwaysOn: false,
                    getAgain: false,
                    regzStranger: false,
                    funcStop: false,
                    gateOpen: false,
                    doorCloseAlarmTime: 30,
                    gateOpenDisabled: false,
                }

            }
        },
        methods: {
            getDeviceConfig: function (devId) {
                let para = {
                    devId: devId
                }
                this.cfgEditFormLoading = true
                apiGetDevcfgByDevId(para).then((res) => {
                    this.devcfg = res.data.myModel
                    this.cfgEditForm = {
                        regzSaveLocalTime: 30,
                        liveDetectOn: true,
                        regzOffTime: 120,
                        regzSaveLocalOn: false,
                        registerSaveLocalOn: true,
                        regzVideoOn: true,
                        regzAlwaysOn: false,
                        getAgain: false,
                        regzStranger: false,
                        funcStop: false,
                        gateOpen: false,
                        doorCloseAlarmTime: 30,
                        closeTimeAfterOpen: 5,
                        gateOpenDisabled: false,
                    }
                    console.log("bofore:" + JSON.stringify(this.cfgEditForm))
                    this.cfgEditForm = Object.assign({}, this.devcfg)
                    if (this.cfgEditForm.funcStop === false) {
                        this.cfgEditForm.gateOpen = false
                        this.cfgEditForm.gateOpenDisabled = true
                    } else {
                        this.cfgEditForm.gateOpenDisabled = false
                    }
                    this.cfgEditForm.regzSaveLocalTime = this.devcfg.regzSaveLocalTime / 24
                    console.log("after:" + JSON.stringify(this.cfgEditForm))
                    if(this.cfgEditForm.getAgain == true) {
                        setTimeout(() => {
                            apiGetDevcfgByDevId(para).then((res) => {
                                this.devcfg = res.data.myModel
                                this.cfgEditForm = Object.assign({}, this.devcfg)
                                if (this.cfgEditForm.funcStop === false) {
                                    this.cfgEditForm.gateOpen = false
                                    this.cfgEditForm.gateOpenDisabled = true
                                } else {
                                    this.cfgEditForm.gateOpenDisabled = false
                                }
                                this.cfgEditForm.regzSaveLocalTime = this.devcfg.regzSaveLocalTime / 24
                                this.cfgEditFormLoading = false
                            })
                        }, 2000)
                    } else {
                        this.cfgEditFormLoading = false
                    }
                })
            },
            getDevices: function () {
                let para = {
                    page: this.page,
                    count: 100000,
                    filter: this.filters.name
                };
                //NProgress.start();
                getDeviceListPage(para).then((res) => {
                    console.log("res.status:" + res.statusText)
                    this.total = res.data.myModel.total;
                    this.devices = res.data.myModel.data;
                    //NProgress.done();
                    this.curr_select = this.devices[0].id
                    this.devices.forEach( device => {
                        device.fullName = device.buildingNum + '栋'
                        if(device.unitNum !== 0) {
                            device.fullName = device.fullName + '｜' + device.unitNum + '单元'
                        }
                        device.fullName = device.fullName + '｜设备ID：' + device.aliaId
                        if(this.isAdmin === 1) {
                            device.fullName = device.fullName + '｜账号：' + device.accountNickName
                        }

                    })
                    this.getDeviceConfig(this.curr_select)
                });
            },
            onDevSelChange: function (curSel) {
                this.getDeviceConfig(this.curr_select)
            },
            onStopFuncSwitchChange: function (curSel) {
                if (curSel === false) {
                    this.cfgEditForm.gateOpen = false
                    this.cfgEditForm.gateOpenDisabled = true
                } else {
                    this.cfgEditForm.gateOpenDisabled = false
                }
            },
            onSubmit: function () {
                this.$refs.cfgEditForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.cfgEditLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.cfgEditForm);
                            let accId = sessionStorage.getItem('accountId');
                            para.accountId = parseInt(accId)
                            apiUpdateDevcfg(para).then((res) => {
                                this.cfgEditLoading = false;
                                this.devcfg = Object.assign({}, this.cfgEditForm)
                                this.devcfg.regzSaveLocalTime = this.cfgEditForm.regzSaveLocalTime * 24
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                            });
                        }).catch( () => {
                            this.cfgEditLoading = false
                        });
                    }
                });
            },
            onCancel: function () {
                console.log("onCancel")
                this.cfgEditForm = Object.assign({}, this.devcfg)
                console.log("cfgEditForm:" + JSON.stringify(this.cfgEditForm))
                console.log("devcfg:" + JSON.stringify(this.devcfg))
            },
        },
        mounted() {
            this.getDevices();
            this.isAdmin = parseInt(sessionStorage.getItem('isAdmin'))
        }
    }

</script>

<style scoped>

</style>
