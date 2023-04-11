import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'

const ListProduct = (props) => {
    const [list, setlist] = useState([]);
    const [loading, setloading] = useState(true);
    const getData = async () => {
        let url = "http://10.24.27.244:3000/productAPI";

        try {
            const data = await fetch(url);

            const json = await data.json();

            setlist([...json]);
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false);
        }
    }

    const loadingList = useCallback(() => {
        setloading(true);
        getData();
    });

    useEffect(() => {
        const underList = props.navigation.addListener('focus', () => {
            getData();
        });
        return underList;
    }, [props.navigation])

    const renderItemList = ({ item }) => {
        return (
            <View
                style={{ flexDirection: "row", justifyContent: 'flex-start', borderRadius: 15, marginTop: 20 }}
            >
                <Image
                    source={{ uri: item.img }}
                    style={{ width: 80, height: 80, marginRight: 15 }}
                />
                <View>
                    <Text style={{ color: "red", fontSize: 25 }}>Tên sản phẩm : {item.name}</Text>
                    <Text style={{ color: "black" }}>Giá : {item.price}</Text>
                    <Text style={{ color: "black" }}>Màu sắc : {item.color}</Text>
                    <Text style={{ color: "black", }}>Số lượng: {item.quantity}</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {
                loading ? <ActivityIndicator /> :

                    <FlatList
                        data={list}
                        renderItem={renderItemList}
                        keyExtractor={(item, index) => index + '1'}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={loadingList}
                            />
                        }
                        style={{ width: "100%", padding: 10 }}
                    />
            }

        </View>
    )
}

export default ListProduct

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})