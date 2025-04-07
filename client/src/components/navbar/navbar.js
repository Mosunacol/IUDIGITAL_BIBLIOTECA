import "./navbar.css";
import logouticon from "../../assets/logout.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/reducer/authSlice";
import book from "../../assets/logo.png";
import { useEffect } from "react";
import {
  resetAuthorDetail,
  resetAuthorNames,
  resetAuthors,
  resetStatus,
} from "../../redux/reducer/authorSlice";
import {
  resetBookDetail,
  resetBooks,
  resetStatusDelete,
  resetStatusRent,
} from "../../redux/reducer/bookSlice";
import {
  resetUserDetail,
  resetUsers,
  resetUserState,
} from "../../redux/reducer/userSlice";

/**
 * Componente de barra de navegación.
 *
 * Proporciona enlaces de navegación dentro de la aplicación y maneja la autenticación del usuario.
 *
 * @component
 * @returns {JSX.Element} Barra de navegación de la aplicación.
 */
export function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { success, user } = useSelector((state) => state.auth);
  const validateRoleLib = user?.role === "ADMIN" || user?.role === "LIBRARIAN";
  const validateRoleAdmin = user?.role === "ADMIN";

  /**
   * Efecto para verificar la autenticación del usuario.
   * Si no hay un token válido, redirige al usuario a la página de login.
   */
  useEffect(() => {
    const token = user ? user.token : null;
    if (!token) {
      navigate("/login");
    } else {
      localStorage.setItem("authToken", user?.token);
    }
  }, [navigate, user]);

  /**
   * Maneja el cierre de sesión del usuario.
   *
   * Despacha la acción de cierre de sesión (`logout`) y redirige al usuario a la página de login.
   */
  const handleLogout = () => {
    dispatch(logout());
    navigate("/Login");
    resetStatusGeneral();
  };

  /**
   * Reinicia todos los estados al entrar en una nueva seccion del menu
   */
  const resetStatusGeneral = () => {
    dispatch(resetStatus());
    dispatch(resetAuthors());
    dispatch(resetAuthorDetail());
    dispatch(resetAuthorNames());
    dispatch(resetStatus());
    dispatch(resetBooks());
    dispatch(resetBookDetail());
    dispatch(resetStatusRent());
    dispatch(resetStatusDelete());
    dispatch(resetUserState());
    dispatch(resetUsers());
    dispatch(resetUserDetail());
  };

  if (!user) {
    return (
      <header className="navbar">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <NavLink className="navlink" to="/">
              <img
                width="40px"
                height="40px"
                className="logo-mini"
                id="logo"
                src={book}
                alt="wallpaper"
              />
              <span className="navbar-brand">Simple Book</span>
            </NavLink>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="navbar">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <NavLink className="navlink" to="/">
            <img
              width="40px"
              height="40px"
              className="logo-mini"
              id="logo"
              src={book}
              alt="wallpaper"
              onClick={resetStatusGeneral}
            />
            <span className="navbar-brand">Simple Book</span>
          </NavLink>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle"
                  to="/Book/Search"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={resetStatusGeneral}
                >
                  Libros
                </NavLink>
                {validateRoleLib && (
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <NavLink
                        className="dropdown-item"
                        to="/Book/Search"
                        onClick={resetStatusGeneral}
                      >
                        Buscar
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="dropdown-item"
                        to="/Book/Add"
                        onClick={resetStatusGeneral}
                      >
                        Agregar
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle"
                  to="/Author/Search"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={resetStatusGeneral}
                >
                  Autores
                </NavLink>
                {validateRoleLib && (
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <NavLink
                        className="dropdown-item"
                        to="/Author/Search"
                        onClick={resetStatusGeneral}
                      >
                        Buscar
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="dropdown-item"
                        to="/Author/Add"
                        onClick={resetStatusGeneral}
                      >
                        Agregar
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              {validateRoleLib ? (
                <li className="nav-item dropdown">
                  <NavLink
                    className="nav-link  dropdown-toggle"
                    to="/User/Search"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={resetStatusGeneral}
                  >
                    Usuario
                  </NavLink>
                  {validateRoleAdmin && (
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to="/User/Search"
                          onClick={resetStatusGeneral}
                        >
                          Buscar
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to="/User/Add"
                          onClick={resetStatusGeneral}
                        >
                          Registrar
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              ) : (
                <div></div>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {success ? (
        <div className="user-info">
          <h6 className="user-name">Hola, {user?.name}</h6>{" "}
          <img
            className="icon-logout"
            id="logoutIcon"
            src={logouticon}
            width="25px"
            height="25px"
            alt="Ícono de logout"
            onClick={handleLogout}
          />
        </div>
      ) : (
        <div></div>
      )}
    </header>
  );
}

export default NavBar;
