import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-main">
        <Navbar />
        <div className="layout-page">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
