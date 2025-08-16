import ChatWidget from "@/components/chat/ChatWidget"
import { Provider } from "react-redux"
import { store } from "@/store/store"

// Giả sử Redux store có thể ghi đè state khi test
store.dispatch({
  type: "session/setSession",
  payload: { loggedIn: true, value: { name: "Mạnh" } },
})

export default {
  title: "Components/ChatWidget",
  component: ChatWidget,
}

export const Default = () => (
  <Provider store={store}>
    <ChatWidget />
  </Provider>
)
