import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const SERVER = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

// ═══════════════════════════════════════════════════════════
// SHARED UTILITIES
// ═══════════════════════════════════════════════════════════

function Petals() {
  const petals = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    emoji: ["🌸","🌹","🌺","💐","🌷","✨","💫","⭐"][i % 8],
    left: `${(i * 5.5) % 100}%`,
    delay: `${(i * 0.7) % 8}s`,
    duration: `${7 + (i % 5)}s`,
    size: `${14 + (i % 10)}px`,
  }));
  return (
    <>
      {petals.map((p) => (
        <span key={p.id} className="petal select-none" style={{ left: p.left, top: "-30px", fontSize: p.size, animationDuration: p.duration, animationDelay: p.delay }}>
          {p.emoji}
        </span>
      ))}
    </>
  );
}

function useCursorHearts() {
  useEffect(() => {
    let last = 0;
    const handler = (e) => {
      const now = Date.now();
      if (now - last < 120) return;
      last = now;
      const heart = document.createElement("span");
      heart.className = "cursor-heart";
      heart.textContent = ["💕","💖","💗","💓","❤️","🩷"][Math.floor(Math.random() * 6)];
      heart.style.left = e.clientX - 8 + "px";
      heart.style.top = e.clientY - 8 + "px";
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
}

function useSectionFade() {
  useEffect(() => {
    const els = document.querySelectorAll(".section-fade");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ═══════════════════════════════════════════════════════════
// LOVE WEBSITE SECTIONS
// ═══════════════════════════════════════════════════════════

function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const target = new Date("2025-12-31T00:00:00");
  useEffect(() => {
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return;
      setTime({ days: Math.floor(diff/86400000), hours: Math.floor((diff%86400000)/3600000), mins: Math.floor((diff%3600000)/60000), secs: Math.floor((diff%60000)/1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
      {[["Days",time.days],["Hours",time.hours],["Mins",time.mins],["Secs",time.secs]].map(([label,val]) => (
        <div key={label} className="glass card-hover" style={{ borderRadius:"20px", padding:"16px", minWidth:"80px", textAlign:"center", cursor:"default" }}>
          <div className="text-gradient" style={{ fontSize:"2rem", fontWeight:700, fontFamily:"'Playfair Display',serif" }}>{String(val).padStart(2,"0")}</div>
          <div style={{ fontSize:"11px", textTransform:"uppercase", letterSpacing:"3px", color:"#C2185B", marginTop:"4px" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

const reasons = [
  { emoji:"😂", title:"Your Laugh", text:"It sounds like the universe decided to make music. Also you snort sometimes and I live for it." },
  { emoji:"🧠", title:"Your Brain", text:"You're terrifyingly smart. I'm still trying to impress you, and I've been failing gloriously." },
  { emoji:"🌙", title:"2AM Texts", text:"You text me at 2am about random things and honestly it's the highlight of my entire existence." },
  { emoji:"🥺", title:"Your Eyes", text:"One look from you and I forget every single thought I've ever had. Every. Single. One." },
  { emoji:"☕", title:"Your Chaos", text:"You're a beautiful disaster. A gorgeous hurricane. And I'm a fool standing in the middle going 'this is fine'." },
  { emoji:"💌", title:"Your Words", text:"The way you write. The way you say things. I screenshot everything. Yes, everything." },
  { emoji:"🎵", title:"Your Taste", text:"You introduced me to songs that destroyed me emotionally. I have never been more grateful." },
  { emoji:"🌸", title:"Just... You", text:"Honestly I could write 10,000 reasons and still feel like I haven't even started." },
];

const letters = [
  { label:"The Honest One", subject:"You've ruined me (in the best way)", body:`My love,\n\nI need you to know that before you, I had a normal life. I slept at decent hours. I didn't randomly smile at my phone. I had full braincells.\n\nThen you happened.\n\nNow I'm here, awake at 3am, building you a WEBSITE because apparently that's how much you've broken my capacity for normal human behavior.\n\nEvery moment with you — even the ones across screens and timezones — feels like the universe quietly saying "yes, this is exactly right."\n\nYou're the person I want to tell everything to. The first person I think of when something funny happens. The last thought before sleep claims me.\n\nI love you. Embarrassingly. Completely. Without a single regret.\n\n— Your fool, always 💕` },
  { label:"The Poetic One", subject:"Distance is just a detail", body:`My darling,\n\nThey say love is patient. They never met you — because loving you is the most delightfully impatient thing I've ever done.\n\nThe miles between us are just geography. Stubborn geography. Geography that has absolutely no idea what it's dealing with.\n\nEvery goodnight message you send travels through cables and satellites and data centers just to land on my screen and make me smile like an idiot in my dark room.\n\nDistance is temporary. This is permanent.\n\nYou. Us. This.\n\nAlways yours 🌹` },
  { label:"The Silly One", subject:"An emergency declaration", body:`URGENT NOTICE:\n\nTo Whom It May Concern (It's You):\n\nI, the undersigned, hereby declare that I am HOPELESSLY, RIDICULOUSLY, EMBARRASSINGLY in love with you.\n\nSymptoms include:\n✓ Uncontrollable smiling at phone\n✓ Showing your photos to people who didn't ask\n✓ Defending your honor to literally no one\n✓ Planning our future while pretending to be chill\n✓ Laughing at things you said 3 days ago\n\nThis condition is: INCURABLE.\nPrognosis: Eternal.\nTreatment sought: Zero. I'm fine here.\n\nSubmitted with full heart,\nYour Person 💖\n\nP.S. You're not allowed to stop loving me now, I've already gotten too attached.` },
];

const memories = [
  "The first time we talked for 6 hours and forgot to sleep 🌙",
  "When you sent me that meme at 2am and said 'this is you' and it absolutely was 😭",
  "Every single voice note you've ever sent me 🎙️",
  "The moment I realized you were different. Actually different.",
  "When you laughed so hard you couldn't type and just sent '....' ❤️",
  "Every tiny moment you chose to tell me something real 🌸",
  "The exact second I stopped pretending I was 'just friends' with my feelings 💀",
  "Us, figuring out timezone math together at ungodly hours ⏰",
];

const funnyReasons = [
  { q:"How much do I love you?", a:"Enough to build you a website at 3am. That's beyond love. That's devotion. That's possibly a disorder." },
  { q:"Why are you still reading this?", a:"Because you love me too and you're looking for proof. Here it is. Hello. 👋" },
  { q:"What would I do without you?", a:"Honestly? Probably sleep. Get my life together. Eat meals at normal times. But at what COST??" },
  { q:"Is LDR hard?", a:"Yes. Also no. Because even the 'hard' parts are spent thinking about you, and thinking about you is my favorite thing." },
];

function LetterModal({ letter, onClose }) {
  if (!letter) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px", background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)" }}>
      <div onClick={e=>e.stopPropagation()} className="glass" style={{ borderRadius:"24px", padding:"32px", maxWidth:"500px", width:"100%", position:"relative", maxHeight:"80vh", overflowY:"auto", background:"rgba(255,248,240,0.95)", border:"2px solid rgba(194,24,91,0.2)" }}>
        <button onClick={onClose} style={{ position:"absolute", top:"12px", right:"16px", background:"none", border:"none", fontSize:"20px", cursor:"pointer" }}>✕</button>
        <div style={{ textAlign:"center", marginBottom:"16px" }}>
          <span style={{ fontSize:"2rem" }}>💌</span>
          <h3 style={{ fontFamily:"'Playfair Display',serif", color:"#C2185B", fontSize:"1.2rem", fontWeight:700, marginTop:"8px" }}>{letter.subject}</h3>
        </div>
        <pre style={{ fontFamily:"'Courier Prime',monospace", color:"#5d3a3a", fontSize:"13px", lineHeight:1.8, whiteSpace:"pre-wrap" }}>{letter.body}</pre>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DRAW TOGETHER GAME
// ═══════════════════════════════════════════════════════════

function DrawingCanvas({ isDrawer, socket, strokes, setStrokes, clearSignal }) {
  const canvasRef = useRef(null);
  const isDown = useRef(false);
  const lastPos = useRef(null);
  const currentStroke = useRef([]);
  const [color, setColor] = useState("#C2185B");
  const [size, setSize] = useState(5);
  const [tool, setTool] = useState("pen");
  const COLORS = ["#C2185B","#E91E63","#7B1FA2","#1976D2","#388E3C","#F57C00","#000000","#ffffff","#FFB7C5","#FFF176","#FF5722","#009688"];

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * sx, y: (src.clientY - rect.top) * sy };
  };

  const redrawAll = useCallback((sl) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sl.forEach(({ points, color: c, size: s, tool: t }) => {
      if (!points || points.length < 2) return;
      ctx.beginPath(); ctx.strokeStyle = t==="eraser"?"#ffffff":c; ctx.lineWidth = s; ctx.lineCap="round"; ctx.lineJoin="round";
      ctx.moveTo(points[0].x, points[0].y); points.slice(1).forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
    });
  }, []);

  useEffect(() => { redrawAll(strokes); }, [strokes, redrawAll]);
  useEffect(() => { redrawAll([]); }, [clearSignal, redrawAll]);

  const drawSeg = useCallback((from, to) => {
    const ctx = canvasRef.current?.getContext("2d"); if (!ctx) return;
    ctx.beginPath(); ctx.strokeStyle = tool==="eraser"?"#ffffff":color; ctx.lineWidth = tool==="eraser"?size*3:size;
    ctx.lineCap="round"; ctx.lineJoin="round"; ctx.moveTo(from.x,from.y); ctx.lineTo(to.x,to.y); ctx.stroke();
  }, [color, size, tool]);

  const onStart = e => { if (!isDrawer) return; e.preventDefault(); isDown.current=true; const p=getPos(e,canvasRef.current); lastPos.current=p; currentStroke.current=[p]; };
  const onMove = e => { if (!isDown.current||!isDrawer) return; e.preventDefault(); const p=getPos(e,canvasRef.current); drawSeg(lastPos.current,p); currentStroke.current.push(p); lastPos.current=p; };
  const onEnd = () => {
    if (!isDown.current||!isDrawer) return; isDown.current=false;
    const stroke={points:currentStroke.current,color,size:tool==="eraser"?size*3:size,tool};
    if (stroke.points.length>1) { setStrokes(prev=>[...prev,stroke]); socket.emit("draw",stroke); }
    currentStroke.current=[];
  };
  const handleClear = () => { redrawAll([]); setStrokes([]); socket.emit("clear_canvas"); };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"10px", alignItems:"center" }}>
      {isDrawer && (
        <div style={{ display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap", justifyContent:"center", background:"rgba(255,255,255,0.85)", borderRadius:"20px", padding:"8px 14px", border:"1px solid rgba(194,24,91,0.2)" }}>
          <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
            {COLORS.map(c => <button key={c} onClick={()=>{setColor(c);setTool("pen");}} style={{ width:22,height:22,borderRadius:"50%",background:c,border:color===c&&tool==="pen"?"3px solid #880E4F":"2px solid rgba(0,0,0,0.15)",cursor:"pointer",transition:"transform 0.15s",transform:color===c&&tool==="pen"?"scale(1.3)":"scale(1)" }}/>)}
          </div>
          <input type="range" min={2} max={24} value={size} onChange={e=>setSize(+e.target.value)} style={{ width:70, accentColor:"#C2185B" }}/>
          <button onClick={()=>setTool(t=>t==="eraser"?"pen":"eraser")} style={{ padding:"4px 10px",borderRadius:"12px",fontSize:"13px",cursor:"pointer",background:tool==="eraser"?"linear-gradient(135deg,#C2185B,#E91E63)":"rgba(255,255,255,0.7)",color:tool==="eraser"?"white":"#C2185B",border:"1px solid rgba(194,24,91,0.3)",fontFamily:"'Lato',sans-serif",fontWeight:700 }}>{tool==="eraser"?"✏️ Pen":"⬜ Erase"}</button>
          <button onClick={handleClear} style={{ padding:"4px 10px",borderRadius:"12px",fontSize:"13px",cursor:"pointer",background:"rgba(255,255,255,0.7)",color:"#C2185B",border:"1px solid rgba(194,24,91,0.3)",fontFamily:"'Lato',sans-serif",fontWeight:700 }}>🗑️ Clear</button>
        </div>
      )}
      <div style={{ position:"relative",borderRadius:"20px",overflow:"hidden",boxShadow:"0 8px 40px rgba(194,24,91,0.15)",border:"2px solid rgba(194,24,91,0.2)",width:"100%",maxWidth:600 }}>
        <canvas ref={canvasRef} width={600} height={400} style={{ display:"block",background:"#ffffff",cursor:!isDrawer?"default":tool==="eraser"?"cell":"crosshair",width:"100%",touchAction:"none" }}
          onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
          onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}/>
        {!isDrawer && <div style={{ position:"absolute",top:10,left:10,background:"rgba(255,255,255,0.85)",borderRadius:"12px",padding:"4px 12px",fontSize:"12px",color:"#C2185B",fontWeight:700 }}>👁️ Watching…</div>}
      </div>
    </div>
  );
}

function ChatBox({ messages, onSend, isDrawer, disabled }) {
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);
  const send = () => { const t=text.trim(); if (!t) return; onSend(t); setText(""); };
  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%",background:"rgba(255,248,252,0.85)",borderRadius:"20px",border:"1px solid rgba(194,24,91,0.15)",overflow:"hidden" }}>
      <div style={{ padding:"10px 14px",borderBottom:"1px dashed rgba(194,24,91,0.15)",fontFamily:"'Playfair Display',serif",color:"#C2185B",fontWeight:700,fontSize:"15px" }}>
        💬 {isDrawer?"Chat":"Guess here!"}
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:"10px 12px",display:"flex",flexDirection:"column",gap:"5px" }}>
        {messages.map((m,i) => (
          <div key={i} style={{ padding:m.type==="system"?"3px 0":"6px 10px",borderRadius:"12px",background:m.type==="correct"?"linear-gradient(135deg,rgba(194,24,91,0.15),rgba(233,30,99,0.1))":m.type==="system"?"transparent":"rgba(255,255,255,0.7)",fontSize:m.type==="system"?"11px":"13px",color:m.type==="system"?"#bbb":m.type==="correct"?"#C2185B":"#3d1a3a",fontStyle:m.type==="system"?"italic":"normal",textAlign:m.type==="system"?"center":"left",border:m.type==="correct"?"1px solid rgba(194,24,91,0.2)":"none",fontFamily:"'Lato',sans-serif" }}>
            {m.type==="correct"&&"🎉 "}{m.name&&<strong style={{color:"#C2185B"}}>{m.name}: </strong>}{m.text}
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>
      <div style={{ display:"flex",gap:"8px",padding:"10px 12px",borderTop:"1px dashed rgba(194,24,91,0.15)" }}>
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={isDrawer?"Chat…":"Type your guess…"} disabled={disabled} style={{ flex:1,padding:"8px 12px",borderRadius:"14px",border:"1px solid rgba(194,24,91,0.25)",fontFamily:"'Lato',sans-serif",fontSize:"13px",outline:"none",background:"rgba(255,255,255,0.8)",color:"#3d1a3a" }}/>
        <button onClick={send} disabled={disabled} style={{ padding:"8px 16px",borderRadius:"14px",background:"linear-gradient(135deg,#C2185B,#E91E63)",color:"white",border:"none",cursor:disabled?"not-allowed":"pointer",fontWeight:700,fontSize:"13px",opacity:disabled?0.5:1 }}>↑</button>
      </div>
    </div>
  );
}

function Scoreboard({ players, scores }) {
  const sorted = [...players].sort((a,b)=>(scores[b.id]||0)-(scores[a.id]||0));
  return (
    <div style={{ background:"rgba(255,248,252,0.85)",borderRadius:"20px",border:"1px solid rgba(194,24,91,0.15)",overflow:"hidden" }}>
      <div style={{ padding:"10px 14px",borderBottom:"1px dashed rgba(194,24,91,0.15)",fontFamily:"'Playfair Display',serif",color:"#C2185B",fontWeight:700,fontSize:"15px" }}>🏆 Scores</div>
      <div style={{ padding:"10px 12px",display:"flex",flexDirection:"column",gap:"5px" }}>
        {sorted.map((p,i) => (
          <div key={p.id} style={{ display:"flex",alignItems:"center",gap:"8px",padding:"6px 10px",borderRadius:"12px",background:i===0?"linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05))":"rgba(255,255,255,0.5)",border:i===0?"1px solid rgba(212,175,55,0.3)":"none" }}>
            <span>{i===0?"🥇":i===1?"🥈":i===2?"🥉":"🌸"}</span>
            <span style={{ flex:1,fontFamily:"'Lato',sans-serif",fontWeight:700,color:"#3d1a3a",fontSize:"13px" }}>{p.name}</span>
            <span style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,color:"#C2185B",fontSize:"16px" }}>{scores[p.id]||0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GameLobby({ players, onStart, isHost, roomId }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(roomId); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  return (
    <div style={{ maxWidth:460,margin:"0 auto",textAlign:"center" }}>
      <div style={{ fontSize:"56px",marginBottom:"10px",animation:"float 4s ease-in-out infinite",display:"inline-block" }}>🎨</div>
      <h2 style={{ fontFamily:"'Playfair Display',serif",color:"#C2185B",fontSize:"26px",marginBottom:"6px" }}>Waiting for your person…</h2>
      <p style={{ color:"#aaa",marginBottom:"20px",fontFamily:"'Dancing Script',cursive",fontSize:"17px" }}>Share the Room ID below 💕</p>
      <div onClick={copy} style={{ background:"rgba(255,255,255,0.8)",border:"2px dashed rgba(194,24,91,0.3)",borderRadius:"16px",padding:"12px 20px",marginBottom:"20px",cursor:"pointer" }}>
        <p style={{ fontSize:"11px",color:"#aaa",marginBottom:"4px" }}>{copied?"✅ COPIED!":"ROOM ID — click to copy"}</p>
        <p style={{ fontFamily:"'Playfair Display',serif",fontSize:"26px",fontWeight:700,color:"#C2185B",letterSpacing:"5px" }}>{roomId}</p>
      </div>
      <div style={{ marginBottom:"24px" }}>
        <p style={{ fontSize:"12px",color:"#C2185B",marginBottom:"10px",fontWeight:700 }}>Players ({players.length}/8)</p>
        <div style={{ display:"flex",gap:"8px",flexWrap:"wrap",justifyContent:"center" }}>
          {players.map((p,i) => (
            <div key={p.id} style={{ padding:"6px 14px",borderRadius:"20px",fontSize:"13px",fontWeight:700,background:i===0?"linear-gradient(135deg,#C2185B,#E91E63)":"rgba(255,255,255,0.8)",color:i===0?"white":"#C2185B",border:`1px solid rgba(194,24,91,${i===0?0:0.25})` }}>
              {i===0?"👑 ":""}{p.name}
            </div>
          ))}
        </div>
      </div>
      {isHost ? (
        <button onClick={onStart} disabled={players.length<2} style={{ padding:"14px 36px",borderRadius:"30px",fontSize:"15px",background:players.length<2?"#eee":"linear-gradient(135deg,#C2185B,#E91E63)",color:players.length<2?"#bbb":"white",border:"none",cursor:players.length<2?"not-allowed":"pointer",fontWeight:700,letterSpacing:"1px",boxShadow:players.length>=2?"0 8px 30px rgba(194,24,91,0.3)":"none" }}>
          {players.length<2?"Waiting for 2nd player… 🥺":"Start Game 💕"}
        </button>
      ) : <p style={{ color:"#aaa",fontSize:"13px",fontStyle:"italic" }}>Waiting for host to start…</p>}
    </div>
  );
}

function GameOver({ players, scores, onBack }) {
  const sorted = [...players].sort((a,b)=>(scores[b.id]||0)-(scores[a.id]||0));
  return (
    <div style={{ textAlign:"center",maxWidth:480,margin:"0 auto",padding:"20px" }}>
      <div style={{ fontSize:"70px",marginBottom:"10px",animation:"pop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",display:"inline-block" }}>🏆</div>
      <h2 style={{ fontFamily:"'Playfair Display',serif",color:"#C2185B",fontSize:"30px",marginBottom:"8px" }}>Game Over!</h2>
      {sorted[0]&&<p style={{ marginBottom:"24px",fontFamily:"'Dancing Script',cursive",color:"#880E4F",fontSize:"22px" }}>{sorted[0].name} wins with {scores[sorted[0].id]||0} pts! 🎉</p>}
      <div style={{ marginBottom:"28px",display:"flex",flexDirection:"column",gap:"8px" }}>
        {sorted.map((p,i) => (
          <div key={p.id} style={{ display:"flex",alignItems:"center",gap:"12px",padding:"10px 16px",borderRadius:"16px",background:"rgba(255,255,255,0.75)",border:"1px solid rgba(194,24,91,0.15)" }}>
            <span style={{fontSize:"20px"}}>{i===0?"🥇":i===1?"🥈":"🥉"}</span>
            <span style={{ flex:1,fontFamily:"'Lato',sans-serif",fontWeight:700,color:"#3d1a3a" }}>{p.name}</span>
            <span style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,color:"#C2185B",fontSize:"20px" }}>{scores[p.id]||0} pts</span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap" }}>
        <button onClick={onBack} style={{ padding:"14px 36px",borderRadius:"30px",fontSize:"15px",background:"linear-gradient(135deg,#C2185B,#E91E63)",color:"white",border:"none",cursor:"pointer",fontWeight:700,boxShadow:"0 8px 30px rgba(194,24,91,0.3)" }}>Play Again 💕</button>
      </div>
    </div>
  );
}

function DrawTogetherGame({ onClose }) {
  const [socket, setSocket] = useState(null);
  const [gameScreen, setGameScreen] = useState("join"); // join | lobby | game | gameover
  const [myId, setMyId] = useState(null);
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [mode, setMode] = useState("create");
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [messages, setMessages] = useState([]);
  const [strokes, setStrokes] = useState([]);
  const [clearSignal, setClearSignal] = useState(0);
  const [role, setRole] = useState(null);
  const [word, setWord] = useState("");
  const [drawerName, setDrawerName] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [round, setRound] = useState(0);
  const [maxRounds, setMaxRounds] = useState(6);
  const [roundActive, setRoundActive] = useState(false);
  const [roundEndData, setRoundEndData] = useState(null);
  const [isGameStarting, setIsGameStarting] = useState(false);
  const [youGuessed, setYouGuessed] = useState(false);
  const [choosingWord, setChoosingWord] = useState(false);
  const [waitingForWord, setWaitingForWord] = useState(false);
  const [waitingDrawerName, setWaitingDrawerName] = useState("");
  const [wordInput, setWordInput] = useState("");

  useEffect(() => {
    const s = io(SERVER, { autoConnect: false });
    setSocket(s); s.connect();
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("joined", ({ playerId, players: pl, scores: sc, strokes: st }) => { setMyId(playerId); setPlayers(pl); setScores(sc); setStrokes(st||[]); setGameScreen("lobby"); });
    socket.on("players_update", setPlayers);
    socket.on("scores_update", setScores);
    socket.on("chat", msg => setMessages(prev=>[...prev.slice(-100),msg]));
    socket.on("game_starting", () => { setIsGameStarting(true); setMessages([]); setRoundEndData(null); });
    socket.on("choose_word", ({ drawer, round: rnd, maxRounds: mx }) => {
      setDrawerName(drawer); setRound(rnd); setMaxRounds(mx);
      setChoosingWord(true); setWaitingForWord(false);
      setIsGameStarting(false); setWordInput(""); setGameScreen("game");
    });
    socket.on("waiting_for_word", ({ drawer, round: rnd, maxRounds: mx }) => {
      setDrawerName(drawer); setRound(rnd); setMaxRounds(mx);
      setWaitingDrawerName(drawer); setWaitingForWord(true);
      setChoosingWord(false); setIsGameStarting(false); setGameScreen("game");
    });
    socket.on("round_start", ({ role:r, word:w, drawer, round:rnd, maxRounds:mx }) => {
      setRole(r); setWord(w); setDrawerName(drawer); setRound(rnd); setMaxRounds(mx);
      setRoundActive(true); setRoundEndData(null); setStrokes([]); setClearSignal(c=>c+1);
      setYouGuessed(false); setIsGameStarting(false);
      setChoosingWord(false); setWaitingForWord(false); setGameScreen("game");
    });
    socket.on("draw", stroke => setStrokes(prev=>[...prev,stroke]));
    socket.on("clear_canvas", () => { setStrokes([]); setClearSignal(c=>c+1); });
    socket.on("timer", setTimeLeft);
    socket.on("you_guessed", ({ word:w }) => { setWord(w); setYouGuessed(true); });
    socket.on("round_end", data => { setRoundActive(false); setRoundEndData(data); setScores(data.scores); });
    socket.on("game_over", data => { setScores(data.scores); setGameScreen("gameover"); });
    return () => socket.removeAllListeners();
  }, [socket]);

  const submitWord = () => {
    const w = wordInput.trim();
    if (!w || !socket) return;
    socket.emit("submit_word", { word: w });
    setChoosingWord(false);
  };

  const handleJoin = () => {
    if (!name.trim() || !socket) return;
    const id = mode==="create" ? Math.random().toString(36).slice(2,8).toUpperCase() : roomInput.trim().toUpperCase();
    if (!id) return;
    setRoomId(id);
    socket.emit("join_room", { roomId: id, name: name.trim() });
  };

  const isHost = players[0]?.id === myId;
  const isDrawer = role === "drawer";
  const timerPct = (timeLeft / 80) * 100;
  const timerColor = timeLeft > 30 ? "#4CAF50" : timeLeft > 10 ? "#FF9800" : "#F44336";

  return (
    <div style={{ position:"fixed",inset:0,zIndex:200,background:"rgba(255,240,248,0.97)",backdropFilter:"blur(16px)",overflow:"auto" }}>
      {/* Close button */}
      <button onClick={onClose} style={{ position:"fixed",top:"16px",right:"20px",zIndex:201,background:"linear-gradient(135deg,#C2185B,#E91E63)",color:"white",border:"none",borderRadius:"50%",width:"44px",height:"44px",fontSize:"20px",cursor:"pointer",boxShadow:"0 4px 20px rgba(194,24,91,0.4)",display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>

      <div style={{ minHeight:"100vh",padding:"20px",paddingTop:"60px" }}>

        {/* Join Screen */}
        {gameScreen==="join" && (
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"80vh" }}>
            <div className="glass animate-fadein" style={{ borderRadius:"32px",padding:"48px 40px",maxWidth:"420px",width:"100%",textAlign:"center",boxShadow:"0 20px 80px rgba(194,24,91,0.15)" }}>
              <div style={{ fontSize:"60px",marginBottom:"12px",animation:"heartbeat 1.4s ease-in-out infinite",display:"inline-block" }}>🎨</div>
              <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"30px",fontWeight:900 }} className="text-gradient">DrawTogether</h1>
              <p style={{ color:"#aaa",marginBottom:"28px",fontFamily:"'Dancing Script',cursive",fontSize:"18px",marginTop:"6px" }}>Draw, guess & fall more in love 💕</p>
              <div style={{ display:"flex",borderRadius:"16px",overflow:"hidden",border:"1px solid rgba(194,24,91,0.2)",marginBottom:"20px" }}>
                {["create","join"].map(m => (
                  <button key={m} onClick={()=>setMode(m)} style={{ flex:1,padding:"10px",border:"none",cursor:"pointer",background:mode===m?"linear-gradient(135deg,#C2185B,#E91E63)":"transparent",color:mode===m?"white":"#C2185B",fontWeight:700,fontSize:"13px",fontFamily:"'Lato',sans-serif",transition:"all 0.2s" }}>
                    {m==="create"?"🌸 Create Room":"💌 Join Room"}
                  </button>
                ))}
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:"12px",marginBottom:"20px" }}>
                <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleJoin()} placeholder="Your name 💕" maxLength={20} style={{ padding:"12px 18px",borderRadius:"16px",border:"1px solid rgba(194,24,91,0.25)",fontFamily:"'Lato',sans-serif",fontSize:"14px",outline:"none",background:"rgba(255,255,255,0.8)",color:"#3d1a3a",textAlign:"center" }}/>
                {mode==="join" && <input value={roomInput} onChange={e=>setRoomInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleJoin()} placeholder="Room ID" maxLength={10} style={{ padding:"12px 18px",borderRadius:"16px",border:"1px solid rgba(194,24,91,0.25)",fontFamily:"'Lato',sans-serif",fontSize:"14px",outline:"none",background:"rgba(255,255,255,0.8)",color:"#3d1a3a",textAlign:"center",letterSpacing:"3px",textTransform:"uppercase" }}/>}
              </div>
              <button onClick={handleJoin} style={{ width:"100%",padding:"14px",borderRadius:"20px",border:"none",background:"linear-gradient(135deg,#C2185B,#E91E63)",color:"white",fontWeight:700,fontSize:"15px",cursor:"pointer",letterSpacing:"1px",boxShadow:"0 8px 30px rgba(194,24,91,0.3)" }}>
                {mode==="create"?"Create & Enter Room ✨":"Join Room 💌"}
              </button>
            </div>
          </div>
        )}

        {/* Lobby */}
        {gameScreen==="lobby" && (
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"80vh" }}>
            <GameLobby players={players} onStart={()=>socket?.emit("start_game")} isHost={isHost} roomId={roomId}/>
          </div>
        )}

        {/* Game */}
        {gameScreen==="game" && (
          <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",flexDirection:"column",gap:"10px" }}>
            {/* Header */}
            <div style={{ display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap",background:"rgba(255,255,255,0.8)",borderRadius:"20px",padding:"10px 18px",border:"1px solid rgba(194,24,91,0.15)",backdropFilter:"blur(10px)" }}>
              <span style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,color:"#C2185B",fontSize:"18px" }}>🎨 DrawTogether</span>
              <span style={{ fontSize:"12px",color:"#aaa" }}>Room: <strong style={{color:"#C2185B",letterSpacing:"2px"}}>{roomId}</strong></span>
              <span style={{ fontSize:"12px",color:"#888" }}>Round {round}/{maxRounds}</span>
              <div style={{flex:1}}/>
              <div style={{ padding:"6px 16px",borderRadius:"16px",background:isDrawer?"linear-gradient(135deg,#C2185B,#E91E63)":"rgba(255,255,255,0.8)",border:`1px solid rgba(194,24,91,${isDrawer?0:0.25})`,color:isDrawer?"white":"#C2185B",fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"16px",letterSpacing:isDrawer?"1px":"5px" }}>
                {isDrawer?`✏️ ${word}`:youGuessed?`✅ ${word}`:word.split("").map((c,i)=>c==="_"?"_ ":c).join("")}
              </div>
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",minWidth:"50px" }}>
                <span style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,color:timerColor,fontSize:"18px" }}>{timeLeft}s</span>
                <div style={{ width:"50px",height:"4px",background:"rgba(0,0,0,0.1)",borderRadius:"4px",overflow:"hidden" }}>
                  <div style={{ height:"100%",width:`${timerPct}%`,background:timerColor,transition:"width 1s linear,background 0.3s" }}/>
                </div>
              </div>
            </div>
            {roundEndData && (
              <div style={{ background:"linear-gradient(135deg,rgba(194,24,91,0.12),rgba(233,30,99,0.08))",border:"2px solid rgba(194,24,91,0.25)",borderRadius:"16px",padding:"12px 20px",textAlign:"center",animation:"pop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
                <span style={{ fontFamily:"'Dancing Script',cursive",fontSize:"20px",color:"#C2185B" }}>
                  {roundEndData.guessed?"🎉 Someone got it!":"⏱️ Time's up!"}&nbsp;&nbsp;Word was: <strong style={{fontFamily:"'Playfair Display',serif"}}>{roundEndData.word}</strong>
                  {round<maxRounds&&" — next round starting…"}
                </span>
              </div>
            )}
            {!roundEndData && (
              <div style={{ textAlign:"center" }}>
                <span style={{ fontSize:"13px",color:"#888",background:"rgba(255,255,255,0.7)",padding:"4px 14px",borderRadius:"12px",border:"1px solid rgba(194,24,91,0.1)" }}>
                  {isDrawer?"✏️ You are drawing!": `👁️ ${drawerName} is drawing — guess!`}{youGuessed&&!isDrawer&&" You guessed it! 🎉"}
                </span>
              </div>
            )}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 290px",gap:"12px",alignItems:"start" }}>
              <DrawingCanvas isDrawer={isDrawer&&roundActive&&!youGuessed} socket={socket} strokes={strokes} setStrokes={setStrokes} clearSignal={clearSignal}/>
              <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
                <Scoreboard players={players} scores={scores}/>
                <div style={{ height:"320px" }}><ChatBox messages={messages} onSend={t=>socket?.emit("send_chat",{text:t})} isDrawer={isDrawer} disabled={youGuessed&&!isDrawer}/></div>
              </div>
            </div>
          </div>
        )}

        {/* Game Over */}
        {gameScreen==="gameover" && (
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"80vh" }}>
            <GameOver players={players} scores={scores} onBack={()=>{ setGameScreen("lobby"); setRoundActive(false); setRoundEndData(null); setMessages([]); setStrokes([]); setRole(null); }}/>
          </div>
        )}

        {isGameStarting && (
          <div style={{ position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,240,245,0.92)",backdropFilter:"blur(12px)",zIndex:300 }}>
            <div style={{ textAlign:"center",animation:"pop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
              <div style={{ fontSize:"80px",marginBottom:"12px",animation:"heartbeat 1.4s ease-in-out infinite",display:"inline-block" }}>🎨</div>
              <p style={{ fontFamily:"'Playfair Display',serif",color:"#C2185B",fontSize:"28px",fontWeight:700 }}>Game starting…</p>
            </div>
          </div>
        )}

        {/* Drawer: choose your word */}
        {choosingWord && (
          <div style={{ position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,240,248,0.96)",backdropFilter:"blur(16px)",zIndex:300 }}>
            <div className="glass animate-pop" style={{ borderRadius:"32px",padding:"48px 40px",maxWidth:"440px",width:"100%",textAlign:"center",boxShadow:"0 20px 80px rgba(194,24,91,0.2)" }}>
              <div style={{ fontSize:"56px",marginBottom:"12px",animation:"float 4s ease-in-out infinite",display:"inline-block" }}>✏️</div>
              <p style={{ fontSize:"11px",textTransform:"uppercase",letterSpacing:"4px",color:"#C2185B",marginBottom:"8px",fontFamily:"'Lato',sans-serif" }}>Round {round} of {maxRounds}</p>
              <h2 style={{ fontFamily:"'Playfair Display',serif",color:"#C2185B",fontSize:"26px",fontWeight:900,marginBottom:"6px" }}>It&apos;s your turn to draw!</h2>
              <p style={{ fontFamily:"'Dancing Script',cursive",fontSize:"17px",color:"#880E4F",marginBottom:"28px" }}>Type anything — your partner will try to guess it 💕</p>
              <input
                value={wordInput}
                onChange={e=>setWordInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&submitWord()}
                placeholder="e.g. unicorn, pizza, kiss…"
                maxLength={30}
                autoFocus
                style={{ width:"100%",padding:"14px 20px",borderRadius:"18px",border:"2px solid rgba(194,24,91,0.3)",fontFamily:"'Lato',sans-serif",fontSize:"16px",outline:"none",background:"rgba(255,255,255,0.9)",color:"#3d1a3a",textAlign:"center",marginBottom:"16px",boxSizing:"border-box" }}
              />
              <button onClick={submitWord} disabled={!wordInput.trim()} style={{ width:"100%",padding:"14px",borderRadius:"20px",border:"none",background:wordInput.trim()?"linear-gradient(135deg,#C2185B,#E91E63)":"#eee",color:wordInput.trim()?"white":"#bbb",fontWeight:700,fontSize:"15px",cursor:wordInput.trim()?"pointer":"not-allowed",letterSpacing:"1px",boxShadow:wordInput.trim()?"0 8px 30px rgba(194,24,91,0.3)":"none",transition:"all 0.2s" }}>
                Start Drawing 🎨
              </button>
              <p style={{ marginTop:"14px",fontSize:"12px",color:"#ccc",fontStyle:"italic" }}>Don&apos;t show your screen to your partner! 🙈</p>
            </div>
          </div>
        )}

        {/* Guesser: waiting for drawer to pick word */}
        {waitingForWord && (
          <div style={{ position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,240,248,0.96)",backdropFilter:"blur(16px)",zIndex:300 }}>
            <div className="glass animate-fadein" style={{ borderRadius:"32px",padding:"48px 40px",maxWidth:"420px",width:"100%",textAlign:"center",boxShadow:"0 20px 80px rgba(194,24,91,0.2)" }}>
              <div style={{ fontSize:"56px",marginBottom:"12px",animation:"float 4s ease-in-out infinite",display:"inline-block" }}>🕐</div>
              <p style={{ fontSize:"11px",textTransform:"uppercase",letterSpacing:"4px",color:"#C2185B",marginBottom:"8px" }}>Round {round} of {maxRounds}</p>
              <h2 style={{ fontFamily:"'Playfair Display',serif",color:"#C2185B",fontSize:"26px",fontWeight:900,marginBottom:"10px" }}>Get ready to guess!</h2>
              <p style={{ fontFamily:"'Dancing Script',cursive",fontSize:"19px",color:"#880E4F",marginBottom:"8px" }}>{waitingDrawerName} is choosing what to draw…</p>
              <p style={{ color:"#bbb",fontSize:"13px",fontStyle:"italic" }}>Warm up your brain 🧠 It could be anything!</p>
              <div style={{ marginTop:"24px",display:"flex",justifyContent:"center",gap:"8px" }}>
                {["💭","🌸","✨","💕","🎨"].map((e,i)=>(
                  <span key={i} style={{ fontSize:"22px",animation:`float ${3+i*0.5}s ease-in-out ${i*0.3}s infinite`,display:"inline-block" }}>{e}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  useCursorHearts();
  useSectionFade();
  const [activeLetter, setActiveLetter] = useState(null);
  const [openMemory, setOpenMemory] = useState(null);
  const [clickedReason, setClickedReason] = useState(null);
  const [showGame, setShowGame] = useState(false);

  return (
    <div style={{ minHeight:"100vh", position:"relative", background:"linear-gradient(180deg,#FFF0F5 0%,#FFF8F0 50%,#FFF0F5 100%)" }}>

      {/* Bokeh blobs */}
      <div className="bokeh-circle" style={{ width:"380px",height:"380px",opacity:0.18,top:0,left:"-80px",background:"#FFB7C5",position:"fixed",zIndex:0 }}/>
      <div className="bokeh-circle" style={{ width:"300px",height:"300px",opacity:0.13,top:"35%",right:0,background:"#E8D5F5",position:"fixed",zIndex:0 }}/>
      <div className="bokeh-circle" style={{ width:"250px",height:"250px",opacity:0.13,bottom:"25%",left:"25%",background:"#FFDAB9",position:"fixed",zIndex:0 }}/>

      <Petals />
      <LetterModal letter={activeLetter} onClose={()=>setActiveLetter(null)} />
      {showGame && <DrawTogetherGame onClose={()=>setShowGame(false)} />}

      {/* ── HERO ── */}
      <section style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"16px",textAlign:"center",overflow:"hidden",paddingTop:"60px",position:"relative",zIndex:1 }}>
        <div style={{ position:"absolute",width:"600px",height:"600px",border:"2px dashed #C2185B",borderRadius:"50%",top:"50%",left:"50%",transform:"translate(-50%,-50%)",opacity:0.05,animation:"spin-slow 20s linear infinite",zIndex:0 }}/>
        {["💕","💖","💗","🌸","✨","💫"].map((e,i) => (
          <span key={i} style={{ position:"absolute",fontSize:"24px",opacity:0.55,userSelect:"none",animation:`float ${5+i}s ease-in-out ${i*0.8}s infinite`,top:`${15+(i*12)%70}%`,left:`${5+(i*15)%90}%`,zIndex:0 }}>{e}</span>
        ))}
        <div className="animate-fade-in" style={{ position:"relative",zIndex:1 }}>
          <div style={{ fontSize:"60px",marginBottom:"12px",animation:"heartbeat 1.5s ease-in-out infinite",display:"inline-block" }}>💝</div>
          <p style={{ fontSize:"12px",textTransform:"uppercase",letterSpacing:"0.4em",color:"#C2185B",opacity:0.8,marginBottom:"12px",fontFamily:"'Lato',sans-serif" }}>a love letter in website form</p>
          <h1 style={{ fontSize:"clamp(3rem,10vw,6rem)",fontWeight:900,lineHeight:1.1,marginBottom:"20px",fontFamily:"'Playfair Display',serif" }}>
            <span className="text-gradient">For My</span><br/>
            <span className="text-gradient-gold" style={{ fontStyle:"italic" }}>Favourite</span><br/>
            <span className="text-gradient">Person</span>
          </h1>
          <p style={{ fontSize:"1.4rem",maxWidth:"520px",margin:"0 auto 32px",lineHeight:1.6,fontFamily:"'Dancing Script',cursive",color:"#880E4F" }}>
            "Miles apart, hearts together — and yes, I googled the timezone again."
          </p>
          <div style={{ display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap" }}>
            <a href="#reasons" style={{ display:"inline-block",padding:"14px 32px",borderRadius:"30px",color:"white",fontWeight:700,fontSize:"14px",textTransform:"uppercase",letterSpacing:"2px",background:"linear-gradient(135deg,#C2185B,#E91E63)",textDecoration:"none",boxShadow:"0 8px 30px rgba(194,24,91,0.3)",transition:"transform 0.2s" }}
              onMouseEnter={e=>e.target.style.transform="scale(1.05)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}>
              Enter My Heart ↓
            </a>
            <button onClick={()=>setShowGame(true)} style={{ padding:"14px 32px",borderRadius:"30px",fontWeight:700,fontSize:"14px",textTransform:"uppercase",letterSpacing:"2px",background:"rgba(255,255,255,0.7)",border:"2px solid rgba(194,24,91,0.3)",color:"#C2185B",cursor:"pointer",backdropFilter:"blur(8px)",transition:"all 0.2s",boxShadow:"0 8px 30px rgba(194,24,91,0.1)" }}
              onMouseEnter={e=>{e.target.style.transform="scale(1.05)";e.target.style.background="rgba(255,255,255,0.9)";}} onMouseLeave={e=>{e.target.style.transform="scale(1)";e.target.style.background="rgba(255,255,255,0.7)";}}>
              🎨 Play Together
            </button>
          </div>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      <section className="section-fade" style={{ padding:"80px 16px",textAlign:"center",position:"relative",zIndex:1 }}>
        <div style={{ maxWidth:"600px",margin:"0 auto" }}>
          <p style={{ fontSize:"12px",textTransform:"uppercase",letterSpacing:"4px",color:"#C2185B",marginBottom:"8px" }}>counting every second until</p>
          <h2 className="text-gradient" style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,6vw,3.5rem)",fontWeight:900,marginBottom:"8px" }}>I See You Again</h2>
          <p style={{ marginBottom:"32px",color:"#aaa",fontFamily:"'Dancing Script',cursive",fontSize:"1.2rem",fontStyle:"italic" }}>(update the date in the code to our actual meetup 🥺)</p>
          <Countdown />
          <p style={{ marginTop:"20px",fontSize:"13px",color:"#bbb",fontStyle:"italic" }}>"Every second is one second closer to you."</p>
        </div>
      </section>

      {/* ── REASONS ── */}
      <section className="section-fade" style={{ padding:"80px 16px",position:"relative",zIndex:1 }} id="reasons">
        <div style={{ maxWidth:"1100px",margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:"48px" }}>
            <p style={{ fontSize:"12px",textTransform:"uppercase",letterSpacing:"4px",color:"#C2185B",marginBottom:"8px" }}>an incomplete list of</p>
            <h2 className="text-gradient" style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,6vw,3.5rem)",fontWeight:900 }}>Why I Love You</h2>
            <p style={{ marginTop:"8px",color:"#aaa",fontStyle:"italic",fontSize:"13px" }}>click a card to expand 🌸</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"20px" }}>
            {reasons.map((r,i) => (
              <div key={i} className="glass card-hover" onClick={()=>setClickedReason(clickedReason===i?null:i)} style={{ borderRadius:"24px",padding:"24px",cursor:"pointer",position:"relative",overflow:"hidden",border:clickedReason===i?"2px solid #C2185B":"1px solid rgba(255,183,197,0.3)",background:clickedReason===i?"rgba(255,240,245,0.9)":undefined }}>
                <div style={{ position:"absolute",top:0,right:0,width:"80px",height:"80px",borderRadius:"50%",background:"#E91E63",opacity:0.07,transform:"translate(30%,-30%)" }}/>
                <div style={{ fontSize:"2.2rem",marginBottom:"10px" }}>{r.emoji}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif",color:"#880E4F",fontSize:"1.1rem",fontWeight:700,marginBottom:"8px" }}>{r.title}</h3>
                <p style={{ color:"#7a4a4a",fontSize:"13px",lineHeight:1.6,maxHeight:clickedReason===i?"200px":"52px",overflow:"hidden",transition:"max-height 0.4s ease" }}>{r.text}</p>
                <div style={{ marginTop:"10px",fontSize:"11px",color:"#C2185B" }}>{clickedReason===i?"▲ less":"▼ more"}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAME PROMO BANNER ── */}
      <section className="section-fade" style={{ padding:"60px 16px",position:"relative",zIndex:1 }}>
        <div style={{ maxWidth:"800px",margin:"0 auto" }}>
          <div className="glass" onClick={()=>setShowGame(true)} style={{ borderRadius:"32px",padding:"40px",textAlign:"center",cursor:"pointer",border:"2px solid rgba(194,24,91,0.2)",background:"linear-gradient(135deg,rgba(255,236,245,0.8),rgba(255,248,240,0.8))",transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.boxShadow="0 20px 60px rgba(194,24,91,0.2)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="none";}}>
            <div style={{ fontSize:"52px",marginBottom:"12px",animation:"float 4s ease-in-out infinite",display:"inline-block" }}>🎨</div>
            <p style={{ fontSize:"12px",textTransform:"uppercase",letterSpacing:"4px",color:"#C2185B",marginBottom:"8px" }}>play together right now</p>
            <h2 className="text-gradient" style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.8rem,5vw,2.8rem)",fontWeight:900,marginBottom:"12px" }}>DrawTogether 💕</h2>
            <p style={{ fontFamily:"'Dancing Script',cursive",fontSize:"1.2rem",color:"#880E4F",marginBottom:"24px",maxWidth:"500px",margin:"0 auto 24px" }}>
              Real-time drawing & guessing game — one of you draws, the other guesses. First to guess scores points! 🏆
            </p>
            <div style={{ display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap",marginBottom:"20px" }}>
              {["🖌️ Draw anything","💬 Guess in chat","⏱️ 80 sec rounds","🏆 Live scoreboard"].map(f => (
                <div key={f} style={{ padding:"6px 14px",borderRadius:"20px",background:"rgba(255,255,255,0.8)",border:"1px solid rgba(194,24,91,0.2)",fontSize:"13px",color:"#5d3a3a",fontWeight:600 }}>{f}</div>
              ))}
            </div>
            <div style={{ display:"inline-block",padding:"14px 36px",borderRadius:"30px",background:"linear-gradient(135deg,#C2185B,#E91E63)",color:"white",fontWeight:700,fontSize:"15px",letterSpacing:"1px",boxShadow:"0 8px 30px rgba(194,24,91,0.3)" }}>
              Open Game Room ↗
            </div>
          </div>
        </div>
      </section>

      {/* ── LOVE LETTERS ── */}
      <section className="section-fade" style={{ padding:"80px 16px",position:"relative",zIndex:1 }}>
        <div style={{ maxWidth:"900px",margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:"48px" }}>
            <p style={{ fontSize:"12px",textTransform:"uppercase",letterSpacing:"4px",color:"#C2185B",marginBottom:"8px" }}>sealed with a kiss</p>
            <h2 className="text-gradient" style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,6vw,3.5rem)",fontWeight:900 }}>Love Letters</h2>
            <p style={{ marginTop:"8px",color:"#aaa",fontStyle:"italic",fontSize:"13px" }}>click an envelope to open 💌</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"20px" }}>
            {letters.map((l,i) => (
              <button key={i} className="glass card-hover" onClick={()=>setActiveLetter(l)} style={{ borderRadius:"24px",padding:"32px",textAlign:"center",cursor:"pointer",border:"none",background:"transparent" }}>
                <div style={{ fontSize:"3rem",marginBottom:"12px",transition:"transform 0.3s" }} onMouseEnter={e=>e.currentTarget.style.animation="wiggle 0.5s ease-in-out infinite"} onMouseLeave={e=>e.currentTarget.style.animation=""}>💌</div>
                <div style={{ fontFamily:"'Playfair Display',serif",color:"#880E4F",fontWeight:700,fontSize:"1.05rem",marginBottom:"6px" }}>{l.label}</div>
                <div style={{ fontSize:"12px",color:"#aaa",fontStyle:"italic",marginBottom:"16px" }}>{l.subject}</div>
                <div style={{ display:"inline-block",padding:"6px 18px",borderRadius:"20px",background:"linear-gradient(135deg,#C2185B,#E91E63)",color:"white",fontSize:"12px",fontWeight:700 }}>Open 💕</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FUNNY Q&A ── */}
      <section className="section-fade" style={{ padding:"80px 16px",position:"relative",zIndex:1 }}>
        <div style={{ maxWidth:"700px",margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:"48px" }}>
            <p style={{ fontSize:"12px",textTransform:"uppercase",letterSpacing:"4px",color:"#C2185B",marginBottom:"8px" }}>absolutely unserious section</p>
            <h2 className="text-gradient" style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,6vw,3.5rem)",fontWeight:900 }}>Honest Answers</h2>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:"16px" }}>
            {funnyReasons.map((item,i) => (
              <div key={i} className="glass" style={{ borderRadius:"24px",padding:"24px" }}>
                <div style={{ fontFamily:"'Playfair Display',serif",color:"#C2185B",fontWeight:700,marginBottom:"8px",fontSize:"1.05rem" }}>Q: {item.q}</div>
                <div style={{ color:"#5d3a3a",fontSize:"14px",lineHeight:1.7 }}>A: {item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMORY JAR ── */}
      <section className="section-fade" style={{ padding:"80px 16px",position:"relative",zIndex:1 }}>
        <div style={{ maxWidth:"1000px",margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:"48px" }}>
            <p style={{ fontSize:"12px",textTransform:"uppercase",letterSpacing:"4px",color:"#C2185B",marginBottom:"8px" }}>saved in my heart forever</p>
            <h2 className="text-gradient" style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,6vw,3.5rem)",fontWeight:900 }}>Our Memory Jar</h2>
            <p style={{ marginTop:"8px",color:"#aaa",fontStyle:"italic",fontSize:"13px" }}>tap each jar to reveal 🫙</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"16px" }}>
            {memories.map((m,i) => (
              <div key={i} className="glass card-hover" onClick={()=>setOpenMemory(openMemory===i?null:i)} style={{ borderRadius:"24px",padding:"20px",cursor:"pointer" }}>
                <div style={{ fontSize:"2rem",textAlign:"center",marginBottom:"8px" }}>🫙</div>
                <div style={{ textAlign:"center",fontSize:"1rem",fontFamily:"'Dancing Script',cursive",color:"#880E4F",maxHeight:openMemory===i?"150px":"24px",overflow:"hidden",transition:"max-height 0.4s ease" }}>
                  {openMemory===i?m:"✨ tap to open ✨"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOVE METER ── */}
      <section className="section-fade" style={{ padding:"80px 16px",textAlign:"center",position:"relative",zIndex:1 }}>
        <div style={{ maxWidth:"520px",margin:"0 auto" }}>
          <h2 className="text-gradient" style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,6vw,3.5rem)",fontWeight:900,marginBottom:"40px" }}>Love Meter™</h2>
          <div className="glass" style={{ borderRadius:"28px",padding:"32px" }}>
            {[["Obsession Level",99,"💀"],["Softness for You",100,"🥺"],["Sending Memes Daily",97,"😂"],["Thinking About You",100,"💭"],["Missing You",100,"🌙"]].map(([label,val,emoji]) => (
              <div key={label} style={{ marginBottom:"20px",textAlign:"left" }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"6px" }}>
                  <span style={{ fontSize:"14px",fontWeight:700,color:"#880E4F" }}>{emoji} {label}</span>
                  <span className="text-gradient" style={{ fontSize:"14px",fontWeight:700 }}>{val}%</span>
                </div>
                <div style={{ height:"10px",borderRadius:"10px",background:"#FCE4EC",overflow:"hidden" }}>
                  <div style={{ height:"100%",width:`${val}%`,borderRadius:"10px",background:"linear-gradient(135deg,#C2185B,#E91E63,#D4AF37)",transition:"width 1.5s ease" }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMISES ── */}
      <section className="section-fade" style={{ padding:"80px 16px",position:"relative",zIndex:1 }}>
        <div style={{ maxWidth:"700px",margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:"48px" }}>
            <h2 className="text-gradient" style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,6vw,3.5rem)",fontWeight:900 }}>My Promises To You</h2>
          </div>
          <div className="glass" style={{ borderRadius:"28px",padding:"40px",border:"2px solid rgba(194,24,91,0.15)",background:"rgba(255,240,245,0.7)" }}>
            {["I promise to always send you the meme even when it's 3am 📱","I promise to never make you do the timezone math alone ⏰","I promise to be your person on the days you need one 🫂","I promise to listen — really listen — every single time 💫","I promise to make you laugh, especially when it's hard to 😊","I promise to keep choosing you, every day, from every distance ❤️"].map((p,i,arr) => (
              <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:"14px",padding:"16px 0",borderBottom:i<arr.length-1?"1px dashed rgba(194,24,91,0.15)":"none" }}>
                <span style={{ fontSize:"1.1rem",marginTop:"2px" }}>💕</span>
                <p style={{ fontFamily:"'Dancing Script',cursive",fontSize:"1.15rem",color:"#5d3a3a",lineHeight:1.5 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL ── */}
      <section className="section-fade" style={{ padding:"96px 16px",textAlign:"center",position:"relative",zIndex:1 }}>
        <div style={{ maxWidth:"600px",margin:"0 auto" }}>
          <div style={{ fontSize:"5rem",marginBottom:"20px",animation:"heartbeat 1.5s ease-in-out infinite",display:"inline-block" }}>💖</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2.5rem,8vw,5rem)",fontWeight:900,lineHeight:1.1,marginBottom:"20px" }}>
            <span className="text-gradient">You're My Favourite</span><br/>
            <span className="text-gradient-gold" style={{ fontStyle:"italic" }}>Everything</span>
          </h2>
          <p style={{ fontSize:"1.4rem",marginBottom:"32px",lineHeight:1.7,fontFamily:"'Dancing Script',cursive",color:"#880E4F" }}>
            Thanks for existing. Thanks for being mine.<br/>
            <span style={{ fontSize:"1rem",color:"#bbb",fontStyle:"italic" }}>(I love you, you absolute menace to my peace of mind ❤️)</span>
          </p>
          <div style={{ display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap" }}>
            <button onClick={()=>setShowGame(true)} style={{ padding:"14px 32px",borderRadius:"30px",background:"linear-gradient(135deg,#C2185B,#E91E63)",color:"white",border:"none",fontWeight:700,fontSize:"14px",textTransform:"uppercase",letterSpacing:"2px",cursor:"pointer",boxShadow:"0 8px 30px rgba(194,24,91,0.3)",transition:"transform 0.2s" }}
              onMouseEnter={e=>e.target.style.transform="scale(1.05)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}>
              🎨 Play Together
            </button>
            <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} className="glass" style={{ padding:"14px 32px",borderRadius:"30px",color:"#C2185B",border:"2px solid rgba(194,24,91,0.3)",fontWeight:700,fontSize:"14px",textTransform:"uppercase",letterSpacing:"2px",cursor:"pointer",transition:"transform 0.2s",background:"rgba(255,255,255,0.6)" }}
              onMouseEnter={e=>e.target.style.transform="scale(1.05)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}>
              Back to Top ↑
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:"28px 16px",textAlign:"center",borderTop:"1px dashed rgba(194,24,91,0.15)",position:"relative",zIndex:1 }}>
        <p style={{ fontFamily:"'Dancing Script',cursive",fontSize:"1.1rem",color:"#C2185B" }}>Made with 💝 and zero chill · For the most beautiful person I know</p>
        <p style={{ fontSize:"12px",marginTop:"8px",color:"#ccc" }}>No hearts were harmed · Several were given away, however.</p>
      </footer>
    </div>
  );
}
