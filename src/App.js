import './App.css';
import EmployeeAPI from "./api/service";
import Table from "./Table";
import React, { useState } from "react"; // импортируем хук useState для управления состоянием

function App() {
  // 🔹 Инициализируем состояние сотрудников из API
  const [employees, setEmployees] = useState(EmployeeAPI.all());

  // 🔻 Функция удаления сотрудника по ID
  const handleDelete = (id) => {
    EmployeeAPI.delete(id); // удаляем из API
    setEmployees([...EmployeeAPI.all()]); // обновляем состояние
  };

  // 🔺 Функция добавления нового сотрудника
  const handleAdd = () => {
    const newEmployee = {
      number: Date.now(), // уникальный ID на основе времени
      name: "New Employee", // имя по умолчанию
      job: "Intern", // должность по умолчанию
    };
    EmployeeAPI.add(newEmployee); // добавляем в API
    setEmployees([...EmployeeAPI.all()]); // обновляем состояние
  };

  return (
    <div className="App">
      <h1>Casino Staff</h1>

      {/* 🔘 Кнопка добавления нового сотрудника */}
      <button onClick={handleAdd}>Add Employee</button>

      {/* 📋 Таблица сотрудников с передачей данных и функции удаления */}
      <Table employees={employees} onDelete={handleDelete} />
    </div>
  );
}

export default App;
