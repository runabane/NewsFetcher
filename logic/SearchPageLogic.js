import {queryCall} from "LogicManager.js";

const getNewsFromSearching = async () => {
    let queryText = document.getElementById("search-bar-input").value;
    let queryMap = new Map();
    let date = new Date();

    date.setMonth(date.getMonth() - 1 >= 0 ? date.getMonth() - 1 : 11);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    date.toISOString();

    queryMap.set("q", queryText);
    queryMap.set("country", "de");
    queryMap.set("language", language);
    queryMap.set("to", date);

    let queryString = createQuery(QueryType.EVERYTHING, queryMap);

    await queryCall("GET", queryString).then(value => {
        let jsonValue = JSON.parse(value);

        let searchBarResult = document.getElementById("search-result");
        if(searchBarResult.innerHTML !== null) searchBarResult.innerHTML = "";

        jsonValue.map((article, index) => {
                createSearchedNews(searchBarResult, article, index);
        })
        }
    )
};

const createSearchedNews = (parent, article, index) => {
    let div = document.createElement('div');
    div.id = "searched_news_" + index;
    div.classList.add("flex-direction-column");

    // erstellt thumbnail
    if(article.urlToImage !== null){
        div.style.backgroundImage = `url('${article.urlToImage}')`;
        let img = document.createElement("img");
        img.src = article.urlToImage;
        img.height = 125;
        img.width = 125;
    }

    let titleDiv = document.createElement('div');

    let sourceNode = document.createTextNode(article.source.name);
    let titleNode = document.createTextNode(article.title);
    let descNode = document.createTextNode(article.description);
    let dateNode = document.createTextNode(dateString(article.publishedAt));

    titleDiv.appendChild(sourceNode);
    titleDiv.appendChild(titleNode);
    titleDiv.appendChild(descNode);
    titleDiv.appendChild(dateNode);
} ;

const dateString = (publishedAt) => {
    let timeString;
    let currentDate = new Date();

    let publishedDate = Date.parse(publishedAt);

    let dateDiff = currentDate - publishedDate;

    if(dateDiff.getYear() > 0){
        timeString = `${dateDiff.getYear} years ago`
    }

    return "";
};



const form = document.getElementById('search-bar-container');

form.addEventListener('submit', getNewsFromSearching());
