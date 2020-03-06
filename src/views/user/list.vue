<template>
  <el-dialog title="门禁信息" :visible="visibleGuard" class="list-modal">
    <el-table :data="list" highlight-current-row v-loading="listLoading" width="1200">
      <el-table-column
        property="srcTs"
        label="时间"
        width="110"
        sortable
        :formatter="formatTime"
        align="center"
      ></el-table-column>
      <el-table-column property="lockCat" label="类型" width="120" sortable align="center"></el-table-column>
      <el-table-column property="media" label="介质" width="120" sortable align="center"></el-table-column>
      <el-table-column property="userName" label="姓名" width="120" sortable align="center"></el-table-column>
      <el-table-column property="homeName" label="住家" width="180" sortable align="center"></el-table-column>
      <el-table-column property="deviceName" label="设备" width="180" sortable align="center"></el-table-column>
      <el-table-column
        property="envTemp"
        label="气温(℃)"
        width="120"
        sortable
        align="center"
        v-if="showTemp"
      ></el-table-column>
      <el-table-column
        property="humanTemp"
        label="体温(℃)"
        width="120"
        sortable
        align="center"
        v-if="showTemp"
      ></el-table-column>
      <el-table-column prop="listPictureName" label="拍照" width="160" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.listPictureName === null || scope.row.listPictureName.length === 0">无</div>
          <div v-else>
            <el-button size="small" @click="handleViewPicture(scope.$index, scope.row)">查看</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="video" label="录像" width="160" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.listVideoName === null || scope.row.listVideoName.length === 0">无</div>
          <div v-else>
            <el-button size="small" @click="handleViewVideo(scope.$index, scope.row)">查看</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="toggleVisible">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script >
import Vue from "vue";
import util from "../../common/js/util";
import { gateEvents } from "../../api/api";
export default {
  props: {
    visibleGuard: false,
    aliaId: 0
  },
  data() {
    return {
      list: [],
      showTemp: true,
      listLoading: false
    };
  },
  watch: {
    visibleGuard(newData) {
      if (newData === true) {
        this.getQuery();
      }
    }
  },
  created() {
    console.log(this.userId);
  },
  methods: {
    getQuery() {
      this.listLoading = true;
      gateEvents({ aliaId: this.aliaId }).then(({ data = {} }) => {
        // this.total = res.data.myModel.total || 100;
        this.list = data.myModel;
        this.listLoading = false;
      });
    },
    formatTime: function(row, column) {
      return util.formatDate.format(
        new Date(row.srcTs * 1000),
        "yyyy-MM-dd hh:mm:ss"
      );
    },
    toggleVisible() {
      this.$emit("toggleVisibleGuard");
    },
    sure() {}
  }
};
</script>
<style >
.list-modal :global(.el-dialog--small) {
  width: 1400px;
}
</style>