import 'package:flutter/material.dart';
import 'package:provider/provider.dart';


import '../providers/task_provider.dart';
import '../widgets/task_card.dart';
import 'add_task_screen.dart';



class HomeScreen extends StatefulWidget {

const HomeScreen({super.key});


@override
State<HomeScreen> createState()=>_HomeScreenState();

}



class _HomeScreenState extends State<HomeScreen>{


String search="";


@override
Widget build(BuildContext context){


final provider =
Provider.of<TaskProvider>(context);



final tasks =
provider.tasks.where((task){


return task.title
.toLowerCase()
.contains(search.toLowerCase());


}).toList();



return Scaffold(



appBar:AppBar(

title:
const Text(
"TaskFlow 🚀"
),

),




floatingActionButton:

FloatingActionButton(

child:
const Icon(Icons.add),

onPressed:(){

Navigator.push(

context,

MaterialPageRoute(

builder:(_)=>
const AddTaskScreen(),

),

);

},

),



body:Column(

children:[


Padding(

padding:
const EdgeInsets.all(16),


child:TextField(

decoration:

const InputDecoration(

hintText:"Search tasks",

prefixIcon:
Icon(Icons.search),

border:
OutlineInputBorder(),

),


onChanged:(value){

setState((){

search=value;

});

},

),

),




Expanded(

child:

ListView.builder(

itemCount:
tasks.length,


itemBuilder:(context,index){


final task=tasks[index];


return TaskCard(

task:task,


onDelete:(){

provider.deleteTask(task.id);

},



onComplete:(){

provider.toggleTask(task);

},


);


},

),


)


],

),



);


}



}
