// 🔧 Объект EmployeeAPI — имитация API для работы с сотрудниками
const EmployeeAPI = {
  // 📋 Начальный список сотрудников
  employees: [
    { number: 1, name: "Ben Blocker", job: "Teacher" },
    { number: 2, name: "Dave Defender", job: "Student" },
    { number: 3, name: "Sam Sweeper", job: "Teacher" },
    { number: 4, name: "Matt Midfielder", job: "Student" },
    { number: 5, name: "William Winger", job: "Student" },
    { number: 6, name: "Fillipe Forward", job: "Rector" },
  ],

  // 🔹 Получить всех сотрудников
  all: function () {
    return this.employees;
  },

  // 🔍 Найти сотрудника по ID
  get: function (id) {
    return this.employees.find((p) => p.number === id);
  },

  // 🗑️ Удалить сотрудника по ID
  delete: function (id) {
    this.employees = this.employees.filter((p) => p.number !== id);
  },

  // ➕ Добавить нового сотрудника
  add: function (employee) {
    this.employees.push(employee); // push добавляет в конец массива
    return employee;
  },

  // 🔄 Обновить данные сотрудника
  update: function (employee) {
    const index = this.employees.findIndex((p) => p.number === employee.number);
    if (index !== -1) {
      this.employees[index] = employee; // заменяем по индексу
    }
    return employee;
  },
};

export default EmployeeAPI;
