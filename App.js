/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  Button,
  TextInput,
  ToggleButton,
  Colors,
  useTheme,
  List,
} from 'react-native-paper';

import Realm from 'realm';

// schema for database objects
const TaskSchema = {
  name: 'Task',
  properties: {
    _id: 'int',
    name: 'string',
    status: 'string?',
  },
  primaryKey: '_id',
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = useTheme();

  // input fields data
  const [text, setText] = React.useState('');
  const [status, setStatus] = React.useState('checked');

  // realm related variables
  const [realm, setRealm] = React.useState(null);
  const [tasks, setTasks] = React.useState([]);

  useEffect(() => {
    (async () => {
      // initialize realm...
      const realm = await Realm.open({
        path: 'myrealm',
        schema: [TaskSchema],
      }).then(realm => {
        // load data in the database...
        const tasks = realm.objects('Task');

        // set variable for tasks read from database
        setTasks([...tasks]);

        // get realm instance to use later in app
        setRealm(realm);

        // set up listener to update task list when the
        // data is updated
        try {
          tasks.addListener(() => {
            setTasks([...tasks]);
          });
        } catch (error) {
          console.error(`Error updating tasks: ${error}`);
        }
      });
    })();
  }, []);

  /**
   * deleting of tasks must happen in a transaction, we just
   * need the id of the task to delete
   */
  const deleteTask = task => {
    realm.write(() => {
      try {
        let myTask = realm.objectForPrimaryKey('Task', task._id);
        realm.delete(myTask);
        myTask = null;
      } catch (error) {
        console.log('delete', error);
      }
    });
  };

  /**
   * get the values from the local state and add a new
   * task to the database
   */
  const adddTask = () => {
    realm.write(() => {
      task1 = realm.create('Task', {
        _id: Date.now(),
        name: text,
        dateCreated: Date.now(),
        status: status == 'checked' ? 'Closed' : 'Open',
      });
    });

    setText('');
    setStatus('');
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {/* text input view */}
          <View
            style={{
              flex: 1,
              marginVertical: 10,
              marginHorizontal: 8,
              padding: 8,
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}}>
              <TextInput
                label="Task"
                value={text}
                onChangeText={text => setText(text)}
                style={{backgroundColor: 'transparent'}}
              />
            </View>
            <View style={{marginTop: 20, marginLeft: 12}}>
              <ToggleButton
                size={18}
                style={{
                  width: 25,
                  height: 25,
                  justifyContent: 'center',
                  marginVertical: 8,
                  borderColor: theme.colors.primary,
                  borderWidth: 1,
                  backgroundColor:
                    status === 'checked' ? theme.colors.primary : '',
                }}
                icon={status === 'checked' ? 'check' : undefined}
                value="complete"
                status={status}
                onPress={() =>
                  setStatus(status === 'checked' ? 'unchecked' : 'checked')
                }
              />
            </View>
          </View>
          
          <View style={{alignItems: 'center'}}>
            <Button
              raised
              mode="contained"
              style={{width: 200}}
              uppercase
              onPress={() => adddTask()}>
              Add Task
            </Button>
          </View>
          <View>
            {tasks?.map(task => (
              <List.Item
                key={task._id}
                title={({selectable, rest}) => <Text style={{...rest}}>{task.name}</Text>}
                description={task.status}
                left={props => <List.Icon {...props} icon="folder" />}
                right={props => (
                  <Pressable onPress={() => deleteTask(task)}>
                    <List.Icon {...props} icon="delete" color={Colors.red400} />
                  </Pressable>
                )}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
