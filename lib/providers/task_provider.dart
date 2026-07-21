import 'package:flutter/material.dart';
import '../models/task.dart';
import '../services/json_service.dart';



class TaskProvider extends ChangeNotifier{


List<Task> tasks=[];


void loadData() async{


tasks = await JsonService().loadTasks();

notifyListeners();


}



void addTask(Task task){

tasks.add(task);

notifyListeners();

}



void deleteTask(int id){

tasks.removeWhere(
(task)=>task.id==id
);

notifyListeners();

}



void toggleTask(Task task){

task.completed=!task.completed;

notifyListeners();

}


}
