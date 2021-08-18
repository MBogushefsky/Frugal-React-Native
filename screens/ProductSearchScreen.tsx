import * as React from 'react';
import { StyleSheet, Image, Linking } from 'react-native';
import { MCard, MCardContent, MDivider, MIconButton, MListItem, MListSection, MListSubheader, MSearchBar, MToggledIconButton } from '../components/StyledMaterial';
import { SCurrencyBadge, SCurrencyText, SScrollView, SSegmentedControl, SText, SView } from '../components/StyledComponents';
import { View } from '../components/Themed';
import { SearchProducts } from '../services/RestApiService';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import customData from '../test-data/ProductSearch.json';
import { Colors, Snackbar } from 'react-native-paper';
import { Rating } from 'react-native-elements';
import { Store } from '../models/SearchProductFilter';
import { ConvertToCurrency } from '../services/FoundationService';

const ProductSearchScreenStack = createStackNavigator();

export default function ProductSearchScreenNavigator({ navigation }: any) {
  return (
    <ProductSearchScreenStack.Navigator>
      <ProductSearchScreenStack.Screen 
        options={{ header: () => (
          <View style={styles.viewSearch}>
            <MSearchBar style={styles.searchBar} inputStyle={styles.searchBar} />
          </View>
          ) }} 
        name="Product Search"
        component={ ProductSearchScreen } />
    </ProductSearchScreenStack.Navigator>
  );
}

function ProductSearchScreen({ navigation }: any) {
  const { searchFilter } = useSelector((state: any) => state.searchFilter);
  const [ previousSearchTerm, setPreviousSearchTerm ] = React.useState(null as any);
  const [ products, setProducts ] = React.useState(null as any);

  const [ notificationVisible, setNotificationVisible ] = React.useState(false);
  const [ averagePrice, setAveragePrice ] = React.useState(0);

  function searchProducts() {
    // setProducts(customData);
    SearchProducts(searchFilter).then((response) => {
      if (response.ok) {
        response.json().then((responseJson: any[]) => {
          setProducts(responseJson);
          if (products != null) {
            calculateAveragePrice();
            setNotificationVisible(true);
          }
        });
      }
      else {
        console.error(response);
      }
    });
  }

  function calculateAveragePrice() {
    let totalPrice = products.map((product: any) => product.price)
      .reduce((acc: number, curr: number) => acc = acc + curr);
    console.log("AVG", totalPrice / products.length)
    setAveragePrice(totalPrice / products.length);
  }

  function getStoreImage(store: Store) {
    if (store == Store.AMAZON) {
      return require('../resources/images/amazon-logo.png');
    }
    else if (store == Store.EBAY) {
      return require('../resources/images/ebay-logo.png');
    }
    else if (store == Store.WALMART) {
      return require('../resources/images/walmart-logo.png');
    }
    else if (store == Store.GOOGLE_SHOPPING) {
      return require('../resources/images/google-shopping-logo.png');
    }
    return require('../resources/images/question-mark.png');
  }

  function openLink(url: string) {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }

  if (searchFilter.keyword !== previousSearchTerm) {
    setPreviousSearchTerm(searchFilter.keyword);
    searchProducts();
  }

  return (
    <SView>
      <SScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {
            products != null && products.length > 1 &&
            products.map((product: any) => (
              <MCard key={product.id}>
                <MCardContent style={styles.cardContentProduct}>
                  <View style={styles.viewActionMenu}>
                    <View style={styles.viewActions}>
                      <MToggledIconButton selected={false} onPress={() => openLink(product.link)} unselectedIcon="web"/>
                      <MToggledIconButton selected={false} selectedIcon="heart" unselectedIcon="heart-outline"/>
                    </View>
                  </View>
                  <Image
                    style={styles.imageProduct}
                    source={{
                      uri: product.imageUrl,
                    }}
                  />
                  <SText style={styles.textProduct}>
                    {product.title}
                  </SText>
                  <SText style={styles.textProduct}>
                    {product.brand}
                  </SText>
                  <Image
                    style={styles.imageStore}
                    source={getStoreImage(product.store)}
                  />
                  <SText style={styles.textProduct}>
                    {product.rating} out of 5 Stars ({product.ratingCount} Reviews)
                  </SText>
                  <Rating
                    type='heart'
                    startingValue={product.rating}
                    ratingCount={5}
                    imageSize={20}
                    style={styles.rating}
                    readonly={true}
                  />
                  <View>
                    <SCurrencyBadge value={product.price}></SCurrencyBadge>
                  </View>
                </MCardContent>
              </MCard>
            ))
          }
          
        </View>
      </SScrollView>
      <Snackbar
            visible={notificationVisible}
            onDismiss={() => {setNotificationVisible(false)}}
            action={{
              label: 'Cancel',
              onPress: () => {
                setNotificationVisible(false);
              },
            }}>
            The average price found for this item is {ConvertToCurrency(averagePrice)}
          </Snackbar>
    </SView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  viewSearch: {
    width: '100%',
    flexDirection: 'row'
  },
  searchBar: {
    shadowOpacity: 0,
    width: '100%'
  },
  scrollView: {
    height: '100%'
  },
  cardContentProduct: {
    marginHorizontal: 10,
    display: 'flex',
    alignItems: 'center',
    paddingTop: 5
  },
  viewActionMenu: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end'
  },
  viewActions: {
    flexDirection: 'row'
  },
  imageProduct: {
    width: '50%',
    aspectRatio: 1
  },
  textProduct: {
    width: '100%',
    textAlign: 'center',
    marginBottom: 10
  },
  rating: {
    paddingBottom: 10
  },
  imageStore: {
    width: 120,
    height: 40,
    marginBottom: 10
  }
});
