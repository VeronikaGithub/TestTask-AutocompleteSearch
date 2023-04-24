import { ChangeEvent, KeyboardEvent } from "react"

type SearchProps = {
  handleQueryChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  query: string
}

export default function Search({ handleQueryChange, handleKeyDown, query }: SearchProps) {
  return <input type="text" onChange={handleQueryChange} onKeyDown={handleKeyDown} value={query} placeholder="Search GitHub users" className="input" />
}
