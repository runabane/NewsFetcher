var xhttp = new XMLHttpRequest();

const path = "https://newsapi.org/v2/";

const apiKey = "da4646822a65479cba15d2e6a7c13b92";

let language = "de";

const QueryType = {
    TOP_HEADLINE: "top-headlines",
    EVERYTHING: "everything",
};


window.onload = () => {
    getTopHeadline(language);
};

/**
 * erstellt query
 * @param queryType QueryType
 * @param queryMap object query map : Map
 * @returns {string} query
 */
const createQuery = (queryType, queryMap) => {
    let queryString = path + queryType + "?";
    for(let [key, value] of queryMap){
        queryString += key + "=" + value + "&";
    }
    queryString += "apiKey=" + apiKey;
    return queryString;
};

const getTopHeadline = async (language) => {
    let queryMap = new Map();
    queryMap.set("country", language);

    let query = createQuery(QueryType.TOP_HEADLINE, queryMap);

    await queryCall("GET", query).then(value => {
        let jsonValue = JSON.parse(value);

        let trendingNews = document.getElementById("trending-news");

        if(trendingNews.innerHTML !== null) trendingNews.innerHTML = "";

        jsonValue.articles.map((article, index) => {
                createNewsCard(trendingNews, article, index);
            }
        );
        }
    );
};

const createNewsCard = (parent, article, index) => {
    console.log(index);
    // erstellt div container fuer ein news
    let div = document.createElement('div');
    div.id = "trending_news_" + index;
    div.classList.add("flex-direction-column");
    div.classList.add("information-card");

    div.addEventListener('click', () => {
        window.open(article.url, "_blank").focus();
    });

    // erstellt thumbnail
    if(article.urlToImage !== null){
        div.style.backgroundImage = `url('${article.urlToImage}')`;
    } else {
        div.style.backgroundColor = "grey";
    }

    let subDiv_title = document.createElement('div');
    subDiv_title.classList.add("flex-direction-column");
    subDiv_title.classList.add("sub-card");

    // erstellt ein title mit titleText
    let titleText = document.createElement('div');
    titleText.classList.add("news-title-text");
    let titleNode = document.createTextNode(article.title);
    titleText.appendChild(titleNode);

    subDiv_title.appendChild(titleText);


    div.appendChild(subDiv_title);


    // append in Elternknoten für trending
    parent.appendChild(div);
};

const queryCall = async (action, url) => {
    return new Promise(function(resolve, reject) {
        xhttp.open(action, url, true);
        xhttp.onreadystatechange = () => {
            if (xhttp.status === 200 && xhttp.readyState === 4) {
                resolve(xhttp.responseText);
            }
        };
        xhttp.send();
    })
};

