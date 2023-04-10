console.log("Add user");
let name = document.getElementById("fullnameID");
let email = document.getElementById("emailID");
let pass = document.getElementById("passwordID");
let pass2 = document.getElementById("passwordID2");
let textErr = document.getElementsByClassName('err');
let from = document.getElementById('login');
let sumbit = document.getElementById('submitID');
let check = true;

const validate = () => {
    if (name.value == "") {
        textErr[0].innerHTML = "Không được để trống tên";
        textErr[0].style.color = "red";
        check = false;
    } else {
        textErr[0].innerHTML = "";
        check = true;
    }

    let check_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;

    if (email.value == '') {
        textErr[1].innerHTML = 'Không được để trống email !';
        textErr[1].style.color = 'red';
        check = false;
    } else {
        if (check_email.exec(String(email.value))) {
            textErr[1].style.display = 'none';
            check = true;
        } else {
            textErr[1].innerHTML = 'Không đúng định dạng email !';
            textErr[1].style.color = 'red';
            check = false;
        }
    }

    if (pass.value == "") {
        textErr[2].innerHTML = "Không được để trống mật khẩu";
        textErr[2].style.color = "red";
        check = false;
    } else {
        textErr[2].innerHTML = "";
        check = true;
    }

    if (pass2.value == "") {
        textErr[3].innerHTML = "Không được để trống mật khẩu";
        textErr[3].style.color = "red";
        check = false;
    } else {
        if (pass2.value === pass.value) {
            textErr[3].innerHTML = "";
            check = true;
        } else {
            textErr[3].innerHTML = "Mật khẩu không khớp";
            textErr[3].style.color = "red";
            check = false;
        }
    }

    if(check){
        register();
    }
}

const register = ()=>{
    from.onsubmit= ()=>{
        return true;
    }
    from.action= "/register";
    console.log("hihi");
}

sumbit.onclick = ()=>{
    validate();
}

