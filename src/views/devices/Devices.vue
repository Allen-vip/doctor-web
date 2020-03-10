<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getDevices">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" @click="copyURL" class="btn"
            >复制链接</el-button
          > -->
          <button :data-clipboard-text="copyData" class="btn" @click="copyURL">
            复制用户注册地址
          </button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="devices"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column
        type="selection"
        width="35"
        align="center"
      ></el-table-column>
      <el-table-column type="index" width="60" align="center"></el-table-column>
      <el-table-column
        prop="buildingNum"
        label="楼栋"
        width="120"
        sortable
        align="center"
      ></el-table-column>
      <el-table-column
        prop="unitNum"
        label="单元"
        width="120"
        sortable
        align="center"
      ></el-table-column>
      <el-table-column
        prop="aliaId"
        label="设备ID"
        width="150"
        sortable
        align="center"
      ></el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="120"
        :formatter="formatType"
        sortable
        align="center"
      ></el-table-column>
      <el-table-column
        prop="macAddr"
        label="MAC地址"
        width="180"
        sortable
        align="center"
      ></el-table-column>
      <el-table-column
        prop="connState"
        label="在线状态"
        width="180"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        property="accountNickName"
        label="账号"
        width="120"
        sortable
        align="center"
        v-if="isAdmin === 1"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="handleDel(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button
        type="danger"
        @click="batchRemove"
        :disabled="this.sels.length === 0"
        >批量删除</el-button
      >
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="10"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog
      title="编辑"
      v-model="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editForm"
        label-width="80px"
        :rules="editFormRules"
        ref="editForm"
      >
        <el-form-item label="楼栋" prop="buildingNum">
          <el-input
            v-model="editForm.buildingNum"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="单元" prop="unitNum">
          <el-input v-model="editForm.unitNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备ID" prop="aliaId">
          <el-select
            v-model="editForm.aliaId"
            filterable
            placeholder="请选择"
            style="width:50%"
          >
            <el-option
              v-for="ptuid in this.candidate_ptuids"
              :key="ptuid"
              :label="ptuid"
              :value="ptuid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="editForm.type">
            <el-radio class="radio" :label="1">单元机</el-radio>
            <el-radio class="radio" :label="0">门口机</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="MAC地址" prop="macAddr">
          <el-input v-model="editForm.macAddr" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="editSubmit"
          :loading="editLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog
      title="新增"
      v-model="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
        ref="addForm"
      >
        <el-form-item label="楼栋" prop="buildingNum">
          <el-input
            v-model="addForm.buildingNum"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="单元" prop="unitNum">
          <el-input v-model="addForm.unitNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备ID" prop="aliaId">
          <el-select
            v-model="addForm.aliaId"
            filterable
            placeholder="请选择"
            style="width:50%"
          >
            <el-option
              v-for="ptuid in this.candidate_ptuids"
              :key="ptuid"
              :label="ptuid"
              :value="ptuid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="addForm.type">
            <el-radio class="radio" :label="1">单元机</el-radio>
            <el-radio class="radio" :label="0">门口机</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="MAC地址" prop="macAddr">
          <el-input v-model="addForm.macAddr" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="addSubmit"
          :loading="addLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import {
  getDeviceListPage,
  removeDevice,
  batchRemoveDevice,
  updateDevice,
  addDevice
} from "../../api/api";
import Clipboard from "clipboard";
import { apiGetPtuidList, apiGetPtuidCandidateList } from "../../api/api";

export default {
  data() {
    return {
      filters: {
        name: ""
      },
      copyData: "",
      isAdmin: 0,
      devices: [],
      ptuids: [],
      candidate_ptuids: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        buildingNum: "",
        unitNum: "",
        type: 0,
        mac: "",
        aliaId: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: ""
      }
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex === 1 ? "男" : row.sex === 0 ? "女" : "未知";
    },
    formatType: function(row, column) {
      return row.type === 0 ? "门口机" : row.type === 1 ? "单元机" : "未知";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getDevices();
    },
    getPtuidList() {
      let accId = sessionStorage.getItem("accountId");
      let para = { accountId: parseInt(accId) };
      apiGetPtuidCandidateList(para).then(res => {
        if (res.data.myModel.state == 0) {
          this.ptuids = res.data.myModel.listPtuid || [];
          console.log("ptuids:" + JSON.stringify(this.ptuids));
        }
      });
    },
    getDevices() {
      let para = {
        page: this.page,
        count: 10,
        filter: this.filters.name
      };
      this.listLoading = true;

      console.log("call getDeviceListPage");
      getDeviceListPage(para).then(res => {
        console.log("res.status:" + res.statusText);
        this.total = res.data.myModel.total;
        this.devices = res.data.myModel.data;
        this.listLoading = false;
        this.devices.forEach(device => {
          this.ptuids.forEach(function(ptuid, index, arr) {
            if (ptuid === device.aliaId) {
              arr.splice(index, 1);
            }
          });
          if (device.connOnline == 1) {
            device.connState = "在线";
            console.log("connBegin:" + device.connBegin);
            device.connState +=
              " | 登录时间：" +
              util.formatDate.format(
                new Date(device.connBegin * 1000),
                "yyyy-MM-dd hh:mm:ss"
              );
            device.connState += " | 登录IP：" + device.connIp;
          } else {
            device.connState = "不在线";
          }
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
          //NProgress.start();
          let para = { id: row.id };
          removeDevice(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getPtuidList();
            this.getDevices();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      let para = { accountId: row.accountId };
      apiGetPtuidCandidateList(para).then(res => {
        if (res.data.myModel.state == 0) {
          this.ptuids = res.data.myModel.listPtuid;
          console.log("ptuids:" + JSON.stringify(this.ptuids));
          this.candidate_ptuids = this.ptuids.concat(row.aliaId);
        }
      });
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        buildingNum: "",
        unitNum: "",
        type: 0,
        macAddr: "",
        aliaId: ""
      };
      this.candidate_ptuids = [].concat(this.ptuids);
      this.addForm.aliaId = this.candidate_ptuids[0];
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {})
            .then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.editForm);
              para.estateId = 0;
              updateDevice(para).then(res => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.getPtuidList();
                this.getDevices();
              });
            })
            .catch(() => {
              this.editLoading = false;
              this.$refs["editForm"].resetFields();
            });
        }
      });
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
              addDevice(para).then(res => {
                this.addLoading = false;
                //NProgress.done();
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getPtuidList();
                this.getDevices();
              });
            })
            .catch(() => {
              this.addLoading = false;
              this.$refs["addForm"].resetFields();
            });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
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
          batchRemoveDevice(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getPtuidList();
            this.getDevices();
          });
        })
        .catch(() => {});
    },
    copyURL() {
      var ids = [];
      this.sels.map(item => {
        if (item.aliaId) {
          ids.push(item.aliaId);
        }
      });
      if (ids.length === 0) {
        this.$message.error("请先选择设备");
        return "";
      }
      let url = `http://rlcwuser.ehteknology.com:8000/entrance-guard/entrance-guard-h5/index.html#/login?deviceIds=${ids.join(
        ","
      )}`;
      this.copyData = url;
      var clipboard = new Clipboard(".btn");
      clipboard.on("success", () => {
        this.$message.success("复制成功");
      });
    }
  },
  mounted() {
    this.getPtuidList();
    this.getDevices();
    this.isAdmin = parseInt(sessionStorage.getItem("isAdmin"));
  }
};
</script>

<style scoped>
.el-table .cell {
  white-space: pre-line;
}
.btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c4c4c4;
  color: #1f2d3d;
  margin: 0;
  padding: 10px 15px;
  border-radius: 4px;
  color: #fff;
  background-color: #20a0ff;
  border-color: #20a0ff;
  height: 36px;
  outline: none;
}
</style>
