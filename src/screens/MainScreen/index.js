import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, View, FlatList, Image, Dimensions } from 'react-native';
import { AddTodo } from '../../components/AddTodo';
import { Todo } from '../../components/Todo';
import { THEME } from '../../theme';
import { ScreenContext } from '../../context/screen/screenContext';
import { TodoContext } from '../../context/todo/todoContext';
import { AppLoader } from '../../components/ui/AppLoader';
import { AppButton } from '../../components/ui/AppButton';
import { AppText } from '../../components/ui/AppText';

export const MainScreen = () => {
  const { todos, addTodo, removeTodo, fetchTodos, loading, error } =
    useContext(TodoContext);
  const { changeScreen } = useContext(ScreenContext);

  const [deviceWidth, setDeviceWidth] = useState(
    Dimensions.get('window').width - THEME.PADDING_HORIZ * 2
  );

  const loadTodos = useCallback(async () => await fetchTodos(), [fetchTodos]);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const update = () => {
      const width = Dimensions.get('window').width - THEME.PADDING_HORIZ * 2;
      setDeviceWidth(width);
    };
    Dimensions.addEventListener('change', update);

    return () => {
      Dimensions.addEventListener('change', update);
    };
  });

  if (loading) {
    return <AppLoader />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <AppText style={styles.errors}>{error}</AppText>
        <AppButton onPress={loadTodos}>Повторить</AppButton>
      </View>
    );
  }

  let content = (
    <View style={{ width: deviceWidth }}>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <Todo todo={item} onRemove={removeTodo} onOpen={changeScreen} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );

  if (todos.length === 0) {
    content = (
      <View style={styles.imgWrap}>
        <Image
          style={styles.img}
          source={require('../../../assets/no-items.png')}
        />
      </View>
    );
  }

  return (
    <View>
      <AddTodo onSubmit={addTodo} />
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  imgWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    height: 300,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errors: {
    fontSize: 20,
    color: THEME.DANGER_COLOR,
  },
});
