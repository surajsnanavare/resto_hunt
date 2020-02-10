$(function() {
    // var zomatoApiKey = "7ecae529fc89c1c07c86c2c912ca7b88"
    var zomatoApiKey = "23555a9bad6314b88f9763385d010709"

    // var id =  '2306';
    // var url = "https://developers.zomato.com/api/v2.1/search?entity_type=city&entity_id=3&sort=rating"
    // var reviews_url = 'https://api.zomato.com/v1/reviews.json/18591040/user?count=0&apikey=' + zomatoApiKey
    // var url2 = "https://developers.zomato.com/api/v2.1/search?entity_id=3&entity_type=city&start=sort=rating"
    var db_name = 'resto_hunt'
    var db_ver = '1.0'
    var db_desc = 'Restaurant database for web app'
    var db_size = 5 * 1024 * 1024;

	var resto_hunt = {}
	resto_hunt.init = {}
    resto_hunt.init.db = {}
    resto_hunt.init.users = [
        ['1','Suraj Nanavare','suraj.n@mailinator.com','9623299399','Suraj@123'],
        ['2','Vishal Mane','vishal@mailinator.com','9623299400','Vishal@123'],
        ['3','Rakesh Masal','rakesh@mailinator.com','9623299401','Rakesh@123'],
        ['4','Mahesh Patil','mahesh@mailinator.com','9623299402','Mahesh@123'],
        ['5','Sandeep Kale','sandeep.k@mailinator.com','9623299403','Sandeep@123']
    ];
    resto_hunt.init.cities = [
        ['2306','Airoli'],
        ['114428','Rabale'],
        ['2125','Ghansoli'],
        ['2302','Kopar Khairane'],
        ['2304','Nerul'],
        ['2123','Sea Woods'],
        ['2305', 'CBD Belapur'],
        ['2307', 'Kharghar'],
        ['97656', 'New Panvel'],
        ['97655', 'Old Panvel']
    ];


    // Holding database instance inside a global variable
    resto_hunt.init.open = function(){
        resto_hunt.init.db = openDatabase(db_name,db_ver,db_desc,Number(db_size));
        // dbname, verison, desc, size
    };

    resto_hunt.init.createTable = function(){
		var database = resto_hunt.init.db;
		database.transaction(function(tx){
            tx.executeSql('CREATE TABLE IF NOT EXISTS restaurants (ID INTEGER PRIMARY KEY ASC,name VARCHAR,address TEXT,overall_rating VARCHAR,reviews TEXT,ref_links TEXT,thumbnail TEXT,city VARCHAR)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS users (ID INTEGER PRIMARY KEY ASC,name VARCHAR,email TEXT,phone VARCHAR, password VARCHAR,created_at VARCHAR)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS cities (ID INTEGER PRIMARY KEY ASC,name VARCHAR,created_at VARCHAR)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS reviews (ID INTEGER PRIMARY KEY ASC,resto_id TEXT,user_name VARCHAR,rating VARCHAR,review TEXT, created_at VARCHAR)');
		});
    }

    resto_hunt.init.populateUsers = function(){
        var users = resto_hunt.init.users;
        users.forEach(data => {
            var database = resto_hunt.init.db;
            database.transaction(function(tx){
                tx.executeSql('INSERT INTO users (ID,name,email,phone, password) VALUES (?,?,?,?,?)',[data[0],data[1],data[2],data[3],data[4]]);
            });                
        });
    }

    resto_hunt.init.populateCities = function(){
        var cities = resto_hunt.init.cities;
        cities.forEach(data => {
            var database = resto_hunt.init.db;
            database.transaction(function(tx){
                tx.executeSql('INSERT INTO cities (ID,name) VALUES (?,?)',[data[0],data[1]]);
            });                
        });
    }

    resto_hunt.init.populateRestaurants = function(){
        var cities = resto_hunt.init.cities;
        cities.forEach(data => {
            var database = resto_hunt.init.db;
            var id = data[0];
            $.ajax({
                url: "https://developers.zomato.com/api/v2.1/search?entity_type=subzone&entity_id="+id+"&sort=rating",
                type: 'get',
                headers: {
                    'user-key': zomatoApiKey
                },
                success: function (data) {
                    data.restaurants.forEach(item => {
                        item = item.restaurant;
                        database.transaction(function(tx){
                            tx.executeSql('INSERT INTO restaurants (ID,name,address,overall_rating,reviews,ref_links,thumbnail,city) VALUES (?,?,?,?,?,?,?,?)',[item.id,item.name,item.location.address,item.user_rating.aggregate_rating,[],[item.url],item.featured_image,item.location.locality]);
                        });                           
                    });
                }
            });
        });
    }

    resto_hunt.init.populateReviews  = function() {
        var database = resto_hunt.init.db;
        database.transaction(function(tx){
            tx.executeSql('SELECT * FROM restaurants LIMIT 4',[],function(tx,result){
                for(var i=0; i< result.rows.length;i++){
                    var item = result.rows.item(i);
                    var resto_id = item.ID;
                    // console.log(i,resto_id);
                    $.ajax({
                        url:  'https://api.zomato.com/v1/reviews.json/'+resto_id+'/user?count=2&apikey=' + zomatoApiKey,
                        type: 'get',
                        success: function (data) {
                            var reviews = data.userReviews;
                            reviews.forEach(item => {
                                var review = item.review;
                                var database2 = resto_hunt.init.db;
                                // console.log(resto_id);
                                database2.transaction(function(tx2){
                                    tx2.executeSql('INSERT INTO reviews (ID,resto_id,user_name,rating,review,created_at) VALUES (?,?,?,?,?,?)',[review.id,resto_id,review.userName,review.rating,review.reviewText,review.reviewTimeFriendly]);
                                });                                
                            });
                        }
                    });
                }
            })
        })        
    }

    resto_hunt.init.loadCityDropdown = function() {
        var database = resto_hunt.init.db;
        database.transaction(function(tx){
            tx.executeSql('SELECT DISTINCT city FROM restaurants',[],function(tx,result){
                var list = $('#citySelect');
                list.empty();
                for(var i=0; i< result.rows.length;i++){
                    list.append('<option id="' + result.rows[i].city + '">'+ result.rows[i].city + '</option>');
                }  
            })
        })
    }

    resto_hunt.init.loadRestaurant = function (city) {
        if(city==undefined){
            city = "New Panvel";
            var database = resto_hunt.init.db;
            database.transaction(function(tx){
                tx.executeSql('SELECT * FROM restaurants WHERE city="'+city+'" LIMIT 1',[],function(tx,result){
                var restos = $('#restos');
                restos.empty();
                for(var i=0; i< result.rows.length;i++){
                    var resto = result.rows[i];
                    restos.append('<div style="padding:10px;"> '+
                        '<a href="restaurant.html" style="text-decoration: none;color: black;"> '+
                            '<div class="card" style="width: 18rem;padding: 0px 10px;"> '+
                                '<img style="padding-top: 15px;" src="'+ resto.thumbnail +'" class="card-img-top" width="100px">'+
                                '<div class="card-body" style="padding: 15px 0px;">'+
                                '<h5 class="card-title">'+ resto.name +'</h5>'+
                                '<h6 class="card-text"><small>'+ resto.address +'</small></h6>'+
                                '<span>Rating:&nbsp;&nbsp;</span>'+
                                    '<span class="rating-emoji" id="emoji-'+i+'1">😠</span>'+
                                    '<span class="rating-emoji" id="emoji-'+i+'2>😦</span>'+
                                    '<span class="rating-emoji" id="emoji-'+i+'3>😑</span>'+
                                    '<span class="rating-emoji" id="emoji-'+i+'4>😀</span>'+
                                    '<span class="rating-emoji" id="emoji-'+i+'5>😍</span>'+
                                '</div>'+
                            '</div>'+
                        '</a>'+
                    '</div>');
                    var emoji_rating_active = "false";
                    if(resto.rating > 0 && resto.rating <=1){
                       emoji_rating = "😍";
                    }else if(resto.rating > 1 && resto.rating <=2){
                       emoji_rating = "😍";
                    }else if(resto.rating > 1 && resto.rating <=2){
                       emoji_rating = "😍";
                    }else if(resto.rating > 1 && resto.rating <=2){
                       emoji_rating = "😍";
                    }else if(resto.rating > 1 && resto.rating <=2){
                       emoji_rating = "😍";
                    }

                }
                })
            })
        }        

    }
    function init(){
        if(typeof(openDatabase) !== 'undefined')
        {
            resto_hunt.init.open();
            // resto_hunt.init.createTable();
            // resto_hunt.init.populateUsers();
            // resto_hunt.init.populateCities();
            // resto_hunt.init.populateRestaurants();
            // resto_hunt.init.populateReviews();
            resto_hunt.init.loadCityDropdown();
            resto_hunt.init.loadRestaurant();
        }
        else
        {
            $('#bodyWrapper').html('&lt;h2 class=&quot;error_message&quot;&gt; Your browser does not support webSql&lt;/h2&gt;');
        }
    }
    init();
});