<template>
  <div>
    <h1>My Todos</h1>
    <input v-model="newTodo" @keyup.enter="addTodo" placeholder="New todo"/>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <input type="checkbox" v-model="todo.completed" @change="updateTodo(todo)"/>
        <span :style="{ textDecoration: todo.completed ? 'line-through' : 'none' }">{{ todo.title }}</span>
        <button @click="deleteTodo(todo.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {ref, onMounted} from "vue";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default {
  setup() {
    const todos = ref<Todo[]>([]);
    const newTodo = ref("");

    const fetchTodos = async () => {
      const res = await fetch("/api/todos");
      todos.value = await res.json();
    };

    const addTodo = async () => {
      if (!newTodo.value) return;
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title: newTodo.value}),
      });

      const created = await res.json();
      todos.value.push(created);
      newTodo.value = "";
    };

    const updateTodo = async (todo: Todo) => {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(todo),
      });

      const updatedTodo = await res.json();

      // Update local todos array
      const index = todos.value.findIndex(t => t.id === updatedTodo.id);
      if (index !== -1) todos.value[index] = updatedTodo;
    };

    const deleteTodo = async (id: number) => {
      await fetch(`/api/todos/${id}`, {method: "DELETE"});
      todos.value = todos.value.filter(t => t.id !== id);
    };

    onMounted(fetchTodos);

    return {todos, newTodo, addTodo, updateTodo, deleteTodo};
  },
};
</script>
