import React, { createContext, useContext, useEffect, useState } from "react";
import { useReducer } from "react";
import { emptyTableState, tables } from "../data/data.config";
import fetchService from "../service/fetch.service";
import io from "socket.io-client";

const StateContext = createContext();
const reducer = (state, action) => {
	switch (action.table) {
		case "genericgoods":
			if (typeof action.actions === "function") return { ...state, genericgoods: action.actions(state.genericgoods) };
			else return { ...state, genericgoods: action.actions };
		case "purchases":
			if (typeof action.actions === "function") return { ...state, purchases: action.actions(state.purchases) };
			else return { ...state, purchases: action.actions };
		case "purchasedetails":
			if (typeof action.actions === "function")
				return {
					...state,
					purchasedetails: action.actions(state.purchasedetails),
				};
			else return { ...state, purchasedetails: action.actions };
		case "productclasses":
			if (typeof action.actions === "function")
				return {
					...state,
					productclasses: action.actions(state.productclasses),
				};
			else return { ...state, productclasses: action.actions };
		case "products":
			if (typeof action.actions === "function") return { ...state, products: action.actions(state.products) };
			else return { ...state, products: action.actions };
		case "boms":
			if (typeof action.actions === "function") return { ...state, boms: action.actions(state.boms) };
			else return { ...state, boms: action.actions };
		case "employees":
			if (typeof action.actions === "function") return { ...state, employees: action.actions(state.employees) };
			else return { ...state, employees: action.actions };
		case "suppliers":
			if (typeof action.actions === "function") return { ...state, suppliers: action.actions(state.suppliers) };
			else return { ...state, suppliers: action.actions };
		case "punchrecords":
			if (typeof action.actions === "function") return { ...state, punchrecords: action.actions(state.punchrecords) };
			else return { ...state, punchrecords: action.actions };
		case "schedules":
			if (typeof action.actions === "function") return { ...state, schedules: action.actions(state.schedules) };
			else return { ...state, schedules: action.actions };
		case "soprecords":
			if (typeof action.actions === "function") return { ...state, soprecords: action.actions(state.soprecords) };
			else return { ...state, soprecords: action.actions };
		case "guides":
			if (typeof action.actions === "function") return { ...state, guides: action.actions(state.guides) };
			else return { ...state, guides: action.actions };
		case "sopform":
			if (typeof action.actions === "function") return { ...state, sopform: action.actions(state.sopform) };
			else return { ...state, sopform: action.actions };
		case "seats":
			if (typeof action.actions === "function") return { ...state, seats: action.actions(state.seats) };
			else return { ...state, seats: action.actions };
		case "positions":
			if (typeof action.actions === "function") return { ...state, positions: action.actions(state.positions) };
			else return { ...state, positions: action.actions };
		case "earningrecord":
			if (typeof action.actions === "function")
				return { ...state, earningrecord: action.actions(state.earningrecord) };
			else return { ...state, earningrecord: action.actions };
		case "sales":
			if (typeof action.actions === "function") return { ...state, sales: action.actions(state.sales) };
			else return { ...state, sales: action.actions };
		case "saledetails":
			if (typeof action.actions === "function") return { ...state, saledetails: action.actions(state.saledetails) };
			else return { ...state, saledetails: action.actions };
		case "hotRank":
			if (typeof action.actions === "function") return { ...state, hotRank: action.actions(state.hotRank) };
			else return { ...state, hotRank: action.actions };
		case "orders":
			if (typeof action.actions === "function") return { ...state, orders: action.actions(state.orders) };
			else return { ...state, orders: action.actions };
		default:
			throw new Error("reducer error!!!!!!!!!!!!!!!!!");
	}
};
const permission = {};

export const ContextProvider = ({ children }) => {
	const emptyLoginState = { isLogin: false, token: null, user: null, permission: null };
	let loginInit = { ...emptyLoginState };
	const o = JSON.parse(localStorage.getItem("login")); // o = object
	if (o && o.success) {
		fetchService.token = o.token;
		loginInit = { isLogin: true, token: o.token, user: o.user, permission: permission };
	}
	const [dataState, setDataState] = useReducer(reducer, emptyTableState);
	const [loginState, setLoginState] = useState(loginInit);
	const [filterState, setFilterState] = useState([]);
	const [socket, setSocket] = useState();
	const [systemLoading, setSystemLoading] = useState(true);

	const authExpired = (error) => {
		if (error.response.status === 401) {
			localStorage.removeItem("login");
			setLoginState(emptyLoginState);
			window.location.assign("/login");
		}
	};

	const [APIState] = useState({
		fetchAllTable: () => {
			Object.values(tables).forEach(async (table) => {
				try {
					const res = await fetchService.findAll(table);
					setDataState({ table, actions: res.data.data });
				} catch (error) {
					authExpired(error);
				}
			});
			setSystemLoading(false);
		},
		fetch: (table) => {
			fetchService
				.findAll(table)
				.then((res) => setDataState({ table, actions: res.data.data }))
				.catch((error) => authExpired(error));
		},
		fetchAll: async (path, data) => {
			try {
				return await fetchService.fetchAll(path, data);
			} catch (error) {
				authExpired(error);
				return error.response.data;
			}
		},
		findOneByKey: async (table, key, value) => {
			try {
				const res = await fetchService.findOneByKey(table, key, value);
				return res.data;
			} catch (error) {
				authExpired(error);
				return error.response.data;
			}
		},
		insertOne: async (table, data) => {
			try {
				const res = await fetchService.insertOne(table, data);
				if (res.data.success) return null;
				return res.data.message;
			} catch (error) {
				authExpired(error);
				console.log(error);
				return error.response.data.message || "發生錯誤";
			}
		},
		updateOne: async (table, data, index) => {
			try {
				const res = await fetchService.updateOne(table, data);
				if (res.data.success) return null;
				return res.data.message;
			} catch (error) {
				authExpired(error);
				return error.response.data.message || "發生錯誤";
			}
		},
		deleteOne: async (table, data, index) => {
			try {
				const res = await fetchService.deleteOne(table, data);
				if (res.data.success) return null;
				return res.data.message;
			} catch (error) {
				authExpired(error);
				return error.response.data.message || "發生錯誤";
			}
		},
		uploadFile: async (data) => {
			try {
				const res = await fetchService.uploadFile(data);
				return res.data;
			} catch (error) {
				authExpired(error);
				return error.response.data;
			}
		},
	});

	const setFilter = (label, value) => {
		setFilterState((pre) => {
			if (value === null) {
				return [...pre.filter((f) => f[0] !== label)];
			}
			return [...pre.filter((f) => f[0] !== label), [label, value]];
		});
	};

	useEffect(() => {
		if (loginState.isLogin) {
			setSocket(io.connect(process.env.REACT_APP_SOCKET_HOST));
			APIState.fetchAllTable();
		} else {
			socket?.disconnect();
			setSocket(null);
		}
	}, [loginState]);

	useEffect(() => {
		if (socket) {
			socket.emit("connected", { system: "employee" });
			socket.on("update-table", (table) => {
				if (Object.values(tables).includes(table)) APIState.fetch(table);
			});
		}
	}, [socket]);

	return (
		<StateContext.Provider
			value={{
				loginState,
				setLoginState,
				systemLoading,
				dataState,
				setDataState,
				filterState,
				setFilterState,
				setFilter,
				APIState,
			}}>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
