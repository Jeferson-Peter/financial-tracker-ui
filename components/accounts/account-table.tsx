"use client";

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { extractQuery } from "@/lib/utils";
import { accountColumns } from "@/components/accounts/account-columns";
import { Account } from "@/types/account";
import {PaginatedResponse} from "@/types/types";


interface DataTableProps {
    initialUrl?: string;
}

export function AccountTable({
                                     initialUrl = "/api/accounts",
                                 }: DataTableProps) {
    const [data, setData] = useState<Account[]>([]);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchPage = async (url: string, searchQuery: string = "") => {
        setLoading(true);
        try {
            const fullUrl = new URL(url, window.location.origin);
            if (searchQuery) {
                fullUrl.searchParams.set("search", searchQuery);
            }

            const res = await axios.get<PaginatedResponse<Account>>(fullUrl.toString());
            setData(res.data.results);
            setNextUrl(res.data.next);
            setPrevUrl(res.data.previous);
        } catch (error) {
            toast.error(`Failed to fetch account types. ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => fetchPage(initialUrl, filter);

    useEffect(() => {
        fetchPage(initialUrl);
    }, [initialUrl]);

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchPage(initialUrl, filter);
        }, 400);

        return () => clearTimeout(delay);
    }, [filter]);

    const columns = accountColumns(refetch);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-4">
            <Input
                placeholder="Search by name..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="max-w-sm"
            />

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((group) => (
                        <TableRow key={group.id}>
                            {group.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">
                                {loading ? "Loading..." : "No records found."}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-muted-foreground">Server-side pagination</div>
                <div className="space-x-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            const url = extractQuery(prevUrl);
                            if (url) fetchPage(url, filter);
                        }}
                        disabled={!prevUrl}
                    >
                        Previous
                    </Button>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            const url = extractQuery(nextUrl);
                            if (url) fetchPage(url, filter);
                        }}
                        disabled={!nextUrl}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
