

const { default: AuthContext } = require("@/contexts/auth.context");
const { useContext } = require("react");

const useAuth = () => useContext(AuthContext)

export default useAuth