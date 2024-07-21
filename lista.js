import {
    View,
    Text,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Alert,
    Button,
    Pressable,
    Modal,
  } from "react-native";
  import { styles } from "./styles";
  import { useState, useEffect } from "react";
  import * as SQLite from "expo-sqlite";
  import FontAwesome from "@expo/vector-icons/FontAwesome6";
import { ScrollView } from "react-native-gesture-handler";
import {Picker} from '@react-native-picker/picker';
import { SelectList } from "react-native-dropdown-select-list";
export default function ListaScreen() {

    const [note, setNote] = useState("");
    const [noteArr, setNoteArr] = useState([]);
    const [visible, setVisible] = useState(false);
    const [noteId, setNoteId] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [templateList,setTemplateList] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
  
    const openConnection = async () => {
      return await SQLite.openDatabaseAsync("example.db", 	{
        useNewConnection: true
    });
    }

    const swapElements = (arr,i1,i2) => {
        let temp = arr[i1];
      
        arr[i1] = arr[i2];
      
        arr[i2] = temp;
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
    
        const createTwoButtonAlertForImport = () =>
          Alert.alert('Attenzione', 'Attenzione, importando questo template, la lista presente ora verrà sovrascritta. Continuare?', [
            {
              text: 'No',
              onPress: () => {},
              style: 'cancel',
            },
            {text: 'Si', onPress: () => {
              deleteEverything();
              loadNotesFromTemplate();
            }},
          ]);
    //DATABASE
     //IF db doesnt exist it will be created
    
    const importTemplate = () => {
      setIsModalOpen(true);
    }
    
    const loadDB = async () => {
      const db = await openConnection();
      console.log(db);
      //First check if a table exist if not create one
      await db.execAsync("CREATE TABLE IF NOT EXISTS my_notes (id INTEGER PRIMARY KEY AUTOINCREMENT, note TEXT)");
      const allRows = await db.getAllAsync('SELECT * FROM my_notes');
      const templateRows = await db.getAllAsync('SELECT * FROM template');
      console.log(allRows);
      for (const row of allRows) {
        console.log(row.id, row.note);
      }
      setNoteArr(allRows);
    }

    const loadNotesFromTemplate = async () => {
      const db = await openConnection();
      const templateRows = await db.getAllAsync('SELECT * FROM templateItem WHERE templateId = ? ',selectedTemplate);
      const notes = [];
      templateRows.forEach((row) => {
        notes.push({id:row.id,note:row.item})
      })
      insertNotesIntoDB(notes);
      setIsModalOpen(false);
    }

    const insertNotesIntoDB = async (notes) => {
      const db = await openConnection();
      notes.forEach(async (note) => {
        const result = await db.runAsync("INSERT INTO my_notes (note) values (?)",note.note);
      })
      const templateRows = await db.getAllAsync('SELECT * FROM my_notes');
      setNoteArr(templateRows);
    }

    
  
    useEffect(() => {
      loadDB();
      loadTemplateListForModal();
    }, []);
    
    useEffect(() => {
      if(isModalOpen){
        loadTemplateListForModal();
      }
    },[isModalOpen])
    
    loadTemplateListForModal = async () => {
      const db = await openConnection();
      const templateRows = await db.getAllAsync('SELECT * FROM template');
      let arrayOfItems = [];
      templateRows.forEach((row) => {
        arrayOfItems.push({key: row.id, value: row.name})
      })
      console.log(arrayOfItems);
      setTemplateList(arrayOfItems);
    }
  
    //ADD NOTE
    const addNote = async () => {
      const db = await openConnection();
      const result = await db.runAsync("INSERT INTO my_notes (note) values (?)",note);
      let prevNotes = [...noteArr]; 
      prevNotes.push({ id: result.lastInsertRowId, note: note }); 
      setNoteArr(prevNotes); 
      setNote(""); 
      const allRows = await db.getAllAsync('SELECT * FROM my_notes');
    };
  
    // DELETE NOTE
    const deleteNote = async (id) => {
      const db = await openConnection();
      const resultSet = await db.runAsync("DELETE FROM my_notes WHERE id=?",id);
      console.log(resultSet);
      if (resultSet.changes > 0) {
        let prevNotes = [...noteArr].filter((note) => note.id != id);
        console.log(prevNotes); //
        setNoteArr(prevNotes);
      }
    };

    const deleteEverything = async (id) => {
        const db = await openConnection();
        const resultSet = await db.runAsync("DELETE FROM my_notes");
        setNoteArr([]);
      };
  
    //EDITOR BEFORE UPDATE
    const editNote = async (id) => {
      setNoteId(id);
      setVisible(true);
      const db = await openConnection();
      let result = await db.getFirstAsync("SELECT note FROM my_notes WHERE id = ?",id)
      setNote(result.note);
    };
  
    //FUNCTION THAT TRIGGERS THE UPDATE
    const updateNote = async () => {
      let text = note;
      const db = await openConnection();
      let resultSet = await db.runAsync("UPDATE my_notes set note = ? WHERE id = ?",text,noteId);
      console.log(resultSet);
      if (resultSet.changes > 0) {
        setNoteArr((prevNotes) => {
          return prevNotes.map((note) => { 
            if (note.id === noteId){ 
              return {...note, note: text}
            }
            return note
          })
        })
      }
      setNote("");
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
            onChangeText={setNote}
            value={note}
            placeholder="Nuovo oggetto da comprare..."
            style={{
              width: "80%",
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
              onPress={updateNote}
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
                if(note === ""){
  
                }else{
                  addNote()
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
          {noteArr.map((item,index) => {
            return (
              <View
                key={item.id}
                style={{
                  fontSize: 20,
                  margin: 5,
                  display: "flex",
                  height: 50,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{fontSize:20}}>{item.note}</Text>
                <View style={{ display: "flex", flexDirection: "row",marginTop:5 }}>
                    <TouchableOpacity style={{marginLeft:10}} onPress={() => {
                      let arr = [...noteArr];
                      if(index > 0){
                        swapElements(arr,index,index-1);
                        setNoteArr(arr);
                      }
                    }}>
                    <FontAwesome name="arrow-up" size={25} color="blue" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginLeft:10}} onPress={() => {
                      let arr = [...noteArr];
                      if(index < arr.length-1){
                        swapElements(arr,index,index+1);
                        setNoteArr(arr);
                      }
                    }}>
                    <FontAwesome name="arrow-down" size={25} color="blue" />
                    </TouchableOpacity>
                  <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => deleteNote(item.id)}
                  >
                    <FontAwesome name="trash-can" size={25} color="red" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => editNote(item.id)}
                  >
                    <FontAwesome name="pen-to-square" size={25} color="blue" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View style={{justifyContent:"space-around",display:"flex",flexDirection:"row"}}>
        <Pressable style={styles.button} onPress={importTemplate}>
        <Text style={styles.text}>Importa template</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={createTwoButtonAlert}>
                <Text style={styles.text}>Cancella lista</Text>
        </Pressable>
        </View>
        <Modal
        visible={isModalOpen}
        transparent
        onRequestClose={() =>{}
          //SetshowWarning(false)
        }
        animationType='fade'
        hardwareAccelerated
      >
        <View style={styles.centered_view}>
          <View style={styles.warning_modal}>
            <View style={styles.warning_title}>
              <Text style={styles.text}>Attenzione</Text>
            </View>
            <View style={styles.warning_body}>
              <Text style={styles.textModal}>Scegli il template da cui vuoi ottenere la lista. ATTENZIONE: la lista attuale verrà sovrascritta</Text>
              {/*<Picker style={{width:300}} selectedValue={selectedTemplate} onValueChange={(itemValue, itemIndex) =>
                    setSelectedTemplate(itemValue)
                }>
                {templateList.map((item,index) => {
                  <Picker.Item key={index} value={item}></Picker.Item>
                })}
                <Picker.Item key={0} value={"No stuff found"} />
              </Picker>*/}
              {<SelectList defaultOption={{key:'-1',value:'Scegli un template' }} 
              inputStyles={{width:"70%"}} 
              dropdownStyles={{width:240}} 
              setSelected={(selectedTemplate) => {
                setSelectedTemplate(selectedTemplate);
              }}
              data={templateList} 
              save="key">
              </SelectList>}
            </View>
            <View style={{display:"flex",justifyContent:"space-around",flexDirection:"row"}}>
            <Pressable
              onPress={() => {
                createTwoButtonAlertForImport();
              }}
              style={styles.warning_button}
              android_ripple={{color:'#fff'}}
            >
              <Text style={styles.textModalButton}>Importa</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setIsModalOpen(false)
              }}
              style={styles.warning_button}
              android_ripple={{color:'#fff'}}
            >
              <Text style={styles.textModalButton}>Chiudi</Text>
            </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      </View>
    );
}