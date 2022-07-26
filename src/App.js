import React, {useState, useEffect} from 'react';
import {v4} from 'uuid'
import randomColor from 'randomcolor'
import Draggable from 'react-draggable';

function App() {

  const [item, setItem] = useState('')
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem('items')) || []
  )

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items))
  }, [items])

  const inputChangeHandler = (e) => {
    setItem(e.target.value)
  }

  const createItemHandler = () => {
    if (item.trim() !== '') {
      const newItem = {
        id: v4(),
        item: item,
        color: randomColor({
          luminosity: 'light'
        }),
        defaultPos: {
          x: 500,
          y: -500
        }
      }

      setItems((prev) => {
        return [...prev, newItem]
      })

      setItem('')

    } else {
      alert('Enter something!')
    }
  }

  const keyPress = (e) => {
    const code = e.keyCode || e.which

    if (code === 13) {
      createItemHandler()
    }
  }

  const deleteItemHandle = (id) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const updatePositions = (data, index) => {
    const clonedArr = [...items]
    clonedArr[index].defaultPos = {x: data.x, y: data.y}
    setItems(clonedArr)    
  }

  return (
    <div className="App">
      <div className='wrapper'>
        <input 
          type='text' 
          placeholder='Type here...' 
          onChange={(e) => inputChangeHandler(e)}
          value={item}
          onKeyPress={(e) => keyPress(e)}
        />
        <button 
          className='enter'
          onClick={createItemHandler}
        >Enter</button>
      </div>

      { items &&
        items.map((item, index) => (
          <Draggable  
            key={index}
            defaultPosition={item.defaultPos}
            onStop={(_, data) => {
              updatePositions(data, index)
            }}
          > 
            <div 
              className='todo__item' 
              style={{
                'backgroundColor': item.color,
                'boxShadow': `2px 4px 5px black`
              }}
            >
              {item.item}
              <button
                onClick={() => deleteItemHandle(item.id)}
                className='delete'
              >x</button>
            </div>
          </Draggable>
        ))
      }
    </div>
  );
}

export default App;
