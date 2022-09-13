import { useContext, createContext, useReducer } from 'react'

const CharacterContext = createContext()

const defaultCharacter = {
  character: '',
  hat: '',
  shoes: ''
}

const characterReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_CHARACTER':
      return {
        ...state,
        character: action.character
      }

    case 'CHANGE_HAT':
      return {
        ...state,
        hat: action.hat
      }

    case 'CHANGE_SHOES':
      return {
        ...state,
        shoes: action.shoes
      }

    case 'REMOVE_HAT':
      return {
        ...state,
        hat: ''
      }

    case 'REMOVE_SHOES':
      return {
        ...state,
        shoes: ''
      }

    case 'RESET':
      return {
        character: '',
        hat: '',
        shoes: ''
      }

    default:
      return defaultCharacter
  }
}

export const CharacterWrapper = ({ children }) => {
  const [characterState, dispatchCharacter] = useReducer(
    characterReducer,
    defaultCharacter
  )

  const changeCharacter = (character) => {
    dispatchCharacter({ type: 'CHANGE_CHARACTER', character })
  }

  const changeShoes = (shoes) => {
    dispatchCharacter({ type: 'CHANGE_SHOES', shoes })
  }

  const changeHat = (hat) => {
    dispatchCharacter({ type: 'CHANGE_HAT', hat })
  }

  const resetCharacter = () => {
    dispatchCharacter({ type: 'RESET' })
  }

  return (
    <CharacterContext.Provider
      value={{
        characterState,
        changeCharacter,
        changeShoes,
        changeHat,
        resetCharacter
      }}
    >
      {children}
    </CharacterContext.Provider>
  )
}

export function useCharacterContext() {
  return useContext(CharacterContext)
}
