import Axios from "axios";
import { tables } from "../data/data.config";
class FetchService {
	tables = {};
	token = "";

	constructor(url, uploadUrl, tables) {
		this.tables = tables;
		this.url = url;
		this.uploadUrl = uploadUrl;
	} //end constructor

	fetchAllTables() {
		let data = {};
		Object.values(this.tables).forEach(async (table) => {
			const res = await this.fetchAllbyTable(table);
			if (res.data.success) data[table] = res.data.data;
		});
		return data;
	}
	fetchAll(path, data) {
		return Axios.get(this.url + path, {
			headers: { Authorization: this.token },
			params: JSON.stringify(data),
		});
	}
	findAll(table) {
		return Axios.get(this.url + "/" + table, { headers: { Authorization: this.token } });
	}
	insertOne(table, data) {
		return Axios.post(this.url + "/" + table, data, { headers: { Authorization: this.token } });
	}
	updateOne(table, data) {
		return Axios.put(this.url + "/" + table, data, { headers: { Authorization: this.token } });
	}
	updatePartialOne(table, data) {
		return Axios.patch(this.url + "/" + table, data, { headers: { Authorization: this.token } });
	}
	deleteOne(table, data) {
		return Axios.delete(this.url + "/" + table, { headers: { Authorization: this.token }, data });
	}
	findOneByKey(table, key, value) {
		return Axios.get(this.url + "/" + table + "/" + key + "/" + value, { headers: { Authorization: this.token } });
	}
	uploadFile(file) {
		let formData = new FormData();
		formData.append("foo", file);
		return Axios.post(this.uploadUrl + "/uploadFile", formData, {
			headers: { "Content-Type": "multipart/form-data", Authorization: this.token },
		});
	}
} //end of FetchService
const fetchService = new FetchService(process.env.REACT_APP_API_URL, process.env.REACT_APP_UPLOAD_URL, tables);
export default fetchService;
