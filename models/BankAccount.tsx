export default interface BankAccount {
    Id: string;
    userId: string;
    accountId: string;
    institutionId: string;
    name: string;
    type: string;
    subType: string;
    availableBalance: number;
    currentBalance: number;
} 