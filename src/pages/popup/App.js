import React, { useState } from 'react'
import useLocalStorage from '../../background/useLocalStorage'
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from 'unique-names-generator'

const App = () => {
  const [workspaces, setWorkspaces] = useLocalStorage('workspaces', {})
  const [editMode, changeEditMode] = useState(false)
  const [inEditMode, setInEditMode] = useState('')
  const [editedValue, setEditedVal] = useState('')

  const getTabs = () => {
    var newWorkspace = []
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      tabs.forEach(function (tab) {
        // do whatever you want with the tab
        newWorkspace.push({
          // favIconUrl: tab.favIconUrl,
          url: tab.url,
          // title: tab.title,
          // highlighted: tab.highlighted,
          pinned: tab.pinned,
        })
      })
      addWorkspace(newWorkspace)
    })
  }

  const getRandomName = () => {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
    })
  }
  const addWorkspace = (param) => {
    var listName = getRandomName()
    var newList = { ...workspaces, [listName]: param }
    setWorkspaces(newList)
  }

  const restore = (e) => {
    let id = e.target.id
    console.log(workspaces[id])
    workspaces[id].forEach((tab) => {
      chrome.tabs.create(tab)
    })
  }

  const deleteWorkspace = (e) => {
    let id = e.currentTarget.value
    let filtered = Object.fromEntries(
      Object.entries(workspaces).filter(([key]) => key != id),
    )
    setWorkspaces(filtered)
  }

  const toggleEditMode = (e) => {
    changeEditMode(!editMode)
    setEditedVal(e.currentTarget.value)
    setInEditMode(e.currentTarget.value)
  }

  const saveEditedVal = (e) => {
    // save
    changeEditMode(!editMode)
    setInEditMode('')
    let id = e.currentTarget.value
    workspaces[editedValue] = workspaces[id]
    if (id != editedValue) {
      let filtered = Object.fromEntries(
        Object.entries(workspaces).filter(([key]) => key != id),
      )
      setWorkspaces(filtered)
    }
  }

  return (
    <div className="w-96 h-80 p-3 text-slate-100 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600">
      <div className="flex items-center place-content-between">
        <button
          className="rounded-md text-white bg-rose-500 px-2 py-1"
          onClick={getTabs}
        >
          Save
        </button>
      </div>
      <div className="flex mt-3 flex-col space-y-2">
        {Object.keys(workspaces).map((keyName, i) => (
          <div className="flex items-center place-content-between" key={i}>
            {keyName === inEditMode && editMode ? (
              <input
                className="text-md p-1 bg-gray-500"
                value={editedValue}
                onChange={(e) => setEditedVal(e.target.value)}
                autoFocus
              ></input>
            ) : (
              <p className="text-md ">{keyName}</p>
            )}
            <div className="flex items-center space-x-1">
              <button
                id={keyName}
                onClick={restore}
                className="rounded-md text-xs text-white bg-indigo-500 px-1 py-1.5"
              >
                Restore
              </button>
              {!editMode && (
                <button
                  className="text-amber-600"
                  value={keyName}
                  onClick={toggleEditMode}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              )}
              {keyName == inEditMode && editMode ? (
                <button
                  className="text-green-600"
                  value={keyName}
                  onClick={saveEditedVal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ) : (
                ''
              )}

              <button
                value={keyName}
                onClick={deleteWorkspace}
                className="text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="fixed bottom-0 text-xs text-slate-400 mb-1">
        Save your tabs and restore them later. Manage multiple workspaces.
      </p>
    </div>
  )
}

export default App
