import environment from '../environment/environment';
import { ConvertArrayToQueryParams } from './FoundationService';

const apiHost = environment.apiServer;

export function Login(username: string, passwordHash: string) {
    return fetch(apiHost + "/login?username=" + username + "&passwordHash=" + passwordHash);
}

export function CreateLinkToken() {
    return fetch(apiHost + "/tokens/link/create");
}

export function SavePublicToken(publicToken: string) {
    return fetch(apiHost + "/tokens/link?token=" + publicToken, { method: 'POST'});
}

export function GetBankAccounts() {
    return fetch(apiHost + "/accounts");
}

export function GetPastWeekTransactionsGrouped(accountIds: string[]) {
    return fetch(apiHost + "/transactions/grouped/past-week?" + ConvertArrayToQueryParams('account-ids', accountIds));
}

export function GetPastMonthTransactionsGrouped(accountIds: string[]) {
    return fetch(apiHost + "/transactions/grouped/past-month?" + ConvertArrayToQueryParams('account-ids', accountIds));
}

export function GetAllTransactionsGrouped(accountIds: string[]) {
    return fetch(apiHost + "/transactions/grouped/all?" + ConvertArrayToQueryParams('account-ids', accountIds));
}

