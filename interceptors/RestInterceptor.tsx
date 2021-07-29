import fetchIntercept from 'fetch-intercept';

export default function RegisterRestInterceptor(userId: string) {
    fetchIntercept.register({
        request: function (url, config) {
            if (!url.includes('/logs') && !url.includes('/symbolicate')) {
                const authorizationHeaders = Object.assign({}, config);
                authorizationHeaders.headers = new Headers({
                    'Authorization': userId
                });
                //console.log([url, authorizationHeaders]);
                return [url, authorizationHeaders];
            }
            return [url, config];
        },
    
        // requestError: function (error) {
        //     // Called when an error occured during another 'request' interceptor call
        //     return Promise.reject(error);
        // },
    
        // response: function (response) {
        //     // Modify the reponse object
        //     return response;
        // },
    
        // responseError: function (error) {
        //     // Handle an fetch error
        //     return Promise.reject(error);
        // }
    });
}