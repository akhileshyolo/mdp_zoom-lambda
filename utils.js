const passport = require('passport');
const request = require('request');
const ZoomStrategy = require('@giorgosavgeris/passport-zoom-oauth2').Strategy;


function responseHtml(body, token) {
    return `
                            <style>
                                @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap');@import url('https://necolas.github.io/normalize.css/8.0.1/normalize.css');html {color: #232333;font-family: 'Open Sans', Helvetica, Arial, sans-serif;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}h2 {font-weight: 700;font-size: 24px;}h4 {font-weight: 600;font-size: 14px;}.container {margin: 24px auto;padding: 16px;max-width: 720px;}.info {display: flex;align-items: center;}.info>div>span, .info>div>p {font-weight: 400;font-size: 13px;color: #747487;line-height: 16px;}.info>div>span::before {content: "👋";}.info>div>h2 {padding: 8px 0 6px;margin: 0;}.info>div>p {padding: 0;margin: 0;}.info>img {background: #747487;height: 96px;width: 96px;border-radius: 31.68px;overflow: hidden;margin: 0 20px 0 0;}.response {margin: 32px 0;display: flex;flex-wrap: wrap;align-items: center;justify-content: space-between;}.response>a {text-decoration: none;color: #2D8CFF;font-size: 14px;}.response>pre {overflow-x: scroll;background: #f6f7f9;padding: 1.2em 1.4em;border-radius: 10.56px;width: 100%;box-sizing: border-box;}
                            </style>
                            <div class="container">
                                <div class="info">
                                    <img src="${body.pic_url}" alt="User photo" />
                                    <div>
                                        <span>Hello World!</span>
                                        <h2>${body.first_name} ${body.last_name}</h2>
                                        <p>${body.role_name}, ${body.company}</p>
                                    </div>
                                </div>
                                <div class="response">
                                    <h4>JSON Response:</h4>
                                    <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/users/user" target="_blank">
                                        API Reference
                                        ${JSON.stringify(body, null, "\t")}
                                    </a>
                                </div>
                                <div>
                                    ${JSON.stringify(token, null, "\t")}
                                </div>
                            </div>
                        `;
}

const getNewAccessToken = function(url) {
    return new Promise(function(resolve, reject) {
        console.log(url);

        var axios = require('axios');

        var config = {
            method: 'post',
            url: url,
            headers: {
                'Authorization': 'Basic UFBJY3U5WWFTNUdkQU1yUW05a1JROnBPOU11N1J3VTY2ZkFueTNWcDNjc0hJTlg4U1kyZm50'
            }
        };

        return axios(config)
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                reject(error);
            });

    })
}

const getProfileData = function(access_token) {
    return new Promise(function(resolve, reject) {

        var axios = require('axios');

        var config = {
            method: 'get',
            url: "https://api.zoom.us/v2/users/me",
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        };

        return axios(config)
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                console.log(error);
                reject(error);
            });

    })
}


exports.authorize = async function(code, callback) {

    let response;
    let url = 'https://zoom.us/oauth/token?grant_type=authorization_code&code=' + code + '&redirect_uri=https://api.ayzom.com/zoom/callback';


    // Handle errors, something's gone wrong!
    response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Something went wrong',
            input: "Hii",
        }),
    };

    const result = await getNewAccessToken(url);
    if (result) {
        console.log(result);
        const profileData = await getProfileData(result.access_token);
        if (profileData) {
            console.log(profileData);
            const html = responseHtml(profileData, result);

            const htmlRes = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'text/html',
                },
                body: html,
            }
            console.log(htmlRes);
            return htmlRes;
            //callback(null, html);
        }
        else {
            callback(null, result);
        }
    }
    else {
        callback(null, response);
    }

}
