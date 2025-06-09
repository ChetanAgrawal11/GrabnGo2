import React, { useState, useEffect, useRef } from "react";
import g8 from "../Images/g8.png";
import { useNavigate } from "react-router-dom"; // import this

export default function First() {
  const [showProfile, setShowProfile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentParent, setCurrentParent] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const toggleProfile = () => setShowProfile((prev) => !prev);
  const chatHistoryRef = useRef(null);
  const navigate = useNavigate(); // useNavigate hook
  const handleLogout = () => {
    // You can also clear any auth here if needed
    navigate("/"); // navigate to homepage
  };

  const faqData = {
    greeting:
      "Hi there! 👋 How can I help you today? Please choose a topic below:",
    commonQuestions: [
      {
        id: "menu",
        label: "Menu",
        subQuestions: [
          {
            id: "todayMenu",
            label: "What is today's menu?",
            answer:
              "Today's menu includes a variety of vegetarian and non-vegetarian options with fresh salads and desserts.",
          },
          {
            id: "menuAvailability",
            label: "When is the menu updated?",
            answer: "The menu is updated daily by 8 AM.",
          },
        ],
      },
      {
        id: "order",
        label: "Order",
        subQuestions: [
          {
            id: "howToOrder",
            label: "How to place an order?",
            answer:
              "To place an order, search for your meal and click 'Add to Cart'. Then proceed to checkout.",
          },
          {
            id: "orderTime",
            label: "What is the order cutoff time?",
            answer: "Orders can be placed until 9 PM for next day delivery.",
          },
        ],
      },
      {
        id: "tiffin",
        label: "Tiffin Service",
        subQuestions: [
          {
            id: "tiffinDays",
            label: "Which days is tiffin available?",
            answer: "Tiffin services are available Monday to Saturday.",
          },
          {
            id: "tiffinSubscribe",
            label: "How to subscribe to tiffin?",
            answer:
              "You can subscribe from the Tiffin tab in the app by selecting your preferred plan.",
          },
        ],
      },
      {
        id: "payment",
        label: "Payment",
        subQuestions: [
          {
            id: "paymentMethods",
            label: "What payment methods are accepted?",
            answer: "We accept UPI, Debit/Credit Cards, and Cash on Delivery.",
          },
          {
            id: "paymentIssues",
            label: "What to do if payment fails?",
            answer:
              "Please retry or contact support at grabngo@support.com if the issue persists.",
          },
        ],
      },
      {
        id: "contact",
        label: "Contact",
        subQuestions: [
          {
            id: "contactDetails",
            label: "How can I contact support?",
            answer: "Reach us at +91-9999999999 or email grabngo@support.com.",
          },
        ],
      },
    ],
  };

  // Show top-level common questions buttons
  const showCommonQuestions = () => {
    addBotButtonsMessage(
      faqData.commonQuestions.map((q) => ({
        id: q.id,
        label: q.label,
      })),
      faqData.greeting
    );
    setCurrentParent(null);
  };

  // Add bot message with buttons (with fade-in animation class)
  const addBotButtonsMessage = (buttons, text) => {
    setMessages((prev) => [
      ...prev,
      {
        type: "buttons",
        from: "bot",
        text,
        buttons,
        id: Math.random().toString(36).substr(2, 9),
      },
    ]);
  };

  // Add a bot text message
  const addBotTextMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        type: "text",
        from: "bot",
        text,
        id: Math.random().toString(36).substr(2, 9),
      },
    ]);
  };

  // Handle bot button click
  const handleBotButtonClick = (buttonId, parentId = null) => {
    // User clicked — add user message first
    const clickedLabel = (() => {
      if (!parentId) {
        const cq = faqData.commonQuestions.find((q) => q.id === buttonId);
        return cq ? cq.label : buttonId;
      } else {
        const cq = faqData.commonQuestions.find((q) => q.id === parentId);
        if (!cq) return buttonId;
        const sq = cq.subQuestions.find((sq) => sq.id === buttonId);
        return sq ? sq.label : buttonId;
      }
    })();

    setMessages((prev) => [
      ...prev,
      { type: "text", from: "user", text: clickedLabel },
    ]);

    if (!parentId) {
      // Top level button clicked
      const common = faqData.commonQuestions.find((q) => q.id === buttonId);
      if (common) {
        setIsTyping(true);
        setTimeout(() => {
          addBotButtonsMessage(
            common.subQuestions.map((sq) => ({
              id: sq.id,
              label: sq.label,
            })),
            `You selected "${common.label}". Please choose a sub-question:`
          );
          setCurrentParent(common.id);
          setIsTyping(false);
        }, 700);
      } else {
        addBotTextMessage("No information regarding these.");
      }
    } else {
      // Subquestion clicked - show answer + then top-level buttons again
      const common = faqData.commonQuestions.find((q) => q.id === parentId);
      if (common) {
        const subQ = common.subQuestions.find((sq) => sq.id === buttonId);
        if (subQ) {
          setIsTyping(true);
          setTimeout(() => {
            addBotTextMessage(subQ.answer);
            setCurrentParent(null);
            setIsTyping(false);
            // Show top level buttons again after short delay
            setTimeout(() => {
              showCommonQuestions();
            }, 1200);
          }, 700);
        } else {
          addBotTextMessage("No information regarding these.");
        }
      }
    }
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
    if (!isChatOpen) {
      setMessages([]);
      setCurrentParent(null);
      // Show greeting and top-level buttons when opening chat
      setTimeout(() => {
        showCommonQuestions();
      }, 200);
    }
  };

  // Handle send message
  const handleSend = (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    setMessages((prev) => [
      ...prev,
      { type: "text", from: "user", text: userMessage },
    ]);

    const userMessageLower = userMessage.toLowerCase();

    // Greetings to trigger top-level buttons
    const greetings = [
      "hello",
      "hi",
      "hii",
      "hey",
      "hello all",
      "hiii",
      "hiiii",
      "hey there",
      "hiya",
    ];

    if (greetings.some((g) => userMessageLower === g)) {
      setIsTyping(true);
      setTimeout(() => {
        showCommonQuestions();
        setIsTyping(false);
      }, 800);
    } else {
      // Try find matching question or subquestion
      let found = false;
      for (const commonQ of faqData.commonQuestions) {
        if (userMessageLower.includes(commonQ.label.toLowerCase())) {
          setIsTyping(true);
          setTimeout(() => {
            addBotButtonsMessage(
              commonQ.subQuestions.map((sq) => ({
                id: sq.id,
                label: sq.label,
              })),
              `You selected "${commonQ.label}". Please choose a sub-question:`
            );
            setCurrentParent(commonQ.id);
            setIsTyping(false);
          }, 800);
          found = true;
          break;
        }
        for (const subQ of commonQ.subQuestions) {
          if (userMessageLower.includes(subQ.label.toLowerCase())) {
            setIsTyping(true);
            setTimeout(() => {
              addBotTextMessage(subQ.answer);
              setCurrentParent(null);
              setIsTyping(false);
              // Show top-level again after answer
              setTimeout(() => {
                showCommonQuestions();
              }, 1200);
            }, 800);
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (!found) {
        setIsTyping(true);
        setTimeout(() => {
          addBotTextMessage("No information regarding these.");
          setIsTyping(false);
        }, 800);
      }
    }
    setInput("");
  };

  // Auto scroll on new messages
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="relative h-[400px] flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: `url(${g8})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>
      {/* Profile Button */}
      <button
        onClick={toggleProfile}
        className="fixed top-5 left-5 z-20 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-3 font-semibold tracking-wide transition hover:scale-110"
      >
        <img
          src={require("../Images/avatar.webp")}
          alt="Avatar"
          className="w-7 h-7"
        />
        {user.fullName}
      </button>

      {/* Profile Popup Card */}
      {showProfile && (
        <div className="fixed top-20 left-5 z-30 bg-white text-black w-72 p-5 rounded-2xl shadow-2xl border border-gray-300 animate-fade-in-down">
          <h2 className="text-lg font-bold mb-3 text-center">User Profile</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Name:</strong> {user.fullName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {user.number || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {user.address || "N/A"}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              {user.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "N/A"}
            </p>
          </div>
          <button
            onClick={toggleProfile}
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-lg text-sm hover:scale-110 transition-transform duration-300 ease-in-out"
          >
            Close
          </button>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed top-5 right-5 z-20 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg animate-bounce flex items-center gap-3 font-semibold tracking-wide transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.96 9.96 0 01-4-.8L3 20l1.8-4a9.96 9.96 0 01-.8-4c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        Chat with Meena
      </button>
      {/* Logout Button below Chat Button */}
      <button
        onClick={handleLogout}
        className="fixed top-[70px] right-5 z-20 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center justify-center font-semibold tracking-wide transition hover:scale-125"
      >
        LogOut
      </button>

      {/* Chat Popup */}
      {isChatOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center"
          style={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 flex flex-col"
            style={{
              width: "50vw",
              height: "60vh",
              minWidth: "350px",
              minHeight: "400px",
            }}
          >
            {/* Close Button */}
            <button
              onClick={toggleChat}
              className="self-end text-gray-400 hover:text-red-500 text-3xl font-bold transition-colors"
              aria-label="Close chat"
            >
              ×
            </button>

            {/* Chat Header */}
            <h2 className="text-4xl font-bold mb-4 text-center text-blue-500 tracking-wide">
              Chat with Meena
            </h2>

            {/* Chat History */}
            <div
              ref={chatHistoryRef}
              className="flex-1 overflow-y-auto border border-gray-200 rounded-md p-4 mb-4 bg-gray-50"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollBehavior: "smooth",
              }}
            >
              <style>{`
                div::-webkit-scrollbar {
                  display: none;
                }
                .fade-in {
                  animation: fadeIn 0.5s ease forwards;
                }
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                button:hover {
                  transform: scale(1.05);
                }
                button {
                  transition: transform 0.2s ease, background-color 0.3s ease;
                }
              `}</style>

              {messages.length === 0 && !isTyping ? (
                <p className="text-gray-500 italic text-center">
                  👋 Hi! Try typing "hello" to get started with some common
                  questions.
                </p>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`mb-5 fade-in ${
                        msg.from === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.from === "user" ? (
                        <div className="text-sm font-semibold text-blue-600 mb-1">
                          You: {msg.text}
                        </div>
                      ) : msg.type === "text" ? (
                        <div className="text-sm text-gray-700 bg-white rounded-lg p-2 shadow-sm max-w-[85%] whitespace-pre-line">
                          Meena: {msg.text}
                        </div>
                      ) : (
                        <>
                          <div className="text-sm text-gray-700 mb-2">
                            Meena: {msg.text}
                          </div>
                          <div className="flex flex-wrap gap-2 max-w-[85%]">
                            {msg.buttons.map((btn) => (
                              <button
                                key={btn.id}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-1 text-sm transition"
                                onClick={() => {
                                  if (currentParent) {
                                    handleBotButtonClick(btn.id, currentParent);
                                  } else {
                                    handleBotButtonClick(btn.id);
                                    setCurrentParent(btn.id);
                                  }
                                }}
                              >
                                {btn.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="text-sm text-gray-700 bg-white rounded-lg p-2 shadow-sm max-w-[85%] italic animate-pulse">
                      Meena is typing...
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-5 py-2 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold text-red-500">Grab N’ Go</h1>
        <p className="text-lg">Order the meal you want</p>
      </div>
    </div>
  );
}
