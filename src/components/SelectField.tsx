"use client";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function SelectField({ data, fieldName, onValueChange, defaultValue }: { data: readonly string[]; fieldName: string; onValueChange: any; defaultValue: any }) {
  return (
    <Select
      onValueChange={onValueChange}
      value={defaultValue}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={fieldName} />
      </SelectTrigger>
      <SelectContent>
        {data.map((ele: string, index) => (
          <SelectItem
            key={index}
            value={ele}
          >
            {ele}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SelectField;
