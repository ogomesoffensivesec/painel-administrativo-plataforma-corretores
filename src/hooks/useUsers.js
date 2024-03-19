import UsersContext from "@/contexts/user.context";


const { useContext } = require("react");

const useUsers = () => useContext(UsersContext)

export default useUsers