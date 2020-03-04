<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item label="年龄段搜索">
          <el-col :span="11">
            <el-input-number v-model="filters.ageStart" controls-position="right" :min="1"></el-input-number>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input-number v-model="filters.ageEnd" controls-position="right" :min="1"></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers" style="marginLeft:20px">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="toggleVisibleModal">医嘱</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-checkbox v-model="setBlack" @change="blackCheckChange">黑名单</el-checkbox>
        </el-form-item>-->
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55" align="left"></el-table-column>
      <!-- <el-table-column type="index" width="40" align="center"></el-table-column> -->
      <el-table-column property="name" label="姓名" sortable align="center"></el-table-column>
      <el-table-column property="age" label="年龄" width="100" sortable align="center"></el-table-column>
      <el-table-column property="gender" label="性别" sortable align="center" :formatter="formatSex"></el-table-column>

      <!-- <el-table-column property="buildingNum" label="楼栋" width="90" sortable align="center"></el-table-column>
      <el-table-column property="unitNum" label="单元" width="90" sortable align="center"></el-table-column>
      <el-table-column property="roomNum" label="房间号" width="110" sortable align="center"></el-table-column>
      <el-table-column
        property="type"
        label="类型"
        width="90"
        sortable
        align="center"
        :formatter="formatType"
      ></el-table-column>-->
      <el-table-column property="identityCardNum" label="身份证" width="300" sortable align="center"></el-table-column>
      <!-- <el-table-column property="validDevice" label="通行设备" width="120" sortable align="center"></el-table-column> -->
      <!-- <el-table-column
        property="accountNickName"
        label="账号"
        width="120"
        sortable
        align="center"
        v-if="isAdmin===1"
      ></el-table-column>-->
      <el-table-column prop="url" label="照片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.url" min-width="80" height="80" align="center" />
        </template>
      </el-table-column>
      <!-- <el-table-column
        property="blackList"
        label="黑名单"
        width="110"
        sortable
        align="center"
        :formatter="formatBlackList"
      ></el-table-column>-->
      <el-table-column label="操作" width="220" align="center">
        <template scope="scope">
          <el-button size="small" @click="showGuard(scope.$index, scope.row)">门禁信息</el-button>
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="10"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="editForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="editForm.age" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="居住地址" prop="address">
          <el-input v-model="editForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="楼栋" prop="buildingNum">
          <el-input v-model="editForm.buildingNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="单元" prop="unitNum">
          <el-input v-model="editForm.unitNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="房间号" prop="roomNum">
          <el-input v-model="editForm.roomNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择类型">
            <el-option label="业主" :value="0"></el-option>
            <el-option label="访客" :value="1"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="身份证" prop="identityCardNum">
          <el-input v-model="editForm.identityCardNum" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="照片" prop="fnOnServer">
          <el-input v-model="editForm.fnOnServer" v-show="false"></el-input>
          <el-upload
            list-type="picture-card"
            class="avatar-uploader"
            :class="{disabled:uploadDisabled}"
            ref="faceUpload"
            :action="uploadAction"
            accept="image/jpeg, image/png"
            :data="faceUploadruleForm"
            :before-upload="handleFaceBeforeUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-exceed="onExceed"
            :on-change="fileChange"
            :limit="1"
            :multiple="false"
            :auto-upload="false"
            :headers="this.headers"
            :on-success="handleSuccess"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="submitUpload"
            >上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过4MB</div>
          </el-upload>
        </el-form-item>

        <!-- <el-form-item label="登记设备">
          <el-transfer
            v-model="selDevices"
            :props="{ key: 'id', label: 'fullName' }"
            :data="this.candidateDevices"
            :titles="['待选', '已选']"
            :button-texts="['移除', '选择']"
          ></el-transfer>
        </el-form-item>
        <el-form-item label="黑名单">
          <el-checkbox-group v-model="blackList">
            <el-checkbox label="1">拒开</el-checkbox>
            <el-checkbox label="2">报警</el-checkbox>
          </el-checkbox-group>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editCancel">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="添加" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="addForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="addForm.age" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="居住地址" prop="age">
          <el-input v-model="addForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="楼栋" prop="buildingNum">
          <el-input v-model="addForm.buildingNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="单元" prop="unitNum">
          <el-input v-model="addForm.unitNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="房间号" prop="roomNum">
          <el-input v-model="addForm.roomNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择类型">
            <el-option label="业主" :value="0"></el-option>
            <el-option label="访客" :value="1"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="身份证" prop="identityCardNum">
          <el-input v-model="addForm.identityCardNum" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="图像" prop="fnOnServer">
          <el-input v-model="addForm.fnOnServer" v-show="false"></el-input>
          <el-upload
            list-type="picture-card"
            class="avatar-uploader"
            :class="{disabled:uploadDisabled}"
            ref="faceUpload"
            :action="uploadAction"
            accept="image/jpeg, image/png"
            :data="faceUploadruleForm"
            :before-upload="handleFaceBeforeUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-exceed="onExceed"
            :on-change="fileChange"
            :limit="1"
            :multiple="false"
            :auto-upload="false"
            :headers="this.headers"
            :on-success="handleSuccess"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="submitUpload"
            >上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过4MB</div>
          </el-upload>
        </el-form-item>

        <!-- <el-form-item label="登记设备">
          <el-transfer
            v-model="addForm.selDevices"
            :props="{ key: 'id', label: 'fullName' }"
            :data="this.candidateDevices"
            :titles="['待选', '已选']"
            :button-texts="['移除', '选择']"
          ></el-transfer>
        </el-form-item>
        <el-form-item label="黑名单">
          <el-checkbox-group v-model="blackList">
            <el-checkbox label="1">拒开</el-checkbox>
            <el-checkbox label="2">报警</el-checkbox>
          </el-checkbox-group>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addCancel">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 医嘱 -->
    <Advice :visibleAdvice="visibleAdvice" @toggleVisibleModal="toggleVisibleModal" />
    <!-- 门禁信息列表 -->
    <List :visibleGuard="visibleGuard" :userId="userId" @toggleVisibleGuard="toggleVisibleGuard" />
  </section>
</template>

<script>
import util from "../../common/js/util";
import {
  apiGetUserPage,
  apiRemoveUser,
  apiBatchRemoveUser,
  apiUpdateUser,
  apiAddUser
} from "../../api/api";
import { apiGetUserList, getDeviceList, apiGenUserId } from "../../api/api";
import { API_NEW_VERSION, API_HOST } from "../../api/api";
import Advice from "./advice";
import List from "./list";
export default {
  components: {
    Advice,
    List
  },
  data() {
    return {
      headers: {
        Authorization: sessionStorage.getItem("token")
      },
      filters: {
        name: "",
        ageStart: 0,
        ageEnd: 0
      },
      isAdmin: 0,
      setBlack: false,
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列
      devices: [],
      candidateDevices: [],
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      visibleAdvice: false,
      visibleGuard: false,
      userId: 0,
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        gender: [
          {
            required: true,
            message: "请选择性别",
            trigger: "blur",
            type: "number"
          }
        ],
        buildingNum: [
          { required: true, message: "请输入楼栋", trigger: "blur" }
        ],
        unitNum: [{ required: true, message: "请输入单元", trigger: "blur" }],
        roomNum: [{ required: true, message: "请输入房间号", trigger: "blur" }],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: "blur",
            type: "number"
          }
        ],
        identityCardNum: [
          { required: true, message: "请输入身份证号", trigger: "blur" }
        ]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: "",
        gender: "",
        buildingNum: "",
        unitNum: "",
        roomNum: "",
        type: "",
        identityCardNum: "",
        aliaId: "",
        fnOnServer: "",
        faceImgB64: "",
        blackListType: 0
      },
      selDevices: [],
      blackList: [1, 2],
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        gender: [
          {
            required: true,
            message: "请选择性别",
            trigger: "blur",
            type: "number"
          }
        ],
        buildingNum: [
          { required: true, message: "请输入楼栋", trigger: "blur" }
        ],
        unitNum: [{ required: true, message: "请输入单元", trigger: "blur" }],
        roomNum: [{ required: true, message: "请输入房间号", trigger: "blur" }],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: "blur",
            type: "number"
          }
        ],
        identityCardNum: [
          { required: true, message: "请输入身份证号", trigger: "blur" }
        ]
      },
      //新增界面数据
      addForm: {
        id: 0,
        name: "",
        gender: "",
        buildingNum: "",
        unitNum: "",
        roomNum: "",
        type: "",
        identityCardNum: "",
        aliaId: "",
        fnOnServer: "",
        faceImgB64: "",
        blackListType: 0,
        selDevices: []
      },

      faceFileList: [],
      faceUploadruleForm: {
        usage: "faceul"
      },
      uploadDisabled: false,
      uploadAction: API_NEW_VERSION + "/busi/file_upload"
    };
  },
  methods: {
    formatType: function(row, column) {
      return row.type === 1 ? "访客" : row.type === 0 ? "业主" : "未知";
    },
    formatSex: function(row, column) {
      return row.gender === 1 ? "男" : row.gender === 0 ? "女" : "未知";
    },
    formatBlackList: function(row, column) {
      return row.blackListType == 0
        ? "否"
        : row.blackListType == 1
        ? "拒开"
        : row.blackListType == 2
        ? "报警"
        : row.blackListType == 3
        ? "拒开，报警"
        : "未定义";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    toggleVisibleModal() {
      this.visibleAdvice = !this.visibleAdvice;
    },
    toggleVisibleGuard(index, row) {
      this.visibleGuard = !this.visibleGuard;
    },
    showGuard(index, row) {
      this.userId = row.id;
      this.toggleVisibleGuard();
    },
    getDevices: function() {
      let accId = sessionStorage.getItem("accountId");
      let para = { accountId: parseInt(accId) };
      getDeviceList(para).then(res => {
        this.devices = res.data.myModel;
        this.devices.forEach(device => {
          device.fullName = device.buildingNum + "栋" + device.unitNum + "单元";
        });
      });
    },
    getDeviceName: function(id) {
      let name = "无";
      this.devices.forEach(device => {
        if (device.id == id) {
          name = "" + device.buildingNum + "栋";
          if (device.unitNum !== "") {
            name = name + device.unitNum + "单元";
          }
          return name;
        }
      });
      return name;
    },
    //获取用户列表
    getUsers() {
      let para = {
        page: this.page,
        count: 10,
        filter: this.filters.name,
        black: this.setBlack
      };
      this.listLoading = true;
      apiGetUserPage(para).then(res => {
        this.total = res.data.myModel.total;
        this.users = res.data.myModel.data;
        this.listLoading = false;

        this.users.forEach(user => {
          user.validDevice = "";
          let newIds = "";
          if (user.deviceIds === "" || user.deviceIds === null) {
            return [];
          }
          user.deviceIds.split(",").forEach(id => {
            let name = this.getDeviceName(id);
            if (name !== "无") {
              if (user.validDevice.length != 0) {
                user.validDevice += " , ";
                newIds += ",";
              }
              user.validDevice += this.getDeviceName(id);
              newIds += id;
            }
          });
          if (user.validDevice.length == 0) {
            user.validDevice = "无";
          }
          user.deviceIds = newIds;
          user.url = API_HOST + user.webAccessName;
        });
      });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = { id: row.id };
          apiRemoveUser(para).then(res => {
            this.listLoading = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUsers();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);

      if (row.deviceIds.length > 0) {
        this.selDevices = row.deviceIds.split(",").map(item => {
          return +item;
        });
      } else {
        this.selDevices = [];
      }
      this.blackList = [];
      let action = row.blackListType;
      let factor = 1;
      while (action != 0) {
        this.blackList.push("" + (action & 0x01) * factor);
        factor <<= 1;
        action >>= 1;
      }
      let newDevices = [];
      this.devices.forEach(device => {
        if (device.accountId === row.accountId) {
          newDevices.push(device);
        }
      });
      this.candidateDevices = newDevices;
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        id: 0,
        name: "",
        gender: "",
        buildingNum: "",
        unitNum: "",
        roomNum: "",
        type: "",
        identityCardNum: "",
        aliaId: "",
        fnOnServer: "",
        deviceIds: "",
        blackListType: 0,
        selDevices: []
      };
      var nowDate = new Date();
      console.log("nowDate:" + nowDate);
      this.addForm.aliaId = nowDate.getTime();
      console.log("aliaId:" + this.addForm.aliaId);
      let para = {};
      apiGenUserId(para).then(res => {
        this.addForm.aliaId = res.data.myModel;
        console.log("this.addForm.aliaId:" + this.addForm.aliaId);
      });
      this.selDevices = [];
      this.blackList = [];
      let newDevices = [];
      let accId = sessionStorage.getItem("accountId");
      this.devices.forEach(device => {
        if (device.accountId === parseInt(accId)) {
          newDevices.push(device);
        }
      });
      this.candidateDevices = newDevices;
    },
    getNowFormatDate: function() {
      //获取当前时间
      var date = new Date();
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var strHour =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var strMin = date.getMinutes();
      var currentdate =
        date.getFullYear() +
        month +
        strDate +
        " " +
        date.getHours() +
        date.getMinutes() +
        date.getSeconds();
      return currentdate;
    },
    //编辑
    editSubmit: function() {
      console.log("editForm.type:" + this.editForm.type);
      console.log("editForm.gender:" + this.editForm.gender);

      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {})
            .then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.editForm);
              para.blackListType = 0;
              this.blackList.forEach(item => {
                para.blackListType += +item;
              });
              para.estateId = 1;
              if (this.selDevices.length > 0) {
                para.deviceIds = this.selDevices.join(",");
              } else {
                para.deviceIds = "";
              }
              apiUpdateUser(para).then(res => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.uploadDisabled = false;
                this.$refs.faceUpload.clearFiles();
                this.getUsers();
              });
            })
            .catch(() => {
              this.editLoading = false;
              this.$refs["editForm"].resetFields();
            });
        }
      });
    },
    editCancel: function() {
      this.editFormVisible = false;
      this.uploadDisabled = false;
      this.$refs.faceUpload.clearFiles();
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {})
            .then(() => {
              this.addLoading = true;
              //NProgress.start();

              let para = Object.assign({}, this.addForm);
              console.log("para:" + JSON.stringify(para));
              para.blackListType = 0;
              this.blackList.forEach(item => {
                para.blackListType += +item;
              });
              para.estateId = 1;
              if (this.addForm.selDevices.length > 0) {
                console.log(
                  "len:" +
                    this.addForm.selDevices.length +
                    " " +
                    this.addForm.selDevices
                );
                para.deviceIds = this.addForm.selDevices.join(",");
              } else {
                para.deviceIds = "";
              }

              console.log("para:" + JSON.stringify(para));
              apiAddUser(para).then(res => {
                this.addLoading = false;
                //NProgress.done();
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.uploadDisabled = false;
                this.$refs.faceUpload.clearFiles();
                this.getUsers();
              });
            })
            .catch(() => {
              console.log("apiAddUser catch:");
              this.addLoading = false;
              this.$refs["addForm"].resetFields();
            });
        }
      });
    },

    addCancel: function() {
      this.addFormVisible = false;
      this.uploadDisabled = false;
      this.$refs.faceUpload.clearFiles();
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    blackCheckChange: function(check) {
      this.getUsers();
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { ids: ids };
          console.log("para:" + JSON.stringify(para));
          apiBatchRemoveUser(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUsers();
          });
        })
        .catch(() => {});
    },

    submitUpload() {
      console.log("submitUpload");
      this.$refs.faceUpload.submit();
    },
    handleFaceBeforeUpload(file) {
      const isIMAGE = file.type === "image/jpeg" || "image/png";
      const isLt4M = file.size / 1024 / 1024 < 4;
      console.log(
        "faceFileList:" + this.faceFileList + " len:" + this.faceFileList.length
      );
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt4M) {
        this.$message.error("上传文件大小不能超过 4MB!");
      }
      return isIMAGE && isLt4M;
    },
    handleRemove(file, fileList) {
      this.uploadDisabled = fileList.length > 0 ? 1 : 0;
    },
    handlePreview(file) {
      console.log("preview" + file.url);
    },
    handleSuccess(res, file, fileList) {
      if (res.myModel.state === 0) {
        this.editForm.fnOnServer = res.myModel.fn;
        this.editForm.faceImgB64 = "";
        this.addForm.fnOnServer = res.myModel.fn;
        console.log("this.editForm.fnOnServer:" + this.editForm.fnOnServer);
        this.$message({
          message: "上传成功！",
          type: "success"
        });
      } else {
        this.$refs.faceUpload.clearFiles();
        this.$message({
          message: res.myModel.msg,
          type: "error"
        });
      }
    },
    onExceed(files, fileList) {
      this.$message({
        type: "info",
        message: "最多只能上传一个图片",
        duration: 6000
      });
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      this.uploadDisabled = fileList.length > 0 ? 1 : 0;
    }
  },
  mounted() {
    this.getDevices();
    this.getUsers();
    this.isAdmin = parseInt(sessionStorage.getItem("isAdmin"));
  }
};
</script>

<style scoped>
</style>
