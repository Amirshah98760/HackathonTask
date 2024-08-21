import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const TaskSection = ({ section, tasks, addTask, taskContent, setTaskContent, isAdding, setIsAdding }) => {
  return (
    <Droppable droppableId={section}>
      {(provided) => (
        <div
          className="task-section"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h2>{section.replace('-', ' ').toUpperCase()}</h2>
          {section === 'to-do' && (
            <>
              {isAdding ? (
                <div>
                  <input
                    type="text"
                    value={taskContent}
                    onChange={(e) => setTaskContent(e.target.value)}
                    placeholder={`Add a task to ${section.replace('_', ' ')}`}
                  />
                  <button onClick={addTask}>Add Task</button>
                  <button onClick={() => setIsAdding(false)} style={{ marginLeft: '10px' }}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setIsAdding(true)}>Add New Task</button>
              )}
            </>
          )}
          {tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided) => (
                <div
                  className="task"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {task.content}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TaskSection;
