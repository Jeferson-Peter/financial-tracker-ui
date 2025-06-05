"use client";

import { useEffect, useState } from "react";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ComboboxProps = {
    value?: string;
    onChange: (value: string) => void;
};

export function AccountTypeCombobox({ value, onChange }: ComboboxProps) {
    const [open, setOpen] = useState(false);
    const [accountTypes, setAccountTypes] = useState<{ id: number; name: string }[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                const res = await fetch(`/api/account-types?${params.toString()}`);
                const data = await res.json();
                setAccountTypes(data.results || []);
            } catch {
                setAccountTypes([]);
            }
        };

        fetchOptions();
    }, [search]);

    const selected = accountTypes.find((a) => String(a.id) === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    {selected ? selected.name : "Select account type"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search account types..."
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        {accountTypes.map((type) => (
                            <CommandItem
                                key={type.id}
                                value={String(type.id)}
                                onSelect={() => {
                                    onChange(String(type.id));
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === String(type.id) ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {type.name}
                            </CommandItem>
                        ))}

                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
