import React from 'react';
import { StyleSheet, View, FlatList, Image } from 'react-native';

import { AddTodo } from '../../components/AddTodo';
import { Todo } from '../../components/Todo';

export const MainScreen = ({ todos, addTodo, removeTodo, openTodo }) => {
  let content = (
    <FlatList
      data={todos}
      renderItem={({ item }) => (
        <Todo todo={item} onRemove={removeTodo} onOpen={openTodo} />
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );

  if (todos.length === 0) {
    content = (
      <View>
        <Image source={require('../../../assets/no-items.png')} />
      </View>
    );
  }

  return (
    <View>
      <AddTodo onSubmit={addTodo} />

      {contents}
    </View>
  );
};

const styles = StyleSheet.create({});
