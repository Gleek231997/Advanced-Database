function btnSearch(){
    search_type = document.getElementById("search-type").value;
    searchWord = document.getElementById("search-input").value;
    startDate = document.getElementById("start_date").value;
    endDate = document.getElementById("end_date").value;

    if(searchWord.trim()===""){
        alert("Please enter a search word!!!");
        return;
    }
    if(startDate==="") startDate="na";
    else startDate=Date.parse(startDate);
    if(endDate==="") endDate="na";
    else endDate=Date.parse(endDate);

    fetchsearchresult(searchType, searchWord, startDate, endDate);
}

const fetchsearchresult = (type, word, sDate, eDate) => {
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/"+type +"/"+ word +"/"+ sDate +"/"+ eDate,
        dataType: "json",
        success: buildFeed,
        error: function(xrh, status, error) { alert("Error in fetching data.") }
    });
}