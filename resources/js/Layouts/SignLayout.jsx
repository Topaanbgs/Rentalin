import React from "react";

export default function SignLayout({ children }) {
    return (
        <div className="min-h-screen relative">
            <video
                src="https://res.cloudinary.com/dr2cuy2gx/video/upload/v1761827158/Grand_Theft_Auto_VI_Trailer_1_-_Rockstar_Games_1440p_av1_n6sfg4.webm"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            <div className="relative z-10 min-h-screen">{children}</div>
        </div>
    );
}
