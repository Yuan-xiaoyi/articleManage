<template>
  <div>
    <el-table
      :data="
        tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
      "
      height="calc(100% - 48px)"
      style="width: 100%; margin-bottom: 8px"
    >
      <el-table-column
        v-for="(feild, index) in tableFeilds"
        :key="index"
        :label="feild.label"
        :min-width="feild.width ? feild.width : '100%'"
        align="center"
      >
        <template slot-scope="scope">
          <div
            v-if="
              feild.type &&
              (feild.type === 'status&btn' || feild.type === 'status')
              && scope.row[feild.prop] != '' && scope.row[feild.prop] != undefined
            "
          >
            <!-- <span>{{  }}</span> -->
            <el-tag
              :class="{ status: feild.type === 'status&btn' }"
              :type="
                scope.row[feild.prop] == 0 || scope.row[feild.prop] == 1
                  ? 'info'
                  : scope.row[feild.prop] == 6
                  ? 'success'
                  : scope.row[feild.prop] == 3 || scope.row[feild.prop] == 4
                  ? 'warning'
                  : 'primary'
              "
              disable-transitions
              >{{ judge(scope.row[feild.prop]) }}</el-tag
            >

            <el-button
              v-if="feild.type === 'status&btn'"
              :type="feild.btnStyle"
              plain
              size="mini"
              @click="getBack(feild.btnEvent, scope.row)"
              >{{ feild.btnLabel }}</el-button
            >
          </div>

          <div v-if="feild.type && feild.type === 'pay_status'">
            <el-tag
              :class="{ status: feild.type === 'status&btn' }"
              :type="scope.row[feild.prop] == 0 ? '' : 'success'"
              disable-transitions
              >{{ judge2(scope.row[feild.prop]) }}</el-tag
            >
          </div>

          <div v-if="feild.type && feild.type === 'btn'">
            <el-button
              :type="feild.btnStyle"
              plain
              size="mini"
              @click="getBack(feild.btnEvent, scope.row)"
              >{{ feild.btnLabel }}</el-button
            >
          </div>

          <div v-if="feild.type && feild.type === 'link'">
            <!-- ?????? -->
            <a
              href="javascript:0"
              @click="getBack(feild.btnEvent, scope.row)"
              style="text-decoration: none"
              >{{ feild.linkLabel }}</a
            >
          </div>

          <span v-if="feild.type && feild.type === 'textarea'" class="textarea">
            <el-input
              type="textarea"
              :rows="
                scope.row[feild.prop].length / 30 <= 4
                  ? scope.row[feild.prop].length / 30 + 1
                  : 4
              "
              v-model="scope.row[feild.prop]"
              readonly
            ></el-input>
          </span>

          <span v-if="feild.type && feild.type === 'writerName'">
            {{ judge3(scope.row[feild.prop]) }}
          </span>

          <span v-if="!feild.type">{{ scope.row[feild.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-show="needBottom" 
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="float: left"
    ></el-pagination>
    <el-button v-if="needBottom" type="primary" @click="exportExcel" style="float: right">????????????</el-button>
    
    <el-dialog
      title="????????????"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
      style="height: 80%; overflow-y: hidden"
    >
      <el-table :data="fileTableData" height="430px" style="width: 100%">
        <el-table-column
          prop="text"
          label="????????????"
          width=""
          align="center"
        ></el-table-column>
        <el-table-column
          prop="file"
          label="?????????"
          width="350"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="date"
          label="????????????"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column label="??????" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="download(scope.row)"
              >??????</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-row style="margin-top: 10px">
        <!-- ?????? -->
        <el-button
          v-if="role == 'writer' && orderStatus == 2"
          type="primary"
          @click="acceptOrder"
          >????????????</el-button
        >
        <el-button
          v-if="role == 'writer' && (orderStatus == 4 || orderStatus == 3)"
          size="small"
          type="primary"
          @click="uploadFile"
          >????????????</el-button
        >
        <el-button
          v-if="role == 'writer' && orderStatus == 5"
          size="small"
          type="primary"
          @click="uploadFile"
          >????????????</el-button
        >
        <el-button
          v-if="
            role == 'writer' &&
            orderStatus != 6 &&
            orderStatus != 5 &&
            orderStatus != 2
          "
          type="danger"
          @click="giveUp"
          >????????????(??????12????????????)</el-button
        >

        <!-- ????????? -->
        <el-button
          v-if="role == 'admin' && (orderStatus == 4 || orderStatus == 3)"
          type="primary"
          @click="hurry"
          >??????</el-button
        >
        <el-button
          v-if="role == 'admin' && (orderStatus == 5 || orderStatus == 6)"
          type="warning"
          @click="backForModify"
          >????????????</el-button
        >
        <el-button
          v-if="role == 'admin' && orderStatus == 5"
          type="success"
          @click="endOrder"
          >????????????</el-button
        >
        <el-button
          v-if="role == 'admin' && orderStatus == 6 && settlementStatus != 1"
          type="primary"
          @click="settlement"
          >????????????</el-button
        >
        <el-button v-if="role == 'admin'" type="danger" @click="deleteOrder"
          >????????????</el-button
        >
      </el-row>
    </el-dialog>

    <el-dialog
      :title="modifyVisible ? '????????????' : '????????????'"
      :close-on-click-modal="false"
      :visible="modifyVisible || uploadVisible"
      width="50%"
      :before-close="handleClose2"
      style="height: 80%; overflow-y: hidden; margin-top: 15vh"
      class="uploadDialog"
    >
      <div style="margin-bottom: 10px; width: 100%; display: inline-flex">
        <span>???????????????</span>
        <el-input
          type="textarea"
          v-model="text"
          :rows="4"
          style="width: 90%"
        ></el-input>
      </div>
      <el-upload
        class="upload-demo"
        action=""
        :http-request="uploadMehod"
        :before-upload="beforeUpload"
        :on-preview="handlePreview"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        style="float: left; margin-bottom: 10px; width: 100%"
      >
        <el-button size="small" type="primary">????????????</el-button>
        <div slot="tip" class="el-upload__tip">
          ????????????doc/docx/pdf/txt/zip/rar??????
        </div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">??? ???</el-button>
        <el-button type="primary" @click="uploadFileConfirm">{{
          modifyVisible ? "????????????????????????" : "???????????????????????????"
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api_File from "../../../api/file";
import api_Order from "../../../api/order";
import api_User from "../../../api/user";
import { export_json_to_excel } from "../../../utils/excel/exportExcel";
export default {
  name: "yTable",
  props: {
    tableData: [],
    tableFeilds: [],
    needBottom: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      user_id: "",
      options: this.$store.state.orderStatus.orderStatus,
      options2: this.$store.state.orderStatus.settlement,
      currentPage: 1,
      pagesizes: [10, 50, 100, 200, 500],
      pagesize: 10,
      total: 0,
      role: "",
      orderStatus: 0,
      settlementStatus: 1,
      order_id: "",
      order_status: 0,
      text: "",
      isForConfirm: false,
      order_sn: "",
      dialogVisible: false,
      uploadVisible: false,
      modifyVisible: false,
      fileTableData: [],
      fileList: [],
      writerList: [],
    };
  },
  created() {
    if(this.$cookie.get('role') == "admin"){
      api_User.getUserList().then((res) => {
        this.writerList = res.page.list;
      });
    }
    let userInfo = this.$cookie.get('userInfo') && JSON.parse(this.$cookie.get('userInfo'))
    this.user_id = userInfo.userId
    if(!this.needBottom){
      this.pagesize = 10000000000000000000
    }
  },
  mounted() {
    this.total = this.tableData.length;
    // this.showTableData = this.tableData
  },
  watch: {
    tableData(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.total = newVal.length;
      }
    },
  },
  methods: {
    acceptOrder() {
      let pOrder = {
        id: this.order_id,
        status: 4,
        userId: this.user_id
      };
      api_Order
        .updateOrderStatus(pOrder)
        .then(() => {
          this.$message.success("?????????????????????");
          this.getNewOrder();
          this.dialogVisible = false;
        })
        .catch((e) => {
          this.$message.error(e.msg);
        });
      // api_Order.acceptOrder(this.order_sn).then(() => {
      //     this.$message.success("");
      //   })
      //   .catch((e) => {
      //     this.$message.error(e.msg);
      //   });
    },
    uploadFile() {
      this.uploadVisible = true;
    },
    giveUp() {},
    hurry() {},
    backForModify() {
      this.modifyVisible = true;
    },
    endOrder() {
      let pOrder = {
        id: this.order_id,
        status: 6,
      };
      api_Order
        .updateOrderStatus(pOrder)
        .then(() => {
          this.$message.success("????????????");
          this.getNewOrder();
          this.dialogVisible = false;
        })
        .catch((e) => {
          this.$message.error(e.msg);
        });
    },
    settlement() {
      let pOrder = {
        id: this.order_id,
        settlement: 1,
      };
      api_Order
        .updateOrderStatus(pOrder)
        .then(() => {
          this.$message.success("????????????");
          this.getNewOrder();
          this.dialogVisible = false;
        })
        .catch((e) => {
          this.$message.error(e.msg);
        });
    },
    deleteOrder() {
      api_Order
        .deleteOrder([this.order_id])
        .then(() => {
          this.$message.success("???????????????");
          this.dialogVisible = false;
          this.getNewOrder();
        })
        .catch((e) => {
          this.$message.error(e.msg);
        });
    },

    uploadFileConfirm() {
      if (this.fileList.length > 0 && this.text != "") {
        let param = {
          order_id: this.order_id,
          text: this.text,
        };
        // ??????????????????(??????order_id)
        api_File
          .addFileDetail(param)
          .then((result) => {
            // ?????????????????????????????????????????????
            let formData = new FormData();
            formData.append("file", this.fileList[0]);
            api_File
              .uploadOrderFile({ id: result.id, formData: formData })
              .then(() => {
                this.searchFile();
                if (this.uploadVisible) {
                  if (this.order_status != 5) {
                    // ??????????????????
                    // ?????????????????????????????????????????????
                    let pOrder = {
                      id: this.order_id,
                      status: 5,
                    };
                    api_Order
                      .updateOrderStatus(pOrder)
                      .then(() => {
                        this.uploadVisible = false;
                        this.dialogVisible = false;
                        this.$message.success("????????????????????????????????????");
                        this.getNewOrder();
                      })
                      .catch((e) => {
                        this.$message.error(e.msg);
                      });
                  } else {
                    this.dialogVisible = false;
                    this.$message.success("??????????????????");
                  }
                }
                if (this.modifyVisible) {
                  let pOrder = {
                    id: this.order_id,
                    status: 3,
                  };
                  api_Order
                    .updateOrderStatus(pOrder)
                    .then(() => {
                      this.modifyVisible = false;
                      this.dialogVisible = false;
                      this.$message.success("??????????????????");
                      this.getNewOrder();
                    })
                    .catch((e) => {
                      this.$message.error(e.msg);
                    });
                }
              })
              .catch((error) => {
                this.$message.error(error.msg);
              });
          })
          .catch((er) => {
            this.$message.error(er.msg);
          });
      } else {
        this.$message.info("??????????????????????????????????????????");
      }
    },
    cancel() {
      this.uploadVisible = false;
      this.modifyVisible = false;
    },

    // ???????????????????????????????????????
    getNewOrder() {
      this.$emit("getNewOrder", this.pagesize, this.currentPage);
    },
    getBack(btnEvent, row) {
      this.$emit("rowOperation", btnEvent, row);

      if (btnEvent == "detail") {
        this.role = this.$cookie.get("role");
        this.orderStatus = row.status;
        this.settlementStatus = row.settlement
        this.order_id = row.id;
        (this.order_status = row.status),
          (this.order_sn = row.orderSn),
          (this.dialogVisible = true);
        this.searchFile();
      }
    },
    searchFile() {
      api_File
        .searchFile(this.order_id)
        .then((res) => {
          this.fileTableData = res.files;
          console.log(res);
        })
        .catch((e) => {
          this.$message.error(e.msg);
        });
    },
    download(row) {
      api_File
        .downloadOrderFile(row.file)
        .then((res) => {
          let blob = new Blob([res]);
          console.log(blob);
          let downloadUrl = window.URL.createObjectURL(blob);
          let anchor = document.createElement("a");
          //anchor.style.display = "none";
          anchor.href = downloadUrl;
          // ?????????filename ???????????????????????????????????????
          anchor.setAttribute("download", row.file);
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
        })
        .catch((e) => {
          this.$message.error(e.msg);
        });
    },

    judge(val) {
      if (val == 0 || val == 1) {
        return "?????????";
      } else {
        let item = undefined;
        this.options.forEach((e) => {
          if (e.value == val) {
            item = e;
          }
        });
        if (item && item.label) {
          return item.label;
        } else {
          return "";
        }
      }
    },
    judge2(val) {
      let item = undefined;
      this.options2.forEach((e) => {
        if (e.value == val) {
          item = e;
        }
      });
      if (item && item.label) {
        return item.label;
      } else {
        return "";
      }
    },
    judge3(val) {
      if (val) {
        let item = this.writerList.find((writer) => writer.userId == val);
        if (item != undefined) {
          return item.username;
        } else {
          return "";
        }
      } else {
        return "";
      }
    },

    // ????????????
    uploadMehod(params) {
      console.log("http-request", params);
      this.fileList[0] = params.file;
    },
    handleRemove(file, fileList) {
      console.log("on-remove", file, fileList);
    },
    handlePreview(file) {
      console.log("on-preview", file);
    },
    beforeUpload(file) {
      // ????????????????????????
      const isDocx = file.name.split(".")[1] === "docx";
      const isDoc = file.name.split(".")[1] === "doc";
      const isPdf = file.name.split(".")[1] === "pdf";
      const isTxt = file.name.split(".")[1] === "txt";
      const isZip = file.name.split(".")[1] === "zip";
      const isRar = file.name.split(".")[1] === "rar";

      if (!isDocx && !isDoc && !isPdf && !isZip && !isRar && !isTxt) {
        this.$message.error("????????????????????? doc/docx/pdf/zip/rar/txt ??????!");
      }
      return isDocx || isDoc || isPdf || isZip || isRar || isTxt;
    },
    handleExceed(files, fileList) {
      console.log("on-exceed", files, fileList);
      this.$message.warning(`?????????????????? 1 ?????????????????????????????????`);
    },
    handleSuccess(res, file) {
      console.log(res, file);
      this.fileList = URL.createObjectURL(file.raw);
    },
    beforeRemove(file) {
      console.log(file);
      this.fileList = [];
    },

    // ????????????
    exportExcel() {
      let that = this;
      require.ensure([], () => {
        const tHeader = [];
        const filterVal = [];
        that.tableFeilds.forEach(feild => {
          if(feild.prop != 'detail' && feild.type != "writerName"){
            tHeader.push(feild.label)
            filterVal.push(feild.prop)
          }
        })
        // ?????????????????????
        const data = that.formatJson(filterVal, that.tableData);
        // ?????????????????????
        export_json_to_excel(tHeader, data, "???????????????");
      });
    },
    //????????????
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => {
        if(j == "status"){
          let item = this.$store.state.orderStatus.orderStatus.find(e => e.value === v.status)
          return item ? item.label : ""
        }else if(j == "settlement"){
          let item = this.$store.state.orderStatus.settlement.find(e => e.value === v.settlement)
          return item ? item.label : ""
        }else{
          return v[j]
        }
      }));
    },

    handleSizeChange(val) {
      this.pagesize = val;
      // this.$emit("pageOperation", this.pagesize, this.currentPage)
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // this.$emit("pageOperation", this.pagesize, this.currentPage)
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleClose2() {
      this.uploadVisible = false;
      this.modifyVisible = false;
    },
  },
};
</script>

<style scoped>
.status {
  margin-right: 5px;
}
.uploadDialog >>> .el-dialog__footer {
  text-align: center;
  margin-top: 55px;
}
</style>