import React from "react";

// 🔹 Компонент принимает список сотрудников и функцию удаления
const Table = ({ employees, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Job</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {/* 🔄 Проходим по каждому сотруднику и отображаем строку */}
        {employees.map((employee) => (
          <tr key={employee.number}>
            <td>{employee.name}</td>
            <td>{employee.job}</td>
            <td>
              {/* 🗑️ Кнопка удаления вызывает onDelete с ID сотрудника */}
              <button onClick={() => onDelete(employee.number)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
