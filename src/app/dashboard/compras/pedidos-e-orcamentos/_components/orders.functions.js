import { database } from "@/database/config/firebase";
import { get, ref } from "firebase/database";

export async function readAllUsers() {
  try {
    const databaseReference = ref(database, `/users`)
    const snapshot = await get(databaseReference)
    const users = Object.values(snapshot.val())
    return users
  } catch (error) {

  }
}

export async function filterAllOrders() {
  const users = await readAllUsers()
  const allOrders = users.map(user => user.orders).flat();
  const sortedOrders = allOrders.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
 
  return sortedOrders;
}

export async function deleteOrder(orderId) {
  try {
    const users = await readAllUsers();
    const userWithOrder = users.find(user => user.orders.some(order => order.id === orderId));
    if (!userWithOrder) {
      throw new Error('Order not found');
    }
    const orderIndex = userWithOrder.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found in user orders');
    }
    userWithOrder.orders.splice(orderIndex, 1);
    const databaseReference = ref(database, `/users/${userWithOrder.id}/orders`);
    await set(databaseReference, userWithOrder.orders);
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
}


