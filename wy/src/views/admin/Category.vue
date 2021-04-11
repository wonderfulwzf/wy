<template>
 <div>
  <Row style="margin-bottom: 30px">
   <Col span="2"
    ><Button type="primary" @click="list()"
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
  <Row>
   <Col span="12">
    <Table
     border
     :columns="category_title"
     :data="level1"
     style="width: 500px"
     @on-row-dblclick="looklevel2"
    >
    </Table
   ></Col>
   <Col span="12">
    <h3 v-show="parentname!=''">一级菜单:{{parentname}}</h3>
    <Table border :columns="category_title" :data="level2" style="width: 500px">
    </Table
   ></Col>
  </Row>
  <!-- 删除 -->
  <Modal v-model="modal_delete" width="360">
   <p slot="header" style="color: #f60; text-align: center">
    <Icon type="ios-information-circle"></Icon>
    <span>确定删除?</span>
   </p>
   <div style="text-align: center">
    <p>删除此种类信息将不可恢复！</p>
   </div>
   <div slot="footer">
    <Button
     type="error"
     size="large"
     long
     :loading="modal_loading"
     @click="del(deleteID)"
     >我仍要删除！</Button
    >
   </div>
  </Modal>
  <!-- 新增 -->
  <Modal v-model="modal_add" width="360" @on-cancel="cancel">
   <p slot="header" style="color: #2b85e4; text-align: center">
    <Icon type="md-videocam" />
    <span>新增种类</span>
   </p>
   <div style="text-align: center">
    <Form :label-width="80">
     <FormItem label="父类id">
      <Input type="text" v-model="category.parent"></Input>
     </FormItem>
     <FormItem label="名称">
      <Input type="text" v-model="category.name"></Input>
     </FormItem>
     <FormItem label="排序">
      <Input type="text" v-model="category.sort"></Input>
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
    <span>修改种类</span>
   </p>
   <div style="text-align: center">
    <Form :label-width="80">
     <FormItem label="ID">
      <Input type="text" v-model="category.id" disabled></Input>
     </FormItem>
     <FormItem label="父id">
      <Input type="text" v-model="category.parent" disabled></Input>
     </FormItem>
     <FormItem label="名称">
      <Input type="text" v-model="category.name"></Input>
     </FormItem>
     <FormItem label="排序">
      <Input type="text" v-model="category.sort"></Input>
     </FormItem>
    </Form>
   </div>
   <div slot="footer">
    <Button type="primary" @click="update">确定修改</Button>
   </div>
  </Modal>
 </div>
</template>
<script>
export default {
 name: "category",

 //返回值
 data: function () {
  return {
   modal_update: false, //修改模态框
   modal_add: false, //添加模态框
   modal_delete: false, //删除模态框
   modal_loading: false, //加载模态框
   categorys: [], //种类列表
   //分页查询参数
   pageNo: 1,
   totalRecord: 1,
   pageSize: 10,
   category: {}, //种类
   deleteID: 0,
   //表格头部信息
   category_title: [
    {
     title: "ID",
     key: "id",
    },
    {
     title: "名称",
     key: "name",
    },
    {
     title: "操作",
     key: "dosome",
     width: 250,
     align: "center",
     render: (h, params) => {
      return h("div", [
       h(
        "Button",
        {
         props: {
          type: "warning",
          size: "small",
         },
         style: {
          marginRight: "5px",
         },
         on: {
          click: () => {
           let _this = this;
           _this.category = params.row;
           _this.modal_update = true;
          },
         },
        },
        "修改"
       ),
       h(
        "Button",
        {
         props: {
          type: "error",
          size: "small",
         },
         style: {
          marginRight: "5px",
         },
         on: {
          click: () => {
           let _this = this;
           _this.deleteID = params.row.id;
           _this.modal_delete = true;
          },
         },
        },
        "删除"
       ),
      ]);
     },
    },
   ],
   //一级分类
   level1: [],
   //二级分类
   level2:[],
   //父类名称
   parentname:"",
  };
 },
 mounted: function () {
  let _this = this;
  _this.list();
 },
 methods: {
  //列表查询
  list() {
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
    _this.$Spin.hide();
    _this.$ajax.get(process.env.VUE_APP_SERVER + "/business/category/all").then(
     //响应结果
     (response) => {
      if (response.data.success) {
       console.log("查询种类列表", response);
       let resp = response.data.data;
       _this.categorys = resp;
       console.log(_this.categorys);
       _this.$Message.info("获取列表信息ok");
       _this.categoryss = response.data.data;

       _this.level1 = [];

       for (let i = 0; i < _this.categorys.length; i++) {
        let c = _this.categorys[i];
        if (c.parent === "00000000") {
         _this.level1.push(c);
        }
       }
       _this.level2 = [];
       _this.parentname ="";
      } else {
       this.$Message.error("出错了,告知老王修复");
      }
     }
    );
   }, 500);
  },
  //页码改变
  handleCurrentChange(page) {
   console.log(page);
   this.list();
  },
  //改变页长
  handleSizeChange(size) {
   let _this = this;
   _this.pageSize = size;
   _this.list();
  },
  //双击父菜单
  looklevel2(row) {
    let _this = this;
    _this.level2 = [];
    _this.parentname = row.name;
   console.log(row);
   for (let i = 0; i < _this.categorys.length; i++) {
    let c = _this.categorys[i];
    if (c.parent === row.id) {
     _this.level2.push(c);
    }
   }
  },
  //新增种类
  add() {
   let _this = this;
   _this.$Spin.hide();
   _this.$ajax
    .post(process.env.VUE_APP_SERVER + "/business/category/add", _this.category)
    .then(
     //响应结果
     (response) => {
      if (response.data.success) {
       console.log("新增种类信息", response);
       _this.list();
       _this.$Message.info("新增种类ok");
       _this.category = {};
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
  //打开更新模态框
  toUpdate(category) {
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
    console.log(category);
    //消除双向绑定，复制对象
    _this.category = $.extend({}, category);
    _this.modal_update = true;
   }, 500);
  },
  //打开新增模态框
  toAdd() {
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
    _this.$Spin.hide();
    //消除双向绑定，复制对象
    _this.category = {};
    _this.modal_add = true;
   }, 500);
  },
  //修改种类
  update() {
   let _this = this;
   _this.$ajax
    .post(
     process.env.VUE_APP_SERVER + "/business/category/update",
     _this.category
    )
    .then(
     //响应结果
     (response) => {
      if (response.data.success) {
       console.log("修改种类信息", response);
       _this.list();
       _this.$Message.info("修改种类ok");
       _this.modal_update = false;
       _this.category = {};
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
  //删除种类
  del(id) {
   console.log(id);
   this.modal_loading = true;
   setTimeout(() => {
    let _this = this;
    _this.$ajax
     .get(process.env.VUE_APP_SERVER + "/business/category/delete/" + id)
     .then(
      //响应结果
      (response) => {
       this.modal_loading = false;
       this.modal_delete = false;
       if (response.data.success) {
        console.log("删除种类信息", response);
        _this.list();
        this.$Message.info("删除种类ok");
       } else {
        this.$Message.error("出错了,告知老王修复");
       }
      }
     );
   }, 500);
  },
 },
};
</script>
<style scope>
.demo-spin-icon-load {
 animation: ani-demo-spin 1s linear infinite;
}
</style>