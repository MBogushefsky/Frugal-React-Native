import * as React from 'react';
import { Animated, Easing, Modal, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextProps } from './Themed';
import { Badge, Text } from 'react-native-paper';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { MActivityIndicator, MDivider, MPrimaryButton } from './StyledMaterial';
import { ConvertToCurrency, GetAmountType, AmountType } from '../services/FoundationService';
import { LinearGradient } from 'expo-linear-gradient';

export function SView(props: any) {
  if (props.pageLoading) {
    return <View style={styles.loadingView}>
      <MActivityIndicator />
    </View>
  }

  return <View {...props} style={[styles.view, props.style]}>
    {props.children}
    {
      props.loading == true && <MActivityIndicator />
    }
    {
      props.modalMessage != null && (<SAlertModal title={props.modalTitle} visible={props.modalMessage != null} onRequestClose={props.onRequestClose}>
        <SText style={styles.modalText}>{props.modalMessage}</SText>
      </SAlertModal>)
    }
  </View>
}

export function SScrollView(props: any) {
  return <ScrollView {...props} style={[styles.scrollView, props.style]}
    contentContainerStyle={[styles.scrollViewContent, props.contentContainerStyle]}
    refreshControl={
      props.isRefreshable ?
      <RefreshControl
        refreshing={props.refreshing}
        onRefresh={props.onRefresh}
      /> : null
    }>
    {props.children}
  </ScrollView>
}

export function SText(props: TextProps) {
  return <Text {...props} style={[styles.text, props.style]}>
    {props.children}
  </Text>;
}

export function SSegmentedControl(props: any) {
  return <SegmentedControl {...props} 
    style={[styles.segmentControl, props.style]}/>
}

export function SAlertModal(props: any) {
  let animatedValue = new Animated.Value(0);

  Animated.timing(animatedValue, {
    toValue: 1,
    duration: 750,
    easing: Easing.out(Easing.exp),
    useNativeDriver: true
  }).start();

  const animatedStyle = {
    transform: [
      { 
        scaleX: animatedValue
      },
      {
        scaleY: animatedValue
      }]
  };

  return <Modal {...props} 
    animationType="fade"
    transparent={true}
    visible={props.visible}
    onRequestClose={props.onRequestClose}>
    <TouchableOpacity style={styles.alertModalOuterView} onPress={props.onRequestClose}>
      <Animated.View style={[styles.alertModalView, animatedStyle]}>
        <View style={styles.alertModalViewTitle}>
          <SText style={styles.alertModalViewTitleText}>{props.title}</SText>
          <MDivider style={styles.alertModalViewTitleDivider} />
        </View>
        <View style={styles.alertModalViewDetailText}>{props.children}</View>
        <View style={styles.alertModalViewButton}>
          <MPrimaryButton style={styles.alertModalPrimaryButton} contentStyle={styles.alertModalViewButtonContent} onPress={props.onRequestClose}>
            OK
          </MPrimaryButton>
        </View>
      </Animated.View>
    </TouchableOpacity>
  </Modal>
}

export function SCurrencyText(props: any) {
  let currencyValue = props.value;
  let amountType = GetAmountType(currencyValue);
  let styleToUse = styles.textCurrencyZero;
  if (amountType == AmountType.POSITIVE) {
    styleToUse = styles.textCurrencyPositive;
  }
  else if (amountType == AmountType.NEGATIVE) {
    styleToUse = styles.textCurrencyNegative;
  }
  return <SText {...props} style={[styleToUse, props.style]}>
      { ConvertToCurrency(currencyValue) }
  </SText>;
}

export function SCurrencyBadge(props: any) {
  let currencyValue = props.value;
  let amountType = GetAmountType(currencyValue);
  let styleToUse: any = styles.badgeCurrencyZero;
  if (props.type != null && props.type == 'credit') {
    styleToUse = styles.badgeCurrencyCredit;
  }
  else if (amountType == AmountType.POSITIVE) {
    styleToUse = styles.badgeCurrencyPositive;
  }
  else if (amountType == AmountType.NEGATIVE) {
    styleToUse = styles.badgeCurrencyNegative;
  }
  return <Badge {...props} style={[styleToUse, styles.badgeCurrency, props.style]}>
      { ConvertToCurrency(currencyValue) }
  </Badge>;
}

const styles = StyleSheet.create({
  loadingView: {
    width: '100%',
    height: '100%'
  },
  view: {
    width: '100%'
  },
  scrollView: {
    width: '100%'
  },
  scrollViewContent: {
    width: '100%'
  },
  text: {
    fontFamily: 'System'
  },
  segmentControl: {
    marginHorizontal: 10
  },
  alertModalOuterView: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  modalText: {
    textAlign: 'center',
    fontSize: 18
  },
  alertModalView: {
    width: '70%',
    maxHeight: 200,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'flex-end'
  },
  alertModalViewTitle: {
    // height: '50%'
    // height: 75
  },
  alertModalViewTitleText: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 15
  },
  alertModalViewTitleDivider: {
    marginVertical: 0
  },
  alertModalViewDetailText: {
    // height: '30%',
    marginVertical: 15,
    textAlign: "center",
    alignItems: 'center',
    justifyContent: 'center'
  },
  alertModalViewButton: {
    // height: '20%'
    height: 50
  },
  alertModalViewButtonContent: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden'
  },
  alertModalPrimaryButton: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden'
  },
  textCurrencyPositive: {
    color: 'green'
  },
  textCurrencyZero: {
    color: 'grey'
  },
  textCurrencyNegative: {
    color: 'red'
  },
  badgeCurrency: {
    minWidth: 85
  },
  badgeCurrencyPositive: {
    backgroundColor: 'green'
  },
  badgeCurrencyZero: {
    backgroundColor: 'grey',
    color: 'white'
  },
  badgeCurrencyCredit: {
    backgroundColor: '#2C778F',
    color: 'white'
  },
  badgeCurrencyNegative: {
    backgroundColor: 'red'
  }
});