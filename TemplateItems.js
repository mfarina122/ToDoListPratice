import {
    View,
    Text,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Alert,
    Button,
    Pressable,
  } from "react-native";
  import { styles } from "./styles";
  import { useState, useEffect } from "react";
  import * as SQLite from "expo-sqlite";
  import FontAwesome from "@expo/vector-icons/FontAwesome6";
import { ScrollView } from "react-native-gesture-handler";


export default function TemplateItems(route,navigation) {

    const [templateItemName, setTemplateItemName] = useState("");
    const [templateItemsArr, setTemplateItemsArr] = useState([]);
    const [visible, setVisible] = useState(false);
    const [templateId, setTemplateId] = useState("");

    const openConnection = async () => {
        return await SQLite.openDatabaseAsync("example.db", 	{
          useNewConnection: true
      });
      }
      
      const createTwoButtonAlert = () =>
          Alert.alert('Attenzione', 'Attenzione, questa azione è irreversibile. Vuoi continuare?', [
            {
              text: 'No',
              onPress: () => {},
              style: 'cancel',
            },
            {text: 'Si', onPress: () => {
              deleteEverything();
            }},
          ]);
      //DATABASE
       //IF db doesnt exist it will be created
    
      const loadDB = async (templateId) => {
        const db = await openConnection();
        //First check if a table exist if not create one
       // await db.execAsync("CREATE TABLE IF NOT EXISTS template (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
        await db.execAsync("CREATE TABLE IF NOT EXISTS templateItem (id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT, templateId INTEGER)")
        const allRows = await db.getAllAsync('SELECT * FROM templateItem WHERE templateId = ' + templateId);
        console.log(allRows);
        for (const row of allRows) {
          console.log(row.item, row.item);
        }
        setTemplateItemsArr(allRows);
      }
    
      useEffect(() => {
        loadDB(route.route.params.templateId);
      }, []);
      
      useEffect(() => {
        loadDB(route.route.params.templateId);
      }, [route.route.params.templateId])
      
    
      //ADD NOTE
      const addTemplate = async () => {
        const db = await openConnection();
        const result = await db.runAsync("INSERT INTO templateItem (item,templateId) values (?,?)",templateItemName,route.route.params.templateId);
        let prevNotes = [...templateItemsArr]; 
        prevNotes.push({ id: result.lastInsertRowId, item: templateItemName }); 
        setTemplateItemsArr(prevNotes); 
        setTemplateItemName(""); 
        //const allRows = await db.getAllAsync('SELECT * FROM templateItem WHERE templateId = ?',route.route.params.templateId);
      };
    
      // DELETE NOTE
      const deleteTemplate = async (id) => {
        const db = await openConnection();
        const resultSet = await db.runAsync("DELETE FROM templateItem WHERE id = ? ",id);
        console.log(resultSet);
        if (resultSet.changes > 0) {
          let prevNotes = [...templateItemsArr].filter((note) => note.id != id);
          console.log(prevNotes); //
          setTemplateItemsArr(prevNotes);
        }
      };
    
      //EDITOR BEFORE UPDATE
      const editTemplate = async (id) => {
        setTemplateId(id);
        setVisible(true);
        const db = await openConnection();
        let result = await db.getFirstAsync("SELECT name FROM templateItem WHERE id = ?",id)
        setTemplateItemName(result.note);
      };
    
      //FUNCTION THAT TRIGGERS THE UPDATE
      const updateTemplate = async () => {
        let text = note;
        const db = await openConnection();
        let resultSet = await db.runAsync("UPDATE templateItem set name = ? WHERE id = ?",text,noteId);
        console.log(resultSet);
        if (resultSet.changes > 0) {
          setTemplateItemsArr((prevNotes) => {
            return prevNotes.map((note) => { 
              if (note.id === noteId){ 
                return {...note, note: text}
              }
              return note
            })
          })
        }
        setTemplateItemName("");
        setVisible(false);
      };
    
      return (
        <View>
          {/*<Text
            style={{
              margin: 30,
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 25,
            }}
          >
            Lista della spesa
          </Text>*/}
          <View style={{ display: "flex", flexDirection: "row",marginTop:15 }}>
            <TextInput
              onChangeText={setTemplateItemName}
              value={templateItemName}
              placeholder="Nuovo oggetto da comprare..."
              style={{
                width: 320,
                height: 50,
                borderWidth: 2,
                borderColor: "gray",
                margin: 5,
                padding: 5,
                borderRadius:10
              }}
            />
            {visible ? (
              <TouchableOpacity
                onPress={updateTemplate}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                  width: 50,
                  padding: 5,
                  margin: 5,
                }}
              >
                   <FontAwesome name="pen-to-square" size={20} color="blue" />
              </TouchableOpacity>
            ):(
              <TouchableOpacity
                onPress={() => {
                  if(templateItemName === ""){
    
                  }else{
                    addTemplate()
                  }
                }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "orange",
                  height: 50,
                  width: 50,
                  padding: 5,
                  margin: 5,
                  borderRadius:30
                }}
              >
                <Text style={{ fontSize: 30, color: "white" }}>+</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView style={{ margin: 10,height:"75%" }}>
            {templateItemsArr.map((item) => {
              return (
                <View
                  key={item.id}
                  style={{
                    fontSize: 20,
                    margin: 5,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>{item.item}</Text>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <TouchableOpacity
                      style={{ margin: 5 }}
                      onPress={() => deleteTemplate(item.id)}
                    >
                      <FontAwesome name="trash-can" size={20} color="red" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ margin: 5 }}
                      onPress={() => editTemplate(item.id)}
                    >
                      <FontAwesome name="pen-to-square" size={20} color="blue" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
)}