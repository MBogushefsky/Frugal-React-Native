import environment from '../environment/environment';
import BankAccount from '../models/BankAccount';
import Transaction from '../models/Transaction';

export enum AmountType {
    POSITIVE,
    ZERO,
    NEGATIVE
}

export function GetAmountType(value: number) {
    if (value > 0) {
        return AmountType.POSITIVE;
    }
    else if (value < 0) {
        return AmountType.NEGATIVE;
    }
    else {
        return AmountType.ZERO;
    }
}

export function ConvertToDirectionalCurrency(value: number) {
    let amountType = GetAmountType(value);
    if (amountType == AmountType.POSITIVE || amountType == AmountType.ZERO) {
        return ConvertToCurrency(value);
    }
    else {
        return '-' + ConvertToCurrency(value);
    }
}

export function ConvertToCurrency(value: number) {
    return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export function ScrambleBankAccountsIfNeeded(bankAccounts: BankAccount[]) {
    if (environment.scrambleData) {
        for (let i = 0; i < bankAccounts.length; i++) {
            bankAccounts[i].name = 'Bank Account ' + (i + 1);
            bankAccounts[i].currentBalance = 1;
            bankAccounts[i].availableBalance = 1;
        }
    }
    return bankAccounts;
}

export function ScrambleTransactionsIfNeeded(transactions: Transaction[]) {
    if (environment.scrambleData) {
        for (let i = 0; i < transactions.length; i++) {
            transactions[i].merchantName = 'Merchant ' + (i + 1);
            transactions[i].name = 'Transaction ' + (i + 1);
            transactions[i].amount = 1;
        }
    }
    return transactions;
}

export function ScrambleGroupedTransactionsIfNeeded(transactionGroups: Transaction[][]) {
    if (environment.scrambleData) {
        for (let transactionGroup of transactionGroups) {
            for (let i = 0; i < transactionGroup.length; i++) {
                transactionGroup[i].merchantName = 'Merchant ' + (i + 1);
                transactionGroup[i].name = 'Transaction ' + (i + 1);
                transactionGroup[i].amount = 1;
            }
        }
    }
    return transactionGroups;
}

export function GetBankAccountWorth(bankAccount: BankAccount) {
    if (bankAccount.type == 'depository') {
        return bankAccount.currentBalance;
    }
    else if (bankAccount.type == 'credit') {
        return -1 * bankAccount.currentBalance;
    }
    else {
        return bankAccount.currentBalance;
    }
}

export function GetBankAccountSubTypeText(subType: string) {
    if (subType == 'checking') { return 'Checking'; }
    if (subType == 'credit card') { return 'Credit Card'; }
    if (subType == 'savings') { return 'Savings'; }
}

export function ConvertArrayToQueryParams(queryParamName: string, valueArray: string[]) {
    let queryParams: string[] = [];
    for (let value of valueArray) {
        queryParams.push(queryParamName + '=' + value);
    }
    return queryParams.join('&');
}