var PAGE = {
    /**
     * Get the url parameters as an array
     * @param url
     * @returns {{}}
     */
    params(url) {
        if (typeof url !== 'string' ) url = location.href;
        let params = url.split('?');
        if (params[1] == null) return {};

        params = params[1].split('&');

        let result = {};

        for (let i = 0; i < params.length; i++) {
            let param = params[i].split('=');
            if (param[0] == null) continue;
            if (param[1] == null) continue;
            result[param[0]] = param[1];
        }

        return result;
    }
}

