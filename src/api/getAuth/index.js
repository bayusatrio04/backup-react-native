
import APIManager from '../APIManager';

export const auth_api =   async data => { 
    try {
        const result = await APIManager('/auth', {
        method: 'POST',
        headers: {
        'content-type': 'application/json',
        },
        data: data,
    });
    return result;
    } catch (error) {
        return error.response.data;
    }
};
export default auth_api;
