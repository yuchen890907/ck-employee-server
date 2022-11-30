import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import authService from "../service/auth.service";

const Logout = () => {
	const { setLoginState } = useStateContext();
	const navigate = useNavigate();
	useEffect(() => {
		authService.logout(setLoginState);
		navigate("/login");
	}, []);
	return <div>登出中..</div>;
};

export default Logout;
