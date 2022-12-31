require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const User = require("./server/models/User");
const Project=require('./server/models/Project')
const path=require('path')
const Subscriber=require('./server/models/Subscriber')
const multer=require('multer')
const app = express();

app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const dir=path.join(__dirname,'public/uploads');
// const storage=multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,dir)
//   },
//   filename:(req,file,cb)=>{
//     console.log(file)
//     cb(null,Date.now()+path.extname(file.originalname))
//   }
// })
mongoose.connect("mongodb://127.0.0.1:27017/test", { useNewUrlParser : true, useUnifiedTopology: true  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log('Connected')
});

// const upload=multer({storage:storage})
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, dir);
  },
  filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});
const filefilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' 
      || file.mimetype === 'image/jpeg'||file.mimetype=='application/pdf'){
          cb(null, true);
      }else {
          cb(null, false);
      }
}

const multipleFileUpload = async (req, res, next) => {
  try{
      let filesArray = [];
      req.files.forEach(element => {
          const file = {
              fileName: element.filename,
              filePath: element.path,
              fileType: element.mimetype,
             
          }
          filesArray.push(file);
      });
      const multipleFiles = new Project({
        name:req.body.name,
        code:req.body.code,
        email:req.body.email,
        phone:req.body.phone,
        project_name:req.body.project_name,
        domain:req.body.domain,
        description:req.body.description,
          files: filesArray,
          
      });
      await multipleFiles.save();
     res.redirect('/')
  }catch(error) {
      res.status(400).send(error.message);
  }
}
let coll = db.collection('users');
let col=db.collection('projects');
const getallMultipleFiles = async (req, res, next) => {
  try{
      const files = await Project.find();
      coll.count().then((count) => {
        col.count().then((pro)=>{

          res.render("index",{
            institute:count,
            result:checkAuthenticated,
            project:files,
            pro:pro
          });
        })
    });
        
      
      
  
  }catch(error) {
      res.status(400).send(error.message);
  }
}
const upload = multer({storage: storage, fileFilter: filefilter});
const bcrypt = require("bcryptjs");
let checkAuthenticated=0;















// app.use(expressLayouts);

// app.use(cookieParser('CookingBlogSecure'));
// app.use(session({
//   secret: 'CookingBlogSecretSession',
//   saveUninitialized: true,
//   resave: true
// }));
app.get('/',getallMultipleFiles)

app.get('/signup',(req,res)=>{
res.render('signup')
})
app.get('/project-submit',(req,res)=>{
  if(checkAuthenticated)
  {
    res.render('submit-project')
  }
  else{
    res.redirect('/signup')
  }
 
})
app.get('/project/:id',async(req,res)=>{
   try{
      const files = await Project.findById(req.params.id);
        res.render("project",{
          project:files,
        
        });
      
      
  
  }catch(error) {
      res.status(400).send(error.message);
  }
})

app.post('/project-submit', upload.array('files'), multipleFileUpload)
app.get('/FAQ',(req,res)=>{
res.render('FAQ')
})
app.get('/contact',(req,res)=>{
res.render('contact')
})
app.post('/signup',async(req,res)=>{ 
  if(req.body.result==="Login")
{
 const email=req.body.email;
 const password=req.body.password;
const userMail=await User.findOne({email:email})
const isMatch=await bcrypt.compare(password,userMail.password);
if(isMatch)
{
  checkAuthenticated=1;
  res.redirect('/');
}
else
{
  res.redirect('/signup');
}


}
else if(req.body.result==="Sign up")
{
  const userFound = await User.findOne({ email: req.body.email });

  if (userFound) {
    req.flash("error", "User with that email already exists");
    res.redirect("/signup");
  } else {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      });

      await user.save();
      res.redirect("/signup");
    } catch (error) {
      console.log(error);
      res.redirect("/signup");
    }
  }
}

  
 

})









app.listen(3000, () => {
    console.log(`Listening to port no 3000`)
})