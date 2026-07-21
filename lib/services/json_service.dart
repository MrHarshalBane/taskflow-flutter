import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/task.dart';


class JsonService {


Future<List<Task>> loadTasks() async{


final String response =
await rootBundle.loadString("assets/data/tasks.json");


final data=json.decode(response);


return List<Task>.from(

data.map(
(item)=>Task.fromJson(item)
)

);


}


}
