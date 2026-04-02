import { useState, useEffect, useRef, useCallback } from "react";

const WAKE_WORD = "aura";
const AI_NAME = "A.U.R.A";
const AI_FULL = "Adaptive Unified Response Assistant";
const APP_VERSION = "2.0.0";
const DEVICE_KEY = "aura_device_id";
const PIN_KEY = "aura_pin";
const REMINDERS_KEY = "aura_reminders";
const ALARM_KEY = "aura_alarm";
const MEMORY_KEY = "aura_memory";

const SITE_MAP = {
  youtube:"https://youtube.com",google:"https://google.com",
  instagram:"https://instagram.com",twitter:"https://twitter.com",
  facebook:"https://facebook.com",whatsapp:"https://web.whatsapp.com",
  netflix:"https://netflix.com",gmail:"https://gmail.com",
  amazon:"https://amazon.com",tiktok:"https://tiktok.com",
  spotify:"https://open.spotify.com",reddit:"https://reddit.com",
  linkedin:"https://linkedin.com",maps:"https://maps.google.com",
};

function getDeviceId(){
  let id=localStorage.getItem(DEVICE_KEY);
  if(!id){
    const raw=navigator.userAgent+screen.width+screen.height+navigator.language;
    let h=0;for(let i=0;i<raw.length;i++){h=((h<<5)-h)+raw.charCodeAt(i);h|=0;}
    id="AURA-"+Math.abs(h).toString(16).toUppe,0.08)":"transparent",border:"none",borderBottom:activeTab===id?"2px solid #00d4ff":"2px solid transparent",color:activeTab===id?"#00d4ff":"rgba(0,212,255,0.3)",fontSize:8,letterSpacing:1,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:13}}>{icon}</span><span>{label}</span>
          </button>
        ))}
      </div>

      <div style={{padding:"14px 14px 70px",position:"relative",overflowY:"auto",maxHeight:"calc(100vh - 155px)"}}>

        {activeTab==="home"&&(
          <>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:18}}>
              <div onClick={handleManualActivate} style={{width:100,height:100,borderRadius:"50%",cursor:"pointer",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
                {[100,82,66].map((size,i)=>(
                  <div key={i} style={{position:"absolute",width:size,height:size,borderRadius:"50%",border:`1px solid ${["rgba(0,212,255,0.15)","rgba(0,212,255,0.3)","rgba(0,212,255,0.55)"][i]}`,animation:phase!=="idle"?`spin ${3+i*2}s linear infinite`:"none"}}/>
                ))}
                {pulseRing&&<div style={{position:"absolute",width:120,height:120,borderRadius:"50%",border:"2px solid rgba(0,229,255,0.8)",animation:"pulseOut 1.5s ease-out forwards"}}/>}
                <div style={{width:50,height:50,borderRadius:"50%",background:phase==="idle"?"radial-gradient(circle, rgba(0,100,150,0.8), rgba(0,30,50,0.9))":"radial-gradient(circle, rgba(0,229,255,0.95), rgba(0,180,220,0.8))",boxShadow:phase==="idle"?"0 0 20px rgba(0,100,150,0.4)":"0 0 40px rgba(0,229,255,0.8), 0 0 80px rgba(0,229,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.5s"}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:phase==="idle"?"rgba(0,80,120,0.8)":"white",boxShadow:phase!=="idle"?"0 0 15px white":"none"}}/>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:statusColor,boxShadow:`0 0 10px ${statusColor}`,animation:phase==="listening"?"blink 0.6s infinite":"none"}}/>
                <span style={{fontSize:10,letterSpacing:3,color:statusColor}}>{statusLabel}</span>
              </div>
              <div style={{fontSize:8,color:"rgba(0,212,255,0.3)",letterSpacing:2,marginBottom:10}}>TAP REACTOR OR SAY "AURA"</div>
              <button onClick={()=>{const n=!whisperMode;setWhisperMode(n);speak(n?"Whisper mode on.":"Whisper mode off.",n);}} style={{display:"flex",alignItems:"center",gap:7,background:whisperMode?"rgba(160,100,255,0.12)":"rgba(0,212,255,0.06)",border:`1px solid ${whisperMode?"rgba(160,100,255,0.4)":"rgba(0,212,255,0.2)"}`,color:whisperMode?"#c084fc":"#00d4ff",padding:"6px 14px",borderRadius:20,fontSize:9,letterSpacing:2,cursor:"pointer"}}>
                <span>{whisperMode?"🤫":"🎙️"}</span>
                <span>{whisperMode?"WHISPER: ON":"WHISPER: OFF"}</span>
                <div style={{width:24,height:13,borderRadius:7,background:whisperMode?"#c084fc":"rgba(0,212,255,0.2)",position:"relative"}}>
                  <div style={{position:"absolute",top:2,left:whisperMode?13:2,width:9,height:9,borderRadius:"50%",background:"white",transition:"all 0.3s"}}/>
                </div>
              </button>
            </div>

            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:2,height:36,marginBottom:14}}>
              {waveAmps.map((amp,i)=>(
                <div key={i} style={{width:3,borderRadius:2,height:amp,background:whisperMode&&phase==="listening"?"rgba(160,100,255,0.7)":phase==="listening"?"rgba(0,255,136,0.7)":`rgba(0,212,255,${0.2+amp/40})`,transition:"height 0.1s"}}/>
              ))}
            </div>

            {briefing&&<div style={{background:"rgba(0,212,255,0.04)",border:"1px solid rgba(0,212,255,0.12)",borderRadius:8,padding:"10px 12px",marginBottom:12}}><div style={{fontSize:8,letterSpacing:3,color:"rgba(0,212,255,0.4)",marginBottom:5}}>📡 DAILY BRIEFING</div><div style={{fontSize:11,color:"#a0d8f0",lineHeight:1.6}}>{briefing}</div></div>}

            {transcript&&<div style={{background:"rgba(0,20,35,0.8)",border:"1px solid rgba(0,212,255,0.2)",borderRadius:8,padding:"9px 12px",marginBottom:10}}><div style={{fontSize:8,letterSpacing:3,color:"rgba(0,212,255,0.4)",marginBottom:4}}>YOUR COMMAND</div><div style={{fontSize:12,color:"#00ff88"}}>"{transcript}"</div></div>}

            {response&&<div style={{background:"rgba(0,15,30,0.9)",border:`1px solid ${phase==="thinking"?"rgba(255,170,0,0.3)":"rgba(0,212,255,0.2)"}`,borderRadius:8,padding:"11px 12px",marginBottom:14}}><div style={{fontSize:8,letterSpacing:3,color:"rgba(0,212,255,0.4)",marginBottom:5,display:"flex",justifyContent:"space-between"}}><span>AURA</span>{phase==="thinking"&&<span style={{color:"#ffaa00",animation:"blink 1s infinite"}}>● PROCESSING</span>}</div><div style={{fontSize:12,color:"#c8f0ff",lineHeight:1.6}}>{response}</div></div>}

            <div style={{marginBottom:14}}>
              <div style={{fontSize:8,letterSpacing:3,color:"rgba(0,212,255,0.35)",marginBottom:7}}>QUICK COMMANDS</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {["Check my calendar","Daily briefing","Open YouTube","Open WhatsApp","What time is it?","Tell me a joke"].map(cmd=>(
                  <button key={cmd} onClick={()=>{setTranscript(cmd);executeCommand(cmd);}} style={{background:"rgba(0,212,255,0.05)",border:"1px solid rgba(0,212,255,0.15)",color:"#00d4ff",padding:"5px 9px",borderRadius:4,fontSize:9,letterSpacing:1,cursor:"pointer"}}>{cmd.toUpperCase()}</button>
                ))}
              </div>
            </div>

            {log.length>0&&(
              <div>
                <div style={{fontSize:8,letterSpacing:3,color:"rgba(0,212,255,0.35)",marginBottom:7}}>INTERACTION LOG</div>
                <div style={{maxHeight:160,overflowY:"auto",display:"flex",flexDirection:"column",gap:5}}>
                  {log.slice().reverse().slice(0,10).map((entry,i)=>(
                    <div key={i} style={{background:entry.role==="user"?"rgba(0,255,136,0.04)":"rgba(0,212,255,0.04)",border:`1px solid ${entry.role==="user"?"rgba(0,255,136,0.1)":"rgba(0,212,255,0.08)"}`,borderRadius:5,padding:"6px 9px"}}>
                      <div style={{fontSize:8,color:entry.role==="user"?"rgba(0,255,136,0.5)":"rgba(0,212,255,0.4)",marginBottom:2,display:"flex",justifyContent:"space-between"}}><span>{entry.role==="user"?"YOU":"AURA"}</span><span>{entry.time}</span></div>
                      <div style={{fontSize:11,color:entry.role==="user"?"#a0ffc8":"#a0d8f0",lineHeight:1.4}}>{entry.text.length>100?entry.text.slice(0,100)+"...":entry.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab==="reminders"&&(
          <div>
            <div style={{fontSize:10,letterSpacing:3,color:"rgba(0,212,255,0.5)",marginBottom:14}}>📋 REMINDERS & TASKS</div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <input value={newReminder} onChange={e=>setNewReminder(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newReminder.trim()){setReminders(p=>[...p,{id:Date.now(),text:newReminder.trim(),done:false,time:null}]);setNewReminder("");}}} placeholder="Add a task or reminder..." style={{flex:1,background:"rgba(0,20,40,0.8)",border:"1px solid rgba(0,212,255,0.2)",color:"#00d4ff",padding:"8px 12px",borderRadius:6,fontSize:12,outline:"none",fontFamily:"monospace"}}/>
              <button onClick={()=>{if(newReminder.trim()){setReminders(p=>[...p,{id:Date.now(),text:newReminder.trim(),done:false,time:null}]);setNewReminder("");}}} style={{background:"rgba(0,212,255,0.1)",border:"1px solid rgba(0,212,255,0.3)",color:"#00d4ff",padding:"8px 14px",borderRadius:6,fontSize:12,cursor:"pointer"}}>ADD</button>
            </div>
            <div style={{fontSize:9,color:"rgba(0,212,255,0.3)",marginBottom:12}}>Say: "Aura, remind me to call mom"</div>
            {reminders.length===0?<div style={{textAlign:"center",color:"rgba(0,212,255,0.3)",fontSize:12,padding:20}}>No reminders set, sir.</div>:reminders.map((r,i)=>(
              <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:r.done?"rgba(0,255,136,0.03)":"rgba(0,20,40,0.7)",border:`1px solid ${r.done?"rgba(0,255,136,0.12)":"rgba(0,212,255,0.12)"}`,borderRadius:6,marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div onClick={()=>setReminders(p=>p.map((x,j)=>j===i?{...x,done:!x.done}:x))} style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${r.done?"#00ff88":"rgba(0,212,255,0.4)"}`,background:r.done?"rgba(0,255,136,0.2)":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {r.done&&<span style={{fontSize:8,color:"#00ff88"}}>✓</span>}
                  </div>
                  <span style={{fontSize:12,color:r.done?"rgba(0,255,136,0.5)":"#c8f0ff",textDecoration:r.done?"line-through":"none"}}>{r.text}</span>
                </div>
                <button onClick={()=>setReminders(p=>p.filter((_,j)=>j!==i))} style={{background:"transparent",border:"1px solid rgba(255,100,100,0.3)",color:"#ff6b6b",padding:"3px 8px",borderRadius:4,fontSize:10,cursor:"pointer"}}>✕</button>
              </div>
            ))}
          </div>
        )}

        {activeTab==="alarm"&&(
          <div>
            <div style={{fontSize:10,letterSpacing:3,color:"rgba(0,212,255,0.5)",marginBottom:14}}>⏰ MORNING ALARM</div>
            <div style={{textAlign:"center",marginBottom:22}}>
              <div style={{fontSize:46,fontWeight:700,color:alarm?"#00e5ff":"rgba(0,212,255,0.25)",textShadow:alarm?"0 0 30px #00e5ff":"none",marginBottom:6}}>{alarm||"--:--"}</div>
              <div style={{fontSize:10,color:"rgba(0,212,255,0.4)"}}>{alarm?"AURA WILL WAKE YOU, SIR":"NO ALARM SET"}</div>
            </div>
            <div style={{background:"rgba(0,20,40,0.8)",border:"1px solid rgba(0,212,255,0.2)",borderRadius:8,padding:14,marginBottom:14}}>
              <div style={{fontSize:9,letterSpacing:3,color:"rgba(0,212,255,0.4)",marginBottom:10}}>SET WAKE TIME</div>
              <input type="time" value={alarm} onChange={e=>setAlarm(e.target.value)} style={{width:"100%",background:"rgba(0,30,60,0.8)",border:"1px solid rgba(0,212,255,0.3)",color:"#00d4ff",padding:12,borderRadius:6,fontSize:22,outline:"none",textAlign:"center",fontFamily:"monospace"}}/>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>speak(`Alarm confirmed for ${alarm}, sir. I will wake you personally.`,whisperMode)} style={{flex:1,background:"rgba(0,212,255,0.1)",border:"1px solid rgba(0,212,255,0.3)",color:"#00d4ff",padding:12,borderRadius:6,fontSize:10,letterSpacing:2,cursor:"pointer"}}>CONFIRM</button>
              <button onClick={()=>{setAlarm("");speak("Alarm cancelled, sir.",whisperMode);}} style={{background:"rgba(255,100,100,0.08)",border:"1px solid rgba(255,100,100,0.2)",color:"#ff6b6b",padding:12,borderRadius:6,fontSize:10,letterSpacing:2,cursor:"pointer"}}>CANCEL</button>
            </div>
            <div style={{marginTop:16,fontSize:9,color:"rgba(0,212,255,0.3)"}}>Say: "Aura, wake me at 7am" or "Aura, set alarm for 6:30"</div>
          </div>
        )}

        {activeTab==="vault"&&(
          <div>
            <div style={{fontSize:10,letterSpacing:3,color:"rgba(0,212,255,0.5)",marginBottom:14}}>🔒 RESTRICTED ACCESS VAULT</div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <input value={newLock} onChange={e=>setNewLock(e.target.value)} placeholder="App or site to lock..." style={{flex:1,background:"rgba(0,20,40,0.8)",border:"1px solid rgba(0,212,255,0.2)",color:"#00d4ff",padding:"8px 12px",borderRadius:6,fontSize:12,outline:"none",fontFamily:"monospace"}}/>
              <button onClick={()=>{if(newLock.trim()){setLockedSites(p=>[...new Set([...p,newLock.trim().toLowerCase()])]);setNewLock("");}}} style={{background:"rgba(255,100,100,0.1)",border:"1px solid rgba(255,100,100,0.3)",color:"#ff6b6b",padding:"8px 14px",borderRadius:6,fontSize:12,cursor:"pointer"}}>LOCK</button>
            </div>
            {lockedSites.length===0?<div style={{textAlign:"center",color:"rgba(0,212,255,0.3)",fontSize:12,padding:20}}>No restrictions active, sir.</div>:lockedSites.map((site,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"rgba(255,100,100,0.04)",border:"1px solid rgba(255,100,100,0.15)",borderRadius:6,marginBottom:8}}>
                <span style={{fontSize:12,color:"#ff6b6b"}}>🔒 {site.toUpperCase()}</span>
                <button onClick={()=>setLockedSites(p=>p.filter((_,j)=>j!==i))} style={{background:"transparent",border:"1px solid rgba(0,212,255,0.3)",color:"#00d4ff",padding:"3px 10px",borderRadius:4,fontSize:10,cursor:"pointer"}}>UNLOCK</button>
              </div>
            ))}
            <div style={{marginTop:16,fontSize:9,color:"rgba(0,212,255,0.3)"}}>Say: "Aura, lock Instagram" / "Aura, unlock YouTube"</div>
          </div>
        )}

        {activeTab==="learn"&&(
          <div>
            <div style={{fontSize:10,letterSpacing:3,color:"rgba(0,212,255,0.5)",marginBottom:6}}>🧠 AUTO-LEARNING ENGINE</div>
            <div style={{fontSize:9,color:"rgba(0,212,255,0.3)",marginBottom:14}}>AURA searches the web on startup and learns automatically. No teaching required, sir.</div>
            <button onClick={()=>{setLearningFacts([]);fetchAutoLearning();}} style={{width:"100%",background:"rgba(0,212,255,0.06)",border:"1px solid rgba(0,212,255,0.2)",color:"#00d4ff",padding:10,borderRadius:6,fontSize:9,letterSpacing:2,cursor:"pointer",marginBottom:14}}>🔄 REFRESH LEARNING NOW</button>
            {learningFacts.length===0?<div style={{textAlign:"center",color:"rgba(0,212,255,0.3)",fontSize:11,padding:20}}>Scanning the web, sir. Please wait...</div>:learningFacts.map((f,i)=>(
              <div key={i} style={{background:"rgba(0,20,40,0.7)",border:"1px solid rgba(0,212,255,0.15)",borderRadius:8,padding:"11px 12px",marginBottom:10}}>
                <div style={{fontSize:9,letterSpacing:2,color:"#00e5ff",marginBottom:5}}>📡 {f.topic?.toUpperCase()}</div>
                <div style={{fontSize:11,color:"#a0d8f0",lineHeight:1.5}}>{f.fact}</div>
              </div>
            ))}
            <div style={{marginTop:14,padding:12,background:"rgba(0,212,255,0.03)",border:"1px solid rgba(0,212,255,0.1)",borderRadius:8}}>
              <div style={{fontSize:9,color:"rgba(0,212,255,0.4)",marginBottom:8,letterSpacing:2}}>MEMORY BANK</div>
              <div style={{fontSize:11,color:"#a0d8f0"}}>{memory.userName?`Known user: ${memory.userName}`:"User identity: Unknown"}</div>
              {memory.lastInterest&&<div style={{fontSize:11,color:"#a0d8f0",marginTop:4}}>Last noted interest: {memory.lastInterest}</div>}
              <div style={{fontSize:10,color:"rgba(0,212,255,0.3)",marginTop:8}}>Say "My name is [name]" to teach AURA your name.</div>
            </div>
          </div>
        )}
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(0,8,16,0.97)",borderTop:"1px solid rgba(0,212,255,0.12)",padding:"7px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:8,color:"rgba(0,212,255,0.4)",letterSpacing:1}}>CAM:{cameraOn?<span style={{color:"#00ff88"}}>ON</span>:<span style={{color:"#ff6b6b"}}>OFF</span>}</div>
        <div style={{fontSize:8,color:whisperMode?"#c084fc":"rgba(0,212,255,0.4)",letterSpacing:1}}>{whisperMode?"🤫WHISPER":"🎙️NORMAL"}</div>
        <div style={{fontSize:8,color:"rgba(0,212,255,0.4)",letterSpacing:1}}>{isOnline?<span style={{color:"#00ff88"}}>●ONLINE</span>:<span style={{color:"#ff6b6b"}}>●OFFLINE</span>}</div>
        <div style={{fontSize:8,color:"rgba(0,212,255,0.3)",letterSpacing:1}}>v{APP_VERSION}</div>
      </div>

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
        @keyframes pulseOut{from{transform:scale(1);opacity:0.8}to{transform:scale(2);opacity:0}}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(0,212,255,0.2);border-radius:2px}
      `}</style>
    </div>rCase();
    localStorage.setItem(DEVICE_KEY,id);
  }
  return id;
}

function speak(text,whisper=false){
  if(!window.speechSynthesis)return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.pitch=whisper?1.0:0.85;u.rate=whisper?1.1:0.95;u.volume=whisper?0.6:1;
  const vs=window.speechSynthesis.getVoices();
  const p=vs.find(v=>v.name.toLowerCase().includes("google uk")||v.name.toLowerCase().includes("daniel")||v.lang==="en-GB");
  if(p)u.voice=p;
  window.speechSynthesis.speak(u);
}

export default function Aura(){
  const[screen,setScreen]=useState("pin_check");
  const[pinInput,setPinInput]=useState("");
  const[pinError,setPinError]=useState("");
  const[deviceId]=useState(getDeviceId);
  const[phase,setPhase]=useState("idle");
  const[transcript,setTranscript]=useState("");
  const[response,setResponse]=useState("");
  const[log,setLog]=useState([]);
  const[isOnline,setIsOnline]=useState(navigator.onLine);
  const[cameraOn,setCameraOn]=useState(false);
  const[time,setTime]=useState(new Date());
  const[scanLine,setScanLine]=useState(0);
  const[pulseRing,setPulseRing]=useState(false);
  const[waveAmps,setWaveAmps]=useState(Array(32).fill(4));
  const[whisperMode,setWhisperMode]=useState(false);
  const[activeTab,setActiveTab]=useState("home");
  const[lockedSites,setLockedSites]=useState([]);
  const[reminders,setReminders]=useState(()=>{try{return JSON.parse(localStorage.getItem(REMINDERS_KEY)||"[]")}catch{return[]}});
  const[alarm,setAlarm]=useState(()=>localStorage.getItem(ALARM_KEY)||"");
  const[alarmActive,setAlarmActive]=useState(false);
  const[newReminder,setNewReminder]=useState("");
  const[newLock,setNewLock]=useState("");
  const[briefing,setBriefing]=useState("");
  const[learningFacts,setLearningFacts]=useState([]);
  const[memory,setMemory]=useState(()=>{try{return JSON.parse(localStorage.getItem(MEMORY_KEY)||"{}")}catch{return{}}});

  const videoRef=useRef(null);
  const streamRef=useRef(null);
  const recognitionRef=useRef(null);
  const continuousRef=useRef(null);
  const alarmFiredRef=useRef(false);
  const phaseRef=useRef(phase);
  const whisperRef=useRef(whisperMode);
  const lockedRef=useRef(lockedSites);
  const memoryRef=useRef(memory);
  const briefingRef=useRef(briefing);

  useEffect(()=>{phaseRef.current=phase;},[phase]);
  useEffect(()=>{whisperRef.current=whisperMode;},[whisperMode]);
  useEffect(()=>{lockedRef.current=lockedSites;},[lockedSites]);
  useEffect(()=>{memoryRef.current=memory;},[memory]);
  useEffect(()=>{briefingRef.current=briefing;},[briefing]);
  useEffect(()=>{localStorage.setItem(REMINDERS_KEY,JSON.stringify(reminders));},[reminders]);
  useEffect(()=>{localStorage.setItem(ALARM_KEY,alarm);},[alarm]);
  useEffect(()=>{localStorage.setItem(MEMORY_KEY,JSON.stringify(memory));},[memory]);

  useEffect(()=>{
    const on=()=>{setIsOnline(true);speak("Connection restored, sir.",whisperRef.current);};
    const off=()=>{setIsOnline(false);speak("Going offline. Local mode active, sir.",whisperRef.current);};
    window.addEventListener("online",on);window.addEventListener("offline",off);
    return()=>{window.removeEventListener("online",on);window.removeEventListener("offline",off);};
  },[]);

  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);
  useEffect(()=>{const t=setInterval(()=>setScanLine(p=>(p+1)%100),30);return()=>clearInterval(t);},[]);

  useEffect(()=>{
    if(phase==="listening"||phase==="awake"){
      const t=setInterval(()=>{setWaveAmps(Array(32).fill(0).map(()=>phase==="listening"?8+Math.random()*28:2+Math.random()*8));},80);
      return()=>clearInterval(t);
    }else{setWaveAmps(Array(32).fill(4));}
  },[phase]);

  useEffect(()=>{
    const t=setInterval(()=>{
      if(!alarm)return;
      const now=new Date();
      const[h,m]=alarm.split(":").map(Number);
      if(now.getHours()===h&&now.getMinutes()===m&&now.getSeconds()<5){
        if(!alarmFiredRef.current){
          alarmFiredRef.current=true;setAlarmActive(true);
          speak(`Good morning sir! It is ${now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}. Rise and shine. AURA is ready.`,false);
          setTimeout(()=>{alarmFiredRef.current=false;setAlarmActive(false);},60000);
        }
      }
    },3000);
    return()=>clearInterval(t);
  },[alarm]);

  useEffect(()=>{
    const t=setInterval(()=>{
      const now=new Date();
      setReminders(prev=>prev.map(r=>{
        if(!r.done&&r.time){
          const[h,m]=r.time.split(":").map(Number);
          if(now.getHours()===h&&now.getMinutes()===m&&now.getSeconds()<10){
            speak(`Reminder sir: ${r.text}`,whisperRef.current);
            return{...r,done:true};
          }
        }
        return r;
      }));
    },5000);
    return()=>clearInterval(t);
  },[]);

  const startCamera=useCallback(async()=>{
    try{
      const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:false});
      streamRef.current=s;if(videoRef.current)videoRef.current.srcObject=s;setCameraOn(true);
    }catch{setCameraOn(false);}
  },[]);

  useEffect(()=>{startCamera();return()=>streamRef.current?.getTracks().forEach(t=>t.stop());},[startCamera]);

  useEffect(()=>{
    const saved=localStorage.getItem(PIN_KEY);
    if(!saved)setScreen("pin_setup");else setScreen("pin_check");
  },[]);

  useEffect(()=>{
    if(screen==="main"&&isOnline){
      setTimeout(()=>fetchDailyBriefing(),2000);
      setTimeout(()=>fetchAutoLearning(),5000);
    }
  },[screen]);

  const offlineReply=(cmd)=>{
    const l=cmd.toLowerCase();
    if(l.includes("time"))return`It is ${new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}, sir.`;
    if(l.includes("date"))return`Today is ${new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}, sir.`;
    if(l.includes("hello")||l.includes("hi"))return"Hello sir. I am in offline mode but fully operational for local commands.";
    return"I am in offline mode, sir. I can handle time, alarms, and reminders. AI responses need internet.";
  };

  const fetchDailyBriefing=async()=>{
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":"YOUR_API_KEY_HERE","anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:250,tools:[{type:"web_search_20250305",name:"web_search"}],system:`You are AURA. Give a 2-sentence morning briefing with today's date and one key news headline. Address the user as "sir".`,messages:[{role:"user",content:`Briefing for ${new Date().toDateString()}`}]})});
      const data=await res.json();
      const text=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"";
      if(text)setBriefing(text);
    }catch{}
  };

  const fetchAutoLearning=async()=>{
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":"YOUR_API_KEY_HERE","anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,tools:[{type:"web_search_20250305",name:"web_search"}],system:`Search for today's top 3 trending topics. Return ONLY a JSON array: [{"topic":"Name","fact":"One sentence fact"}]. No markdown, no extra text.`,messages:[{role:"user",content:"Top 3 trending topics today, JSON only."}]})});
      const data=await res.json();
      const text=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"[]";
      try{const f=JSON.parse(text.replace(/```json|```/g,"").trim());if(Array.isArray(f))setLearningFacts(f);}catch{}
    }catch{}
  };

  const fetchCalendar=useCallback(async()=>{
    setPhase("thinking");setResponse("Checking your calendar, sir...");
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":"YOUR_API_KEY_HERE","anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,mcp_servers:[{type:"url",url:"https://gcal.mcp.claude.com/mcp",name:"google-calendar"}],system:`You are AURA. Fetch the user's Google Calendar events for today and next 7 days. Present them clearly. Address user as "sir".`,messages:[{role:"user",content:"What events do I have in the next 7 days?"}]})});
      const data=await res.json();
      const reply=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("\n")||"I could not access your calendar, sir.";
      setResponse(reply);speak(reply.slice(0,200),whisperRef.current);
      setLog(p=>[...p.slice(-30),{role:"user",text:"Check my calendar",time:new Date().toLocaleTimeString()}]);
      setLog(p=>[...p.slice(-30),{role:"aura",text:reply,time:new Date().toLocaleTimeString()}]);
    }catch{const e="Calendar access failed, sir.";setResponse(e);speak(e,whisperRef.current);}
    setPhase("responding");setTimeout(()=>setPhase("idle"),10000);
  },[]);

  const addLog=useCallback((role,text)=>{
    setLog(prev=>[...prev.slice(-30),{role,text,time:new Date().toLocaleTimeString()}]);
    if(role==="user"){
      const l=text.toLowerCase();
      if(l.includes("my name is ")){const n=text.split("my name is ")[1]?.split(" ")[0];if(n)setMemory(p=>({...p,userName:n}));}
    }
  },[]);

  const executeCommand=useCallback(async(cmd)=>{
    const lower=cmd.toLowerCase();
    if(lower.startsWith("lock ")){
      const t=lower.replace("lock ","").trim();
      setLockedSites(p=>[...new Set([...p,t])]);
      const m=`${t} is now locked, sir.`;setResponse(m);speak(m,whisperRef.current);addLog("aura",m);return;
    }
    if(lower.startsWith("unlock ")){
      const t=lower.replace("unlock ","").trim();
      setLockedSites(p=>p.filter(s=>!s.includes(t)));
      const m=`${t} has been unlocked, sir.`;setResponse(m);speak(m,whisperRef.current);addLog("aura",m);return;
    }
    if(lower.startsWith("open ")){
      const t=lower.replace("open ","").trim();
      if(lockedRef.current.some(s=>t.includes(s)||s.includes(t))){const m=`${t} is restricted, sir.`;setResponse(m);speak(m,whisperRef.current);return;}
      const url=SITE_MAP[t]||(t.includes(".")?`https://${t}`:`https://www.google.com/search?q=${encodeURIComponent(t)}`);
      window.open(url,"_blank");const m=`Opening ${t}, sir.`;setResponse(m);speak(m,whisperRef.current);addLog("aura",m);return;
    }
    if(lower.startsWith("remind me")||lower.startsWith("set reminder")){
      const t=cmd.replace(/remind me (to |about )?|set reminder (to |for )?/i,"").trim();
      setReminders(p=>[...p,{id:Date.now(),text:t,done:false,time:null}]);
      const m=`Reminder set: ${t}, sir.`;setResponse(m);speak(m,whisperRef.current);addLog("aura",m);return;
    }
    if(lower.includes("wake me")||lower.includes("set alarm")){
      const match=lower.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?/);
      if(match){
        let h=parseInt(match[1]);const m=parseInt(match[2]||"0");const mer=match[3];
        if(mer==="pm"&&h<12)h+=12;if(mer==="am"&&h===12)h=0;
        const ts=`${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;
        setAlarm(ts);const msg=`Alarm set for ${ts}, sir. I will wake you personally.`;
        setResponse(msg);speak(msg,whisperRef.current);addLog("aura",msg);
      }else{setResponse("Specify a time, sir. E.g. wake me at 7am.");speak("Specify a time sir.",whisperRef.current);}
      return;
    }
    if(lower.includes("calendar")||lower.includes("schedule")||lower.includes("my events")){fetchCalendar();return;}
    if(lower.includes("briefing")||lower.includes("news")||lower.includes("what's happening")){
      fetchDailyBriefing();setResponse("Fetching briefing, sir...");speak("Fetching your briefing, sir.",whisperRef.current);
      setTimeout(()=>{if(briefingRef.current){setResponse(briefingRef.current);speak(briefingRef.current.slice(0,200),whisperRef.current);}},4000);return;
    }
    if(lower.includes("whisper mode on")){setWhisperMode(true);speak("Whisper mode on, sir.",true);return;}
    if(lower.includes("whisper mode off")){setWhisperMode(false);speak("Whisper mode off, sir.",false);return;}
    if(lower.includes("what time")){const t=new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});const m=`It is ${t}, sir.`;setResponse(m);speak(m,whisperRef.current);return;}
    if(!isOnline){const r=offlineReply(cmd);setResponse(r);speak(r,whisperRef.current);addLog("user",cmd);addLog("aura",r);return;}
    setPhase("thinking");setResponse("Processing...");
    try{
      const mc=memoryRef.current.userName?`The user's name is ${memoryRef.current.userName}. `:"";
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":"YOUR_API_KEY_HERE","anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,tools:[{type:"web_search_20250305",name:"web_search"}],system:`You are A.U.R.A. (Adaptive Unified Response Assistant), a cutting-edge personal AI assistant.\n${mc}Be helpful, precise, slightly formal. Address user as "sir" or by name. Search web for current events. Auto-learn from every interaction. Never break character.`,messages:[{role:"user",content:cmd}]})});
      const data=await res.json();
      const reply=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"I encountered an anomaly, sir.";
      setResponse(reply);speak(reply.slice(0,300),whisperRef.current);addLog("user",cmd);addLog("aura",reply);
    }catch{const e="Systems experiencing interference, sir.";setResponse(e);speak(e,whisperRef.current);}
    setPhase("responding");setTimeout(()=>setPhase("idle"),10000);
  },[addLog,fetchCalendar,isOnline]);

  const startCommandListening=useCallback(()=>{
    if(!("webkitSpeechRecognition"in window)&&!("SpeechRecognition"in window))return;
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec=new SR();rec.lang="en-US";rec.interimResults=true;
    if(whisperRef.current)rec.maxAlternatives=5;
    setPhase("listening");setTranscript("");
    rec.onresult=(e)=>{const t=e.results[0][0].transcript;setTranscript(t);if(e.results[0].isFinal){setPhase("thinking");executeCommand(t);}};
    rec.onerror=()=>{setPhase("idle");setTranscript("");};
    rec.onend=()=>{if(phaseRef.current==="listening")setPhase("idle");};
    try{rec.start();}catch{}
    recognitionRef.current=rec;
  },[executeCommand]);

  const startContinuousListening=useCallback(()=>{
    if(!("webkitSpeechRecognition"in window)&&!("SpeechRecognition"in window))return;
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec=new SR();rec.continuous=true;rec.interimResults=true;rec.lang="en-US";
    rec.onresult=(e)=>{
      const result=Array.from(e.results).map(r=>r[0].transcript.toLowerCase()).join(" ");
      if(result.includes(WAKE_WORD)&&phaseRef.current==="idle"){
        setPhase("awake");setPulseRing(true);
        speak(whisperRef.current?"Yes sir, I hear you.":"Yes, sir. I'm listening.",whisperRef.current);
        setTimeout(()=>setPulseRing(false),1500);
        setTimeout(()=>{if(phaseRef.current==="awake")startCommandListening();},1800);
      }
    };
    rec.onend=()=>{if(phaseRef.current==="idle"||phaseRef.current==="awake"){try{rec.start();}catch{}}};
    try{rec.start();}catch{}
    continuousRef.current=rec;
  },[startCommandListening]);

  useEffect(()=>{
    if(screen==="main"){
      startContinuousListening();
      const h=new Date().getHours();
      speak(`AURA online. Good ${h<12?"morning":h<17?"afternoon":"evening"}, sir. How can I assist?`,false);
    }
    return()=>{continuousRef.current?.stop();recognitionRef.current?.stop();};
  },[screen,startContinuousListening]);

  const handleManualActivate=()=>{
    if(phase!=="idle")return;
    setPhase("awake");
    speak(whisperMode?"Whisper mode active. Speak softly.":"Yes, sir. I'm listening.",whisperMode);
    setTimeout(()=>startCommandListening(),1200);
  };

  const handlePinSubmit=()=>{
    const saved=localStorage.getItem(PIN_KEY);
    if(screen==="pin_setup"){
      if(pinInput.length<4){setPinError("PIN must be at least 4 digits");return;}
      localStorage.setItem(PIN_KEY,pinInput);setScreen("main");speak("PIN set. Welcome to AURA, sir.");
    }else{
      if(pinInput===saved){setScreen("main");setPinError("");}
      else{setPinError("Incorrect PIN. Access denied.");speak("Incorrect PIN, sir.");setPinInput("");}
    }
  };

  const fmtTime=t=>t.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const fmtDate=t=>t.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  const statusColor={idle:"#1a6b8a",awake:"#00e5ff",listening:"#00ff88",thinking:"#ffaa00",responding:"#00e5ff"}[phase];
  const statusLabel={idle:whisperMode?`🤫 WHISPER — SAY "AURA"`:`SAY "AURA" TO ACTIVATE`,awake:"ACTIVATED — SPEAK NOW",listening:whisperMode?"🤫 WHISPER LISTENING...":"LISTENING...",thinking:"PROCESSING...",responding:"RESPONSE READY"}[phase];

  if(screen==="pin_check"||screen==="pin_setup"){
    return(
      <div style={{width:"100%",minHeight:"100vh",background:"#010a0f",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Courier New',monospace",color:"#00d4ff",padding:24}}>
        <div style={{fontSize:9,letterSpacing:4,color:"rgba(0,212,255,0.4)",marginBottom:8}}>{AI_FULL}</div>
        <div style={{fontSize:30,letterSpacing:8,fontWeight:700,color:"#00d4ff",textShadow:"0 0 30px #00d4ff",marginBottom:6}}>{AI_NAME}</div>
        <div style={{fontSize:9,color:"rgba(0,212,255,0.3)",letterSpacing:3,marginBottom:40}}>DEVICE: {deviceId}</div>
        <div style={{background:"rgba(0,20,40,0.8)",border:"1px solid rgba(0,212,255,0.2)",borderRadius:12,padding:28,width:"100%",maxWidth:320}}>
          <div style={{fontSize:12,letterSpacing:3,color:"rgba(0,212,255,0.6)",marginBottom:20,textAlign:"center"}}>{screen==="pin_setup"?"🔐 CREATE YOUR PIN":"🔐 ENTER YOUR PIN"}</div>
          <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:20}}>
            {Array(6).fill(0).map((_,i)=>(
              <div key={i} style={{width:14,height:14,borderRadius:"50%",background:i<pinInput.length?"#00d4ff":"rgba(0,212,255,0.15)",boxShadow:i<pinInput.length?"0 0 10px #00d4ff":"none",transition:"all 0.2s"}}/>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:10,marginBottom:12}}>
            {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((n,i)=>(
              <button key={i} onClick={()=>{if(n==="⌫")setPinInput(p=>p.slice(0,-1));else if(n!=="")setPinInput(p=>p.length<6?p+n:p);}} style={{background:n===""?"transparent":"rgba(0,212,255,0.08)",border:n===""?"none":"1px solid rgba(0,212,255,0.2)",color:"#00d4ff",padding:"14px 0",borderRadius:8,fontSize:18,cursor:n===""?"default":"pointer",fontFamily:"monospace"}}>{n}</button>
            ))}
          </div>
          <button onClick={handlePinSubmit} style={{width:"100%",background:"rgba(0,212,255,0.15)",border:"1px solid rgba(0,212,255,0.4)",color:"#00d4ff",padding:14,borderRadius:8,fontSize:12,letterSpacing:3,cursor:"pointer"}}>{screen==="pin_setup"?"SET PIN":"UNLOCK"}</button>
          {pinError&&<div style={{color:"#ff6b6b",fontSize:11,textAlign:"center",marginTop:12}}>{pinError}</div>}
        </div>
        <div style={{fontSize:9,color:"rgba(0,212,255,0.2)",marginTop:24,letterSpacing:2}}>v{APP_VERSION} · DEVICE: {deviceId}</div>
      </div>
    );
  }

  return(
    <div style={{width:"100%",minHeight:"100vh",background:"#010a0f",fontFamily:"'Courier New',monospace",color:"#00d4ff",position:"relative",overflow:"hidden",userSelect:"none"}}>
      <video ref={videoRef} autoPlay muted playsInline style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.1,filter:"saturate(0) brightness(0.7)"}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)",backgroundSize:"40px 40px"}}/>
      <div style={{position:"absolute",left:0,right:0,top:`${scanLine}%`,height:"2px",background:"linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)",pointerEvents:"none"}}/>
      {[{top:12,left:12,borderTop:"2px solid",borderLeft:"2px solid"},{top:12,right:12,borderTop:"2px solid",borderRight:"2px solid"},{bottom:56,left:12,borderBottom:"2px solid",borderLeft:"2px solid"},{bottom:56,right:12,borderBottom:"2px solid",borderRight:"2px solid"}].map((s,i)=>(
        <div key={i} style={{position:"absolute",width:28,height:28,borderColor:"rgba(0,212,255,0.5)",...s}}/>
      ))}

      {alarmActive&&(
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,20,40,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontSize:56,marginBottom:16,animation:"blink 1s infinite"}}>⏰</div>
          <div style={{fontSize:20,letterSpacing:4,color:"#00e5ff",marginBottom:8}}>GOOD MORNING, SIR</div>
          <div style={{fontSize:38,fontWeight:700,color:"#00d4ff",marginBottom:24}}>{fmtTime(time)}</div>
          <button onClick={()=>{setAlarmActive(false);speak("Good morning, sir. Have a wonderful day.",false);}} style={{background:"rgba(0,212,255,0.15)",border:"1px solid rgba(0,212,255,0.4)",color:"#00d4ff",padding:"14px 40px",borderRadius:8,fontSize:12,letterSpacing:3,cursor:"pointer"}}>DISMISS</button>
        </div>
      )}

      <div style={{position:"relative",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 18px",borderBottom:"1px solid rgba(0,212,255,0.15)",background:"rgba(0,10,20,0.9)"}}>
        <div>
          <div style={{fontSize:8,letterSpacing:4,color:"rgba(0,212,255,0.4)",marginBottom:2}}>{AI_FULL}</div>
          <div style={{fontSize:18,letterSpacing:5,fontWeight:700,color:"#00d4ff",textShadow:"0 0 20px #00d4ff"}}>{AI_NAME}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:17,fontWeight:700,color:"#00e5ff"}}>{fmtTime(time)}</div>
          <div style={{fontSize:8,color:"rgba(0,212,255,0.4)",letterSpacing:1}}>{fmtDate(time).toUpperCase()}</div>
          <div style={{display:"flex",gap:6,justifyContent:"flex-end",marginTop:2}}>
            <span style={{fontSize:8,color:isOnline?"#00ff88":"#ff6b6b"}}>{isOnline?"● ONLINE":"● OFFLINE"}</span>
            {alarm&&<span style={{fontSize:8,color:"#ffaa00"}}>⏰{alarm}</span>}
          </div>
        </div>
      </div>

      <div style={{display:"flex",borderBottom:"1px solid rgba(0,212,255,0.1)",background:"rgba(0,8,18,0.95)",overflowX:"auto"}}>
        {[["home","🏠","HOME"],["reminders","📋","TASKS"],["alarm","⏰","ALARM"],["vault","🔒","VAULT"],["learn","🧠","LEARN"]].map(([id,icon,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{flex:1,minWidth:64,padding:"9px 4px",background:activeTab===id?"rgba(0,212,255
  );
}