/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Realm from "realm";

// schema for database objects
const TaskSchema = {
  name: "Task",
  properties: {
    _id: "int",
    name: "string",
    status: "string?",
  },
  primaryKey: "_id",
};

(async () => {

  // use realm to interact with database
  const realm = await Realm.open({
    path: "myrealm",
    schema: [TaskSchema],
  });


  // ### write records to database
  // realm.write(() => {
  //   task1 = realm.create("Task", {
  //     _id: 1,
  //     name: "go grocery shopping",
  //     dateCreated: Date.now(),
  //     status: "Open",
  //   });
  //   task2 = realm.create("Task", {
  //     _id: 2,
  //     name: "go exercise",
  //     dateCreated: Date.now(),
  //     status: "Open",
  //   });
  //   console.log(`created two tasks: ${task1.name} & ${task2.name}`);
  // });

  // ### read records from database
  const tasks = realm.objects("Task");
  console.log(`The lists of tasks are: ${tasks.map((task) => { return task.name + " " + task._id + '\n\r' })}`);

  // ### read ONE record from database
  // const myTask = realm.objectForPrimaryKey("Task", 1637096347792); // search for a realm object with a primary key that is an int.
  // console.log(`got task: ${myTask.name} & ${myTask._id}`);


  // ### modify ONE record from database
  // realm.write(() => {
  //   let myTask = realm.objectForPrimaryKey("Task", 1637096347792);
  //   console.log(`original task: ${myTask.name} & ${myTask._id} ${myTask.status}`);
  //   myTask.status = "Closed"
  // });

  // ### delete ONE record from database
  realm.write(() => {
    try {
    let myTask = realm.objectForPrimaryKey("Task", 1637096312440);
    realm.delete(myTask);
    console.log("deleted task ");
    myTask = null;
    } catch (error) {
      console.log(error);
    }
  });

})();









const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>

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