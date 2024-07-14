import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    background:{
      flex: 1,
      justifyContent: 'center'
    },
    text: {
      fontSize: 25,
      fontWeight: 'bold',
      color: 'white',
      textAlign:"center"
    },
    addContainer: {
      display: 'flex', 
      flexDirection: 'row'
    },
    input: {
      backgroundColor: 'white',
      height: 50,
      width: 350,
      padding: 2
    },
    childText: {
      color: 'white',
      fontSize: 30,
      textAlign: 'center',
      fontWeight: 'bold'
    },
    title: {
      color: "white",
      textAlign: 'center',
      fontWeight: 'bold'
    },
    btn:{
      width: 50,
      height: 50,
      elevation: 5,
      backgroundColor: "orange",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    btnText: {
      color: "white",
      fontWeight: 'bold'
    },
    button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'orange',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  textModalButton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
    margin:10,
    marginLeft:20
  },
  textModal: {
    color: '#000000',
    marginBottom:30,
    width:"80%"
    /*fontSize: 20,
    margin: 10,
    textAlign: 'center',*/
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centered_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099'
  },
  warning_modal: {
    width: 300,
    height: 600,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
  },
  warning_title: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  warning_body: {
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warning_button:{
    backgroundColor:'orange',
    width:100,
    borderRadius:30,
  }
  })