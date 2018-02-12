var api ={
    getData(){
        var url='http://bot.defect94.hasura-app.io/logs';
        return fetch(url).then((res)=>res.json());
    }
};

module.exports = api;