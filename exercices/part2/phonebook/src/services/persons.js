import axios from "axios";

const url = "http://localhost:3001/persons";

const getNumbers = () => {
  const request = axios.get(url);
  return request.then((response) => response.data);
};

const addNumber = (newPerson) => {
  const request = axios.post(url, newPerson);
  return request.then((response) => response.data);
};

const deleteNumber = (id) => {
  const request = axios.delete(`${url}/${id}`);
  return request.then((response) => response);
};

const updateNumber = (id, newNum) => {
  const request = axios.put(`${url}/${id}`, newNum);
  return request.then((response) => response.data);
};

export default { getNumbers, addNumber, deleteNumber, updateNumber };
