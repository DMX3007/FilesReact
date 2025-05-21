"use client"

import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../shared/ui/Card/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui/Table/Table"
import { Button } from "../../shared/ui/Button/Button"
import { Skeleton } from "../../shared/ui/Skeleton/Skeleton"
import { cn } from "../../shared/lib/utils"
import { Calendar } from "../../shared/ui/Calendar/Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../shared/ui/Popover/Popover"
import { FileApiLog, fileApiService } from "../../shared/api/logsService"
import useSWR,{Fetcher} from "swr"

const getJournal: Fetcher<FileApiLog> = (date: string) => fileApiService.getJournal(date);

export function formatDateString(dateString: string | Date): string {
    const date = new Date(dateString)

    const year = date.toLocaleString('default', { year: 'numeric' })
    const month = date.toLocaleString('default', { month: '2-digit' })
    const day = date.toLocaleString('default', { day: '2-digit' })

    // Generate yyyy-mm-dd date string
    return year + '-' + month + '-' + day
}

export default function JournalPage() {
  const today = new Date()
  const [date, setDate] = useState<Date>(today)
  const dateKey = formatDateString(date)

  const {data, error, isLoading} = useSWR(dateKey, getJournal)

  useEffect(() => {
    console.log("[📆 Calendar] selected date:", dateKey)
  }, [date])
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Files API Statistics</CardTitle>
          <CardDescription>Number of requests to files-api endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="grid gap-2">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Date:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      // onSelect={(newDate) => newDate && setDate(newDate)}
                      onSelect={(date) => date && setDate(date)}
                      disabled={(date) => date > today}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Endpoint</TableHead>
                <TableHead className="w-[20%] text-center">All</TableHead>
                <TableHead className="w-[20%] text-center">OK</TableHead>
                <TableHead className="w-[20%] text-center">Fail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={`loading-${index}`}>
                      {Array(4)
                        .fill(0)
                        .map((_, cellIndex) => (
                          <TableCell key={`loading-cell-${cellIndex}`} className={cellIndex > 0 ? "text-center" : ""}>
                            <Skeleton className="h-6 w-full" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
              ) : data !== undefined ? (
                // Data rows
                data.endpoints.map((endpoint, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{endpoint.endpoint}</TableCell>
                    <TableCell className="text-center">{endpoint.all}</TableCell>
                    <TableCell className="text-center">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        {endpoint.ok}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {endpoint.fail > 0 ? (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                          {endpoint.fail}
                        </span>
                      ) : (
                        endpoint.fail
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // No data state
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No endpoint data found for the selected date
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
