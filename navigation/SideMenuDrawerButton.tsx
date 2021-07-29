import * as React from "react";
import { IconButton } from "react-native-paper";

export default function SideMenuDrawerButton(navigation: any) {
    return (
        <IconButton icon="menu"
            onPress={() => {
                navigation.openDrawer();
            }}/>
    );
}