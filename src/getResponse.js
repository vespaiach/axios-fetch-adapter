import createError from 'axios/lib/core/createError';

/**
 * Fetch API stage two is to get response body. This funtion tries to retrieve
 * response body based on response's type
 */
export default async function getResponse(request, config) {
    let stageOne;
    try {
        stageOne = await fetch(request);
    } catch (e) {
        return Promise.reject(createError('Network Error', config, null, request));
    }

    const response = {
        ok: stageOne.ok,
        status: stageOne.status,
        statusText: stageOne.statusText,
        headers: new Headers(stageOne.headers), // Make a copy of headers
        config: config,
        request,
    };

    if (stageOne.status >= 200 && stageOne.status !== 204) {
        switch (config.responseType) {
            case 'arraybuffer':
                response.data = await stageOne.arrayBuffer();
                break;
            case 'blob':
                response.data = await stageOne.blob();
                break;
            case 'json':
                response.data = await stageOne.json();
                break;
            case 'formData':
                response.data = await stageOne.formData();
                break;
            default:
                response.data = await stageOne.text();
                break;
        }
    }

    return Promise.resolve(response);
}
