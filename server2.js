const http = require("http")
const fs = require("fs")
const port = 5006;

const app = http.createServer((req, res) => {

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader( "Access-Control-Allow-Methods",
    "GET, HEAD, DELETE, OPTIONS, POST, PUT, PATCH");
    res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
if( req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end()
}

    let number = req.url.split("/")

    if( req.url === "/" || req.url ===`/projects/${number[2]}`){
    if(req.method === "GET" && number.length <= 2 && req.url === "/")
    {
        res.statusCode = 200; 
        let data = fs.readFileSync('todo.json')
        let converted = JSON.parse(data)
        res.statusMessage = "Everything is great! and working"
        res.end(JSON.stringify(converted))
    }
    else if (number.length === 3 && req.method === "GET")
    {
        let data = fs.readFileSync('todo.json')
        let converted = JSON.parse(data)
        const index = converted.projects.findIndex( object => 
        object.id === parseInt(number[2]) )
        converted = converted.projects[index]
        res.end(JSON.stringify(converted))
    }
    
    if(req.method === "POST")    
    {
        req.on("data", (chunk) =>{
            let newTodo = JSON.parse(chunk)
        
            if (typeof(newTodo.title) === "string" && typeof(newTodo.details) === "string" ){
            const random = Math.trunc(Math.random(1000) * 1000)
            newTodo['id'] = random
            newTodo['complete'] = false
            let data = fs.readFileSync('todo.json')
            let converted = JSON.parse(data)
            converted['projects'].push(newTodo)
            fs.writeFile("./todo.json", JSON.stringify(converted), (err) =>{
                console.log("File created, with the errorcode: " + err)})
             res.statusCode = 204;
            res.end() //fixa innan lämna in
              
            }
            else{
                res.statusCode = 422
                res.end(JSON.stringify({message: "Wrong input, only strings are allowed"}))
            }
            
    })
    }
    if(req.method === "DELETE" && req.url ===`/projects/${number[2]}`)
    {
        
        let data = fs.readFileSync('todo.json')
        let converted = JSON.parse(data)
        const index = converted.projects.findIndex( object => 
        object.id === parseInt(number[2]) )
            
            if (index >= 0) {
            converted.projects.splice(index, 1)
            fs.writeFile("./todo.json", JSON.stringify(converted), (err) =>{
            console.log("Object removed with error code: " + err)
            })
            res.statusCode = 204; 
            res.end()}
            else  {
            
            res.statusCode = 409; 
            res.end(JSON.stringify({message: "The object you are trying to delete is not here"}))
        }
    }

    if(req.method === "PUT" && req.url === `/projects/${number[2]}`)
    {
        req.on("data", (chunk) =>{
            let dataInut = JSON.parse(chunk)
            
            if (typeof(dataInut.title) === "string" && 
            typeof(dataInut.details) === "string" && Object.keys(dataInut).length === 2)
            {
                 
            let data = fs.readFileSync('todo.json')
            let converted = JSON.parse(data)
            
            const index = converted.projects.findIndex( object => 
            object.id === parseInt(number[2]) )
                
            const singleProjects = converted.projects[index]
            singleProjects.title = dataInut.title
            singleProjects.details = dataInut.details

            fs.writeFile("./todo.json", JSON.stringify(converted), (err) =>{
            console.log("Projects been updated with the error code of: " + err)}) 
            res.statusCode = 204;
            
            res.end()    
            }
            else {
                res.statusCode = 400; 
                res.end(JSON.stringify({message: "Only strings are accepted as input for title and details"}))  
            }
        })
        
        
    } if(req.method === "PATCH")
    {   

        req.on("data", (chunk) =>{
        let dataInut = JSON.parse(chunk)
        console.log(Object.keys(dataInut)[0])
    
           
        if ( typeof(dataInut.complete) === "boolean" &&
            Object.keys(dataInut).length === 1 )
            {
        let data = fs.readFileSync('todo.json')
        let converted = JSON.parse(data)
        const index = converted.projects.findIndex( object => 
        object.id === parseInt(number[2]) )
        
        converted.projects[index].complete = !converted.projects[index].complete
        
        fs.writeFile("./todo.json", JSON.stringify(converted), (err) =>{
        console.log("complete/uncomplete updated, Error :" + err)})    
        res.statusCode = 200;
        res.end() 
        }
        else{
            res.statusCode = 400;
            res.end(JSON.stringify({message: "Only the value completed is allowed to change"}))  
            res.end()
        }
             })  
    } 
}
else {
    res.statusCode = 404;
    res.message ="No api on this enpoint"
    res.end()
}
})


app.listen(port, () =>{
    console.log("Sever is running on port: " + port)
})