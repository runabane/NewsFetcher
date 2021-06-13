window.onload = () => {
    let input_home = sessionStorage.getItem("input-value");
    let lang_home = sessionStorage.getItem("lang");
    if(lang_home !== null || lang_home !== ""){
        language = lang_home;
    }
    if(input_home !== null || input_home !== ""){
        document.getElementById("search-bar-input").value = input_home;
        getNewsFromSearching();
    }
};


const getNewsFromSearching = async () => {
    let queryText = document.getElementById("search-bar-input").value;
    let queryMap = new Map();
    let date = new Date();

    date.setMonth(date.getMonth() - 1 >= 0 ? date.getMonth() - 1 : 11);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    let stringDate = `${date.getFullYear()}-${numConverter(date.getMonth() + 1 < 11 ? date.getMonth() + 1 : 0)}-${numConverter(date.getDate())}T${numConverter(date.getHours())}:${numConverter(date.getMinutes())}:${numConverter(date.getSeconds())}`;

    queryMap.set("q", queryText);
    queryMap.set("language", language);
    queryMap.set("from", stringDate);

    let queryString = createQuery(QueryType.EVERYTHING, queryMap);

    await queryCall("GET", queryString).then(value => {
        let jsonValue = JSON.parse(value);

        console.log(jsonValue.articles.length);
        let searchBarResult = document.getElementById("search-result");

        if(searchBarResult.innerHTML !== null) searchBarResult.innerHTML = "";

        let totalArticle = document.createElement('div');
        let textNode = document.createTextNode(`Searched ${jsonValue.totalResults} articles`);
        totalArticle.style.marginLeft = "7%";
        totalArticle.style.marginTop = "2%";
        totalArticle.style.color = "grey";

        totalArticle.appendChild(textNode);
        totalArticle.classList.add("margin-bottom");

        searchBarResult.appendChild(totalArticle);

        if(jsonValue.articles.length === 0) returnEmpty(searchBarResult, queryMap.get("q"));
        jsonValue.articles.map((article, index) => {
                createSearchedNews(searchBarResult, article, index);
        })

        }
    )
};

const numConverter = (num) => {
    return num < 10 ? `0${num}` : num;
};

const createSearchedNews = (parent, article, index) => {
    let div = document.createElement('div');
    div.id = "searched_news_" + index;
    div.classList.add("flex-direction-row");
    div.classList.add("news-container");
    div.style.marginBottom = "30px";

    div.addEventListener('click', () => {
        window.open(article.url, "_blank").focus();
    });

    // erstellt thumbnail
    if(article.urlToImage !== null){
        let img = document.createElement("img");
        img.classList.add("margin-right");
        img.src = article.urlToImage;
        img.height = 125;
        img.width = 125;
        div.appendChild(img);
    }


    let textContainer = document.createElement('div');
    textContainer.classList.add("flex-directiob-column");

    let sourceDiv = document.createElement('div');
    sourceDiv.style.color = "grey";
    sourceDiv.classList.add("news-text-margin-bottom");
    let sourceNode = document.createTextNode(article.source.name + "\n");

    let titleDiv = document.createElement('div');
    titleDiv.classList.add("news-text-margin-bottom");
    titleDiv.style.fontWeight = "bold";
    titleDiv.style.fontSize = "20px";
    let titleNode = document.createTextNode(article.title + "\n");

    let descDiv = document.createElement('div');
    descDiv.classList.add("news-text-margin-bottom");
    descDiv.style.color = "grey";
    descDiv.style.fontSize = "15px";
    let descNode = document.createTextNode(article.description + "\n");

    let dateDiv = document.createElement('div');
    let convertDate = dateString(article.publishedAt);
    dateDiv.classList.add("news-text-margin-bottom");
    let dateNode = document.createTextNode(convertDate);
    dateDiv.style.color = "grey";

    sourceDiv.appendChild(sourceNode);
    titleDiv.appendChild(titleNode);
    descDiv.appendChild(descNode);
    dateDiv.appendChild(dateNode);

    textContainer.appendChild(sourceDiv);
    textContainer.appendChild(titleDiv);
    textContainer.appendChild(descDiv);
    textContainer.appendChild(dateNode);

    div.appendChild(textContainer);

    parent.appendChild(div);
} ;

const returnEmpty = (parent, query) => {
    let div = document.createElement('div');
    let textNode = document.createTextNode(`Search result for "${query}" is empty`);
    div.id = "search-empty";

    div.appendChild(textNode);
    parent.appendChild(div);
};

const dateString = (publishedAt) => {
    let timeString;
    let currentDate = new Date();

    let publishedDate = Date.parse(publishedAt);

    let dateDiff = new Date(currentDate - publishedDate);

    if(dateDiff.getFullYear() > 1970){
        timeString = `${dateDiff.getFullYear() - 1970} years ago`
    } else if(dateDiff.getMonth() > 1){
        timeString = `${dateDiff.getMonth()} Months ago`
    } else if(dateDiff.getDate() > 7){
        console.log(dateDiff.getDate());
        timeString = `${Math.floor(dateDiff.getDate()/7)} Weeks ago`
    } else if(dateDiff.getDate() > 1) {
        timeString = `${dateDiff.getDate()} Days ago`
    } else {
        timeString = `Today`
    }

    return timeString;
};



const form = document.getElementById("search-bar-button");

form.addEventListener('click', getNewsFromSearching);

window.addEventListener('keydown', (e) => {
    if(e.key === "Enter"){
        e.preventDefault();
        getNewsFromSearching();
    }
});

document.getElementById("logo").addEventListener("click", () => {
    window.location.href = "/NewsFetcher/index.html";
});

const scrollHandler = () => {
    let header = document.getElementById("search-bar-placeholder");
    this.scrollY > 100 ? header.classList.add("add-shadow") : header.classList.remove("add-shadow");
};

window.addEventListener("scroll", scrollHandler, false);
