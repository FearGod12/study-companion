import TransactionList from "@/components/menuBar/TransactionList";
import Layout from "@/components/layout/main/layout";
import { ReactElement } from "react";

const Transactions = () => {
  return (
    <div>
      <TransactionList />
    </div>
  );
};

Transactions.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};


export default Transactions;
