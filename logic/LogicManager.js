window.onload = () => {
    getTopHeadline(language);
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

let submitForm = document.getElementById("submit-button");
if(submitForm !== null){
    submitForm.addEventListener("click", () => {
        console.log("im here!!");
        window.location.href = "/NewsFetcher/Pages/SearchPage.html";
    });
}

