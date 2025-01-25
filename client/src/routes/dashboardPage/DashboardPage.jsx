import { QueryClient, useMutation } from "@tanstack/react-query";
import "./dashboardPage.css";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const queryClient = new QueryClient();
  const navigate = useNavigate(queryClient);
  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);
  };
  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
          <h1>Mental Chatbot</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="Chat" />
            <span>Create a New Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="Analyze Images" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="Help with Code" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Ask me anything..." />
          <button>
            <img src="/arrow.png" alt="Submit" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
