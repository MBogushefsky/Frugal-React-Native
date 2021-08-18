import * as React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { MCard, MCardContent, MListItem, MListSection, MPrimaryButton } from '../components/StyledMaterial';
import PlaidLink, { LinkExit, LinkLogLevel, LinkSuccess } from 'react-native-plaid-link-sdk';
import { CreateLinkToken, GetBankAccounts, SavePublicToken } from '../services/RestApiService';
import { SScrollView, SText, SView } from '../components/StyledComponents';
import BankAccount from '../models/BankAccount';
import { Ionicons } from '@expo/vector-icons';
import { ConvertToDirectionalCurrency, ScrambleBankAccountsIfNeeded } from '../services/FoundationService';

export default function LinkedBankAccountsScreen({ navigation }: any) {
  const [loadingToken, setLoadingToken] = React.useState(false);
  const [receivedToken, setReceivedToken] = React.useState(null as any);
  const [attemptedLoadingAccounts, setAttemptedLoadingAccounts] = React.useState(false);
  const [loadingAccounts, setLoadingAccounts] = React.useState(false);
  const [loadedAccounts, setLoadedAccounts] = React.useState([] as BankAccount[]);

  if (!attemptedLoadingAccounts) {
    setAttemptedLoadingAccounts(true);
    loadBankAccounts();
  }

  function loadBankAccounts() {
    return GetBankAccounts().then((response) => response.json()).then(
      (bankAccounts: BankAccount[]) => {
        ScrambleBankAccountsIfNeeded(bankAccounts);
        setLoadedAccounts([...bankAccounts]);
        setLoadingAccounts(false);
      }
    );
  }

  if (receivedToken == null && !loadingToken) {
    setLoadingToken(true);
    CreateLinkToken().then(
      (response: Response) => {
        if (response.ok) {
          response.text().then(
            (responseText: string) => {
              console.log(responseText)
              setReceivedToken(responseText);
              setLoadingToken(false);
            }
          );
        }
        else {
          setLoadingToken(false);
        }
      }
    );
  }

  function onSuccess(success: LinkSuccess) {
    console.log(success);
    SavePublicToken(success.publicToken).then(
      () => {
        setAttemptedLoadingAccounts(true);
        setLoadingAccounts(true);
        loadBankAccounts();
      }
    );
  }

  function onExit(exit: LinkExit) {
    console.log(exit);
  }

  return (
    <SView style={styles.container} loading={loadingToken}>
      <SScrollView isRefreshable={true} refreshing={loadingAccounts} onRefresh={() => loadBankAccounts()} contentContainerStyle={styles.scrollViewContent}>
        <MCard>
          <MCardContent style={styles.cardContentAccounts}>
            <MListSection>
              {
                attemptedLoadingAccounts && !loadingAccounts && loadedAccounts.map((bankAccount: BankAccount) => {
                  if (bankAccount.type == 'depository') {
                    return <MListItem key={bankAccount.Id} title={bankAccount.name} description={ConvertToDirectionalCurrency(bankAccount.currentBalance) + ' available'}/>
                  }
                  else if (bankAccount.type == 'credit') {
                    return <MListItem key={bankAccount.Id} title={bankAccount.name} 
                      description={ConvertToDirectionalCurrency(bankAccount.availableBalance) + ' available, ' + 
                        ConvertToDirectionalCurrency(bankAccount.currentBalance) + ' credited'}/>
                  }
                })
              }
            </MListSection>
            {
              !loadingToken && receivedToken != null && 
              <PlaidLink
                tokenConfig={{
                  token: receivedToken,
                  logLevel: LinkLogLevel.DEBUG
                }}
                onSuccess={(success: LinkSuccess) => onSuccess(success)}
                onExit={(exit: LinkExit) => onExit(exit)}>
                <MPrimaryButton style={[styles.buttonLink, styles.buttonBorderRadius]} contentStyle={styles.buttonBorderRadius}>
                  <Ionicons name="link-outline" size={15}/> Link
                </MPrimaryButton>
              </PlaidLink>
            }
            {
              loadingToken || receivedToken == null && 
              <MPrimaryButton disabled={true} style={[styles.buttonLink, styles.buttonBorderRadius]} contentStyle={styles.buttonBorderRadius}>
                <ActivityIndicator size="small" color="#808080" />
              </MPrimaryButton>
            }
          </MCardContent>
        </MCard>
      </SScrollView>
    </SView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  cardContentAccounts: {
    paddingVertical: 0
  },
  buttonLink: {
    height: 50
  },
  buttonBorderRadius: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden'
  },
  scrollViewContent: {
    alignItems: 'center'
  }
});
