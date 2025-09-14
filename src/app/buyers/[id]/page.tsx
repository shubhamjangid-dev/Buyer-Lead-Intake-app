"use client";
import BuyerLeadForm from "@/components/BuyerLeadForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

function Page() {
  const [defaultData, setDefaultData] = useState({});
  const prams = useParams<{ id: string }>();
  const id = prams.id;
  useEffect(() => {
    const getBuyerLead = async () => {
      try {
        const response = await axios.get(`/api/buyers/${id}`);
        setDefaultData(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getBuyerLead();
  }, []);
  return (
    <>
      <h1 className="w-full flex justify-center p-2 mt-6 text-6xl">Edit Buyer Lead</h1>
      <BuyerLeadForm
        defaultData={defaultData}
        apiUrl={`/api/buyers/${id}`}
      />
    </>
  );
}
export default Page;
