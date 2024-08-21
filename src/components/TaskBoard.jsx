import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskSection from './TaskSection';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import "../pages/Private.css";

const TaskBoard = () => {
  const [tasks, setTasks] = useState({ 'to-do': [], 'in-progress': [], 'completed': [] });
  const [taskContent, setTaskContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksCollection = collection(db, "tasks");
      const snapshot = await getDocs(tasksCollection);
      const tasksData = snapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        acc[data.section] = [...(acc[data.section] || []), { id: doc.id, content: data.content }];
        return acc;
      }, {});
      setTasks(tasksData);
    };
    fetchTasks();
  }, []);

  const handleOnDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const start = source.droppableId;
    const end = destination.droppableId;

    if (start === end) {
      // Reordering within the same section
      const updatedTasks = Array.from(tasks[start]);
      const [moved] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, moved);
      setTasks(prev => ({ ...prev, [start]: updatedTasks }));

      // Update Firestore
      await Promise.all(updatedTasks.map(async (task, index) => {
        const taskRef = doc(db, "tasks", task.id);
        await updateDoc(taskRef, { index });
      }));
    } else {
      const startTasks = Array.from(tasks[start]);
      const endTasks = Array.from(tasks[end]);
      const [moved] = startTasks.splice(source.index, 1);
      endTasks.splice(destination.index, 0, moved);
      setTasks(prev => ({ ...prev, [start]: startTasks, [end]: endTasks }));

      // Update Firestore
      await Promise.all([
        ...startTasks.map(async (task, index) => {
          const taskRef = doc(db, "tasks", task.id);
          await updateDoc(taskRef, { section: start, index });
        }),
        ...endTasks.map(async (task, index) => {
          const taskRef = doc(db, "tasks", task.id);
          await updateDoc(taskRef, { section: end, index });
        })
      ]);
    }
  };

  const addTask = async () => {
    if (taskContent.trim() === '') return;

    const newTask = {
      content: taskContent,
      section: 'to-do'
    };

    const docRef = await addDoc(collection(db, "tasks"), newTask);

    setTasks(prev => ({
      ...prev,
      'to-do': [...prev['to-do'], { id: docRef.id, content: taskContent }]
    }));
    setTaskContent('');
    setIsAdding(false);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="task-board">
        {['to-do', 'in-progress', 'completed'].map((section) => (
          <TaskSection
            key={section}
            section={section}
            tasks={tasks[section]}
            addTask={addTask}
            taskContent={taskContent}
            setTaskContent={setTaskContent}
            isAdding={isAdding}
            setIsAdding={setIsAdding}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
