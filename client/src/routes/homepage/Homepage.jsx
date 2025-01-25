import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
import "./homepage.css";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");
  // const test = async () => {
  //   try {
  //     const response = await fetch("http://localhost:3000/api/test", {
  //       method: "GET",
  //       credentials: "include",
  //     });

  //     if (response.ok) {
  //       const data = await response.text();
  //       console.log("Response from backend:", data);
  //     } else {
  //       console.error(
  //         "Error from backend:",
  //         response.status,
  //         response.statusText
  //       );
  //     }
  //   } catch (err) {
  //     console.error("Fetch error:", err);
  //   }
  // };
  return (
    <div className="homepage">
      <img src="/orbital.png" alt="" className="orbital" />
      <div className="left">
        <h1>Chatbot</h1>
        <h2>Welcome to our platform!</h2>
        <h3>
          Our mental health chatbot is your 24/7 emotional support companion,
          offering empathetic and private conversations. Powered by Cognitive
          Behavioral Therapy (CBT) and mindfulness techniques, it provides
          personalized advice for managing stress, anxiety, and more. Always
          available, it guides you toward better mental health and peace of
          mind.
        </h3>
        <Link to="/dashboard">Get Started</Link>
        {/* <button onClick={test}>TEST BACKEND AUTH</button> */}
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className="chatbot" />
          <div className="chat">
            <img
              src={
                typingStatus === "human1"
                  ? "/human1.jpeg"
                  : typingStatus === "human2"
                  ? "/human2.jpeg"
                  : "bot.png"
              }
              alt=""
            />
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                () => {
                  setTypingStatus("human1");
                },
                "Human: We produce food for Mice",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "Bot: We produce food for Hamsters",
                2000,
                () => {
                  setTypingStatus("human2");
                },
                "Human: We produce food for Guinea Pigs",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "Bot: We produce food for Chinchillas",
                2000,
                () => {
                  setTypingStatus("human1");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span> | </span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
