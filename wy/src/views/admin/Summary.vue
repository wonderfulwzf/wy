<template>
 <div>
  <Row style="margin-bottom: 30px">
   <Col span="2"
    ><Button type="primary" @click="list(1)"
     ><Icon type="ios-refresh" />刷新</Button
    ></Col
   >
   <Col span="3"
    ><Button type="primary" @click="toAdd"
     ><Icon type="md-add" />新增</Button
    ></Col
   >
   <Col span="16">
    <Page
     :current="pageNo"
     :total="totalRecord"
     :page-size="pageSize"
     @on-change="handleCurrentChange"
     @on-page-size-change="handleSizeChange"
     show-sizer
     show-total
    />
   </Col>
  </Row>
  <Row :gutter="16" style="height: 650px">
   <Col span="6" v-for="summary in summarys" v-bind:key="summary.id">
    <div>
     <Card style="width: 250px">
      <div style="text-align: center">
       <div style="width:175px,height:245px">
        <img :src="summary.image" style="width: 100%; height: 100%" />
       </div>
       <!-- <h3>{{ summary.name }}</h3> -->
       <Row type="flex" justify="center" align="middle">
        <Col span="6"
         ><router-link to="/actor"
          ><Avatar
           icon="ios-person"
           src="https://i.gtimg.cn/qqlive/images/namelib/v688/7/5/3/72753.jpg" /></router-link
        ></Col>
        <Col span="12"
         ><Icon type="md-flame" color="red" />热度:{{ summary.heat }}</Col
        >
        <Col span="6" v-show="summary.flag === 1"
         ><img src="../../../public/static/img/vip.png"
        /></Col>
       </Row>
       <h4>时长:{{ summary.time | formatSecond }}</h4>
       <Button
        type="warning"
        @click="toUpdate(summary)"
        size="small"
        style="margin: 3px"
        ><Icon type="md-brush" />修改</Button
       >
       <Button
        type="error"
        style="margin: 3px"
        size="small"
        @click="toDelete(summary.id)"
        ><Icon type="md-close" />删除</Button
       >
       <Button
        type="primary"
        style="margin: 3px"
        size="small"
        @click="toVideo(summary)"
        ><Icon type="md-arrow-round-forward" />去视频</Button
       >
      </div>
     </Card>
    </div>
   </Col>
  </Row>

  <!-- 新增 -->
  <Modal v-model="modal_add" width="360" @on-cancel="cancel">
   <p slot="header" style="color: #2b85e4; text-align: center">
    <Icon type="md-videocam" />
    <span>新增视频概览</span>
   </p>
   <div style="text-align: center">
    <Form :label-width="80">
     <FormItem label="名称">
      <Input type="text" v-model="summary.name"></Input>
     </FormItem>
     <FormItem label="描述">
      <Input type="text" v-model="summary.describe"></Input>
     </FormItem>
     <FormItem label="时长">
      <Input type="text" v-model="summary.time"></Input>
     </FormItem>
     <FormItem label="封面">
      <Input type="text" v-model="summary.image"></Input>
     </FormItem>
     <FormItem label="热度">
      <Input type="text" v-model="summary.heat"></Input>
     </FormItem>
     <FormItem label="主演id">
      <Input type="text" v-model="summary.actorId"></Input>
     </FormItem>
     <FormItem label="等级">
      <Select style="width: 200px" v-model="summary.flag">
       <Option
        v-for="item in SUMMARY_FLAG"
        :value="item.key"
        :key="item.value"
        >{{ item.value }}</Option
       >
      </Select>
     </FormItem>
     <FormItem label="分类">
      <Select style="width: 250px">
       <Tree
        :data="treeData"
        show-checkbox
        :render="renderContent"
        @on-check-change="selectnode"
       ></Tree>
      </Select>
     </FormItem>
    </Form>
   </div>
   <div slot="footer">
    <Button type="primary" @click="add">新增</Button>
   </div>
  </Modal>
  <!-- 修改 -->
  <Modal v-model="modal_update" width="360" @on-cancel="cancel">
   <p slot="header" style="color: #2b85e4; text-align: center">
    <Icon type="md-videocam" />
    <span>修改视频概览</span>
   </p>
   <div style="text-align: center">
    <Form :label-width="80">
     <FormItem label="ID">
      <Input type="text" v-model="summary.id" disabled></Input>
     </FormItem>
     <FormItem label="名称">
      <Input type="text" v-model="summary.name"></Input>
     </FormItem>
     <FormItem label="描述">
      <Input type="text" v-model="summary.describe"></Input>
     </FormItem>
     <FormItem label="时长">
      <Input type="text" v-model="summary.time"></Input>
     </FormItem>
     <FormItem label="封面">
      <Input type="text" v-model="summary.image"></Input>
     </FormItem>
     <FormItem label="热度">
      <Input type="text" v-model="summary.heat"></Input>
     </FormItem>
     <FormItem label="主演id">
      <Input type="text" v-model="summary.actorId"></Input>
     </FormItem>
     <FormItem label="等级">
      <Select style="width: 200px" v-model="summary.flag">
       <Option
        v-for="item in SUMMARY_FLAG"
        :value="item.key"
        :key="item.value"
        >{{ item.value }}</Option
       >
      </Select>
     </FormItem>
     <FormItem label="分类">
      <Select style="width: 250px">
       <Tree
        :data="treeData"
        show-checkbox
        :render="renderContent"
        @on-check-change="selectnode"
       ></Tree>
      </Select>
     </FormItem>
    </Form>
   </div>
   <div slot="footer">
    <Button type="primary" @click="update">修改</Button>
   </div>
  </Modal>
  <!-- 删除 -->
  <Modal v-model="modal_delete" width="360">
   <p slot="header" style="color: #f60; text-align: center">
    <Icon type="ios-information-circle"></Icon>
    <span>确定删除?</span>
   </p>
   <div style="text-align: center">
    <p>删除此视频概览信息将不可恢复！</p>
   </div>
   <div slot="footer">
    <Button
     type="error"
     size="large"
     long
     :loading="modal_loading"
     @click="del(deleteId)"
     >我仍要删除！</Button
    >
   </div>
  </Modal>
 </div>
</template>
<script>
export default {
 name: "wy_summary",

 //返回值
 data: function () {
  return {
   modal_update: false, //修改模态框
   modal_add: false, //添加模态框
   modal_delete: false, //删除模态框
   modal_loading: false, //加载模态框
   summarys: [], //视频概览列表
   //分页查询参数
   pageNo: 1,
   totalRecord: 0,
   pageSize: 3,
   summary: {}, //视频概览
   //vip枚举
   SUMMARY_FLAG: SUMMARY_FLAG,
   //删除id
   deleteId: 0,
   //分类树
   data2: [
    {
     title: "parent 1",
     expand: true,
     children: [
      {
       title: "parent 1-1",
       expand: true,
       children: [
        {
         title: "leaf 1-1-1",
        },
        {
         title: "leaf 1-1-2",
        },
       ],
      },
      {
       title: "parent 1-2",
       expand: true,
       children: [
        {
         title: "leaf 1-2-1",
        },
        {
         title: "leaf 1-2-1",
        },
       ],
      },
     ],
    },
   ],
   //所有分类
   categorys: [],
   treeData: [],
   //选择的分类数组
   checknodes: [],
  };
 },
 mounted: function () {
  let _this = this;
  _this.list(1);
  //查询所有分类
  _this.getAllCategory();
 },
 methods: {
  //列表查询
  list(pageNo) {
   let _this = this;
   _this.$Spin.show({
    render: (h) => {
     return h("div", [
      h("Icon", {
       class: "demo-spin-icon-load",
       props: {
        type: "ios-loading",
        size: 18,
       },
      }),
      h("div", "Loading"),
     ]);
    },
   });
   setTimeout(() => {
    this.$Spin.hide();
    _this.$ajax
     .post(process.env.VUE_APP_SERVER + "/business/summary/list", {
      pageNo: pageNo,
      pageSize: _this.pageSize,
     })
     .then(
      //响应结果
      (response) => {
       if (response.data.success) {
        console.log("查询视频概览列表", response);
        let resp = response.data.data;
        _this.summarys = resp.records;
        _this.totalRecord = resp.totalRecord;
        this.$Message.info("获取列表信息ok");
       } else {
        this.$Message.error("出错了,告知老王修复");
       }
      }
     );
   }, 500);
  },
  //页码改变
  handleCurrentChange(page) {
   this.list(page);
  },
  //改变页长
  handleSizeChange(size) {
   let _this = this;
   _this.pageSize = size;
   _this.list(_this.pageNo);
  },
  //新增视频概览
  add() {
   let _this = this;
   //种类校验
   if (_this.checknodes.length === 0) {
    _this.$Notice.error({
     title: "分类错误",
     desc: "分类不能为空",
    });
    return;
   }
   //保存校验
   if (!Validator.require(_this.summary.name, "名称")) {
    _this.$Notice.error({
     title: "校验错误",
     desc: "名称不能为空",
    });
    return;
   }
   //分类赋值
   _this.summary.ids = _this.checknodes;
   _this.$Spin.hide();
   _this.$ajax
    .post(process.env.VUE_APP_SERVER + "/business/summary/add", _this.summary)
    .then(
     //响应结果
     (response) => {
      if (response.data.success) {
       console.log("新增视频概览信息", response);
       _this.list(1);
       _this.$Message.info("新增视频概览ok");
       _this.summary = {};
       //关闭对话框
       _this.modal_add = false;
      } else {
       _this.$Notice.error({
        title: response.data.message,
       });
       //_this.$Message.error("出错了,告知老王修复");
      }
     }
    );
  },
  //打开删除模态框
  toDelete(id) {
   let _this = this;
   _this.$Spin.show({
    render: (h) => {
     return h("div", [
      h("Icon", {
       class: "demo-spin-icon-load",
       props: {
        type: "ios-loading",
        size: 18,
       },
      }),
      h("div", "Loading"),
     ]);
    },
   });
   setTimeout(() => {
    this.$Spin.hide();
    _this.modal_delete = true;
    _this.deleteId = id;
   }, 500);
  },
  //打开更新模态框
  toUpdate(summary) {
   let _this = this;
   _this.checknodes = [];
   _this.$Spin.show({
    render: (h) => {
     return h("div", [
      h("Icon", {
       class: "demo-spin-icon-load",
       props: {
        type: "ios-loading",
        size: 18,
       },
      }),
      h("div", "Loading"),
     ]);
    },
   });
   setTimeout(() => {
    this.$Spin.hide();
    console.log(summary);
    //消除双向绑定，复制对象
    _this.summary = $.extend({}, summary);
    _this.modal_update = true;
   }, 500);
  },
  //打开新增模态框
  toAdd() {
   let _this = this;
   _this.checknodes = [];
   _this.$Spin.show({
    render: (h) => {
     return h("div", [
      h("Icon", {
       class: "demo-spin-icon-load",
       props: {
        type: "ios-loading",
        size: 18,
       },
      }),
      h("div", "Loading"),
     ]);
    },
   });
   setTimeout(() => {
    _this.$Spin.hide();
    //消除双向绑定，复制对象
    _this.summary = {};
    _this.modal_add = true;
   }, 500);
  },
  //修改视频概览
  update() {
   let _this = this;
   //种类校验
   if (_this.checknodes.length === 0) {
    _this.$Notice.error({
     title: "分类错误",
     desc: "分类不能为空",
    });
    return;
   }
   //分类赋值
   _this.summary.ids = _this.checknodes;
   _this.$ajax
    .post(
     process.env.VUE_APP_SERVER + "/business/summary/update",
     _this.summary
    )
    .then(
     //响应结果
     (response) => {
      if (response.data.success) {
       console.log("修改视频概览信息", response);
       _this.list(1);
       _this.$Message.info("修改视频概览ok");
       _this.summary = {};
       _this.modal_update = false;
      } else {
       _this.$Message.error("出错了,告知老王修复");
      }
     }
    );
  },
  //取消
  cancel() {
   this.$Message.info("已取消操作");
  },
  //删除视频概览
  del(id) {
   this.modal_loading = true;
   setTimeout(() => {
    let _this = this;
    _this.$ajax
     .get(process.env.VUE_APP_SERVER + "/business/summary/delete/" + id)
     .then(
      //响应结果
      (response) => {
       this.modal_loading = false;
       this.modal_delete = false;
       if (response.data.success) {
        console.log("删除视频概览信息", response);
        _this.list(1);
        this.$Message.info("删除视频概览ok");
        _this.modal_delete = false;
       } else {
        this.$Message.error("出错了,告知老王修复");
       }
      }
     );
   }, 500);
  },
  //点击去视频跳到对应视频
  toVideo(summary) {
   let _this = this;
   //缓存视频概览信息
   SessionStorage.set("summary", summary);
   _this.$router.push("/video");
  },
  //查询所有分类
  getAllCategory() {
   let _this = this;
   _this.$ajax.get(process.env.VUE_APP_SERVER + "/business/category/all").then(
    //响应结果
    (response) => {
     if (response.data.success) {
      console.log("查询种类列表", response);
      let resp = response.data.data;
      _this.categorys = resp;
      console.log(_this.categorys);
      _this.$Message.info("获取列表信息ok");
      // 将所有记录格式化成树形结构
      _this.treeData = [];
      for (let i = 0; i < _this.categorys.length; i++) {
       let c = _this.categorys[i];
       if (c.parent === "00000000") {
        _this.treeData.push(c);
        for (let j = 0; j < _this.categorys.length; j++) {
         let child = _this.categorys[j];
         if (child.parent === c.id) {
          if (Tool.isEmpty(c.children)) {
           c.children = [];
          }
          c.children.push(child);
         }
        }
       }
      }
     } else {
      this.$Message.error("出错了,告知老王修复");
     }
    }
   );
  },
  // renderContent: (h, { root, node, data }) => {
  //  console.log(root);
  //  console.log(node);
  //  return h("span", [h("span", data.name)]);
  // },
  renderContent: (h, { data }) => {
   return h("span", [h("span", data.name)]);
  },
  selectnode(children) {
   let _this = this;
   _this.checknodes = [];
   if (children != []) {
    children.forEach((node) => {
     _this.checknodes.push(node.id);
    });
   }
   console.log(_this.checknodes);
   console.log(children);
  },
 },
};
</script>
<style scope>
.demo-spin-icon-load {
 animation: ani-demo-spin 1s linear infinite;
}
</style>