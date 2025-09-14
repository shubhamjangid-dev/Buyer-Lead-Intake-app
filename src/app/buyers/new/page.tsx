import BuyerLeadForm from "@/components/BuyerLeadForm";
function Page() {
  return (
    <>
      <h1 className="w-full flex justify-center p-2 mt-6 text-6xl">Create Buyer Lead</h1>
      <BuyerLeadForm
        defaultData={null}
        apiUrl="/api/buyers/new"
      />
    </>
  );
}
export default Page;
