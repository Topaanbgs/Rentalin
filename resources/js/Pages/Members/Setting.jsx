import React, { useState } from "react";
import { Save } from "lucide-react";

export default function Setting() {
    const [name, setName] = useState("John Doe");
    const [email, setEmail] = useState("john@example.com");
    const [password, setPassword] = useState("");

    const handleSave = (e) => {
        e.preventDefault();
        alert("Account settings have been saved successfully.");
    };

    return (
        <div className="max-w-3xl mx-auto bg-gray-900/60 border border-[#00D8C8]/30 p-10 rounded-2xl shadow-lg backdrop-blur-md animate-fade-in">
            <h2 className="text-3xl font-bold text-[#00D8C8] mb-6 text-center">
                Account Settings
            </h2>

            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label className="block text-gray-300 mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00D8C8]"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00D8C8]"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 mb-2">
                        New Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00D8C8]"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#00D8C8]/20 border border-[#00D8C8]/50 text-[#00D8C8] font-semibold hover:bg-[#00D8C8]/30 transition-all"
                >
                    <Save size={18} /> Save Changes
                </button>
            </form>

            <style>
                {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}
            </style>
        </div>
    );
}
