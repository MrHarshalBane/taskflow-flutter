class Task {

  final int id;
  String title;
  String description;
  String category;
  String priority;
  bool completed;


  Task({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.priority,
    required this.completed,
  });


  factory Task.fromJson(Map<String,dynamic> json){

    return Task(
      id: json["id"],
      title: json["title"],
      description: json["description"],
      category: json["category"],
      priority: json["priority"],
      completed: json["completed"],
    );

  }


  Map<String,dynamic> toJson(){

    return {

      "id":id,
      "title":title,
      "description":description,
      "category":category,
      "priority":priority,
      "completed":completed

    };

  }

}
