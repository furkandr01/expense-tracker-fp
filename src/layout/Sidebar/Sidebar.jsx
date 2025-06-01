import { useEffect, useState } from 'react';
import { personsImgs } from '../../utils/images';
import { navigationLinks } from '../../data/data';
import './Sidebar.css';
import { useContext } from 'react';
import { SidebarContext } from '../../context/sidebarContext';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const Sidebar = () => {
  const [sidebarClass, setSidebarClass] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [userName, setUserName] = useState('User');
  const { isSidebarOpen } = useContext(SidebarContext);
  const { currentUser, theme, updateTheme } = useAuth();

  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarClass('sidebar-change');
    } else {
      setSidebarClass('');
    }
  }, [isSidebarOpen]);


  useEffect(() => {
    if (currentUser) {
      if (currentUser.profileImage) {
        const imageUrl = `http://localhost:5001${currentUser.profileImage}`;
        setProfileImg(imageUrl);
      } else {
        setProfileImg(personsImgs.person_one);
      }

      if (currentUser.firstName && currentUser.lastName) {
        setUserName(`${currentUser.firstName} ${currentUser.lastName}`);
      } else {
        setUserName(currentUser.username || 'User');
      }
    } else {
      setProfileImg(personsImgs.person_one);
      setUserName('User');
    }
  }, [currentUser]);

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    updateTheme(newTheme);
  };

  return (
    <div className={`sidebar ${sidebarClass}`}>
      <div className="user-info">
        <div className="info-img img-fit-cover">
          <img src={profileImg} alt="profile image" />
        </div>
        <span className="info-name">{userName}</span>
      </div>

      <nav className="navigation">
        <ul className="nav-list">
          {navigationLinks.slice(0, -1).map((navigationLink) => (
            <li className="nav-item" key={navigationLink.id}>
              <NavLink
                to={`/${navigationLink.title.toLowerCase().replace(/\s+/g, '-')}`}
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <img
                  src={navigationLink.image}
                  className="nav-link-icon"
                  alt={navigationLink.title}
                />
                <span className="nav-link-text">{navigationLink.title}</span>
              </NavLink>
            </li>
          ))}
          
          <li className="nav-item" key={navigationLinks[navigationLinks.length - 1].id}>
            <div className="nav-link" onClick={handleThemeToggle}>
              <img
                src={navigationLinks[navigationLinks.length - 1].image}
                className="nav-link-icon"
                alt="Theme"
              />
              <span className="nav-link-text">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
