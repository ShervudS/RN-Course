import React, { useContext, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { EditModal } from '../../components/EditModal';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { AppTextBold } from '../../components/ui/AppTextBold';
import { TodoContext } from '../../context/todo/todoContext';
import { ScreenContext } from '../../context/screen/screenContext';

import { THEME } from '../../theme';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

export const TodoScreen = () => {
  const { todoId, changeScreen } = useContext(ScreenContext);
  const { todos, removeTodo, updateTodo } = useContext(TodoContext);
  const [modal, setModal] = useState(false);

  const todo = todos.find((t) => t.id === todoId);

  const saveHandler = (title) => {
    updateTodo(todo.id, title);
    setModal(false);
  };

  return (
    <View>
      <AppCard style={styles.card}>
        <AppTextBold style={styles.title}>{todo.title}</AppTextBold>
        <AppButton onPress={() => setModal(true)}>
          <FontAwesome name="edit" size={20} />
        </AppButton>
      </AppCard>

      <View style={styles.buttons}>
        <View style={styles.button}>
          <AppButton
            color={THEME.GREY_COLOR}
            onPress={() => changeScreen(null)}
          >
            <AntDesign name="back" size={20} color="#fff" />
          </AppButton>
        </View>

        <View style={styles.button}>
          <AppButton
            color={THEME.DANGER_COLOR}
            onPress={() => removeTodo(todo.id)}
          >
            <FontAwesome name="remove" size={20} color="#fff" />
          </AppButton>
        </View>
      </View>

      <EditModal
        value={todo.title}
        modalVisible={modal}
        handleModal={() => setModal(false)}
        onSave={saveHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    marginBottom: 20,
    padding: 15,
  },
  button: {
    width: Dimensions.get('window').width > 400 ? 150 : 100,
  },
  title: {
    fontSize: 20,
  },
});
