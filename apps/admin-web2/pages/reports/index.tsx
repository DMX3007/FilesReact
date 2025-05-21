"use client"
import { useState, useEffect } from "react"
import { Input } from "../../shared/ui/Input/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/Select/Select"
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/Card/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui/Table/Table"
import { Skeleton } from "../../shared/ui/Skeleton/Skeleton"
import useSWR, { Fetcher } from 'swr'
import { fileApiService, FileReportLog } from "../../shared/api/logsService"

const getReports: Fetcher<FileReportLog> = () => fileApiService.getReports();

export default function ReportPage() {
  const [filter, setFilter] = useState({
    period: "",
    fileid: "",
    name: "",
    size: 0,
    mimetype: "",
  })

  const { data, error, isLoading } = useSWR(() => ['uniqkey'], getReports)

  let filteredData
  if (data) {
    filteredData = data.data?.filter((item) => {
      return (
        (filter.period === "" || item.date.toString().includes(filter.period)) &&
        (filter.fileid === "" || item.fileId.toLowerCase().includes(filter.fileid.toLowerCase())) &&
        (filter.name === "" || item.name.toLowerCase().includes(filter.name.toLowerCase())) &&
        (filter.mimetype === "" || item.mimetype.toLowerCase().includes(filter.mimetype.toLowerCase())) &&
        (filter.size === 0 || item.size === filter.size)
      )
    })
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Files</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>File ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Mimetype</TableHead>
              </TableRow>
              <TableRow>
                <TableHead>
                  <Input
                    placeholder="Date"
                    value={filter.period}
                    onChange={(e) => setFilter({ ...filter, period: e.target.value })}
                  />
                </TableHead>
                <TableHead>
                  <Input
                    placeholder="File ID"
                    value={filter.fileid}
                    onChange={(e) => setFilter({ ...filter, fileid: e.target.value })}
                  />
                </TableHead>
                <TableHead>
                  <Input
                    placeholder="Name"
                    value={filter.name}
                    onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                  />
                </TableHead>
                <TableHead>
                  <Input
                    placeholder={"Size"}
                    value={filter.size}
                    onChange={(e) => setFilter({ ...filter, size: Number(e.target.value) })}
                  />
                </TableHead>
                <TableHead>
                  <Input
                    placeholder={"Mimetype"}
                    value={filter.mimetype}
                    onChange={(e) => setFilter({ ...filter, mimetype: e.target.value })}
                  />
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    {Array(5)
                      .fill(0)
                      .map((_, cellIndex) => (
                        <TableCell key={`loading-cell-${cellIndex}`}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              ) : filteredData && filteredData.length > 0 ? (
                // Data rows
                filteredData.map((item) => (
                  <TableRow key={item.fileId}>
                    <TableCell>{item.date.toString()}</TableCell>
                    <TableCell>{item.fileId}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.mimetype}</TableCell>
                  </TableRow>
                ))
              ) : (
                // No data state
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No journal entries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
