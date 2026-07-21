import 'package:flutter/material.dart';


class AppTheme {


static ThemeData lightTheme = ThemeData(

  useMaterial3:true,

  colorScheme: ColorScheme.fromSeed(
    seedColor: Colors.blue,
  ),

  scaffoldBackgroundColor:
      const Color(0xffF5F7FB),


  appBarTheme: const AppBarTheme(

    centerTitle:true,

    elevation:0,

    backgroundColor:
        Colors.transparent,

  ),


);


}
