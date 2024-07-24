import { auth, database } from "@/database/config/firebase";
import { get, ref, remove, set, update } from "firebase/database";
import Error from "next/error";

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
    return null;
  } catch (error) {
    console.error('Error deleting order:', error);
    return error
  }
}


export async function createOrder(order) {
  try {
    const userId = await auth?.currentUser?.uid;
    if (userId) {
      const userDbRef = ref(database, `/users/${userId}/orders/${order.id}`);
      const rootDbRef = ref(database, `/orders/${order.id}`);

      await set(userDbRef, order);
      console.info(`User order updated`)
      await update(rootDbRef, order);
      return null
    }
  } catch (error) {
    return {
      error: error,
    }
  }
}



export async function updateStatusOrder(orderId, stateValue) {

  try {
    const referenceGetOrder = ref(database, `/orders`)
    const snapshot = await get(referenceGetOrder)
    let userId = null
    let orderFiltered = null
    if (snapshot.exists()) {
      const data = Object.values(snapshot.val())
      orderFiltered = data.find(ord => ord.id === orderId)
      userId = orderFiltered.userId
    }

    if (userId) {
      const userDbRef = ref(database, `/users/${userId}/orders/${orderId}`);
      const rootDbRef = ref(database, `/orders/${orderId}`);


      if (orderFiltered.cancelRequests) {
        const cancelRequestReferenceOrders = ref(database, `/orders/${orderId}/cancelRequests`)
        const cancelRequestReferenceUser = ref(database, `/orders/${orderId}/cancelRequests`);
        await remove(cancelRequestReferenceUser)
        await remove(cancelRequestReferenceOrders)
        await update(userDbRef, {
          status: stateValue
        });
        return null
      }
      await update(userDbRef, {
        status: stateValue
      });
      console.info(`User order updated`)
      await update(rootDbRef, {
        status: stateValue
      });
      return null
    }
  } catch (error) {
    return {
      error: error,
    }
  }


}

