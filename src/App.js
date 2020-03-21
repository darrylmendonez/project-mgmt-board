import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialBacklog = [
  { id: uuidv4(), content: 'Create services page'},
  { id: uuidv4(), content: 'Create about page'},
  { id: uuidv4(), content: 'Create contact page'}
];

const initialToDo = [
  { id: uuidv4(), content: 'Create products page'}
]

const initialInProgress = [
  { id: uuidv4(), content: 'Create jumbotron for homepage'},
  { id: uuidv4(), content: 'Create cards for each subpage on homepage'}
]

const initialReview = [
  {id: uuidv4(), content: 'Create navbar'}
]

const initialDone = [
  {id: uuidv4(), content: 'Create footerbar'},
  {id: uuidv4(), content: 'Review wireframe: <a href="https://compassionate-roentgen-1b3083.netlify.com/" target="_blank">https://compassionate-roentgen-1b3083.netlify.com/</a>'}
]

const columnsFromBackend = {
  [uuidv4()]: {
    name: 'Backlog',
    items: initialBacklog
  },
  [uuidv4()]: {
    name: 'To Do',
    items: initialToDo
  },
  [uuidv4()]: {
    name: 'In Progress',
    items: initialInProgress
  },
  [uuidv4()]: {
    name: 'Review',
    items: initialReview
  },
  [uuidv4()]: {
    name: 'Done',
    items: initialDone
  }
}

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    })
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items]
    const[removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    })
  }
}

function App() {
  const [columns, setColumns] = useState(columnsFromBackend);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
      <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([id, column]) => {
          return (
            <div key={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <h2>{column.name}</h2>
              <div style={{ margin: '8px' }}>
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver ? '#ffab00' : 'lightgrey',
                          padding: 4,
                          width: 250,
                          minHeight: 500
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => {
                                return (
                                  <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    userSelect: 'none',
                                    padding: 16,
                                    margin: '0 0 8px 0',
                                    minHeight: '50px',
                                    backgroundColor: snapshot.isDragging ? '#ffcc80' : '#ffe57f',
                                    color: 'black',
                                    ...provided.draggableProps.style
                                  }}
                                  >
                                    <span dangerouslySetInnerHTML={{__html: item.content}} ></span>
                                  </div>
                                )
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )
                  }}
                </Droppable>
              </div>
            </div>
          )
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
