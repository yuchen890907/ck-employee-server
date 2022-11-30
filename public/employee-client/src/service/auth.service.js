import Axios from "axios";

class AuthService {
  login(account, password) {
    return Axios.post(process.env.REACT_APP_AUTH_URL + "/login/employee", { account, password });
  }

  logout(setLoginState) {
    localStorage.removeItem("login");
    setLoginState({ isLogin: false, token: "", user: null });
  }
  changePassword(originalPassword, password, token) {
    return Axios.patch(
      process.env.REACT_APP_API_URL + "/employees/password",
      { originalPassword, password },
      { headers: { Authorization: token } }
    );
  }
} //end of AuthService

const authService = new AuthService();
export default authService;
