<template>
    <section>

        <!--列表-->
        <template>
            <el-row>
                <el-select v-model="devCurrSel" filterable placeholder="请选择设备"
                           style="width:50%" label="选择设备"
                           @change="onDevSelChange">
                    <el-option
                            v-for="item in this.deviceList"
                            :key="item.id"
                            :label="item.fullName"
                            :value="item.id">
                        <span >楼栋：{{ item.buildingNum }}</span>
                        <span v-if="item.unitNum !== 0">｜单元：{{ item.unitNum }}</span>
                        <span >｜设备ID：{{ item.aliaId }}</span>
                    </el-option>
                </el-select>
            </el-row>
            <el-row>

                <el-tabs v-model="activeName">
                    <el-tab-pane label="IC卡黑名单" name="first" :key="'first'">
                        <div style="background: yellow; display: inline">
                            <el-row >

                                <!--工具条-->
                                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                                    <el-form :inline="true" :model="filtersBlacklistCard">
                                        <el-form-item>
                                            <el-input v-model="filtersBlacklistCard.name" ></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" v-on:click="searchCardBlacklistPage">查询</el-button>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="handleBlICCardAdd">添加</el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-col>

                                <!--列表-->
                                <el-table :data="cardBlacklist" highlight-current-row
                                          border
                                          height="400"
                                          v-loading="cardBlacklistLoading" @selection-change="selsBlICCardChange"
                                          style="width: 100%;">
                                    <el-table-column type="selection" :span="1" align="center">
                                    </el-table-column>
                                    <el-table-column type="index" :span="4" align="center">
                                    </el-table-column>
                                    <el-table-column property="serial" label="IC卡ID" :span="4" sortable align="center">
                                    </el-table-column>
                                    <el-table-column property="userName" label="持卡人" :span="4" sortable align="center">
                                    </el-table-column>
                                    <el-table-column label="操作" :span="3" align="center">
                                        <template scope="scope">
                                            <el-button type="danger" size="small" @click="handleDelBlICCard(scope.$index, scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!--工具条-->
                                <el-col :span="24" class="toolbar">
                                    <el-button type="danger" @click="batchRemoveBlICCard" :disabled="this.selsBlICCard.length===0">批量删除</el-button>
                                    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChangeBlICCard" :page-size="10" :total="totalBlICCard" style="float:right;">
                                    </el-pagination>
                                </el-col>
                            </el-row>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="人脸黑名单" name="second" :key="'second'">
                        <div style="background: green; display: inline">

                            <el-row >

                                <!--工具条-->
                                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                                    <el-form :inline="true" :model="filtersBlacklistFace">
                                        <el-form-item>
                                            <el-input v-model="filtersBlacklistFace.name" ></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" v-on:click="searchFaceBlacklistPage">查询</el-button>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="handleBlFaceAdd">添加</el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-col>

                                <!--列表-->
                                <el-table :data="faceBlacklist" highlight-current-row
                                          border
                                          height="400"
                                          v-loading="faceBlacklistLoading" @selection-change="selsBlFaceChange"
                                          style="width: 100%;">
                                    <el-table-column type="selection" :span="1" align="center">
                                    </el-table-column>
                                    <el-table-column type="index" :span="4" align="center">
                                    </el-table-column>
                                    <el-table-column property="userName" label="姓名" :span="4" sortable align="center">
                                    </el-table-column>
                                    <el-table-column property="identityCardNum" label="身份证" :span="4" sortable align="center">
                                    </el-table-column>
                                    <el-table-column property="webAccessName" label="图像" :span="4" align="center">
                                        <template slot-scope="scope">
                                            <img :src="scope.row.webAccessName" min-width="70" height="70" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" :span="3" align="center">
                                        <template scope="scope">
                                            <el-button type="danger" size="small" @click="handleDelBlFace(scope.$index, scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!--工具条-->
                                <el-col :span="24" class="toolbar">
                                    <el-button type="danger" @click="batchRemoveBlFace" :disabled="this.selsBlFace.length===0">批量删除</el-button>
                                    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChangeBlFace" :page-size="10" :total="totalBlFace" style="float:right;">
                                    </el-pagination>
                                </el-col>
                            </el-row>
                        </div>
                    </el-tab-pane>
                </el-tabs>


            </el-row>
        </template>

        <!--添加IC卡黑名单界面-->
        <el-dialog title="添加" v-model="addFormBlICCardVisible" :close-on-click-modal="false">
            <el-form label-width="80px" >

                <!--列表-->
                <el-table :data="addFormBlICCardList" highlight-current-row
                          border
                          height="300"
                          v-loading="iccardLoading" @selection-change="selsICCardChange"
                          style="width: 100%;">
                    <el-table-column type="selection" :span="1" align="center">
                    </el-table-column>
                    <el-table-column type="index" :span="4" align="center">
                    </el-table-column>
                    <el-table-column property="serial" label="IC卡ID" :span="4" sortable align="center">
                    </el-table-column>
                    <el-table-column property="userName" label="持卡人" :span="4" sortable align="center">
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormBlICCardVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addICCardToBl" :loading="addFormBlICCardLoading">确定</el-button>
            </div>
        </el-dialog>

        <!--添加人脸黑名单界面-->
        <el-dialog title="添加" v-model="addFormBlFaceVisible" :close-on-click-modal="false">
            <el-form label-width="80px" >

                <!--列表-->
                <el-table :data="addFormBlFaceList" highlight-current-row
                          border
                          height="300"
                          v-loading="faceLoading" @selection-change="selsFaceChange"
                          style="width: 100%;">
                    <el-table-column type="selection" :span="1" align="center">
                    </el-table-column>
                    <el-table-column type="index" :span="4" align="center">
                    </el-table-column>
                    <el-table-column prop="userName" label="姓名" :span="4" sortable align="center">
                    </el-table-column>
                    <el-table-column prop="identityCardNum" label="身份证" :span="4" sortable align="center">
                    </el-table-column>
                    <el-table-column prop="webAccessName" label="图像" :span="4" align="center">
                        <template slot-scope="scope">
                            <img :src="scope.row.webAccessName" min-width="70" height="70" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormBlFaceVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addFaceToBl" :loading="addFormBlFaceLoading">确定</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import { getDeviceList, apiGetBlacklistICCardPage, apiBatchRemoveBlICCard, apiRemoveBlacklistICCard } from '../../api/api';
    import { apiGetICCardList, apiBatchAddICCardToBlacklist } from '../../api/api';
    import { apiGetBlacklistFacePage, apiBatchRemoveBlFace, apiRemoveBlacklistFace } from '../../api/api';
    import { apiGetFaceList, apiBatchAddFaceToBlacklist } from '../../api/api';
    import { API_HOST } from '../../api/api'

    export default {
        data() {
            return {
                activeName: 'first',
                filters: {
                    name: ''
                },
                deviceList: [],
                devCurrSel: '',
                deviceListLoading: false,

                filtersBlacklistCard: {
                    name: ''
                },
                cardBlacklist: [],
                cardBlacklistLoading: false,
                selsBlICCard: [],//列表选中列
                totalBlICCard: 0,
                pageBlICCard: 1,
                addFormBlICCardLoading: false,
                addFormBlICCardVisible: false,//新增界面是否显示
                addFormBlICCardList: [],
                iccardLoading: false,
                selsICCard: [],


                filtersBlacklistFace: {
                    name: ''
                },
                faceBlacklist: [],
                faceBlacklistLoading: false,
                selsBlFace: [],//列表选中列
                totalBlFace: 0,
                pageBlFace: 1,
                addFormBlFaceLoading: false,
                addFormBlFaceVisible: false,//新增界面是否显示
                addFormBlFaceList: [],
                faceLoading: false,
                selsFace: [],

            }
        },
        methods: {
            //用户列表
            getDevices: function () {
                this.deviceListLoading = true
                let para = {accountId: this.$store.state.account.id};
                getDeviceList(para).then((res) => {
                    this.deviceList = res.data.myModel
                    this.deviceListLoading = false
                    this.devCurrSel = this.deviceList[0].id
                    this.deviceList.forEach( device => {
                        device.fullName = device.buildingNum + '栋'
                        if(device.unitNum !== 0) {
                            device.fullName = device.fullName + '｜' + device.unitNum + '单元'
                        }
                        device.fullName = device.fullName + '｜设备ID：' + device.aliaId
                    })

                })
            },
            onDevSelChange: function (val) {
                console.log("onDevSelChange:" + JSON.stringify(val))
                this.getICCardBlacklist(this.devCurrSel)
                this.getFaceBlacklist(this.devCurrSel)
            },

            // IC卡黑名单
            searchCardBlacklistPage: function () {
                this.getICCardBlacklist(this.devCurrSel)
            },

            getICCardBlacklist: function (deviceId) {
                console.log("deviceId:" + deviceId)
                this.cardBlacklistLoading = true
                let para = {
                    page: this.pageBlICCard,
                    count: 10,
                    filter: this.filtersBlacklistCard.name,
                    deviceId: deviceId
                };
                apiGetBlacklistICCardPage(para).then((res) => {
                    this.totalBlICCard = res.data.myModel.total
                    this.cardBlacklist = res.data.myModel.data
                    this.cardBlacklistLoading = false
                })
            },
            selsBlICCardChange: function (sels) {
                this.selsBlICCard = sels;
            },
            //批量删除
            batchRemoveBlICCard: function () {
                let ids = this.selsBlICCard.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.cardBlacklistLoading = true
                    let para = { ids: ids }
                    apiBatchRemoveBlICCard(para).then((res) => {
                        this.cardBlacklistLoading = false
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.getICCardBlacklist(this.devCurrSel)
                    });
                }).catch(() => {

                });
            },
            //显示添加界面
            handleBlICCardAdd: function () {
                this.addFormBlICCardVisible = true
                this.iccardLoading = true
                apiGetICCardList().then((res) => {
                    this.iccardLoading = false
                    this.addFormBlICCardList = res.data.myModel
                })
            },
            handleCurrentChangeBlICCard(val) {
                this.pageBlICCard = val;
                this.getICCardBlacklist(this.devCurrSel)
            },
            //删除IC卡黑名单列表项
            handleDelBlICCard: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.cardBlacklistLoading = true;
                    let para = { id: row.id };
                    apiRemoveBlacklistICCard(para).then((res) => {
                        this.cardBlacklistLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getICCardBlacklist(this.devCurrSel)
                    });
                }).catch(() => {

                });
            },
            selsICCardChange: function (sels) {
                this.selsICCard = sels;
            },
            addICCardToBl: function () {
                let estateId = this.deviceList[this.devCurrSel].estateId
                let deviceId = this.devCurrSel
                let listBlICCard = this.selsICCard.map(function (item) {
                    return {
                        estateId: estateId,
                        deviceId: deviceId,
                        iccardId: item.id
                    }
                })
                this.addFormBlICCardLoading = true
                console.log("listBlICCard 0: estateId=" + listBlICCard[0].estateId +
                            " deviceId=" + listBlICCard[0].deviceId +
                            " iccardId=" + listBlICCard[0].iccardId)
                apiBatchAddICCardToBlacklist(listBlICCard).then((res) => {
                    this.addFormBlICCardLoading = false
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.addFormBlICCardVisible = false
                    this.getICCardBlacklist(this.devCurrSel)
                })
            },



            // 人脸黑名单
            searchFaceBlacklistPage: function () {
                this.getFaceBlacklist(this.devCurrSel)
            },

            getFaceBlacklist: function (deviceId) {
                console.log("deviceId:" + deviceId)
                this.faceBlacklistLoading = true
                let para = {
                    page: this.pageBlFace,
                    count: 10,
                    filter: this.filtersBlacklistFace.name,
                    deviceId: deviceId
                };
                apiGetBlacklistFacePage(para).then((res) => {
                    this.totalBlFace = res.data.myModel.total
                    this.faceBlacklist = res.data.myModel.data
                    this.faceBlacklistLoading = false
                    this.faceBlacklist.forEach( face => {
                        face.webAccessName = API_HOST + face.webAccessName
                    })
                })
            },
            selsBlFaceChange: function (sels) {
                this.selsBlFace = sels;
            },
            //批量删除
            batchRemoveBlFace: function () {
                let ids = this.selsBlFace.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.faceBlacklistLoading = true
                    let para = { ids: ids }
                    apiBatchRemoveBlFace(para).then((res) => {
                        this.faceBlacklistLoading = false
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.getFaceBlacklist(this.devCurrSel)
                    });
                }).catch(() => {

                });
            },
            //显示添加界面
            handleBlFaceAdd: function () {
                this.addFormBlFaceVisible = true
                this.faceLoading = true
                apiGetFaceList().then((res) => {
                    this.faceLoading = false
                    this.addFormBlFaceList = res.data.myModel
                    this.addFormBlFaceList.forEach( face => {
                        face.webAccessName = API_HOST + face.webAccessName
                    })
                })
            },
            handleCurrentChangeBlFace(val) {
                this.pageBlFace = val;
                this.getFaceBlacklist(this.devCurrSel)
            },
            //删除人脸黑名单列表项
            handleDelBlFace: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.faceBlacklistLoading = true;
                    let para = { id: row.id };
                    apiRemoveBlacklistFace(para).then((res) => {
                        this.faceBlacklistLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getFaceBlacklist(this.devCurrSel)
                    });
                }).catch(() => {

                });
            },
            selsFaceChange: function (sels) {
                this.selsFace = sels;
            },
            addFaceToBl: function () {
                let estateId = this.deviceList[this.devCurrSel].estateId
                let deviceId = this.devCurrSel
                let listBlFace = this.selsFace.map(function (item) {
                    return {
                        estateId: estateId,
                        deviceId: deviceId,
                        faceId: item.id
                    };
                });
                this.addFormBlFaceLoading = true
                apiBatchAddFaceToBlacklist(listBlFace).then((res) => {
                    this.addFormBlFaceLoading = false
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.addFormBlFaceVisible = false
                    this.getFaceBlacklist(this.devCurrSel)
                })
            },
        },
        mounted() {
            this.getDevices();
        }
    };

</script>

<style scoped>
    .el-table__body tr.current-row>td{
        background-color: #fdf3ea;
        color: #f19944;
    }

    .el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: #fdf3ea;
        color: #f19944;
    }
</style>
