var db_name = 'resto_hunt'
var db_ver = '1.0'
var db_desc = 'Restaurant database for web app'
var db_size = 5 * 1024 * 1024;
// var zomatoApiKey = "23555a9bad6314b88f9763385d010709"
var zomatoApiKey = "7ecae529fc89c1c07c86c2c912ca7b88"

database = openDatabase(db_name,db_ver,db_desc,Number(db_size));

if(localStorage.getItem('isLogin') !='True' && window.location.href.indexOf('login.html') ==-1){
    window.location.replace('./login.html');
}

function loadRestaurant(obj) {
    var selectedCity = obj.options[obj.selectedIndex].value;
    database.transaction(function(tx){
        tx.executeSql('SELECT * FROM restaurants WHERE city="'+selectedCity+'" ORDER BY overall_rating DESC',[],function(tx,result){
            var restos = $('#restos');
            restos.empty();
            for(var i=0; i< result.rows.length;i++){
                var resto = result.rows[i];
                var active_1 = active_2 = active_3 = active_4 = active_5 = '';
        
                if(resto.overall_rating > 0 && resto.overall_rating <=1){
                    active_1 = 'active';
                }else if(resto.overall_rating > 1 && resto.overall_rating <=2){
                    active_2 = 'active';
                }else if(resto.overall_rating > 2 && resto.overall_rating <=3){
                    active_3 = 'active'; 
                }else if(resto.overall_rating > 3 && resto.overall_rating <=4){
                    active_4 = 'active';
                }else if(resto.overall_rating > 4 && resto.overall_rating <=5){
                    active_5 = 'active';
                }
        
                var emoji = '<span class="rating-emoji '+active_1+'">😠</span>'+
                            '<span class="rating-emoji '+active_2+'">😦</span>'+
                            '<span class="rating-emoji '+active_3+'">😑</span>'+
                            '<span class="rating-emoji '+active_4+'">😀</span>'+
                            '<span class="rating-emoji '+active_5+'">😍</span>';
        
                restos.append('<div style="padding:10px;"> '+
                    '<a href="restaurant.html?restoId='+ resto.ID +'" style="text-decoration: none;color: black;"> '+
                        '<div class="card" style="width: 18rem;padding: 0px 10px;height:350px"> '+
                            '<img style="padding-top: 15px;" src="'+ resto.thumbnail +'" class="card-img-top" width="100px" height="200px">'+
                            '<div class="card-body" style="padding: 15px 0px;">'+
                                '<h5 class="card-title">'+ resto.name +'</h5>'+
                                '<h6 class="card-text"><small><p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" title="'+ resto.address +'">'+ resto.address +'</p></small></h6>'+
                                '<span>Rating:&nbsp;&nbsp;</span>'+ emoji +
                            '</div>'+
                        '</div>'+
                    '</a>'+
                '</div>');
            }
        })
    })
}

var a = window.location.toString();
if(a.indexOf("restaurant.html")!=-1){
    if(a.indexOf("=")!=-1 && a.indexOf("?")!=-1){
        var restoId = a.substring(a.indexOf("=")+1);
        database.transaction(function(tx){
            tx.executeSql('SELECT * FROM restaurants WHERE ID="'+restoId+'"',[],function(tx,result){
                var restoDetails = $('#main');
                $('#main').empty();

                for(var i=0; i< result.rows.length;i++){
                    var restoDetail = result.rows[i];
                    var active_1 = active_2 = active_3 = active_4 = active_5 = '';

                    if(restoDetail.overall_rating > 0 && restoDetail.overall_rating <=1){
                        active_1 = 'active';
                    }else if(restoDetail.overall_rating > 1 && restoDetail.overall_rating <=2){
                        active_2 = 'active';
                    }else if(restoDetail.overall_rating > 2 && restoDetail.overall_rating <=3){
                        active_3 = 'active'; 
                    }else if(restoDetail.overall_rating > 3 && restoDetail.overall_rating <=4){
                        active_4 = 'active';
                    }else if(restoDetail.overall_rating > 4 && restoDetail.overall_rating <=5){
                        active_5 = 'active';
                    }

                    var emoji = '<span class="rating-emoji-l '+active_1+'">😠</span>'+
                                '<span class="rating-emoji-l '+active_2+'">😦</span>'+
                                '<span class="rating-emoji-l '+active_3+'">😑</span>'+
                                '<span class="rating-emoji-l '+active_4+'">😀</span>'+
                                '<span class="rating-emoji-l '+active_5+'">😍</span>';


                    restoDetails.append('<div class="row" style="padding: 35px 50px;">'+
                        '<div class="col-sm-12 col-md-6 col-lg-6" style="padding: 0px 50px;">'+
                            '<img style="padding-top: 15px;" src="'+ restoDetail.thumbnail+'" class="card-img-top" width="100%">'+
                        '</div>'+
                        '<div class="col-sm-12 col-md-6 col-lg-6" style="padding: 10px 50px;" >'+
                            '<h3>'+ restoDetail.name +'</h3>'+
                            '<h6 class="card-text"><small>'+ restoDetail.address +'</small></h6>'+
                            '<span>  <h5 class="card-title rating-review">'+ restoDetail.overall_rating +'</h5> </span> '+ emoji + 
        
                            '<div class="card" style="padding: 0px 10px;margin: 10px 1px;">'+
                                '<div class="card-body" style="padding: 8px 3px;">'+
                                    '<div class="row">'+
                                        '<div class="col-sm-10 col-md-10 col-lg-10">'+
                                            '<a href="https://www.google.com/search?q='+ restoDetail.name + restoDetail.address +'" target="blank"><h6 class="card-text"><small>https://www.google.com/search?q='+ restoDetail.name + restoDetail.address +'</small></h6></a>' +
                                        '</div>'+
                                        '<div class="col-sm-2 col-md-2 col-lg-2" style="padding: 0px;">'+
                                            '<center> '+
                                                '<a href="'+ restoDetail.ref_links +'" target="blank"><img src="./img/link.png" width="30px"/></a>'+
                                            '</center>'+
                                        '</div>'+
                                    '</div>'+    
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>')}    
            })
        })

        database.transaction(function(tx){
            tx.executeSql('SELECT * FROM reviews WHERE resto_id="'+restoId+'"',[],function(tx,result){
                var reviews = $('#reviews');
                $('#reviews').empty();
                for(var i=0; i< result.rows.length;i++){
                    var review = result.rows[i];
                    if(review.review){
                        reviews.append(
                            '<div class="card" style="padding: 0px 10px;margin: 10px 1px;justify-content: center;">'+
                            '<div class="row no-gutters">'+
                                '<div class="col-md-12 p-2">'+
                                    '<div style="display: flex;">'+
                                        '<h5 class="card-title rating-review">'+review.rating+'</h5>'+
                                        '<h5 class="card-title" style="padding: 7px 9px;margin: 2px 0px;"><b>'+review.user_name+'</b></h5>'+
                                    '</div>'+
                                    '<p class="card-text" style="padding-top: 1px;">'+review.review+'</p>'+
                                '</div>'+
                            '</div>'+
                        '</div>'
                        );
                    }
                }
            })

            $.ajax({
                url:  'https://api.zomato.com/v1/reviews.json/'+restoId+'/user?count=3&apikey=' + zomatoApiKey,
                type: 'get',
                success: function (data) {
                    var reviews = data.userReviews;
                    reviews.forEach(item => {
                        var review = item.review;
                        var reviews = $('#reviews');
                        if(review.reviewText==""){
                            review.reviewText = "<i style='opacity:0.4'>No review added!</i>"
                        }
                        reviews.append(
                            '<div class="card" style="padding: 0px 10px;margin: 10px 1px;justify-content: center;">'+
                            '<div class="row no-gutters">'+
                                '<div class="col-md-12 p-2">'+
                                    '<div style="display: flex;">'+
                                        '<h5 class="card-title rating-review">'+review.rating+'</h5>'+
                                        '<h5 class="card-title" style="padding: 7px 9px;margin: 2px 0px;"><b>'+review.userName+'</b></h5>'+
                                    '</div>'+
                                    '<p class="card-text" style="padding-top: 1px;">'+review.reviewText+'</p>'+
                                '</div>'+
                            '</div>'+
                        '</div>'
                        )
                            // review.id,resto_id,review.userName,review.rating,review.reviewText,review.reviewTimeFriendly
                    });
                }
            });
        })
    }else{
        alert('Restaurant not found!😑');
    }
}

function login() {
    var phoneNumber = document.getElementById('phoneNumber').value;
    var password = document.getElementById('password').value;
    
    if(phoneNumber=="" || password==""){
        alert('Please enter username & password!');
    }else{
        database.transaction(function(tx){
            tx.executeSql('SELECT * FROM users WHERE phone='+phoneNumber+' and password="'+password+'"',[],function(tx,result){
                if(result.rows.length>0){
                    localStorage.setItem('isLogin','True');
                    alert('Logged in as '+result.rows[0].name);
                    localStorage.setItem('user',result.rows[0].name);
                    window.location.replace('./index.html')
                }else{
                    alert('Wrong username/password!');
                    localStorage.setItem('isLogin','False');
                    window.location.replace('./login.html')
                }
            })
        })    
    }
}

function logout() {
    localStorage.setItem('isLogin','False');
    localStorage.setItem('user','');
    window.location.replace('./login.html')
}

function selectRating(obj) {
    var selectedId = obj.id;
    var imojiRatings = document.getElementsByName('emojiRate');
    for(var i=0;i<imojiRatings.length;i++){
        if(selectedId == 'emoji-'+(i+1)){
            obj.style.opacity='1';
            document.getElementById('finalRating').value = (i+1);
        }else{
            imojiRatings[i].style.opacity="0.2";
        }
    }
}

function addReview() {
    var rating = document.getElementById('finalRating').value;
    var review = document.getElementById('finalReview').value;
    if(rating == 0){
        alert("Please select rating first! 😠 😦 😑 😀 😍");
    }else{
        var user = localStorage.getItem('user');
        var resto_id = a.substring(a.indexOf("=")+1);
        if(review==""){ review=" "}
        var current_rating = 0;

        var ratingResult = ratingAnalysis(rating,review);
        database.transaction(function(tx){
            tx.executeSql('INSERT INTO reviews (resto_id,user_name,rating,review) VALUES (?,?,?,?)',[resto_id,user,rating,review]);
            
            tx.executeSql('SELECT * FROM restaurants WHERE ID="'+resto_id+'"',[],function(tx,result){
                current_rating = result.rows[0].overall_rating;
            })  
        });      

        database.transaction(function(tx){
            if(ratingResult > 0 && current_rating <= 4.8){
                tx.executeSql('UPDATE restaurants SET overall_rating= overall_rating+0.2 WHERE ID=?',[resto_id],function(tx,result){
                    alert("Thank you for your valuable feedback!😀");
                    location.reload();            
                })
            }else if(ratingResult < 0 && current_rating >=0.2){
                tx.executeSql('UPDATE restaurants SET overall_rating= overall_rating-0.2 WHERE ID='+resto_id,[],function(tx,result){
                    alert("Thank you for your valuable feedback!😀");
                    location.reload();            
                })
            }else{
                alert("Thank you for your valuable feedback!😀");
                location.reload();            
            }

        });
        if(ratingResult == 0){
            alert("Thank you for your valuable feedback!😀");
            location.reload();            
        }

    }    
}

function ratingAnalysis(rating,review) {
    var goodWords = [
      "tasty",
      "good",
      "wow",
      "loved",
      "delicious",
      "liked",
      "yummy",
      "recommend",
      "refer",
      "lovely",
      "nice",
      "best",
      "better",
      "wonderfull",
      "fresh",
      "mast",
      "chann",
      "avadla",
      "jabra",
      "jakas",
      "nad khula",
      "jinkalas",
      "zakkas"
    ];
    var badWords = [
        'bad',
        'not',
        'worst',
        'hate',
        'bakwas',
        'improvement',
        'unhygenic',
        'rotten',
        'old',
        'odour',
        'spicy',
        'not good'
    ]
    
    review = review.toLowerCase();
    var positiveScore = 0;
    var negativeScore = 0;

    goodWords.forEach(keyword => {
        if(review.indexOf(keyword)>-1){
            positiveScore = Number(positiveScore) + Number(1);
        }    
    });

    badWords.forEach(keyword => {
        if(review.indexOf(keyword)>-1){
            negativeScore = Number(negativeScore) + Number(1);
        }    
    });

    if(rating <=3){
        negativeScore = Number(negativeScore) + Number(1);
    }
    if(rating>3){
        positiveScore = Number(positiveScore) + Number(1);
    }

    var rating = Number(positiveScore) - Number(negativeScore);
    return rating
}
