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


export default function TemplateList({navigation}) {

    const [templateName, setTemplateName] = useState("");
    const [templateArr, setTemplateArr] = useState([]);
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
    
      const loadDB = async () => {
        const db = await openConnection();
        //First check if a table exist if not create one
        await db.execAsync("CREATE TABLE IF NOT EXISTS template (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
        //await db.execAsync("CREATE TABLE IF NOT EXISTS templateItem (id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT, templateId INTEGER)")
        const allRows = await db.getAllAsync('SELECT * FROM template');
        console.log(allRows);
        for (const row of allRows) {
          console.log(row.id, row.name);
        }
        setTemplateArr(allRows);
      }
    
      useEffect(() => {
        loadDB();
      }, []);
    
      
    
      //ADD NOTE
      const addTemplate = async () => {
        const db = await openConnection();
        const result = await db.runAsync("INSERT INTO template (name) values (?)",templateName);
        let prevNotes = [...templateArr]; 
        prevNotes.push({ id: result.lastInsertRowId, name: templateName }); 
        setTemplateArr(prevNotes); 
        setTemplateName(""); 
        const allRows = await db.getAllAsync('SELECT * FROM template');
        console.log(allRows);
      };
    
      // DELETE NOTE
      const deleteTemplate = async (id) => {
        const db = await openConnection();
        const resultSet = await db.runAsync("DELETE FROM template WHERE id=?",id);
        console.log(resultSet);
        if (resultSet.changes > 0) {
          let prevNotes = [...templateArr].filter((note) => note.id != id);
          console.log(prevNotes); //
          setTemplateArr(prevNotes);
        }
      };
    
      //EDITOR BEFORE UPDATE
      const editTemplate = async (id) => {
        setTemplateId(id);
        setVisible(true);
        const db = await openConnection();
        let result = await db.getFirstAsync("SELECT name FROM template WHERE id = ?",id)
        setTemplateName(result.name);
      };
    
      //FUNCTION THAT TRIGGERS THE UPDATE
      const updateTemplate = async () => {
        let text = templateName;
        const db = await openConnection();
        let resultSet = await db.runAsync("UPDATE template set name = ? WHERE id = ?",text,templateId);
        console.log(resultSet);
        if (resultSet.changes > 0) {
          setTemplateArr((prevNotes) => {
            return prevNotes.map((note) => { 
              if (note.id === templateId){ 
                return {...note, name: text}
              }
              return note
            })
          })
        }
        setTemplateName("");
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
              onChangeText={setTemplateName}
              value={templateName}
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
                  if(templateName === ""){
    
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
            {templateArr.map((item) => {
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
                  <Text>{item.name}</Text>
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
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('TemplateItems',{templateId: item.id})
                    }}>
                    <FontAwesome name="arrow-right" style={{margin:5}} size={20} color="blue" />
                    </TouchableOpacity>
                    </View>
                </View>
              );
            })}
          </ScrollView>
         {/* <Button title="Test" onPress={() => {navigation.navigate('TemplateItems')}}></Button>*/}
        </View>
)}
