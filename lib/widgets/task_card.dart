import 'package:flutter/material.dart';

import '../models/task.dart';


class TaskCard extends StatelessWidget {


final Task task;

final VoidCallback onDelete;

final VoidCallback onComplete;



const TaskCard({

super.key,

required this.task,

required this.onDelete,

required this.onComplete,

});



@override
Widget build(BuildContext context){


return Card(

margin:
const EdgeInsets.symmetric(
horizontal:16,
vertical:8
),


child: ListTile(


leading:

Checkbox(

value:task.completed,

onChanged:(_){

onComplete();

},

),



title:Text(

task.title,

style:TextStyle(

fontWeight:FontWeight.bold,

decoration:

task.completed

? TextDecoration.lineThrough

:null,

),

),



subtitle:Column(

crossAxisAlignment:
CrossAxisAlignment.start,

children:[


Text(task.description),


const SizedBox(height:5),


Row(

children:[


Chip(

label:Text(task.category),

),


const SizedBox(width:8),


Chip(

label:Text(task.priority),

),

],)


],),



trailing:

IconButton(

icon:

const Icon(
Icons.delete,
color:Colors.red,
),

onPressed:onDelete,

),



),


);


}


}
