let email = document.getElementById('emailID');
let password =  document.getElementById('passwordID');
let sumbit = document.getElementById('submitID');
let from = document.getElementById('login');
let textNotifi = document.getElementsByClassName('err');


const validate = ()=>{
    let tk = String(email.value);
    let mk = String(password.value);

    let check_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
    let check = true;
    if(tk == ''){
        textNotifi[0].innerHTML = 'Không được để chống email !';
        textNotifi[0].style.color = 'red';
        check = false;
    }else{
        
        if(check_email.exec(tk)){
            textNotifi[0].style.display = 'none';
        }else{
            textNotifi[0].innerHTML = 'Không đúng định dạng email !';
            textNotifi[0].style.color = 'red';
            check = false;
        }
    }

    if(mk == ''){
        textNotifi[1].innerHTML = 'Không được để chống mật khẩu!';
        textNotifi[1].style.color = 'red';
        check = false;
    }else{
        textNotifi[1].style.display = 'none';
    }

    if(check){
        login();
    }
    
}

const login = ()=>{
    from.onsubmit= ()=>{
        return true;
    }
    from.action= "/login";
    console.log("hihi");
}

sumbit.onclick = ()=>{
    validate();
}