import * as React from "react";
import { IconButton } from "react-native-paper";
import { useDispatch } from "react-redux";
import { setLeftDrawerState } from "../redux/Reducers";

export default function LeftDrawerButton() {
    const dispatch = useDispatch();

    return (
        <IconButton icon="cog"
            onPress={() => {
                dispatch(setLeftDrawerState('toggle'))
            }}/>
    );
}