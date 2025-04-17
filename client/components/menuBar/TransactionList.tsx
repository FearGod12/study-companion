import usePremiumStore from "@/store/usePremiumStore";
import React, { useEffect } from "react";
import Loading from "../common/Loading";

const TransactionList = () => {
  const { transactions, loading, error, fetchTransactions } = usePremiumStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (loading) {
    return (
      <div className="container max-w-none h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <p className="container max-w-none h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </p>
    );
  }

  return (
    <div className="p-6 mt-12 h-full min-h-screen">
      <h2 className="lg:text-xl md:text-xl text-lg font-semibold text-accent mb-4">
        Transaction History
      </h2>
      <div className="bg-accent h-1 w-32 mb-10"></div>
      <ul className="space-y-4 lg:max-w-xl md:max-w-lg max-w-md mx-4">
        {transactions.length > 0 ? (
          transactions.map((txn) => (
            <li
              key={txn.id}
              className="p-4 bg-gray-100 shadow rounded-xl border border-gray-200"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">Reference</span>
                <span className="font-medium">{txn.reference}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="text-green-600 font-semibold">
                  {txn.amount} {txn.currency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Date</span>
                <span className="text-gray-700">
                  {new Date(txn.createdAt).toLocaleString()}
                </span>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No transactions found.</p>
        )}
      </ul>
    </div>
  );
};

export default TransactionList;
