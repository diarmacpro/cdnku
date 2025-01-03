class jsbn {
    constructor(apiKey) {
        this.API_KEY = apiKey;
        this.BASE_URL = "https://api.jsonbin.io/v3/b";
    }

    request(endpoint, method, data = null, callback = null) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, `${this.BASE_URL}${endpoint}`, true);
        xhr.setRequestHeader('X-Master-Key', this.API_KEY);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    if (callback) callback(null, response);
                    else console.log(`${method} Success:`, response);
                } else {
                    if (callback) callback(xhr, null);
                    else console.error(`${method} Error:`, xhr);
                }
            }
        };

        xhr.send(data ? JSON.stringify(data) : null);
    }

    cDt(data, callback = null) {
        this.request("", "POST", data, callback);
    }

    rDt(id, callback = null) {
        this.request(`/${id}/latest`, "GET", null, callback);
    }

    uDt(id, newData, callback = null) {
        this.request(`/${id}`, "PUT", newData, callback);
    }

    dDt(id, callback = null) {
        this.request(`/${id}`, "DELETE", null, callback);
    }
}
