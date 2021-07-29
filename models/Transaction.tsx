export default interface Transaction {
    Id: string;
    userId: string;
    accountId: string;
    transactionId: string;
    merchantName: string;
    name: string;
    categories: string[];
    amount: number;
    date: Date;
} 