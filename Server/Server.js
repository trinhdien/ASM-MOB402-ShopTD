const express = require('express');
const express_handlebars = require('express-handlebars');
const upload = require("express-fileupload")
const mongoose = require('mongoose');
const app = express();
const userManager = require("./public/js/User");
const productManager = require("./public/js/Product");
const session = require('express-session');
const cors = require('cors');
app.use(cors({ origin: 'http://127.0.0.1:5500' }));

app.listen(3000,"10.24.27.244", (err) => {
    console.log("Server đang chạy 3000 ");
});

app.use(async (req, res, next) => {
    let url = "mongodb+srv://dientcph27512:03092003@trinhcongdien.usquknr.mongodb.net/ShopTD?retryWrites=true&w=majority";

    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    next();
});
app.use(session({
    secret: 'my-secret-key',
    resave: true,
    saveUninitialized: true
}));

app.use(upload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.engine('.hbs', express_handlebars.engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
const requirePermission = (req, res, next) => {
    if (req.session && req.session.user) {
        if (req.path === '/userManager' ) {
            if (req.session.user.userLogin.permission != 'ADMIN') {
                return res.sendStatus(403);
            }
            return next();
        }

        return next();
    } else {
        return res.send('<script>alert("Vui lòng đăng nhập !"); window.location.href = "/";</script>');
    }
};
app.use(function (req, res, next) {
    if (req.path === '/' || req.path === "/login" || req.path === "/register"|| req.path === '/userAPI' || req.path === '/productAPI') {
        if (req.session && req.session.user) {
            if (req.path === '/' || req.path === "/login" || req.path === "/register") {
                return res.redirect('/home');
            }
        }
        return next();
    } else {
        return requirePermission(req, res, next);
    }
});

app.get('/', async (req, res, next) => {

    res.render('index', {
        layout: 'Login',
    });
});
app.post('/', async (req, res, next) => {

    res.render('index', {
        layout: 'Login',
    });
});
app.post('/logout', (req, res, next) => {
    req.session.destroy(()=>{
        res.redirect('/');
    })
});

app.get('/register', async (req, res, next) => {

    res.render('register', {
        layout: 'Login',
    });
});
app.post('/register', async (req, res, next) => {

    let name = req.body.fullname;
    let email = req.body.email;
    let pass = req.body.pass;

    let list = await userManager.find().lean();
    let check = true;

    list.forEach((value) => {
        if (value.email === email) {
            check = false;
        }
    })

    if (check) {
        let userRegister = new userManager({
            name: name,
            email: email,
            password: pass,
            img: 'https://antimatter.vn/wp-content/uploads/2022/11/anh-avatar-trang-fb-mac-dinh.jpg',
            permission: 'USER',
            status: true,
        })

        await userRegister.save();
        res.send('<script>alert("Đăng ký thành công!"); window.location.href = "/";</script>');
    } else {
        res.send('<script>alert("Email đã tồn tại!"); window.location.href = "/register";</script>');
    }
});


app.get('/home', (req, res, next) => {
    let userLogin = req.session.user.userLogin;
    res.render('home', {
        layout: 'main',
        id: userLogin._id,
        img: userLogin.img,
        name: userLogin.name,
        email: userLogin.email,
        password: userLogin.password,
        permission: userLogin.permission,
        status: userLogin.permission === 'ADMIN',
    });
});
app.post('/login', async (req, res, next) => {

    let email = req.body.email;
    let pass = req.body.pass;

    let list = await userManager.find().lean();
    let check = false;
    let userLogin = {};
    list.forEach((value) => {
        if (value.email === email && value.password === pass) {
            userLogin = { ...value };
            check = true;
        }
    });
    if (check) {
        req.session.user = { userLogin },
            res.redirect(`/home`);
    } else {
        res.send('<script>alert("Email hoặc mật khẩu không đúng !"); window.location.href = "/";</script>');
        console.log(req.session);
    }

});
app.post('/editUserLogin', async (req, res, next) => {

    let id = req.body.id;
    let name = req.body.fullname;
    let email = req.body.email;
    let pass = req.body.pass;
    let img = req.files;

    let userList = await userManager.find().lean();

    let data = [...userList];
    let userEdit = req.session.user.userLogin;

    let check = true;
    for (let i = 0; i < data.length; i++) {
        if (userEdit.email == data[i].email) {
            continue;
        }

        if (email == userList[i].email) {
            check = false;
            break;
        }
    }

    if (check) {
        let userUpdate = new userManager({
            _id: id,
        })
        let imgUpdate = "";

        if (img == null) {
            imgUpdate = userEdit.img;
        } else {
            let pathImg = "",
                dataImg = "",
                file_ext = "";

            pathImg = img.img.data;
            dataImg = pathImg.toString('base64');
            file_ext = img.img.name.substring(img.img.name.lastIndexOf('.') + 1);
            imgUpdate = `data:image/${file_ext};base64,${dataImg}`;
        }
        await userUpdate.updateOne({ name: name, email: email, password: pass, img: imgUpdate, permission: userEdit.permission, status: userEdit.permission === 'ADMIN'?false:true });
        let update = await userManager.findOne({ _id: id }).lean();
        req.session.user = { userLogin: update };
        console.log(req.session);
        res.send('<script>alert("Sửa thành công!"); window.location.href = "/home";</script>');
    } else {
        res.send('<script>alert("Email đã tồn tại !"); window.location.href = "/home";</script>');
    }
})

app.get('/userManager', async (req, res, next) => {

    let userList = await userManager.find().lean();

    res.render('ListUser', {
        layout: 'main',
        data: userList,
    });
});

app.post('/userManager', async (req, res, next) => {
    let userList = await userManager.find().lean();

    let name = req.body.fullname;
    let email = req.body.email;
    let pass = req.body.pass;
    let img = req.files.img;

    let check = true;
    let textErr = "";
    await userList.forEach((value) => {
        if (value.email == email) {
            check = false;
        }
    })

    if (check) {
        let pathImg = "",
            dataImg = "",
            file_ext = "",
            imgBase64 = "";

        pathImg = img.data;
        dataImg = pathImg.toString('base64');
        file_ext = img.name.substring(img.name.lastIndexOf('.') + 1);
        imgBase64 = `data:image/${file_ext};base64,${dataImg}`;

        let addUser = new userManager({
            name: name,
            email: email,
            password: pass,
            img: imgBase64,
            permission: "USER",
            status: true,
        })

        await addUser.save();
        res.redirect("/userManager");

    } else {
        res.send('<script>alert("Email đã tồn tại!"); window.location.href = "/userManager";</script>');
    }
});
app.post("/deleteUser", async (req, res, next) => {

    let id = req.body.id;
    let userId = await userManager.findOne({ _id: id }).lean();

    if (userId.permission === 'ADMIN') {
        res.send('<script>alert("Không thể xóa Admin !"); window.location.href = "/userManager";</script>');
    } else {
        await userManager.deleteOne({ _id: id });
        res.redirect("/userManager");
    }

});
app.post("/editUser", async (req, res, next) => {

    let id = req.body.id;
    let name = req.body.fullname;
    let email = req.body.email;
    let pass = req.body.pass;
    let img = req.files;

    let userList = await userManager.find().lean();

    let data = [...userList];
    let userEdit = await userManager.findOne({ _id: id }).lean();

    let check = true;
    for (let i = 0; i < data.length; i++) {
        if (userEdit.email == data[i].email) {
            continue;
        }

        if (email == userList[i].email) {
            check = false;
            break;
        }
    }

    if (check) {
        let userUpdate = new userManager({
            _id: id,
        })
        let imgUpdate = "";

        if (img == null) {
            imgUpdate = userEdit.img;
        } else {
            let pathImg = "",
                dataImg = "",
                file_ext = "";

            pathImg = img.img.data;
            dataImg = pathImg.toString('base64');
            file_ext = img.img.name.substring(img.img.name.lastIndexOf('.') + 1);
            imgUpdate = `data:image/${file_ext};base64,${dataImg}`;
        }

        await userUpdate.updateOne({ name: name, email: email, password: pass, img: imgUpdate, permission: "USER", status: true });

        res.redirect("/userManager");
    } else {
        res.send('<script>alert("Email đã tồn tại !"); window.location.href = "/userManager";</script>');
    }
})

app.get('/productManager', async (req, res, next) => {

    let productList = await productManager.find().lean();
    let userLogin = req.session.user.userLogin;
    res.render('ProductManager', {
        layout: 'main',
        data: productList,
        status: userLogin.permission === 'ADMIN',
    });
});
app.post('/productManager', async (req, res, next) => {


    let name = req.body.fullname;
    let price = req.body.price;
    let quantity = req.body.quantity;
    let color = req.body.color;
    let img = req.files.img;

    let pathImg = "",
        dataImg = "",
        file_ext = "",
        imgBase64 = "";

    pathImg = img.data;
    dataImg = pathImg.toString('base64');
    file_ext = img.name.substring(img.name.lastIndexOf('.') + 1);
    imgBase64 = `data:image/${file_ext};base64,${dataImg}`;

    let addProduct = new productManager({
        name: name,
        price: price,
        quantity: quantity,
        color: color,
        img: imgBase64,
    })

    await addProduct.save();

    let productList = await productManager.find().lean();

    res.redirect('/productManager');
});
app.post('/deleteProduct', async (req, res, next) => {


    let id = req.body.id;
    await productManager.deleteOne({ _id: id });

    res.redirect("/productManager")
})
app.post('/editProduct', async (req, res, next) => {


    let id = req.body.id;
    let name = req.body.fullname;
    let price = req.body.price;
    let quantity = req.body.quantity;
    let color = req.body.color;
    let img = req.files;
    let imgUpdate = "";

    let userEdit = await productManager.findOne({ _id: id }).lean();
    if (img == null) {
        imgUpdate = userEdit.img;
    } else {
        let pathImg = "",
            dataImg = "",
            file_ext = "";

        pathImg = img.img.data;
        dataImg = pathImg.toString('base64');
        file_ext = img.img.name.substring(img.img.name.lastIndexOf('.') + 1);
        imgUpdate = `data:image/${file_ext};base64,${dataImg}`;
    };
    let userUpdate = new productManager({
        _id: id,
    });
    await userUpdate.updateOne({ name: name, price: price, quantity: quantity, color: color, img: imgUpdate });

    res.redirect("/productManager")
})

app.post("/searchUser", async (req, res, next) => {
    let text = req.body.text;
    let str = String(text);

    let userList = await userManager.find().lean();
    let userLogin = req.session.user.userLogin;
    let data = userList.filter((item) => {
        return (item.name.toLowerCase().includes(str.toLowerCase()));
    })

    res.render('ListUser', {
        layout: 'main',
        data: data,
        status: userLogin.permission === 'ADMIN',
    });
})
app.post("/searchProduct", async (req, res, next) => {
    let text = req.body.text;
    let str = String(text);


    let productList = await productManager.find().lean();
    let userLogin = req.session.user.userLogin;
    let data = productList.filter((item) => {
        return (item.name.toLowerCase().includes(str.toLowerCase()));
    })

    res.render('ProductManager', {
        layout: 'main',
        data: data,
        status: userLogin.permission === 'ADMIN',
    });
})


app.get("/userAPI", async (req, res, next) => {


    let api = await userManager.find().lean();

    res.json(api);
});
app.get("/productAPI", async (req, res, next) => {


    let api = await productManager.find().lean();

    res.json(api);
})

