<template>
  <div class="cardControl">
  <el-card>
     
        <div class="add_news">
         <h1>新闻列表管理</h1>
          <el-input v-model="title" size="small" style="width:200px;margin-right:20px" placeholder="请输入标题"></el-input>
          <el-input v-model="content" size="small" style="width:200px;margin-right:20px;" placeholder="请输入内容"></el-input>
          <el-button type="primary" size="small" style="width:80px" @click="add">添加</el-button>
      </div>
      <div class="search" >
           <el-input placeholder="请输入内容" v-model="inputContent" clearable @change="searchNews(inputContent)"> <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
      </div>
 
  </el-card>
  <el-card >
    <el-table :data="newsList" border style="width: 100%;margin-bottom:20px;">
        <el-table-column width="110px" align="center"  prop="prop" label="图片">
            <template slot-scope="{row,$index}">
              <img :src="row.img_url"/>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="标题" width="120px">
        </el-table-column>
        <el-table-column align="center" prop="content" label="内容">
        </el-table-column>
        <el-table-column width="135px" align="center" prop="add_time"  label="时间">
        </el-table-column>
        <el-table-column align="center" prop="prop" width="180px"  label="操作">
            <template slot-scope="{row,$index}">
               <el-button type="warning" size="mini" class="el-icon-edit" @click="editNew(row.id)">编辑</el-button>
               <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteNew(row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-button type="primary" @click="lastPage">上一页</el-button>
    <el-button type="primary" @click="nextPage">下一页</el-button>
  </el-card>

  <el-dialog title="修改新闻列表" :visible.sync="dialogFormVisible">
  <el-form :model="newsItem">
    <el-form-item label="标题" label-width="120px">
        <el-input v-model="newsItem.title"></el-input>
    </el-form-item>
    <el-form-item label="内容" label-width="120px">
       <el-input  type="textarea" v-model="newsItem.content"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmToEdit">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "App",
  data() {
    return {
      title: "",
      content: "",
      newsList: [],
      pageIndex:1,
      pageSize:3,
      total:0,
      dialogFormVisible:false,
      newsItem:{
        title:'',
        content:'',
        id:''
      },
      // 搜索框的内容
      inputContent:''
    };
  },
  created(){
     this.getNewsList();
  },
  methods:{
    // 添加数据
    add(){
      // 判断输入是否为空
      if(this.title.trim() === '' || this.content.trim() === '') {
      console.log(this.title,this.content)
         this.$message({
            type:'warning',
            message:'标题或内容不能为空'
      })
      return null
      }
      this.pageIndex = 1
      // post请求添加数据
      axios.post('/api/add/news',{
        title:this.title,
        content:this.content
      }).then(res=>{
        this.title = '',
        this.content = ''
        this.getNewsList()
       
      })
    },

    // 获取新闻参数列表
    getNewsList(){
      axios.get('/api/get/news',{
        params:{
          pageIndex:this.pageIndex,
          pageSize:this.pageSize
        }
      }).then(res=>{
        this.newsList = res.data.list
        this.total = res.data.total
      })
    },

    // 点击下一页请求数据
    nextPage(){
      this.pageIndex++;
      let pageLength = Math.ceil(this.total/this.pageSize)
      if(this.pageIndex > pageLength){
        this.pageIndex = pageLength
        this.$message("没数据了哦~")
      }
      this.getNewsList()
    },

    // 点击上一页请求数据
    lastPage(){
      this.pageIndex--;
      if(this.pageIndex <= 1){
       this.pageIndex = 1
      }
      this.getNewsList()
    },

    // 根据id删除新闻数据
    deleteNew(id){
       this.$confirm('确认删除该新闻吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('id',id)
      axios.post('/api/delete/news',{id}).then(res=>{
       this.getNewsList()
      })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

      
    },

    // 点击编辑按钮展示新闻详情
    editNew(id){
      this.dialogFormVisible = true
      this.newsList.forEach(item=>{
        if(item.id == id){
          this.newsItem.title = item.title;
          this.newsItem.content = item.content;
          this.newsItem.id = id
        }
      })      
    },

    // 点击确认按钮修改内容
    confirmToEdit(){
        this.$confirm('确认修改吗?', '修改框', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
        
        // 判断编辑框内内容是否为空
       if(this.newsItem.title === '' || this.newsItem.content === ''){
         this.$message({
           type:'warning',
           message:'标题或内容不能为空'
         })
       }else{
          this.dialogFormVisible = false;
          axios.post('/api/edit/news',this.newsItem).then(res=>{
          this.getNewsList()
       })
       }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          });          
        });    
    },

    // 搜索关键字
    searchNews(inputContent){
      this.pageIndex = 1
       axios.post('/api/search/news',{inputContent}).then(res=>{
          this.getNewsList()
       })
    }
  }
};
</script>

<style lang="less">
// .inputControl{
//   display: flex;
//   justify-content: space-between;

//     .search{
//       width: 300px;
//       align-self: center;
//     }
// }


.cardControl>.el-card:nth-of-type(1)>.el-card__body{
    display: flex;
    justify-content: space-between;
    .search{
      width: 300px;
      align-self: center;
    }
}
</style>