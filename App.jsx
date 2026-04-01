import { useState, useEffect, useRef, useCallback } from "react";

const WAKE_WORD = "aura";
const AI_NAME = "A.U.R.A";

const SITE_MAP = {
  youtube: "https://youtube.com",
  google: "https://google.com",
  instagram: "https://instagram.com",
  twitter: "https://twitter.com",
  facebook: "https://facebook.com",
  whatsapp: "https://web.whatsapp.com",
  netflix: "https://netflix.com",
  gmail: "https://gmail.com",
  amazon: "https://amazon.com",
  tiktok: "https://tiktok.com",
  spotify: "https://open.spotify.com",
  reddit: "https://reddit.com",
  linkedin: "https://linkedin.com",
};

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.pitch = 0.85;
  utt.rate = 0.95;
  utt.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.name.toLowerCase().includes("google uk") ||
    v.name.toLowerCase().includes("daniel") ||
    v.name.toLowerCase().includes("alex") ||
    (v.lang === "en-GB")
  );
  if (preferred) utt.voice = preferred;
  window.speechSynthesis.speak(utt);
}

export default function Jarvis() {
  const [phase, setPhase] = useState("idle"); // idle | awake | listening | thinking | responding
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [log, setLog] = useState([]);
  const [cameraOn, setCameraOn] = useState(false);
  const [lockedSites, setLockedSites] = useState([]);
  const [showVault, setShowVault] = useState(false);
  const [newLock, setNewLock] = useState("");
  const [time, setTime] = useState(new Date());
  const [scanLine, setScanLine] = useState(0);
  const [pulseRing, setPulseRing] = useState(false);
  const [waveAmps, setWaveAmps] = useState(Array(32).fill(4));

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const continuousRef = useRef(null);
  const phaseRef = useRef(phase);
  const lockedRef = useRef(lockedSites);
  const logRef = useRef(log);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { lockedRef.current = lockedSites; }, [lockedSites]);
  useEffect(() => { logRef.current = log; }, [log]);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Scan line animation
  useEffect(() => {
    const t = setInterval(() => setScanLine(p => (p + 1) % 100), 30);
    return () => clearInterval(t);
  }, []);

  // Wave animation when listening
  useEffect(() => {
    if (phase === "listening" || phase === "awake") {
      const t = setInterval(() => {
        setWaveAmps(Array(32).fill(0).map(() =>
          phase === "listening" ? 8 + Math.random() * 28 : 2 + Math.random() * 8
        ));
      }, 80);
      return () => clearInterval(t);
    } else {
      setWaveAmps(Array(32).fill(4));
    }
  }, [phase]);

  // Camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch {
      setCameraOn(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, [startCamera]);

  const addLog = useCallback((role, text) => {
    setLog(prev => [...prev.slice(-20), { role, text, time: new Date().toLocaleTimeString() }]);
  }, []);

  // Parse and execute command
  const executeCommand = useCallback(async (cmd) => {
    const lower = cmd.toLowerCase();

    // LOCK
    if (lower.startsWith("lock ")) {
      const target = lower.replace("lock ", "").trim();
      const url = SITE_MAP[target] || (target.includes(".") ? `https://${target}` : null);
      if (url) {
        setLockedSites(prev => [...new Set([...prev, target])]);
        const msg = `${target} has been locked, sir. Access is now restricted.`;
        setResponse(msg);
        speak(msg);
        addLog("jarvis", msg);
      } else {
        const msg = `I couldn't identify that application, sir.`;
        setResponse(msg);
        speak(msg);
      }
      return;
    }

    // UNLOCK
    if (lower.startsWith("unlock ")) {
      const target = lower.replace("unlock ", "").trim();
      setLockedSites(prev => prev.filter(s => !s.includes(target)));
      const msg = `${target} has been unlocked, sir. Access restored.`;
      setResponse(msg);
      speak(msg);
      addLog("jarvis", msg);
      return;
    }

    // OPEN
    if (lower.startsWith("open ")) {
      const target = lower.replace("open ", "").trim();
      if (lockedRef.current.some(s => target.includes(s) || s.includes(target))) {
        const msg = `Access to ${target} is restricted, sir. You locked it. Unlock it first.`;
        setResponse(msg);
        speak(msg);
        return;
      }
      const url = SITE_MAP[target] || (target.includes(".") ? `https://${target}` : `https://www.google.com/search?q=${encodeURIComponent(target)}`);
      window.open(url, "_blank");
      const msg = `Opening ${target} now, sir.`;
      setResponse(msg);
      speak(msg);
      addLog("jarvis", msg);
      return;
    }

    // AI Q&A
    setPhase("thinking");
    setResponse("Processing...");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "YOUR_API_KEY_HERE", "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are A.U.R.A. (Advanced Unified Response Assistant), a personal AI assistant. 
You are helpful, precise, and slightly formal. Refer to the user as "sir" or "ma'am". 
Keep answers concise but complete. You can help with questions, analysis, recommendations, and general knowledge.
Never break character. Always sound confident and intelligent.`,
          messages: [{ role: "user", content: cmd }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I encountered an anomaly, sir. Please try again.";
      setResponse(reply);
      speak(reply);
      addLog("user", cmd);
      addLog("jarvis", reply);
    } catch {
      const err = "My systems are experiencing interference, sir. Please stand by.";
      setResponse(err);
      speak(err);
    }
    setPhase("responding");
    setTimeout(() => setPhase("idle"), 8000);
  }, [addLog]);

  // Wake word detection (continuous)
  const startContinuousListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (e) => {
      const result = Array.from(e.results)
        .map(r => r[0].transcript.toLowerCase())
        .join(" ");

      if (result.includes(WAKE_WORD) && phaseRef.current === "idle") {
        setPhase("awake");
        setPulseRing(true);
        speak("Yes, sir. I'm listening.");
        setTimeout(() => setPulseRing(false), 1500);
        setTimeout(() => {
          if (phaseRef.current === "awake") startCommandListening();
        }, 1800);
      }
    };

    rec.onend = () => {
      if (phaseRef.current === "idle" || phaseRef.current === "awake") {
        try { rec.start(); } catch {}
      }
    };

    try { rec.start(); } catch {}
    continuousRef.current = rec;
  }, []);

  const startCommandListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;

    setPhase("listening");
    setTranscript("");

    rec.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setTranscript(t);
      if (e.results[0].isFinal) {
        setPhase("thinking");
        executeCommand(t);
      }
    };

    rec.onerror = () => {
      setPhase("idle");
      setTranscript("");
    };

    rec.onend = () => {
      if (phaseRef.current === "listening") setPhase("idle");
    };

    try { rec.start(); } catch {}
    recognitionRef.current = rec;
  }, [executeCommand]);

  useEffect(() => {
    startContinuousListening();
    return () => {
      continuousRef.current?.stop();
      recognitionRef.current?.stop();
    };
  }, [startContinuousListening]);

  const handleManualActivate = () => {
    if (phase !== "idle") return;
    setPhase("awake");
    speak("Yes, sir. I'm listening.");
    setTimeout(() => startCommandListening(), 1200);
  };

  const fmtTime = t => t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const fmtDate = t => t.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const statusColor = {
    idle: "#1a6b8a",
    awake: "#00e5ff",
    listening: "#00ff88",
    thinking: "#ffaa00",
    responding: "#00e5ff",
  }[phase];

  const statusLabel = {
    idle: `SAY "${AI_NAME.split(".")[0]}" TO ACTIVATE`,
    awake: "ACTIVATED — SPEAK NOW",
    listening: "LISTENING...",
    thinking: "PROCESSING...",
    responding: "RESPONSE READY",
  }[phase];

  return (
    <div style={{
      width: "100%", minHeight: "100vh", background: "#010a0f",
      fontFamily: "'Courier New', monospace", color: "#00d4ff",
      position: "relative", overflow: "hidden", userSelect: "none",
    }}>
      {/* CAMERA FEED */}
      <video ref={videoRef} autoPlay muted playsInline style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", opacity: 0.12, filter: "saturate(0) brightness(0.8)",
      }} />

      {/* GRID OVERLAY */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* SCAN LINE */}
      <div style={{
        position: "absolute", left: 0, right: 0,
        top: `${scanLine}%`, height: "2px",
        background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.15), rgba(0,212,255,0.4), rgba(0,212,255,0.15), transparent)",
        pointerEvents: "none",
      }} />

      {/* CORNER BRACKETS */}
      {[
        { top: 12, left: 12, borderTop: "2px solid", borderLeft: "2px solid" },
        { top: 12, right: 12, borderTop: "2px solid", borderRight: "2px solid" },
        { bottom: 12, left: 12, borderBottom: "2px solid", borderLeft: "2px solid" },
        { bottom: 12, right: 12, borderBottom: "2px solid", borderRight: "2px solid" },
      ].map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: 30, height: 30,
          borderColor: "rgba(0,212,255,0.5)", ...s,
        }} />
      ))}

      {/* TOP BAR */}
      <div style={{
        position: "relative", display: "flex", justifyContent: "space-between",
        alignItems: "center", padding: "16px 24px",
        borderBottom: "1px solid rgba(0,212,255,0.15)",
        background: "rgba(0,10,20,0.7)",
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "rgba(0,212,255,0.5)", marginBottom: 2 }}>
            ADVANCED UNIFIED RESPONSE ASSISTANT
          </div>
          <div style={{ fontSize: 22, letterSpacing: 6, fontWeight: 700, color: "#00d4ff", textShadow: "0 0 20px #00d4ff" }}>
            {AI_NAME}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 2, color: "#00e5ff" }}>
            {fmtTime(time)}
          </div>
          <div style={{ fontSize: 11, color: "rgba(0,212,255,0.5)", letterSpacing: 2 }}>
            {fmtDate(time).toUpperCase()}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "20px 20px 120px", position: "relative" }}>

        {/* ARC REACTOR + STATUS */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          {/* Arc Reactor */}
          <div onClick={handleManualActivate} style={{
            width: 120, height: 120, borderRadius: "50%", cursor: "pointer",
            position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16,
          }}>
            {/* Outer rings */}
            {[120, 100, 82].map((size, i) => (
              <div key={i} style={{
                position: "absolute",
                width: size, height: size, borderRadius: "50%",
                border: `1px solid ${i === 0 ? "rgba(0,212,255,0.2)" : i === 1 ? "rgba(0,212,255,0.35)" : "rgba(0,212,255,0.6)"}`,
                animation: phase !== "idle" ? `spin ${3 + i * 2}s linear infinite` : "none",
              }} />
            ))}
            {/* Pulse ring */}
            {pulseRing && (
              <div style={{
                position: "absolute", width: 140, height: 140, borderRadius: "50%",
                border: "2px solid rgba(0,229,255,0.8)",
                animation: "pulseOut 1.5s ease-out forwards",
              }} />
            )}
            {/* Core */}
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: phase === "idle"
                ? "radial-gradient(circle, rgba(0,100,150,0.8), rgba(0,30,50,0.9))"
                : "radial-gradient(circle, rgba(0,229,255,0.95), rgba(0,180,220,0.8))",
              boxShadow: phase === "idle"
                ? "0 0 20px rgba(0,100,150,0.4), inset 0 0 20px rgba(0,50,80,0.5)"
                : "0 0 40px rgba(0,229,255,0.8), 0 0 80px rgba(0,229,255,0.4), inset 0 0 20px rgba(255,255,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.5s ease",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: phase === "idle" ? "rgba(0,80,120,0.8)" : "rgba(255,255,255,0.9)",
                boxShadow: phase !== "idle" ? "0 0 15px white" : "none",
              }} />
            </div>
          </div>

          {/* Status indicator */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: statusColor,
              boxShadow: `0 0 12px ${statusColor}`,
              animation: phase === "listening" ? "blink 0.6s ease-in-out infinite" : "none",
            }} />
            <span style={{
              fontSize: 11, letterSpacing: 3, color: statusColor,
              textShadow: `0 0 10px ${statusColor}`,
            }}>{statusLabel}</span>
          </div>

          {/* Tap hint */}
          <div style={{ fontSize: 10, color: "rgba(0,212,255,0.35)", letterSpacing: 2 }}>
            TAP REACTOR TO ACTIVATE MANUALLY
          </div>
        </div>

        {/* WAVEFORM */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 2, height: 50, marginBottom: 20,
        }}>
          {waveAmps.map((amp, i) => (
            <div key={i} style={{
              width: 3, borderRadius: 2,
              height: amp,
              background: phase === "listening"
                ? `rgba(0,255,136,${0.4 + Math.random() * 0.6})`
                : `rgba(0,212,255,${0.2 + amp / 40})`,
              boxShadow: phase === "listening" ? `0 0 4px rgba(0,255,136,0.5)` : "none",
              transition: "height 0.1s ease",
            }} />
          ))}
        </div>

        {/* TRANSCRIPT */}
        {transcript && (
          <div style={{
            background: "rgba(0,20,35,0.8)", border: "1px solid rgba(0,212,255,0.2)",
            borderRadius: 8, padding: "12px 16px", marginBottom: 16,
          }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "rgba(0,212,255,0.5)", marginBottom: 6 }}>
              YOUR COMMAND
            </div>
            <div style={{ fontSize: 14, color: "#00ff88", lineHeight: 1.5 }}>"{transcript}"</div>
          </div>
        )}

        {/* RESPONSE */}
        {response && (
          <div style={{
            background: "rgba(0,15,30,0.9)",
            border: `1px solid ${phase === "thinking" ? "rgba(255,170,0,0.3)" : "rgba(0,212,255,0.25)"}`,
            borderRadius: 8, padding: "14px 16px", marginBottom: 20,
            boxShadow: phase === "thinking" ? "0 0 20px rgba(255,170,0,0.1)" : "0 0 20px rgba(0,212,255,0.05)",
          }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "rgba(0,212,255,0.5)", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <span>{AI_NAME} RESPONSE</span>
              {phase === "thinking" && <span style={{ color: "#ffaa00", animation: "blink 1s infinite" }}>● PROCESSING</span>}
            </div>
            <div style={{ fontSize: 13, color: "#c8f0ff", lineHeight: 1.7 }}>{response}</div>
          </div>
        )}

        {/* QUICK COMMANDS */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "rgba(0,212,255,0.4)", marginBottom: 10 }}>
            QUICK COMMANDS
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["open youtube", "open google", "open instagram", "open netflix", "What time is it?", "Tell me a joke"].map(cmd => (
              <button key={cmd} onClick={() => { setTranscript(cmd); executeCommand(cmd); }} style={{
                background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)",
                color: "#00d4ff", padding: "6px 12px", borderRadius: 4, fontSize: 11,
                letterSpacing: 1, cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={e => e.target.style.background = "rgba(0,212,255,0.15)"}
                onMouseLeave={e => e.target.style.background = "rgba(0,212,255,0.06)"}
              >
                {cmd.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* VAULT / LOCKED SITES */}
        <div style={{
          background: "rgba(0,10,20,0.8)", border: "1px solid rgba(0,212,255,0.12)",
          borderRadius: 8, overflow: "hidden",
        }}>
          <div onClick={() => setShowVault(!showVault)} style={{
            padding: "12px 16px", cursor: "pointer",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderBottom: showVault ? "1px solid rgba(0,212,255,0.1)" : "none",
          }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "rgba(0,212,255,0.6)" }}>
              🔒 RESTRICTED ACCESS VAULT ({lockedSites.length})
            </div>
            <span style={{ fontSize: 14, color: "rgba(0,212,255,0.4)" }}>{showVault ? "▲" : "▼"}</span>
          </div>
          {showVault && (
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input
                  value={newLock}
                  onChange={e => setNewLock(e.target.value)}
                  placeholder="App or site to lock (e.g. youtube)"
                  style={{
                    flex: 1, background: "rgba(0,20,40,0.8)", border: "1px solid rgba(0,212,255,0.2)",
                    color: "#00d4ff", padding: "8px 12px", borderRadius: 4, fontSize: 12,
                    outline: "none", fontFamily: "monospace",
                  }}
                />
                <button onClick={() => {
                  if (newLock.trim()) {
                    setLockedSites(prev => [...new Set([...prev, newLock.trim().toLowerCase()])]);
                    setNewLock("");
                  }
                }} style={{
                  background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)",
                  color: "#00d4ff", padding: "8px 14px", borderRadius: 4, fontSize: 12,
                  cursor: "pointer", letterSpacing: 1,
                }}>LOCK</button>
              </div>
              {lockedSites.length === 0 ? (
                <div style={{ fontSize: 12, color: "rgba(0,212,255,0.3)", textAlign: "center", padding: "8px 0" }}>
                  NO RESTRICTIONS ACTIVE
                </div>
              ) : (
                lockedSites.map((site, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0", borderBottom: "1px solid rgba(0,212,255,0.07)",
                  }}>
                    <span style={{ fontSize: 13, color: "#ff6b6b" }}>🔒 {site.toUpperCase()}</span>
                    <button onClick={() => setLockedSites(prev => prev.filter((_, j) => j !== i))}
                      style={{
                        background: "transparent", border: "1px solid rgba(255,100,100,0.3)",
                        color: "#ff6b6b", padding: "3px 10px", borderRadius: 4, fontSize: 11,
                        cursor: "pointer",
                      }}>UNLOCK</button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* CONVERSATION LOG */}
        {log.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "rgba(0,212,255,0.4)", marginBottom: 10 }}>
              INTERACTION LOG
            </div>
            <div style={{
              maxHeight: 200, overflowY: "auto",
              display: "flex", flexDirection: "column", gap: 8,
            }}>
              {log.slice().reverse().map((entry, i) => (
                <div key={i} style={{
                  background: entry.role === "user" ? "rgba(0,255,136,0.04)" : "rgba(0,212,255,0.04)",
                  border: `1px solid ${entry.role === "user" ? "rgba(0,255,136,0.15)" : "rgba(0,212,255,0.1)"}`,
                  borderRadius: 6, padding: "8px 12px",
                }}>
                  <div style={{ fontSize: 10, color: entry.role === "user" ? "rgba(0,255,136,0.6)" : "rgba(0,212,255,0.5)", marginBottom: 3, display: "flex", justifyContent: "space-between" }}>
                    <span>{entry.role === "user" ? "YOU" : AI_NAME}</span>
                    <span>{entry.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: entry.role === "user" ? "#a0ffc8" : "#a0d8f0", lineHeight: 1.5 }}>
                    {entry.text.length > 120 ? entry.text.slice(0, 120) + "..." : entry.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM STATUS BAR */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(0,8,16,0.95)", borderTop: "1px solid rgba(0,212,255,0.15)",
        padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ fontSize: 10, color: "rgba(0,212,255,0.4)", letterSpacing: 2 }}>
          CAM: {cameraOn ? <span style={{ color: "#00ff88" }}>ONLINE</span> : <span style={{ color: "#ff6b6b" }}>OFFLINE</span>}
        </div>
        <div style={{ fontSize: 10, color: "rgba(0,212,255,0.4)", letterSpacing: 2 }}>
          VOICE: <span style={{ color: ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) ? "#00ff88" : "#ff6b6b" }}>
            {("webkitSpeechRecognition" in window || "SpeechRecognition" in window) ? "ACTIVE" : "UNAVAILABLE"}
          </span>
        </div>
        <div style={{ fontSize: 10, color: "rgba(0,212,255,0.4)", letterSpacing: 2 }}>
          LOCKED: <span style={{ color: lockedSites.length > 0 ? "#ff6b6b" : "#00ff88" }}>{lockedSites.length} SITES</span>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        @keyframes pulseOut {
          from { transform: scale(1); opacity: 0.8; }
          to { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
