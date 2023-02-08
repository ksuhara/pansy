
import type { AptosAccount, AptosClient, Types } from 'aptos';

export const excuteuTransaction = async (
  client: AptosClient,
  account: AptosAccount,
  payload: Types.TransactionPayload
) => {
  const txnRequest = await client.generateTransaction(account.address(), payload);
  const signedTxn = await client.signTransaction(account, txnRequest);
  const transactionRes = await client.submitTransaction(signedTxn);
  await client.waitForTransaction(transactionRes.hash);
  return transactionRes.hash;
};
