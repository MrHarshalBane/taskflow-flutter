import 'package:flutter/material.dart';
import '../models/task.dart';
import 'package:provider/provider.dart';

import '../providers/task_provider.dart';



class AddTaskScreen extends StatefulWidget {

const AddTaskScreen({super.key});


@override
State<AddTaskScreen> createState()=>_AddTaskScreenState();

}



class _AddTaskScreenState extends State<AddTaskScreen>{


final title =
TextEditingController();


final desc =
TextEditingController();



@override
Widget build(BuildContext context){


return Scaffold(


appBar:

AppBar(
title:
const Text("Add Task"),
),



body:

Padding(

padding:
const EdgeInsets.all(20),


child:Column(

children:[


TextField(

controller:title,

decoration:

const InputDecoration(

labelText:"Title",

),

),



TextField(

controller:desc,

decoration:

const InputDecoration(

labelText:"Description",

),

),



const SizedBox(height:20),



ElevatedButton(


child:

const Text("Save Task"),



onPressed:(){


final task=

Task(

id:
DateTime.now()
.millisecondsSinceEpoch,

title:title.text,

description:desc.text,

category:"General",

priority:"Medium",

completed:false,

);



Provider.of<TaskProvider>(
context,
listen:false
)
.addTask(task);



Navigator.pop(context);



},


)


],


),


),


);


}



}
