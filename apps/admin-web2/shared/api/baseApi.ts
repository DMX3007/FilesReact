export interface IApiService {
    apiUrl: string;
}

export class ApiService implements IApiService {
    apiUrl: string;
    constructor(apiUrl: string) {
        this.apiUrl = apiUrl
    }
}

