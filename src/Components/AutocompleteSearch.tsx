import "../Styles/AutocompleteSearch.scss"

import axios from "axios"
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react"
import UserLists from "./UserLists"
import Search from "./Search"

type User = {
  login: string
  id: number
}

export default function AutocompleteSearch() {
  const [query, setQuery] = useState<string>("")
  const [selectedUserIndex, setSelectedUserIndex] = useState<number>(-1)
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [users, setUsers] = useState([])
  const [limitError, setLimitError] = useState(false)

  useEffect(() => {
    if (selectedUserIndex !== -1) {
      scrollActiveUserIntoView(selectedUserIndex)
    }
  }, [selectedUserIndex])

  const fetchData = async (query: string) => {
    setLimitError(false)
    try {
      const {
        data: { items },
      } = await axios.get(`https://api.github.com/search/users?q=${query}`)
      setSearchResults(items.filter((user: User) => user.login.toLowerCase().includes(query)))
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response?.status === 403) {
          setLimitError(true)
        }
      }
    }
  }

  function debounceFetch(query: string): () => void {
    let timer: ReturnType<typeof setTimeout>
    return () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fetchData(query)
      }, 300)
    }
  }
  function scrollActiveUserIntoView(index: number) {
    const activeUser = document.getElementById(`user-${index}`)
    if (activeUser) {
      activeUser.scrollIntoView({
        block: "nearest",
        inline: "start",
        behavior: "smooth",
      })
    }
  }

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    debounceFetch(event.target.value)()
    setQuery(event.target.value)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      setSelectedUserIndex((prevIndex) => (prevIndex === -1 ? searchResults.length - 1 : prevIndex - 1))
    } else if (event.key === "ArrowDown") {
      setSelectedUserIndex((prevIndex) => (prevIndex === searchResults.length - 1 ? -1 : prevIndex + 1))
    } else if (event.key === "Enter") {
      if (selectedUserIndex !== -1) {
        const selectedUser = searchResults[selectedUserIndex]
        setQuery(selectedUser.login)
        setSearchResults([])
        setSelectedUserIndex(-1)
        console.log(selectedUser)
      }
    }
  }
  function handleUserClick(user: User) {
    setQuery(user.login)
    setSearchResults([])
    setSelectedUserIndex(-1)
  }

  return (
    <div className="container">
      <Search handleQueryChange={handleQueryChange} handleKeyDown={handleKeyDown} query={query} />
      {searchResults.length > 0 ? <UserLists key={123} users={searchResults} selectedUserIndex={selectedUserIndex} handleUserClick={handleUserClick} /> : <div>Users are not found</div>}
      {limitError && <div>API rate limit exceeded</div>}
    </div>
  )
}
