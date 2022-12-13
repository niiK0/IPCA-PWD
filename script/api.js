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