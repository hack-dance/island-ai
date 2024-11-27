import { useEffect, useState } from "react"

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState(initialValue)

  useEffect(() => {
    const item = window.localStorage.getItem(key)

    if (item) {
      setStoredValue(JSON.parse(item)?.value ?? initialValue)
    }
  }, [key])

  const setValue = (value: T, specificKey: string = key) => {
    setStoredValue(value)

    window.localStorage.setItem(specificKey, JSON.stringify({ value }))
  }

  return [storedValue, setValue]
}

export default useLocalStorage
