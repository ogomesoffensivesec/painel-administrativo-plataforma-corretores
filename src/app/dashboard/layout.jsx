const { default: Sidebar } = require("@/components/sidebar/sidebar");

const layout = ({ children }) => {
  return (
    <div className="flex mx-auto w-full">
      <div>
        <Sidebar />
      </div>
      <main className="w-full">{children}</main>
    </div>
  );
};

export default layout;
