import * as React from 'react';
import { StyleSheet } from 'react-native';
import { MCard, MCardContent, MDivider, MListItem, MListSection, MListSubheader } from '../components/StyledMaterial';
import { SCurrencyBadge, SCurrencyText, SScrollView, SSegmentedControl, SText, SView } from '../components/StyledComponents';
import { View } from '../components/Themed';
import BankAccount from '../models/BankAccount';
import { GetAllTransactionsGrouped, GetBankAccounts, GetPastMonthTransactionsGrouped, GetPastWeekTransactionsGrouped } from '../services/RestApiService';
import { GetBankAccountSubTypeText, GetBankAccountWorth, ScrambleBankAccountsIfNeeded, ScrambleGroupedTransactionsIfNeeded } from '../services/FoundationService';
import Transaction from '../models/Transaction';

export default function DashboardScreen() {
  const [initialLoadingAccounts, setInitialLoadingAccounts] = React.useState(true);
  const [loadingAccounts, setLoadingAccounts] = React.useState(true);
  const [loadedAccounts, setLoadedAccounts] = React.useState([] as BankAccount[]);
  const [transactionsScope, setTransactionsScope] = React.useState(0);
  const [loadedScopedAndGroupedTransactions, setLoadedScopedAndGroupedTransactions] = React.useState([] as Transaction[][]);

  React.useEffect(() => {
    loadBankAccounts();
  }, []);

  function loadBankAccounts() {
    setLoadingAccounts(true);
    return GetBankAccounts().then((response) => response.json()).then(
      (bankAccounts: BankAccount[]) => {
        ScrambleBankAccountsIfNeeded(bankAccounts);
        setLoadedAccounts([...bankAccounts]);
        setLoadingAccounts(false);
        if (initialLoadingAccounts) {
          getPastWeekTransactions(bankAccounts);
          setInitialLoadingAccounts(false);
        }
      }
    );
  }

  function getNetWorth(accounts: BankAccount[]) {
    if (accounts.length > 0) {
      return accounts.map((bankAccount: BankAccount) => GetBankAccountWorth(bankAccount))
        .reduce((prev: number, curr: number) => prev + curr);
    }
    else {
      return 0;
    }
  }

  function getPastWeekTransactions(bankAccounts?: BankAccount[]) {
    let accountsToUse: BankAccount[] = bankAccounts == null ? loadedAccounts : bankAccounts;
    GetPastWeekTransactionsGrouped(accountsToUse.map((account: BankAccount) => account.accountId)).then((response) => {
      if (response.ok) {
        response.json().then((responseJson: Transaction[][]) => {
          ScrambleGroupedTransactionsIfNeeded(responseJson);
          setLoadedScopedAndGroupedTransactions([...responseJson]);
        });
      }
      else {
        console.error(response);
      }
    });
  }

  function getPastMonthTransactions() {
    GetPastMonthTransactionsGrouped(loadedAccounts.map((account: BankAccount) => account.accountId)).then((response) => {
      if (response.ok) {
        response.json().then((responseJson: Transaction[][]) => {
          ScrambleGroupedTransactionsIfNeeded(responseJson);
          setLoadedScopedAndGroupedTransactions([...responseJson]);
        });
      }
      else {
        console.error(response);
      }
    });
  }

  function getAllTransactions() {
    GetAllTransactionsGrouped(loadedAccounts.map((account: BankAccount) => account.accountId)).then((response) => {
      if (response.ok) {
        response.json().then((responseJson: Transaction[][]) => {
          ScrambleGroupedTransactionsIfNeeded(responseJson);
          setLoadedScopedAndGroupedTransactions([...responseJson]);
        });
      }
      else {
        console.error(response);
      }
    });
  }

  return (
    <SView pageLoading={initialLoadingAccounts}>
      <SScrollView isRefreshable={true} refreshing={loadingAccounts} onRefresh={() => loadBankAccounts()}>
        <View style={styles.container}>
          <MCard>
            <MCardContent style={styles.cardContent}>
              <SCurrencyText style={styles.titleCurrency} value={getNetWorth(loadedAccounts)}>
              </SCurrencyText>
            </MCardContent>
            <MDivider />
            <MCardContent>
              <MListSection>
                {
                  loadedAccounts.map((bankAccount: BankAccount) => {
                    return <MListItem 
                      key={bankAccount.Id}
                      title={bankAccount.name} 
                      description={GetBankAccountSubTypeText(bankAccount.subType)}
                      right={() => (<View style={styles.viewAmountBadge}><SCurrencyBadge value={GetBankAccountWorth(bankAccount)} type={bankAccount.type} style={styles.badgeBalance} size={30}>
                      </SCurrencyBadge></View>)}>
                    </MListItem>
                  })
                }
              </MListSection>
            </MCardContent>
          </MCard>
          <MCard>
            <MCardContent style={styles.cardContent}>
              <SText style={styles.titleNormal}>Recent Transactions</SText>
            </MCardContent>
            <SSegmentedControl
              values={['Past Week', 'Past Month', 'All']}
              selectedIndex={transactionsScope}
              onChange={(event: any) => {
                let selectedIndex = event.nativeEvent.selectedSegmentIndex;
                setTransactionsScope(selectedIndex);
                if (selectedIndex == 0) {
                  getPastWeekTransactions();
                }
                else if (selectedIndex == 1) {
                  getPastMonthTransactions();
                }
                else {
                  getAllTransactions();
                }
              }}
            />
            <MDivider />
            <MCardContent>
              {
                loadedScopedAndGroupedTransactions.map((transactionGroup: Transaction[]) => {
                  return <MListSection key={transactionGroup[0].date}>
                    <MListSubheader>{transactionGroup[0].date}</MListSubheader>
                    {
                      transactionGroup.map((transaction: Transaction) => {
                        return <MListItem 
                          key={transaction.Id}
                          title={transaction.name} 
                          description={transaction.merchantName}
                          right={() => (<View style={styles.viewAmountBadge}><SCurrencyBadge value={transaction.amount} style={styles.badgeBalance} size={30}>
                          </SCurrencyBadge></View>)}>
                        </MListItem>
                      })
                    }
                  </MListSection>
                })
              }
            </MCardContent>
          </MCard>
        </View>
      </SScrollView>
    </SView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  cardContent: {
    alignItems: 'center',
    marginBottom: 10
  },
  titleCurrency: {
    fontSize: 36
  },
  titleNormal: {
    fontSize: 36,
    color: 'grey'
  },
  listItemBalance: {
    height: 50,
    marginVertical: 5
  },
  viewAmountBadge: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    marginRight: 5
  },
  imageLogo: {
    width: 40,
    height: 40
  },
  badgeBalance: {
    fontSize: 16
  }
});
