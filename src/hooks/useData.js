

const { default: DataContext } = require("@/contexts/data.context");
const { useContext } = require("react");

const useData = () => useContext(DataContext)

export default useData