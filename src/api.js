class API {
    constructor() {
        this.rootUrl = 'http://politicos.olhoneles.org/api/v0';
    }
    
    getLegislators(term) {
        return this.ajax(`legislators/?name__istartswith=${term}`);    
    }
    
    getLegislatorById(id) {
        return this.ajax(`legislators/${id}/`);    
    }
    
    ajax(path) {
        let promisse = new Promise((accept, reject) => {
            var fullUrl = `${this.rootUrl}/${path}`;

            var request = new XMLHttpRequest();
            request.open('GET', fullUrl, true);
            request.setRequestHeader('Content-Type', 'application/json');
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    var data = JSON.parse(request.responseText);
                    accept(data);
                } else {
                    reject();
                }
            };

            request.onerror = function() {
                reject();
            };

            request.send();
        });
        
        return promisse;
    }
}
