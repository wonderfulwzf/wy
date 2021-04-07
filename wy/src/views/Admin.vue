<template>
 <div class="layout">
  <Layout>
   <Header>
    <Menu mode="horizontal" theme="dark" active-name="1">
     <Row>
      <Col span="3">
       <div><h1 style="color:#ff9900;">往&nbsp;忆&nbsp;视&nbsp;频</h1></div>
      </Col>
      <Col span="9">
       <div>col-6</div>
      </Col>
      <Col span="6">
       <div>col-6</div>
      </Col>
      <Col span="4"> </Col>
      <Col span="2">
       <Dropdown>
        <div>
         <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" size="large" />
         <a href="javascript:void(0)"> </a>
        </div>
        <DropdownMenu slot="list">
         <DropdownItem>设置</DropdownItem>
         <DropdownItem>用户信息</DropdownItem>
          <DropdownItem>退出登录</DropdownItem>
        </DropdownMenu>
       </Dropdown>
      </Col>
     </Row>
    </Menu>
   </Header>
   <Layout :style="{ padding: '0 50px' }">
    <Breadcrumb :style="{ margin: '16px 0' }">
     <Breadcrumb>
      <BreadcrumbItem to="/">
       <Icon type="ios-home-outline"></Icon> 首页
      </BreadcrumbItem>
        <BreadcrumbItem to="/components/breadcrumb">
       <Icon type="ios-cafe"></Icon> 欢迎页
      </BreadcrumbItem>
      <BreadcrumbItem to="/components/breadcrumb">
       <Icon type="logo-buffer"></Icon> 其他
      </BreadcrumbItem>
     </Breadcrumb>
    </Breadcrumb>
    <Content
     :style="{ padding: '24px 0', minHeight: '700px', background: '#fff' }"
    >
     <Layout>
      <Sider hide-trigger :style="{ background: '#fff' }">
       <Menu  theme="light" width="auto"  accordion  v-bind:active-name=business :open-names="['system','business','file']">
         <MenuItem name="welcome" to="/welcome"><Icon type="logo-youtube" />
         欢迎</MenuItem>
        <Submenu name="system">
         <template slot="title">
          <Icon type="ios-people" />
          系统管理
         </template>
         <MenuItem name="user" to="/user">用户管理</MenuItem>
         <MenuItem name="member">角色管理</MenuItem>
         <MenuItem name="resource">资源管理</MenuItem>
        </Submenu>
        <Submenu name="business">
         <template slot="title">
          <Icon type="ios-keypad"></Icon>
          业务管理
         </template>
         <MenuItem name="video" to="/video">视频管理</MenuItem>
         <MenuItem name="actor" to="/actor">演员管理</MenuItem>
         <MenuItem name="3-2">会员管理</MenuItem>
        </Submenu>
        <Submenu name="file">
         <template slot="title">
          <Icon type="ios-analytics"></Icon>
          文件管理
         </template>
         <MenuItem name="3-1">文件管理</MenuItem>
        </Submenu>
       </Menu>
      </Sider>
      <Content
       :style="{ padding: '24px', minHeight: '280px', background: '#fff' }"
      >
      <div><router-view /></div>
      
      </Content>
     </Layout>
    </Content>
   </Layout>
   <Footer class="layout-footer-center">2020-2021 &copy; create By:王智芳</Footer>
  </Layout>
 </div>
</template>
<script>
export default {
 name: "admin",
 data: function () {
  return {
    business:"",
  };
 },
 mounted: function () {
   let _this = this;
   _this.business = _this.$route.name;
 },
 methods: {
 },
};
</script>
<style scoped>
.layout {
 border: 1px solid #d7dde4;
 background: #f5f7f9;
 position: relative;
 border-radius: 4px;
 overflow: hidden;
}
.layout-logo {
 width: 100px;
 height: 30px;
 background: #5b6270;
 border-radius: 3px;
 float: left;
 position: relative;
 top: 15px;
 left: 20px;
}
.layout-nav {
 width: 420px;
 margin: 0 auto;
 margin-right: 20px;
}
.layout-footer-center {
 text-align: center;
}
</style>
