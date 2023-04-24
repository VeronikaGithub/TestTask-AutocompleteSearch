import "../Styles/UserList.scss"

type User = {
  login: string
  id: number
}

type UserListsProps = {
  users: User[]
  selectedUserIndex: number
  handleUserClick: (user: User) => void
}

export default function UserLists({ users, selectedUserIndex, handleUserClick }: UserListsProps) {
  return (
    <ul className="user-list">
      {users.map((user, index) => (
        <li className={`user-list_item${selectedUserIndex === index ? "--selected" : ""}`} key={user.id} onClick={() => handleUserClick(user)} id={`user-${index}`}>
          {user.login}
        </li>
      ))}
    </ul>
  )
}
