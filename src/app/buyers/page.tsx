"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Cities, propertyTypes, timelines } from "@/Schema/buyerLeadSchema";

const pageSize = 10;
function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  // URL state
  const page = Number(searchParams.get("page") ?? 1);
  const search = searchParams.get("search") ?? "";
  const city = searchParams.get("city") ?? "";
  const propertyType = searchParams.get("propertyType") ?? "";
  const status = searchParams.get("status") ?? "";
  const timeline = searchParams.get("timeline") ?? "";

  useEffect(() => {
    const getAllBuyerLead = async () => {
      try {
        const response = await axios.get("/api/buyers", {
          params: { page, pageSize, search, city, propertyType, status, timeline },
        });
        console.log(response.data);

        setData(response.data.allBuyerLead);
        setTotal(response.data.totalCount);
      } catch (error) {
        console.log(error);
      }
    };
    getAllBuyerLead();
  }, [page, search, city, propertyType, status, timeline]);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set(key, value);
    else params.delete(key);
    if (key != "page") params.set("page", "1");

    router.push(`/buyers?${params.toString()}`);
  };

  let typingTimer: NodeJS.Timeout;
  const handleSearch = (val: string) => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      updateQuery("search", val);
    }, 500);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Buyer Leads</h1>

      <div className="flex gap-4">
        <Input
          placeholder="Search name, phone, email..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
        <Select
          value={city}
          onValueChange={val => updateQuery("city", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            {Cities.map(city => (
              <SelectItem
                key={city}
                value={city}
              >
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={propertyType}
          onValueChange={val => updateQuery("propertyType", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map(property => (
              <SelectItem
                key={property}
                value={property}
              >
                {property}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={timeline}
          onValueChange={val => updateQuery("timeline", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Timeline" />
          </SelectTrigger>
          <SelectContent>
            {timelines.map(el => (
              <SelectItem
                key={el}
                value={el}
              >
                {el}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={val => updateQuery("status", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="InProgress">In Progress</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => router.push(`/buyers`)}>reset</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Bhk</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Timeline</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length != 0 &&
            data.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.fullName}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell>{row.propertyType}</TableCell>
                <TableCell>{row.bhk}</TableCell>
                <TableCell>{row.purpose}</TableCell>
                <TableCell>
                  {row.budgetMin} - {row.budgetMax}
                </TableCell>
                <TableCell>{row.timeline}</TableCell>
                <TableCell>{row.source}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.notes}</TableCell>
                <TableCell>{row.tags}</TableCell>
                <TableCell>{new Date(row.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/buyers/${row.id}`)}
                  >
                    View / Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {!data.length && <h2 className="text-lg font-medium">No results found</h2>}

      <div className="flex justify-between items-center mt-4">
        <p>
          Page {page} of {totalPages}
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => updateQuery("page", String(page - 1))}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => updateQuery("page", String(1 + page))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
export default Page;
