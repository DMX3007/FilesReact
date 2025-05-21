import { ApiService } from "./baseApi";

export interface FileReportLog {
    draw: string | null,
    recordsFiltered: number,
    recordsTotal: number,
    data: [{
        date: Date,
        encoding:string,
        fileId: string,
        mimetype: string,
        name: string,
        size: number,
    }]
}

export interface FileApiLog {
    endpoints: [{
        all: number,
        endpoint: string,
        fail: number,
        ok: number
    }
    ]
}


class FileApiService extends ApiService {
    constructor(apiUrl: string) {
        super(apiUrl)
    }

    async getReports(): Promise<FileReportLog> {
        const res = await fetch(`${this.apiUrl}/journals/files`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        if (!res.ok) {
            console.error('Error while fetching reports')
            return
        }
        return await res.json()
    }
    async getJournal(date: string): Promise<FileApiLog> {
        const res = await fetch(`${this.apiUrl}/reports/file-api?date=${date}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        if (!res.ok) {
            console.error('Error while fetching reports')
            return
        }
        return await res.json()
    }
}

export const fileApiService = new FileApiService('' as string);