import * as React from "react";
import { IconButton } from "react-native-paper";
import { useDispatch } from "react-redux";
import { setRightDrawerState } from "../redux/Reducers";

export default function RightDrawerButton() {
    const dispatch = useDispatch();

    return (
        <IconButton icon="filter"
            onPress={() => {
                dispatch(setRightDrawerState('toggle'))
            }}/>
    );
}