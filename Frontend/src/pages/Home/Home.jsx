import React from "react";
import "./Home.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/chatbot");  
    };
    return (
        <div className="home">
            <section
                className="hero"
                style={{ backgroundImage: `url(${assets.hero_bg})` }}
            >
                <div className="hero-overlay">
                    <h1>Empowering Your Financial Journey</h1>
                    <p>
                        At FinPilot, we make finance simple and accessible for everyone. Our smart tools help people in rural areas understand their money, track expenses, and make better financial choices.FinPilot is here to guide you every step of the way.
                    </p>
                    <button className="hero-btn" onClick={handleGetStarted}>Get Started</button>
                </div>
            </section>
        </div>
    );
};

export default Home;
