var db_name = 'resto_hunt'
var db_ver = '1.0'
var db_desc = 'Restaurant database for web app'
var db_size = 5 * 1024 * 1024;
var zomatoApiKey = "23555a9bad6314b88f9763385d010709"

database = openDatabase(db_name,db_ver,db_desc,Number(db_size));

function signup(){
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var phone = document.getElementById('phoneNumber').value;

    if(phone=="" || email=="" || password == "" || phone == "" || name == ""){
        alert("Please provide complete details!");
    } else{
        database.transaction(function(tx){
            tx.executeSql('INSERT INTO users (ID,name,email,phone, password) VALUES (?,?,?,?,?)',['1',name,email,phone,password]);
            alert('Successfully signed up!')
            localStorage.setItem('isLogin','True');
            localStorage.setItem('user',name)
            alert('Logged In as : '+name);
            window.location.replace('./index.html');
        }); 
    }
}