import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'providers/task_provider.dart';
import 'screens/home_screen.dart';
import 'theme/app_theme.dart';


void main(){

  runApp(
    ChangeNotifierProvider(
      create: (_) => TaskProvider()..loadData(),
      child: const TaskFlow(),
    ),
  );

}


class TaskFlow extends StatelessWidget {

  const TaskFlow({super.key});


  @override
  Widget build(BuildContext context){

    return MaterialApp(

      debugShowCheckedModeBanner:false,

      title:"TaskFlow",

      theme: AppTheme.lightTheme,

      home: const HomeScreen(),

    );

  }

}
