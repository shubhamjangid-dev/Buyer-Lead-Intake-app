"use client";
import BuyerLeadForm from "@/components/BuyerLeadForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

function Page() {
  const [defaultData, setDefaultData] = useState({});
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  const prams = useParams<{ id: string }>();
  const id = prams.id;
  useEffect(() => {
    const getBuyerLead = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/buyers/${id}`);
        const processedData = Object.fromEntries(Object.entries(response.data.data).filter(([key, value]) => value != null));
        setDefaultData(processedData);
        setHistory(response.data.history);
        console.log(response.data, processedData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getBuyerLead();
  }, []);
  return (
    <>
      <h1 className="w-full flex justify-center p-2 mt-6 text-6xl">Edit Buyer Lead</h1>
      {isLoading ? (
        <div className="w-full flex justify-center mt-4">
          <Loader2 className="h-4 w-4 animate-spin justify-center" />
        </div>
      ) : (
        <>
          <BuyerLeadForm
            defaultData={defaultData}
            apiUrl={`/api/buyers/${id}`}
          />
          {history.length != 0 && (
            <div className="flex justify-center bg-white">
              <div className="w-full max-w-screen-lg p-8 m-4  space-y-8 bg-white rounded-lg shadow-md">
                <h1 className="text-4xl">History</h1>
                {history.map((el, i) => (
                  <div
                    key={i}
                    className="p-4 border rounded mb-4"
                  >
                    <div className="text-sm text-gray-500">{el.changedAt}</div>
                    <div className="mt-2 space-y-1">
                      {Object.entries(el.diff).map(([key, value]) => {
                        if (key == "updatedAt") return null;
                        return (
                          <div
                            key={key}
                            className="text-sm"
                          >
                            <strong>{key}:</strong> <span className="text-red-500 line-through">{value.old ?? "—"}</span> → <span className="text-green-600">{value.new ?? "—"}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
export default Page;
