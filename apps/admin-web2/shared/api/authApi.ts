import { ApiService } from "./baseApi";

interface IUser {
    username: string,
    password: string,
}

class AuthService extends ApiService {
    constructor(apiUrl: string) {
        super(apiUrl)
    }
    async login({ username, password }: IUser): Promise<string> {
        const res = await fetch(`${this.apiUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
        if (!res.ok) throw new Error("Login failed")
        const data = await res.json()
        return data.token
    }
}

export const authService = new AuthService('' as string);