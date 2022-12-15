function api_random_num(min, max, count){
    axios
    .get("http://www.randomnumberapi.com/api/v1.0/random", {
        params: {
            min: min,
            max: max,
            count: count,
        },
    })
    .then((response) => {
        return response.data[0]
    });
}

function api_get_weather(){
    axios
    .get("http://api.weatherapi.com/v1/current.json", {
        params: {
            key: "cb2550e711c041198f9155842221512",
            q: "41.5342, -8.6293"
            // q: "26.123, 16.123" // warm test
        },
    })
    .then((response) => {
        if(response.data.current.temp_c < 15){
            star_colors = ['#00FFFF', '#0000FF']
            document.querySelector('.ui-start-game-title').style.color = "#00FFFF"
          }else{
            star_colors = ['#FFFF00', '#FF9900']
            document.querySelector('.ui-start-game-title').style.color = "#FFFF00"
          }
    });
}