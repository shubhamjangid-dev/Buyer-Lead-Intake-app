"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { Form, FormField, FormLabel, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { bhk, buyerLeadSchema, Cities, propertyTypes, purpose, sources, timelines } from "@/Schema/buyerLeadSchema";
import SelectField from "./SelectField";
import { Textarea } from "./ui/textarea";

interface BuyerLeadFormProps {
  defaultData: object | null;
  apiUrl: string;
}

import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";

function BuyerLeadForm({ defaultData, apiUrl }: BuyerLeadFormProps) {
  type BuyerLeadFormType = z.infer<typeof buyerLeadSchema>;

  const { data: session } = useSession();
  const user: User = session?.user as User;
  // console.log(defaultData);
  const router = useRouter();
  const [tagsArray, setTagsArray] = useState<string[]>([]);
  const [tag, setTag] = useState<string>("");
  const form = useForm<BuyerLeadFormType>({
    resolver: zodResolver(buyerLeadSchema),
    defaultValues: defaultData ?? {},
  });

  useEffect(() => {
    if (defaultData) {
      form.reset(defaultData);
      setTagsArray(defaultData?.tags ?? []);
    }
  }, [defaultData, form]);

  const timelineMap = {
    "less than 3 months": "LT_3M",
    "between 3 to 6 months": "B_3_6M",
    "more than 6 months": "MT_6M",
    Exploring: "Exploring",
  };
  const onSubmit = async (data: BuyerLeadFormType) => {
    try {
      const response = await axios.post(apiUrl, { ...data, tags: tagsArray });
      console.log(response);
      alert(response?.data.message || "something went wrong");
      router.replace("/buyers");
    } catch (error) {
      console.log(error);
      alert(error || "something went wrong");
    } finally {
      form.reset({});
    }
  };
  const propertyType = form.watch("propertyType");
  const minBudget = form.watch("budgetMin");
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-screen-lg p-8 m-4  space-y-8 bg-white rounded-lg shadow-md">
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="fullName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>fullName</FormLabel>
                  <Input
                    placeholder="fullName"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    {...field}
                    name="email"
                    placeholder="Email"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    {...field}
                    placeholder="Phone"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <SelectField
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    data={Cities}
                    fieldName="City"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="propertyType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proprerty Type </FormLabel>
                  <SelectField
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    data={propertyTypes}
                    fieldName="Proprerty Type"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {(propertyType == "Apartment" || propertyType == "Villa") && (
              <FormField
                name="bhk"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bhk</FormLabel>
                    <SelectField
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      data={bhk}
                      fieldName="bhk"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              name="purpose"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <SelectField
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    data={purpose}
                    fieldName="Purpose"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="budgetMin"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum budget</FormLabel>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Minimum budget"
                    value={field.value}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="budgetMax"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum budget</FormLabel>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Maximum budget"
                    value={field.value}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="timeline"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeline</FormLabel>
                  <SelectField
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    data={timelines}
                    fieldName="Timeline"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="source"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <SelectField
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    data={sources}
                    fieldName="Source"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="notes"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <Textarea
                    placeholder="Description"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Tags</FormLabel>
              <div className="w-full py-2">
                {tagsArray.map((el, index) => (
                  <span
                    className="m-2 bg-blue-400 rounded-full px-4 py-2 text-sm "
                    key={index}
                  >
                    {el}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 py-2">
                <Input
                  type="string"
                  placeholder="Enter tags"
                  onChange={e => {
                    setTag(e.target.value);
                  }}
                  value={tag}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (tag && tag.trim() != "") {
                      setTagsArray(prev => [...prev, tag]);
                      setTag("");
                    }
                  }}
                >
                  add
                </Button>
                <FormMessage />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={defaultData != null && defaultData?.ownerId != user?.id}
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default BuyerLeadForm;
