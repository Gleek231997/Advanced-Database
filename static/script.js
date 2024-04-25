var content = document.getElementById("content");
var fetchTime = document.getElementById("fetch_time");
var resultLen = document.getElementById("result_len");

$("#close-dialog").on("click", () => {
    $("#dialog-info").css("display", "none");
    $("#top-metrics-cards").css("display", "block");

});

function btnSearch(){
    var search_type = $("#search_option").val().toLowerCase();
    var searchWord = $('#search_word').val();
    var startDate = $('#start_date').val();
    var endDate = $('#end_date').val();
    
    
    if(searchWord.trim()===""){
        alert("Please enter a search word!!!");
        return;
    }
    else{
        var parsedStartDate = startDate ? Date.parse(startDate) : "na";
        var parsedEndDate = endDate ? Date.parse(endDate) : "na";

        fetchsearchresult(search_type, searchWord, parsedStartDate, parsedEndDate);
    }
}


function getTopmetrics(type){
    console.log('test');
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/metric/"+type,
        dataType: "json",
        success: topmetric_feed,
        error: function(xrh, status, error) { alert("Error in fetching data.") }
    });
}

const fetchsearchresult = (type, word, sDate, eDate) => {
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/"+type +"/"+ word +"/"+ sDate +"/"+ eDate,
        dataType: "json",
        success: search_feed,
        error: function(xrh, status, error) { alert("Error in fetching data.") }
    });
}


function topmetric_feed(response){
    $("#top-metrics-cards").css("display", "none");
    $("#top-metrics-cards").empty();
    $("#top-metrics-user").css("display", "none");
    $("#table-body").empty();
    resultLen.innerHTML = "";
    if(response.type == "users")
    {
        $("#search-time").text(response.fetch_time * 1000 + " ms");
        var tableBody = document.getElementById('table-body');
        response.data[0].forEach(function(entry) {
            var row = document.createElement('tr');
            for (var key in entry) {
                var cell = document.createElement('td');
                cell.textContent = entry[key];
                row.appendChild(cell);
            }
            tableBody.appendChild(row);
            $("#top-metrics-user").css("display", "block");

        });
    }
    else
    {
        response.data[0].forEach(function(item) {
            var truncatedText;
            if (item.text.length > 100) {
                truncatedText = item.text.substring(0, 100) + '...';
            } else {
                var spacesToAdd = 100 - item.text.length;
                truncatedText = item.text + ' '.repeat(spacesToAdd);
            }
            var card = $("<article>").addClass("card");
            var header = $("<header>");
            var heading = $("<h2>").text(item.screen_name);
            header.append(heading);
            var image = $("<img>").attr("src", "/static/icon.png").attr("alt", "Profile");
            var content = $("<div>").addClass("content");
            var paragraph = $("<p>").text(truncatedText);
            content.append(paragraph);
            card.append(header, image, content);
            $("#top-metrics-cards").append(card);
            $("#top-metrics-cards").css("display", "block");

          });       
    }
    //content.innerHTML = feedStr;
}

function search_feed(response){
    $("#top-metrics-cards").css("display", "none");
    $("#top-metrics-cards").empty();
    $("#top-metrics-user").css("display", "none");
    $("#table-body").empty();
    var type = response.type;
    var res =  type == 'users' ? response.data : response.data.data;
    fetchTime.innerHTML = "Search Time: " + (response.data.fetch_time * 1000) + " ms";
    if (res == null)  
    {
        resultLen.innerHTML = "No Data found."
    }
    res.slice(0, 100).forEach(function(tweet) {
            var card = $("<article>").addClass("card");
            var header = $("<header>");
            var image = $("<img>");
            var content = $("<div>")
            if (type == 'users')
            {
                header.innerHTML = "Twitter Handle:"
                var heading = $("<h3>").text(tweet.screen_name);
                header.append(heading);
                image = $("<img>").attr("src", "/static/icon.png").attr("alt", "Profile").attr("onclick", "authorclick(" +tweet.id_str+ ")");
                content = $("<div>").addClass("content");
                var breaks = $("</br>");
                if(tweet.id_str != undefined){
                    var authour = $("<div>").attr("onclick", "authorclick(" +tweet.id_str+ ")").attr("class", "hyperlink").text("User Tweets")
                    content.append(authour);
                }
                if(tweet.name != undefined){
                    var name = $("<div>").text("User Name: " +tweet.name)
                    content.append(name);
                }
                if(tweet.followers_count != undefined){
                    var followers_count = $("<div>").text("Follwers: " +tweet.followers_count)
                    content.append(followers_count);
                }
                if(tweet.friends_count != undefined){
                    var friends_count = $("<div>").text("Friends: " +tweet.friends_count)
                    content.append(friends_count);
                }
            }
            else
            {
                header.innerHTML = "Tweeted Time:"
                var heading = $("<h5>").text(tweet.created_at);
                header.append(heading);
                var image = $("<img>").attr("src", "/static/icon.png").attr("alt", "Profile").attr("onclick", "authorclick(" +tweet.user_id_str+ ")");
                var content = $("<div>").addClass("content");
                var breaks = $("</br>");
                if(tweet.user_id_str != undefined){
                    var authour = $("<div>").attr("onclick", "authorclick(" +tweet.user_id_str+ ")").attr("class", "hyperlink").text("Author Profile")
                    content.append(authour);
                }
                if(tweet.id_str != undefined){
                    var retweet = $("<div>").attr("onclick", "ReTweetsList(" +tweet.id_str+ ")").attr("class", "hyperlink").text("Retweets")
                    content.append(retweet);
                }
                if(tweet.favorite_count != undefined){
                    var fav_count = $("<div>").text("Liked: " +tweet.favorite_count)
                    content.append(fav_count);
                }
                if(tweet.screen_name != undefined){
                    var screen_name = $("<div>").text("Twitter Handle: " +tweet.screen_name)
                    content.append(screen_name);
                }
                if(tweet.followers_count != undefined){
                    var screen_name = $("<div>").text("Follwers: " +tweet.followers_count)
                    content.append(followers_count);
                }
                if(tweet.friends_count != undefined){
                    var screen_name = $("<div>").text("Friends: " +tweet.friends_count)
                    content.append(friends_count);
                }
                if(tweet.text != undefined){
                    var truncatedText;
                    if (tweet.text.length > 100) {
                        truncatedText = tweet.text.substring(0, 100) + '...';
                    } else {
                        var spacesToAdd = 100 - tweet.text.length;
                        truncatedText = tweet.text + ' '.repeat(spacesToAdd);
                    }
                    var paragraph = $("<p>").text(truncatedText);
                    content.append(breaks);
                    content.append(breaks);
                    content.append(paragraph);
                }
            }

            card.append(header, image, content);
                $("#top-metrics-cards").append(card);
                $("#top-metrics-cards").css("display", "block");

          });  
}

const authorclick = (id) => {
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/author/"+ id,
        dataType: "json",
        success: authorDialog,
        error: function(xrh, status, error) { alert("Error in fetching data.") }
    });
}

const ReTweetsList = (id) => {
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/retweet/"+ id,
        dataType: "json",
        success: ReTweetsListfeed,
        error: function(xrh, status, error) { alert("Error in fetching data.") }
    });
}

function authorDialog(response){
    var res = response.data;
    fetchTime.innerHTML = "Search Time: " + (response.data.fetch_time * 1000) + " ms";
    resultLen.innerHTML = res.data.length + " tweets found.";

    var dialogContent = '';
    dialogContent += '<div>';
    dialogContent += '<p>Screen Name: ' + response.data['data'][0].screen_name + '</p>';
    response.data['data'].forEach(function(item) {
        dialogContent += '<p>Created At: ' + item.created_at + '</p>';
        dialogContent += '<p>ID: ' + item.id_str + '</p>';
        dialogContent += '<p>Tweet: ' + item.text + '</p>';
        dialogContent += '<p>Retweet Count: ' + item.retweet_count + '</p>';
    });
    dialogContent += '</div>';
    $('#dialog-info div').html(dialogContent);
    $('#dialog-info').css('display', 'block');
    $("#top-metrics-cards").css("display", "none");
}

function ReTweetsListfeed(response){
    var res = response.data;
    fetchTime.innerHTML = "Search Time: " + (response.data.fetch_time * 1000) + " ms";
    resultLen.innerHTML = res.data.length + " tweets found.";

    var dialogContent = '';
    dialogContent += '<div>';
    dialogContent += '<p>Screen Name: ' + response.data['data'][0].screen_name + '</p>';
    response.data['data'].forEach(function(item) {
        dialogContent += '<p>Created At: ' + item.created_at + '</p>';
        dialogContent += '<p>ID: ' + item.id_str + '</p>';
        dialogContent += '<p>Tweet: ' + item.text + '</p>';
        dialogContent += '<p>Retweet Count: ' + item.retweet_count + '</p>';
    });
    dialogContent += '</div>';
    $('#dialog-info div').html(dialogContent);
    $('#dialog-info').css('display', 'block');
    $("#top-metrics-cards").css("display", "none");
}

