import Mock from 'mockjs'

const {newsList} = Mock.mock({
    "newsList|10":[
            {
                "id":"@increment(1)",
                "title":"@ctitle()",
                "content":"@cparagraph(5,15)",
                "img_url":"@image('80x80','#AFEEEE','#2F4F4F','png','暂无图片')",
                "add_time":"@date(yyyy-MM-dd hh:mm:ss)"
            }
        ]     
})

// 在这里进行if判断的目的是只在创建的时候执行一次，使得后面刷新的时候，数据也不会因为本地缓存里面没有数据，重新生成随机数据
// 首先创建一个arr，若本地缓存有newsList，则直接将值赋值给arr；若本地没缓存，则将随机生成的数据赋值给arr并创建缓存
let arr = [];
let new_list = JSON.parse(localStorage.getItem('newsList'));
if( new_list instanceof Array && new_list.length > 8){
    arr = new_list
}else{
     arr = newsList;
     localStorage.setItem('newsList',JSON.stringify(arr))
}

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
    // 起初这里进行了本地存储的判断，并不理想，数据经常改变，是因为始终都是操作的原数组，若本地存储为空，则会走创建缓存的逻辑
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
            total:newsArr.length
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
   arr.unshift(data)
   localStorage.setItem('newsList',JSON.stringify([...arr]))
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
   arr.splice(index,1)
   localStorage.setItem('newsList',JSON.stringify(arr))
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


// 根据关键字定义搜索接口
Mock.mock('/api/search/news','post',(options)=>{
    console.log('options',options)
    let body = JSON.parse(options.body).inputContent;
    console.log(arr,body)
    let newArr = arr.filter(item=>{
        return item.title.indexOf(body) != -1
    })
    localStorage.setItem('newsList',JSON.stringify(newArr))
    if(body.trim() == ''){
        newArr = arr
        localStorage.setItem('newsList',JSON.stringify(newArr))
    }
    return{
        status:200,
        message:'搜索成功',
        // list:newArr,
        // total:newArr.length

    }
})
