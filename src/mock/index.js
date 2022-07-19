import Mock from 'mockjs'

const {newsList} = Mock.mock({
    "newsList|75":[
            {
                "id":"@increment(1)",
                "title":"@ctitle()",
                "content":"@cparagraph(5,15)",
                "img_url":"@image('80x80','#AFEEEE','#2F4F4F','png','暂无图片')",
                "add_time":"@date(yyyy-MM-dd hh:mm:ss)"
            }
        ]     
})

// 根据url获取query参数
const getQuery = (url,name) => {
    if(url.indexOf("?") != -1){
        const queryArr = url.split('?')[1].split('&');
        for(let i = 0 ; i < queryArr.length ; i ++){
            const itemArr = queryArr[i].split('=')
            if(itemArr[0] === name){
                return itemArr[1]
            }
        }
        console.log(options.url.split('?')[1].split('&')) 
    }
    return null
    
}

// 定义获取参数数据接口
Mock.mock(/\/api\/get\/news/,'get',(options)=>{
    if(!localStorage.getItem('newsList')){
        localStorage.setItem('newsList',JSON.stringify(newsList)) 
        let newsArr = JSON.parse(localStorage.getItem('newsList'))
        const pageIndex = getQuery(options.url,'pageIndex');
        const pageSize = getQuery(options.url,'pageSize')
        const start = (pageIndex - 1)*pageSize;
        const end = pageIndex * pageSize;
        const list = newsArr.slice(start,end)  
        return{
            status:200,
            message:'获取新闻列表成功',
            list:list,
            total:JSON.parse(localStorage.getItem('newsList')).length
        }
    }else{
        let newsArr = JSON.parse(localStorage.getItem('newsList'))
        const pageIndex = getQuery(options.url,'pageIndex');
        const pageSize = getQuery(options.url,'pageSize')
        const start = (pageIndex - 1)*pageSize;
        const end = pageIndex * pageSize;
        const list = newsArr.slice(start,end)  
        return{
            status:200,
            message:'获取新闻列表成功',
            list:list,
            total:JSON.parse(localStorage.getItem('newsList')).length
        }
    }
   
})

// 定义post请求添加数据接口
Mock.mock('/api/add/news','post',(options)=>{
   console.log(options);
   let body = JSON.parse(options.body)
   let data = Mock.mock({
    "id":"@increment(1)",
    "title":body.title,
    "content":body.content,
    "img_url":"@image('80x80','#AFEEEE','#2F4F4F','png','暂无图片')",
    "add_time":"@date(yyyy-MM-dd hh:mm:ss)"
    })
   newsList.push(data)
   localStorage.setItem('newsList',JSON.stringify([...newsList]))
   return{
       status:200,
       message:'添加数据成功'
   }
})


// 根据id定义删除新闻列表的接口
Mock.mock('/api/delete/news','post',(options)=>{
   console.log('options',options);
   let body = JSON.parse(options.body);
   let index = newsList.findIndex(item=>item.id == body.id)
   newsList.splice(index,1)
   localStorage.setItem('newsList',JSON.stringify(newsList))
   return{
       status:200,
       message:'删除新闻成功'
   }
})

// 定义编辑新闻的接口
Mock.mock('/api/edit/news','post',(options)=>{
    console.log(options)
    // 获取请求体的数据
    let body = JSON.parse(options.body)
    console.log(body)
    // 从本地缓存读取数据
    let newsArr = JSON.parse(localStorage.getItem('newsList'))
    newsArr.forEach(item => {
        if(item.id == body.id){
            item.title = body.title;
            item.content = body.content
        }
    });
    localStorage.setItem('newsList',JSON.stringify(newsArr))
    return{
        status:200,
        message:"编辑新闻成功"
    }
})
