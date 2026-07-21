import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider<TaskProvider>(
      create: (context) => TaskProvider(),
      builder: (context, child) => const TaskFlowApp(),
    ),
  );
}

class Task {
  final String id;
  String title;
  bool isCompleted;
  int stage; // 0: To Do, 1: In Progress, 2: Done

  Task({
    required this.id,
    required this.title,
    this.isCompleted = false,
    this.stage = 0,
  });
}

class TaskProvider extends ChangeNotifier {
  final List<Task> _tasks = [
    Task(id: '1', title: 'Design System', stage: 0),
    Task(id: '2', title: 'Implement Widgets', stage: 1),
    Task(id: '3', title: 'Review Code', stage: 2),
  ];

  List<Task> get tasks => List.unmodifiable(_tasks);

  void updateTaskStage(String id, int newStage) {
    final index = _tasks.indexWhere((task) => task.id == id);
    if (index != -1) {
      _tasks[index].stage = newStage;
      _tasks[index].isCompleted = newStage == 2;
      notifyListeners();
    }
  }

  void addTask(String title) {
    _tasks.add(Task(id: DateTime.now().toString(), title: title));
    notifyListeners();
  }
}

class TaskFlowApp extends StatelessWidget {
  const TaskFlowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const TaskFlowDashboard(),
    );
  }
}

class TaskFlowDashboard extends StatelessWidget {
  const TaskFlowDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Workflow Status')),
      body: Row(
        children: [
          _buildColumn(context, 'To Do', 0, Colors.red.shade100),
          _buildColumn(context, 'In Progress', 1, Colors.amber.shade100),
          _buildColumn(context, 'Done', 2, Colors.green.shade100),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.read<TaskProvider>().addTask('New Task'),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildColumn(BuildContext context, String title, int stage, Color color) {
    return Expanded(
      child: Container(
        color: color,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
            ),
            Expanded(
              child: Consumer<TaskProvider>(
                builder: (context, provider, child) {
                  final filtered = provider.tasks.where((t) => t.stage == stage).toList();
                  return ListView.builder(
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final task = filtered[index];
                      return Card(
                        child: ListTile(
                          title: Text(task.title),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              if (stage > 0)
                                IconButton(
                                  icon: const Icon(Icons.arrow_back),
                                  onPressed: () => provider.updateTaskStage(task.id, stage - 1),
                                ),
                              if (stage < 2)
                                IconButton(
                                  icon: const Icon(Icons.arrow_forward),
                                  onPressed: () => provider.updateTaskStage(task.id, stage + 1),
                                ),
                            ],
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
