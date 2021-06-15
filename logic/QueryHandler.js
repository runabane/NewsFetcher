var xhttp = new XMLHttpRequest();

const path = "https://newsapi.org/v2/";

const apiKey = "da4646822a65479cba15d2e6a7c13b92";

let language = "de";

let country = "de";

const QueryType = {
    TOP_HEADLINE: "top-headlines",
    EVERYTHING: "everything",
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

const queryCall = async (action, url) => {
    return new Promise(function(resolve, reject) {
        xhttp.open(action, url, true);
        xhttp.onreadystatechange = () => {
            if (xhttp.status === 200 && xhttp.readyState === 4) {
                resolve(xhttp.responseText);
            }
            if(xhttp.status === 429 && xhttp.readyState === 4){
                resolve(xhttp.responseText);
            }
        };
        xhttp.send();
    })
};
